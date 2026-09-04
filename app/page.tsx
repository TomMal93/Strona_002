import type { Metadata } from 'next'
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Promo from '@/components/sections/Promo'
import Testimonials from '@/components/sections/Testimonials'
import Services from '@/components/sections/Services'
import Process from '@/components/sections/Process'
import Faq from '@/components/sections/Faq'
import Cta from '@/components/sections/Cta'
import StructuredData from '@/components/seo/StructuredData'
import { createSiteStructuredData } from '@/lib/structured-data'

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
}

/**
 * Strona główna — sekcje Hero + About + Promo + Testimonials + Services + Process + FAQ + CTA.
 * Kolejne sekcje (Benefits, Portfolio, Instagram)
 * zostaną dodane w kolejnych iteracjach (tech-spec.md §5).
 */
export default function Home() {
  return (
    <main id="main-content" data-responsive-sections>
      <StructuredData data={createSiteStructuredData()} />
      <Hero />
      <About />
      <Promo />
      <Services />
      <Process />
      <Testimonials />
      <Faq />
      <Cta />
    </main>
  )
}
