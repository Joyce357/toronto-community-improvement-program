// ─── Admin Stat Card ──────────────────────────────────────────────────────

interface StatCardProps {
  label:    string
  value:    string | number
  icon:     React.ReactNode | string
  subLabel?: string
  subValue?: string | number
  color?:   'green' | 'blue' | 'amber' | 'purple' | 'red'
}

const colorMap = {
  green:  { bg: 'bg-[#16A34A]/10', text: 'text-[#15803D]', line: 'bg-[#16A34A]' },
  blue:   { bg: 'bg-[#0284C7]/10', text: 'text-[#0369A1]', line: 'bg-[#0284C7]' },
  amber:  { bg: 'bg-[#D97706]/10', text: 'text-[#B45309]', line: 'bg-[#D97706]' },
  purple: { bg: 'bg-[#9333EA]/10', text: 'text-[#7E22CE]', line: 'bg-[#9333EA]' },
  red:    { bg: 'bg-[#DC2626]/10', text: 'text-[#B91C1C]', line: 'bg-[#DC2626]' },
}

export default function StatCard({
  label,
  value,
  icon,
  subLabel,
  subValue,
  color = 'green',
}: StatCardProps) {
  const theme = colorMap[color] ?? colorMap.green

  return (
    <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#E5E7EB] hover:shadow-sm transition-all duration-200 flex flex-col justify-between relative overflow-hidden">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${theme.bg} ${theme.text} mb-3`}>
            {typeof icon === 'string' ? <span className="material-symbols-outlined text-2xl">{icon}</span> : icon}
          </div>
          <p className="text-3xl font-extrabold text-[#111827] tracking-tight">{value}</p>
          <p className="text-[#6B7280] text-xs sm:text-sm font-medium mt-1 truncate">{label}</p>
          {subLabel && subValue !== undefined && (
            <p className="text-[#6B7280] text-xs mt-1">
              <span className="font-semibold text-[#15803D]">{subValue}</span>
              {' '}{subLabel}
            </p>
          )}
        </div>
      </div>
      {/* Subtle indicator accent line */}
      <div className={`h-1 w-10 rounded-full ${theme.line} mt-4 opacity-75`} />
    </div>
  )
}
