'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { siteContent } from '@/lib/site-content'
import { useHeroAnimations } from './hero/useHeroAnimations'

/**
 * Hero — fullscreen two-column grid section (45 % / 55 %).
 *
 * Left column:  eyebrow · heading · description · CTA row
 * Right column: hero image + two decorative red circles
 *
 * Responsive:   single-column on mobile, circles hidden on small screens.
 * Scroll:       overflow-hidden — compatible with Lenis smooth scroll.
 * Animations:   GSAP entrance sequence on initial load.
 */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const eyebrowRef = useRef<HTMLSpanElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)

  useHeroAnimations({
    sectionRef,
    eyebrowRef,
    headingRef,
    descriptionRef,
    ctaRef,
    mediaRef,
  })

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative h-screen w-full overflow-hidden bg-gradient-to-r from-[#0f0f12] to-[#1a1a1f]"
    >
      <div className="flex h-full flex-col md:grid md:grid-cols-[45%_55%]">
        {/* ── Left Column — Content ─────────────────────────────────────── */}
        <div className="flex flex-1 flex-col justify-center px-6 py-10 md:px-12 md:py-0 lg:px-20">
          <div className="max-w-[500px]">
            {/* Eyebrow */}
            <span
              ref={eyebrowRef}
              className="block font-bebas text-[18px] uppercase tracking-[0.15em] text-white/60"
            >
              {siteContent.hero.eyebrow}
            </span>

            {/* Heading */}
            <h1
              ref={headingRef}
              className="mt-4 font-bebas text-[48px] uppercase leading-[0.9] text-white md:text-[80px] lg:text-[110px]"
            >
              {siteContent.hero.headlineLine1}
              <br />
              {siteContent.hero.headlineLine2}
            </h1>

            {/* Description */}
            <p
              ref={descriptionRef}
              className="mt-6 max-w-[500px] font-inter text-[20px] leading-[1.6] text-white/[0.65]"
            >
              {siteContent.hero.subtitle}
            </p>

            {/* CTA Row */}
            <div
              ref={ctaRef}
              className="mt-8 flex items-center gap-4"
            >
              <a
                href="#contact"
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/40 transition-colors hover:border-white/70"
                aria-label={siteContent.hero.ctaLabel}
              >
                {/* Arrow icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                  aria-hidden="true"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </a>

              <span className="font-inter text-[18px] font-medium text-white">
                {siteContent.hero.ctaLabel}
              </span>
            </div>
          </div>
        </div>

        {/* ── Right Column — Image + Decorative Circles ── */}
        <div ref={mediaRef} className="relative h-[30vh] shrink-0 overflow-hidden md:h-full">
          {/* Mobile: simple image, no circle */}
          <div className="relative z-[2] h-full md:hidden">
            <Image
              src="/images/hero.png"
              alt=""
              fill
              className="object-contain object-center"
              priority
              quality={90}
              sizes="100vw"
            />
          </div>

          {/* Desktop: circle centered in column with image on top */}
          <div className="absolute inset-0 hidden items-center justify-center md:flex">
            {/* Reference box — same dimensions as large circle, responsive */}
            <div
              className="relative"
              style={{ width: 'min(600px, 65vh)', height: 'min(600px, 65vh)' }}
            >
              {/* Large decorative circle */}
              <div
                className="absolute inset-0 z-[1] rounded-full bg-[#ff3b3b]"
                aria-hidden="true"
              />

              {/* Hero image — 30% larger than circle (−15% on each side), centered */}
              <div className="absolute -inset-[15%] z-[2]">
                <Image
                  src="/images/hero.png"
                  alt=""
                  fill
                  className="object-contain object-center"
                  priority
                  quality={90}
                  sizes="55vw"
                />
              </div>

              {/* Small decorative circle — positioned relative to large circle */}
              <div
                className="absolute z-[0] h-[38%] w-[38%] rounded-full bg-[#ff3b3b]"
                style={{ bottom: '-20%', right: '-10%' }}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
