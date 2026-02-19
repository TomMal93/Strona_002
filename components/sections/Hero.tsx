'use client'

import { useRef } from 'react'
import { heroClassNames } from './hero/classNames'
import HeroBackground from './hero/HeroBackground'
import HeroContent from './hero/HeroContent'
import { useHeroAnimations } from './hero/useHeroAnimations'

/**
 * Hero — sekcja pełnoekranowa (FR-01 … FR-04, tech-spec.md).
 *
 * FR-01  tło wideo: autoplay / mute / loop + fallback statycznego obrazu
 *        + fade-in po załadowaniu (design.md §4)
 *        + parallax scroll (design.md §4: "Tło przesuwa się wolniej niż scroll")
 * FR-02  overlay z teksturą ziarna — animowany CSS (Hero.module.css)
 * FR-03  animowane hasło/podtytuł — GSAP stagger per litera (design.md §4)
 * FR-04  przycisk CTA → sekcja #contact, border-radius 2px (design.md §5)
 */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const heroVideoSrc = '/video/hero.mp4'
  const hasHeroVideo = false

  useHeroAnimations({
    sectionRef,
    mediaRef,
    headlineRef,
    subtitleRef,
    ctaRef,
    scrollRef,
  })

  return (
    <section
      ref={sectionRef}
      id="hero"
      className={heroClassNames.section}
    >
      <HeroBackground
        mediaRef={mediaRef}
        hasHeroVideo={hasHeroVideo}
        heroVideoSrc={heroVideoSrc}
      />

      <HeroContent
        headlineRef={headlineRef}
        subtitleRef={subtitleRef}
        ctaRef={ctaRef}
      />

      {/* ── Scroll indicator ──────────────────────────────────────────── */}
      <div
        ref={scrollRef}
        aria-hidden="true"
        className={heroClassNames.scrollIndicator}
      >
        <span className="font-inter text-xs uppercase tracking-widest text-warm-gray">
          Przewiń
        </span>
        {/* Animated line */}
        <div className="w-px h-12 bg-gradient-to-b from-warm-gray to-transparent animate-pulse" />
      </div>
    </section>
  )
}
