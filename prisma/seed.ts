// ─── TCIP Idempotent Seed ───────────────────────────────────────────────────
// Safe to run repeatedly. Creates only:
//   1. The singleton SiteSettings record (id = "site") — never overwritten if it exists.
//   2. The admin user, ONLY if ADMIN_EMAIL and ADMIN_INITIAL_PASSWORD are both set.
//      An existing user is never modified (password is not reset).
// It does NOT create Programs, Events, News, Gallery, Partners, or any submissions.
// Never prints passwords, hashes, or connection strings.
//
// Run: npm run db:seed

import './load-env'
import bcrypt from 'bcryptjs'
import { prisma } from '../src/lib/prisma'
import { DEFAULT_SITE_SETTINGS } from '../src/lib/settings-defaults'

// Legacy identities that must never be seeded into the TCIP database.
const LEGACY_ADMIN_PATTERN = /bridgeofcompassion|bridge-of-compassion/i

async function seedSiteSettings() {
  const d = DEFAULT_SITE_SETTINGS
  const existing = await prisma.siteSettings.findUnique({ where: { id: 'site' } })
  if (existing) {
    // Never overwrite admin-edited values; only fill blank text fields.
    const fill: { footerTagline?: string; seoDescription?: string; seoTitle?: string } = {}
    if (!existing.footerTagline) fill.footerTagline = d.footerTagline ?? undefined
    if (!existing.seoDescription) fill.seoDescription = d.seoDescription ?? undefined
    if (!existing.seoTitle) fill.seoTitle = d.seoTitle ?? undefined
    if (Object.keys(fill).length > 0) {
      await prisma.siteSettings.update({ where: { id: 'site' }, data: fill })
      console.log(`SiteSettings: exists; filled blank fields (${Object.keys(fill).join(', ')})`)
    } else {
      console.log('SiteSettings: already exists (left unchanged)')
    }
    return
  }
  await prisma.siteSettings.create({
    data: {
      id:                    'site',
      organizationName:      d.organizationName,
      publicEmail:           d.publicEmail,
      phone:                 d.phone,
      addressLine1:          d.addressLine1,
      addressLine2:          d.addressLine2,
      city:                  d.city,
      province:              d.province,
      postalCode:            d.postalCode,
      country:               d.country,
      publicLocationLabel:   d.publicLocationLabel,
      facebookUrl:           d.facebookUrl,
      instagramUrl:          d.instagramUrl,
      linkedinUrl:           d.linkedinUrl,
      youtubeUrl:            d.youtubeUrl,
      footerTagline:         d.footerTagline,
      defaultCurrency:       d.defaultCurrency,
      donationPresetAmounts: d.donationPresetAmounts,
      seoTitle:              d.seoTitle,
      seoDescription:        d.seoDescription,
    },
  })
  console.log('SiteSettings: created')
}

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL?.toLowerCase().trim()
  const password = process.env.ADMIN_INITIAL_PASSWORD

  if (!email || !password) {
    console.log('Admin user: SKIPPED (ADMIN_EMAIL and/or ADMIN_INITIAL_PASSWORD not set)')
    return
  }
  if (!email.includes('@')) throw new Error('ADMIN_EMAIL is not a valid email address.')
  if (LEGACY_ADMIN_PATTERN.test(email)) {
    throw new Error('ADMIN_EMAIL is a legacy Bridge of Compassion identity. Refusing to seed it into TCIP.')
  }
  if (password.length < 10) throw new Error('ADMIN_INITIAL_PASSWORD must be at least 10 characters.')

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    console.log('Admin user: already exists (left unchanged)')
    return
  }

  await prisma.user.create({
    data: {
      email,
      password: await bcrypt.hash(password, 12),
      name: 'Admin',
      role: 'ADMIN',
    },
  })
  console.log('Admin user: created (password stored as bcrypt hash)')
}

async function main() {
  console.log('Seeding TCIP database…')
  await seedSiteSettings()
  await seedAdmin()
  console.log('Done.')
}

main()
  .catch((err) => {
    console.error('Seed failed:', (err?.message || String(err)).replace(/postgres(ql)?:\/\/\S+/g, '[REDACTED]'))
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
