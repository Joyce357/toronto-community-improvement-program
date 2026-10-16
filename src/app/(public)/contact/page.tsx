// ─── Contact Page ─────────────────────────────────────────────────────────
import type { Metadata } from 'next'
import Link from 'next/link'
import ContactForm from '@/components/forms/ContactForm'
import { getSiteSettings } from '@/lib/settings'
import { getCanonicalUrl } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Toronto Community Improvement Program (TCIP). We would love to hear from you regarding community programs, volunteering, and partnerships.',
  alternates: { canonical: getCanonicalUrl('/contact') },
  openGraph: { url: getCanonicalUrl('/contact') },
}

export default async function ContactPage() {
  const settings = await getSiteSettings()

  return (
    <>
      {/* Hero */}
      <section className="bg-brand-cream dark:bg-dark-bg section-py text-brand-black dark:text-white relative overflow-hidden transition-colors duration-200 border-b border-border-soft dark:border-dark-border">
        <div className="container-site text-center relative z-10">
          <p className="eyebrow text-brand-green mb-3">Get in Touch</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-brand-black dark:text-white mb-4 text-balance tracking-tight">
            Contact TCIP
          </h1>
          <p className="text-text-secondary dark:text-dark-text-secondary text-base sm:text-lg max-w-xl mx-auto">
            Have a question, a neighborhood partnership idea, or want to get involved with our programs? We would love to connect with you.
          </p>
        </div>
      </section>

      {/* Contact section */}
      <section className="section-py bg-brand-warm-white dark:bg-dark-bg transition-colors duration-200">
        <div className="container-tcip">
          <div className="grid lg:grid-cols-5 gap-12 items-start">

            {/* Left: Form */}
            <div className="lg:col-span-3">
              <div className="bg-brand-warm-white dark:bg-dark-card rounded-2xl shadow-card border border-border-soft dark:border-dark-border p-6 sm:p-8 md:p-10">
                <h2 className="text-2xl font-extrabold text-brand-navy dark:text-dark-text-primary mb-6 tracking-tight">Send Us a Message</h2>
                <ContactForm />
              </div>
            </div>

            {/* Right: Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-brand-warm-white dark:bg-dark-card rounded-2xl shadow-card border border-border-soft dark:border-dark-border p-6">
                <h3 className="font-bold text-brand-navy dark:text-dark-text-primary mb-4 text-lg">Other Ways to Reach Us</h3>
                <ul className="space-y-4 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="text-lg mt-0.5">📍</span>
                    <div>
                      <p className="font-bold text-brand-navy dark:text-dark-text-primary">Location</p>
                      <p className="text-text-secondary dark:text-dark-text-secondary">{settings.publicLocationLabel || 'Toronto, Ontario'}</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-lg mt-0.5">🕒</span>
                    <div>
                      <p className="font-bold text-brand-navy dark:text-dark-text-primary">Business Hours</p>
                      <p className="text-text-secondary dark:text-dark-text-secondary">09:00 – 17:00</p>
                    </div>
                  </li>
                  {settings.phone && (
                    <li className="flex items-start gap-3">
                      <span className="text-lg mt-0.5">📞</span>
                      <div>
                        <p className="font-bold text-brand-navy dark:text-dark-text-primary">Phone</p>
                        <p className="text-text-secondary dark:text-dark-text-secondary">
                          <a href={`tel:${settings.phone}`} className="hover:text-brand-green dark:hover:text-brand-cyan transition-colors">
                            {settings.phone}
                          </a>
                        </p>
                      </div>
                    </li>
                  )}
                </ul>
              </div>

              <div className="bg-brand-sky/40 dark:bg-dark-surface rounded-2xl p-6 border border-brand-cyan/20 dark:border-dark-border">
                <h3 className="font-bold text-brand-navy dark:text-dark-text-primary mb-2">Looking to Volunteer?</h3>
                <p className="text-text-secondary dark:text-dark-text-secondary text-sm mb-4 leading-relaxed">
                  If you want to volunteer, check out our volunteer opportunities and application form.
                </p>
                <Link
                  href="/volunteer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-green dark:text-brand-cyan hover:text-brand-navy dark:hover:text-dark-text-primary transition-colors"
                >
                  Volunteer with us →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
