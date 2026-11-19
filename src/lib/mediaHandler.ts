// ─── Shared admin image-upload handler ──────────────────────────────────────
// Used by POST /api/admin/media/upload and the legacy per-module routes
// (gallery/image, news/image, profile/avatar) so there is ONE implementation.

import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/adminAuth'
import {
  MEDIA_PURPOSES,
  cloudinaryFailureResponse,
  isMediaPurpose,
  mediaFail,
  mediaLog,
  mediaOk,
  missingCloudinaryEnv,
  titleFromFilename,
  uploadToCloudinary,
  validateImageFile,
  type MediaPurpose,
  type UploadedAsset,
} from '@/lib/media'

export async function handleMediaUpload(req: NextRequest, route: string, forcedPurpose?: MediaPurpose) {
  const started = Date.now()

  // 1. Authentication / authorization
  const { session, error } = await requireAdminSession()
  if (error || !session) {
    mediaLog('warn', route, 'auth', { result: 'unauthenticated' })
    return mediaFail(401, 'UNAUTHENTICATED', 'Your session has expired. Please sign in again.')
  }
  if (!['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
    mediaLog('warn', route, 'auth', { result: 'forbidden', role: session.user.role })
    return mediaFail(403, 'FORBIDDEN', 'You do not have permission to upload images.')
  }

  // 2. Configuration
  const missing = missingCloudinaryEnv()
  if (missing.length > 0) {
    mediaLog('error', route, 'config', { missingEnv: missing })
    return mediaFail(503, 'MEDIA_NOT_CONFIGURED', 'Image upload service is not configured on the server.')
  }

  // 3. Parse multipart
  let form: FormData
  try {
    form = await req.formData()
  } catch (err) {
    mediaLog('warn', route, 'parse', { message: (err as Error)?.message })
    return mediaFail(400, 'INVALID_REQUEST', 'The upload could not be read. Please choose the file again.')
  }

  const purposeRaw = forcedPurpose ?? form.get('purpose')
  if (!isMediaPurpose(purposeRaw)) {
    return mediaFail(400, 'INVALID_REQUEST', 'Unknown upload type.')
  }
  const purpose: MediaPurpose = purposeRaw

  const file = form.get('file')
  if (!file || typeof file === 'string') {
    return mediaFail(400, 'NO_FILE', 'No image file was provided.')
  }

  // 4. Validate (size, MIME, extension, magic bytes)
  const checked = await validateImageFile(file, purpose, route)
  if (!checked.ok) return checked.response

  // 5. Cloudinary
  let asset: UploadedAsset
  try {
    asset = await uploadToCloudinary(checked.image.buffer, purpose, {
      publicId: purpose === 'avatar' ? session.user.id : undefined,
    })
  } catch (err) {
    return cloudinaryFailureResponse(err, route)
  }

  // 6. Database side effects
  let galleryItem: unknown = undefined
  try {
    if (purpose === 'avatar') {
      await prisma.user.update({ where: { id: session.user.id }, data: { avatarUrl: asset.url } })
    }

    if (form.get('registerInLibrary') === 'true' && purpose !== 'avatar') {
      const publish = form.get('publish') === 'true'
      const last = await prisma.galleryItem.aggregate({ _max: { displayOrder: true } })
      const title = titleFromFilename(checked.image.originalName)
      galleryItem = await prisma.galleryItem.create({
        data: {
          title: title || null,
          altText: title || null,
          imageUrl: asset.url,
          imagePublicId: asset.publicId,
          category: purpose === 'homepage' ? 'Homepage' : 'Community',
          published: publish,
          displayOrder: (last._max.displayOrder ?? 0) + 1,
        },
      })
    }
  } catch (err) {
    mediaLog('error', route, 'database', { purpose, publicId: asset.publicId, message: (err as Error)?.message })
    return mediaFail(
      500,
      'DB_SAVE_FAILED',
      'Image uploaded, but saving it to the database failed. Please try again.',
      { uploaded: { url: asset.url, publicId: asset.publicId } },
    )
  }

  mediaLog('info', route, 'done', {
    purpose,
    bytes: asset.bytes,
    folder: MEDIA_PURPOSES[purpose].folder,
    ms: Date.now() - started,
  })

  return mediaOk(
    { ...asset, purpose, folder: MEDIA_PURPOSES[purpose].folder, galleryItem },
    // Legacy flat fields for older admin clients still calling the per-module routes.
    { success: true, imageUrl: asset.url, imagePublicId: asset.publicId, avatarUrl: purpose === 'avatar' ? asset.url : undefined },
  )
}

