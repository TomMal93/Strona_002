import type { Metadata, Viewport } from 'next'
import { headers } from 'next/headers'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Bebas_Neue, IBM_Plex_Mono, Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import SectionRail from '@/components/layout/SectionRail'
import Footer from '@/components/layout/Footer'
import SmoothScroll from '@/components/layout/SmoothScroll'
import Preloader from '@/components/ui/Preloader'
import { siteContent } from '@/lib/site-content'
import { cn } from '@/lib/utils'

// --- Typography (design.md) ---
const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin', 'latin-ext'],
  variable: '--font-bebas',
  display: 'swap',
})

const inter = Inter({
  weight: ['300', '400', '600'],
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
  preload: false,
})

const ibmPlexMono = IBM_Plex_Mono({
  weight: ['400', '500'],
  subsets: ['latin', 'latin-ext'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
  preload: false,
})

const siteUrl    = process.env.SITE_URL    ?? 'https://maleszyk.media'
const authorName = process.env.AUTHOR_NAME ?? 'Maleszyk Media'
const socialImagePath = '/og-image.jpg'

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
        url: socialImagePath,
        width: 1200,
        height: 630,
        type: 'image/jpeg',
        alt: `${authorName} — Fotografia i Film`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Portfolio Fotograficzno-Wideo | ${authorName}`,
    description: siteContent.seoDescription,
    images: [socialImagePath],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
}

const bodyClassName = cn(
  bebasNeue.variable,
  inter.variable,
  ibmPlexMono.variable,
  'font-inter bg-black-deep text-warm-white',
)

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const nonce = (await headers()).get('x-nonce') ?? undefined

  return (
    <html lang="pl" suppressHydrationWarning>
      <head>
        {/* Synchronous boot: marks <html> for the preloader so returning visitors
            (sessionStorage) don't flash the overlay on hydration. Must run before
            paint, hence inline in <head>. */}
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html:
              "try{if(sessionStorage.getItem('intro:played:v1')==='1')document.documentElement.classList.add('intro-played')}catch(e){}",
          }}
        />
      </head>
      <body className={bodyClassName}>
        <a className="skipLink" href="#main-content">
          Przejdź do treści
        </a>
        <Preloader />
        <Navbar />
        <SectionRail />
        <SmoothScroll>{children}</SmoothScroll>
        <Footer />
        <SpeedInsights />
      </body>
    </html>
  )
}
