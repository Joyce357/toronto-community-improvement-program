// TCIP default site settings (pure data, safe to import from seed scripts).

import type { SiteSettingsRecord } from '@/types'

export const DEFAULT_SITE_SETTINGS: SiteSettingsRecord = {
  id:                    'site',
  organizationName:      'Toronto Community Improvement Program',
  publicEmail:           '',
  phone:                 null,

  addressLine1:          null,
  addressLine2:          null,
  city:                  'Toronto',
  province:              'Ontario',
  postalCode:            null,
  country:               'Canada',
  publicLocationLabel:   'Toronto, Ontario',

  // Social (null/empty = not rendered publicly)
  facebookUrl:           null,
  instagramUrl:          null,
  linkedinUrl:           null,
  youtubeUrl:            null,

  // Site & Content
  footerTagline:         'Empowering Toronto newcomers, youth, and families through community programs, skill building, and collaborative advocacy.',
  defaultCurrency:       'CAD',
  donationPresetAmounts: [25, 50, 100, 250, 500],

  // SEO
  seoTitle:              'Toronto Community Improvement Program',
  seoDescription:        'Toronto Community Improvement Program supports newcomers, youth, families, and underserved communities through education, empowerment, advocacy, and community development initiatives.',
}
