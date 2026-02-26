import Hero from '@/components/sections/Hero'
import Services from '@/components/sections/Services'

/**
 * Strona główna — na tym etapie zawiera sekcje Hero + Services (Oferta).
 * Kolejne sekcje (About, Benefits, Portfolio, Instagram, Process, Testimonials, FAQ + strong CTA)
 * zostaną dodane w kolejnych iteracjach (tech-spec.md §5).
 */
export default function Home() {
  return (
    <main>
      <Hero />
      <Services />

      {/* Tymczasowy anchor docelowy dla CTA — FR-04 */}
      <div id="contact" />
    </main>
  )
}
