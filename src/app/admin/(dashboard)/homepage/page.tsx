// ─── Admin: Home Page Editor ────────────────────────────────────────────────
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { getHomepageContent } from '@/lib/homepage'
import HomepageManager from '@/components/admin/HomepageManager'

export const metadata: Metadata = { title: 'Home Page | Admin Dashboard' }
export const dynamic = 'force-dynamic'

export default async function AdminHomepagePage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const [content, programs, events, stories, gallery] = await Promise.all([
    getHomepageContent(),
    prisma.program.findMany({
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
      select: { id: true, title: true, status: true, imageUrl: true },
    }),
    prisma.event.findMany({
      orderBy: { date: 'desc' },
      take: 100,
      select: { id: true, title: true, published: true, featuredImage: true },
    }),
    prisma.newsPost.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: { id: true, title: true, published: true, featuredImage: true },
    }),
    prisma.galleryItem.findMany({
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
      take: 200,
      select: { id: true, title: true, imageUrl: true, published: true },
    }),
  ])

  return (
    <HomepageManager
      initialContent={content}
      programs={programs.map((p) => ({
        id: p.id,
        title: p.title,
        live: p.status === 'PUBLISHED',
        imageUrl: p.imageUrl,
      }))}
      events={events.map((e) => ({
        id: e.id,
        title: e.title,
        live: e.published,
        imageUrl: e.featuredImage,
      }))}
      stories={stories.map((s) => ({
        id: s.id,
        title: s.title,
        live: s.published,
        imageUrl: s.featuredImage,
      }))}
      gallery={gallery.map((g) => ({
        id: g.id,
        title: g.title || 'Untitled photo',
        imageUrl: g.imageUrl,
        live: g.published,
      }))}
    />
  )
}
