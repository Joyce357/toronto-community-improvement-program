export default function ImpactStats() {
  return (
    <section id="impact" className="w-full bg-surface-bright py-space-3xl scroll-mt-20 border-b border-outline-variant/30">
      <div className="max-w-7xl mx-auto px-4 md:px-margin-desktop">
        
        {/* Section Header */}
        <div className="mb-space-xl">
          <span className="font-eyebrow-bold text-eyebrow-bold text-primary uppercase tracking-widest block mb-2">
            VERIFIED REACH
          </span>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
            Measurable, Human-Centered Progress Across Toronto
          </h2>
        </div>

        {/* Asymmetric 5 cols / 7 cols layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-stretch">
          
          {/* Large Visual Anchor Column (5 cols) */}
          <div className="lg:col-span-5 relative rounded-3xl overflow-hidden min-h-[420px] shadow-md flex flex-col justify-end p-8 bg-surface-container-high border border-outline-variant/30">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbeJd1juVQ6JsClOcSctj023GjPtaVD94GINgL1FTQGa7BjNEbbWVauC8SlH9SOOB9UmwOsOW1NP-l1r3T3UeJDro6s82zc4kiK8kGRzQXUzOWHwCm_EqGA8zHHF1Wri97WETXXJ0_9IL_tHdhGNovT0iHTG2re0zXTfFqGoa4s8Fqvp9vbZA-l5D_Lfe1AE1pEgVqKFWsPhmaUyb02QIPosYfcScsawjVxY0HzW_6Y32de16hRNgG"
              alt="TCIP Community Impact in Action in Toronto"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-on-primary-fixed via-on-primary-fixed/40 to-transparent" />
            <div className="relative z-10 text-on-primary">
              <span className="bg-primary px-3 py-1 rounded-full font-eyebrow-bold text-eyebrow-bold uppercase inline-block mb-3 shadow-xs">
                100% COMMUNITY-LED
              </span>
              <h3 className="font-headline-md text-headline-md leading-tight mb-2">
                Direct Grassroots Investment
              </h3>
              <p className="font-body-md text-body-md text-primary-fixed leading-relaxed">
                Every initiative is co-designed with community members living in Scarborough, Rexdale, North York, and downtown Toronto.
              </p>
            </div>
          </div>

          {/* 3 Supporting Impact Metric Columns (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-3 gap-gutter-desktop">
            
            {/* Metric 1: Employment */}
            <div className="bg-surface-container-low rounded-3xl p-6 flex flex-col justify-between shadow-sm border border-outline-variant/30">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-secondary-container flex items-center justify-center text-on-secondary-container mb-6">
                  <span className="material-symbols-outlined text-2xl">work</span>
                </div>
                <span className="font-display-xl text-display-xl text-primary font-bold block leading-none">
                  350+
                </span>
                <h4 className="font-title-md text-title-md text-on-surface mt-2 font-bold">
                  Job Seekers Supported
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                  Resume coaching, mock technical interviews, and on-the-spot hiring events with GTA corporate partners.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-outline-variant/30">
                <div className="flex justify-between font-label-sm text-label-sm mb-1.5 text-on-surface">
                  <span>Placement Success</span>
                  <span className="font-bold text-primary">78%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                  <div className="h-2 rounded-full bg-primary" style={{ width: '78%' }} />
                </div>
              </div>
            </div>

            {/* Metric 2: Youth Mentored */}
            <div className="bg-surface-container-low rounded-3xl p-6 flex flex-col justify-between shadow-sm border border-outline-variant/30">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-primary-fixed flex items-center justify-center text-on-primary-fixed mb-6">
                  <span className="material-symbols-outlined text-2xl">school</span>
                </div>
                <span className="font-display-xl text-display-xl text-primary font-bold block leading-none">
                  500+
                </span>
                <h4 className="font-title-md text-title-md text-on-surface mt-2 font-bold">
                  Youth In STEM &amp; Arts
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                  Engaged in creative code, digital filmmaking, and robotics across 18 public secondary school hubs.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-outline-variant/30">
                <div className="flex justify-between font-label-sm text-label-sm mb-1.5 text-on-surface">
                  <span>Active School Hubs</span>
                  <span className="font-bold text-primary">18 Centres</span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                  <div className="h-2 rounded-full bg-primary" style={{ width: '90%' }} />
                </div>
              </div>
            </div>

            {/* Metric 3: Healthcare Access */}
            <div className="bg-surface-container-low rounded-3xl p-6 flex flex-col justify-between shadow-sm border border-outline-variant/30">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed mb-6">
                  <span className="material-symbols-outlined text-2xl">health_and_safety</span>
                </div>
                <span className="font-display-xl text-display-xl text-tertiary font-bold block leading-none">
                  1.2k+
                </span>
                <h4 className="font-title-md text-title-md text-on-surface mt-2 font-bold">
                  Health Screenings
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                  Preventative dental consultations, maternal checkups, and hygiene kits provided free of charge.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-outline-variant/30">
                <div className="flex justify-between font-label-sm text-label-sm mb-1.5 text-on-surface">
                  <span>Care Distribution</span>
                  <span className="font-bold text-tertiary">100% Free</span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                  <div className="h-2 rounded-full bg-tertiary" style={{ width: '100%' }} />
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  )
}
