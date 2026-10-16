// ─── Zod Validation Schemas ───────────────────────────────────────────────
// All server-side input validation uses Zod.
// These schemas are used directly in API route handlers.

import { z } from 'zod'

// ─── Contact Form ─────────────────────────────────────────────────────────────

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters.')
    .max(100, 'Name must be under 100 characters.')
    .trim(),
  email: z
    .string()
    .email('Please enter a valid email address.')
    .max(254, 'Email address is too long.')
    .toLowerCase()
    .trim(),
  phone: z
    .string()
    .max(30, 'Phone number is too long.')
    .optional()
    .or(z.literal('')),
  subject: z
    .string()
    .min(3, 'Subject must be at least 3 characters.')
    .max(200, 'Subject must be under 200 characters.')
    .trim(),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters.')
    .max(5000, 'Message must be under 5,000 characters.')
    .trim(),
})

export type ContactInput = z.infer<typeof contactSchema>

// ─── Contact Admin ────────────────────────────────────────────────────────────

export const CONTACT_STATUSES = ['NEW', 'READ', 'REPLIED', 'ARCHIVED'] as const
export type ContactStatusType = (typeof CONTACT_STATUSES)[number]

export const adminContactUpdateSchema = z.object({
  status: z.enum(CONTACT_STATUSES).optional(),
  adminNotes: z
    .string()
    .max(3000, 'Admin notes must be under 3,000 characters.')
    .optional()
    .nullable()
    .or(z.literal('')),
})

export type AdminContactUpdateInput = z.infer<typeof adminContactUpdateSchema>

export const contactReplySchema = z.object({
  subject: z
    .string()
    .min(3, 'Subject must be at least 3 characters.')
    .max(200, 'Subject is too long.')
    .trim(),
  message: z
    .string()
    .min(5, 'Message must be at least 5 characters.')
    .max(10000, 'Message is too long.')
    .trim(),
})

export type ContactReplyInput = z.infer<typeof contactReplySchema>



export const VOLUNTEER_INTERESTS = [
  'Community Development',
  'Community Outreach',
  'Youth Programs',
  'Event Support',
  'Fundraising',
  'Administration',
  'Communications & Social Media',
  'Other',
] as const

export const VOLUNTEER_AVAILABILITY = [
  'Weekdays',
  'Weekends',
  'Evenings',
  'Flexible',
  'As Needed',
] as const

export const volunteerSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters.')
    .max(50, 'First name is too long.')
    .trim(),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters.')
    .max(50, 'Last name is too long.')
    .trim(),
  email: z
    .string()
    .email('Please enter a valid email address.')
    .max(254)
    .toLowerCase()
    .trim(),
  phone: z.string().max(30).optional().or(z.literal('')),
  location: z.string().max(150).optional().or(z.literal('')),
  interests: z
    .array(z.string())
    .min(1, 'Please select at least one area of interest.'),
  availability: z.string().min(1, 'Please select your availability.'),
  message: z.string().max(2000).optional().or(z.literal('')),
  consent: z
    .boolean()
    .refine((val) => val === true, 'You must consent to proceed.'),
})

export type VolunteerInput = z.infer<typeof volunteerSchema>

export const VOLUNTEER_STATUSES = [
  'NEW',
  'REVIEWING',
  'CONTACTED',
  'ACTIVE',
  'INACTIVE',
] as const

export type VolunteerStatusType = (typeof VOLUNTEER_STATUSES)[number]

export const adminVolunteerUpdateSchema = z.object({
  status: z.enum(VOLUNTEER_STATUSES).optional(),
  adminNotes: z.string().max(3000, 'Admin notes must be under 3,000 characters.').optional().nullable().or(z.literal('')),
})

export type AdminVolunteerUpdateInput = z.infer<typeof adminVolunteerUpdateSchema>

export const volunteerReplySchema = z.object({
  subject: z
    .string()
    .min(3, 'Subject must be at least 3 characters.')
    .max(200, 'Subject is too long.')
    .trim(),
  message: z
    .string()
    .min(5, 'Message must be at least 5 characters.')
    .max(10000, 'Message is too long.')
    .trim(),
})

export type VolunteerReplyInput = z.infer<typeof volunteerReplySchema>

// ─── Newsletter ───────────────────────────────────────────────────────────────

export const newsletterSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address.')
    .max(254)
    .toLowerCase()
    .trim(),
  firstName: z.string().max(50).optional().or(z.literal('')),
})

export type NewsletterInput = z.infer<typeof newsletterSchema>

// ─── Newsletter Unsubscribe ───────────────────────────────────────────────────

export const unsubscribeSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
})

// ─── Admin Newsletter Update ──────────────────────────────────────────────────

export const adminNewsletterUpdateSchema = z.object({
  status: z.enum(['ACTIVE', 'UNSUBSCRIBED']).optional(),
  firstName: z.string().max(50).optional().nullable(),
})

export type AdminNewsletterUpdateInput = z.infer<typeof adminNewsletterUpdateSchema>


// ─── Donation ─────────────────────────────────────────────────────────────────

export const DEFAULT_DONATION_CURRENCY = 'CAD' as const
export const DONATION_PRESET_AMOUNTS = [25, 50, 100, 250, 500] as const

export const createDonationOrderSchema = z.object({
  amount: z
    .number({ error: 'Amount must be a number.' })
    .min(1, 'Minimum donation amount is $1.')
    .max(100000, 'Please contact us for donations over $100,000.'),
  currency: z.enum(['CAD', 'USD']).default('CAD'),
  donorName: z.string().max(150).optional().or(z.literal('')).nullable(),
  donorEmail: z
    .string({ error: 'Email is required for donation receipt and verification.' })
    .trim()
    .toLowerCase()
    .min(1, 'Please enter your email address.')
    .email('Please enter a valid email address.')
    .max(254),
  donorPhone: z.string().max(30).optional().or(z.literal('')).nullable(),
  isAnonymous: z.boolean().default(false),
  message: z.string().max(500).optional().or(z.literal('')).nullable(),
  frequency: z.enum(['ONE_TIME', 'MONTHLY', 'ANNUAL']).default('ONE_TIME'),
})

export type CreateDonationOrderInput = z.infer<typeof createDonationOrderSchema>

// Backward compatibility alias for legacy references
export const donationSchema = createDonationOrderSchema
export type DonationInput = CreateDonationOrderInput

export const captureDonationOrderSchema = z.object({
  orderId: z.string().min(1, 'PayPal Order ID is required.').max(100),
  donationId: z.string().min(1, 'Donation ID is required.').max(100),
})

export type CaptureDonationOrderInput = z.infer<typeof captureDonationOrderSchema>

export const cancelDonationOrderSchema = z.object({
  orderId: z.string().min(1, 'PayPal Order ID is required.').max(100),
  donationId: z.string().min(1, 'Donation ID is required.').max(100),
})

export type CancelDonationOrderInput = z.infer<typeof cancelDonationOrderSchema>



// ─── Programs ─────────────────────────────────────────────────────────────────

export const PROGRAM_CATEGORIES = [
  'Employment & Economic Empowerment',
  'Newcomer & Community Support',
  'Youth Development',
  'Women & Family Empowerment',
  'Health & Wellness',
  'Advocacy, Culture & Community Development',
] as const

export const programSchema = z.object({
  title: z
    .string()
    .min(2, 'Title must be at least 2 characters.')
    .max(150, 'Title is too long.')
    .trim(),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters.')
    .max(150, 'Slug is too long.')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be URL-safe (lowercase letters, numbers, hyphens).')
    .trim(),
  category: z
    .string()
    .min(2, 'Category is required.')
    .max(100, 'Category is too long.')
    .trim(),
  shortDescription: z
    .string()
    .min(10, 'Short description must be at least 10 characters.')
    .max(400, 'Short description must be under 400 characters.')
    .trim(),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters.')
    .max(10000, 'Description must be under 10,000 characters.')
    .trim(),
  imageUrl: z
    .string()
    .max(500)
    .optional()
    .or(z.literal('')),
  featured: z.boolean().default(false),
  displayOrder: z.coerce.number().int().min(0).default(0),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
})

export type ProgramInput = z.infer<typeof programSchema>

// ─── Events ───────────────────────────────────────────────────────────────────

export const EVENT_CATEGORIES = [
  'Community Gathering',
  'Job Fair & Employment',
  'Youth Development',
  'Workshop & Training',
  'Health & Wellness',
  'Culture & Celebration',
  'Volunteer',
] as const

export const eventSchema = z.object({
  title: z
    .string()
    .min(2, 'Title must be at least 2 characters.')
    .max(150, 'Title is too long.')
    .trim(),
  category: z.string().min(1, 'Category is required.').default('Community Gathering'),
  shortDescription: z
    .string()
    .max(400, 'Short description is too long.')
    .optional()
    .nullable()
    .or(z.literal('')),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters.')
    .max(10000, 'Description is too long.')
    .trim(),
  date: z.union([z.string().min(1, 'Date is required.'), z.date()]),
  startTime: z.string().min(1, 'Start time is required.').trim(),
  endTime: z.string().optional().nullable().or(z.literal('')),
  location: z
    .string()
    .min(2, 'Location must be at least 2 characters.')
    .max(200, 'Location is too long.')
    .trim(),
  featuredImage: z.string().optional().nullable().or(z.literal('')),
  registrationLink: z
    .string()
    .refine((val) => !val || /^https?:\/\/.+/.test(val), {
      message: 'Registration link must be a valid URL starting with http:// or https://',
    })
    .optional()
    .nullable()
    .or(z.literal('')),
  registrationOpen: z.boolean().default(true),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
})

export type EventInput = z.infer<typeof eventSchema>

// ─── News & Stories ─────────────────────────────────────────────────────────

export const NEWS_CATEGORIES = [
  'Community Impact',
  'Employment & Careers',
  'Youth Leadership',
  'Newcomer Stories',
  'Health & Wellness',
  'Community Updates',
  'Advocacy',
] as const

export type NewsCategory = (typeof NEWS_CATEGORIES)[number]

/**
 * Generates category badge color style.
 */
export function getNewsCategoryStyle(category?: string | null): { bg: string; text: string; border: string } {
  switch (category?.toLowerCase()) {
    case 'employment & careers':
      return { bg: 'bg-emerald-50', text: 'text-[#2D6A4F]', border: 'border-[#2D6A4F]/20' }
    case 'youth leadership':
      return { bg: 'bg-pink-50', text: 'text-[#BE185D]', border: 'border-[#BE185D]/20' }
    case 'newcomer stories':
      return { bg: 'bg-sky-50', text: 'text-[#0284C7]', border: 'border-[#0284C7]/20' }
    case 'health & wellness':
      return { bg: 'bg-teal-50', text: 'text-[#0F766E]', border: 'border-[#0F766E]/20' }
    case 'community impact':
    default:
      return { bg: 'bg-amber-50', text: 'text-[#C2410C]', border: 'border-[#C2410C]/20' }
  }
}

export const newsSchema = z.object({
  title: z
    .string()
    .min(2, 'Title must be at least 2 characters.')
    .max(200, 'Title is too long.')
    .trim(),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters.')
    .max(200, 'Slug is too long.')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be URL-safe (lowercase letters, numbers, and hyphens).')
    .trim(),
  excerpt: z
    .string()
    .max(600, 'Excerpt must be under 600 characters.')
    .optional()
    .nullable()
    .or(z.literal('')),
  content: z
    .string()
    .min(10, 'Story content must be at least 10 characters.')
    .max(50000, 'Story content is too long.')
    .trim(),
  category: z
    .string()
    .max(100, 'Category is too long.')
    .optional()
    .nullable()
    .or(z.literal('')),
  author: z
    .string()
    .max(100, 'Author name is too long.')
    .optional()
    .nullable()
    .or(z.literal('')),
  featuredImage: z
    .string()
    .max(1000)
    .optional()
    .nullable()
    .or(z.literal('')),
  imagePublicId: z
    .string()
    .max(300)
    .optional()
    .nullable()
    .or(z.literal('')),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  publishedAt: z.union([z.string(), z.date()]).optional().nullable(),
})

export type NewsInput = z.infer<typeof newsSchema>

// ─── Gallery ──────────────────────────────────────────────────────────────────

export const GALLERY_CATEGORIES = [
  'Community',
  'Youth',
  'Employment',
  'Events',
  'Women & Families',
  'Health & Wellness',
  'Culture',
  'Partnerships',
] as const

export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number]

/**
 * Generates gallery category badge color style.
 */
export function getGalleryCategoryStyle(category?: string | null): { bg: string; text: string; border: string } {
  switch (category?.toLowerCase()) {
    case 'youth':
      return { bg: 'bg-pink-50', text: 'text-[#BE185D]', border: 'border-[#BE185D]/20' }
    case 'employment':
      return { bg: 'bg-emerald-50', text: 'text-[#2D6A4F]', border: 'border-[#2D6A4F]/20' }
    case 'events':
      return { bg: 'bg-amber-50', text: 'text-[#C2410C]', border: 'border-[#C2410C]/20' }
    case 'health & wellness':
      return { bg: 'bg-teal-50', text: 'text-[#0F766E]', border: 'border-[#0F766E]/20' }
    case 'women & families':
      return { bg: 'bg-purple-50', text: 'text-[#7E22CE]', border: 'border-[#7E22CE]/20' }
    case 'community':
    default:
      return { bg: 'bg-sky-50', text: 'text-[#0284C7]', border: 'border-[#0284C7]/20' }
  }
}

export const gallerySchema = z.object({
  title: z.string().max(200, 'Title is too long.').optional().nullable().or(z.literal('')),
  caption: z.string().max(500, 'Caption is too long.').optional().nullable().or(z.literal('')),
  altText: z.string().max(200, 'Alt text is too long.').optional().nullable().or(z.literal('')),
  imageUrl: z.string().min(1, 'Image URL is required.').max(1000),
  imagePublicId: z.string().max(300).optional().nullable().or(z.literal('')),
  category: z.string().max(100).optional().nullable().or(z.literal('')).default('Community'),
  featured: z.boolean().default(false),
  displayOrder: z.number().int().default(0),
  published: z.boolean().default(false),
})

export type GalleryInput = z.infer<typeof gallerySchema>

// ─── Partners ─────────────────────────────────────────────────────────────────

export const partnerSchema = z.object({
  name: z.string().min(2, 'Partner name is required.').max(150, 'Name is too long.').trim(),
  logoUrl: z.string().max(1000).optional().nullable().or(z.literal('')),
  websiteUrl: z
    .string()
    .refine((val) => !val || /^https?:\/\/.+/.test(val), {
      message: 'Website URL must be valid and start with http:// or https://',
    })
    .optional()
    .nullable()
    .or(z.literal('')),
  description: z.string().max(500, 'Description must be under 500 characters.').optional().nullable().or(z.literal('')),
  displayOrder: z.coerce.number().int().min(0).default(0),
  published: z.boolean().default(true),
})

export type PartnerInput = z.infer<typeof partnerSchema>

// ─── Admin: Change Password ───────────────────────────────────────────────────

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required.'),
    newPassword: z
      .string()
      .min(10, 'New password must be at least 10 characters.')
      .max(128, 'Password is too long.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>

// ─── Admin: Update Profile ────────────────────────────────────────────────────

export const updateProfileSchema = z.object({
  name:  z.string().min(1).max(100).trim(),
  email: z.string().email().max(254).toLowerCase().trim(),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>

// ─── Site Settings ────────────────────────────────────────────────────────────

const optionalUrl = z
  .string()
  .url('Must be a valid URL (e.g. https://instagram.com/your-org)')
  .optional()
  .nullable()
  .or(z.literal(''))

export const siteSettingsSchema = z.object({
  organizationName: z.string().min(1, 'Organization name is required.').max(150).trim(),
  publicEmail: z
    .string()
    .email('Please enter a valid public email address.')
    .max(254)
    .toLowerCase()
    .trim(),
  phone: z.string().max(30).optional().nullable().or(z.literal('')),
  addressLine1: z.string().max(200).optional().nullable().or(z.literal('')),
  addressLine2: z.string().max(200).optional().nullable().or(z.literal('')),
  city: z.string().max(100).optional().nullable().or(z.literal('')),
  province: z.string().max(100).optional().nullable().or(z.literal('')),
  postalCode: z.string().max(30).optional().nullable().or(z.literal('')),
  country: z.string().max(100).optional().nullable().or(z.literal('')),
  publicLocationLabel: z.string().max(150).optional().nullable().or(z.literal('')),

  facebookUrl: optionalUrl,
  instagramUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  youtubeUrl: optionalUrl,

  footerTagline: z.string().max(300).optional().nullable().or(z.literal('')),
  defaultCurrency: z.enum(['CAD', 'USD']).default('CAD'),
  donationPresetAmounts: z
    .array(z.number().int().positive().max(100000))
    .min(1, 'Provide at least one preset amount.')
    .max(10, 'Maximum 10 preset amounts.')
    .default([25, 50, 100, 250, 500]),

  seoTitle: z.string().max(150).optional().nullable().or(z.literal('')),
  seoDescription: z.string().max(400).optional().nullable().or(z.literal('')),
})

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>


// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Format Zod errors into a flat key → message object for API responses.
 */
export function formatZodErrors(
  error: z.ZodError,
): Record<string, string> {
  return error.issues.reduce<Record<string, string>>((acc, issue) => {
    const key = issue.path.join('.')
    acc[key] = issue.message
    return acc
  }, {})
}

