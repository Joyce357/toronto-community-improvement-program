// ─── GET & POST /api/admin/partners ─────────────────────────────────────────
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/adminAuth'
import { partnerSchema, formatZodErrors } from '@/lib/validations'

export async function GET(req: NextRequest) {
  const { error } = await requireAdminSession()
  if (error) return error

  try {
    const { searchParams } = new URL(req.url)
    const limitParam = searchParams.get('limit')
    const take = limitParam ? Math.min(100, Math.max(1, Number(limitParam))) : 100

    const [partners, total] = await Promise.all([
      prisma.partner.findMany({
        orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
        take,
      }),
      prisma.partner.count(),
    ])

    return NextResponse.json({ partners, total })
  } catch (err) {
    console.error('[Admin Partners GET] Error:', err)
    return NextResponse.json({ error: 'Failed to load partners.' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdminSession()
  if (error) return error

  try {
    const body = await req.json()
    const result = partnerSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', errors: formatZodErrors(result.error) },
        { status: 422 },
      )
    }

    const partner = await prisma.partner.create({
      data: {
        name: result.data.name,
        logoUrl: result.data.logoUrl || null,
        websiteUrl: result.data.websiteUrl || null,
        description: result.data.description || null,
        displayOrder: result.data.displayOrder ?? 0,
        published: result.data.published ?? true,
      },
    })

    return NextResponse.json({ partner }, { status: 201 })
  } catch (err) {
    console.error('[Admin Partners POST] Error:', err)
    return NextResponse.json({ error: 'Failed to create partner.' }, { status: 500 })
  }
}
