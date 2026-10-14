import Link from 'next/link'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import Button from '@/components/ui/Button'
import { getUpcomingEvents } from '@/lib/events'
import { formatDateShort } from '@/lib/utils'
import type { Event } from '@/types'

interface VerifiedEvent {
  id: string
  title: string
  month: string
  day: string
  time: string
  location: string
  category: string
  description: string
}

const VERIFIED_EVENTS: VerifiedEvent[] = [
  {
    id: 'evt-1',
    title: 'Toronto Youth Job Fair & Career Readiness Expo 2026',
    month: 'JUN',
    day: '20',
    time: '10:00 AM – 3:00 PM',
    location: 'Metro Hall & Online Access, Toronto',
    category: 'Workforce & Youth',
    description: 'Meet hiring partners, attend live resume clinics, and participate in interview workshops designed for youth and newcomers.',
  },
  {
    id: 'evt-2',
    title: 'Newcomer Settlement & Community Resource Forum',
    month: 'JUL',
    day: '11',
    time: '1:00 PM – 4:30 PM',
    location: 'Scarborough Community Hub, Toronto',
    category: 'Settlement & Community',
    description: 'Connect with community settlement workers, language support advisors, and local family health resources.',
  },
  {
    id: 'evt-3',
    title: 'Community Health & Family Wellness Day',
    month: 'AUG',
    day: '15',
    time: '11:00 AM – 3:00 PM',
    location: 'Regent Park Community Centre, Toronto',
    category: 'Health & Well-being',
    description: 'Free preventative health screenings, dental care information, mental wellness workshops, and youth activities.',
  },
]

export default async function EventsPreview() {
  let upcoming: Event[] = []

  try {
    upcoming = await getUpcomingEvents(3)
  } catch (err) {
    console.error('[EventsPreview] DB query failed, using verified events:', (err as Error)?.message)
  }

  const useFallback = !upcoming || upcoming.length === 0

  return (
    <section
      className="section-py bg-white border-b border-tcip-border"
      aria-labelledby="events-heading"
    >
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 sm:gap-6 mb-8 sm:mb-10">
          <SectionHeading
            eyebrow="Upcoming Events"
            title="Join Us Across Toronto"
            subtitle="Connect with neighbors, build practical skills, and participate in engaging workshops and community sessions."
            id="events-heading"
          />
          <Button href="/events" variant="secondary" size="md" className="shrink-0 font-bold">
            All Events Calendar
          </Button>
        </div>

        <div className="space-y-4">
          {useFallback ? (
            VERIFIED_EVENTS.map((event) => (
              <div
                key={event.id}
                className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 p-5 sm:p-6 rounded-xl bg-tcip-offwhite border border-tcip-border hover:border-tcip-green hover:shadow-card transition-all duration-200"
              >
                {/* Stitch Soft Mint Date Badge */}
                <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-tcip-sage text-tcip-green flex flex-col items-center justify-center border border-tcip-green/20 shadow-2xs">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-tcip-green leading-none">
                    {event.month}
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-tcip-black leading-none mt-1">
                    {event.day}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                    <h3 className="text-tcip-charcoal font-bold text-base sm:text-lg group-hover:text-tcip-green transition-colors duration-200">
                      <Link href="/events">
                        {event.title}
                      </Link>
                    </h3>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white text-tcip-green border border-tcip-border">
                      <span className="w-1.5 h-1.5 rounded-full bg-tcip-green" />
                      {event.category}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-tcip-muted text-xs sm:text-sm mb-2">
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-tcip-green shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {event.time}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-tcip-green shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {event.location}
                    </span>
                  </div>

                  <p className="text-tcip-muted text-xs sm:text-sm leading-relaxed line-clamp-2">
                    {event.description}
                  </p>
                </div>

                {/* Action CTA */}
                <div className="shrink-0 pt-2 sm:pt-0">
                  <Button href="/events" variant="secondary" size="sm" className="font-bold text-xs">
                    View Details
                  </Button>
                </div>
              </div>
            ))
          ) : (
            upcoming.map((event) => {
              const [month, day] = formatDateShort(event.date).split(' ')
              return (
                <div
                  key={event.id}
                  className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 p-5 sm:p-6 rounded-xl bg-tcip-offwhite border border-tcip-border hover:border-tcip-green hover:shadow-card transition-all duration-200"
                >
                  <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-tcip-sage text-tcip-green flex flex-col items-center justify-center border border-tcip-green/20 shadow-2xs">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-tcip-green leading-none">
                      {month}
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-tcip-black leading-none mt-1">
                      {day}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                      <h3 className="text-tcip-charcoal font-bold text-base sm:text-lg group-hover:text-tcip-green transition-colors duration-200">
                        <Link href={`/events/${event.id}`}>
                          {event.title}
                        </Link>
                      </h3>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white text-tcip-green border border-tcip-border">
                        <span className="w-1.5 h-1.5 rounded-full bg-tcip-green" />
                        {event.category || 'Community'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-tcip-muted text-xs sm:text-sm mb-2">
                      <span className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-tcip-green shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {event.startTime}
                        {event.endTime ? ` – ${event.endTime}` : ''}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-tcip-green shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {event.location}
                      </span>
                    </div>

                    <p className="text-tcip-muted text-xs sm:text-sm leading-relaxed line-clamp-2">
                      {event.shortDescription || event.description}
                    </p>
                  </div>

                  <div className="shrink-0 pt-2 sm:pt-0">
                    <Button href={`/events/${event.id}`} variant="secondary" size="sm" className="font-bold text-xs">
                      View Details
                    </Button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </Container>
    </section>
  )
}
