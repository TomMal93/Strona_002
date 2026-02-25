'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { siteContent } from '@/lib/site-content'
import { useHeroAnimations } from './hero/useHeroAnimations'
import Button from '@/components/ui/Button'
import styles from './Hero.module.css'
import heroImage from '@/public/images/hero.webp'

const ArrowIcon = () => (
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
)

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
      aria-label="Sekcja główna"
      className={`h-[100svh] md:h-[100dvh] w-full ${styles.sectionBackground}`}
    >
      {/* Semantic heading — single h1 for SEO and screen readers */}
      <h1 className="sr-only">
        {siteContent.hero.headlineLine1} {siteContent.hero.headlineLine2}
      </h1>

      {/* ── Mobile: fixed composition (no absolute positioning) ─────────── */}
      <div className="relative z-10 mx-auto h-full w-[766px] origin-top-left scale-[calc(100vw/766px)] px-[10px] pt-[55px] md:hidden">
        <div className="ml-auto mr-[40px] w-[72%]">
          <div className="relative aspect-[3/4] w-full">
            <Image
              src={heroImage}
              alt=""
              fill
              className="object-contain object-center"
              priority
              quality={75}
              sizes="(max-width: 767px) 72vw, 1px"
            />
          </div>
        </div>

        <div className="ml-[70px] -mt-[380px] w-fit">
          <div className={`max-w-[500px] rounded-xl p-4 text-left ${styles.mobileTextHalo} ${styles.mobileTextPanel}`}>
            <span className="block font-bebas text-[18px] uppercase tracking-heading text-white/60">
              {siteContent.hero.eyebrow}
            </span>

            <p aria-hidden="true" className="mt-4 font-bebas text-[48px] uppercase leading-[0.9] text-white">
              {siteContent.hero.headlineLine1}
              <br />
              {siteContent.hero.headlineLine2}
            </p>

            <div className="max-w-[34ch]">
              <p className="mt-6 whitespace-pre-line pb-3 font-inter font-light text-[16px] leading-[1.75] text-white/60">
                {siteContent.hero.subtitle}
              </p>
                <span aria-hidden="true" className="block h-px w-full bg-khaki/70" />
            </div>

            <Button
              as="a"
              href="#contact"
              variant="hero"
              className="group mt-8"
            >
              {siteContent.hero.ctaLabel}
              <ArrowIcon />
            </Button>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto hidden h-full w-full max-w-[1400px] md:grid md:grid-cols-[minmax(320px,500px)_minmax(360px,700px)] md:items-center md:justify-center md:gap-8 md:px-10 lg:gap-14 lg:px-16">
        {/* ── Content column ───────────────────────────────────────────────── */}
        <div className="md:flex md:flex-none md:flex-col md:items-end md:justify-center md:py-0">
          <div className="max-w-[500px] text-left">
            {/* Eyebrow */}
            <span
              ref={eyebrowRef}
              className="block font-bebas text-[18px] uppercase tracking-heading text-white/60"
            >
              {siteContent.hero.eyebrow}
            </span>

            {/* Heading — visual only, semantic h1 is sr-only above */}
            <p
              ref={headingRef}
              aria-hidden="true"
              className="mt-4 font-bebas text-[48px] uppercase leading-[0.9] text-white md:text-display lg:text-display-lg"
            >
              {siteContent.hero.headlineLine1}
              <br />
              {siteContent.hero.headlineLine2}
            </p>

            {/* Description */}
            <div className="max-w-[34ch]">
              <p
                ref={descriptionRef}
                className="mt-6 whitespace-pre-line pb-3 font-inter font-light text-[16px] leading-[1.75] text-white/60"
              >
                {siteContent.hero.subtitle}
              </p>
              <span aria-hidden="true" className="block h-px w-full bg-khaki/70" />
            </div>

            {/* CTA */}
            <Button
              as="a"
              ref={ctaRef}
              href="#contact"
              variant="hero"
              className="group mt-8"
            >
              {siteContent.hero.ctaLabel}
              <ArrowIcon />
            </Button>
          </div>
        </div>

        {/* ── Desktop image column ─────────────────────────────────────────── */}
        <div className="relative hidden md:flex md:h-full md:items-center md:justify-center">
          <div className="relative h-[90%] w-full">
            <Image
              src={heroImage}
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
    </section>
  )
}
