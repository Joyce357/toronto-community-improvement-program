import Link from 'next/link'
import { DEFAULT_HOMEPAGE, type HomepageContent } from '@/lib/homepage-defaults'

export default function GetInvolved({ cta = DEFAULT_HOMEPAGE.cta }: { cta?: HomepageContent['cta'] }) {
  return (
    <section id="get-involved" className="w-full bg-surface-bright py-space-3xl scroll-mt-20 border-b border-outline-variant/30">
      <div className="max-w-7xl mx-auto px-4 md:px-margin-desktop">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-space-2xl">
          <span className="font-eyebrow-bold text-eyebrow-bold text-primary uppercase tracking-widest block mb-2">
            JOIN OUR MOVEMENT
          </span>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
            {cta.heading}
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2">
            {cta.text}
          </p>
          {cta.buttonLabel && cta.buttonHref && (
            <Link
              href={cta.buttonHref}
              className="inline-flex items-center justify-center bg-primary hover:bg-primary-container text-on-primary font-title-md text-title-md px-8 py-3 rounded-full shadow-sm hover:shadow transition-all duration-200 mt-space-md"
            >
              {cta.buttonLabel}
            </Link>
          )}
        </div>

        {/* 3 Columns with Varied Accent Styles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter-desktop">
          
          {/* Column 1: Volunteer Skills */}
          <div className="bg-surface-container-low rounded-3xl p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 border border-outline-variant/30">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-secondary-container flex items-center justify-center text-on-secondary-container mb-6">
                <span className="material-symbols-outlined text-3xl">volunteer_activism</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Volunteer Your Skills
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant mt-3 leading-relaxed">
                Support community workshops, assist with event logistics, or share your skills to help youth, newcomers, and neighborhood residents.
              </p>
              <ul className="mt-4 flex flex-col gap-2 font-body-sm text-body-sm text-on-surface">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                  <span>Community workshops &amp; gathering support</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                  <span>Youth mentorship &amp; community activities</span>
                </li>
              </ul>
            </div>
            <div className="pt-8">
              <Link
                href="/volunteer"
                className="inline-flex items-center gap-2 font-title-md text-title-md text-primary hover:text-primary-container transition-colors group"
              >
                <span>Apply to Volunteer</span>
                <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </Link>
            </div>
          </div>

          {/* Column 2: Community & Civic Partners */}
          <div className="bg-surface-container rounded-3xl p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 border border-outline-variant/30">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-primary-fixed flex items-center justify-center text-on-primary-fixed mb-6">
                <span className="material-symbols-outlined text-3xl">corporate_fare</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Partner With TCIP
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant mt-3 leading-relaxed">
                Collaborate on community initiatives, host educational workshops, or partner with us to expand outreach across Toronto neighborhoods.
              </p>
              <ul className="mt-4 flex flex-col gap-2 font-body-sm text-body-sm text-on-surface">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                  <span>Community collaboration &amp; workshop spaces</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                  <span>Civic &amp; neighborhood outreach</span>
                </li>
              </ul>
            </div>
            <div className="pt-8">
              <Link
                href="/get-involved"
                className="inline-flex items-center gap-2 font-title-md text-title-md text-primary hover:text-primary-container transition-colors group"
              >
                <span>Explore Partnerships</span>
                <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </Link>
            </div>
          </div>

          {/* Column 3: Donate / Support Our Work */}
          <div className="bg-primary text-on-primary rounded-3xl p-8 flex flex-col justify-between shadow-md hover:shadow-lg transition-all duration-300">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-surface-container-lowest/20 flex items-center justify-center text-on-primary mb-6">
                <span className="material-symbols-outlined text-3xl">favorite</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-primary font-bold">
                Support Our Work
              </h3>
              <p className="font-body-md text-body-md text-on-primary-container mt-3 leading-relaxed">
                Your financial support directly assists grassroots community programs, youth activities, and family support initiatives across Toronto.
              </p>
              <div className="mt-6 p-4 rounded-2xl bg-surface-container-lowest/10 backdrop-blur-sm">
                <p className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-wider font-semibold">
                  Community Support
                </p>
                <p className="font-body-sm text-body-sm text-on-primary mt-1">
                  Contributions directly support grassroots programs and community-centered initiatives.
                </p>
              </div>
            </div>
            <div className="pt-8">
              <Link
                href="/donate"
                className="w-full inline-flex items-center justify-center bg-surface-container-lowest hover:bg-surface-container text-on-surface font-title-md text-title-md py-3.5 px-6 rounded-full shadow-sm transition-colors text-center"
              >
                Make a Donation
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
