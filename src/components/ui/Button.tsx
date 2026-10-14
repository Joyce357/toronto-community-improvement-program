import Link from 'next/link'
import { type ReactNode } from 'react'
import type { ButtonVariant, ButtonSize } from '@/types'

interface ButtonProps {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  href?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  className?: string
  ariaLabel?: string
  external?: boolean
}

const variantClass: Record<ButtonVariant, string> = {
  primary:           'btn-primary',
  secondary:         'btn-secondary',
  dark:              'btn-dark',
  accent:            'btn-accent',
  gold:              'btn-gold',
  outline:           'btn-outline',
  'outline-navy':    'btn-outline-navy',
  'outline-green':   'btn-outline-green',
  'outline-emerald': 'btn-outline-emerald',
  environmental:     'btn-environmental',
  cyan:              'btn-cyan',
  ghost:             'btn-ghost',
  soft:              'btn-soft',
  tertiary:          'btn-soft',
  danger:            'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600',
}

const sizeClass: Record<ButtonSize, string> = {
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  ariaLabel,
  external = false,
}: ButtonProps) {
  const classes = [
    variantClass[variant],
    sizeClass[size],
    disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (href) {
    return external ? (
      <a
        href={href}
        className={classes}
        aria-label={ariaLabel}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ) : (
      <Link href={href} className={classes} aria-label={ariaLabel}>
        {children}
      </Link>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  )
}
