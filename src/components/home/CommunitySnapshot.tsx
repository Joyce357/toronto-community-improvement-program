import Container from '@/components/ui/Container'

interface SnapshotItem {
  id: string
  title: string
  subtitle: string
  icon: React.ReactNode
}

const snapshotItems: SnapshotItem[] = [
  {
    id: 'employment',
    title: 'Employment',
    subtitle: 'Career pathways & job opportunities',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" strokeWidth={1.8} />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" strokeWidth={1.8} />
      </svg>
    ),
  },
  {
    id: 'youth',
    title: 'Youth',
    subtitle: 'Programs for learning, leadership & connection',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeWidth={1.8} strokeLinecap="round" />
        <circle cx="9" cy="7" r="4" strokeWidth={1.8} />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeWidth={1.8} strokeLinecap="round" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeWidth={1.8} strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'health',
    title: 'Health',
    subtitle: 'Community access & wellness support',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'belonging',
    title: 'Belonging',
    subtitle: 'Culture, advocacy & community participation',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10" strokeWidth={1.8} />
        <path d="M2 12h20" strokeWidth={1.8} />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

export default function CommunitySnapshot() {
  return (
    <section className="py-10 sm:py-12 bg-white border-b border-border-soft" aria-label="Community Snapshot">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {snapshotItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4.5 sm:p-5 rounded-2xl bg-tcip-offwhite border border-border-soft shadow-card hover:shadow-card-hover hover:border-brand-green/30 transition-all duration-200 hover:-translate-y-0.5 group"
            >
              <div className="icon-tile group-hover:scale-105 transition-transform duration-200">
                {item.icon}
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-text-primary leading-tight mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-text-secondary leading-snug">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
