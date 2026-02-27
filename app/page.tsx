import Hero from '@/components/sections/Hero'
import Services from '@/components/sections/Services'
import About from '@/components/sections/About'

/**
 * Strona główna — zawiera sekcje Hero + Services (Oferta) + About (Kim jestem).
 * Kolejne sekcje (Benefits, Portfolio, Instagram, Process, Testimonials, FAQ + strong CTA)
 * zostaną dodane w kolejnych iteracjach (tech-spec.md §5).
 */
export default function Home() {
  return (
    <main>
      <Hero />
      <Services />
      <About />

      {/* Tymczasowy anchor docelowy dla CTA — FR-04 */}
      <div id="contact" />
    </main>
  )
}
