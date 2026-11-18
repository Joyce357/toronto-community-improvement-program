import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { VolunteerModalProvider } from '@/context/VolunteerModalContext'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <VolunteerModalProvider>
      {/* Skip to main content — accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999]
                   focus:px-4 focus:py-2 focus:bg-white focus:text-on-surface focus:rounded-lg
                   focus:font-semibold focus:shadow-lg focus:border focus:border-primary"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className="flex-1 pt-20" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </VolunteerModalProvider>
  )
}
