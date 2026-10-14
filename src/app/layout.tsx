import type { Metadata } from 'next'
import './globals.css'
import { getBaseUrl } from '@/lib/seo'
import { DEFAULT_SITE_SETTINGS } from '@/lib/settings'

// ─── Global Metadata ──────────────────────────────────────────────────────────
// SiteSettings is the single source of truth for SEO title and description.
// The OG image is omitted until an approved 1200×630 social share asset is provided.
// metadataBase is driven by NEXT_PUBLIC_SITE_URL — must be set in production.

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: DEFAULT_SITE_SETTINGS.seoTitle!,
    template: '%s | Toronto Community Improvement Program',
  },
  description: DEFAULT_SITE_SETTINGS.seoDescription!,
  applicationName: 'Toronto Community Improvement Program',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon.png', sizes: '64x64', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    siteName: 'Toronto Community Improvement Program',
    title: DEFAULT_SITE_SETTINGS.seoTitle!,
    description: DEFAULT_SITE_SETTINGS.seoDescription!,
    // DEFAULT OG IMAGE: WAITING FOR FINAL APPROVED SOCIAL SHARE ASSET
    // Add images array here once a 1200×630 asset is provided and placed in /public/images/
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_SITE_SETTINGS.seoTitle!,
    description: DEFAULT_SITE_SETTINGS.seoDescription!,
    // No Twitter/X handle — not yet configured
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

import { ThemeProvider } from '@/context/ThemeContext'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  localStorage.removeItem('boc_theme');
                } catch (e) {}
                document.documentElement.classList.remove('dark');
                document.documentElement.style.colorScheme = 'light';
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased bg-tcip-offwhite text-text-primary transition-colors duration-200">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

