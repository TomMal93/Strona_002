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
      className="h-svh md:h-dvh w-full section-dark-bg"
    >
      {/* Semantic heading — single h1 for SEO and screen readers */}
      <h1 className="sr-only">
        {siteContent.hero.headlineLine1} {siteContent.hero.headlineLine2}
      </h1>

      <MobileHeroLayout>
        <HeroTextBlock
          headingClassName="mt-4 font-bebas text-[68px] uppercase leading-[0.96] md:text-[70px] lg:text-[90px]"
          eyebrowClassName="block font-bebas text-[26px] uppercase tracking-heading"
          subtitleClassName="mt-6 whitespace-pre-line pb-5 font-bebas text-[24px] leading-[1.5] tracking-heading"
          subtitleWrapClassName="w-full"
          ctaClassName="px-4 py-2 text-center font-bebas text-[28px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-khaki focus-visible:outline-offset-2"
          socialIconClassName="[&>svg]:h-[34px] [&>svg]:w-[34px]"
          underlineClassName="block h-px w-full bg-gradient-to-r from-transparent via-khaki/70 to-transparent"
        />
      </MobileHeroLayout>

      <div className="relative z-10 mx-auto hidden h-full w-full max-w-[2000px] md:grid md:grid-cols-2 md:grid-rows-1 md:items-center md:justify-center md:gap-0 md:px-8 lg:px-12">
        {/* ── Content column ───────────────────────────────────────────────── */}
        <div className="md:flex md:flex-none md:flex-col md:items-center md:justify-center md:py-0">
          <div className="w-full max-w-[600px] text-left md:translate-y-10 lg:translate-y-14">
            <HeroTextBlock
              animated
              eyebrowRef={eyebrowRef}
              headingRef={headingRef}
              descriptionRef={descriptionRef}
              underlineRef={underlineRef}
              verticalLineRef={verticalLineRef}
              ctaRef={ctaRef}
              headingClassName="mt-4 font-bebas text-[46px] uppercase leading-[0.96] md:text-[70px] lg:text-[90px]"
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
                className={`relative z-10 object-contain object-center ${styles.desktopPortraitImage}`}
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
