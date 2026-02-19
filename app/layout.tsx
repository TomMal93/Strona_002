import type { Metadata } from 'next'
import { Bebas_Neue, Inter } from 'next/font/google'
import './globals.css'
import SmoothScroll from '@/components/layout/SmoothScroll'

// --- Typography (design.md) ---
const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
})

const inter = Inter({
  weight: ['300', '400', '600'],
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
})

const siteUrl    = process.env.SITE_URL    ?? 'https://example.com'
const authorName = process.env.AUTHOR_NAME ?? 'Autor'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `Portfolio Fotograficzno-Wideo | ${authorName}`,
    template: `%s | ${authorName}`,
  },
  description:
    'Portfolio fotografa i operatora wideo — wydarzenia militarne, survival, drony, off-road, śluby i sesje rodzinne.',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    url: siteUrl,
    siteName: `${authorName} — Fotografia i Film`,
    title: `Portfolio Fotograficzno-Wideo | ${authorName}`,
    description:
      'Portfolio fotografa i operatora wideo — wydarzenia militarne, survival, drony, off-road, śluby i sesje rodzinne.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: `${authorName} — Fotografia i Film`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Portfolio Fotograficzno-Wideo | ${authorName}`,
    description:
      'Portfolio fotografa i operatora wideo — wydarzenia militarne, survival, drony, off-road, śluby i sesje rodzinne.',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body
        className={`
          ${bebasNeue.variable}
          ${inter.variable}
          font-inter bg-black-deep text-warm-white
        `}
      >
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  )
}
