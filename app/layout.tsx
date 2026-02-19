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
  title: 'Portfolio Fotograficzno-Wideo',
  description:
    'Portfolio fotografa i operatora wideo — wydarzenia militarne, survival, drony, off-road, śluby i sesje rodzinne.',
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
