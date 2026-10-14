import Link from 'next/link'
import NewsletterForm from '@/components/layout/NewsletterForm'
import { getSiteSettings } from '@/lib/settings'

export default async function Footer() {
  const settings = await getSiteSettings()

  const orgName = settings.organizationName?.toLowerCase().includes('bridge')
    ? 'Toronto Community Improvement Program'
    : (settings.organizationName || 'Toronto Community Improvement Program')

  const tagline =
    settings.footerTagline?.toLowerCase().includes('nature') ||
    settings.footerTagline?.toLowerCase().includes('nurturing')
      ? 'Empowering Black immigrants, newcomers, youth, and families across Toronto through advocacy, education, and community.'
      : (settings.footerTagline ||
        'Empowering Black immigrants, newcomers, youth, and families across Toronto through advocacy, education, and community.')

  return (
    <footer className="w-full bg-inverse-surface text-inverse-on-surface border-t-2 border-primary mt-space-3xl" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 md:px-margin-desktop py-space-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-gutter-desktop">
          
          {/* Col 1: Brand & Identity */}
          <div className="lg:col-span-1 flex flex-col gap-space-sm">
            <Link href="/" className="flex items-center gap-space-sm mb-space-xs group">
              <div className="w-8 h-8 rounded-full bg-tcip-black text-white font-extrabold text-xs flex items-center justify-center tracking-tight shadow-sm relative overflow-hidden border border-white/20 shrink-0">
                <span className="relative z-10 flex items-center">
                  <span className="text-white">T</span>
                  <span className="text-primary font-bold">C</span>
                  <span className="text-white">IP</span>
                </span>
                <span className="absolute top-1 right-1 w-1 h-1 rounded-full bg-tertiary" />
              </div>
              <span className="font-title-md text-title-md text-inverse-on-surface font-bold">
                TCIP
              </span>
            </Link>
            <p className="font-body-sm text-body-sm text-outline-variant leading-relaxed">
              {tagline}
            </p>
            <span className="font-label-sm text-label-sm text-surface-variant mt-space-xs">
              Registered Non-Profit Entity • Ontario, Canada
            </span>
          </div>

          {/* Col 2: Navigation */}
          <div className="flex flex-col gap-space-xs">
            <h4 className="font-title-md text-title-md text-inverse-on-surface mb-space-sm font-bold">
              Navigation
            </h4>
            <nav className="flex flex-col gap-space-xs" aria-label="Footer Navigation">
              <Link href="/" className="font-body-sm text-primary-fixed hover:underline transition-colors">
                Home
              </Link>
              <Link href="/#about" className="font-body-sm text-body-sm text-outline-variant hover:text-inverse-on-surface transition-colors">
                About Us
              </Link>
              <Link href="/#founder" className="font-body-sm text-body-sm text-outline-variant hover:text-inverse-on-surface transition-colors">
                Founder
              </Link>
              <Link href="/programs" className="font-body-sm text-body-sm text-outline-variant hover:text-inverse-on-surface transition-colors">
                Programs
              </Link>
              <Link href="/#impact" className="font-body-sm text-body-sm text-outline-variant hover:text-inverse-on-surface transition-colors">
                Impact
              </Link>
              <Link href="/events" className="font-body-sm text-body-sm text-outline-variant hover:text-inverse-on-surface transition-colors">
                Events &amp; Blog
              </Link>
            </nav>
          </div>

          {/* Col 3: Focus Areas */}
          <div className="flex flex-col gap-space-xs">
            <h4 className="font-title-md text-title-md text-inverse-on-surface mb-space-sm font-bold">
              Focus Areas
            </h4>
            <ul className="flex flex-col gap-space-xs font-body-sm text-body-sm text-outline-variant">
              <li>Employment &amp; Economic Mobility</li>
              <li>Youth Tech &amp; Leadership</li>
              <li>Newcomer Settlement</li>
              <li>Community Health &amp; Wellbeing</li>
            </ul>
          </div>

          {/* Col 4: Get Involved */}
          <div className="flex flex-col gap-space-xs">
            <h4 className="font-title-md text-title-md text-inverse-on-surface mb-space-sm font-bold">
              Get Involved
            </h4>
            <nav className="flex flex-col gap-space-xs" aria-label="Footer Get Involved">
              <Link href="/volunteer" className="font-body-sm text-body-sm text-outline-variant hover:text-inverse-on-surface transition-colors">
                Volunteer
              </Link>
              <Link href="/get-involved" className="font-body-sm text-body-sm text-outline-variant hover:text-inverse-on-surface transition-colors">
                Corporate Partnership
              </Link>
              <Link href="/contact" className="font-body-sm text-body-sm text-outline-variant hover:text-inverse-on-surface transition-colors">
                Host a Gathering
              </Link>
              <Link href="/donate" className="font-body-sm text-body-sm text-primary-fixed font-semibold hover:text-inverse-on-surface transition-colors">
                Make a Donation
              </Link>
            </nav>
          </div>

          {/* Col 5: Office & Contact + Stay Informed */}
          <div className="flex flex-col gap-space-xs">
            <h4 className="font-title-md text-title-md text-inverse-on-surface mb-space-sm font-bold">
              Office &amp; Contact
            </h4>
            <p className="font-body-sm text-body-sm text-outline-variant">
              {settings.city || 'Toronto'}, {settings.province || 'Ontario'}, Canada
            </p>
            <p className="font-body-sm text-body-sm text-outline-variant">
              Hours: Mon - Fri, 09:00 - 17:00 EST
            </p>
            <div className="mt-space-sm">
              <span className="font-label-sm text-label-sm text-inverse-on-surface block mb-space-xs font-semibold">
                Stay Informed
              </span>
              <NewsletterForm
                className="flex flex-col sm:flex-row gap-2"
                inputClassName="w-full bg-surface-container-highest text-on-surface px-3 py-1.5 rounded-lg text-body-sm focus:outline-none placeholder-on-surface-variant/60"
                buttonClassName="bg-primary hover:bg-primary-container text-on-primary font-label-sm text-label-sm px-4 py-1.5 rounded-lg transition-colors shrink-0"
              />
            </div>
          </div>

        </div>

        {/* Bottom Legal / Accessibility Bar */}
        <div className="border-t border-outline/30 mt-space-2xl pt-space-lg flex flex-col sm:flex-row items-center justify-between gap-space-sm text-outline-variant font-body-sm text-body-sm">
          <span>© {new Date().getFullYear()} {orgName}. All rights reserved.</span>
          <div className="flex items-center gap-space-lg">
            <Link href="/contact" className="hover:text-inverse-on-surface transition-colors">
              Accessibility Standards
            </Link>
            <Link href="/contact" className="hover:text-inverse-on-surface transition-colors">
              Privacy &amp; Terms
            </Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
