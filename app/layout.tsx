import type { Metadata } from 'next'
import { Bebas_Neue, Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import SmoothScroll from '@/components/layout/SmoothScroll'
import { siteContent } from '@/lib/site-content'
import { cn } from '@/lib/utils'

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
  description: siteContent.seoDescription,
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    url: siteUrl,
    siteName: `${authorName} — Fotografia i Film`,
    title: `Portfolio Fotograficzno-Wideo | ${authorName}`,
    description: siteContent.seoDescription,
    images: [
      {
        url: '/images/hero.webp',
        alt: `${authorName} — Fotografia i Film`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Portfolio Fotograficzno-Wideo | ${authorName}`,
    description: siteContent.seoDescription,
    images: ['/images/hero.webp'],
  },
  icons: {
    icon: '/images/logo_m.webp',
    apple: '/images/logo_m.webp',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: authorName,
  url: siteUrl,
  description: siteContent.structuredDataDescription,
  serviceType: ['Fotografia', 'Film', 'Drony'],
  areaServed: { '@type': 'Country', name: 'Poland' },
}
const jsonLdString = JSON.stringify(jsonLd).replace(/<\//g, '<\\/')
const bodyClassName = cn(
  bebasNeue.variable,
  inter.variable,
  'font-inter bg-black-deep text-warm-white',
)

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString }}
        />
      </head>
      <body className={bodyClassName}>
        <Navbar />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  )
}
