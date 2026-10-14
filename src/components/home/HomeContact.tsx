'use client'

import { useState } from 'react'

export default function HomeContact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    source: '',
    interest: 'settlement',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    setErrorMessage('')

    const interestLabels: Record<string, string> = {
      settlement: 'Newcomer Settlement & Housing Guidance',
      employment: 'Job Readiness & Career Mentorship',
      youth: 'Youth STEM & Creative Media Academy',
      health: 'Community Dental & Health Screenings',
      volunteer: 'Volunteering Opportunities',
      partnership: 'Corporate / Institutional Partnership',
    }

    const subject = `${interestLabels[formData.interest] || 'Community Inquiry'}${
      formData.source ? ` [Via: ${formData.source}]` : ''
    }`

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject,
          message: formData.message,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to submit form')
      }

      setStatus('success')
      setFormData({
        name: '',
        email: '',
        source: '',
        interest: 'settlement',
        message: '',
      })
      setTimeout(() => {
        setStatus('idle')
      }, 7000)
    } catch (err: unknown) {
      setStatus('error')
      setErrorMessage((err as Error)?.message || 'Something went wrong. Please try again.')
    }
  }

  return (
    <section id="contact" className="w-full bg-surface-bright py-space-3xl scroll-mt-20 border-b border-outline-variant/30">
      <div className="max-w-7xl mx-auto px-4 md:px-margin-desktop">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop">
          
          {/* Left: Operating Hours & Direct Office Details (45% / 5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <span className="font-eyebrow-bold text-eyebrow-bold text-primary uppercase tracking-widest block mb-2">
                SEE US IN PERSON
              </span>
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface leading-tight">
                Contact Us &amp; Operating Hours
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-3 leading-relaxed">
                We love our contacts, so feel free to visit during normal business hours or drop us an email anytime.
              </p>

              {/* Hours Card */}
              <div className="bg-surface-container-low rounded-2xl p-6 mt-6 shadow-sm border border-outline-variant/30">
                <div className="flex items-center gap-3 mb-3">
                  <span className="material-symbols-outlined text-primary text-2xl">schedule</span>
                  <h4 className="font-title-md text-title-md text-on-surface font-bold">
                    Operating Hours
                  </h4>
                </div>
                <div className="space-y-1.5 font-body-sm text-body-sm text-on-surface-variant">
                  <div className="flex justify-between py-1 border-b border-outline-variant/20">
                    <span className="font-semibold text-on-surface">Monday – Friday</span>
                    <span>09:00 – 17:00 EST</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="font-semibold text-on-surface">Saturday – Sunday</span>
                    <span className="text-tertiary font-semibold">Closed (Community Events by RSVP)</span>
                  </div>
                </div>
              </div>

              {/* Direct Contact Points */}
              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-xl mt-0.5">location_on</span>
                  <div>
                    <p className="font-title-md text-label-md text-on-surface font-bold">Serving Greater Toronto</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Scarborough • North York • Rexdale • Downtown Hubs
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-xl mt-0.5">mail</span>
                  <div>
                    <p className="font-title-md text-label-md text-on-surface font-bold">Direct Email</p>
                    <a
                      className="font-body-sm text-body-sm text-primary hover:underline"
                      href="mailto:contact@torontocip.com"
                    >
                      contact@torontocip.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-xl mt-0.5">verified_user</span>
                  <div>
                    <p className="font-title-md text-label-md text-on-surface font-bold">Non-Profit Status</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Registered Canadian Non-Profit Entity • Ontario, Canada
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Small Vignette Photo */}
            <div className="mt-8 rounded-2xl overflow-hidden h-36 relative shadow-sm border border-outline-variant/30 bg-surface-container">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKZlbHdWez1duqIwaJCN2S-TnfclQAuRqC7bNuJneWPCZ3V1oTiZMtQKhg1UGWAf9uyu4SfxMzMFOSpJqeUPIV8NfiNT4jxjcGl_SOZ5FMwJcq-AIqt9sWAtnY3_Pf1IzzenlTE_j0jYLCZYVGO0BLLA2-WxQiWfkiGDAO76S4rN3EuFAF2fqDi2xjuT_lSkYftxbEKvNjCaqzHpJnII-j8c0iwkBT87GhJEzkBUq2IRlVWTkSAnzN"
                alt="TCIP Office Welcome Desk in Toronto"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement
                  if (target.src !== '/images/tcip-community-workshop.jpg') {
                    target.src = '/images/tcip-community-workshop.jpg'
                  }
                }}
              />
              <div className="absolute inset-0 bg-inverse-surface/20" />
              <div className="absolute bottom-3 left-4 text-surface-container-lowest font-label-sm text-label-sm font-semibold">
                Community Welcome Centre • Toronto, ON
              </div>
            </div>
          </div>

          {/* Right: Interactive Intake / Message Form (55% / 7 cols) */}
          <div className="lg:col-span-7 bg-surface-container-low rounded-3xl p-8 md:p-10 shadow-sm border border-outline-variant/30">
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Drop Us a Line!
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 mb-6">
              Have a question, need settlement support, or want to explore partnership opportunities? We&apos;ll get back to you within 24–48 hours.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-1.5" htmlFor="contact-name">
                    Full Name *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Amara Johnson"
                    className="w-full h-12 px-4 rounded-xl bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary shadow-xs border border-outline-variant/30"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-1.5" htmlFor="contact-email">
                    Email Address *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. amara@example.com"
                    className="w-full h-12 px-4 rounded-xl bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary shadow-xs border border-outline-variant/30"
                  />
                </div>
              </div>

              {/* Source Dropdown */}
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-1.5" htmlFor="contact-source">
                  How did you hear about TCIP? *
                </label>
                <select
                  id="contact-source"
                  required
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary shadow-xs border border-outline-variant/30"
                >
                  <option value="" disabled>Select an option...</option>
                  <option value="Community Referral / Friend">Community Referral / Friend</option>
                  <option value="School / University Outreach">School / University Outreach</option>
                  <option value="Social Media / News">Social Media / News</option>
                  <option value="Annual Job Fair / Workshop">Annual Job Fair / Workshop</option>
                  <option value="Corporate / Civic Partner">Corporate / Civic Partner</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Interest Dropdown */}
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-1.5" htmlFor="contact-interest">
                  What can we help you with?
                </label>
                <select
                  id="contact-interest"
                  value={formData.interest}
                  onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary shadow-xs border border-outline-variant/30"
                >
                  <option value="settlement">Newcomer Settlement &amp; Housing Guidance</option>
                  <option value="employment">Job Readiness &amp; Career Mentorship</option>
                  <option value="youth">Youth STEM &amp; Creative Media Academy</option>
                  <option value="health">Community Dental &amp; Health Screenings</option>
                  <option value="volunteer">Volunteering Opportunities</option>
                  <option value="partnership">Corporate / Institutional Partnership</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-1.5" htmlFor="contact-msg">
                  Your Message *
                </label>
                <textarea
                  id="contact-msg"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about yourself or your family's needs..."
                  className="w-full p-4 rounded-xl bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary shadow-xs resize-none border border-outline-variant/30"
                />
              </div>

              {/* Submit Button & Disclaimer */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-container text-on-primary font-title-md text-title-md px-8 py-3.5 rounded-full shadow-sm hover:shadow transition-all duration-200 disabled:opacity-50"
                >
                  <span>{status === 'submitting' ? 'Sending...' : 'Send Message'}</span>
                  <span className="material-symbols-outlined text-lg">send</span>
                </button>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Confidentiality guaranteed under Canadian PIPEDA standards.
                </span>
              </div>

              {status === 'success' && (
                <div className="mt-4 p-4 rounded-xl bg-secondary-container text-on-secondary-container font-title-md text-label-md flex items-center gap-2">
                  <span className="material-symbols-outlined">check_circle</span>
                  <span>Thank you! Your inquiry has been sent to our community intake coordinator.</span>
                </div>
              )}

              {status === 'error' && (
                <div className="mt-4 p-4 rounded-xl bg-error-container text-on-error-container font-title-md text-label-md flex items-center gap-2">
                  <span className="material-symbols-outlined">error</span>
                  <span>{errorMessage}</span>
                </div>
              )}
            </form>
          </div>

        </div>
      </div>
    </section>
  )
}
