import type { Metadata } from 'next'
import { siteContent } from '@/lib/site-content'
import AboutMeHero from '@/components/pages/about-me/AboutMeHero'
import AboutMeBio from '@/components/pages/about-me/AboutMeBio'
import AboutMeVideo from '@/components/pages/about-me/AboutMeVideo'
import AboutMeContact from '@/components/pages/about-me/AboutMeContact'
import AboutMeGear from '@/components/pages/about-me/AboutMeGear'

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
      <AboutMeVideo
        videoOverride={{
          type: 'self-hosted',
          src: '/videos/contact/contact.mp4',
        }}
      />
      <AboutMeContact />
      <AboutMeGear />
    </main>
  )
}
