'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useState } from 'react'

interface NavSection {
  label: string
  items: {
    href: string
    label: string
    icon: string
  }[]
}

const navSections: NavSection[] = [
  {
    label: 'Overview',
    items: [
      { href: '/admin', label: 'Dashboard', icon: 'dashboard' },
    ],
  },
  {
    label: 'Content',
    items: [
      { href: '/admin/programs', label: 'Programs', icon: 'school' },
      { href: '/admin/events',   label: 'Events',   icon: 'event' },
      { href: '/admin/news',     label: 'Stories / News', icon: 'article' },
      { href: '/admin/gallery',  label: 'Gallery',  icon: 'photo_library' },
      { href: '/admin/partners', label: 'Partners', icon: 'handshake' },
    ],
  },
  {
    label: 'Community',
    items: [
      { href: '/admin/contacts',   label: 'Contacts',   icon: 'mail' },
      { href: '/admin/volunteers', label: 'Volunteers', icon: 'group' },
      { href: '/admin/newsletter', label: 'Newsletter', icon: 'mark_email_read' },
    ],
  },
  {
    label: 'Support',
    items: [
      { href: '/admin/donations',  label: 'Donations',  icon: 'volunteer_activism' },
    ],
  },
  {
    label: 'Configuration',
    items: [
      { href: '/admin/settings',   label: 'Site Settings', icon: 'settings' },
    ],
  },
]

interface AdminSidebarProps {
  userName?: string | null
  userEmail?: string | null
  userAvatar?: string | null
  mobileOpen?: boolean
  onCloseMobile?: () => void
}

export default function AdminSidebar({
  userName,
  userEmail,
  userAvatar,
  mobileOpen,
  onCloseMobile,
}: AdminSidebarProps) {
  const pathname = usePathname()
  const [signingOut, setSigningOut] = useState(false)

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  const handleSignOut = async () => {
    setSigningOut(true)
    await signOut({ callbackUrl: '/admin/login' })
  }

  const renderSidebarContent = (isMobile = false) => (
    <aside className="w-64 h-full min-h-screen bg-white flex flex-col border-r border-[#E5E7EB] shrink-0 text-[#1F2937]">
      {/* Brand Header */}
      <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
        <Link
          href="/admin"
          className="flex items-center gap-3 focus:outline-none group"
          onClick={isMobile ? onCloseMobile : undefined}
          aria-label="TCIP Admin Dashboard"
        >
          {/* TCIP Mark */}
          <div className="w-9 h-9 rounded-full bg-[#171717] text-white font-extrabold text-xs flex items-center justify-center tracking-tight shadow-xs relative overflow-hidden border border-[#171717] shrink-0 group-hover:scale-105 transition-transform">
            <span className="relative z-10 flex items-center">
              <span>T</span>
              <span className="text-[#16A34A] font-bold">C</span>
              <span>IP</span>
            </span>
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#D72638]" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-extrabold text-[#111827] text-sm leading-tight tracking-tight">
              TCIP Admin
            </span>
            <span className="text-[11px] text-[#6B7280] truncate leading-tight">
              Community Portal
            </span>
          </div>
        </Link>
        {isMobile && onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] rounded-lg transition-colors"
            aria-label="Close navigation"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        )}
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-5" aria-label="Admin Navigation">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="px-3 mb-1 text-[11px] font-bold text-[#9CA3AF] tracking-wider uppercase">
              {section.label}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(item.href)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={isMobile ? onCloseMobile : undefined}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-150 ${
                        active
                          ? 'bg-[#16A34A]/10 text-[#15803D] font-bold border-l-4 border-[#16A34A] shadow-xs'
                          : 'text-[#4B5563] hover:text-[#111827] hover:bg-[#F9FAFB] font-medium'
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-lg ${
                          active ? 'text-[#16A34A]' : 'text-[#6B7280]'
                        }`}
                      >
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User & Sign Out Footer */}
      <div className="p-3.5 border-t border-[#E5E7EB] bg-[#F9FAFB]">
        <div className="flex items-center gap-2.5 px-2 py-1.5 mb-2 rounded-xl bg-white border border-[#E5E7EB]">
          {userAvatar ? (
            <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-[#E5E7EB]">
              <Image src={userAvatar} alt={userName ?? 'Admin'} fill className="object-cover" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#16A34A]/10 text-[#15803D] font-bold text-xs flex items-center justify-center shrink-0 border border-[#16A34A]/20">
              {(userName ?? userEmail ?? 'A')[0].toUpperCase()}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-[#111827] truncate leading-tight">
              {userName ?? 'Administrator'}
            </p>
            <p className="text-[10px] text-[#6B7280] truncate leading-tight mt-0.5">
              {userEmail ?? 'admin@torontocip.com'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center py-1.5 px-2 rounded-lg text-xs font-medium text-[#4B5563] hover:text-[#111827] hover:bg-white border border-transparent hover:border-[#E5E7EB] transition-colors"
          >
            View Site ↗
          </Link>
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold text-[#DC2626] hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {signingOut ? 'Signing out…' : 'Log Out'}
          </button>
        </div>
      </div>
    </aside>
  )

  return (
    <>
      {/* Desktop Sidebar (persistent) */}
      <div className="hidden lg:block shrink-0">
        {renderSidebarContent(false)}
      </div>

      {/* Mobile Drawer (overlay) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-label="Close navigation overlay"
          />
          <div className="relative z-10 shadow-2xl h-full animate-in slide-in-from-left duration-200">
            {renderSidebarContent(true)}
          </div>
        </div>
      )}
    </>
  )
}
