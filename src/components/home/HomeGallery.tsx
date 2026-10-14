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
    title: 'Annual Youth Job Fair • Metro Hall',
    subtitle: 'Over 200 youth interviewed by leading GTA technology and healthcare employers.',
    gridClass: 'md:col-span-8 md:row-span-2',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCRLzOlogDBeH6J1vjudoAfnbFxNgPmcDLBYOsII2l5OMEdGplhTpSVak_KGri6Ab2aXHtB15pBjKjX8GDgzI41EPzH2G8fgwKIAxGh1gVLy23KoyDhhp-USuz2zzpHMN1jIAkThS-BejIKO_A_uCpGFlsHQavxFoe-43z8dQVahoK8YXH1P1BMwR6zD-1GEeVFMeZC9O5-le1cTCGqjd-RhvbfpPcPfLgv4qtlQcwYzlV9bffTqSgq',
    fallback: '/images/tcip-hero-community.jpg',
    alt: 'Annual TCIP Youth Job Fair at Metro Hall Toronto',
  },
  {
    id: 'g-2',
    category: 'youth',
    badge: 'YOUTH & STEM',
    badgeColor: 'bg-secondary text-on-secondary',
    title: 'Creative Digital Media Lab',
    subtitle: 'One-on-one mentorship fostering storytelling and audio engineering.',
    gridClass: 'md:col-span-4 md:row-span-2',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDvqbZU-fPuiDC9S5hg8Y_BV75Onxnw9ljkQI26kDRILoXi9ssEIY27mUTuhB8twxCnEnvWWo3jfpi0rHqgJHsvBCPLLFXJKPTfe83SNT-U3GVm1x5-4LJplWSdWqPvjwf9DDB275E1RSYfR3BIpdoa1uCgxwlNlDtwECDedFIbu3YeTNph6vmjAPLFHpbaqd58-qbmnHiTT_f4ymVAHcvusU6QL6u7JHF-XU8NTwjeYuKikXlplQAO',
    fallback: '/images/tcip-youth-leadership.jpg',
    alt: 'Youth Media Mentorship in Scarborough',
  },
  {
    id: 'g-3',
    category: 'health',
    badge: 'HEALTH',
    badgeColor: 'bg-tertiary-container text-on-tertiary-container',
    title: 'Free Mobile Dental Clinic',
    gridClass: 'md:col-span-4 md:row-span-1',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDTCgywLocbxDtP3QMmiVSYZvDRD0Y3CCBtckdzvoDWAflKu-xG8WC15Q2eFcilfFJ7K_qI6-ljMwRu-6Xc0nAFdF2ovc59s4lmaD1MUcAW9DQpZIhU7IqMM5YRIYjMpiihZu88tWkSTuyqpF72_KnTM1v21YRwKqNRyYnv7Urr0laR5IVJCaYSAZflt3G44BMS5Pe6-_lT6xAAikNN_8YahYFCx3THZ8dp-zK2hS-bkUfbrkmwUDAj',
    fallback: '/images/tcip-community-workshop.jpg',
    alt: 'Mobile Dental Screening Day in Scarborough',
  },
  {
    id: 'g-4',
    category: 'events',
    badge: 'COMMUNITY',
    badgeColor: 'bg-primary text-on-primary',
    title: "Women's Empowerment Circles",
    gridClass: 'md:col-span-4 md:row-span-1',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBL--ochQmMlhTHLWHmxgKAgrJGaBoEB_LcBBC8nuyAYmcKqEKVmL_geHiDLlesgRekVsi0v59fW63DO3e82l7Tc95ex9k6WOSP9I40DkmhexHyiOjK6TlFJTjaqlTh_2dX0wnwV5-BJbL070eG3ik84tWTQWSzFzpvX2K-vpfiInNlFxRKY30tc3ukCH7pPzUFL8ixcs74XSul1Kh90vr3FF02PSBNmzbvQhm5wfoOzjeCUtBF4n-U',
    fallback: '/images/tcip-hero-community.jpg',
    alt: "Women's Entrepreneurship Circle in Toronto",
  },
  {
    id: 'g-5',
    category: 'youth',
    badge: 'GRADUATION',
    badgeColor: 'bg-secondary text-on-secondary',
    title: 'Bootcamp Graduation Celebration',
    gridClass: 'md:col-span-4 md:row-span-1',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBCIpvRJ9Om8yLRbUmcUJlyO5z8TKs45HehnixwTv2sBvktPvJapK_9zNEct35-0EPpItgZhIeZVSgWVT43VD78g57i6eXTBo9E3Q3QgwjwJWEKEb908Z7LUUsqq7J2RRorhRgeRV5Wy8pyWIIO4T5S4cFqCnIrRjPKTvdSVE9-LeDsUIWcOgPuFu2G3S4L5C7N2lXFmZNqns3qAQApwe9CJDsK8pOYAnJ03srW6muBkSYmwgCBYfSe',
    fallback: '/images/hero-youth-nature.jpg',
    alt: 'Youth Bootcamp Graduation Celebration in Toronto',
  },
]

export default function HomeGallery() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'youth' | 'employment' | 'health' | 'events'>('all')
  const [activeLightbox, setActiveLightbox] = useState<GalleryItem | null>(null)

  const filteredItems = galleryItems.filter(
    (item) => selectedFilter === 'all' || item.category === selectedFilter
  )

  const filterButtons: { label: string; value: 'all' | 'youth' | 'employment' | 'health' | 'events' }[] = [
    { label: 'All Photos', value: 'all' },
    { label: 'Youth & STEM', value: 'youth' },
    { label: 'Employment', value: 'employment' },
    { label: 'Community Health', value: 'health' },
    { label: 'Cultural Gatherings', value: 'events' },
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
