import type { Metadata } from 'next'
import { siteContent } from '@/lib/site-content'
import AboutMeHero from '@/components/pages/about-me/AboutMeHero'
import AboutMeBio from '@/components/pages/about-me/AboutMeBio'
import WhyIDoThis from '@/components/pages/about-me/WhyIDoThis'
import AboutMeContact from '@/components/pages/about-me/AboutMeContact'

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
        url: '/images/Hero.webp',
        width: 1024,
        height: 1024,
        type: 'image/webp',
        alt: 'Przemek Maleszyk — fotograf i filmowiec',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: socialTitle,
    description: siteContent.aboutMe.meta.description,
    images: ['/images/Hero.webp'],
  },
}

export default function AboutMePage() {
  return (
    <main data-responsive-sections>
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
