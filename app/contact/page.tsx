import type { Metadata } from 'next'
import ContactHero from '@/components/pages/contact/ContactHero'
import { siteContent } from '@/lib/site-content'
import StructuredData from '@/components/seo/StructuredData'
import { createPageStructuredData } from '@/lib/structured-data'

const socialTitle = `${siteContent.contactPage.meta.title} | Maleszyk Media`

export const metadata: Metadata = {
  title: siteContent.contactPage.meta.title,
  description: siteContent.contactPage.meta.description,
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    url: '/contact',
    siteName: 'Maleszyk Media — Fotografia i Film',
    title: socialTitle,
    description: siteContent.contactPage.meta.description,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        type: 'image/jpeg',
        alt: 'Kontakt z Maleszyk Media',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: socialTitle,
    description: siteContent.contactPage.meta.description,
    images: ['/og-image.jpg'],
  },
}

export default function ContactPage() {
  return (
    <main data-contact-page data-subpage data-responsive-sections>
      <StructuredData
        data={createPageStructuredData({
          path: '/contact',
          name: socialTitle,
          description: siteContent.contactPage.meta.description,
          breadcrumbName: 'Kontakt',
          type: 'ContactPage',
        })}
      />
      <ContactHero />
    </main>
  )
}
