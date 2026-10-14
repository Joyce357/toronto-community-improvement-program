import TcipMotif from '@/components/ui/TcipMotif'

interface SectionHeadingProps {
  id?: string
  eyebrow?: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  accent?: 'tcip' | 'green' | 'red' | 'black' | 'none'
  titleClassName?: string
  className?: string
  light?: boolean  // for use on dark backgrounds (e.g. Impact section)
}

export default function SectionHeading({
  id,
  eyebrow,
  title,
  subtitle,
  align = 'left',
  accent = 'tcip',
  titleClassName = '',
  className = '',
  light = false,
}: SectionHeadingProps) {
  const alignClass = align === 'center' ? 'text-center items-center' : 'text-left items-start'
  const titleColor = light ? 'text-white' : 'text-tcip-black dark:text-dark-text-primary'
  const subtitleColor = light ? 'text-white/80' : 'text-text-secondary dark:text-dark-text-secondary'

  return (
    <div id={id} className={`flex flex-col ${alignClass} ${className}`}>
      {eyebrow && (
        <div className="flex items-center gap-2 mb-2 sm:mb-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-green shrink-0" aria-hidden="true" />
          <span
            className={`text-xs sm:text-[13px] font-extrabold uppercase tracking-wider ${
              light ? 'text-brand-green-light' : 'text-brand-green'
            }`}
          >
            {eyebrow}
          </span>
        </div>
      )}

      <div className={align === 'center' ? 'flex flex-col items-center gap-2 sm:gap-2.5' : 'flex flex-col gap-2 sm:gap-2.5'}>
        <h2 className={`text-balance font-extrabold tracking-tight ${titleColor} ${titleClassName}`}>
          {title}
        </h2>
        {accent === 'tcip' && (
          <TcipMotif align={align} light={light} className="mt-1 mb-1" />
        )}
        {accent === 'green' && (
          <div className={`divider-green ${align === 'center' ? 'mx-auto' : ''}`} />
        )}
        {accent === 'red' && (
          <div className={`divider-red ${align === 'center' ? 'mx-auto' : ''}`} />
        )}
        {accent === 'black' && (
          <div className={`divider-black ${align === 'center' ? 'mx-auto' : ''}`} />
        )}
      </div>

      {subtitle && (
        <p className={`text-sm sm:text-base md:text-[16px] max-w-2xl leading-relaxed mt-2.5 sm:mt-3 ${subtitleColor}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
