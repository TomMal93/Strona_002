import type { Metadata } from 'next'
import { siteContent } from '@/lib/site-content'
import AboutMeHero from '@/components/pages/about-me/AboutMeHero'
import AboutMeBio from '@/components/pages/about-me/AboutMeBio'
import WhyIDoThis from '@/components/pages/about-me/WhyIDoThis'
import AboutMeContact from '@/components/pages/about-me/AboutMeContact'

export const metadata: Metadata = {
  title: siteContent.aboutMe.meta.title,
  description: siteContent.aboutMe.meta.description,
}

export default function AboutMePage() {
  return (
    <main>
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
      <AboutMeBio />
      <WhyIDoThis />
      <AboutMeContact />
    </main>
  )
}
