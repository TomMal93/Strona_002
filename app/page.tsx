import Hero from '@/components/sections/Hero'

/**
 * Strona główna — na tym etapie zawiera wyłącznie sekcję Hero.
 * Kolejne sekcje (Services, About, Portfolio, Instagram, Video, Contact)
 * zostaną dodane w kolejnych iteracjach (tech-spec.md §5).
 */
export default function Home() {
  return (
    <main>
      <Hero />

      {/* Tymczasowy anchor docelowy dla CTA — FR-04 */}
      <div id="contact" />
    </main>
  )
}
