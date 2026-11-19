'use client'

import { useState, useRef, ChangeEvent } from 'react'
import { uploadImage } from '@/lib/uploadClient'
import Image from 'next/image'
import StatusBadge from '@/components/admin/StatusBadge'
import EmptyState from '@/components/admin/EmptyState'
import { PROGRAM_CATEGORIES } from '@/lib/validations'
import type { Program } from '@/types'

interface ProgramsManagerProps {
  initialPrograms: Program[]
  totalCount: number
}

interface FormState {
  id?: string
  title: string
  slug: string
  category: string
  shortDescription: string
  description: string
  imageUrl: string
  featured: boolean
  displayOrder: number
  status: 'DRAFT' | 'PUBLISHED'
}

const emptyForm: FormState = {
  title: '',
  slug: '',
  category: 'Employment & Economic Empowerment',
  shortDescription: '',
  description: '',
  imageUrl: '',
  featured: false,
  displayOrder: 1,
  status: 'DRAFT',
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function ProgramsManager({
  initialPrograms,
  totalCount,
}: ProgramsManagerProps) {
  const [programs, setPrograms] = useState<Program[]>(initialPrograms)
  const [total, setTotal] = useState(totalCount)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFT'>('ALL')
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL')

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<FormState>(emptyForm)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [autoSlug, setAutoSlug] = useState(true)

  // Image Upload state
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<Program | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Feedback notification
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showFeedback = (message: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ message, type })
    setTimeout(() => setFeedback(null), 4000)
  }

  // Open Create Modal
  const handleOpenCreate = () => {
    setIsEditing(false)
    setFormData({
      ...emptyForm,
      displayOrder: programs.length + 1,
    })
    setFormErrors({})
    setAutoSlug(true)
    setIsModalOpen(true)
  }

  // Open Edit Modal
  const handleOpenEdit = (p: Program) => {
    setIsEditing(true)
    setFormData({
      id: p.id,
      title: p.title,
      slug: p.slug,
      category: p.category || 'Employment & Economic Empowerment',
      shortDescription: p.shortDescription,
      description: p.description,
      imageUrl: p.imageUrl ?? '',
      featured: p.featured,
      displayOrder: p.displayOrder,
      status: p.status,
    })
    setFormErrors({})
    setAutoSlug(false)
    setIsModalOpen(true)
  }

  // Handle Title change with optional auto-slug
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setFormData((prev) => ({
      ...prev,
      title,
      slug: autoSlug ? slugify(title) : prev.slug,
    }))
  }

  // Handle Image Upload to Cloudinary
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setFormErrors((prev) => ({ ...prev, image: 'Please choose a JPEG, PNG, or WebP image.' }))
      return
    }

    setUploadingImage(true)
    setFormErrors((prev) => {
      const next = { ...prev }
      delete next.image
      return next
    })

    try {
      const result = await uploadImage(file, 'programs')
      if (!result.ok) {
        setFormErrors((prev) => ({ ...prev, image: result.message }))
      } else {
        const media = result.media
        setFormData((prev) => ({ ...prev, imageUrl: media.url }))
      }
    } catch {
      setFormErrors((prev) => ({ ...prev, image: 'Upload failed unexpectedly. Please try again.' }))
    } finally {
      setUploadingImage(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  // Submit Create or Edit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setFormErrors({})

    try {
      const url = isEditing
        ? `/api/admin/programs/${formData.id}`
        : '/api/admin/programs'
      const method = isEditing ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const json = await res.json()

      if (!res.ok) {
        if (json.details) {
          setFormErrors(json.details)
        } else {
          setFormErrors({ general: json.error || 'Failed to save program.' })
        }
        setSubmitting(false)
        return
      }

      if (isEditing) {
        setPrograms((prev) =>
          prev.map((item) => (item.id === json.program.id ? json.program : item)),
        )
        showFeedback(`Program "${json.program.title}" updated successfully.`)
      } else {
        setPrograms((prev) => [json.program, ...prev])
        setTotal((prev) => prev + 1)
        showFeedback(`Program "${json.program.title}" created successfully.`)
      }

      setIsModalOpen(false)
    } catch {
      setFormErrors({ general: 'Network error. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  // Toggle Publish / Draft
  const handleToggleStatus = async (program: Program) => {
    const nextStatus: 'DRAFT' | 'PUBLISHED' =
      program.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'

    try {
      const res = await fetch(`/api/admin/programs/${program.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      })

      if (!res.ok) {
        const json = await res.json()
        showFeedback(json.error || 'Failed to update status.', 'error')
        return
      }

      const json = await res.json()
      setPrograms((prev) =>
        prev.map((item) => (item.id === program.id ? json.program : item)),
      )
      showFeedback(`Status changed to ${nextStatus}.`)
    } catch {
      showFeedback('Failed to update status.', 'error')
    }
  }

  // Toggle Featured
  const handleToggleFeatured = async (program: Program) => {
    const nextFeatured = !program.featured

    try {
      const res = await fetch(`/api/admin/programs/${program.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: nextFeatured }),
      })

      if (!res.ok) {
        const json = await res.json()
        showFeedback(json.error || 'Failed to update featured flag.', 'error')
        return
      }

      const json = await res.json()
      setPrograms((prev) =>
        prev.map((item) => (item.id === program.id ? json.program : item)),
      )
      showFeedback(nextFeatured ? 'Marked as Featured.' : 'Removed from Featured.')
    } catch {
      showFeedback('Failed to update featured flag.', 'error')
    }
  }

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)

    try {
      const res = await fetch(`/api/admin/programs/${deleteTarget.id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const json = await res.json()
        showFeedback(json.error || 'Failed to delete program.', 'error')
        setIsDeleting(false)
        return
      }

      setPrograms((prev) => prev.filter((p) => p.id !== deleteTarget.id))
      setTotal((prev) => Math.max(0, prev - 1))
      showFeedback(`Program "${deleteTarget.title}" deleted.`)
      setDeleteTarget(null)
    } catch {
      showFeedback('Failed to delete program.', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  // Filtered programs
  const filteredPrograms = programs.filter((p) => {
    const matchesStatus =
      statusFilter === 'ALL' || p.status === statusFilter
    const matchesCategory =
      categoryFilter === 'ALL' || p.category === categoryFilter
    const matchesSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(search.toLowerCase())

    return matchesStatus && matchesCategory && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* ── Feedback Banner ──────────────────────────────────────────────── */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-sm font-medium transition-all ${
            feedback.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
          role="alert"
        >
          {feedback.message}
        </div>
      )}

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Programs</h1>
          <p className="text-gray-600 text-sm mt-1">
            Manage TCIP community initiatives, youth development, and support programs ({total} total).
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#16A34A] hover:bg-[#15803D]
                     text-white text-xs font-semibold rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Program
        </button>
      </div>

      {/* ── Filter Bar ───────────────────────────────────────────────────── */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <svg
            className="w-4 h-4 text-gray-400 absolute left-3 top-2.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search programs by title, category, or summary…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30 focus:border-[#16A34A] bg-gray-50/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 text-xs text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30"
          >
            <option value="ALL">All Focus Areas</option>
            {PROGRAM_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg border border-gray-200">
            {(['ALL', 'PUBLISHED', 'DRAFT'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  statusFilter === tab
                    ? 'bg-white text-gray-900 shadow-xs font-bold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab === 'ALL' ? 'All' : tab.charAt(0) + tab.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Programs Table ───────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        {filteredPrograms.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon="📋"
              title="No programs found"
              message={
                search || statusFilter !== 'ALL' || categoryFilter !== 'ALL'
                  ? 'No programs match your search criteria. Try adjusting your filters.'
                  : 'No programs have been added yet. Click "Add Program" to create one.'
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Order</th>
                  <th className="px-5 py-3.5">Program Details</th>
                  <th className="px-5 py-3.5">Focus Area</th>
                  <th className="px-5 py-3.5">Featured</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPrograms.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-5 py-4 text-gray-500 font-mono text-xs w-16">
                      #{p.displayOrder}
                    </td>
                    <td className="px-5 py-4 max-w-sm">
                      <div className="flex items-start gap-3">
                        {p.imageUrl && (
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-gray-200 bg-gray-50">
                            <Image
                              src={p.imageUrl}
                              alt={p.title}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="font-bold text-gray-900">{p.title}</div>
                          <div className="text-xs text-gray-400 font-mono mt-0.5">/programs/{p.slug}</div>
                          <div className="text-xs text-gray-600 line-clamp-1 mt-1">{p.shortDescription}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-700 whitespace-nowrap">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-200">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleFeatured(p)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold border transition-colors cursor-pointer ${
                          p.featured
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : 'bg-gray-100 text-gray-500 border-gray-200 hover:text-gray-800'
                        }`}
                        title="Click to toggle featured status"
                      >
                        {p.featured ? '★ Featured' : '☆ Standard'}
                      </button>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(p)}
                        title="Click to toggle publish status"
                        className="cursor-pointer"
                      >
                        <StatusBadge status={p.status} />
                      </button>
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap space-x-1.5">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="px-2.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(p)}
                        className="px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Create / Edit Modal ───────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden my-8 border border-gray-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {isEditing ? 'Edit Program' : 'Create New Program'}
                </h2>
                <p className="text-xs text-gray-500">
                  Fill in program details, focus area, and summary.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg leading-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
              {formErrors.general && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                  {formErrors.general}
                </div>
              )}

              {/* Title & Slug */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
                    Program Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={handleTitleChange}
                    placeholder="e.g. Employment & Career Development"
                    className={`w-full px-3.5 py-2 text-sm rounded-xl border ${
                      formErrors.title ? 'border-red-400' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30 focus:border-[#16A34A]`}
                  />
                  {formErrors.title && (
                    <p className="text-red-600 text-xs mt-1">{formErrors.title}</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider">
                      Slug <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setAutoSlug(!autoSlug)}
                      className="text-[11px] text-[#16A34A] hover:underline cursor-pointer"
                    >
                      {autoSlug ? 'Auto-generating' : 'Manual'}
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => {
                      setAutoSlug(false)
                      setFormData({ ...formData, slug: e.target.value })
                    }}
                    placeholder="e.g. employment-career-development"
                    className={`w-full px-3.5 py-2 text-sm rounded-xl border font-mono ${
                      formErrors.slug ? 'border-red-400' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30 focus:border-[#16A34A]`}
                  />
                  {formErrors.slug && (
                    <p className="text-red-600 text-xs mt-1">{formErrors.slug}</p>
                  )}
                </div>
              </div>

              {/* Category & Status */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
                    Focus Area / Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30 focus:border-[#16A34A] bg-white"
                  >
                    {PROGRAM_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
                    Publication Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as 'DRAFT' | 'PUBLISHED',
                      })
                    }
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30 focus:border-[#16A34A] bg-white"
                  >
                    <option value="DRAFT">Draft (Admin only)</option>
                    <option value="PUBLISHED">Published (Visible on site)</option>
                  </select>
                </div>
              </div>

              {/* Display Order & Featured */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
                    Display Order (Number)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.displayOrder}
                    onChange={(e) =>
                      setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30 focus:border-[#16A34A]"
                  />
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="featured-checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 text-[#16A34A] rounded focus:ring-[#16A34A]"
                  />
                  <label htmlFor="featured-checkbox" className="text-sm font-semibold text-gray-800 cursor-pointer">
                    Feature on Homepage
                  </label>
                </div>
              </div>

              {/* Featured Image Upload / URL */}
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
                  Program Image (Upload or URL)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="/images/tcip-youth-leadership.jpg or https://..."
                    className="flex-1 px-3.5 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30 focus:border-[#16A34A]"
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="px-3.5 py-2 text-xs font-semibold text-gray-800 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-xl transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                  >
                    {uploadingImage ? 'Uploading…' : 'Upload'}
                  </button>
                </div>
                {formErrors.image && <p className="text-red-600 text-xs mt-1">{formErrors.image}</p>}
                {formData.imageUrl && (
                  <div className="mt-2 relative w-20 h-14 rounded-lg overflow-hidden border border-gray-200">
                    <Image
                      src={formData.imageUrl}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
                  Short Description (Card Summary) <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Concise summary for homepage and program cards (1-2 sentences)…"
                  className={`w-full px-3.5 py-2 text-sm rounded-xl border ${
                    formErrors.shortDescription ? 'border-red-400' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30 focus:border-[#16A34A]`}
                />
                {formErrors.shortDescription && (
                  <p className="text-red-600 text-xs mt-1">{formErrors.shortDescription}</p>
                )}
              </div>

              {/* Full Description */}
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
                  Full Description (Detail Page) <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={5}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed description of the program, objectives, and community activities…"
                  className={`w-full px-3.5 py-2 text-sm rounded-xl border ${
                    formErrors.description ? 'border-red-400' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30 focus:border-[#16A34A]`}
                />
                {formErrors.description && (
                  <p className="text-red-600 text-xs mt-1">{formErrors.description}</p>
                )}
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Program'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Dialog ───────────────────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 border border-red-200">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4 text-xl">
              ⚠️
            </div>
            <h3 className="text-lg font-bold text-center text-gray-900 mb-2">
              Delete Program?
            </h3>
            <p className="text-sm text-center text-gray-600 mb-6">
              Are you sure you want to delete <strong className="text-gray-900">{deleteTarget.title}</strong>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? 'Deleting…' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
