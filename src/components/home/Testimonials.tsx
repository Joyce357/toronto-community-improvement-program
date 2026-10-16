export default function Testimonials() {
  const placeholderCards = [
    {
      id: 1,
      badge: 'COMMUNITY VOICE',
      placeholderText:
        '“Community testimonial will appear here once verified participant stories are published.”',
      author: 'Community Participant',
      role: 'Program Member (Story pending verification)',
      initials: 'TC',
      topBorder: 'border-t-4 border-primary',
      avatarBg: 'bg-secondary-container text-on-secondary-container',
    },
    {
      id: 2,
      badge: 'COMMUNITY VOICE',
      placeholderText:
        '“Community testimonial will appear here once verified participant stories are published.”',
      author: 'Community Member',
      role: 'Participant Feedback (Pending verification)',
      initials: 'TC',
      topBorder: 'border-t-4 border-secondary',
      avatarBg: 'bg-primary-fixed text-on-primary-fixed',
    },
  ]

  return (
    <section className="w-full bg-surface-container-low py-space-3xl border-b border-outline-variant/30">
      <div className="max-w-7xl mx-auto px-4 md:px-margin-desktop">
        
        {/* Header */}
        <div className="mb-space-2xl text-center max-w-xl mx-auto">
          <span className="font-eyebrow-bold text-eyebrow-bold text-primary uppercase tracking-widest block mb-2">
            COMMUNITY VOICES
          </span>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
            What People Say
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
            Authentic participant reflections and feedback from our community programs.
          </p>
        </div>

        {/* 2 Wide Testimonial Panels (Placeholder format per client policy) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter-desktop">
          {placeholderCards.map((t) => (
            <div
              key={t.id}
              className={`bg-surface-container-lowest rounded-3xl p-8 md:p-10 shadow-sm flex flex-col justify-between ${t.topBorder} border border-outline-variant/30`}
            >
              <div>
                <div className="flex items-center gap-2 text-primary mb-6">
                  <span className="material-symbols-outlined text-2xl">format_quote</span>
                  <span className="font-eyebrow-bold text-eyebrow-bold uppercase tracking-wider text-on-surface-variant">
                    {t.badge}
                  </span>
                </div>
                <p className="font-headline-sm text-headline-sm text-on-surface/80 italic leading-relaxed">
                  {t.placeholderText}
                </p>
              </div>

              <div className="pt-8 mt-8 border-t border-outline-variant/30 flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-full ${t.avatarBg} flex items-center justify-center font-title-md text-title-md shrink-0 shadow-xs font-bold`}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="font-title-md text-title-md text-on-surface font-bold">
                    {t.author}
                  </p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">
                    {t.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
