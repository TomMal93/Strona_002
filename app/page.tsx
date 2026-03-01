import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Services from '@/components/sections/Services'

/**
 * Strona główna — na tym etapie zawiera sekcje Hero + About + Services (Oferta).
 * Kolejne sekcje (Benefits, Portfolio, Instagram, Process, Testimonials, FAQ + strong CTA)
 * zostaną dodane w kolejnych iteracjach (tech-spec.md §5).
 */
export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Services />

      {/* Tymczasowy anchor docelowy dla CTA — FR-04 */}
      <div id="contact" />
    </main>
  )
}
