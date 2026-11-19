// ─── GET /api/admin/media/health ────────────────────────────────────────────
// Authenticated diagnostics: reports whether Cloudinary env vars are present
// (names only) and whether Cloudinary accepts the credentials. No secrets.

import { cloudinary, ensureCloudinaryConfig } from '@/lib/cloudinary'
import { requireAdminSession } from '@/lib/adminAuth'
import { mediaFail, mediaLog, missingCloudinaryEnv } from '@/lib/media'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const { error } = await requireAdminSession()
  if (error) return mediaFail(401, 'UNAUTHENTICATED', 'Your session has expired. Please sign in again.')

  const missing = missingCloudinaryEnv()
  if (missing.length > 0) {
    return NextResponse.json({ ok: false, configured: false, missingEnv: missing }, { status: 503 })
  }

  try {
    ensureCloudinaryConfig()
    await cloudinary.api.ping()
    return NextResponse.json({ ok: true, configured: true, cloudinary: 'reachable' })
  } catch (err) {
    const e = err as { http_code?: number; message?: string }
    mediaLog('error', 'GET /api/admin/media/health', 'ping', { httpCode: e?.http_code, message: e?.message })
    return NextResponse.json(
      { ok: false, configured: true, cloudinary: 'unreachable', httpCode: e?.http_code ?? null },
      { status: 502 },
    )
  }
}

