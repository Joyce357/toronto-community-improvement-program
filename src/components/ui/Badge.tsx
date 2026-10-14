interface BadgeProps {
  children: React.ReactNode
  variant?:
    | 'green'
    | 'red'
    | 'black'
    | 'navy'
    | 'emerald'
    | 'gold'
    | 'sage'
    | 'blue'
    | 'cyan'
    | 'orange'
    | 'pink'
    | 'purple'
    | 'soft'
    | 'outline'
  className?: string
}

export default function Badge({ children, variant = 'soft', className = '' }: BadgeProps) {
  const variants = {
    green:   'bg-brand-green/10 text-brand-green-dark dark:text-brand-green-light border border-brand-green/30',
    emerald: 'bg-brand-green/10 text-brand-green-dark dark:text-brand-green-light border border-brand-green/30',
    red:     'bg-brand-red/10 text-brand-red dark:text-brand-red-light border border-brand-red/25',
    gold:    'bg-brand-red/10 text-brand-red dark:text-brand-red-light border border-brand-red/25',
    black:   'bg-tcip-black text-white border border-black/40',
    navy:    'bg-tcip-black text-white border border-black/40',
    sage:    'bg-brand-sage text-brand-black dark:bg-dark-surface dark:text-white border border-border-soft dark:border-dark-border',
    blue:    'bg-blue-50 text-blue-900 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800',
    cyan:    'bg-brand-green/10 text-brand-green-dark dark:text-brand-green-light border border-brand-green/30',
    orange:  'bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800',
    pink:    'bg-brand-red/10 text-brand-red border border-brand-red/20',
    purple:  'bg-purple-50 text-purple-900 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800',
    soft:    'bg-brand-cream text-text-primary dark:bg-dark-surface dark:text-dark-text-primary border border-border-soft dark:border-dark-border',
    outline: 'border border-border-soft text-text-secondary dark:border-dark-border dark:text-dark-text-secondary',
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
