import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Promo from '@/components/sections/Promo'
import Services from '@/components/sections/Services'
import Process from '@/components/sections/Process'

/**
 * Strona główna — sekcje Hero + About + Promo (pokaz pracy) + Services (Oferta) + Process.
 * Kolejne sekcje (Benefits, Portfolio, Instagram, Testimonials, FAQ + strong CTA)
 * zostaną dodane w kolejnych iteracjach (tech-spec.md §5).
 */
export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Promo />
      <Services />
      <Process />

      {/* Tymczasowy anchor docelowy dla CTA — FR-04 */}
      <div id="contact" />
    </main>
  )
}
