// ─── Admin Status Badge ───────────────────────────────────────────────────

interface StatusBadgeProps {
  status: string
}

const statusStyles: Record<string, string> = {
  // Contact
  NEW:          'bg-sky-50 text-sky-800 font-semibold border border-sky-200',
  READ:         'bg-gray-100 text-gray-700 border border-gray-200',
  REPLIED:      'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200',
  ARCHIVED:     'bg-gray-100 text-gray-500 border border-gray-200',
  // Volunteer
  REVIEWING:    'bg-amber-50 text-amber-800 font-semibold border border-amber-200',
  CONTACTED:    'bg-sky-50 text-sky-800 font-semibold border border-sky-200',
  ACTIVE:       'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200',
  INACTIVE:     'bg-gray-100 text-gray-600 font-medium border border-gray-200',
  // Newsletter
  UNSUBSCRIBED: 'bg-red-50 text-red-600 border border-red-200',
  // Donation
  INTENT:       'bg-gray-100 text-gray-700 border border-gray-200',
  PENDING:      'bg-amber-50 text-amber-800 font-semibold border border-amber-200',
  COMPLETED:    'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200',
  FAILED:       'bg-red-50 text-red-800 font-semibold border border-red-200',
  CANCELLED:    'bg-gray-100 text-gray-500 border border-gray-200',
  REFUNDED:     'bg-purple-50 text-purple-800 font-semibold border border-purple-200',
  // Published / Draft
  PUBLISHED:    'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200',
  DRAFT:        'bg-amber-50 text-amber-800 font-semibold border border-amber-200',
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const normalized = status.toUpperCase()
  const style = statusStyles[normalized] ?? 'bg-gray-100 text-gray-600 border border-gray-200'
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${style}`}>
      {status.charAt(0) + status.slice(1).toLowerCase().replace('_', ' ')}
    </span>
  )
}
