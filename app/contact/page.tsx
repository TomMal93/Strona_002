import type { Metadata } from 'next'
import { siteContent } from '@/lib/site-content'
import AboutMeHero from '@/components/pages/about-me/AboutMeHero'
import AboutMeBio from '@/components/pages/about-me/AboutMeBio'
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
          backgroundImage: '/images/contact/contact.jpeg',
          backgroundAlt: 'Zdjęcie kontaktowe',
          showRecIndicator: false,
          showTimecode: false,
        }}
      />
      <AboutMeBio />
      <AboutMeContact />
    </main>
  )
}
