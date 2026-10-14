// ─── Volunteer Page ─────────────────────────────────────────────────────────
import type { Metadata } from 'next'
import VolunteerLanding from '@/components/volunteer/VolunteerLanding'
import { getCanonicalUrl } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Volunteer',
  description: 'Join the Toronto Community Improvement Program (TCIP) volunteer team. Apply to volunteer and create lasting change through youth mentorship, skills training, and neighborhood initiatives.',
  alternates: { canonical: getCanonicalUrl('/volunteer') },
  openGraph: { url: getCanonicalUrl('/volunteer') },
}

export default function VolunteerPage() {
  return <VolunteerLanding />
}
