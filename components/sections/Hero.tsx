'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { siteContent } from '@/lib/site-content'
import { useHeroAnimations } from './hero/useHeroAnimations'
import MobileHeroLayout from './hero/MobileHeroLayout'
import HeroTextBlock from './hero/HeroTextBlock'
import styles from './Hero.module.css'

/**
 * Hero — fullscreen section.
 *
 * Mobile:    half-size centered image, text content overlaid at the bottom.
 * Desktop:   centered two-column grid: content left, image right.
 *
 * Scroll:    overflow-hidden — compatible with Lenis smooth scroll.
 * Animations: GSAP entrance sequence on initial load.
 */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const eyebrowRef = useRef<HTMLSpanElement>(null)
  const headingRef = useRef<HTMLParagraphElement>(null)
  const underlineRef = useRef<HTMLSpanElement>(null)
  const verticalLineRef = useRef<HTMLSpanElement>(null)
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useHeroAnimations({
    sectionRef,
    eyebrowRef,
    headingRef,
    underlineRef,
    verticalLineRef,
    descriptionRef,
    ctaRef,
  })

  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-label="Sekcja główna"
      className="h-[100svh] md:h-[100dvh] w-full section-dark-bg"
    >
      {/* Semantic heading — single h1 for SEO and screen readers */}
      <h1 className="sr-only">
        {siteContent.hero.headlineLine1} {siteContent.hero.headlineLine2}
      </h1>

      <MobileHeroLayout>
        <HeroTextBlock
          headingClassName="mt-4 font-bebas text-[48px] uppercase leading-[0.9]"
          underlineClassName="block h-px w-full bg-gradient-to-r from-khaki/70 to-transparent"
        />
      </MobileHeroLayout>

      <div className="relative z-10 mx-auto hidden h-full w-full max-w-[2000px] md:grid md:grid-cols-[minmax(280px,380px)_minmax(360px,1300px)] md:grid-rows-1 md:items-center md:justify-center md:gap-4 md:px-8 lg:gap-8 lg:px-12">
        {/* ── Content column ───────────────────────────────────────────────── */}
        <div className="md:flex md:flex-none md:flex-col md:items-end md:justify-center md:py-0">
          <div className="max-w-[500px] text-left">
            <HeroTextBlock
              animated
              eyebrowRef={eyebrowRef}
              headingRef={headingRef}
              descriptionRef={descriptionRef}
              underlineRef={underlineRef}
              verticalLineRef={verticalLineRef}
              ctaRef={ctaRef}
              headingClassName="mt-4 font-bebas text-[48px] uppercase leading-[0.9] md:text-display"
              underlineClassName="block h-px w-full origin-right bg-gradient-to-r from-khaki/70 to-transparent"
            />
          </div>
        </div>

        {/* ── Desktop image column ─────────────────────────────────────────── */}
        <div className="relative hidden md:flex md:h-full md:items-center md:justify-center md:overflow-visible">
          <div className={styles.desktopPortraitStage}>
            <div className={styles.portraitFrame}>
              <div aria-hidden="true" className={styles.portraitHalo} />
              <Image
                src="/images/Hero_v4.png"
                alt="Fotograf i operator drona — portret z dronem i kontrolerem"
                fill
                className="relative z-10 object-contain object-center"
                loading="eager"
                quality={85}
                sizes="(min-width: 1440px) 46vw, (min-width: 768px) 44vw, 1px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
