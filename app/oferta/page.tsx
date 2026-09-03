import type { Metadata } from 'next'
import { siteContent } from '@/lib/site-content'
import OfertaHero from '@/components/pages/oferta/OfertaHero'
import OfertaServices from '@/components/pages/oferta/OfertaServices'
import OfertaCta from '@/components/pages/oferta/OfertaCta'

const socialTitle = `${siteContent.offerPage.meta.title} | Maleszyk Media`

export const metadata: Metadata = {
  title: siteContent.offerPage.meta.title,
  description: siteContent.offerPage.meta.description,
  alternates: {
    canonical: '/oferta',
  },
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    url: '/oferta',
    siteName: 'Maleszyk Media — Fotografia i Film',
    title: socialTitle,
    description: siteContent.offerPage.meta.description,
    images: [
      {
        url: '/images/Hero.webp',
        width: 1024,
        height: 1024,
        type: 'image/webp',
        alt: 'Oferta filmowa Maleszyk Media',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: socialTitle,
    description: siteContent.offerPage.meta.description,
    images: ['/images/Hero.webp'],
  },
}

export default function OfertaPage() {
  return (
    <main data-responsive-sections>
      <OfertaHero />
      <OfertaServices />
      <OfertaCta />
    </main>
  )
}
