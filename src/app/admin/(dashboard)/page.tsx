// ─── Admin Dashboard Page ──────────────────────────────────────────────────
// Server component: fetches real counts & submissions directly from Neon DB.

import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import StatCard from '@/components/admin/StatCard'
import StatusBadge from '@/components/admin/StatusBadge'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

async function getStats() {
  try {
    const [
      totalContacts,
      newContacts,
      totalVolunteers,
      newVolunteers,
      activeSubscribers,
      totalSubscribers,
      totalPrograms,
      publishedPrograms,
      totalEvents,
      publishedEvents,
      totalPosts,
      publishedPosts,
      totalPhotos,
      completedDonations,
      completedDonationAgg,
      recentContacts,
      recentVolunteers,
    ] = await Promise.all([
      prisma.contactSubmission.count(),
      prisma.contactSubmission.count({ where: { status: 'NEW' } }),
      prisma.volunteerApplication.count(),
      prisma.volunteerApplication.count({ where: { status: { in: ['NEW', 'REVIEWING'] } } }),
      prisma.newsletterSubscriber.count({ where: { status: 'ACTIVE' } }),
      prisma.newsletterSubscriber.count(),
      prisma.program.count(),
      prisma.program.count({ where: { status: 'PUBLISHED' } }),
      prisma.event.count(),
      prisma.event.count({ where: { published: true } }),
      prisma.newsPost.count(),
      prisma.newsPost.count({ where: { published: true } }),
      prisma.galleryItem.count(),
      prisma.donation.count({ where: { status: 'COMPLETED' } }),
      prisma.donation.aggregate({
        _sum: { amount: true },
        where: { status: 'COMPLETED' },
      }),
      prisma.contactSubmission.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.volunteerApplication.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
    ])

    return {
      totalContacts,
      newContacts,
      totalVolunteers,
      newVolunteers,
      activeSubscribers,
      totalSubscribers,
      totalPrograms,
      publishedPrograms,
      totalEvents,
      publishedEvents,
      totalPosts,
      publishedPosts,
      totalPhotos,
      completedDonations,
      totalRaised: Number(completedDonationAgg._sum.amount || 0),
      recentContacts,
      recentVolunteers,
    }
  } catch (err) {
    console.error('[Admin Dashboard] DB stats query failed:', (err as Error)?.message)
    return {
      totalContacts:      0,
      newContacts:        0,
      totalVolunteers:    0,
      newVolunteers:      0,
      activeSubscribers:  0,
      totalSubscribers:   0,
      totalPrograms:      0,
      publishedPrograms:  0,
      totalEvents:        0,
      publishedEvents:    0,
      totalPosts:         0,
      publishedPosts:     0,
      totalPhotos:        0,
      completedDonations: 0,
      totalRaised:        0,
      recentContacts:     [],
      recentVolunteers:   [],
    }
  }
}

export default async function AdminDashboardPage() {
  const {
    totalContacts,
    newContacts,
    totalVolunteers,
    newVolunteers,
    activeSubscribers,
    totalSubscribers,
    totalPrograms,
    publishedPrograms,
    totalEvents,
    publishedEvents,
    totalPosts,
    publishedPosts,
    totalPhotos,
    completedDonations,
    totalRaised,
    recentContacts,
    recentVolunteers,
  } = await getStats()

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E7EB] shadow-xs relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16A34A]/10 text-[#15803D] text-xs font-bold mb-3">
            <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
            <span>TCIP Management System</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
            Welcome to TCIP Administration
          </h2>
          <p className="text-[#4B5563] text-sm mt-1.5 max-w-2xl leading-relaxed">
            Manage public programs, community stories, media gallery, upcoming gatherings, volunteer applications, and organization settings.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link
            href="/admin/gallery"
            className="inline-flex items-center gap-2 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors"
          >
            <span className="material-symbols-outlined text-base">upload</span>
            <span>Upload Photos</span>
          </Link>
          <Link
            href="/admin/homepage"
            className="inline-flex items-center gap-2 bg-white hover:bg-[#F9FAFB] text-[#111827] font-semibold text-xs px-4 py-2.5 rounded-xl border border-[#E5E7EB] shadow-2xs transition-colors"
          >
            <span className="material-symbols-outlined text-base text-[#7C3AED]">home</span>
            <span>Home Page</span>
          </Link>
          <Link
            href="/admin/programs"
            className="inline-flex items-center gap-2 bg-white hover:bg-[#F9FAFB] text-[#111827] font-semibold text-xs px-4 py-2.5 rounded-xl border border-[#E5E7EB] shadow-2xs transition-colors"
          >
            <span className="material-symbols-outlined text-base text-[#16A34A]">add_circle</span>
            <span>Add Program</span>
          </Link>
          <Link
            href="/admin/events"
            className="inline-flex items-center gap-2 bg-white hover:bg-[#F9FAFB] text-[#111827] font-semibold text-xs px-4 py-2.5 rounded-xl border border-[#E5E7EB] shadow-2xs transition-colors"
          >
            <span className="material-symbols-outlined text-base text-[#0284C7]">event</span>
            <span>Add Event</span>
          </Link>
          <Link
            href="/admin/news"
            className="inline-flex items-center gap-2 bg-white hover:bg-[#F9FAFB] text-[#111827] font-semibold text-xs px-4 py-2.5 rounded-xl border border-[#E5E7EB] shadow-2xs transition-colors"
          >
            <span className="material-symbols-outlined text-base text-[#D97706]">post_add</span>
            <span>Add Story</span>
          </Link>
          <Link
            href="/admin/settings"
            className="inline-flex items-center gap-1.5 bg-white hover:bg-[#F9FAFB] text-[#4B5563] font-medium text-xs px-3 py-2.5 rounded-xl border border-[#E5E7EB] shadow-2xs transition-colors"
            title="Update Site Settings"
          >
            <span className="material-symbols-outlined text-base">settings</span>
          </Link>
        </div>
      </div>

      {/* Primary Real Metric Cards Grid */}
      <div>
        <h3 className="text-sm font-bold text-[#6B7280] uppercase tracking-wider mb-3">
          Overview &amp; Real Data Counts
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <StatCard
            label="Gallery Photos"
            value={totalPhotos}
            icon="photo_library"
            subLabel="total media assets"
            subValue=""
            color="green"
          />
          <StatCard
            label="Programs"
            value={totalPrograms}
            icon="school"
            subLabel="published"
            subValue={`${publishedPrograms} of ${totalPrograms}`}
            color="blue"
          />
          <StatCard
            label="Events"
            value={totalEvents}
            icon="event"
            subLabel="published"
            subValue={`${publishedEvents} of ${totalEvents}`}
            color="purple"
          />
          <StatCard
            label="Stories &amp; News"
            value={totalPosts}
            icon="article"
            subLabel="published"
            subValue={`${publishedPosts} of ${totalPosts}`}
            color="amber"
          />
          <StatCard
            label="Contacts"
            value={totalContacts}
            icon="mail"
            subLabel="new inquiry"
            subValue={newContacts > 0 ? `${newContacts} new` : '0 new'}
            color={newContacts > 0 ? 'red' : 'green'}
          />
          <StatCard
            label="Volunteer Inquiries"
            value={totalVolunteers}
            icon="group"
            subLabel="pending review"
            subValue={newVolunteers > 0 ? `${newVolunteers} pending` : '0 pending'}
            color="blue"
          />
          <StatCard
            label="Newsletter Members"
            value={totalSubscribers}
            icon="mark_email_read"
            subLabel="active"
            subValue={`${activeSubscribers} active`}
            color="green"
          />
          <StatCard
            label="Donations Recorded"
            value={completedDonations}
            icon="volunteer_activism"
            subLabel="total verified"
            subValue={`$${totalRaised.toLocaleString('en-CA', { minimumFractionDigits: 0 })}`}
            color="purple"
          />
        </div>
      </div>

      {/* Two-Column Recent Submissions Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Contact Inquiries */}
        <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
              <div>
                <h4 className="font-bold text-[#111827] text-base">Recent Contact Inquiries</h4>
                <p className="text-xs text-[#6B7280] mt-0.5">Latest community submissions</p>
              </div>
              <Link
                href="/admin/contacts"
                className="text-xs font-semibold text-[#15803D] hover:underline"
              >
                View all ({totalContacts}) →
              </Link>
            </div>

            {recentContacts.length === 0 ? (
              <div className="py-12 text-center text-[#9CA3AF] text-sm">
                No contact inquiries received yet.
              </div>
            ) : (
              <div className="divide-y divide-[#E5E7EB]">
                {recentContacts.map((c) => (
                  <div key={c.id} className="py-3.5 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-xs text-[#111827] truncate">{c.name}</p>
                        <StatusBadge status={c.status} />
                      </div>
                      <p className="text-xs text-[#4B5563] truncate mt-0.5">{c.subject}</p>
                      <p className="text-[11px] text-[#9CA3AF] mt-0.5">{formatDate(c.createdAt)}</p>
                    </div>
                    <Link
                      href="/admin/contacts"
                      className="px-2.5 py-1 rounded-lg text-xs font-medium text-[#4B5563] bg-[#F3F4F6] hover:bg-[#E5E7EB] shrink-0"
                    >
                      View
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Volunteer Applications */}
        <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
              <div>
                <h4 className="font-bold text-[#111827] text-base">Recent Volunteer Applications</h4>
                <p className="text-xs text-[#6B7280] mt-0.5">Latest volunteer sign-ups</p>
              </div>
              <Link
                href="/admin/volunteers"
                className="text-xs font-semibold text-[#15803D] hover:underline"
              >
                View all ({totalVolunteers}) →
              </Link>
            </div>

            {recentVolunteers.length === 0 ? (
              <div className="py-12 text-center text-[#9CA3AF] text-sm">
                No volunteer applications received yet.
              </div>
            ) : (
              <div className="divide-y divide-[#E5E7EB]">
                {recentVolunteers.map((v) => (
                  <div key={v.id} className="py-3.5 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-xs text-[#111827] truncate">
                          {v.firstName} {v.lastName}
                        </p>
                        <StatusBadge status={v.status} />
                      </div>
                      <p className="text-xs text-[#4B5563] truncate mt-0.5">
                        {v.interests.length > 0 ? v.interests.join(', ') : 'General Volunteer'}
                      </p>
                      <p className="text-[11px] text-[#9CA3AF] mt-0.5">{formatDate(v.createdAt)}</p>
                    </div>
                    <Link
                      href="/admin/volunteers"
                      className="px-2.5 py-1 rounded-lg text-xs font-medium text-[#4B5563] bg-[#F3F4F6] hover:bg-[#E5E7EB] shrink-0"
                    >
                      Review
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
