import Hero from '@/components/sections/Hero'
import Services from '@/components/sections/Services'

/**
 * Strona główna — na tym etapie zawiera wyłącznie sekcję Hero.
 * Kolejne sekcje (Services, About, Portfolio, Instagram, Video, Contact)
 * zostaną dodane w kolejnych iteracjach (tech-spec.md §5).
 */
export default function Home() {
  return (
    <main>
      <Hero />
      <div id="nav-scroll-sentinel" aria-hidden="true" className="h-px w-full" />
      <Services />

      {/* Tymczasowy anchor docelowy dla CTA — FR-04 */}
      <div id="contact" />
    </main>
  )
}
