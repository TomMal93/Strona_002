'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { siteContent } from '@/lib/site-content'
import { useHeroAnimations } from './hero/useHeroAnimations'
import styles from './Hero.module.css'

const HERO_IMAGE = '/images/hero.png'

/**
 * Hero — fullscreen section.
 *
 * Mobile:    half-size centered image, text content overlaid at the bottom.
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
  const ctaRef = useRef<HTMLAnchorElement>(null)

  useHeroAnimations({
    sectionRef,
    eyebrowRef,
    headingRef,
    descriptionRef,
    ctaRef,
  })

  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-labelledby="hero-heading"
      className={`h-screen w-full ${styles.sectionBackground}`}
    >
      {/* ── Mobile: half-size centered image ────────────────────────────── */}
      <div className="absolute inset-0 md:hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative h-1/2 w-1/2">
            <Image
              src={HERO_IMAGE}
              alt=""
              fill
              className="object-contain object-center"
              priority
              quality={75}
              sizes="50vw"
            />
          </div>
        </div>
      </div>

      <div className="relative z-10 flex h-full flex-col md:grid md:grid-cols-[45%_55%]">
        {/* ── Content column ───────────────────────────────────────────────── */}
        <div className="flex flex-1 flex-col justify-end px-6 pb-[22vh] md:justify-center md:px-12 md:py-0 lg:px-20">
          <div className="max-w-[500px]">
            {/* Eyebrow */}
            <span
              ref={eyebrowRef}
              className="block font-bebas text-[18px] uppercase tracking-heading text-white/60"
            >
              {siteContent.hero.eyebrow}
            </span>

            {/* Heading */}
            <h1
              id="hero-heading"
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
              className="mt-6 whitespace-pre-line border-b border-white/25 pb-3 font-inter font-light text-[16px] leading-[1.75] text-white/70"
            >
              {siteContent.hero.subtitle}
            </p>

            {/* CTA */}
            <a
              ref={ctaRef}
              href="#contact"
              className="group mt-8 inline-flex items-center gap-3 rounded-full border border-white/50 px-7 py-3.5 font-inter text-[18px] font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              {siteContent.hero.ctaLabel}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>

        {/* ── Desktop image column ─────────────────────────────────────────── */}
        <div className="relative hidden h-full md:block">
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <div className="relative h-[150%] w-[150%]">
              <Image
                src={HERO_IMAGE}
                alt=""
                fill
                className="object-contain object-center"
                priority
                quality={75}
                sizes="(min-width: 768px) 55vw, 1px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
