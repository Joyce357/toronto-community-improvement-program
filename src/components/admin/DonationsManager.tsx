'use client'
// ─── Admin Donations Manager Component ─────────────────────────────────────────
// Full-featured CMS for reviewing, searching, filtering, and managing donations.
// Includes real aggregation KPIs, detail modal, CSV export, and receipt resend.
// Light UI adhering to TCIP branding.

import { useState, useEffect, useCallback } from 'react'
import StatusBadge from '@/components/admin/StatusBadge'
import EmptyState from '@/components/admin/EmptyState'
import StatCard from '@/components/admin/StatCard'
import type { DonationRecord, DonationSummaryStats } from '@/types'

interface DonationsManagerProps {
  initialDonations: DonationRecord[]
  initialStats: DonationSummaryStats
}

export default function DonationsManager({ initialDonations, initialStats }: DonationsManagerProps) {
  const [donations, setDonations] = useState<DonationRecord[]>(initialDonations)
  const [stats, setStats] = useState<DonationSummaryStats>(initialStats)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [page, setPage] = useState(1)
  const [totalFiltered, setTotalFiltered] = useState(initialDonations.length)
  
  // Detail Modal State
  const [selectedDonation, setSelectedDonation] = useState<DonationRecord | null>(null)
  const [resendingReceipt, setResendingReceipt] = useState(false)
  const [resendStatus, setResendStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Fetch donations with search & filter
  const fetchDonations = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'ALL') params.set('status', statusFilter)
      if (searchQuery.trim()) params.set('q', searchQuery.trim())
      params.set('page', String(page))
      params.set('limit', '25')

      const res = await fetch(`/api/admin/donations?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to fetch donations')

      const data = await res.json()
      setDonations(data.donations || [])
      setTotalFiltered(data.total || 0)
      if (data.stats) {
        setStats(data.stats)
      }
    } catch (err) {
      console.error('[DonationsManager] Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [statusFilter, searchQuery, page])

  useEffect(() => {
    fetchDonations()
  }, [fetchDonations])

  // Handle Receipt Resend
  const handleResendReceipt = async (id: string) => {
    setResendingReceipt(true)
    setResendStatus(null)

    try {
      const res = await fetch(`/api/admin/donations/${id}/resend-receipt`, {
        method: 'POST',
      })
      const data = await res.json()

      if (!res.ok || !data.success) {
        setResendStatus({
          type: 'error',
          message: data.error || 'Failed to dispatch receipt email.',
        })
      } else {
        setResendStatus({
          type: 'success',
          message: data.message || 'Receipt sent successfully.',
        })
        // Update local record
        setDonations((prev) =>
          prev.map((d) => (d.id === id ? { ...d, receiptSent: true, receiptSentAt: data.receiptSentAt } : d))
        )
        if (selectedDonation && selectedDonation.id === id) {
          setSelectedDonation({
            ...selectedDonation,
            receiptSent: true,
            receiptSentAt: data.receiptSentAt,
          })
        }
      }
    } catch (err) {
      console.error('[Resend Receipt] Error:', err)
      setResendStatus({
        type: 'error',
        message: 'Network error while attempting to resend receipt.',
      })
    } finally {
      setResendingReceipt(false)
    }
  }

  // Export CSV
  const handleExportCSV = () => {
    const params = new URLSearchParams()
    if (statusFilter !== 'ALL') params.set('status', statusFilter)
    if (searchQuery.trim()) params.set('q', searchQuery.trim())
    window.open(`/api/admin/donations/export?${params.toString()}`, '_blank')
  }

  return (
    <div className="space-y-6">
      {/* 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Confirmed Raised"
          value={`$${stats.totalRaised.toFixed(2)}`}
          icon="💰"
          subLabel="CAD (completed only)"
          subValue=""
          color="green"
        />
        <StatCard
          label="Completed Gifts"
          value={stats.completedCount}
          icon="✅"
          subLabel="successful"
          subValue={stats.completedCount}
          color="blue"
        />
        <StatCard
          label="In-Flight Orders"
          value={stats.pendingCount}
          icon="⏳"
          subLabel="pending capture"
          subValue={stats.pendingCount}
          color="amber"
        />
        <StatCard
          label="Refunded / Failed"
          value={stats.refundedCount + stats.failedCount}
          icon="🔄"
          subLabel="refunds/fails"
          subValue={`${stats.refundedCount} ref / ${stats.failedCount} fail`}
          color="purple"
        />
      </div>

      {/* Action Toolbar */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-4 sm:p-5 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setPage(1)
            }}
            placeholder="Search by donor, email, PayPal ID…"
            aria-label="Search donations"
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-gray-300 bg-gray-50/50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30 focus:border-[#16A34A] placeholder:text-gray-400"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('')
                setPage(1)
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-700 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Status Filter & CSV Export */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
            {['ALL', 'COMPLETED', 'PENDING', 'INTENT', 'REFUNDED', 'FAILED'].map((st) => (
              <button
                key={st}
                onClick={() => {
                  setStatusFilter(st)
                  setPage(1)
                }}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-gray-900 text-white shadow-xs'
                    : 'bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {st === 'ALL' ? 'All' : st.charAt(0) + st.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 transition-colors shadow-xs cursor-pointer"
            title="Download CSV"
          >
            <span>📥</span> Export CSV
          </button>
        </div>
      </div>

      {/* Donations Data Table */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-gray-500 text-sm">
            <div className="inline-block animate-spin w-6 h-6 border-2 border-[#16A34A] border-t-transparent rounded-full mb-2" />
            <p>Loading donations…</p>
          </div>
        ) : donations.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon="💰"
              title="No donations found"
              message={
                searchQuery || statusFilter !== 'ALL'
                  ? 'No donation records match the current filter or search criteria.'
                  : 'No donation records have been registered in the database yet.'
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-700 text-xs uppercase font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3.5">Donor</th>
                  <th className="px-5 py-3.5">Amount</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">PayPal Ref</th>
                  <th className="px-5 py-3.5">Receipt</th>
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {donations.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50/70 transition-colors">
                    {/* Donor Column */}
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-gray-900 text-sm">
                        {d.isAnonymous ? (
                          <span className="inline-flex items-center gap-1">
                            <span className="text-gray-400 font-normal">👤</span> Anonymous
                          </span>
                        ) : (
                          d.donorName || 'Supporter'
                        )}
                      </div>
                      <div className="text-xs text-gray-500 truncate max-w-[180px]">
                        {d.donorEmail || 'No email provided'}
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="font-bold text-gray-900 text-base">
                        {d.currency} ${Number(d.amount).toFixed(2)}
                      </span>
                      <span className="block text-[11px] text-gray-500">
                        {d.frequency === 'ONE_TIME' ? 'One-time' : d.frequency.toLowerCase()}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <StatusBadge status={d.status} />
                    </td>

                    {/* PayPal Identifier */}
                    <td className="px-5 py-3.5 whitespace-nowrap font-mono text-xs text-gray-500">
                      <span title={d.paypalOrderId || d.paypalCaptureId || 'No PayPal ID'}>
                        {d.paypalCaptureId
                          ? `cap_${d.paypalCaptureId.slice(0, 8)}…`
                          : d.paypalOrderId
                          ? `ord_${d.paypalOrderId.slice(0, 8)}…`
                          : '—'}
                      </span>
                    </td>

                    {/* Receipt Status */}
                    <td className="px-5 py-3.5 whitespace-nowrap text-xs">
                      {d.receiptSent ? (
                        <span className="inline-flex items-center gap-1 text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <span>✓</span> Sent
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                          Pending
                        </span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="px-5 py-3.5 whitespace-nowrap text-xs text-gray-500">
                      {new Date(d.createdAt).toLocaleDateString('en-CA', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedDonation(d)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors border border-gray-200 cursor-pointer"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {totalFiltered > 25 && (
          <div className="p-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-600">
            <span>
              Showing {(page - 1) * 25 + 1}–{Math.min(page * 25, totalFiltered)} of {totalFiltered} donations
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
              <button
                disabled={page * 25 >= totalFiltered}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── DETAIL MODAL ── */}
      {selectedDonation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-5">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Donation Record</h3>
                <p className="text-xs text-gray-500 font-mono mt-0.5">ID: {selectedDonation.id}</p>
              </div>
              <button
                onClick={() => setSelectedDonation(null)}
                className="text-gray-400 hover:text-gray-700 text-lg p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Notification */}
            {resendStatus && (
              <div
                className={`mb-4 p-3 rounded-lg text-xs font-medium border ${
                  resendStatus.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-red-50 text-red-800 border-red-200'
                }`}
                role="alert"
              >
                {resendStatus.message}
              </div>
            )}

            {/* Detail Grid */}
            <div className="space-y-4 text-xs sm:text-sm">
              {/* Amount & Status Banner */}
              <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl">
                <div>
                  <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Amount</span>
                  <p className="text-2xl font-bold text-gray-900">
                    {selectedDonation.currency} ${Number(selectedDonation.amount).toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500 uppercase font-bold tracking-wider block mb-1">Status</span>
                  <StatusBadge status={selectedDonation.status} />
                </div>
              </div>

              {/* Donor Information */}
              <div className="border border-gray-200 rounded-xl p-4 space-y-2.5">
                <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500">Donor Information</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500">Donor Name:</span>
                    <p className="font-semibold text-gray-900">
                      {selectedDonation.isAnonymous ? (
                        <span className="text-gray-500 font-normal italic">Anonymous Supporter</span>
                      ) : (
                        selectedDonation.donorName || 'N/A'
                      )}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Donor Email:</span>
                    <p className="font-semibold text-gray-900 break-all">{selectedDonation.donorEmail || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Public Recognition:</span>
                    <p className="font-semibold text-gray-900">
                      {selectedDonation.isAnonymous ? '🔒 Anonymous' : 'Public / Recognized'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Frequency:</span>
                    <p className="font-semibold text-gray-900">One-Time Gift</p>
                  </div>
                </div>

                {selectedDonation.message && (
                  <div className="pt-2 border-t border-gray-100 mt-2">
                    <span className="text-gray-500">Donor Message / Dedication:</span>
                    <p className="italic text-gray-900 mt-1 bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                      &ldquo;{selectedDonation.message}&rdquo;
                    </p>
                  </div>
                )}
              </div>

              {/* PayPal Technical Details */}
              <div className="border border-gray-200 rounded-xl p-4 space-y-2.5">
                <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500">PayPal Gateway Identifiers</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  <div>
                    <span className="text-gray-500 font-sans">PayPal Order ID:</span>
                    <p className="text-gray-900 truncate">{selectedDonation.paypalOrderId || '—'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 font-sans">PayPal Capture ID:</span>
                    <p className="text-gray-900 truncate">{selectedDonation.paypalCaptureId || '—'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 font-sans">Payer ID:</span>
                    <p className="text-gray-900 truncate">{selectedDonation.paypalPayerId || '—'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 font-sans">Payer PayPal Email:</span>
                    <p className="text-gray-900 truncate">{selectedDonation.paypalPayerEmail || '—'}</p>
                  </div>
                </div>
              </div>

              {/* Receipt Status & Action */}
              <div className="border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500">Receipt Delivery</h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {selectedDonation.receiptSent
                      ? `Receipt sent on ${new Date(selectedDonation.receiptSentAt || selectedDonation.createdAt).toLocaleDateString('en-CA')}`
                      : 'Receipt has not yet been dispatched.'}
                  </p>
                </div>

                {selectedDonation.status === 'COMPLETED' && selectedDonation.donorEmail && (
                  <button
                    onClick={() => handleResendReceipt(selectedDonation.id)}
                    disabled={resendingReceipt}
                    className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#16A34A] text-white hover:bg-[#15803D] disabled:opacity-50 transition-all shadow-xs shrink-0 cursor-pointer"
                  >
                    {resendingReceipt ? 'Sending…' : 'Resend Receipt'}
                  </button>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setSelectedDonation(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
