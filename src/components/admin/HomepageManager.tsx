'use client'
// ─── Admin: Home Page Editor ────────────────────────────────────────────────
// Organized to match the live public homepage top-to-bottom.
// Homepage-owned images use ImagePicker (Select from Gallery + Upload New Image).
// Programs, Stories, Events and Gallery items are referenced by ID (single source of truth).

import { useState } from 'react'
import Link from 'next/link'
import ImagePicker from '@/components/admin/ImagePicker'
import { ACCEPT_ATTR, uploadImage } from '@/lib/uploadClient'
import type { HomepageContent, PeopleCardContent } from '@/lib/homepage-defaults'

interface Option {
  id: string
  title: string
  live: boolean
  imageUrl?: string | null
}

interface GalleryOption extends Option {
  imageUrl: string
}

interface Props {
  initialContent: HomepageContent
  programs: Option[]
  events: Option[]
  stories: Option[]
  gallery: GalleryOption[]
}

const card = 'bg-white rounded-xl border border-gray-200 shadow-xs p-5 sm:p-6 space-y-4'
const input =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#16A34A]/40 focus:border-[#16A34A]'
const label = 'block text-xs font-bold text-[#4B5563] mb-1'
const hint = 'text-xs text-[#6B7280]'
const smallBtn =
  'text-xs font-semibold px-2.5 py-1 rounded-md border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40'

function moveItem<T>(arr: T[], from: number, delta: number): T[] {
  const to = from + delta
  if (to < 0 || to >= arr.length) return arr
  const next = [...arr]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

function Field({ title, children, note }: { title: string; children: React.ReactNode; note?: string }) {
  return (
    <div>
      <label className={label}>{title}</label>
      {children}
      {note && <p className={`${hint} mt-1`}>{note}</p>}
    </div>
  )
}

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className={card}>
      <div>
        <h2 className="text-base font-extrabold text-[#111827]">{title}</h2>
        <p className={hint}>{description}</p>
      </div>
      {children}
    </section>
  )
}

function MultiPick({
  options, selected, onChange, max, empty,
}: { options: Option[]; selected: string[]; onChange: (ids: string[]) => void; max: number; empty: string }) {
  const toggle = (id: string) => {
    if (selected.includes(id)) onChange(selected.filter((s) => s !== id))
    else if (selected.length < max) onChange([...selected, id])
  }
  if (options.length === 0) return <p className={hint}>{empty}</p>
  return (
    <div className="max-h-56 overflow-y-auto rounded-lg border border-gray-200 divide-y divide-gray-100">
      {options.map((o) => {
        const idx = selected.indexOf(o.id)
        return (
          <label key={o.id} className="flex items-center gap-3 px-3 py-2 text-sm cursor-pointer hover:bg-gray-50">
            <input type="checkbox" checked={idx >= 0} onChange={() => toggle(o.id)} className="accent-[#16A34A]" />
            {o.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={o.imageUrl} alt="" className="w-9 h-9 rounded object-cover border border-gray-200 shrink-0" />
            )}
            <span className="flex-1 text-[#111827] truncate">{o.title}</span>
            {!o.live && <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full shrink-0">DRAFT</span>}
            {idx >= 0 && <span className="text-[10px] font-bold text-[#15803D] shrink-0">#{idx + 1}</span>}
          </label>
        )
      })}
    </div>
  )
}

export default function HomepageManager({ initialContent, programs, events, stories, gallery }: Props) {
  const [c, setC] = useState<HomepageContent>(initialContent)
  const [galleryOpts, setGalleryOpts] = useState<GalleryOption[]>(gallery)
  const [galleryUploading, setGalleryUploading] = useState(false)
  const [galleryUploadMsg, setGalleryUploadMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null)

  const set = <K extends keyof HomepageContent>(key: K, patch: Partial<HomepageContent[K]>) =>
    setC((prev) => ({ ...prev, [key]: { ...(prev[key] as object), ...(patch as object) } as HomepageContent[K] }))

  const setPeopleCard = (which: 'volunteers' | 'advocates', patch: Partial<PeopleCardContent>) =>
    setC((prev) => ({
      ...prev,
      people: { ...prev.people, [which]: { ...prev.people[which], ...patch } },
    }))

  const slides = c.hero.slides
  const setSlide = (i: number, patch: Partial<{ imageUrl: string; caption: string }>) =>
    set('hero', { slides: slides.map((s, idx) => (idx === i ? { ...s, ...patch } : s)) })

  async function uploadToHomepageGallery(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setGalleryUploading(true)
    setGalleryUploadMsg(null)
    const r = await uploadImage(file, 'gallery', { registerInLibrary: true, publish: true })
    setGalleryUploading(false)
    if (!r.ok) {
      setGalleryUploadMsg({ ok: false, text: r.message })
      return
    }
    const item = r.media.galleryItem
    if (item) {
      setGalleryOpts((prev) => [
        { id: item.id, title: item.title || 'Untitled photo', imageUrl: item.imageUrl, live: item.published },
        ...prev,
      ])
      setC((prev) => ({
        ...prev,
        galleryItemIds: prev.galleryItemIds.length < 12 ? [...prev.galleryItemIds, item.id] : prev.galleryItemIds,
      }))
    }
    setGalleryUploadMsg({ ok: true, text: 'Photo uploaded to the Gallery and selected. Remember to save your changes.' })
  }

  async function save() {
    setSaving(true)
    setStatus(null)
    try {
      const res = await fetch('/api/admin/homepage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: c }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Save failed.')
      setC(data.content)
      setStatus({ ok: true, msg: 'Homepage saved. Changes are live on the public site.' })
    } catch (e) {
      setStatus({ ok: false, msg: (e as Error).message })
    } finally {
      setSaving(false)
    }
  }

  const selectedGalleryItems = c.galleryItemIds
    .map((id) => galleryOpts.find((g) => g.id === id))
    .filter((g): g is GalleryOption => Boolean(g))

  const selectedStory = stories.find((s) => s.id === c.featuredStoryId)
  const selectedEvent = events.find((e) => e.id === c.featuredEventId)

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">Home Page</h1>
          <p className="text-[#4B5563] text-sm mt-1">
            Manage all homepage sections and images. Blank fields automatically fall back to built-in TCIP defaults.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a href="/" target="_blank" rel="noreferrer" className="text-xs font-semibold px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50">
            View site
          </a>
          <button onClick={save} disabled={saving} className="text-xs font-bold px-5 py-2.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white disabled:opacity-60">
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>

      {status && (
        <div role="status" className={`rounded-xl px-4 py-3 text-sm font-medium ${status.ok ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {status.msg}
        </div>
      )}

      {/* 1. HERO */}
      <Section title="1. Hero" description="Main headline, buttons, and slideshow at the top of the homepage.">
        <Field title="Heading"><input className={input} value={c.hero.heading} onChange={(e) => set('hero', { heading: e.target.value })} /></Field>
        <Field title="Supporting text"><textarea rows={3} className={input} value={c.hero.text} onChange={(e) => set('hero', { text: e.target.value })} /></Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field title="Primary button label"><input className={input} value={c.hero.primaryLabel} onChange={(e) => set('hero', { primaryLabel: e.target.value })} /></Field>
          <Field title="Primary button link"><input className={input} value={c.hero.primaryHref} onChange={(e) => set('hero', { primaryHref: e.target.value })} /></Field>
          <Field title="Secondary button label (optional)" note="Clear both secondary fields to hide the button."><input className={input} value={c.hero.secondaryLabel} onChange={(e) => set('hero', { secondaryLabel: e.target.value })} /></Field>
          <Field title="Secondary button link (optional)"><input className={input} value={c.hero.secondaryHref} onChange={(e) => set('hero', { secondaryHref: e.target.value })} /></Field>
        </div>
        <div className="space-y-3 pt-2">
          <p className={label}>Hero slideshow images (leave empty to use the built-in default slideshow; Slide 1 is primary)</p>
          {slides.map((s, i) => (
            <div key={i} className="rounded-lg border border-gray-200 p-3.5 space-y-3 bg-gray-50/40">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-extrabold text-[#111827]">
                  Slide {i + 1} {i === 0 ? '(Primary)' : ''}
                </span>
                <div className="flex items-center gap-1.5">
                  <button type="button" className={smallBtn} disabled={i === 0}
                    onClick={() => set('hero', { slides: moveItem(slides, i, -1) })}>Move Up</button>
                  <button type="button" className={smallBtn} disabled={i === slides.length - 1}
                    onClick={() => set('hero', { slides: moveItem(slides, i, 1) })}>Move Down</button>
                  <button type="button" className="text-xs font-semibold text-red-600 px-2 py-1"
                    onClick={() => set('hero', { slides: slides.filter((_, idx) => idx !== i) })}>Remove</button>
                </div>
              </div>
              <ImagePicker label="Slide image" value={s.imageUrl} purpose="homepage" onChange={(v) => setSlide(i, { imageUrl: v })} />
              <Field title="Caption (optional, also used as alt text)"><input className={input} value={s.caption} onChange={(e) => setSlide(i, { caption: e.target.value })} /></Field>
            </div>
          ))}
          {slides.length < 6 && (
            <button type="button" className="text-xs font-bold px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
              onClick={() => set('hero', { slides: [...slides, { imageUrl: '', caption: '' }] })}>
              + Add slide
            </button>
          )}
        </div>
      </Section>

      {/* 2. ABOUT / WHO WE ARE */}
      <Section title="2. About / Who We Are" description="Heading, summary, and photo for the About section.">
        <Field title="Section heading"><input className={input} value={c.about.heading} onChange={(e) => set('about', { heading: e.target.value })} /></Field>
        <Field title="Short summary"><textarea rows={4} className={input} value={c.about.summary} onChange={(e) => set('about', { summary: e.target.value })} /></Field>
        <ImagePicker label="About photo" value={c.about.imageUrl} purpose="homepage" resetLabel="Reset to default"
          onChange={(v) => set('about', { imageUrl: v })} alt={c.about.imageAlt} onAltChange={(v) => set('about', { imageAlt: v })} />
      </Section>

      {/* 3. SERVICES / PROGRAMS DISPLAY */}
      <Section title="3. Services / Programs Display" description="Select which existing Programs appear on the homepage. Program images are managed in Programs (Services).">
        <MultiPick options={programs} selected={c.featuredProgramIds} onChange={(ids) => setC({ ...c, featuredProgramIds: ids })} max={8} empty="No programs yet. Add one in Programs (Services)." />
        <p className={hint}>
          Leave none checked to automatically display your published Programs. To edit a Program&apos;s image or text, open{' '}
          <Link href="/admin/programs" className="text-[#16A34A] font-semibold underline">Programs (Services)</Link>.
        </p>
      </Section>

      {/* 4. IMPACT */}
      <Section title="4. Impact" description="Large visual anchor card in the Community Impact section.">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field title="Badge label"><input className={input} value={c.impact.badge} onChange={(e) => set('impact', { badge: e.target.value })} /></Field>
          <Field title="Card heading"><input className={input} value={c.impact.heading} onChange={(e) => set('impact', { heading: e.target.value })} /></Field>
        </div>
        <Field title="Description"><textarea rows={3} className={input} value={c.impact.description} onChange={(e) => set('impact', { description: e.target.value })} /></Field>
        <ImagePicker label="Impact card image" value={c.impact.imageUrl} purpose="homepage" resetLabel="Reset to default"
          onChange={(v) => set('impact', { imageUrl: v })} alt={c.impact.imageAlt} onAltChange={(v) => set('impact', { imageAlt: v })} />
      </Section>

      {/* 5. OUR PEOPLE / LEADERSHIP */}
      <Section title="5. Our People / Leadership" description="All three cards in the “Our People” section are independently editable.">
        {/* Card 1: Founder */}
        <div className="rounded-xl border border-gray-200 p-4 space-y-3 bg-gray-50/40">
          <h3 className="text-sm font-extrabold text-[#111827]">Card 1 — Founder &amp; Community Leadership</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field title="Heading"><input className={input} value={c.founder.heading} onChange={(e) => set('founder', { heading: e.target.value })} /></Field>
            <Field title="Founder name"><input className={input} value={c.founder.name} onChange={(e) => set('founder', { name: e.target.value })} /></Field>
          </div>
          <Field title="Description / short bio"><textarea rows={3} className={input} value={c.founder.bio} onChange={(e) => set('founder', { bio: e.target.value })} /></Field>
          <ImagePicker label="Founder image" value={c.founder.imageUrl} purpose="homepage" resetLabel="Reset to default"
            onChange={(v) => set('founder', { imageUrl: v })} alt={c.founder.imageAlt} onAltChange={(v) => set('founder', { imageAlt: v })} />
        </div>

        {/* Card 2: Volunteers & Peer Mentors */}
        <div className="rounded-xl border border-gray-200 p-4 space-y-3 bg-gray-50/40">
          <h3 className="text-sm font-extrabold text-[#111827]">Card 2 — Volunteers &amp; Peer Mentors</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field title="Heading"><input className={input} value={c.people.volunteers.heading} onChange={(e) => setPeopleCard('volunteers', { heading: e.target.value })} /></Field>
            <Field title="Subtitle"><input className={input} value={c.people.volunteers.subtitle} onChange={(e) => setPeopleCard('volunteers', { subtitle: e.target.value })} /></Field>
          </div>
          <Field title="Description"><textarea rows={3} className={input} value={c.people.volunteers.description} onChange={(e) => setPeopleCard('volunteers', { description: e.target.value })} /></Field>
          <ImagePicker label="Volunteers card image" value={c.people.volunteers.imageUrl} purpose="homepage" resetLabel="Reset to default"
            onChange={(v) => setPeopleCard('volunteers', { imageUrl: v })} alt={c.people.volunteers.imageAlt} onAltChange={(v) => setPeopleCard('volunteers', { imageAlt: v })} />
        </div>

        {/* Card 3: Community Advocates & Supporters */}
        <div className="rounded-xl border border-gray-200 p-4 space-y-3 bg-gray-50/40">
          <h3 className="text-sm font-extrabold text-[#111827]">Card 3 — Community Advocates &amp; Supporters</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field title="Heading"><input className={input} value={c.people.advocates.heading} onChange={(e) => setPeopleCard('advocates', { heading: e.target.value })} /></Field>
            <Field title="Subtitle"><input className={input} value={c.people.advocates.subtitle} onChange={(e) => setPeopleCard('advocates', { subtitle: e.target.value })} /></Field>
          </div>
          <Field title="Description"><textarea rows={3} className={input} value={c.people.advocates.description} onChange={(e) => setPeopleCard('advocates', { description: e.target.value })} /></Field>
          <ImagePicker label="Advocates card image" value={c.people.advocates.imageUrl} purpose="homepage" resetLabel="Reset to default"
            onChange={(v) => setPeopleCard('advocates', { imageUrl: v })} alt={c.people.advocates.imageAlt} onAltChange={(v) => setPeopleCard('advocates', { imageAlt: v })} />
        </div>
      </Section>

      {/* 6. HOMEPAGE GALLERY */}
      <Section title="6. Homepage Gallery (“The Work of TCIP in Photos”)" description="Choose and order existing Gallery photos for the homepage. Removing a photo here does not delete it from the Gallery.">
        {selectedGalleryItems.length > 0 && (
          <div className="space-y-2">
            <p className={label}>Selected homepage order ({selectedGalleryItems.length}/12)</p>
            <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-gray-50/40">
              {selectedGalleryItems.map((item, i) => (
                <li key={item.id} className="flex items-center gap-3 p-2.5">
                  <span className="text-xs font-bold text-[#6B7280] w-5 text-center">#{i + 1}</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.imageUrl} alt="" className="w-12 h-10 rounded object-cover border border-gray-200 shrink-0" />
                  <span className="flex-1 text-xs font-semibold text-[#111827] truncate">{item.title}</span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button type="button" className={smallBtn} disabled={i === 0}
                      onClick={() => setC({ ...c, galleryItemIds: moveItem(c.galleryItemIds, i, -1) })}>↑</button>
                    <button type="button" className={smallBtn} disabled={i === selectedGalleryItems.length - 1}
                      onClick={() => setC({ ...c, galleryItemIds: moveItem(c.galleryItemIds, i, 1) })}>↓</button>
                    <button type="button" className="text-xs font-semibold text-red-600 px-2 py-1"
                      onClick={() => setC({ ...c, galleryItemIds: c.galleryItemIds.filter((id) => id !== item.id) })}>Remove</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <MultiPick options={galleryOpts} selected={c.galleryItemIds} onChange={(ids) => setC({ ...c, galleryItemIds: ids })} max={12} empty="No Gallery images available yet. Upload one below." />

        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg bg-[#16A34A] text-white hover:bg-[#15803D] cursor-pointer focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#16A34A]">
            {galleryUploading ? 'Uploading…' : 'Upload New Image'}
            <input type="file" accept={ACCEPT_ATTR} className="sr-only" disabled={galleryUploading} onChange={uploadToHomepageGallery} aria-label="Upload a new photo to the Gallery from your computer" />
          </label>
          <span className={hint}>Uploads to Gallery (published) and adds it to the homepage selection.</span>
        </div>
        {galleryUploadMsg && (
          <p role={galleryUploadMsg.ok ? 'status' : 'alert'} className={`text-xs font-medium ${galleryUploadMsg.ok ? 'text-green-700' : 'text-red-600'}`}>{galleryUploadMsg.text}</p>
        )}
      </Section>

      {/* 7. FEATURED STORY */}
      <Section title="7. Featured Story / Blog" description="Select an existing News/Blog story to feature. Its image and text come directly from News (Blog).">
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          {selectedStory?.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={selectedStory.imageUrl} alt="" className="w-24 h-16 rounded-lg object-cover border border-gray-200 shrink-0" />
          )}
          <div className="flex-1 w-full">
            <Field title="Featured Story">
              <select className={input} value={c.featuredStoryId} onChange={(e) => setC({ ...c, featuredStoryId: e.target.value })}>
                <option value="">Automatic (latest featured / published story)</option>
                {stories.map((s) => (
                  <option key={s.id} value={s.id}>{s.title}{s.live ? '' : ' (draft)'}</option>
                ))}
              </select>
            </Field>
            <p className={`${hint} mt-1.5`}>
              To update a story&apos;s image, edit it in{' '}
              <Link href="/admin/news" className="text-[#16A34A] font-semibold underline">News (Blog)</Link>.
            </p>
          </div>
        </div>
      </Section>

      {/* 8. FEATURED EVENT */}
      <Section title="8. Featured Event" description="Select an existing Event to feature first. Its image and details come directly from Events.">
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          {selectedEvent?.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={selectedEvent.imageUrl} alt="" className="w-24 h-16 rounded-lg object-cover border border-gray-200 shrink-0" />
          )}
          <div className="flex-1 w-full">
            <Field title="Featured Event">
              <select className={input} value={c.featuredEventId} onChange={(e) => setC({ ...c, featuredEventId: e.target.value })}>
                <option value="">Automatic (next published event)</option>
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>{ev.title}{ev.live ? '' : ' (draft)'}</option>
                ))}
              </select>
            </Field>
            <p className={`${hint} mt-1.5`}>
              To update an event&apos;s image, edit it in{' '}
              <Link href="/admin/events" className="text-[#16A34A] font-semibold underline">Events</Link>.
            </p>
          </div>
        </div>
      </Section>

      {/* 9. CTA / GET INVOLVED & CONTACT PHOTO */}
      <Section title="9. CTA / Get Involved &amp; Contact Photo" description="Heading/text for Get Involved and the community photo in the Contact section.">
        <Field title="CTA heading"><input className={input} value={c.cta.heading} onChange={(e) => set('cta', { heading: e.target.value })} /></Field>
        <Field title="Supporting text"><textarea rows={3} className={input} value={c.cta.text} onChange={(e) => set('cta', { text: e.target.value })} /></Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field title="Button label (optional)"><input className={input} value={c.cta.buttonLabel} onChange={(e) => set('cta', { buttonLabel: e.target.value })} /></Field>
          <Field title="Button link"><input className={input} placeholder="/get-involved" value={c.cta.buttonHref} onChange={(e) => set('cta', { buttonHref: e.target.value })} /></Field>
        </div>
        <div className="pt-3 border-t border-gray-100 space-y-3">
          <ImagePicker label="Contact section vignette photo" value={c.contact.imageUrl} purpose="homepage" resetLabel="Reset to default"
            onChange={(v) => set('contact', { imageUrl: v })} alt={c.contact.imageAlt} onAltChange={(v) => set('contact', { imageAlt: v })} />
          <Field title="Contact photo caption"><input className={input} value={c.contact.caption} onChange={(e) => set('contact', { caption: e.target.value })} /></Field>
        </div>
      </Section>

      <div className="flex justify-end pb-8">
        <button onClick={save} disabled={saving} className="text-sm font-bold px-6 py-3 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white disabled:opacity-60">
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </div>
  )
}
