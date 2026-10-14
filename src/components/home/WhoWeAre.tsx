import Link from 'next/link'

export default function WhoWeAre() {
  return (
    <section id="about" className="w-full bg-surface-container-low py-space-3xl scroll-mt-20 border-b border-outline-variant/30">
      <div className="max-w-7xl mx-auto px-4 md:px-margin-desktop">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-center">
          
          {/* Left: Image Composition with Floating Badge (6 cols) */}
          <div className="lg:col-span-6 relative">
            <div className="relative w-full h-[460px] rounded-3xl overflow-hidden shadow-md bg-surface-container">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXp5nRqA8TdcGyS9n81UGkkWFHIQx7Pc8WxLLANLYH_vac1lmwVTyBt4pUpDVoNNCqj-MLQI8HE4_fWmvEfllb-GFW-rM9az0hphUuXV_GD4lH7CDuayo3IO0hmbBAdXE9x9-LDYvbcwZTx0RcVqT6HXdVpPQxUiyj4bZhzjHkcOh8PfvABi8Xwo4T9UQ-X06UdY-USDaSudOZDhWDfhaZ-cVKvtA05IlwTJQczx8lHVsHMwAM-w9n"
                alt="Adaikpoh Dumebi, Founder & Executive Director of TCIP"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/60 via-transparent to-transparent" />
            </div>

            {/* Floating Founder Spotlight Card */}
            <div className="mt-4 sm:mt-0 sm:absolute sm:-bottom-8 sm:-right-6 bg-surface-container-lowest p-6 rounded-2xl shadow-xl max-w-sm border border-outline-variant/30">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container shrink-0">
                  <span className="material-symbols-outlined text-2xl">format_quote</span>
                </div>
                <div>
                  <span className="font-eyebrow-bold text-eyebrow-bold text-on-surface-variant uppercase tracking-wider">
                    ESTABLISHED 2020
                  </span>
                  <p className="font-title-md text-title-md text-on-surface font-bold">
                    Adaikpoh Dumebi
                  </p>
                  <span className="font-label-sm text-label-sm text-primary font-semibold">
                    Founder &amp; Executive Director
                  </span>
                </div>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-3 italic leading-relaxed">
                &ldquo;When one newcomer finds steady ground, an entire neighbourhood rises with them.&rdquo;
              </p>
            </div>
          </div>

          {/* Right: Story Narrative & Large Manifesto Pull-Quote (6 cols) */}
          <div className="lg:col-span-6 flex flex-col gap-space-md pt-8 lg:pt-0" id="founder">
            <div className="inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="font-eyebrow-bold text-eyebrow-bold text-on-surface-variant uppercase tracking-widest">
                WHO WE ARE &amp; OUR ORIGINS
              </span>
            </div>

            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface leading-tight">
              Building Communities Where Everyone Can Thrive
            </h2>

            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              Founded in 2020 by Adaikpoh Dumebi, who recognized the critical need for an organization dedicated to helping immigrants of Black descent navigate systemic barriers. Since then, TCIP has grown into a thriving non-profit serving hundreds of individuals and families across the Greater Toronto Area each year.
            </p>

            {/* Large Editorial Pull-Quote Module */}
            <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border-l-4 border-l-primary relative">
              <span className="font-headline-sm text-headline-sm text-on-surface italic leading-snug block">
                “We are advocating for a world where black immigrants belong, thrive and are empowered to succeed. Where they will feel seen, safe and deeply valued. We achieve this through advocacy, education and community.”
              </span>
              <span className="font-eyebrow-bold text-eyebrow-bold text-primary block mt-4 uppercase tracking-wider">
                — TCIP Guiding Mandate
              </span>
            </div>

            <Link
              href="/#founder"
              className="inline-flex items-center gap-2 font-title-md text-title-md text-primary hover:text-primary-container transition-colors group mt-2"
            >
              <span>Read Our Full Founding Journey &amp; Mission</span>
              <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>

        </div>
      </div>
    </section>
  )
}
