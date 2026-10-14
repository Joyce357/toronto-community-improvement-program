// ─── Gallery Page ─────────────────────────────────────────────────────────
import type { Metadata } from 'next'
import Container from '@/components/ui/Container'
import { getPublishedGalleryItems } from '@/lib/gallery'
import GalleryGrid from '@/components/gallery/GalleryGrid'
import { getCanonicalUrl } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Photos from Toronto Community Improvement Program (TCIP) workshops, youth initiatives, and neighborhood events.',
  alternates: { canonical: getCanonicalUrl('/gallery') },
  openGraph: { url: getCanonicalUrl('/gallery') },
}

export const dynamic = 'force-dynamic'

export default async function GalleryPage() {
  const items = await getPublishedGalleryItems()

  return (
    <>
      {/* Hero Section */}
      <section className="bg-brand-cream dark:bg-dark-bg section-py text-brand-black dark:text-white relative overflow-hidden transition-colors duration-200 border-b border-border-soft dark:border-dark-border">
        <Container className="text-center relative z-10">
          <p className="eyebrow text-brand-green mb-3">Our Community &amp; Work</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-brand-black dark:text-white mb-4 tracking-tight">
            Photo Gallery
          </h1>
          <p className="text-text-secondary dark:text-dark-text-secondary text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            A visual showcase of our skills training workshops, youth leadership sessions, and neighborhood community events.
          </p>
        </Container>
      </section>

      {/* Main Gallery Section */}
      <section className="section-py bg-brand-warm-white dark:bg-dark-bg transition-colors duration-200">
        <Container>
          <GalleryGrid initialItems={items} />
        </Container>
      </section>
    </>
  )
}
