// ─── Homepage Content Loader (server) ───────────────────────────────────────
// Reads the admin-editable HomepageSettings record and merges it over the
// built-in defaults. Any DB / parsing failure falls back to defaults so the
// public homepage always renders.

import { prisma } from '@/lib/prisma'
import {
  DEFAULT_HOMEPAGE,
  type HomepageContent,
  type HomepageSlide,
  type PeopleCardContent,
} from '@/lib/homepage-defaults'

export { DEFAULT_HOMEPAGE }
export type { HomepageContent, PeopleCardContent }

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

function normalizePeopleCard(raw: unknown, fallback: PeopleCardContent): PeopleCardContent {
  const o = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>
  return {
    heading: str(o.heading) || fallback.heading,
    subtitle: str(o.subtitle) || fallback.subtitle,
    description: str(o.description) || fallback.description,
    imageUrl: safeUrl(o.imageUrl) || fallback.imageUrl,
    imageAlt: str(o.imageAlt).slice(0, 200) || fallback.imageAlt,
  }
}

/** Normalizes any stored JSON into a complete HomepageContent (blank → default). */
export function normalizeHomepageContent(raw: unknown): HomepageContent {
  const d = DEFAULT_HOMEPAGE
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>
  const hero = (r.hero && typeof r.hero === 'object' ? r.hero : {}) as Record<string, unknown>
  const about = (r.about && typeof r.about === 'object' ? r.about : {}) as Record<string, unknown>
  const impact = (r.impact && typeof r.impact === 'object' ? r.impact : {}) as Record<string, unknown>
  const founder = (r.founder && typeof r.founder === 'object' ? r.founder : {}) as Record<string, unknown>
  const people = (r.people && typeof r.people === 'object' ? r.people : {}) as Record<string, unknown>
  const cta = (r.cta && typeof r.cta === 'object' ? r.cta : {}) as Record<string, unknown>
  const contact = (r.contact && typeof r.contact === 'object' ? r.contact : {}) as Record<string, unknown>
  const legacyFe = (r.featuredEvent && typeof r.featuredEvent === 'object' ? r.featuredEvent : {}) as Record<string, unknown>

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

  // Support both the new independent story/event IDs and the legacy combined featuredEvent field
  const featuredStoryId =
    str(r.featuredStoryId) || (legacyFe.type === 'story' ? str(legacyFe.id) : '')
  const featuredEventId =
    str(r.featuredEventId) || (legacyFe.type === 'event' ? str(legacyFe.id) : '')

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
      imageAlt: str(about.imageAlt).slice(0, 200) || d.about.imageAlt,
    },
    featuredProgramIds: strArr(r.featuredProgramIds, 8),
    impact: {
      badge: str(impact.badge) || d.impact.badge,
      heading: str(impact.heading) || d.impact.heading,
      description: str(impact.description) || d.impact.description,
      imageUrl: safeUrl(impact.imageUrl) || d.impact.imageUrl,
      imageAlt: str(impact.imageAlt).slice(0, 200) || d.impact.imageAlt,
    },
    founder: {
      heading: str(founder.heading) || d.founder.heading,
      name: str(founder.name) || d.founder.name,
      bio: str(founder.bio) || d.founder.bio,
      imageUrl: safeUrl(founder.imageUrl) || d.founder.imageUrl,
      imageAlt: str(founder.imageAlt).slice(0, 200) || d.founder.imageAlt,
    },
    people: {
      volunteers: normalizePeopleCard(people.volunteers, d.people.volunteers),
      advocates: normalizePeopleCard(people.advocates, d.people.advocates),
    },
    galleryItemIds: strArr(r.galleryItemIds, 12),
    featuredStoryId,
    featuredEventId,
    cta: {
      heading: str(cta.heading) || d.cta.heading,
      text: str(cta.text) || d.cta.text,
      buttonLabel: str(cta.buttonLabel),
      buttonHref: safeUrl(cta.buttonHref),
    },
    contact: {
      imageUrl: safeUrl(contact.imageUrl) || d.contact.imageUrl,
      imageAlt: str(contact.imageAlt).slice(0, 200) || d.contact.imageAlt,
      caption: str(contact.caption) || d.contact.caption,
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

/**
 * Published programs for the homepage:
 *  - If admin selected specific IDs, returns those published programs in admin order.
 *  - Otherwise, automatically uses up to 4 published programs from the database
 *    (featured first, then displayOrder), falling back to [] only when none exist.
 */
export async function getFeaturedPrograms(ids: string[]) {
  try {
    if (ids.length > 0) {
      const rows = await prisma.program.findMany({
        where: { id: { in: ids }, status: 'PUBLISHED' },
      })
      return ids
        .map((id) => rows.find((r) => r.id === id))
        .filter((r): r is NonNullable<typeof r> => !!r)
    }
    return await prisma.program.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: [{ featured: 'desc' }, { displayOrder: 'asc' }, { createdAt: 'desc' }],
      take: 4,
    })
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

/** Returns up to 2 published events for the homepage (admin-selected event first). */
export async function getHomepageEvents(featuredEventId: string) {
  try {
    const picked = featuredEventId
      ? await prisma.event.findFirst({ where: { id: featuredEventId, published: true } })
      : null
    const others = await prisma.event.findMany({
      where: {
        published: true,
        ...(picked ? { id: { not: picked.id } } : {}),
      },
      orderBy: [{ featured: 'desc' }, { date: 'asc' }],
      take: picked ? 1 : 2,
    })
    return picked ? [picked, ...others] : others
  } catch {
    return []
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
