// ─── /api/admin/homepage ────────────────────────────────────────────────────
// GET: current homepage content (merged with defaults).
// PUT: save homepage content. Admin session required.

import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/adminAuth'
import { getHomepageContent, normalizeHomepageContent } from '@/lib/homepage'

export async function GET() {
  const { error } = await requireAdminSession()
  if (error) return error
  return NextResponse.json({ content: await getHomepageContent() })
}

export async function PUT(req: NextRequest) {
  const { error } = await requireAdminSession()
  if (error) return error

  try {
    const raw = await req.text()
    if (raw.length > 50_000) {
      return NextResponse.json({ error: 'Payload too large.' }, { status: 413 })
    }
    const body = JSON.parse(raw)
    const content = normalizeHomepageContent(body?.content ?? body)

    await prisma.homepageSettings.upsert({
      where: { id: 'home' },
      update: { content: content as unknown as object },
      create: { id: 'home', content: content as unknown as object },
    })

    revalidatePath('/')
    return NextResponse.json({ success: true, content })
  } catch (err) {
    console.error('[Admin Homepage PUT] Error:', err)
    return NextResponse.json({ error: 'Failed to save homepage content.' }, { status: 500 })
  }
}

