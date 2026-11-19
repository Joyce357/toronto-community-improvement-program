// ─── POST /api/admin/media/upload ───────────────────────────────────────────
// The single authenticated image-upload endpoint for all admin modules.
// multipart/form-data: file (required), purpose (required),
// registerInLibrary ("true" → also create a GalleryItem), publish ("true").

import type { NextRequest } from 'next/server'
import { handleMediaUpload } from '@/lib/mediaHandler'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  return handleMediaUpload(req, 'POST /api/admin/media/upload')
}

