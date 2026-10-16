'use client'
// ─── TCIP Public Header Component ──────────────────────────────────────────
// Clean, bright, Stitch-inspired navigation bar with white/off-white background,
// Plus Jakarta Sans typography, active link in green, and Donate CTA.

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Button from '@/components/ui/Button'
import { useVolunteerModal } from '@/context/VolunteerModalContext'

const navItems = [
  { label: 'Home',         href: '/' },
  { label: 'About Us',     href: '/#about' },
  { label: 'Programs',     href: '/programs' },
  { label: 'Impact',       href: '/#impact' },
  { label: 'Events',       href: '/events' },
  { label: 'Gallery',      href: '/gallery' },
  { label: 'Founder',      href: '/#founder' },
  { label: 'Contact',      href: '/contact' },
]

export default function Header() {
  const [isScrolled, setIsScrolled]     = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()
  const { openVolunteerModal } = useVolunteerModal()

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  // Detect scroll state
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMobileOpen])

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    if (href.startsWith('/#')) return false
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-md border-b border-outline-variant/40 transition-all duration-200 ${
          isScrolled ? 'shadow-sm' : ''
        }`}
        role="banner"
      >
        {/* ── Top Utility Bar (Stitch design) ── */}
        <div className="bg-surface-container-low border-b border-outline-variant/30 py-1.5 px-4 md:px-margin-desktop hidden lg:block">
          <div className="max-w-7xl mx-auto flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
            <span>Toronto Community Improvement Program • Serving Greater Toronto Area Communities</span>
            <span>09:00 – 17:00 • Toronto, Ontario</span>
          </div>
        </div>

        {/* ── Main Navigation Bar ── */}
        <div className="h-20 max-w-7xl mx-auto px-4 md:px-margin-desktop flex items-center justify-between gap-space-md">

          {/* ── TCIP Official Logo Mark (Stitch design) ────────────────── */}
          <Link
            href="/"
            className="flex items-center gap-space-sm group focus:outline-none shrink-0"
            aria-label="Toronto Community Improvement Program — Home"
          >
            <div className="w-10 h-10 rounded-full bg-tcip-black text-white font-extrabold text-sm flex items-center justify-center tracking-tight shadow-sm relative overflow-hidden border border-tcip-black shrink-0 group-hover:scale-105 transition-transform">
              <span className="relative z-10 flex items-center">
                <span className="text-white">T</span>
                <span className="text-primary font-bold">C</span>
                <span className="text-white">IP</span>
              </span>
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-tertiary" />
            </div>
            <div className="flex flex-col">
              <span className="font-title-md text-title-md text-on-surface group-hover:text-primary transition-colors leading-tight">
                Toronto Community Improvement Program
              </span>
              <span className="font-eyebrow-bold text-eyebrow-bold text-primary uppercase tracking-wider">
                TCIP Toronto
              </span>
            </div>
          </Link>

          {/* ── Desktop Navigation Links ──────────────────────────────── */}
          <nav
            className="hidden xl:flex items-center gap-space-md"
            aria-label="Main navigation"
          >
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`font-label-md text-label-md px-2.5 py-1.5 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'text-primary font-bold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* ── Right Action Controls (Get Involved + Green Pill Donate) ── */}
          <div className="flex items-center gap-space-md">
            <Link
              href="/get-involved"
              className="hidden sm:inline-block font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors"
            >
              Get Involved
            </Link>
            <Link
              href="/donate"
              className="inline-flex items-center justify-center bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md px-6 py-2.5 rounded-full shadow-sm hover:shadow transition-all duration-200"
            >
              Donate
            </Link>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="xl:hidden p-2 rounded-xl text-on-surface hover:bg-surface-container transition-colors"
              aria-label={isMobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">
                {isMobileOpen ? 'Close menu' : 'Open menu'}
              </span>
              <div className="w-5 h-4 flex flex-col justify-between">
                <span
                  className={`block h-0.5 bg-current rounded-full transition-all duration-300 ${
                    isMobileOpen ? 'rotate-45 translate-y-1.5' : ''
                  }`}
                />
                <span
                  className={`block h-0.5 bg-current rounded-full transition-all duration-300 ${
                    isMobileOpen ? 'opacity-0 scale-x-0' : ''
                  }`}
                />
                <span
                  className={`block h-0.5 bg-current rounded-full transition-all duration-300 ${
                    isMobileOpen ? '-rotate-45 -translate-y-2' : ''
                  }`}
                />
              </div>
            </button>
          </div>

        </div>
      </header>

      {/* ── Mobile Menu Drawer ───────────────────────────────────────────── */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
          isMobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        aria-hidden={!isMobileOpen}
      >
        <div
          className="absolute inset-0 bg-tcip-black/40 backdrop-blur-xs"
          onClick={() => setIsMobileOpen(false)}
          aria-label="Close menu"
        />

        <div
          className={`absolute top-0 right-0 bottom-0 w-72 sm:w-80 bg-white border-l border-border-soft shadow-2xl flex flex-col
                      transition-transform duration-300 ease-out
                      ${isMobileOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          {/* Panel header */}
          <div className="flex items-center justify-between px-5 h-16 border-b border-border-soft">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-tcip-black text-white font-extrabold text-xs flex items-center justify-center">
                <span className="text-white">T</span>
                <span className="text-brand-green">C</span>
                <span className="text-white">IP</span>
              </div>
              <span className="font-extrabold text-text-primary text-sm">
                Menu
              </span>
            </div>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="p-1.5 rounded-lg text-text-secondary hover:bg-brand-cream transition-colors"
              aria-label="Close menu"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive(item.href)
                    ? 'text-brand-green-dark bg-brand-mint font-bold'
                    : 'text-text-primary hover:text-brand-green hover:bg-brand-cream'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Panel CTA buttons */}
          <div className="p-5 border-t border-border-soft space-y-2.5">
            <button
              type="button"
              onClick={() => {
                setIsMobileOpen(false)
                openVolunteerModal()
              }}
              className="btn-secondary w-full justify-center text-xs font-semibold py-2.5 cursor-pointer"
            >
              Volunteer With Us
            </button>
            <Button href="/donate" variant="primary" size="md" className="w-full justify-center text-xs font-semibold py-2.5">
              Donate to TCIP
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
