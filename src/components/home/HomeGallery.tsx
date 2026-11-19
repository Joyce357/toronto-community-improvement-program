'use client'

import { useState } from 'react'

interface GalleryItem {
  id: string
  category: 'youth' | 'employment' | 'health' | 'events'
  badge: string
  badgeColor: string
  title: string
  subtitle?: string
  gridClass: string
  image: string
  fallback: string
  alt: string
}

const galleryItems: GalleryItem[] = [
  {
    id: 'g-1',
    category: 'employment',
    badge: 'EMPLOYMENT',
    badgeColor: 'bg-primary text-on-primary',
    title: 'Youth Summer Job Fair',
    subtitle: 'Connecting youth and job seekers with community and employment opportunities.',
    gridClass: 'md:col-span-8 md:row-span-2',
    image: '/images/tcip-hero-community.jpg',
    fallback: '/images/tcip-hero-community.jpg',
    alt: 'TCIP Youth Summer Job Fair in Toronto',
  },
  {
    id: 'g-2',
    category: 'youth',
    badge: 'YOUTH DEVELOPMENT',
    badgeColor: 'bg-secondary text-on-secondary',
    title: 'Youth Mentorship & Leadership',
    subtitle: 'Fostering leadership skills, confidence, and community connection for young people.',
    gridClass: 'md:col-span-4 md:row-span-2',
    image: '/images/tcip-youth-leadership.jpg',
    fallback: '/images/tcip-youth-leadership.jpg',
    alt: 'TCIP Youth Mentorship in Toronto',
  },
  {
    id: 'g-3',
    category: 'health',
    badge: 'HEALTH',
    badgeColor: 'bg-tertiary-container text-on-tertiary-container',
    title: 'Dental Care Access Initiative',
    subtitle: 'Facilitating access to preventative oral healthcare services and awareness.',
    gridClass: 'md:col-span-4 md:row-span-1',
    image: '/images/tcip-community-workshop.jpg',
    fallback: '/images/tcip-community-workshop.jpg',
    alt: 'TCIP Dental Care Access Initiative in Toronto',
  },
  {
    id: 'g-4',
    category: 'events',
    badge: 'COMMUNITY',
    badgeColor: 'bg-primary text-on-primary',
    title: "Women's Empowerment Circles",
    subtitle: 'Creating supportive spaces for women to connect, share knowledge, and grow.',
    gridClass: 'md:col-span-4 md:row-span-1',
    image: '/images/tcip-hero-community.jpg',
    fallback: '/images/tcip-hero-community.jpg',
    alt: "Women's Empowerment Initiative in Toronto",
  },
  {
    id: 'g-5',
    category: 'youth',
    badge: 'YOUTH & TEENS',
    badgeColor: 'bg-secondary text-on-secondary',
    title: 'Kids & Teenagers Summer Camp',
    subtitle: 'Community learning, recreational activities, and youth skill-building.',
    gridClass: 'md:col-span-4 md:row-span-1',
    image: '/images/tcip-youth-leadership.jpg',
    fallback: '/images/tcip-youth-leadership.jpg',
    alt: 'Kids and Teenagers Summer Camp in Toronto',
  },
]

export interface HomeGalleryInput {
  id: string
  title: string | null
  caption: string | null
  altText: string | null
  imageUrl: string
  category: string | null
}

const CUSTOM_GRID = [
  'md:col-span-8 md:row-span-2',
  'md:col-span-4 md:row-span-2',
  'md:col-span-4 md:row-span-1',
  'md:col-span-4 md:row-span-1',
  'md:col-span-4 md:row-span-1',
]

export default function HomeGallery({ items }: { items?: HomeGalleryInput[] }) {
  const usingCustom = !!items && items.length > 0
  const sourceItems: GalleryItem[] = usingCustom
    ? items!.map((g, i) => ({
        id: g.id,
        category: 'events',
        badge: (g.category || 'Gallery').toUpperCase(),
        badgeColor: 'bg-primary text-on-primary',
        title: g.title || '',
        subtitle: g.caption || undefined,
        gridClass: CUSTOM_GRID[i] ?? 'md:col-span-4 md:row-span-1',
        image: g.imageUrl,
        fallback: '/images/tcip-hero-community.jpg',
        alt: g.altText || g.title || 'TCIP gallery photo',
      }))
    : galleryItems

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'youth' | 'employment' | 'health' | 'events'>('all')
  const [activeLightbox, setActiveLightbox] = useState<GalleryItem | null>(null)

  const filteredItems = usingCustom
    ? sourceItems
    : sourceItems.filter((item) => selectedFilter === 'all' || item.category === selectedFilter)

  const filterButtons: { label: string; value: 'all' | 'youth' | 'employment' | 'health' | 'events' }[] = [
    { label: 'All Photos', value: 'all' },
    { label: 'Youth', value: 'youth' },
    { label: 'Employment', value: 'employment' },
    { label: 'Health & Wellness', value: 'health' },
    { label: 'Community Circles', value: 'events' },
  ]

  return (
    <section id="gallery" className="w-full bg-surface-container-low py-space-3xl scroll-mt-20 border-b border-outline-variant/30">
      <div className="max-w-7xl mx-auto px-4 md:px-margin-desktop">
        
        {/* Header with Filter Pills */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-space-2xl gap-6">
          <div>
            <span className="font-eyebrow-bold text-eyebrow-bold text-primary uppercase tracking-widest block mb-2">
              IMAGES OF IMPACT
            </span>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
              The Work of TCIP in Photos
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Moments of connection, learning, and celebration across Toronto&apos;s diverse neighbourhoods.
            </p>
          </div>

          {/* Filter Pills */}
          {!usingCustom && (
          <div className="flex flex-wrap items-center gap-2">
            {filterButtons.map((btn) => (
              <button
                key={btn.value}
                type="button"
                onClick={() => setSelectedFilter(btn.value)}
                className={`px-4 py-1.5 rounded-full font-label-sm text-label-sm shadow-sm transition-colors ${
                  selectedFilter === btn.value
                    ? 'bg-on-surface text-surface'
                    : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
          )}
        </div>

        {/* Masonry / Mosaic Photo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter-desktop auto-rows-[220px]">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveLightbox(item)}
              className={`${item.gridClass} rounded-3xl overflow-hidden relative group shadow-sm cursor-pointer border border-outline-variant/30 bg-surface-container`}
            >
              <img
                src={item.image}
                alt={item.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement
                  if (target.src !== item.fallback) {
                    target.src = item.fallback
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/85 via-inverse-surface/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
              
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-on-primary">
                <div>
                  <span
                    className={`${item.badgeColor} px-3 py-1 rounded-full font-eyebrow-bold text-eyebrow-bold uppercase shadow-xs`}
                  >
                    {item.badge}
                  </span>
                  <h3 className="font-headline-sm text-headline-sm mt-2 text-on-primary leading-tight">
                    {item.title}
                  </h3>
                  {item.subtitle && (
                    <p className="font-body-sm text-body-sm text-surface-container-highest mt-1">
                      {item.subtitle}
                    </p>
                  )}
                </div>
                <span className="material-symbols-outlined text-2xl text-on-primary bg-surface-container-lowest/20 backdrop-blur-md p-2 rounded-full shrink-0 ml-3">
                  zoom_in
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Optional Lightbox Modal */}
        {activeLightbox && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={() => setActiveLightbox(null)}
          >
            <div
              className="relative max-w-4xl w-full bg-surface-container-lowest rounded-3xl overflow-hidden shadow-2xl border border-outline-variant/40"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative max-h-[70vh] overflow-hidden">
                <img
                  src={activeLightbox.image}
                  alt={activeLightbox.alt}
                  className="w-full h-full object-contain max-h-[70vh]"
                />
              </div>
              <div className="p-6 flex items-center justify-between">
                <div>
                  <span className={`${activeLightbox.badgeColor} px-3 py-1 rounded-full font-eyebrow-bold text-eyebrow-bold uppercase text-xs`}>
                    {activeLightbox.badge}
                  </span>
                  <h4 className="font-title-md text-title-md text-on-surface font-bold mt-2">
                    {activeLightbox.title}
                  </h4>
                  {activeLightbox.subtitle && (
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                      {activeLightbox.subtitle}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setActiveLightbox(null)}
                  className="p-2 rounded-full hover:bg-surface-container text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-2xl">close</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  )
}
