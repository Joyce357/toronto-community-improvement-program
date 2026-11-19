// ─── Media Service (server-only) ─────────────────────────────────────────────
// ONE shared pipeline for every admin image upload:
//   auth → parse multipart → validate (size / MIME / extension / magic bytes)
//   → Cloudinary upload (in-memory stream, no filesystem) → optional DB record.
// The Cloudinary API secret never leaves the server.

import { NextResponse } from 'next/server'
import type { UploadApiResponse } from 'cloudinary'
import { cloudinary } from '@/lib/cloudinary'
import { prisma } from '@/lib/prisma'

// ── Purposes, folders and limits ────────────────────────────────────────────

export type MediaPurpose =
  | 'gallery'
  | 'homepage'
  | 'programs'
  | 'events'
  | 'news'
  | 'partners'
  | 'avatar'

const MB = 1024 * 1024

interface PurposeConfig {
  folder: string
  maxBytes: number
  transformation: Record<string, unknown>[]
}

/**
 * Limits: gallery 8 MB, avatar 3 MB, every other content image 8 MB
 * (homepage, programs, events, news, partners).
 */
export const MEDIA_PURPOSES: Record<MediaPurpose, PurposeConfig> = {
  gallery:  { folder: 'tcip/gallery',       maxBytes: 8 * MB, transformation: [{ width: 1920, height: 1080, crop: 'limit', quality: 'auto', fetch_format: 'auto' }] },
  homepage: { folder: 'tcip/homepage',      maxBytes: 8 * MB, transformation: [{ width: 2000, height: 2000, crop: 'limit', quality: 'auto', fetch_format: 'auto' }] },
  programs: { folder: 'tcip/programs',      maxBytes: 8 * MB, transformation: [{ width: 1920, height: 1080, crop: 'limit', quality: 'auto', fetch_format: 'auto' }] },
  events:   { folder: 'tcip/events',        maxBytes: 8 * MB, transformation: [{ width: 1920, height: 1080, crop: 'limit', quality: 'auto', fetch_format: 'auto' }] },
  news:     { folder: 'tcip/news',          maxBytes: 8 * MB, transformation: [{ width: 1920, height: 1080, crop: 'limit', quality: 'auto', fetch_format: 'auto' }] },
  partners: { folder: 'tcip/partners',      maxBytes: 8 * MB, transformation: [{ width: 1000, height: 1000, crop: 'limit', quality: 'auto', fetch_format: 'auto' }] },
  avatar:   { folder: 'tcip/admin-avatars', maxBytes: 3 * MB, transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'auto', quality: 'auto', fetch_format: 'auto' }] },
}

export function isMediaPurpose(v: unknown): v is MediaPurpose {
  return typeof v === 'string' && v in MEDIA_PURPOSES
}

export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp']

// ── Consistent JSON responses ───────────────────────────────────────────────

export type MediaErrorCode =
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN'
  | 'INVALID_REQUEST'
  | 'NO_FILE'
  | 'EMPTY_FILE'
  | 'FILE_TOO_LARGE'
  | 'UNSUPPORTED_TYPE'
  | 'MALFORMED_IMAGE'
  | 'MEDIA_NOT_CONFIGURED'
  | 'UPLOAD_SERVICE_UNAVAILABLE'
  | 'UPLOAD_FAILED'
  | 'DB_SAVE_FAILED'

export function mediaFail(status: number, code: MediaErrorCode, message: string, extra?: Record<string, unknown>) {
  return NextResponse.json({ ok: false, error: { code, message }, ...extra }, { status })
}

export function mediaOk<T extends Record<string, unknown>>(data: T, legacy?: Record<string, unknown>) {
  return NextResponse.json({ ok: true, data, ...legacy })
}

/** Safe, structured server log line. Never pass secrets into `detail`. */
export function mediaLog(
  level: 'info' | 'warn' | 'error',
  route: string,
  stage: string,
  detail: Record<string, unknown> = {},
) {
  const line = `[media] route=${route} stage=${stage} ${JSON.stringify(detail)}`
  if (level === 'error') console.error(line)
  else if (level === 'warn') console.warn(line)
  else console.info(line)
}

// ── Validation ──────────────────────────────────────────────────────────────

/** Detects the real image type from the first bytes (defeats MIME spoofing). */
export function sniffImageType(buf: Buffer): (typeof ALLOWED_MIME_TYPES)[number] | null {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg'
  if (
    buf.length >= 8 &&
    buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47 &&
    buf[4] === 0x0d && buf[5] === 0x0a && buf[6] === 0x1a && buf[7] === 0x0a
  ) return 'image/png'
  if (
    buf.length >= 12 &&
    buf.toString('ascii', 0, 4) === 'RIFF' &&
    buf.toString('ascii', 8, 12) === 'WEBP'
  ) return 'image/webp'
  return null
}

/** Strips path parts / control characters from a client filename (display only). */
export function safeDisplayName(name: string): string {
  const base = name.split(/[\\/]/).pop() || 'image'
  return base.replace(/[^\w.\- ]+/g, '').slice(0, 120) || 'image'
}

export function titleFromFilename(name: string): string {
  return safeDisplayName(name).replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ').trim().slice(0, 150)
}

export interface ValidatedImage {
  buffer: Buffer
  mime: (typeof ALLOWED_MIME_TYPES)[number]
  originalName: string
}

export type ValidationResult =
  | { ok: true; image: ValidatedImage }
  | { ok: false; response: NextResponse }

export async function validateImageFile(file: File, purpose: MediaPurpose, route: string): Promise<ValidationResult> {
  const { maxBytes } = MEDIA_PURPOSES[purpose]
  const limitMb = Math.round(maxBytes / MB)

  if (file.size === 0) {
    return { ok: false, response: mediaFail(400, 'EMPTY_FILE', 'The selected file is empty.') }
  }
  if (file.size > maxBytes) {
    mediaLog('warn', route, 'validate', { reason: 'too_large', bytes: file.size, purpose })
    return { ok: false, response: mediaFail(413, 'FILE_TOO_LARGE', `File is larger than ${limitMb} MB.`) }
  }

  const ext = (file.name.split('.').pop() || '').toLowerCase()
  const mimeOk = (ALLOWED_MIME_TYPES as readonly string[]).includes(file.type)
  const extOk = ext === '' || ALLOWED_EXTENSIONS.includes(ext)
  if (!mimeOk || !extOk) {
    mediaLog('warn', route, 'validate', { reason: 'bad_type', mime: file.type, ext })
    return { ok: false, response: mediaFail(415, 'UNSUPPORTED_TYPE', 'Unsupported image type. Use JPEG, PNG or WebP.') }
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const sniffed = sniffImageType(buffer)
  if (!sniffed) {
    mediaLog('warn', route, 'validate', { reason: 'magic_bytes_mismatch', claimed: file.type })
    return { ok: false, response: mediaFail(415, 'MALFORMED_IMAGE', 'This file is not a valid JPEG, PNG or WebP image.') }
  }

  return { ok: true, image: { buffer, mime: sniffed, originalName: safeDisplayName(file.name) } }
}

// ── Cloudinary ──────────────────────────────────────────────────────────────

export function missingCloudinaryEnv(): string[] {
  return ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'].filter(
    (k) => !process.env[k],
  )
}

export class MediaUploadError extends Error {
  constructor(public httpCode: number, message: string, public cloudinaryCode?: string) {
    super(message)
  }
}

export interface UploadedAsset {
  url: string
  publicId: string
  width: number
  height: number
  bytes: number
  format: string
}

/**
 * Uploads an in-memory buffer to Cloudinary (no temp files, no /public writes).
 * Pass `publicId` (without folder) for deterministic overwrite (avatars).
 */
export function uploadToCloudinary(
  buffer: Buffer,
  purpose: MediaPurpose,
  opts: { publicId?: string } = {},
): Promise<UploadedAsset> {
  // Ensure fresh, trimmed runtime credentials (safe against trailing whitespace in host env vars)
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
    api_key:    process.env.CLOUDINARY_API_KEY?.trim(),
    api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
    secure:     true,
  })
  const cfg = MEDIA_PURPOSES[purpose]
  return new Promise((resolve, reject) => {
    const options: Record<string, unknown> = {
      folder: cfg.folder,
      resource_type: 'image',
      transformation: cfg.transformation,
      timeout: 60_000,
    }
    if (opts.publicId) {
      options.public_id = opts.publicId
      options.overwrite = true
      options.invalidate = true
    }

    const stream = cloudinary.uploader.upload_stream(options, (error, result?: UploadApiResponse) => {
      if (error || !result) {
        const e = error as { http_code?: number; message?: string; name?: string } | undefined
        return reject(new MediaUploadError(e?.http_code ?? 0, e?.message || 'Cloudinary upload failed', e?.name))
      }
      resolve({
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        bytes: result.bytes,
        format: result.format,
      })
    })
    stream.end(buffer)
  })
}

/** Maps a Cloudinary failure to a user-safe response (details are logged, not returned). */
export function cloudinaryFailureResponse(err: unknown, route: string) {
  const e = err as MediaUploadError
  mediaLog('error', route, 'cloudinary', {
    httpCode: e?.httpCode,
    code: e?.cloudinaryCode,
    message: e?.message,
  })
  return mediaFail(
    502,
    'UPLOAD_SERVICE_UNAVAILABLE',
    'Image upload service is temporarily unavailable. Please try again in a moment.',
  )
}

// ── Reference safety (never delete an asset that something still uses) ──────

export async function isImageReferenced(
  ref: { url?: string | null; publicId?: string | null },
  exclude: { galleryItemId?: string; newsPostId?: string } = {},
): Promise<boolean> {
  const { url, publicId } = ref
  if (!url && !publicId) return false

  const or = <T extends string>(field: T, extra?: string) => {
    const list: Record<string, string>[] = []
    if (url) list.push({ [field]: url })
    if (extra && publicId) list.push({ [extra]: publicId })
    return list
  }

  const [gallery, news, program, event, partner, user, home] = await Promise.all([
    prisma.galleryItem.count({
      where: { OR: or('imageUrl', 'imagePublicId'), ...(exclude.galleryItemId && { id: { not: exclude.galleryItemId } }) },
    }),
    prisma.newsPost.count({
      where: { OR: or('featuredImage', 'imagePublicId'), ...(exclude.newsPostId && { id: { not: exclude.newsPostId } }) },
    }),
    url ? prisma.program.count({ where: { imageUrl: url } }) : 0,
    url ? prisma.event.count({ where: { featuredImage: url } }) : 0,
    url ? prisma.partner.count({ where: { logoUrl: url } }) : 0,
    url ? prisma.user.count({ where: { avatarUrl: url } }) : 0,
    url ? prisma.homepageSettings.findUnique({ where: { id: 'home' } }) : null,
  ])

  if (gallery + news + program + event + partner + user > 0) return true
  if (home && url && JSON.stringify(home.content).includes(url)) return true
  return false
}

/** Deletes a Cloudinary asset only when nothing else references it. Never throws. */
export async function deleteImageIfUnreferenced(
  ref: { url?: string | null; publicId?: string | null },
  exclude: { galleryItemId?: string; newsPostId?: string } = {},
): Promise<'deleted' | 'kept' | 'failed'> {
  if (!ref.publicId) return 'kept'
  try {
    if (await isImageReferenced(ref, exclude)) {
      mediaLog('info', 'cleanup', 'skip_delete_still_referenced', { publicId: ref.publicId })
      return 'kept'
    }
    const r = await cloudinary.uploader.destroy(ref.publicId, { invalidate: true, resource_type: 'image' })
    return r.result === 'ok' || r.result === 'not found' ? 'deleted' : 'failed'
  } catch (err) {
    mediaLog('error', 'cleanup', 'destroy', { publicId: ref.publicId, message: (err as Error)?.message })
    return 'failed'
  }
}

