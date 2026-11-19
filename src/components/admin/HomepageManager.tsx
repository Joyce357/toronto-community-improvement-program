'use client'
// ─── Admin: Home Page Editor ────────────────────────────────────────────────
// Simple form for the key homepage sections. Featured Programs / Events /
// Stories / Gallery items are chosen from existing records (never duplicated).

import { useState } from 'react'
import type { HomepageContent } from '@/lib/homepage-defaults'

interface Option { id: string; title: string; live: boolean }
interface GalleryOption extends Option { imageUrl: string }

interface Props {
  initialContent: HomepageContent
  programs: Option[]
  events: Option[]
  stories: Option[]
  gallery: GalleryOption[]
}

const card = 'bg-white rounded-xl border border-gray-200 shadow-xs p-6 space-y-4'
const input =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#16A34A]/40 focus:border-[#16A34A]'
const label = 'block text-xs font-bold text-[#4B5563] mb-1'
const hint = 'text-xs text-[#6B7280]'

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

function ImageField({
  title, value, onChange, gallery,
}: { title: string; value: string; onChange: (v: string) => void; gallery: GalleryOption[] }) {
  return (
    <div>
      <label className={label}>{title}</label>
      <div className="flex gap-3 items-start">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="w-20 h-20 rounded-lg object-cover border border-gray-200 shrink-0" />
        ) : (
          <div className="w-20 h-20 rounded-lg bg-gray-100 border border-dashed border-gray-300 shrink-0" />
        )}
        <div className="flex-1 space-y-2">
          <select
            className={input}
            value=""
            onChange={(e) => e.target.value && onChange(e.target.value)}
          >
            <option value="">Choose from Gallery images…</option>
            {gallery.map((g) => (
              <option key={g.id} value={g.imageUrl}>{g.title}</option>
            ))}
          </select>
          <input
            className={input}
            placeholder="…or paste an image URL / site path (e.g. /images/photo.jpg)"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </div>
    </div>
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
            <span className="flex-1 text-[#111827]">{o.title}</span>
            {!o.live && <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">NOT PUBLISHED</span>}
            {idx >= 0 && <span className="text-[10px] font-bold text-[#15803D]">#{idx + 1}</span>}
          </label>
        )
      })}
    </div>
  )
}

export default function HomepageManager({ initialContent, programs, events, stories, gallery }: Props) {
  const [c, setC] = useState<HomepageContent>(initialContent)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null)

  const set = <K extends keyof HomepageContent>(key: K, patch: Partial<HomepageContent[K]>) =>
    setC((prev) => ({ ...prev, [key]: { ...(prev[key] as object), ...(patch as object) } as HomepageContent[K] }))

  const slides = c.hero.slides
  const setSlide = (i: number, patch: Partial<{ imageUrl: string; caption: string }>) =>
    set('hero', { slides: slides.map((s, idx) => (idx === i ? { ...s, ...patch } : s)) })

  const featuredOptions: Option[] = c.featuredEvent.type === 'story' ? stories : events

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

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">Home Page</h1>
          <p className="text-[#4B5563] text-sm mt-1">
            Edit the key homepage sections. Blank fields use the built-in TCIP defaults.
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
        <div className={`rounded-xl px-4 py-3 text-sm font-medium ${status.ok ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {status.msg}
        </div>
      )}

      <Section title="1. Hero" description="Main headline area at the top of the homepage.">
        <Field title="Heading"><input className={input} value={c.hero.heading} onChange={(e) => set('hero', { heading: e.target.value })} /></Field>
        <Field title="Supporting text"><textarea rows={3} className={input} value={c.hero.text} onChange={(e) => set('hero', { text: e.target.value })} /></Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field title="Primary button label"><input className={input} value={c.hero.primaryLabel} onChange={(e) => set('hero', { primaryLabel: e.target.value })} /></Field>
          <Field title="Primary button link"><input className={input} value={c.hero.primaryHref} onChange={(e) => set('hero', { primaryHref: e.target.value })} /></Field>
          <Field title="Secondary button label (optional)" note="Clear both secondary fields to hide the button."><input className={input} value={c.hero.secondaryLabel} onChange={(e) => set('hero', { secondaryLabel: e.target.value })} /></Field>
          <Field title="Secondary button link (optional)"><input className={input} value={c.hero.secondaryHref} onChange={(e) => set('hero', { secondaryHref: e.target.value })} /></Field>
        </div>
        <div className="space-y-3">
          <p className={label}>Hero slideshow images (leave empty to use the default slideshow)</p>
          {slides.map((s, i) => (
            <div key={i} className="rounded-lg border border-gray-200 p-3 space-y-3">
              <ImageField title={`Slide ${i + 1} image`} value={s.imageUrl} gallery={gallery} onChange={(v) => setSlide(i, { imageUrl: v })} />
              <Field title="Caption (optional)"><input className={input} value={s.caption} onChange={(e) => setSlide(i, { caption: e.target.value })} /></Field>
              <button type="button" className="text-xs font-semibold text-red-600" onClick={() => set('hero', { slides: slides.filter((_, idx) => idx !== i) })}>Remove slide</button>
            </div>
          ))}
          {slides.length < 6 && (
            <button type="button" className="text-xs font-bold px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50" onClick={() => set('hero', { slides: [...slides, { imageUrl: '', caption: '' }] })}>
              + Add slide
            </button>
          )}
        </div>
      </Section>

      <Section title="2. About / Who We Are" description="Heading, short summary and photo for the About section.">
        <Field title="Section heading"><input className={input} value={c.about.heading} onChange={(e) => set('about', { heading: e.target.value })} /></Field>
        <Field title="Short summary"><textarea rows={4} className={input} value={c.about.summary} onChange={(e) => set('about', { summary: e.target.value })} /></Field>
        <ImageField title="Image (optional)" value={c.about.imageUrl} gallery={gallery} onChange={(v) => set('about', { imageUrl: v })} />
      </Section>

      <Section title="3. Featured Services / Programs" description="Pick existing Programs to show on the homepage (up to 8, in the order selected). Leave none selected to show the default cards.">
        <MultiPick options={programs} selected={c.featuredProgramIds} onChange={(ids) => setC({ ...c, featuredProgramIds: ids })} max={8} empty="No programs yet. Add one in Programs first." />
        <p className={hint}>Only published programs appear publicly. Manage programs in Programs (Services).</p>
      </Section>

      <Section title="4. Featured Event / Story" description="Feature one existing Event or News story. Leave on “None” to use the default.">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field title="Type">
            <select className={input} value={c.featuredEvent.type} onChange={(e) => setC({ ...c, featuredEvent: { type: e.target.value as HomepageContent['featuredEvent']['type'], id: '' } })}>
              <option value="">None (use default)</option>
              <option value="event">Event</option>
              <option value="story">Story / News (Blog)</option>
            </select>
          </Field>
          {c.featuredEvent.type && (
            <Field title="Item">
              <select className={input} value={c.featuredEvent.id} onChange={(e) => setC({ ...c, featuredEvent: { ...c.featuredEvent, id: e.target.value } })}>
                <option value="">Select…</option>
                {featuredOptions.map((o) => (
                  <option key={o.id} value={o.id}>{o.title}{o.live ? '' : ' (not published)'}</option>
                ))}
              </select>
            </Field>
          )}
        </div>
      </Section>

      <Section title="5. Founder" description="Founder card in the “Our People” section.">
        <Field title="Heading"><input className={input} value={c.founder.heading} onChange={(e) => set('founder', { heading: e.target.value })} /></Field>
        <Field title="Founder name"><input className={input} value={c.founder.name} onChange={(e) => set('founder', { name: e.target.value })} /></Field>
        <Field title="Short bio"><textarea rows={4} className={input} value={c.founder.bio} onChange={(e) => set('founder', { bio: e.target.value })} /></Field>
        <ImageField title="Founder image" value={c.founder.imageUrl} gallery={gallery} onChange={(v) => set('founder', { imageUrl: v })} />
      </Section>

      <Section title="6. Homepage Gallery" description="Choose existing Gallery photos to feature (up to 12). Leave none selected to show the default photos.">
        <MultiPick options={gallery} selected={c.galleryItemIds} onChange={(ids) => setC({ ...c, galleryItemIds: ids })} max={12} empty="No gallery photos yet. Upload some in Gallery first." />
        <p className={hint}>Only published photos appear publicly. Upload and manage photos in Gallery.</p>
      </Section>

      <Section title="7. Call-to-Action Section" description="Heading and text for the “Get Involved” section. The button is optional.">
        <Field title="Heading"><input className={input} value={c.cta.heading} onChange={(e) => set('cta', { heading: e.target.value })} /></Field>
        <Field title="Supporting text"><textarea rows={3} className={input} value={c.cta.text} onChange={(e) => set('cta', { text: e.target.value })} /></Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field title="Button label (optional)"><input className={input} value={c.cta.buttonLabel} onChange={(e) => set('cta', { buttonLabel: e.target.value })} /></Field>
          <Field title="Button link"><input className={input} placeholder="/get-involved" value={c.cta.buttonHref} onChange={(e) => set('cta', { buttonHref: e.target.value })} /></Field>
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

