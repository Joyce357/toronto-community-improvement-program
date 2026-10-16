// ─── Partners Manager (Admin) ─────────────────────────────────────────────
'use client'

import { useState, useRef, ChangeEvent } from 'react'
import Image from 'next/image'
import type { Partner } from '@/types'
import StatusBadge from './StatusBadge'
import EmptyState from './EmptyState'

interface PartnersManagerProps {
  initialPartners: Partner[]
  totalCount: number
}

interface FormState {
  name: string
  logoUrl: string
  websiteUrl: string
  description: string
  displayOrder: number
  published: boolean
}

const defaultFormState: FormState = {
  name: '',
  logoUrl: '',
  websiteUrl: '',
  description: '',
  displayOrder: 1,
  published: true,
}

export default function PartnersManager({
  initialPartners,
  totalCount,
}: PartnersManagerProps) {
  const [partners, setPartners] = useState<Partner[]>(initialPartners)
  const [total, setTotal] = useState(totalCount)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFT'>('ALL')

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null)
  const [formData, setFormData] = useState<FormState>(defaultFormState)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [bannerMsg, setBannerMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Logo upload state
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadingLogo, setUploadingLogo] = useState(false)

  // Open Create Modal
  const openCreateModal = () => {
    setEditingPartner(null)
    const nextOrder = partners.length > 0 ? Math.max(...partners.map((p) => p.displayOrder)) + 1 : 1
    setFormData({
      ...defaultFormState,
      displayOrder: nextOrder,
    })
    setErrors({})
    setIsModalOpen(true)
  }

  // Open Edit Modal
  const openEditModal = (partner: Partner) => {
    setEditingPartner(partner)
    setFormData({
      name: partner.name,
      logoUrl: partner.logoUrl || '',
      websiteUrl: partner.websiteUrl || '',
      description: partner.description || '',
      displayOrder: partner.displayOrder,
      published: partner.published,
    })
    setErrors({})
    setIsModalOpen(true)
  }

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false)
    setEditingPartner(null)
    setFormData(defaultFormState)
    setErrors({})
  }

  // Handle Logo Upload
  const handleLogoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'].includes(file.type)) {
      setErrors((prev) => ({ ...prev, logo: 'Please choose a PNG, JPEG, WebP, or SVG logo.' }))
      return
    }

    setUploadingLogo(true)
    setErrors((prev) => {
      const next = { ...prev }
      delete next.logo
      return next
    })

    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)

      const res = await fetch('/api/admin/gallery/image', {
        method: 'POST',
        body: uploadFormData,
      })

      const data = await res.json()

      if (!res.ok) {
        setErrors((prev) => ({ ...prev, logo: data.error || 'Failed to upload logo.' }))
      } else {
        setFormData((prev) => ({ ...prev, logoUrl: data.imageUrl }))
      }
    } catch {
      setErrors((prev) => ({ ...prev, logo: 'Network error during logo upload.' }))
    } finally {
      setUploadingLogo(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  // Save Partner
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      setErrors({ name: 'Partner name is required.' })
      return
    }

    setIsSaving(true)
    setErrors({})

    try {
      const url = editingPartner ? `/api/admin/partners/${editingPartner.id}` : '/api/admin/partners'
      const method = editingPartner ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        setBannerMsg({ type: 'error', text: data.error || 'Failed to save partner.' })
      } else {
        const saved: Partner = data.partner
        if (editingPartner) {
          setPartners((prev) => prev.map((p) => (p.id === saved.id ? saved : p)))
          setBannerMsg({ type: 'success', text: 'Partner updated successfully.' })
        } else {
          setPartners((prev) => [...prev, saved].sort((a, b) => a.displayOrder - b.displayOrder))
          setTotal((prev) => prev + 1)
          setBannerMsg({ type: 'success', text: 'Partner created successfully.' })
        }
        closeModal()
      }
    } catch {
      setBannerMsg({ type: 'error', text: 'Network error while saving partner.' })
    } finally {
      setIsSaving(false)
    }
  }

  // Toggle Published
  const handleTogglePublished = async (partner: Partner) => {
    try {
      const res = await fetch(`/api/admin/partners/${partner.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !partner.published }),
      })
      const data = await res.json()
      if (res.ok) {
        setPartners((prev) => prev.map((p) => (p.id === partner.id ? data.partner : p)))
        setBannerMsg({
          type: 'success',
          text: `Partner status updated to ${!partner.published ? 'Published' : 'Draft'}.`,
        })
      }
    } catch {
      setBannerMsg({ type: 'error', text: 'Failed to update partner status.' })
    }
  }

  // Delete Partner
  const handleDelete = async (id: string) => {
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/admin/partners/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setPartners((prev) => prev.filter((p) => p.id !== id))
        setTotal((prev) => Math.max(0, prev - 1))
        setBannerMsg({ type: 'success', text: 'Partner deleted successfully.' })
        setDeleteConfirmId(null)
      } else {
        setBannerMsg({ type: 'error', text: 'Failed to delete partner.' })
      }
    } catch {
      setBannerMsg({ type: 'error', text: 'Network error while deleting partner.' })
    } finally {
      setIsDeleting(false)
    }
  }

  // Filtered partners
  const filteredPartners = partners
    .filter((p) => {
      const matchesSearch =
        search === '' ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
      const matchesStatus =
        statusFilter === 'ALL'
          ? true
          : statusFilter === 'PUBLISHED'
          ? p.published
          : !p.published
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => a.displayOrder - b.displayOrder)

  const inputClass = `w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-900
    bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30 focus:border-[#16A34A] transition-all`

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Community Partners</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage confirmed community partners, institutions, and supporters ({total} total).
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#16A34A] hover:bg-[#15803D] transition-colors shadow-xs shrink-0 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Partner
        </button>
      </div>

      {/* Notification banner */}
      {bannerMsg && (
        <div
          className={`text-sm px-4 py-3 rounded-xl flex items-center justify-between font-medium ${
            bannerMsg.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          <span>{bannerMsg.text}</span>
          <button
            onClick={() => setBannerMsg(null)}
            className="text-xs font-bold underline opacity-80 hover:opacity-100 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search partners by name or description…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30 focus:border-[#16A34A] bg-gray-50/50"
          />
          <svg
            className="w-4 h-4 absolute left-3 top-2.5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700">
          {(['ALL', 'PUBLISHED', 'DRAFT'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                statusFilter === tab
                  ? 'bg-white shadow-xs text-gray-900 font-bold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab === 'ALL' ? 'All' : tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Partners List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        {filteredPartners.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon="🤝"
              title="No partners added yet"
              message={
                search || statusFilter !== 'ALL'
                  ? 'No partners match your search criteria.'
                  : 'No community partners have been recorded yet. Click "Add Partner" to add confirmed partners.'
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Order</th>
                  <th className="px-4 py-3.5">Partner</th>
                  <th className="px-4 py-3.5">Website</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPartners.map((partner) => (
                  <tr key={partner.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-5 py-4 text-xs font-mono text-gray-500 w-16">
                      #{partner.displayOrder}
                    </td>
                    <td className="px-4 py-4 max-w-sm">
                      <div className="flex items-center gap-3">
                        {partner.logoUrl ? (
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 bg-white p-1 shrink-0">
                            <Image
                              src={partner.logoUrl}
                              alt={partner.name}
                              fill
                              className="object-contain"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-lg shrink-0">
                            🤝
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-gray-900">{partner.name}</p>
                          {partner.description && (
                            <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                              {partner.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-600">
                      {partner.websiteUrl ? (
                        <a
                          href={partner.websiteUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#16A34A] hover:underline"
                        >
                          Visit website ↗
                        </a>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleTogglePublished(partner)}
                        className="cursor-pointer"
                        title="Click to toggle publish"
                      >
                        <StatusBadge status={partner.published ? 'PUBLISHED' : 'DRAFT'} />
                      </button>
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap space-x-1.5">
                      <button
                        onClick={() => openEditModal(partner)}
                        className="px-2.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(partner.id)}
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

      {/* ── CREATE / EDIT MODAL ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto my-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {editingPartner ? 'Edit Partner' : 'Add Community Partner'}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Record confirmed community partners, employers, and supporting organizations.
                </p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                  Partner Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. City of Toronto Community Services"
                  className={inputClass}
                />
                {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
              </div>

              {/* Logo Upload or URL */}
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                  Logo (Upload or URL)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={formData.logoUrl}
                    onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                    placeholder="https://... or /images/..."
                    className="flex-1 px-3.5 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30 focus:border-[#16A34A]"
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingLogo}
                    className="px-3.5 py-2 text-xs font-semibold text-gray-800 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-xl transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                  >
                    {uploadingLogo ? 'Uploading…' : 'Upload'}
                  </button>
                </div>
                {errors.logo && <p className="text-xs text-red-600 mt-1">{errors.logo}</p>}
                {formData.logoUrl && (
                  <div className="mt-2 relative w-20 h-14 rounded-lg overflow-hidden border border-gray-200 bg-white p-1">
                    <Image
                      src={formData.logoUrl}
                      alt="Logo preview"
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                  Website URL
                </label>
                <input
                  type="url"
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                  placeholder="https://example.org"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                  Short Description (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Collaborating on youth career mentoring and workshops…"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200 items-center">
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="rounded text-[#16A34A] focus:ring-[#16A34A]"
                  />
                  Published
                </label>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                    className="w-full px-2.5 py-1 text-xs rounded-lg border border-gray-300 bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSaving}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || uploadingLogo}
                  className="px-5 py-2 bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isSaving ? 'Saving…' : editingPartner ? 'Update Partner' : 'Add Partner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRMATION ── */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-red-200 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <span className="text-2xl">⚠️</span>
              <h3 className="text-lg font-bold text-gray-900">Delete Partner</h3>
            </div>
            <p className="text-sm text-gray-600">
              Are you sure you want to delete this partner record?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50"
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
