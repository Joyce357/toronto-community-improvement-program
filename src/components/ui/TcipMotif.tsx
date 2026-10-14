interface TcipMotifProps {
  className?: string
  align?: 'left' | 'center' | 'right'
  light?: boolean
}

export default function TcipMotif({
  className = '',
  align = 'left',
  light = false,
}: TcipMotifProps) {
  const justifyClass =
    align === 'center'
      ? 'justify-center mx-auto'
      : align === 'right'
      ? 'justify-end ml-auto'
      : 'justify-start'

  return (
    <div
      className={`flex items-center gap-1.5 pointer-events-none select-none ${justifyClass} ${className}`}
      aria-hidden="true"
    >
      {/* Primary rounded green line */}
      <span className="h-1 w-8 sm:w-10 rounded-full bg-brand-green shrink-0" />
      
      {/* Small red accent dot */}
      <span className="h-1.5 w-1.5 rounded-full bg-brand-red shrink-0" />
      
      {/* Thin black/light neutral divider */}
      <span
        className={`h-[1px] w-5 sm:w-6 rounded-full shrink-0 ${
          light ? 'bg-white/30' : 'bg-brand-black/20 dark:bg-white/20'
        }`}
      />
    </div>
  )
}
