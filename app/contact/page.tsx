import type { Metadata } from 'next'
import ContactHero from '@/components/pages/contact/ContactHero'
import { siteContent } from '@/lib/site-content'

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
        url: '/images/Hero.webp',
        width: 1024,
        height: 1024,
        type: 'image/webp',
        alt: 'Kontakt z Maleszyk Media',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: socialTitle,
    description: siteContent.contactPage.meta.description,
    images: ['/images/Hero.webp'],
  },
}

export default function ContactPage() {
  return (
    <main data-responsive-sections>
      <ContactHero />
    </main>
  )
}
