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
      employment: 'Employment & Economic Empowerment',
      settlement: 'Newcomer & Community Support',
      youth: 'Youth Development',
      women: 'Women & Family Empowerment',
      health: 'Health & Wellness',
      advocacy: 'Advocacy, Culture & Community Development',
      volunteer: 'Volunteering Opportunities',
      partnership: 'Partnership & Collaboration Inquiry',
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
                We love connecting with community members, so feel free to connect during business hours or send us a message below.
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
                  <div className="flex justify-between py-1">
                    <span className="font-semibold text-on-surface">Hours</span>
                    <span>09:00 – 17:00</span>
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
                      Serving communities across Toronto.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-xl mt-0.5">diversity_3</span>
                  <div>
                    <p className="font-title-md text-label-md text-on-surface font-bold">Community Focus</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Dedicated to empowering Black immigrants, youth, and families across Greater Toronto.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Small Vignette Photo */}
            <div className="mt-8 rounded-2xl overflow-hidden h-36 relative shadow-sm border border-outline-variant/30 bg-surface-container">
              <img
                src="/images/tcip-community-workshop.jpg"
                alt="TCIP Community Workshop in Toronto"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-inverse-surface/20" />
              <div className="absolute bottom-3 left-4 text-surface-container-lowest font-label-sm text-label-sm font-semibold">
                Community Gathering • Toronto, ON
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
                  <option value="employment">Employment &amp; Economic Empowerment</option>
                  <option value="settlement">Newcomer &amp; Community Support</option>
                  <option value="youth">Youth Development</option>
                  <option value="women">Women &amp; Family Empowerment</option>
                  <option value="health">Health &amp; Wellness</option>
                  <option value="advocacy">Advocacy, Culture &amp; Community Development</option>
                  <option value="volunteer">Volunteering Opportunities</option>
                  <option value="partnership">Partnership &amp; Collaboration</option>
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
                  placeholder="Tell us about yourself or your inquiry..."
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
                  Your information is kept strictly confidential.
                </span>
              </div>

              {status === 'success' && (
                <div className="mt-4 p-4 rounded-xl bg-secondary-container text-on-secondary-container font-title-md text-label-md flex items-center gap-2">
                  <span className="material-symbols-outlined">check_circle</span>
                  <span>Thank you! Your inquiry has been received. We will be in touch soon.</span>
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
