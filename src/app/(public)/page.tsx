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
// import Testimonials      from '@/components/home/Testimonials'
import HomeContact       from '@/components/home/HomeContact'
import { getBaseUrl, getCanonicalUrl } from '@/lib/seo'
import { DEFAULT_SITE_SETTINGS } from '@/lib/settings'
import { getHomepageContent, getFeaturedPrograms, getFeaturedGalleryItems } from '@/lib/homepage'

// Re-check admin homepage edits regularly (admin saves also revalidate immediately).
export const revalidate = 60

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

export default async function HomePage() {
  const baseUrl = getBaseUrl()
  const home = await getHomepageContent()
  const [programs, galleryItems] = await Promise.all([
    getFeaturedPrograms(home.featuredProgramIds),
    getFeaturedGalleryItems(home.galleryItemIds),
  ])

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: DEFAULT_SITE_SETTINGS.organizationName,
    url: baseUrl,
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
        <Hero content={home.hero} />

        {/* SECTION 2: WHO WE ARE & FOUNDER STORY (Asymmetric Split 2-Column: 50% Photo / 50% Editorial Pull-Quote) */}
        <WhoWeAre about={home.about} founder={home.founder} />

        {/* SECTION 3: THE TEAM & COMMUNITY LEADERSHIP (Bespoke 3-Column Editorial Grid) */}
        <TeamLeadership founder={home.founder} people={home.people} />

        {/* SECTION 4: PROGRAMS & AREAS OF WORK (Varied-Width 4-Column Mosaic Grid) */}
        <ProgramsPreview programs={programs} />

        {/* SECTION 5: COMMUNITY IMPACT (Asymmetric 1 Hero Column + 3 Stacked Metric Columns) */}
        <ImpactStats impact={home.impact} />

        {/* SECTION 6: IMAGES OF IMPACT (True Editorial Masonry / Mosaic Photo Gallery) */}
        <HomeGallery
          items={galleryItems.map((g) => ({
            id: g.id,
            title: g.title,
            caption: g.caption,
            altText: g.altText,
            imageUrl: g.imageUrl,
            category: g.category,
          }))}
        />

        {/* SECTION 7: COMMUNITY STORIES & UPCOMING EVENTS (1 Large Story Column + 2 Stacked Event Cards) */}
        <StoriesPreview
          featuredStoryId={home.featuredStoryId}
          featuredEventId={home.featuredEventId}
        />

        {/* SECTION 8: OUR PARTNERS & CIVIC SUPPORTERS (Clean 6-Column Institutional Row) */}
        <Partnerships />

        {/* SECTION 9: GET INVOLVED (3 Dedicated Action Pathway Columns) */}
        <GetInvolved cta={home.cta} />

        {/* SECTION 10: WHAT PEOPLE SAY (Testimonials hidden until verified participant testimonials are published) */}
        {/* <Testimonials /> */}

        {/* SECTION 11: CONTACT & SEE US IN PERSON (2-Column Practical Layout: 45% Info / 55% Intake Form) */}
        <HomeContact contact={home.contact} />
      </div>
    </>
  )
}
