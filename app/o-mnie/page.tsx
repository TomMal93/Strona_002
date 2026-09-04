import type { Metadata } from 'next'
import { siteContent } from '@/lib/site-content'
import AboutMeHero from '@/components/pages/about-me/AboutMeHero'
import AboutMeBio from '@/components/pages/about-me/AboutMeBio'
import WhyIDoThis from '@/components/pages/about-me/WhyIDoThis'
import AboutMeContact from '@/components/pages/about-me/AboutMeContact'
import StructuredData from '@/components/seo/StructuredData'
import { createPageStructuredData } from '@/lib/structured-data'

const socialTitle = `${siteContent.aboutMe.meta.title} | Maleszyk Media`

export const metadata: Metadata = {
  title: siteContent.aboutMe.meta.title,
  description: siteContent.aboutMe.meta.description,
  alternates: {
    canonical: '/o-mnie',
  },
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    url: '/o-mnie',
    siteName: 'Maleszyk Media — Fotografia i Film',
    title: socialTitle,
    description: siteContent.aboutMe.meta.description,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        type: 'image/jpeg',
        alt: 'Przemek Maleszyk — fotograf i filmowiec',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: socialTitle,
    description: siteContent.aboutMe.meta.description,
    images: ['/og-image.jpg'],
  },
}

export default function AboutMePage() {
  return (
    <main id="main-content" data-subpage data-responsive-sections>
      <StructuredData
        data={createPageStructuredData({
          path: '/o-mnie',
          name: socialTitle,
          description: siteContent.aboutMe.meta.description,
          breadcrumbName: 'O mnie',
          type: 'AboutPage',
        })}
      />
      <AboutMeHero
        heroOverride={{
          backgroundImage: '/images/contact/contact-hero.webp',
          backgroundAlt: 'Zdjęcie kontaktowe',
          imageQuality: 68,
          imageSizes: '(max-width: 767px) 100vw, (max-width: 1199px) 56vw, 48vw',
          imageUnoptimized: true,
          showRecIndicator: false,
          showTimecode: false,
          framedImage: true,
        }}
      />
      <WhyIDoThis />
      <AboutMeBio />
      <AboutMeContact />
    </main>
  )
}
