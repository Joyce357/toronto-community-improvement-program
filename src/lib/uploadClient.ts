// ─── Browser-side upload client (shared by every admin image field) ─────────
// Same-origin RELATIVE request to /api/admin/media/upload — never an absolute
// URL built from NEXT_PUBLIC_SITE_URL. Validates first, downsizes very large
// photos before sending (keeps requests small for proxies), reports progress,
// and turns every failure mode into a specific, user-safe message.

export type UploadPurpose =
  | 'gallery' | 'homepage' | 'programs' | 'events' | 'news' | 'partners' | 'avatar'

const MB = 1024 * 1024
export const UPLOAD_LIMITS_MB: Record<UploadPurpose, number> = {
  gallery: 8, homepage: 8, programs: 8, events: 8, news: 8, partners: 8, avatar: 3,
}

export const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const ACCEPT_ATTR = 'image/jpeg,image/png,image/webp'

export interface UploadedMedia {
  url: string
  publicId: string
  width?: number
  height?: number
  bytes?: number
  galleryItem?: { id: string; title: string | null; imageUrl: string; published: boolean } | null
}

export type UploadOutcome =
  | { ok: true; media: UploadedMedia }
  | { ok: false; code: string; message: string }

export interface UploadOptions {
  onProgress?: (percent: number) => void
  /** Also create a Gallery (media library) record for the image. */
  registerInLibrary?: boolean
  /** With registerInLibrary: make that record public. */
  publish?: boolean
}

export function validateImageClient(file: File, purpose: UploadPurpose): string | null {
  const limit = UPLOAD_LIMITS_MB[purpose]
  if (file.size === 0) return 'The selected file is empty.'
  const ext = (file.name.split('.').pop() || '').toLowerCase()
  if (!ACCEPTED_TYPES.includes(file.type) || !['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
    return 'Unsupported image type. Use JPEG, PNG or WebP.'
  }
  if (file.size > limit * MB) return `File is larger than ${limit} MB.`
  return null
}

/** Downsizes big images (longest side ≤ 2400px, WebP ~0.86). Falls back to the original. */
async function prepareFile(file: File): Promise<File> {
  if (file.size <= 1.5 * MB || typeof createImageBitmap !== 'function') return file
  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, 2400 / Math.max(bitmap.width, bitmap.height))
    const w = Math.max(1, Math.round(bitmap.width * scale))
    const h = Math.max(1, Math.round(bitmap.height * scale))
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) return file
    ctx.drawImage(bitmap, 0, 0, w, h)
    bitmap.close?.()
    const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, 'image/webp', 0.86))
    if (!blob || blob.type !== 'image/webp' || blob.size >= file.size) return file
    const base = file.name.replace(/\.[^/.]+$/, '') || 'image'
    return new File([blob], `${base}.webp`, { type: 'image/webp' })
  } catch {
    return file
  }
}

interface ApiBody {
  ok?: boolean
  data?: UploadedMedia & { galleryItem?: UploadedMedia['galleryItem'] }
  error?: { code?: string; message?: string } | string
  code?: string
}

function messageForStatus(status: number): { code: string; message: string } {
  if (status === 0) return { code: 'NETWORK', message: 'Could not reach the server. Check your internet connection and try again.' }
  if (status === 401 || status === 403 || status === 307 || status === 302)
    return { code: 'UNAUTHENTICATED', message: 'Your session has expired. Please sign in again.' }
  if (status === 413) return { code: 'FILE_TOO_LARGE', message: 'The file is too large for the server to accept. Choose a smaller image.' }
  if (status === 415) return { code: 'UNSUPPORTED_TYPE', message: 'Unsupported image type. Use JPEG, PNG or WebP.' }
  if (status === 502 || status === 503 || status === 504)
    return { code: 'UPLOAD_SERVICE_UNAVAILABLE', message: 'Image upload service is temporarily unavailable. Please try again in a moment.' }
  return { code: 'UPLOAD_FAILED', message: `Upload failed (server responded ${status}). Please try again.` }
}

export async function uploadImage(
  original: File,
  purpose: UploadPurpose,
  opts: UploadOptions = {},
): Promise<UploadOutcome> {
  const problem = validateImageClient(original, purpose)
  if (problem) return { ok: false, code: 'INVALID_FILE', message: problem }

  const file = await prepareFile(original)

  const form = new FormData()
  form.append('file', file, file.name)
  form.append('purpose', purpose)
  if (opts.registerInLibrary) form.append('registerInLibrary', 'true')
  if (opts.publish) form.append('publish', 'true')

  return new Promise<UploadOutcome>((resolve) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/api/admin/media/upload') // same-origin, relative
    xhr.timeout = 120_000
    xhr.responseType = 'text'
    xhr.withCredentials = true

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) opts.onProgress?.(Math.min(99, Math.round((e.loaded / e.total) * 100)))
    }
    xhr.onerror = () => resolve({ ok: false, ...messageForStatus(0) })
    xhr.ontimeout = () =>
      resolve({ ok: false, code: 'TIMEOUT', message: 'The upload took too long. Try a smaller image or a faster connection.' })
    xhr.onload = () => {
      let body: ApiBody | null = null
      const ct = xhr.getResponseHeader('content-type') || ''
      if (ct.includes('application/json')) {
        try { body = JSON.parse(xhr.responseText) as ApiBody } catch { body = null }
      }
      // Redirected to the login page (HTML) → session problem
      if (xhr.responseURL && xhr.responseURL.includes('/admin/login')) {
        return resolve({ ok: false, ...messageForStatus(401) })
      }
      if (xhr.status >= 200 && xhr.status < 300 && body?.ok && body.data?.url) {
        opts.onProgress?.(100)
        return resolve({
          ok: true,
          media: {
            url: body.data.url,
            publicId: body.data.publicId,
            width: body.data.width,
            height: body.data.height,
            bytes: body.data.bytes,
            galleryItem: body.data.galleryItem ?? null,
          },
        })
      }
      if (typeof body?.error === 'string') {
        return resolve({ ok: false, code: body.code || 'UPLOAD_FAILED', message: body.error })
      }
      if (body?.error && typeof body.error === 'object' && body.error.message) {
        return resolve({ ok: false, code: body.error.code || 'UPLOAD_FAILED', message: body.error.message })
      }
      // Non-JSON / unexpected response (e.g. proxy error page)
      resolve({ ok: false, ...messageForStatus(xhr.status) })
    }

    xhr.send(form)
  })
}
