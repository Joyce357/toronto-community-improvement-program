'use client'

import { useState, useRef, ChangeEvent } from 'react'
import Image from 'next/image'
import StatusBadge from '@/components/admin/StatusBadge'
import EmptyState from '@/components/admin/EmptyState'
import { EVENT_CATEGORIES } from '@/lib/validations'
import type { Event } from '@/types'

interface EventsManagerProps {
  initialEvents: Event[]
  totalCount: number
}

interface FormState {
  id?: string
  title: string
  category: string
  shortDescription: string
  description: string
  date: string
  startTime: string
  endTime: string
  location: string
  featuredImage: string
  registrationLink: string
  registrationOpen: boolean
  featured: boolean
  published: boolean
}

const emptyForm: FormState = {
  title: '',
  category: 'Community Gathering',
  shortDescription: '',
  description: '',
  date: new Date().toISOString().split('T')[0],
  startTime: '10:00 AM',
  endTime: '02:00 PM',
  location: '',
  featuredImage: '',
  registrationLink: '',
  registrationOpen: true,
  featured: false,
  published: true,
}

export default function EventsManager({
  initialEvents,
  totalCount,
}: EventsManagerProps) {
  const [events, setEvents] = useState<Event[]>(initialEvents)
  const [total, setTotal] = useState(totalCount)
  const [search, setSearch] = useState('')
  const [timeFilter, setTimeFilter] = useState<'UPCOMING' | 'PAST' | 'ALL'>('UPCOMING')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFT'>('ALL')
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL')

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<FormState>(emptyForm)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  // Image upload state
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<Event | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Feedback toast
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showFeedback = (message: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ message, type })
    setTimeout(() => setFeedback(null), 4000)
  }

  // Open Create Modal
  const handleOpenCreate = () => {
    setIsEditing(false)
    setFormData(emptyForm)
    setFormErrors({})
    setIsModalOpen(true)
  }

  // Open Edit Modal
  const handleOpenEdit = (event: Event) => {
    setIsEditing(true)
    const formattedDate = event.date
      ? new Date(event.date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]

    setFormData({
      id: event.id,
      title: event.title,
      category: event.category || 'Community Gathering',
      shortDescription: event.shortDescription || '',
      description: event.description,
      date: formattedDate,
      startTime: event.startTime || '10:00 AM',
      endTime: event.endTime || '',
      location: event.location,
      featuredImage: event.featuredImage || '',
      registrationLink: event.registrationLink || '',
      registrationOpen: event.registrationOpen ?? true,
      featured: event.featured ?? false,
      published: event.published ?? true,
    })
    setFormErrors({})
    setIsModalOpen(true)
  }

  // Handle Image Upload
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
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)

      const res = await fetch('/api/admin/gallery/image', {
        method: 'POST',
        body: uploadFormData,
      })

      const data = await res.json()

      if (!res.ok) {
        setFormErrors((prev) => ({ ...prev, image: data.error || 'Failed to upload image.' }))
      } else {
        setFormData((prev) => ({ ...prev, featuredImage: data.imageUrl }))
      }
    } catch {
      setFormErrors((prev) => ({ ...prev, image: 'Network error during image upload.' }))
    } finally {
      setUploadingImage(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  // Form Validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}
    if (!formData.title.trim()) errors.title = 'Title is required'
    if (!formData.description.trim()) errors.description = 'Full description is required'
    if (!formData.date) errors.date = 'Date is required'
    if (!formData.startTime.trim()) errors.startTime = 'Start time is required'
    if (!formData.location.trim()) errors.location = 'Location is required'
    if (
      formData.registrationLink &&
      !/^https?:\/\/.+/.test(formData.registrationLink)
    ) {
      errors.registrationLink = 'Must be a valid URL starting with http:// or https://'
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle Submit (Create or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setSubmitting(true)
    try {
      const url = isEditing
        ? `/api/admin/events/${formData.id}`
        : '/api/admin/events'
      const method = isEditing ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save event')
      }

      const { event } = await res.json()

      if (isEditing) {
        setEvents((prev) => prev.map((e) => (e.id === event.id ? event : e)))
        showFeedback('Event updated successfully.')
      } else {
        setEvents((prev) => [event, ...prev])
        setTotal((prev) => prev + 1)
        showFeedback('Event created successfully.')
      }

      setIsModalOpen(false)
    } catch (err: unknown) {
      showFeedback(
        err instanceof Error ? err.message : 'An unexpected error occurred.',
        'error',
      )
    } finally {
      setSubmitting(false)
    }
  }

  // Toggle Published Status
  const handleTogglePublished = async (event: Event) => {
    try {
      const res = await fetch(`/api/admin/events/${event.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !event.published }),
      })

      if (!res.ok) throw new Error('Failed to update event status')

      const { event: updatedEvent } = await res.json()
      setEvents((prev) => prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)))
      showFeedback(
        `Event ${updatedEvent.published ? 'published' : 'moved to drafts'}.`,
      )
    } catch {
      showFeedback('Failed to update event status.', 'error')
    }
  }

  // Toggle Featured
  const handleToggleFeatured = async (event: Event) => {
    try {
      const res = await fetch(`/api/admin/events/${event.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !event.featured }),
      })

      if (!res.ok) throw new Error('Failed to update featured flag')

      const { event: updatedEvent } = await res.json()
      setEvents((prev) => prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)))
      showFeedback(
        `Event ${updatedEvent.featured ? 'marked as featured' : 'removed from featured'}.`,
      )
    } catch {
      showFeedback('Failed to update featured flag.', 'error')
    }
  }

  // Delete Handler
  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)

    try {
      const res = await fetch(`/api/admin/events/${deleteTarget.id}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Failed to delete event')

      setEvents((prev) => prev.filter((e) => e.id !== deleteTarget.id))
      setTotal((prev) => Math.max(0, prev - 1))
      showFeedback('Event deleted successfully.')
      setDeleteTarget(null)
    } catch {
      showFeedback('Failed to delete event.', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  // Today boundary for automatic past vs upcoming calculation
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)

  // Filtered Events
  const filteredEvents = events.filter((e) => {
    const eventDate = new Date(e.date)
    const isUpcoming = eventDate >= startOfToday

    const matchesTime =
      timeFilter === 'ALL' ||
      (timeFilter === 'UPCOMING' && isUpcoming) ||
      (timeFilter === 'PAST' && !isUpcoming)

    const matchesSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase()) ||
      (e.category && e.category.toLowerCase().includes(search.toLowerCase()))

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'PUBLISHED' && e.published) ||
      (statusFilter === 'DRAFT' && !e.published)

    const matchesCategory =
      categoryFilter === 'ALL' || e.category === categoryFilter

    return matchesTime && matchesSearch && matchesStatus && matchesCategory
  })

  // Count upcoming vs past
  const upcomingCount = events.filter((e) => new Date(e.date) >= startOfToday).length
  const pastCount = events.filter((e) => new Date(e.date) < startOfToday).length

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
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

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Events</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage TCIP community gatherings, job fairs, workshops, and youth events ({total} total).
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Event
        </button>
      </div>

      {/* Primary Timing Tabs: Upcoming vs Past */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setTimeFilter('UPCOMING')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            timeFilter === 'UPCOMING'
              ? 'bg-[#16A34A] text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          Upcoming Events ({upcomingCount})
        </button>
        <button
          onClick={() => setTimeFilter('PAST')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            timeFilter === 'PAST'
              ? 'bg-[#16A34A] text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          Past Events ({pastCount})
        </button>
        <button
          onClick={() => setTimeFilter('ALL')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            timeFilter === 'ALL'
              ? 'bg-gray-900 text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          All ({total})
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search events by title, location, or category…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30 focus:border-[#16A34A] bg-gray-50/50"
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

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 text-xs text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30"
          >
            <option value="ALL">All Categories</option>
            {EVENT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700">
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
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        {filteredEvents.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon="📅"
              title={timeFilter === 'UPCOMING' ? 'No upcoming events found' : 'No events found'}
              message={
                search || statusFilter !== 'ALL' || categoryFilter !== 'ALL'
                  ? 'Try adjusting your search criteria or category filter.'
                  : timeFilter === 'UPCOMING'
                  ? 'No upcoming events are currently scheduled. Click "Add Event" to create one.'
                  : 'No past events match the current criteria.'
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Event</th>
                  <th className="px-4 py-3.5">Date & Time</th>
                  <th className="px-4 py-3.5">Timeline</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">Featured</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEvents.map((event) => {
                  const eventDate = new Date(event.date)
                  const isUpcoming = eventDate >= startOfToday

                  return (
                    <tr key={event.id} className="hover:bg-gray-50/70 transition-colors">
                      {/* Title & Location */}
                      <td className="px-5 py-4 max-w-sm">
                        <div className="flex items-start gap-3">
                          {event.featuredImage && (
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-gray-200 bg-gray-50">
                              <Image
                                src={event.featuredImage}
                                alt={event.title}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-bold text-gray-900 truncate">{event.title}</p>
                            <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                              📍 {event.location}
                            </p>
                            {event.registrationLink && (
                              <a
                                href={event.registrationLink}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[11px] text-[#16A34A] hover:underline block mt-0.5"
                              >
                                Registration Link ↗
                              </a>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Date & Time */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-xs font-semibold text-gray-800">
                          {eventDate.toLocaleDateString('en-CA', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                        <div className="text-[11px] text-gray-500 mt-0.5">
                          {event.startTime}
                          {event.endTime ? ` – ${event.endTime}` : ''}
                        </div>
                      </td>

                      {/* Timeline Badge (Upcoming vs Past) */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        {isUpcoming ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            ● Upcoming
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                            Past Event
                          </span>
                        )}
                      </td>

                      {/* Category */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-200">
                          {event.category || 'General'}
                        </span>
                      </td>

                      {/* Featured */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleFeatured(event)}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold border transition-colors cursor-pointer ${
                            event.featured
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : 'bg-gray-100 text-gray-500 border-gray-200 hover:text-gray-800'
                          }`}
                          title="Click to toggle featured status"
                        >
                          {event.featured ? '★ Featured' : '☆ Standard'}
                        </button>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleTogglePublished(event)}
                          title="Click to toggle published status"
                          className="cursor-pointer"
                        >
                          <StatusBadge status={event.published ? 'PUBLISHED' : 'DRAFT'} />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right whitespace-nowrap space-x-1.5">
                        <button
                          onClick={() => handleOpenEdit(event)}
                          className="px-2.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteTarget(event)}
                          className="px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Create / Edit Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden my-8 border border-gray-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {isEditing ? 'Edit Event' : 'Create Event'}
                </h2>
                <p className="text-xs text-gray-500">
                  Fill in event information, date, location, and registration details.
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
              {/* Title & Category */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
                    Event Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Community Job Fair & Networking"
                    className={`w-full px-3.5 py-2 text-sm rounded-xl border ${
                      formErrors.title ? 'border-red-400' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30 focus:border-[#16A34A]`}
                  />
                  {formErrors.title && (
                    <p className="text-red-600 text-xs mt-1">{formErrors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30 focus:border-[#16A34A] bg-white"
                  >
                    {EVENT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date, Start Time, End Time */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
                    Event Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className={`w-full px-3.5 py-2 text-sm rounded-xl border ${
                      formErrors.date ? 'border-red-400' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30 focus:border-[#16A34A]`}
                  />
                  {formErrors.date && (
                    <p className="text-red-600 text-xs mt-1">{formErrors.date}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
                    Start Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    placeholder="e.g. 10:00 AM"
                    className={`w-full px-3.5 py-2 text-sm rounded-xl border ${
                      formErrors.startTime ? 'border-red-400' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30 focus:border-[#16A34A]`}
                  />
                  {formErrors.startTime && (
                    <p className="text-red-600 text-xs mt-1">{formErrors.startTime}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
                    End Time (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    placeholder="e.g. 02:00 PM"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30 focus:border-[#16A34A]"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. 1900 Eglinton Ave E, Scarborough, ON or Online via Zoom"
                  className={`w-full px-3.5 py-2 text-sm rounded-xl border ${
                    formErrors.location ? 'border-red-400' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30 focus:border-[#16A34A]`}
                />
                {formErrors.location && (
                  <p className="text-red-600 text-xs mt-1">{formErrors.location}</p>
                )}
              </div>

              {/* Featured Image Upload / URL */}
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
                  Event Image (Upload or URL)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={formData.featuredImage}
                    onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
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
                {formData.featuredImage && (
                  <div className="mt-2 relative w-20 h-14 rounded-lg overflow-hidden border border-gray-200">
                    <Image
                      src={formData.featuredImage}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Registration Link & Registration Open */}
              <div className="grid sm:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
                    Registration Link (Optional URL)
                  </label>
                  <input
                    type="url"
                    value={formData.registrationLink}
                    onChange={(e) => setFormData({ ...formData, registrationLink: e.target.value })}
                    placeholder="https://..."
                    className={`w-full px-3.5 py-2 text-sm rounded-xl border ${
                      formErrors.registrationLink ? 'border-red-400' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30 focus:border-[#16A34A]`}
                  />
                  {formErrors.registrationLink && (
                    <p className="text-red-600 text-xs mt-1">{formErrors.registrationLink}</p>
                  )}
                </div>

                <div className="flex items-center gap-4 pt-4 sm:pt-6">
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.registrationOpen}
                      onChange={(e) => setFormData({ ...formData, registrationOpen: e.target.checked })}
                      className="rounded text-[#16A34A] focus:ring-[#16A34A]"
                    />
                    Registration Open
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="rounded text-[#16A34A] focus:ring-[#16A34A]"
                    />
                    Featured Event
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.published}
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                      className="rounded text-[#16A34A] focus:ring-[#16A34A]"
                    />
                    Published
                  </label>
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
                  Short Summary (Card Preview)
                </label>
                <textarea
                  rows={2}
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="One sentence summary for event card previews…"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30 focus:border-[#16A34A]"
                />
              </div>

              {/* Full Description */}
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
                  Full Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed information about the event agenda, speaker details, what to bring, etc.…"
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
                  {submitting ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Dialog ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 border border-red-200">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4 text-xl">
              ⚠️
            </div>
            <h3 className="text-lg font-bold text-center text-gray-900 mb-2">
              Delete Event?
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
                onClick={handleDelete}
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
