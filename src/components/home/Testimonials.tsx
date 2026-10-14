export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      quote:
        '“TCIP provided me with the mentorship and resume guidance I needed to land my first role in tech after immigrating to Toronto. Having someone who understood my journey made all the difference.”',
      author: 'Kofi A.',
      role: 'Newcomer Career Program Graduate • Junior Cloud Analyst',
      initials: 'K.A.',
      topBorder: 'border-t-4 border-primary',
      avatarBg: 'bg-secondary-container text-on-secondary-container',
    },
    {
      id: 2,
      quote:
        '“The dental access day and youth summer camp gave our family resources we simply could not afford. TCIP is a true anchor in our neighborhood—they don’t just talk, they show up.”',
      author: 'Mariam T.',
      role: 'Scarborough Resident & Mother of Three',
      initials: 'M.T.',
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
        </div>

        {/* 2 Wide Testimonial Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter-desktop">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className={`bg-surface-container-lowest rounded-3xl p-8 md:p-10 shadow-sm flex flex-col justify-between ${t.topBorder} border border-outline-variant/30`}
            >
              <div>
                <div className="flex items-center gap-1 text-tertiary mb-6">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined text-xl"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  ))}
                </div>
                <p className="font-headline-sm text-headline-sm text-on-surface italic leading-relaxed">
                  {t.quote}
                </p>
              </div>

              <div className="pt-8 mt-8 border-t border-outline-variant/30 flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-full ${t.avatarBg} flex items-center justify-center font-title-md text-title-md shrink-0 shadow-xs`}
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
