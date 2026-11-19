'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { DEFAULT_HOMEPAGE, DEFAULT_HERO_HEADING, type HomepageContent } from '@/lib/homepage-defaults'

const defaultSlides = [
  {
    id: 1,
    tag: 'Community Empowerment',
    caption: 'Bringing together community members, youth, and families across Greater Toronto.',
    image: '/images/tcip-hero-community.jpg',
    fallback: '/images/tcip-hero-community.jpg',
    alt: 'TCIP Community Empowerment gathering with youth and families in Toronto',
  },
  {
    id: 2,
    tag: 'Youth Development',
    caption: 'Empowering youth through leadership programs, summer camps, and community mentorship.',
    image: '/images/tcip-youth-leadership.jpg',
    fallback: '/images/tcip-youth-leadership.jpg',
    alt: 'TCIP youth development and community leadership activity in Toronto',
  },
  {
    id: 3,
    tag: 'Health & Wellness',
    caption: 'Facilitating dental care access initiatives and preventative health awareness.',
    image: '/images/tcip-community-workshop.jpg',
    fallback: '/images/tcip-community-workshop.jpg',
    alt: 'TCIP community health and wellness initiative in Greater Toronto',
  },
]

export default function Hero({ content }: { content?: HomepageContent['hero'] }) {
  const hero = content ?? DEFAULT_HOMEPAGE.hero
  const heroSlides =
    hero.slides.length > 0
      ? hero.slides.map((s, i) => ({
          id: i + 1,
          tag: '',
          caption: s.caption,
          image: s.imageUrl,
          fallback: defaultSlides[0].image,
          alt: s.caption || 'TCIP community photo',
        }))
      : defaultSlides
  const [currentSlide, setCurrentSlide] = useState(1)
  const totalSlides = heroSlides.length

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev >= totalSlides ? 1 : prev + 1))
    }, 6000)
    return () => clearInterval(timer)
  }, [totalSlides])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev >= totalSlides ? 1 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev <= 1 ? totalSlides : prev - 1))
  }

  return (
    <section className="w-full bg-surface-bright py-space-2xl md:py-space-3xl border-b border-outline-variant/30">
      <div className="max-w-7xl mx-auto px-4 md:px-margin-desktop">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-center">
          
          {/* Left Column: Editorial Callout & Context (45% / 5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-start gap-space-md">
            
            {/* Micro Eyebrow with Red Dot */}
            <div className="inline-flex items-center gap-2 bg-surface-container-low px-space-md py-1.5 rounded-full shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-tertiary shrink-0" aria-hidden="true" />
              <span className="font-eyebrow-bold text-eyebrow-bold text-on-surface tracking-wider uppercase">
                COMMUNITY • OPPORTUNITY • BELONGING
              </span>
            </div>

            {/* Display Headline */}
            <h1 className="font-display-xl text-display-xl-mobile md:text-display-xl text-on-surface text-balance">
              {hero.heading === DEFAULT_HERO_HEADING ? (
                <>
                  Creating Opportunity. <br />
                  <span className="text-primary">Strengthening Belonging.</span> <br />
                  Empowering Communities.
                </>
              ) : (
                hero.heading
              )}
            </h1>

            {/* Narrative Body */}
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              {hero.text}
            </p>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-space-md pt-space-xs w-full sm:w-auto">
              <Link
                href={hero.primaryHref}
                className="inline-flex items-center justify-center bg-primary hover:bg-primary-container text-on-primary font-title-md text-title-md px-8 py-3.5 rounded-full shadow-sm hover:shadow transition-all duration-200"
              >
                {hero.primaryLabel}
              </Link>
              {hero.secondaryLabel && hero.secondaryHref && (
                <Link
                  href={hero.secondaryHref}
                  className="inline-flex items-center justify-center gap-2 bg-surface-container-low hover:bg-surface-container text-on-surface font-title-md text-title-md px-6 py-3.5 rounded-full shadow-sm hover:shadow transition-all duration-200"
                >
                  <span>{hero.secondaryLabel}</span>
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </Link>
              )}
            </div>

            {/* Trust Metric Badge */}
            <div className="pt-space-md flex items-center gap-space-md text-on-surface-variant">
              <div className="flex -space-x-2 shrink-0">
                <span className="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed font-title-md text-label-sm shadow-xs">
                  TCIP
                </span>
                <span className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-title-md text-label-sm shadow-xs">
                  GTA
                </span>
              </div>
              <p className="font-label-md text-label-md">
                Supporting individuals and families across the Greater Toronto Area.
              </p>
            </div>

          </div>

          {/* Right Column: Interactive Slideshow (55% / 7 cols) */}
          <div className="lg:col-span-7 relative">
            <div className="bg-surface-container-low p-3 md:p-4 rounded-3xl shadow-md relative overflow-hidden">
              
              {/* Slides Container */}
              <div className="relative w-full h-[380px] md:h-[480px] rounded-2xl overflow-hidden bg-surface-container">
                {heroSlides.map((slide) => {
                  const isActive = slide.id === currentSlide
                  return (
                    <div
                      key={slide.id}
                      className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                        isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
                      }`}
                    >
                      <img
                        src={slide.image}
                        alt={slide.alt}
                        className="w-full h-full object-cover"
                        loading={slide.id === 1 ? 'eager' : 'lazy'}
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement
                          if (target.src !== slide.fallback) {
                            target.src = slide.fallback
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-transparent to-transparent" />
                      
                      {/* Glassmorphism Caption Card */}
                      {(slide.tag || slide.caption) && (
                      <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-on-primary">
                        <div className="bg-surface-container-lowest/95 backdrop-blur-md text-on-surface p-4 rounded-xl shadow-lg max-w-md border border-outline-variant/30">
                          {slide.tag && (
                            <span className="font-eyebrow-bold text-eyebrow-bold text-primary block uppercase tracking-wider">
                              {slide.tag}
                            </span>
                          )}
                          <p className="font-title-md text-title-md mt-1 leading-snug">
                            {slide.caption}
                          </p>
                        </div>
                      </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Slider Controls Bar */}
              <div className="flex items-center justify-between mt-3 px-2">
                <div className="flex items-center gap-2">
                  <span className="font-label-md text-label-md text-on-surface-variant font-mono">
                    0{currentSlide} / 0{totalSlides}
                  </span>
                  <div className="flex gap-1.5 ml-2">
                    {heroSlides.map((slide) => (
                      <button
                        key={slide.id}
                        type="button"
                        onClick={() => setCurrentSlide(slide.id)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          slide.id === currentSlide ? 'w-6 bg-primary' : 'w-2 bg-outline-variant'
                        }`}
                        aria-label={`Go to slide ${slide.id}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={prevSlide}
                    className="w-10 h-10 rounded-full bg-surface-container-lowest hover:bg-surface-container flex items-center justify-center text-on-surface shadow-sm transition-colors"
                    aria-label="Previous slide"
                  >
                    <span className="material-symbols-outlined text-base">arrow_back</span>
                  </button>
                  <button
                    type="button"
                    onClick={nextSlide}
                    className="w-10 h-10 rounded-full bg-surface-container-lowest hover:bg-surface-container flex items-center justify-center text-on-surface shadow-sm transition-colors"
                    aria-label="Next slide"
                  >
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
