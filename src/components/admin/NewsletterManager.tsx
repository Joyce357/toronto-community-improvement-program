'use client'

// ─── Admin Newsletter Manager ────────────────────────────────────────────────
// Real Neon-backed management interface for newsletter subscribers.

import { useState, useMemo, useEffect, useCallback } from 'react'
import StatusBadge from '@/components/admin/StatusBadge'
import EmptyState from '@/components/admin/EmptyState'
import type { NewsletterSubscriber } from '@/types'

interface NewsletterManagerProps {
  initialSubscribers: NewsletterSubscriber[]
}

type StatusFilter = 'ALL' | 'ACTIVE' | 'UNSUBSCRIBED'

const STATUS_TABS: { label: string; value: StatusFilter }[] = [
  { label: 'All',          value: 'ALL'          },
  { label: 'Active',       value: 'ACTIVE'       },
  { label: 'Unsubscribed', value: 'UNSUBSCRIBED' },
]

export default function NewsletterManager({ initialSubscribers }: NewsletterManagerProps) {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>(initialSubscribers)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')

  // Action states
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<NewsletterSubscriber | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Feedback Toast
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showFeedback = (message: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ message, type })
    setTimeout(() => setFeedback(null), 4000)
  }

  // ESC to close delete modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && deleteTarget) {
        setDeleteTarget(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [deleteTarget])

  // Status Counts
  const counts = useMemo(() => {
    let active = 0
    let unsubscribed = 0
    for (const s of subscribers) {
      if (s.status === 'ACTIVE') active++
      else if (s.status === 'UNSUBSCRIBED') unsubscribed++
    }
    return {
      ALL: subscribers.length,
      ACTIVE: active,
      UNSUBSCRIBED: unsubscribed,
    }
  }, [subscribers])

  // Filtered subscribers
  const filtered = useMemo(() => {
    return subscribers.filter((s) => {
      const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter
      if (!matchesStatus) return false

      if (!search.trim()) return true
      const q = search.toLowerCase().trim()
      const matchesEmail = s.email.toLowerCase().includes(q)
      const matchesName = s.firstName ? s.firstName.toLowerCase().includes(q) : false
      return matchesEmail || matchesName
    })
  }, [subscribers, statusFilter, search])

  // Toggle status (Unsubscribe / Reactivate)
  const handleToggleStatus = useCallback(async (subscriber: NewsletterSubscriber) => {
    const newStatus: 'ACTIVE' | 'UNSUBSCRIBED' = subscriber.status === 'ACTIVE' ? 'UNSUBSCRIBED' : 'ACTIVE'
    setUpdatingId(subscriber.id)

    try {
      const res = await fetch(`/api/admin/newsletter/${subscriber.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to update subscriber status.')
      }

      const { subscriber: updated } = await res.json()
      setSubscribers((prev) =>
        prev.map((s) => (s.id === updated.id ? { ...s, ...updated } : s))
      )
      showFeedback(
        newStatus === 'ACTIVE'
          ? `Reactivated subscription for ${subscriber.email}`
          : `Unsubscribed ${subscriber.email}`,
        'success',
      )
    } catch (err) {
      showFeedback((err as Error).message || 'Failed to update subscriber.', 'error')
    } finally {
      setUpdatingId(null)
    }
  }, [])

  // Delete subscriber
  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return
    setIsDeleting(true)

    try {
      const res = await fetch(`/api/admin/newsletter/${deleteTarget.id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to delete subscriber.')
      }

      setSubscribers((prev) => prev.filter((s) => s.id !== deleteTarget.id))
      showFeedback(`Deleted ${deleteTarget.email}`, 'success')
      setDeleteTarget(null)
    } catch (err) {
      showFeedback((err as Error).message || 'Failed to delete subscriber.', 'error')
    } finally {
      setIsDeleting(false)
    }
  }, [deleteTarget])

  // Export to CSV
  const handleExportCSV = useCallback(() => {
    if (filtered.length === 0) {
      showFeedback('No subscribers to export.', 'error')
      return
    }

    const headers = ['Email', 'First Name', 'Status', 'Subscribed Date', 'Unsubscribed Date']
    const rows = filtered.map((s) => [
      `"${s.email.replace(/"/g, '""')}"`,
      `"${(s.firstName || '').replace(/"/g, '""')}"`,
      `"${s.status}"`,
      `"${s.subscribedAt ? new Date(s.subscribedAt).toISOString() : ''}"`,
      `"${s.unsubscribedAt ? new Date(s.unsubscribedAt).toISOString() : ''}"`,
    ])

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const dateStr = new Date().toISOString().split('T')[0]
    link.setAttribute('href', url)
    link.setAttribute('download', `tcip-newsletter-subscribers-${statusFilter.toLowerCase()}-${dateStr}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    showFeedback(`Exported ${filtered.length} subscribers to CSV.`, 'success')
  }, [filtered, statusFilter])

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedback && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl text-sm font-medium transition-all ${
            feedback.type === 'success'
              ? 'bg-gray-900 text-white'
              : 'bg-red-600 text-white'
          }`}
        >
          <span>{feedback.type === 'success' ? '✓' : '⚠️'}</span>
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Header with Stats & Export Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Newsletter Subscribers</h1>
          <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
            <span className="font-semibold text-emerald-700">{counts.ACTIVE} active</span>
            <span>·</span>
            <span>{counts.UNSUBSCRIBED} unsubscribed</span>
            <span>·</span>
            <span>{counts.ALL} total</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={filtered.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 rounded-lg text-xs sm:text-sm font-semibold transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            aria-label="Export subscribers to CSV"
          >
            <span>📥</span>
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Search & Tabs Toolbar */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-4 sm:p-5 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center">
          {/* Status Tabs */}
          <div
            className="flex p-1 bg-gray-100 rounded-lg border border-gray-200 w-full md:w-auto overflow-x-auto"
            role="tablist"
            aria-label="Filter by subscription status"
          >
            {STATUS_TABS.map((tab) => {
              const active = statusFilter === tab.value
              return (
                <button
                  key={tab.value}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setStatusFilter(tab.value)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-white text-gray-900 font-semibold shadow-xs'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full ${
                      active ? 'bg-emerald-50 text-emerald-800 font-bold' : 'bg-black/5 text-gray-500'
                    }`}
                  >
                    {counts[tab.value]}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 text-xs">
              🔍
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search email or name..."
              className="w-full pl-8 pr-8 py-2 rounded-lg bg-gray-50/50 border border-gray-300 text-gray-900 placeholder-gray-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30 focus:border-[#16A34A] transition-all"
              aria-label="Search subscribers"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-700 text-xs"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Search summary indicator */}
        {search.trim() && (
          <div className="text-xs text-gray-500 flex items-center justify-between pt-1 border-t border-gray-100">
            <span>
              Showing {filtered.length} match{filtered.length !== 1 ? 'es' : ''} for &ldquo;{search}&rdquo;
            </span>
            <button
              type="button"
              onClick={() => setSearch('')}
              className="text-[#16A34A] font-medium hover:underline text-xs cursor-pointer"
            >
              Reset search
            </button>
          </div>
        )}
      </div>

      {/* Subscriber List / Table */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            icon="📬"
            title={search ? 'No matching subscribers' : 'No subscribers found'}
            message={
              search
                ? `No subscribers matched "${search}". Try another search or filter.`
                : statusFilter !== 'ALL'
                ? `There are no ${statusFilter.toLowerCase()} subscribers at the moment.`
                : 'Subscribers will appear here once visitors sign up on the website.'
            }
          />
        ) : (
          <>
            {/* Desktop Table View (Hidden on mobile) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 text-xs uppercase tracking-wider font-semibold">
                  <tr>
                    <th scope="col" className="px-6 py-3.5">Email</th>
                    <th scope="col" className="px-6 py-3.5">Name</th>
                    <th scope="col" className="px-6 py-3.5">Status</th>
                    <th scope="col" className="px-6 py-3.5">Subscribed</th>
                    <th scope="col" className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((sub) => {
                    const isUpdating = updatingId === sub.id
                    return (
                      <tr
                        key={sub.id}
                        className="hover:bg-gray-50/70 transition-colors group"
                      >
                        <td className="px-6 py-4 font-medium text-gray-900">
                          <span className="font-mono text-xs sm:text-sm">{sub.email}</span>
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-xs sm:text-sm">
                          {sub.firstName || <span className="text-gray-400">—</span>}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={sub.status} />
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-xs whitespace-nowrap">
                          <div>
                            {new Date(sub.subscribedAt).toLocaleDateString('en-CA', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </div>
                          {sub.unsubscribedAt && sub.status === 'UNSUBSCRIBED' && (
                            <div className="text-red-500 text-[11px] mt-0.5">
                              Unsub:{' '}
                              {new Date(sub.unsubscribedAt).toLocaleDateString('en-CA', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-2">
                            {sub.status === 'ACTIVE' ? (
                              <button
                                type="button"
                                disabled={isUpdating}
                                onClick={() => handleToggleStatus(sub)}
                                className="px-2.5 py-1 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-all disabled:opacity-50 cursor-pointer"
                                title="Unsubscribe this email"
                              >
                                {isUpdating ? 'Updating...' : 'Unsubscribe'}
                              </button>
                            ) : (
                              <button
                                type="button"
                                disabled={isUpdating}
                                onClick={() => handleToggleStatus(sub)}
                                className="px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-all disabled:opacity-50 cursor-pointer"
                                title="Reactivate this subscription"
                              >
                                {isUpdating ? 'Updating...' : 'Reactivate'}
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => setDeleteTarget(sub)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                              aria-label={`Delete subscriber ${sub.email}`}
                              title="Delete subscriber"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View (Hidden on desktop) */}
            <div className="block md:hidden divide-y divide-gray-100">
              {filtered.map((sub) => {
                const isUpdating = updatingId === sub.id
                return (
                  <div key={sub.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-semibold text-gray-900 text-sm break-all font-mono">
                          {sub.email}
                        </div>
                        {sub.firstName && (
                          <div className="text-xs text-gray-500 mt-0.5">
                            {sub.firstName}
                          </div>
                        )}
                      </div>
                      <StatusBadge status={sub.status} />
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                      <span>
                        Subscribed:{' '}
                        {new Date(sub.subscribedAt).toLocaleDateString('en-CA', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>

                      <div className="flex items-center gap-2">
                        {sub.status === 'ACTIVE' ? (
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => handleToggleStatus(sub)}
                            className="px-2.5 py-1 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-all disabled:opacity-50 cursor-pointer"
                          >
                            {isUpdating ? '...' : 'Unsubscribe'}
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => handleToggleStatus(sub)}
                            className="px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-all disabled:opacity-50 cursor-pointer"
                          >
                            {isUpdating ? '...' : 'Reactivate'}
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setDeleteTarget(sub)}
                          className="p-1 text-gray-400 hover:text-red-600 rounded-lg cursor-pointer"
                          aria-label={`Delete subscriber ${sub.email}`}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-subscriber-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in zoom-in-95 duration-150"
          onClick={() => !isDeleting && setDeleteTarget(null)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-red-600">
              <span className="text-2xl">⚠️</span>
              <h3 id="delete-subscriber-title" className="text-lg font-bold text-gray-900">
                Delete Subscriber?
              </h3>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <strong className="text-gray-900 font-mono">{deleteTarget.email}</strong>?
              This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-lg transition-all disabled:opacity-50 cursor-pointer shadow-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-all shadow-xs disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                {isDeleting ? 'Deleting...' : 'Permanently Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
