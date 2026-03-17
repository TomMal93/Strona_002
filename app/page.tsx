import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Promo from '@/components/sections/Promo'
import Testimonials from '@/components/sections/Testimonials'
import Services from '@/components/sections/Services'
import Process from '@/components/sections/Process'
import Faq from '@/components/sections/Faq'
import Cta from '@/components/sections/Cta'

/**
 * Strona główna — sekcje Hero + About + Promo + Testimonials + Services + Process + FAQ + CTA.
 * Kolejne sekcje (Benefits, Portfolio, Instagram)
 * zostaną dodane w kolejnych iteracjach (tech-spec.md §5).
 */
export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Promo />
      <Testimonials />
      <Services />
      <Process />
      <Faq />
      <Cta />
    </main>
  )
}
