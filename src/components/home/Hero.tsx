'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const heroSlides = [
  {
    id: 1,
    tag: 'Annual Summit • Metro Hall',
    caption: 'Connecting over 250 youth and newcomer families with civic mentors.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASqdh2rs6BjmuyesbYaP9KfZ1bd-ZJcTgW6FO4ZWX3EfmgZkrnPjqPmnaVy_qBFIIT2hzx_mq02JneXSIxAErOcosJUwgZOjRehYGSnFf9REJUVencQgAGgubqvD7MJbLVo1xpIjAArEEsV25pY0736UGvSc83DQTTlPs4KP5FIXDotXXX-A-jltAT1E0BEp5P2ppS4M7kD35TpQx9tGSBRrYrBYNSpcfb-TIPJObRXrSGcpOTopQN',
    fallback: '/images/tcip-hero-community.jpg',
    alt: 'Annual TCIP Community Empowerment Summit with youth and newcomer families',
  },
  {
    id: 2,
    tag: 'Youth Tech Academy',
    caption: 'Equipping the next generation with digital skills, coding, and design tools.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0aMuenKxslGYotluscZ7gqpBJCWld1KfgEJDlN2LSpW6S5FlWIyO3RYLd_RAnFQx2oRAE2ColFA0RQE1TZyPVUXtzCvtGNcFr5sCJt4iIcx_ML4LzNeUqpquua9w5UEI7SEUw4N4mU-cuqjYEHTEl-a2wFRL9tE-zLHekPzKuCYgmO-cVsASpYJ4swNDpfNlWuiZ4cl2ZyypMS9HRIKmdFPKFXrmngDsaw_XkofNw4CrhImvQTPzX',
    fallback: '/images/tcip-youth-leadership.jpg',
    alt: 'TCIP STEM Lab and tech mentorship session in Toronto',
  },
  {
    id: 3,
    tag: 'Community Health & Wellness',
    caption: 'Free preventative dental screenings, maternal support, and health clinics.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxTSzwBjl6CixYFSTKn8uLGxvA0S9uxm6F2kA0Shxl3wsT8nkc_lVcJheTkKeJFDLxW1PLCTr4qyIMgNb7BjLQB8G9Y8lLKdFmohs_HYjSoYoT2JGPCgCpV_6otIfZeWFF8sJZEDvIOwVZweQHgKZQkqu-5DyK_Fnha0Uu4mHMkCRQTyGbIm84d3cLvzLidA2goYeBrX6_w87S5xNaRkE3DupvOcH_irLS4kfIn4_K_pCtTbxGChJB',
    fallback: '/images/tcip-community-workshop.jpg',
    alt: 'Free Community Health Consultation Hub in Scarborough',
  },
]

export default function Hero() {
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
              Creating Opportunity. <br />
              <span className="text-primary">Strengthening Belonging.</span> <br />
              Empowering Communities.
            </h1>

            {/* Narrative Body */}
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              Toronto Community Improvement Program: Empowering Communities for Change. Supporting Black immigrants,
              newcomers, youth, women, families, and job seekers through advocacy, education, and community partnerships.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-space-md pt-space-xs w-full sm:w-auto">
              <Link
                href="/programs"
                className="inline-flex items-center justify-center bg-primary hover:bg-primary-container text-on-primary font-title-md text-title-md px-8 py-3.5 rounded-full shadow-sm hover:shadow transition-all duration-200"
              >
                Explore Our Programs
              </Link>
              <Link
                href="/get-involved"
                className="inline-flex items-center justify-center gap-2 bg-surface-container-low hover:bg-surface-container text-on-surface font-title-md text-title-md px-6 py-3.5 rounded-full shadow-sm hover:shadow transition-all duration-200"
              >
                <span>Get Involved</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </Link>
            </div>

            {/* Trust Metric Badge */}
            <div className="pt-space-md flex items-center gap-space-md text-on-surface-variant">
              <div className="flex -space-x-2 shrink-0">
                <span className="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed font-title-md text-label-sm shadow-xs">
                  400+
                </span>
                <span className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-title-md text-label-sm shadow-xs">
                  GTA
                </span>
              </div>
              <p className="font-label-md text-label-md">
                Serving Hundreds of Individuals Each Year Across the Greater Toronto Area.
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
                      <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-on-primary">
                        <div className="bg-surface-container-lowest/95 backdrop-blur-md text-on-surface p-4 rounded-xl shadow-lg max-w-md border border-outline-variant/30">
                          <span className="font-eyebrow-bold text-eyebrow-bold text-primary block uppercase tracking-wider">
                            {slide.tag}
                          </span>
                          <p className="font-title-md text-title-md mt-1 leading-snug">
                            {slide.caption}
                          </p>
                        </div>
                      </div>
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
