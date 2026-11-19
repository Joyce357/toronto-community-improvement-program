// ─── POST & DELETE /api/admin/gallery/image ─────────────────────────────────
// Legacy-compatible wrapper around the shared media pipeline
// (see src/lib/mediaHandler.ts and /api/admin/media/upload).

import { NextRequest } from 'next/server'
import { requireAdminSession } from '@/lib/adminAuth'
import { handleMediaUpload } from '@/lib/mediaHandler'
import { deleteImageIfUnreferenced, mediaFail, mediaOk } from '@/lib/media'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  return handleMediaUpload(req, 'POST /api/admin/gallery/image', 'gallery')
}

export async function DELETE(req: NextRequest) {
  const { error } = await requireAdminSession()
  if (error) return mediaFail(401, 'UNAUTHENTICATED', 'Your session has expired. Please sign in again.')

  let publicId: unknown
  try {
    publicId = (await req.json())?.publicId
  } catch {
    return mediaFail(400, 'INVALID_REQUEST', 'Invalid request.')
  }
  if (typeof publicId !== 'string' || !publicId.startsWith('tcip/')) {
    return mediaFail(403, 'FORBIDDEN', 'Invalid TCIP asset ID.')
  }

  const result = await deleteImageIfUnreferenced({ publicId })
  return mediaOk({ result }, { success: result !== 'failed' })
}
