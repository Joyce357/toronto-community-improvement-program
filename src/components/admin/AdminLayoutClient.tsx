'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import AdminSidebar from './AdminSidebar'
import AdminTopbar from './AdminTopbar'

interface AdminLayoutClientProps {
  userName?: string | null
  userEmail?: string | null
  userAvatar?: string | null
  children: React.ReactNode
}

export default function AdminLayoutClient({ userName, userEmail, userAvatar, children }: AdminLayoutClientProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { data: session } = useSession()

  // Prefer live client session values so profile/avatar updates reflect immediately in topbar & sidebar
  const liveName = session?.user?.name !== undefined ? session.user.name : userName
  const liveEmail = session?.user?.email !== undefined ? session.user.email : userEmail
  const liveAvatar = session?.user?.image !== undefined ? session.user.image : userAvatar

  return (
    <div className="flex min-h-screen bg-[#F9FAFB] text-[#1F2937]">
      <AdminSidebar
        userName={liveName}
        userEmail={liveEmail}
        userAvatar={liveAvatar}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 bg-[#F9FAFB]">
        <AdminTopbar
          userName={liveName}
          userEmail={liveEmail}
          userAvatar={liveAvatar}
          onToggleMobileSidebar={() => setMobileOpen((prev) => !prev)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
