'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { siteContent } from '@/lib/site-content'
import { useHeroAnimations } from './hero/useHeroAnimations'
import styles from './Hero.module.css'

/**
 * Hero — fullscreen section.
 *
 * Mobile:    full-bleed image as background, content overlay at ~2/3 height.
 * Desktop:   two-column grid (45 % / 55 %): content left, image right.
 *
 * Scroll:    overflow-hidden — compatible with Lenis smooth scroll.
 * Animations: GSAP entrance sequence on initial load.
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
      className={`h-screen w-full ${styles.sectionBackground}`}
    >
      {/* ── Mobile: full-bleed background image ─────────────────────────── */}
      <div className="absolute inset-0 md:hidden">
        <Image
          src="/images/hero.png"
          alt=""
          fill
          className="object-cover object-center"
          priority
          quality={90}
          sizes="100vw"
        />
        {/* Gradient od dołu — czytelność tekstu */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </div>

      <div className="relative z-10 flex h-full flex-col md:grid md:grid-cols-[45%_55%]">
        {/* ── Content column ───────────────────────────────────────────────── */}
        <div className="flex flex-1 flex-col justify-end px-6 pb-[22vh] md:justify-center md:px-12 md:py-0 lg:px-20">
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

        {/* ── Desktop image column ─────────────────────────────────────────── */}
        <div ref={mediaRef} className="hidden md:relative md:block md:h-full">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative h-full w-full">
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
          </div>
        </div>
      </div>
    </section>
  )
}
