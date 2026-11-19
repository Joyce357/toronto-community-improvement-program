import { DEFAULT_HOMEPAGE, type HomepageContent } from '@/lib/homepage-defaults'

export default function ImpactStats({
  impact = DEFAULT_HOMEPAGE.impact,
}: {
  impact?: HomepageContent['impact']
}) {
  const qualitativeThemes = [
    {
      id: 'employment',
      icon: 'work',
      iconBg: 'bg-secondary-container text-on-secondary-container',
      themeBadge: 'COMMUNITY IMPACT',
      themeTitle: 'Employment Opportunities',
      description:
        'Connecting job seekers with resume coaching, vocational readiness clinics, and job fair connections across the Greater Toronto Area.',
      metricSlot: 'Active Program Area',
      tagColor: 'text-primary',
    },
    {
      id: 'youth',
      icon: 'school',
      iconBg: 'bg-primary-fixed text-on-primary-fixed',
      themeBadge: 'COMMUNITY IMPACT',
      themeTitle: 'Youth Development',
      description:
        'Engaging young people in constructive mentorship, leadership activities, summer camp programs, and positive community engagement.',
      metricSlot: 'Ongoing Initiative',
      tagColor: 'text-primary',
    },
    {
      id: 'health',
      icon: 'health_and_safety',
      iconBg: 'bg-tertiary-fixed text-on-tertiary-fixed',
      themeBadge: 'COMMUNITY IMPACT',
      themeTitle: 'Health & Wellness Access',
      description:
        'Organizing preventative dental care access initiatives, community health information sessions, and family wellness awareness.',
      metricSlot: 'Community Focus',
      tagColor: 'text-tertiary',
    },
  ]

  return (
    <section id="impact" className="w-full bg-surface-bright py-space-3xl scroll-mt-20 border-b border-outline-variant/30">
      <div className="max-w-7xl mx-auto px-4 md:px-margin-desktop">
        
        {/* Section Header */}
        <div className="mb-space-xl">
          <span className="font-eyebrow-bold text-eyebrow-bold text-primary uppercase tracking-widest block mb-2">
            COMMUNITY IMPACT
          </span>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
            Meaningful, Community-Driven Impact Across Toronto
          </h2>
        </div>

        {/* Asymmetric 5 cols / 7 cols layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-stretch">
          
          {/* Large Visual Anchor Column (5 cols) */}
          <div className="lg:col-span-5 relative rounded-3xl overflow-hidden min-h-[420px] shadow-md flex flex-col justify-end p-8 bg-surface-container-high border border-outline-variant/30">
            <img
              src={impact.imageUrl}
              alt={impact.imageAlt}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-on-primary-fixed via-on-primary-fixed/40 to-transparent" />
            <div className="relative z-10 text-on-primary">
              <span className="bg-primary px-3 py-1 rounded-full font-eyebrow-bold text-eyebrow-bold uppercase inline-block mb-3 shadow-xs">
                {impact.badge}
              </span>
              <h3 className="font-headline-md text-headline-md leading-tight mb-2">
                {impact.heading}
              </h3>
              <p className="font-body-md text-body-md text-primary-fixed leading-relaxed">
                {impact.description}
              </p>
            </div>
          </div>

          {/* 3 Supporting Impact Qualitative Columns (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-3 gap-gutter-desktop">
            {qualitativeThemes.map((theme) => (
              <div
                key={theme.id}
                className="bg-surface-container-low rounded-3xl p-6 flex flex-col justify-between shadow-sm border border-outline-variant/30"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl ${theme.iconBg} flex items-center justify-center mb-6`}>
                    <span className="material-symbols-outlined text-2xl">{theme.icon}</span>
                  </div>
                  <span className="font-eyebrow-bold text-eyebrow-bold text-on-surface-variant uppercase tracking-wider block mb-1">
                    {theme.themeBadge}
                  </span>
                  <h4 className="font-title-md text-title-md text-on-surface font-bold">
                    {theme.themeTitle}
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                    {theme.description}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-outline-variant/30">
                  <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface">
                    <span className="text-on-surface-variant font-medium">Status</span>
                    <span className={`font-bold ${theme.tagColor}`}>{theme.metricSlot}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-on-surface-variant/80">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    <span>Serving GTA Communities</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  )
}
