// ─── Donate Page ────────────────────────────────────────────────────────────
import type { Metadata } from 'next'
import DonationForm from '@/components/forms/DonationForm'
import { getCanonicalUrl } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Donate',
  description: 'Support Toronto Community Improvement Program (TCIP) with a donation. Every contribution empowers youth, funds job workshops, and strengthens community belonging.',
  alternates: { canonical: getCanonicalUrl('/donate') },
  openGraph: { url: getCanonicalUrl('/donate') },
}

export default function DonatePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-brand-cream dark:bg-dark-bg section-py text-brand-black dark:text-white relative overflow-hidden transition-colors duration-200 border-b border-border-soft dark:border-dark-border">
        <div className="container-site text-center relative z-10">
          <p className="eyebrow text-brand-green mb-3">Support Our Mission</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-brand-black dark:text-white mb-4 tracking-tight">Support TCIP</h1>
          <p className="text-text-secondary dark:text-dark-text-secondary text-base sm:text-lg max-w-xl mx-auto">
            Your contributions power hands-on youth workshops, career readiness clinics, and community initiatives across Toronto.
          </p>
        </div>
      </section>

      {/* Donation form section */}
      <section className="section-py bg-white dark:bg-dark-bg transition-colors duration-200">
        <div className="container-site">
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-12 items-start">

            {/* Form */}
            <div className="lg:col-span-3">
              <div className="bg-brand-cream/60 dark:bg-dark-card rounded-2xl shadow-card border border-border-soft dark:border-dark-border p-6 sm:p-8">
                <DonationForm />
              </div>
            </div>

            {/* Why donate */}
            <div className="lg:col-span-2 space-y-5">
              <h2 className="text-2xl font-extrabold text-brand-black dark:text-dark-text-primary tracking-tight">Your Community Impact</h2>

              {[
                { icon: '🚀', label: 'Workforce & Job Readiness', text: 'Funding resume clinics, digital tools, and practical interview prep.' },
                { icon: '✨', label: 'Youth Mentorship & Leadership', text: 'Equipping youth with life skills, confidence, and civic leadership projects.' },
                { icon: '🤝', label: 'Newcomer & Family Resources', text: 'Providing community navigation, translation, and neighborhood settlement support.' },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4 bg-white dark:bg-dark-card rounded-xl p-4 shadow-xs border border-border-soft dark:border-dark-border">
                  <div className="text-2xl">{item.icon}</div>
                  <div>
                    <p className="font-bold text-brand-black dark:text-dark-text-primary text-sm">{item.label}</p>
                    <p className="text-text-secondary dark:text-dark-text-secondary text-xs mt-0.5">{item.text}</p>
                  </div>
                </div>
              ))}

              <div className="bg-brand-cream dark:bg-dark-surface rounded-xl p-5 text-sm border border-border-soft dark:border-dark-border">
                <p className="text-text-secondary dark:text-dark-text-secondary">
                  <strong className="text-brand-black dark:text-dark-text-primary">Questions about donating?</strong>{' '}
                  <a href="/contact" className="text-brand-green hover:underline font-bold">Contact us</a> and our team will be happy to help.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
