import type { Metadata } from 'next'
import { Bebas_Neue, Oswald, Inter } from 'next/font/google'
import './globals.css'
import SmoothScroll from '@/components/layout/SmoothScroll'

// --- Typography (design.md) ---
const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
})

const oswald = Oswald({
  weight: ['500', '700'],
  subsets: ['latin', 'latin-ext'],
  variable: '--font-oswald',
  display: 'swap',
})

const inter = Inter({
  weight: ['300', '400', '600'],
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://tomaszmalczyk.pl'),
  title: {
    default: 'Portfolio Fotograficzno-Wideo | Tomasz Malczyk',
    template: '%s | Tomasz Malczyk',
  },
  description:
    'Portfolio fotografa i operatora wideo — wydarzenia militarne, survival, drony, off-road, śluby i sesje rodzinne.',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    url: 'https://tomaszmalczyk.pl',
    siteName: 'Tomasz Malczyk — Fotografia i Film',
    title: 'Portfolio Fotograficzno-Wideo | Tomasz Malczyk',
    description:
      'Portfolio fotografa i operatora wideo — wydarzenia militarne, survival, drony, off-road, śluby i sesje rodzinne.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Tomasz Malczyk — Fotografia i Film',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio Fotograficzno-Wideo | Tomasz Malczyk',
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
          ${oswald.variable}
          ${inter.variable}
          font-inter bg-black-deep text-warm-white
        `}
      >
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  )
}
