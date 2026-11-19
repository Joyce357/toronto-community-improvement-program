// ─── GET, PATCH, DELETE /api/admin/partners/[id] ──────────────────────────
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/adminAuth'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { error } = await requireAdminSession()
  if (error) return error

  const { id } = await params
  try {
    const partner = await prisma.partner.findUnique({ where: { id } })
    if (!partner) {
      return NextResponse.json({ error: 'Partner not found.' }, { status: 404 })
    }
    return NextResponse.json({ partner })
  } catch (err) {
    console.error('[Admin Partner GET ID] Error:', err)
    return NextResponse.json({ error: 'Failed to fetch partner.' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const { error } = await requireAdminSession()
  if (error) return error

  const { id } = await params
  try {
    const body = await req.json()
    const partner = await prisma.partner.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.logoUrl !== undefined && { logoUrl: body.logoUrl || null }),
        ...(body.websiteUrl !== undefined && { websiteUrl: body.websiteUrl || null }),
        ...(body.description !== undefined && { description: body.description || null }),
        ...(body.displayOrder !== undefined && { displayOrder: Number(body.displayOrder) }),
        ...(body.published !== undefined && { published: Boolean(body.published) }),
      },
    })
    return NextResponse.json({ partner })
  } catch (err) {
    console.error('[Admin Partner PATCH ID] Error:', err)
    return NextResponse.json({ error: 'Failed to update partner.' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const { error } = await requireAdminSession()
  if (error) return error

  const { id } = await params
  try {
    await prisma.partner.delete({ where: { id } })
    revalidatePath('/')
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[Admin Partner DELETE ID] Error:', err)
    return NextResponse.json({ error: 'Failed to delete partner.' }, { status: 500 })
  }
}
