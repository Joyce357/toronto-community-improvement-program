// ─── Admin: Partners ─────────────────────────────────────────────────────────
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import PartnersManager from '@/components/admin/PartnersManager'
import type { Metadata } from 'next'
import type { Partner } from '@/types'

export const metadata: Metadata = { title: 'Partners | TCIP Admin' }

export default async function AdminPartnersPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  let partners: Partner[] = []
  let total = 0
  let dbError = false

  try {
    const [dbPartners, count] = await Promise.all([
      prisma.partner.findMany({
        orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
        take: 100,
      }),
      prisma.partner.count(),
    ])
    partners = dbPartners as Partner[]
    total = count
  } catch (err) {
    console.error('[Admin Partners Page] DB query failed:', (err as Error)?.message)
    dbError = true
  }

  if (dbError) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-gray-200">
        <p className="text-red-600 font-semibold mb-2">Database temporarily unavailable</p>
        <p className="text-sm text-gray-500">
          Could not load partners. Please verify database connectivity.
        </p>
      </div>
    )
  }

  return (
    <PartnersManager
      initialPartners={partners}
      totalCount={total}
    />
  )
}
