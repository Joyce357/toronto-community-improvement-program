// ─── Homepage Content Loader (server) ───────────────────────────────────────
// Reads the admin-editable HomepageSettings record and merges it over the
// built-in defaults. Any DB / parsing failure falls back to defaults so the
// public homepage always renders.

import { prisma } from '@/lib/prisma'
import {
  DEFAULT_HOMEPAGE,
  type HomepageContent,
  type HomepageSlide,
} from '@/lib/homepage-defaults'

export { DEFAULT_HOMEPAGE }
export type { HomepageContent }

const str = (v: unknown): string => (typeof v === 'string' ? v.trim() : '')
const strArr = (v: unknown, max = 24): string[] =>
  Array.isArray(v)
    ? v.filter((x): x is string => typeof x === 'string' && x.trim() !== '').slice(0, max)
    : []

/** Only allow site-relative paths or http(s) URLs for links/images. */
export function safeUrl(v: unknown): string {
  const s = str(v)
  if (!s) return ''
  if (s.startsWith('/') && !s.startsWith('//')) return s
  if (/^https?:\/\//i.test(s)) return s
  return ''
}

/** Normalizes any stored JSON into a complete HomepageContent (blank → default). */
export function normalizeHomepageContent(raw: unknown): HomepageContent {
  const d = DEFAULT_HOMEPAGE
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>
  const hero = (r.hero ?? {}) as Record<string, unknown>
  const about = (r.about ?? {}) as Record<string, unknown>
  const founder = (r.founder ?? {}) as Record<string, unknown>
  const cta = (r.cta ?? {}) as Record<string, unknown>
  const fe = (r.featuredEvent ?? {}) as Record<string, unknown>

  const slides: HomepageSlide[] = Array.isArray(hero.slides)
    ? (hero.slides as Array<Record<string, unknown> | null>)
        .map((s) => ({ imageUrl: safeUrl(s?.imageUrl), caption: str(s?.caption) }))
        .filter((s) => s.imageUrl)
        .slice(0, 6)
    : []

  // Secondary CTA is optional: once the record has been saved, an empty label hides it.
  const savedHero = r.hero && typeof r.hero === 'object'
  const secondaryLabel = savedHero ? str(hero.secondaryLabel) : d.hero.secondaryLabel
  const secondaryHref = savedHero ? safeUrl(hero.secondaryHref) : d.hero.secondaryHref

  const feType = fe.type === 'event' || fe.type === 'story' ? fe.type : ''

  return {
    hero: {
      heading: str(hero.heading) || d.hero.heading,
      text: str(hero.text) || d.hero.text,
      primaryLabel: str(hero.primaryLabel) || d.hero.primaryLabel,
      primaryHref: safeUrl(hero.primaryHref) || d.hero.primaryHref,
      secondaryLabel: secondaryHref ? secondaryLabel : '',
      secondaryHref,
      slides,
    },
    about: {
      heading: str(about.heading) || d.about.heading,
      summary: str(about.summary) || d.about.summary,
      imageUrl: safeUrl(about.imageUrl) || d.about.imageUrl,
    },
    featuredProgramIds: strArr(r.featuredProgramIds, 8),
    featuredEvent: { type: feType, id: feType ? str(fe.id) : '' },
    founder: {
      heading: str(founder.heading) || d.founder.heading,
      name: str(founder.name) || d.founder.name,
      bio: str(founder.bio) || d.founder.bio,
      imageUrl: safeUrl(founder.imageUrl) || d.founder.imageUrl,
    },
    galleryItemIds: strArr(r.galleryItemIds, 12),
    cta: {
      heading: str(cta.heading) || d.cta.heading,
      text: str(cta.text) || d.cta.text,
      buttonLabel: str(cta.buttonLabel),
      buttonHref: safeUrl(cta.buttonHref),
    },
  }
}

export async function getHomepageContent(): Promise<HomepageContent> {
  try {
    const row = await prisma.homepageSettings.findUnique({ where: { id: 'home' } })
    return normalizeHomepageContent(row?.content)
  } catch (err) {
    console.error('[Homepage] Failed to load settings, using defaults:', (err as Error)?.message)
    return normalizeHomepageContent(null)
  }
}

/** Published programs chosen by the admin, kept in the admin-selected order. */
export async function getFeaturedPrograms(ids: string[]) {
  if (ids.length === 0) return []
  try {
    const rows = await prisma.program.findMany({
      where: { id: { in: ids }, status: 'PUBLISHED' },
    })
    return ids.map((id) => rows.find((r) => r.id === id)).filter((r): r is NonNullable<typeof r> => !!r)
  } catch {
    return []
  }
}

/** Published gallery items chosen by the admin, kept in the admin-selected order. */
export async function getFeaturedGalleryItems(ids: string[]) {
  if (ids.length === 0) return []
  try {
    const rows = await prisma.galleryItem.findMany({
      where: { id: { in: ids }, published: true },
    })
    return ids.map((id) => rows.find((r) => r.id === id)).filter((r): r is NonNullable<typeof r> => !!r)
  } catch {
    return []
  }
}

export async function getFeaturedEvent(id: string) {
  if (!id) return null
  try {
    return await prisma.event.findFirst({ where: { id, published: true } })
  } catch {
    return null
  }
}

export async function getFeaturedStory(id: string) {
  if (!id) return null
  try {
    return await prisma.newsPost.findFirst({ where: { id, published: true } })
  } catch {
    return null
  }
}

