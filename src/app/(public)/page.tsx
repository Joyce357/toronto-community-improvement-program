import type { Metadata } from 'next'
import Hero              from '@/components/home/Hero'
import WhoWeAre          from '@/components/home/WhoWeAre'
import TeamLeadership    from '@/components/home/TeamLeadership'
import ProgramsPreview   from '@/components/home/ProgramsPreview'
import ImpactStats       from '@/components/home/ImpactStats'
import HomeGallery       from '@/components/home/HomeGallery'
import StoriesPreview    from '@/components/home/StoriesPreview'
import Partnerships      from '@/components/home/Partnerships'
import GetInvolved       from '@/components/home/GetInvolved'
import Testimonials      from '@/components/home/Testimonials'
import HomeContact       from '@/components/home/HomeContact'
import { getBaseUrl, getCanonicalUrl } from '@/lib/seo'
import { DEFAULT_SITE_SETTINGS } from '@/lib/settings'

export const metadata: Metadata = {
  title: {
    absolute: DEFAULT_SITE_SETTINGS.seoTitle!,
  },
  description: DEFAULT_SITE_SETTINGS.seoDescription!,
  alternates: {
    canonical: getCanonicalUrl('/'),
  },
  openGraph: {
    url: getCanonicalUrl('/'),
    title: DEFAULT_SITE_SETTINGS.seoTitle!,
    description: DEFAULT_SITE_SETTINGS.seoDescription!,
  },
}

export default function HomePage() {
  const baseUrl = getBaseUrl()

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: DEFAULT_SITE_SETTINGS.organizationName,
    url: baseUrl,
    email: DEFAULT_SITE_SETTINGS.publicEmail,
    location: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: DEFAULT_SITE_SETTINGS.city,
        addressRegion: DEFAULT_SITE_SETTINGS.province,
        addressCountry: 'CA',
      },
    },
  }

  return (
    <>
      {/* Organization structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />

      {/* Homepage sections in exact Stitch editorial UI/UX sequence */}
      <div className="flex flex-col w-full">
        {/* SECTION 1: HERO / WELCOME (Asymmetric 2-Column: 45% Text / 55% Slideshow) */}
        <Hero />

        {/* SECTION 2: WHO WE ARE & FOUNDER STORY (Asymmetric Split 2-Column: 50% Photo / 50% Editorial Pull-Quote) */}
        <WhoWeAre />

        {/* SECTION 3: THE TEAM & COMMUNITY LEADERSHIP (Bespoke 3-Column Editorial Grid) */}
        <TeamLeadership />

        {/* SECTION 4: PROGRAMS & AREAS OF WORK (Varied-Width 4-Column Mosaic Grid) */}
        <ProgramsPreview />

        {/* SECTION 5: COMMUNITY IMPACT (Asymmetric 1 Hero Column + 3 Stacked Metric Columns) */}
        <ImpactStats />

        {/* SECTION 6: IMAGES OF IMPACT (True Editorial Masonry / Mosaic Photo Gallery) */}
        <HomeGallery />

        {/* SECTION 7: COMMUNITY STORIES & UPCOMING EVENTS (1 Large Story Column + 2 Stacked Event Cards) */}
        <StoriesPreview />

        {/* SECTION 8: OUR PARTNERS & CIVIC SUPPORTERS (Clean 6-Column Institutional Row) */}
        <Partnerships />

        {/* SECTION 9: GET INVOLVED (3 Dedicated Action Pathway Columns) */}
        <GetInvolved />

        {/* SECTION 10: WHAT PEOPLE SAY (2-Column Balanced Testimonial Grid) */}
        <Testimonials />

        {/* SECTION 11: CONTACT & SEE US IN PERSON (2-Column Practical Layout: 45% Info / 55% Intake Form) */}
        <HomeContact />
      </div>
    </>
  )
}
