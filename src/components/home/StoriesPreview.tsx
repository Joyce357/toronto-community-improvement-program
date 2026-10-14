import Link from 'next/link'
import { getFeaturedNews } from '@/lib/news'
import type { NewsPost } from '@/types'

export default async function StoriesPreview() {
  let stories: NewsPost[] = []

  try {
    stories = await getFeaturedNews(1)
  } catch {
    // fallback
  }

  const story = stories?.[0]
  const featuredStory = {
    id: story?.id || 'featured-1',
    title: story?.title || 'Annual Youth Summer Job Fair: Connecting 200+ Youth with GTA Employers',
    slug: story?.slug || 'youth-summer-job-fair',
    category: story?.category || 'Community Impact Report',
    dateLabel: 'July 2024',
    readTime: '4 min read',
    excerpt:
      story?.excerpt ||
      'How TCIP convened leading municipal employers, tech studios, and healthcare providers to offer on-the-spot interviews, resume critiques, and immediate paid vocational internships to Black and newcomer young adults across the GTA.',
    image:
      story?.featuredImage ||
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD29wMRhc0BpWpmqJass7z3zg943Jq-XyZM9bPKwkMf0nR_Y-DwwD9g94t9op5o8I1yPY3OXauCzuR_DaUFuJtmxXnXY_IHA9ImKnuJIiTPD18_rjOwAOC0y9g4uMPMEUQobt-pcAMOwqedDDgDdQstmpx78wxzdCiCO6F4uf0ip3rgLjP5oTNcQksk0kE0_5wBEtiTvEGrSepIs3caBNKjMQW0QWEZjOBpiHRERZpzyjLRcfYVVxFb',
    fallback: '/images/tcip-hero-community.jpg',
    location: 'Metro Hall, Toronto',
  }

  const upcomingEvents = [
    {
      id: 'event-1',
      month: 'OCT',
      day: '24',
      badge: 'WORKSHOP LAB',
      title: 'Newcomer Career Readiness & Portfolio Review',
      location: 'Metro Hall, 55 John St • 6:00 PM – 8:30 PM EST',
      tag: 'Free Registration',
      btnText: 'Register Free',
      href: '/events',
      accentBorder: 'border-primary',
      tagColor: 'text-primary',
      btnColor: 'bg-primary hover:bg-primary-container text-on-primary',
    },
    {
      id: 'event-2',
      month: 'NOV',
      day: '08',
      badge: 'COMMUNITY HEALTH',
      title: 'Scarborough Health & Dental Screening Clinic',
      location: 'Cedar Ridge Creative Centre • 10:00 AM – 3:00 PM EST',
      tag: 'Walk-ins Welcome',
      btnText: 'Book Time',
      href: '/contact',
      accentBorder: 'border-tertiary',
      tagColor: 'text-tertiary',
      btnColor: 'bg-surface-container-lowest hover:bg-surface-container text-on-surface shadow-sm',
    },
  ]

  return (
    <section id="events" className="w-full bg-surface-bright py-space-3xl scroll-mt-20 border-b border-outline-variant/30">
      <div className="max-w-7xl mx-auto px-4 md:px-margin-desktop">
        
        {/* Header */}
        <div className="mb-space-2xl">
          <span className="font-eyebrow-bold text-eyebrow-bold text-primary uppercase tracking-widest block mb-2">
            LIVING STORIES &amp; GATHERINGS
          </span>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
            Voices of Change &amp; Upcoming Events
          </h2>
        </div>

        {/* 12-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop">
          
          {/* Left: Featured Story Feature (55% / 7 cols) */}
          <div className="lg:col-span-7 bg-surface-container-low rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between border border-outline-variant/30">
            <div className="w-full h-80 relative overflow-hidden bg-surface-container">
              <img
                src={featuredStory.image}
                alt={featuredStory.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-4 left-4 bg-tertiary text-on-tertiary px-3 py-1 rounded-full font-eyebrow-bold text-eyebrow-bold uppercase shadow-xs">
                FEATURED STORY
              </span>
            </div>

            <div className="p-8 flex flex-col justify-between flex-grow">
              <div>
                <div className="flex items-center gap-3 text-on-surface-variant font-label-sm text-label-sm mb-3">
                  <span>{featuredStory.dateLabel || 'July 2024'}</span>
                  <span>•</span>
                  <span>{featuredStory.readTime || '4 min read'}</span>
                  <span>•</span>
                  <span className="text-primary font-semibold">{featuredStory.category}</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface leading-tight font-bold">
                  {featuredStory.title}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant mt-3 leading-relaxed">
                  {featuredStory.excerpt}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-outline-variant/30 flex items-center justify-between">
                <Link
                  href="/events"
                  className="inline-flex items-center gap-2 font-title-md text-title-md text-primary hover:text-primary-container transition-colors group"
                >
                  <span>Read Full Story</span>
                  <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </Link>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  {featuredStory.location || 'Metro Hall, Toronto'}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Stacked Upcoming Events (45% / 5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Upcoming Gatherings
              </h3>
              <Link
                href="/events"
                className="font-label-md text-label-md text-primary hover:underline font-semibold"
              >
                View All Events
              </Link>
            </div>

            {/* Event Cards */}
            {upcomingEvents.map((evt) => (
              <div
                key={evt.id}
                className="bg-surface-container-low rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow flex gap-5 items-start border border-outline-variant/30"
              >
                {/* Date Badge */}
                <div
                  className={`w-16 h-20 rounded-2xl bg-surface-container-lowest flex flex-col items-center justify-center shrink-0 shadow-sm border-t-4 ${evt.accentBorder}`}
                >
                  <span className={`font-eyebrow-bold text-eyebrow-bold uppercase ${evt.tagColor}`}>
                    {evt.month}
                  </span>
                  <span className="font-headline-md text-headline-md text-on-surface font-extrabold leading-none mt-1">
                    {evt.day}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-col justify-between flex-grow">
                  <div>
                    <span className="font-eyebrow-bold text-eyebrow-bold text-on-surface-variant uppercase tracking-wider">
                      {evt.badge}
                    </span>
                    <h4 className="font-title-md text-title-md text-on-surface font-bold mt-1 leading-snug">
                      {evt.title}
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1.5">
                      {evt.location}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-outline-variant/30 flex items-center justify-between">
                    <span className={`font-label-sm text-label-sm font-semibold ${evt.tagColor}`}>
                      {evt.tag}
                    </span>
                    <Link
                      href={evt.href}
                      className={`${evt.btnColor} px-4 py-1.5 rounded-full font-label-sm text-label-sm transition-colors`}
                    >
                      {evt.btnText}
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {/* Quick Event Newsletter Prompt */}
            <div className="bg-surface-container p-6 rounded-3xl flex items-center justify-between gap-4 border border-outline-variant/30">
              <div>
                <p className="font-title-md text-label-md font-bold text-on-surface">
                  Never miss a workshop or job fair
                </p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Get notified directly via our monthly calendar.
                </p>
              </div>
              <Link
                href="/contact"
                className="bg-primary hover:bg-primary-container text-on-primary px-5 py-2 rounded-full font-label-sm text-label-sm whitespace-nowrap transition-colors shadow-xs"
              >
                Subscribe
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  )
}
