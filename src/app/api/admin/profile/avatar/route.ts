// ─── POST & DELETE /api/admin/profile/avatar ────────────────────────────────
// POST uses the shared media pipeline (upload → Cloudinary → User.avatarUrl).
// DELETE removes the avatar asset and clears User.avatarUrl.

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/adminAuth'
import { handleMediaUpload } from '@/lib/mediaHandler'
import { cloudinary } from '@/lib/cloudinary'
import { mediaFail, mediaLog, mediaOk } from '@/lib/media'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  return handleMediaUpload(req, 'POST /api/admin/profile/avatar', 'avatar')
}

export async function DELETE() {
  const { session, error } = await requireAdminSession()
  if (error || !session) return mediaFail(401, 'UNAUTHENTICATED', 'Your session has expired. Please sign in again.')

  try {
    await cloudinary.uploader
      .destroy(`tcip/admin-avatars/${session.user.id}`, { invalidate: true, resource_type: 'image' })
      .catch((err: Error) =>
        mediaLog('warn', 'DELETE /api/admin/profile/avatar', 'cloudinary_destroy', { message: err?.message }),
      )

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { avatarUrl: null },
      select: { id: true, name: true, email: true, avatarUrl: true, role: true },
    })
    return mediaOk({ avatarUrl: null, user }, { success: true, avatarUrl: null, user })
  } catch (err) {
    mediaLog('error', 'DELETE /api/admin/profile/avatar', 'database', { message: (err as Error)?.message })
    return mediaFail(500, 'DB_SAVE_FAILED', 'Failed to remove the profile photo. Please try again.')
  }
}
