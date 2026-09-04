import type { Metadata } from 'next'
import { siteContent } from '@/lib/site-content'
import OfertaHero from '@/components/pages/oferta/OfertaHero'
import OfertaServices from '@/components/pages/oferta/OfertaServices'
import OfertaCta from '@/components/pages/oferta/OfertaCta'
import StructuredData from '@/components/seo/StructuredData'
import { createPageStructuredData } from '@/lib/structured-data'

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
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        type: 'image/jpeg',
        alt: 'Oferta filmowa Maleszyk Media',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: socialTitle,
    description: siteContent.offerPage.meta.description,
    images: ['/og-image.jpg'],
  },
}

export default function OfertaPage() {
  return (
    <main data-subpage data-responsive-sections>
      <StructuredData
        data={createPageStructuredData({
          path: '/oferta',
          name: socialTitle,
          description: siteContent.offerPage.meta.description,
          breadcrumbName: 'Oferta',
          type: 'CollectionPage',
        })}
      />
      <OfertaHero />
      <OfertaServices />
      <OfertaCta />
    </main>
  )
}
