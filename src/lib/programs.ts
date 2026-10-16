import { prisma } from '@/lib/prisma'
import type { Program } from '@/types'

// ─── Deterministic Category Accent Mapping ─────────────────────────────────────
export interface CategoryAccent {
  badgeBg: string
  badgeText: string
  badgeBorder: string
  iconBg: string
  iconColor: string
  accentColor: string
}

export function getCategoryAccent(category: string): CategoryAccent {
  const norm = category.toLowerCase().trim()

  if (norm.includes('employment') || norm.includes('economic')) {
    return {
      badgeBg: 'bg-emerald-50',
      badgeText: 'text-[#2D6A4F]',
      badgeBorder: 'border-[#2D6A4F]/20',
      iconBg: 'bg-[#E8F0E3]',
      iconColor: 'text-[#2D6A4F]',
      accentColor: '#2D6A4F',
    }
  }
  if (norm.includes('newcomer') || norm.includes('settlement')) {
    return {
      badgeBg: 'bg-sky-50',
      badgeText: 'text-[#0284C7]',
      badgeBorder: 'border-[#0284C7]/20',
      iconBg: 'bg-[#F0F9FF]',
      iconColor: 'text-[#0284C7]',
      accentColor: '#0284C7',
    }
  }
  if (norm.includes('youth')) {
    return {
      badgeBg: 'bg-pink-50',
      badgeText: 'text-[#BE185D]',
      badgeBorder: 'border-[#BE185D]/20',
      iconBg: 'bg-[#FDF2F8]',
      iconColor: 'text-[#BE185D]',
      accentColor: '#BE185D',
    }
  }
  if (norm.includes('women') || norm.includes('family')) {
    return {
      badgeBg: 'bg-purple-50',
      badgeText: 'text-[#7E22CE]',
      badgeBorder: 'border-[#7E22CE]/20',
      iconBg: 'bg-[#FAF5FF]',
      iconColor: 'text-[#7E22CE]',
      accentColor: '#7E22CE',
    }
  }
  if (norm.includes('health') || norm.includes('wellness') || norm.includes('dental')) {
    return {
      badgeBg: 'bg-teal-50',
      badgeText: 'text-[#0F766E]',
      badgeBorder: 'border-[#0F766E]/20',
      iconBg: 'bg-[#F0FDFA]',
      iconColor: 'text-[#0F766E]',
      accentColor: '#0F766E',
    }
  }
  if (norm.includes('advocacy') || norm.includes('culture') || norm.includes('community')) {
    return {
      badgeBg: 'bg-amber-50',
      badgeText: 'text-[#C2410C]',
      badgeBorder: 'border-[#C2410C]/20',
      iconBg: 'bg-[#FFFBEB]',
      iconColor: 'text-[#C2410C]',
      accentColor: '#C2410C',
    }
  }

  // Default fallback
  return {
    badgeBg: 'bg-brand-sage/40',
    badgeText: 'text-brand-navy',
    badgeBorder: 'border-border-soft',
    iconBg: 'bg-brand-cream',
    iconColor: 'text-brand-green',
    accentColor: '#2D6A4F',
  }
}

// ─── Query Layer (PostgreSQL is authoritative) ──────────────────────────────
// These functions query the real Neon database. They do NOT fall back to static
// data — a database error propagates up so the caller can handle it correctly.
// Zero records from the database is a valid result and must not be masked.

/**
 * Returns all published programs ordered by displayOrder then creation date.
 * Returns an empty array if no programs are published (zero is correct).
 * Throws if the database is unavailable so callers receive an honest error.
 */
export async function getPublishedPrograms(): Promise<Program[]> {
  const dbPrograms = await prisma.program.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
  })
  return dbPrograms as Program[]
}

/**
 * Returns featured published programs for homepage preview (up to limit).
 * Returns an empty array if no programs are published.
 * Throws if the database is unavailable.
 */
export async function getFeaturedPrograms(limit = 6): Promise<Program[]> {
  const dbPrograms = await prisma.program.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: [{ featured: 'desc' }, { displayOrder: 'asc' }, { createdAt: 'desc' }],
    take: limit,
  })
  return dbPrograms as Program[]
}

/**
 * Returns a single published program by slug.
 * Returns null if not found or not published (404-appropriate).
 * Throws if the database is unavailable.
 */
export async function getProgramBySlug(slug: string): Promise<Program | null> {
  const program = await prisma.program.findUnique({
    where: { slug },
  })

  if (!program || program.status !== 'PUBLISHED') {
    return null
  }

  return program as Program
}
