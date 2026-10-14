import Link from 'next/link'
import Container from '@/components/ui/Container'

interface QuickActionItem {
  id: string
  title: string
  description: string
  href: string
  icon: React.ReactNode
}

const quickActions: QuickActionItem[] = [
  {
    id: 'programs',
    title: 'Find a Program',
    description: 'Explore youth, newcomer, and career development initiatives',
    href: '/programs',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    id: 'volunteer',
    title: 'Volunteer With TCIP',
    description: 'Share your skills and mentor Toronto youth and newcomers',
    href: '/volunteer',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    id: 'partner',
    title: 'Partner With Us',
    description: 'Collaborate on community projects and workplace training',
    href: '/get-involved#partner',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: 'events',
    title: 'Attend an Event',
    description: 'Register for upcoming workshops, job fairs, and forums',
    href: '/events',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
]

export default function QuickActions() {
  return (
    <section className="py-8 sm:py-10 bg-tcip-gray border-b border-tcip-border" aria-label="Quick Actions">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.id}
              href={action.href}
              className="group flex items-center justify-between p-4 sm:p-5 rounded-xl bg-white border border-tcip-border hover:border-tcip-green hover:shadow-card transition-all duration-200"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-tcip-sage text-tcip-green flex items-center justify-center shrink-0 group-hover:bg-tcip-green group-hover:text-white transition-colors duration-200 border border-tcip-green/20">
                  {action.icon}
                </div>
                <div className="min-w-0">
                  <h3 className="text-tcip-charcoal text-sm font-bold truncate group-hover:text-tcip-green transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-tcip-muted text-xs truncate">
                    {action.description}
                  </p>
                </div>
              </div>
              <svg
                className="w-4 h-4 text-tcip-muted/60 group-hover:text-tcip-green group-hover:translate-x-1 transition-all shrink-0 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  )
}
