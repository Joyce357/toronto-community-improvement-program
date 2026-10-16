'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import StatusBadge from '@/components/admin/StatusBadge'
import EmptyState from '@/components/admin/EmptyState'
import type { VolunteerApplication, VolunteerCommunication } from '@/types'

interface VolunteersManagerProps {
  initialApplications: VolunteerApplication[]
}

type StatusFilter = 'ALL' | 'NEW' | 'REVIEWING' | 'CONTACTED' | 'ACTIVE' | 'INACTIVE'

const STATUS_TABS: { label: string; value: StatusFilter }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'New / Pending', value: 'NEW' },
  { label: 'Reviewing', value: 'REVIEWING' },
  { label: 'Contacted', value: 'CONTACTED' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Inactive', value: 'INACTIVE' },
]

const DEFAULT_REPLY_SUBJECT = 'Re: Your Volunteer Application — Toronto Community Improvement Program'

export default function VolunteersManager({
  initialApplications,
}: VolunteersManagerProps) {
  const [applications, setApplications] = useState<VolunteerApplication[]>(initialApplications)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')

  // Detail Modal
  const [selectedApp, setSelectedApp] = useState<VolunteerApplication | null>(null)
  const [notesInput, setNotesInput] = useState('')
  const [savingNotes, setSavingNotes] = useState(false)

  // Reply by Email State
  const [replySubject, setReplySubject] = useState(DEFAULT_REPLY_SUBJECT)
  const [replyMessage, setReplyMessage] = useState('')
  const [sendingReply, setSendingReply] = useState(false)
  const [replyError, setReplyError] = useState<string | null>(null)

  // Status updating inline state
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  // Delete Modal
  const [deleteTarget, setDeleteTarget] = useState<VolunteerApplication | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Feedback Toast
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showFeedback = (message: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ message, type })
    setTimeout(() => setFeedback(null), 4000)
  }

  // Sync selectedApp state whenever selectedApp changes
  useEffect(() => {
    if (selectedApp) {
      setNotesInput(selectedApp.adminNotes || '')
      setReplySubject(DEFAULT_REPLY_SUBJECT)
      setReplyMessage('')
      setReplyError(null)
    }
  }, [selectedApp])

  // Handle keyboard ESC to close modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (deleteTarget) setDeleteTarget(null)
        else if (selectedApp) setSelectedApp(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedApp, deleteTarget])

  // Status Counts
  const counts = useMemo(() => {
    const map: Record<StatusFilter, number> = {
      ALL: applications.length,
      NEW: 0,
      REVIEWING: 0,
      CONTACTED: 0,
      ACTIVE: 0,
      INACTIVE: 0,
    }
    for (const app of applications) {
      if (app.status in map) {
        map[app.status as StatusFilter]++
      }
    }
    return map
  }, [applications])

  // Filter & Search
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter
      if (!matchesStatus) return false

      if (!search.trim()) return true
      const q = search.toLowerCase()
      const fullName = `${app.firstName} ${app.lastName}`.toLowerCase()
      const email = (app.email || '').toLowerCase()
      const phone = (app.phone || '').toLowerCase()
      const location = (app.location || '').toLowerCase()
      const interests = (app.interests || []).join(' ').toLowerCase()

      return (
        fullName.includes(q) ||
        email.includes(q) ||
        phone.includes(q) ||
        location.includes(q) ||
        interests.includes(q)
      )
    })
  }, [applications, statusFilter, search])

  // Update Status
  const handleUpdateStatus = useCallback(
    async (id: string, newStatus: VolunteerApplication['status']) => {
      setUpdatingId(id)
      try {
        const res = await fetch(`/api/admin/volunteers/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        })

        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error || 'Failed to update status')
        }

        setApplications((prev) =>
          prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app)),
        )

        if (selectedApp && selectedApp.id === id) {
          setSelectedApp((prev) => (prev ? { ...prev, status: newStatus } : null))
        }

        showFeedback(`Status updated to ${newStatus}`)
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Error updating status'
        showFeedback(msg, 'error')
      } finally {
        setUpdatingId(null)
      }
    },
    [selectedApp],
  )

  // Save Admin Notes
  const handleSaveNotes = async () => {
    if (!selectedApp) return
    setSavingNotes(true)
    try {
      const res = await fetch(`/api/admin/volunteers/${selectedApp.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminNotes: notesInput }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save admin notes')
      }

      setApplications((prev) =>
        prev.map((app) =>
          app.id === selectedApp.id ? { ...app, adminNotes: notesInput } : app,
        ),
      )
      setSelectedApp((prev) => (prev ? { ...prev, adminNotes: notesInput } : null))
      showFeedback('Internal admin notes saved successfully.')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving notes'
      showFeedback(msg, 'error')
    } finally {
      setSavingNotes(false)
    }
  }

  // Send Email Reply
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedApp) return

    if (!replySubject.trim()) {
      setReplyError('Subject is required.')
      return
    }
    if (!replyMessage.trim()) {
      setReplyError('Message body is required.')
      return
    }

    setSendingReply(true)
    setReplyError(null)

    try {
      const res = await fetch(`/api/admin/volunteers/${selectedApp.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: replySubject.trim(),
          message: replyMessage.trim(),
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send email reply.')
      }

      const newCommunication: VolunteerCommunication = data.communication
      const updatedStatus: VolunteerApplication['status'] = data.newStatus || selectedApp.status

      // Update selectedApp and applications list
      setApplications((prev) =>
        prev.map((app) =>
          app.id === selectedApp.id
            ? {
                ...app,
                status: updatedStatus,
                communications: [newCommunication, ...(app.communications || [])],
              }
            : app,
        ),
      )

      setSelectedApp((prev) =>
        prev
          ? {
              ...prev,
              status: updatedStatus,
              communications: [newCommunication, ...(prev.communications || [])],
            }
          : null,
      )

      setReplyMessage('')
      setReplySubject(DEFAULT_REPLY_SUBJECT)
      showFeedback(`Reply sent to ${selectedApp.email}`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send email reply'
      setReplyError(msg)
    } finally {
      setSendingReply(false)
    }
  }

  // Delete Application
  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/admin/volunteers/${deleteTarget.id}`, {
        method: 'DELETE',
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete application')
      }

      setApplications((prev) => prev.filter((app) => app.id !== deleteTarget.id))
      if (selectedApp && selectedApp.id === deleteTarget.id) {
        setSelectedApp(null)
      }
      setDeleteTarget(null)
      showFeedback('Volunteer application deleted.')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error deleting application'
      showFeedback(msg, 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedback && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${
            feedback.type === 'success'
              ? 'bg-gray-900 text-white'
              : 'bg-red-600 text-white'
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Volunteer Applications
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Review, contact, and manage community volunteers ({applications.length} total)
          </p>
        </div>
      </div>

      {/* Controls Bar: Search & Status Tabs */}
      <div className="bg-white rounded-xl p-4 sm:p-5 shadow-xs border border-gray-200 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search by name, email, phone, skills…"
              aria-label="Search volunteer applications"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-50/50 border border-gray-300 rounded-lg px-4 py-2 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30 focus:border-[#16A34A]"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-2 text-xs text-gray-400 hover:text-gray-700"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Export / Count Summary */}
          <div className="text-xs text-gray-500 flex items-center gap-2 self-end md:self-center">
            <span>Showing <strong className="text-gray-900">{filteredApplications.length}</strong> of {applications.length} applications</span>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs sm:text-sm font-medium border-t border-gray-100 pt-3">
          {STATUS_TABS.map((tab) => {
            const count = counts[tab.value]
            const active = statusFilter === tab.value
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setStatusFilter(tab.value)}
                className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  active
                    ? 'bg-[#16A34A] text-white font-semibold shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[11px] px-1.5 py-0.5 rounded-full font-bold ${
                    active ? 'bg-white/20 text-white' : 'bg-black/5 text-gray-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Applications List / Table */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
        {filteredApplications.length === 0 ? (
          <div className="py-12">
            <EmptyState
              icon="🤝"
              title={
                applications.length === 0
                  ? 'No volunteer applications yet'
                  : 'No matching applications found'
              }
              message={
                applications.length === 0
                  ? 'When community members submit the volunteer form, their applications will appear here.'
                  : 'Try clearing your search or adjusting your status filter.'
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-700 text-xs uppercase font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3.5">Applicant</th>
                  <th className="px-5 py-3.5">Contact</th>
                  <th className="px-5 py-3.5">Interests &amp; Availability</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredApplications.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-gray-50/70 transition-colors group"
                  >
                    {/* Name & Location */}
                    <td className="px-5 py-4">
                      <div className="font-semibold text-gray-900">
                        {app.firstName} {app.lastName}
                      </div>
                      {app.location && (
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <span>📍</span> {app.location}
                        </div>
                      )}
                      {app.adminNotes && (
                        <div className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5 inline-flex items-center gap-1 mt-1 max-w-[200px] truncate">
                          <span>📝</span> {app.adminNotes}
                        </div>
                      )}
                      {app.communications && app.communications.length > 0 && (
                        <div className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 rounded px-1.5 py-0.5 inline-flex items-center gap-1 mt-1 ml-1">
                          <span>✉️</span> {app.communications.length} {app.communications.length === 1 ? 'reply' : 'replies'}
                        </div>
                      )}
                    </td>

                    {/* Contact */}
                    <td className="px-5 py-4">
                      <a
                        href={`mailto:${app.email}`}
                        className="text-xs font-medium text-gray-900 hover:text-[#16A34A] block truncate max-w-[200px]"
                        title={app.email}
                      >
                        {app.email}
                      </a>
                      {app.phone && (
                        <a
                          href={`tel:${app.phone}`}
                          className="text-xs text-gray-500 hover:text-gray-900 block mt-0.5"
                        >
                          {app.phone}
                        </a>
                      )}
                    </td>

                    {/* Interests & Availability */}
                    <td className="px-5 py-4 max-w-xs">
                      <div className="flex flex-wrap gap-1 mb-1">
                        {app.interests && app.interests.length > 0 ? (
                          app.interests.slice(0, 2).map((interest) => (
                            <span
                              key={interest}
                              className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 truncate"
                            >
                              {interest}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-500">General</span>
                        )}
                        {app.interests && app.interests.length > 2 && (
                          <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-600">
                            +{app.interests.length - 2}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        ⏱️ {app.availability || 'Flexible'}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={app.status} />
                        {updatingId === app.id && (
                          <span className="text-xs text-gray-400 animate-pulse">…</span>
                        )}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4 text-xs text-gray-500 whitespace-nowrap">
                      {new Date(app.createdAt).toLocaleDateString('en-CA', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedApp(app)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-50 text-[#16A34A] hover:bg-emerald-100 text-xs font-semibold transition-all border border-emerald-200 cursor-pointer"
                        >
                          View &amp; Reply
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteTarget(app)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all text-xs cursor-pointer"
                          title="Delete application"
                          aria-label={`Delete application from ${app.firstName} ${app.lastName}`}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Application Detail & Email Reply Modal */}
      {selectedApp && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="volunteer-detail-title"
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-gray-200 max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <div>
                <h2 id="volunteer-detail-title" className="text-lg font-bold text-gray-900">
                  Application Details
                </h2>
                <p className="text-xs text-gray-500">
                  Submitted on{' '}
                  {new Date(selectedApp.createdAt).toLocaleDateString('en-CA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all cursor-pointer"
                aria-label="Close details"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
              {/* Applicant Info & Status Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                    Applicant Name
                  </label>
                  <p className="font-bold text-gray-900 text-base">
                    {selectedApp.firstName} {selectedApp.lastName}
                  </p>
                  {selectedApp.location && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      📍 {selectedApp.location}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                    Application Status
                  </label>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedApp.status}
                      onChange={(e) =>
                        handleUpdateStatus(
                          selectedApp.id,
                          e.target.value as VolunteerApplication['status'],
                        )
                      }
                      className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-900 focus:ring-2 focus:ring-[#16A34A]/30 focus:border-[#16A34A] focus:outline-none cursor-pointer"
                    >
                      <option value="NEW">New / Pending</option>
                      <option value="REVIEWING">Reviewing</option>
                      <option value="CONTACTED">Contacted</option>
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                    <StatusBadge status={selectedApp.status} />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-white border border-gray-200 rounded-xl">
                    <span className="text-xs text-gray-500 block">Email</span>
                    <a
                      href={`mailto:${selectedApp.email}`}
                      className="font-medium text-[#16A34A] hover:underline break-all"
                    >
                      {selectedApp.email}
                    </a>
                  </div>
                  <div className="p-3 bg-white border border-gray-200 rounded-xl">
                    <span className="text-xs text-gray-500 block">Phone</span>
                    {selectedApp.phone ? (
                      <a
                        href={`tel:${selectedApp.phone}`}
                        className="font-medium text-gray-900 hover:underline"
                      >
                        {selectedApp.phone}
                      </a>
                    ) : (
                      <span className="text-gray-400 text-xs italic">Not provided</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Volunteer Preferences */}
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Volunteer Preferences
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-white border border-gray-200 rounded-xl">
                    <span className="text-xs text-gray-500 block mb-1.5">
                      Areas of Interest
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedApp.interests && selectedApp.interests.length > 0 ? (
                        selectedApp.interests.map((item) => (
                          <span
                            key={item}
                            className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 font-medium text-xs border border-emerald-200"
                          >
                            {item}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-500">General Interest</span>
                      )}
                    </div>
                  </div>

                  <div className="p-3 bg-white border border-gray-200 rounded-xl">
                    <span className="text-xs text-gray-500 block mb-1">Availability</span>
                    <p className="font-medium text-gray-900">{selectedApp.availability}</p>
                  </div>
                </div>
              </div>

              {/* Message from Applicant */}
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Applicant Statement / Message
                </h3>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 whitespace-pre-wrap leading-relaxed">
                  {selectedApp.message ? (
                    selectedApp.message
                  ) : (
                    <span className="text-gray-400 italic text-xs">
                      No additional message provided.
                    </span>
                  )}
                </div>
              </div>

              {/* Consent */}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="text-[#16A34A] font-bold">✓</span>
                <span>Applicant consented to information storage and contact policy.</span>
              </div>

              {/* ─── Communication History ──────────────────────────── */}
              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                    <span>📬</span> Communication History ({selectedApp.communications?.length || 0})
                  </h3>
                </div>

                {selectedApp.communications && selectedApp.communications.length > 0 ? (
                  <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                    {selectedApp.communications.map((comm) => (
                      <div
                        key={comm.id}
                        className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between gap-2 border-b border-gray-200 pb-2">
                          <span className="font-bold text-gray-900 truncate">
                            {comm.subject}
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Sent
                          </span>
                        </div>
                        <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                          {comm.message}
                        </p>
                        <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                          <span>Sent to: <strong className="text-gray-900">{comm.recipientEmail}</strong></span>
                          <span>
                            {new Date(comm.sentAt).toLocaleDateString('en-CA', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-center text-xs text-gray-500">
                    No email replies sent to this applicant yet.
                  </div>
                )}
              </div>

              {/* ─── Reply by Email ─────────────────────────────────── */}
              <div className="border-t border-gray-200 pt-4 space-y-3">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span>✉️</span> Reply by Email
                </h3>

                <form onSubmit={handleSendReply} className="space-y-3">
                  {replyError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3.5 py-2.5 rounded-xl">
                      {replyError}
                    </div>
                  )}

                  {/* To (Read-only) */}
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">
                      To <span className="text-[11px] text-gray-400">(Applicant Email)</span>
                    </label>
                    <input
                      type="email"
                      readOnly
                      value={selectedApp.email}
                      className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3.5 py-2 text-xs text-gray-600 cursor-not-allowed select-none"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="reply-subject" className="text-xs text-gray-900 font-semibold block mb-1">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="reply-subject"
                      type="text"
                      value={replySubject}
                      onChange={(e) => setReplySubject(e.target.value)}
                      placeholder="Subject line"
                      required
                      className="w-full bg-white border border-gray-300 rounded-lg px-3.5 py-2 text-xs text-gray-900 focus:ring-2 focus:ring-[#16A34A]/30 focus:border-[#16A34A] focus:outline-none"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="reply-message" className="text-xs text-gray-900 font-semibold block mb-1">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="reply-message"
                      rows={4}
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Write your email response to the applicant…"
                      required
                      className="w-full bg-white border border-gray-300 rounded-lg p-3 text-xs text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#16A34A]/30 focus:border-[#16A34A] focus:outline-none resize-y"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <p className="text-[11px] text-gray-500">
                      ℹ️ Replies update status to <strong className="text-gray-900">Contacted</strong>.
                    </p>
                    <button
                      type="submit"
                      disabled={sendingReply}
                      className="px-4 py-2 rounded-lg bg-[#16A34A] text-white text-xs font-semibold hover:bg-[#15803D] transition-all disabled:opacity-60 cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
                    >
                      {sendingReply ? (
                        <>
                          <span className="animate-spin text-xs">⏳</span>
                          <span>Sending Email…</span>
                        </>
                      ) : (
                        <>
                          <span>Send Email Reply</span>
                          <span>↗</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Internal Admin Notes */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="admin-notes" className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                    <span>📝</span> Internal Admin Notes
                  </label>
                  <span className="text-[11px] text-gray-400 italic">
                    (Not visible to applicant)
                  </span>
                </div>
                <textarea
                  id="admin-notes"
                  rows={2}
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="Record review notes, interview feedback, schedule details, or follow-up tasks…"
                  className="w-full bg-white border border-gray-300 rounded-lg p-3 text-xs text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#16A34A]/30 focus:border-[#16A34A] focus:outline-none"
                />
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={handleSaveNotes}
                    disabled={savingNotes}
                    className="px-3.5 py-1.5 rounded-lg border border-gray-300 bg-white text-gray-800 text-xs font-semibold hover:bg-gray-50 transition-all disabled:opacity-60 cursor-pointer shadow-xs"
                  >
                    {savingNotes ? 'Saving…' : 'Save Notes'}
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setDeleteTarget(selectedApp)
                  setSelectedApp(null)
                }}
                className="text-xs text-red-600 hover:text-red-800 font-semibold cursor-pointer"
              >
                Delete Application
              </button>

              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 font-semibold text-xs hover:bg-gray-100 transition-all cursor-pointer shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-confirm-title"
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-gray-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center text-2xl mx-auto">
              ⚠️
            </div>
            <div className="text-center">
              <h3 id="delete-confirm-title" className="text-lg font-bold text-gray-900">
                Delete Volunteer Application?
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                Are you sure you want to permanently delete the application from{' '}
                <strong className="text-gray-900">
                  {deleteTarget.firstName} {deleteTarget.lastName}
                </strong>
                ? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-lg border border-gray-300 font-semibold text-xs text-gray-700 hover:bg-gray-50 transition-all cursor-pointer shadow-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-lg bg-red-600 text-white font-semibold text-xs hover:bg-red-700 transition-all disabled:opacity-60 cursor-pointer shadow-xs"
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
