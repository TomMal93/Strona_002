import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Promo from '@/components/sections/Promo'
import Testimonials from '@/components/sections/Testimonials'
import Services from '@/components/sections/Services'
import Process from '@/components/sections/Process'
import Faq from '@/components/sections/Faq'

/**
 * Strona główna — sekcje Hero + About + Promo + Testimonials + Services + Process.
 * Kolejne sekcje (Benefits, Portfolio, Instagram, FAQ + strong CTA)
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

      {/* Tymczasowy anchor docelowy dla CTA — FR-04 */}
      <div id="contact" />
    </main>
  )
}
