'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { signOut } from 'next-auth/react'
import { useState } from 'react'

interface AdminTopbarProps {
  userName?: string | null
  userEmail?: string | null
  userAvatar?: string | null
  onToggleMobileSidebar?: () => void
}

const pageTitles: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/programs': 'Programs Management',
  '/admin/events': 'Events Management',
  '/admin/news': 'Community Stories & News',
  '/admin/gallery': 'Gallery & Media Management',
  '/admin/partners': 'Partners Management',
  '/admin/volunteers': 'Volunteer Applications',
  '/admin/donations': 'Donations Overview',
  '/admin/contacts': 'Contact Inquiries',
  '/admin/newsletter': 'Newsletter Subscribers',
  '/admin/settings': 'Site Settings',
}

export default function AdminTopbar({ userName, userEmail, userAvatar, onToggleMobileSidebar }: AdminTopbarProps) {
  const pathname = usePathname()
  const [signingOut, setSigningOut] = useState(false)

  // Derive title from pathname with boundary / longest prefix match
  let pageTitle = 'Admin'
  const sortedRoutes = Object.entries(pageTitles).sort((a, b) => b[0].length - a[0].length)
  for (const [route, label] of sortedRoutes) {
    if (route === '/admin') {
      if (pathname === '/admin') {
        pageTitle = label
        break
      }
    } else if (pathname === route || pathname.startsWith(`${route}/`)) {
      pageTitle = label
      break
    }
  }

  const handleSignOut = async () => {
    setSigningOut(true)
    await signOut({ callbackUrl: '/admin/login' })
  }

  const initial = (userName ?? userEmail ?? 'A')[0].toUpperCase()

  return (
    <header className="h-16 bg-white border-b border-[#E5E7EB] px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 shrink-0 shadow-2xs">
      {/* Left: Mobile Trigger + Page Title / Breadcrumb */}
      <div className="flex items-center gap-2 sm:gap-3">
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F6] rounded-xl transition-colors"
            aria-label="Toggle navigation menu"
          >
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>
        )}

        <div className="flex items-center gap-2 text-[#111827] font-bold text-base sm:text-lg">
          <span className="text-[#9CA3AF] text-xs sm:text-sm font-medium hidden md:inline">TCIP Admin /</span>
          <h1 className="tracking-tight text-[#111827] font-extrabold text-base sm:text-lg">{pageTitle}</h1>
        </div>
      </div>

      {/* Right: Actions & User Info */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* View Website Action */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#15803D] bg-[#16A34A]/10 hover:bg-[#16A34A]/20 transition-colors border border-[#16A34A]/20"
        >
          <span className="hidden sm:inline">View Public Website</span>
          <span className="sm:hidden">Site</span>
          <span className="material-symbols-outlined text-sm">open_in_new</span>
        </Link>

        {/* User Identity */}
        <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
          {userAvatar ? (
            <div className="relative w-7 h-7 rounded-full overflow-hidden shrink-0 border border-[#E5E7EB]">
              <Image src={userAvatar} alt={userName ?? 'Admin'} fill className="object-cover" />
            </div>
          ) : (
            <div className="w-7 h-7 rounded-full bg-[#16A34A]/10 text-[#15803D] font-bold text-xs flex items-center justify-center shrink-0 border border-[#16A34A]/20">
              {initial}
            </div>
          )}
          <div className="text-left max-w-[150px] truncate">
            <p className="text-xs font-bold text-[#111827] leading-tight truncate">
              {userName ?? userEmail ?? 'Admin'}
            </p>
            {userName && userEmail && (
              <p className="text-[10px] text-[#6B7280] truncate leading-tight mt-0.5">
                {userEmail}
              </p>
            )}
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#DC2626] hover:bg-red-50 border border-red-200 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {signingOut ? 'Signing out…' : 'Log Out'}
        </button>
      </div>
    </header>
  )
}
