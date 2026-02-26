'use client'

import { useRef, type JSX, type Ref } from 'react'
import Image from 'next/image'
import { siteContent } from '@/lib/site-content'
import { useHeroAnimations } from './hero/useHeroAnimations'
import MobileHeroLayout from './hero/MobileHeroLayout'

const socialIcons: Record<string, JSX.Element> = {
  facebook: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  instagram: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  ),
  tiktok: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9a8.19 8.19 0 0 0 4.78 1.52V7.07a4.85 4.85 0 0 1-1.01-.38z" />
    </svg>
  ),
  youtube: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
    </svg>
  ),
}

type HeroTextBlockProps = {
  headingClassName: string
  underlineClassName: string
  eyebrowRef?: Ref<HTMLSpanElement>
  headingRef?: Ref<HTMLParagraphElement>
  descriptionRef?: Ref<HTMLParagraphElement>
  underlineRef?: Ref<HTMLSpanElement>
  ctaRef?: Ref<HTMLDivElement>
}

function HeroTextBlock({
  headingClassName,
  underlineClassName,
  eyebrowRef,
  headingRef,
  descriptionRef,
  underlineRef,
  ctaRef,
}: HeroTextBlockProps) {
  return (
    <>
      <span
        ref={eyebrowRef}
        className="block font-bebas text-[18px] uppercase tracking-heading text-white/60"
      >
        {siteContent.hero.eyebrow}
      </span>

      <p
        ref={headingRef}
        aria-hidden="true"
        className={headingClassName}
      >
        {siteContent.hero.headlineLine1}
        <br />
        {siteContent.hero.headlineLine2}
      </p>

      <div className="max-w-[34ch]">
        <p
          ref={descriptionRef}
          className="mt-6 whitespace-pre-line pb-3 font-inter font-light text-[16px] leading-[1.75] text-white/60"
        >
          {siteContent.hero.subtitle}
        </p>
        <span
          ref={underlineRef}
          aria-hidden="true"
          className={underlineClassName}
        />
      </div>

      <div ref={ctaRef} className="mt-8 flex flex-col gap-5">
        <div className="flex flex-wrap items-center gap-8">
          <a
            href="#contact"
            className="rounded-full border border-khaki/60 px-6 py-3 font-inter text-[18px] font-medium text-white transition-colors duration-300 hover:border-khaki hover:bg-khaki/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-khaki focus-visible:outline-offset-2"
          >
            {siteContent.hero.ctaLabel}
          </a>
          <a
            href="#about"
            className="rounded-full border border-military-green/40 px-6 py-3 font-inter text-[18px] font-medium text-white/55 transition-colors duration-300 hover:border-military-green/70 hover:bg-military-green/15 hover:text-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-khaki focus-visible:outline-offset-2"
          >
            {siteContent.hero.aboutLabel}
          </a>
        </div>
        <div className="flex items-center gap-5">
          {siteContent.hero.social.map(({ platform, href }) => (
            <a
              key={platform}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={platform}
              className="text-white/40 transition-colors duration-300 hover:text-white"
            >
              {socialIcons[platform]}
            </a>
          ))}
        </div>
      </div>
    </>
  )
}

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
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useHeroAnimations({
    sectionRef,
    eyebrowRef,
    headingRef,
    underlineRef,
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
          headingClassName="mt-4 font-bebas text-[48px] uppercase leading-[0.9] text-white"
          underlineClassName="block h-px w-full bg-gradient-to-r from-khaki/70 to-transparent"
        />
      </MobileHeroLayout>

      <div className="relative z-10 mx-auto hidden h-full w-full max-w-[1400px] md:grid md:grid-cols-[minmax(320px,500px)_minmax(360px,700px)] md:grid-rows-1 md:items-center md:justify-center md:gap-8 md:px-10 lg:gap-14 lg:px-16">
        {/* ── Content column ───────────────────────────────────────────────── */}
        <div className="md:flex md:flex-none md:flex-col md:items-end md:justify-center md:py-0">
          <div className="max-w-[500px] text-left">
            <HeroTextBlock
              eyebrowRef={eyebrowRef}
              headingRef={headingRef}
              descriptionRef={descriptionRef}
              underlineRef={underlineRef}
              ctaRef={ctaRef}
              headingClassName="mt-4 font-bebas text-[48px] uppercase leading-[0.9] text-white md:text-display"
              underlineClassName="block h-px w-full origin-left bg-gradient-to-r from-khaki/70 to-transparent"
            />
          </div>
        </div>

        {/* ── Desktop image column ─────────────────────────────────────────── */}
        <div className="relative hidden md:flex md:h-full md:items-center md:justify-center">
          <div className="relative h-[90%] w-full">
            <Image
              src="/images/hero.webp"
              alt="Fotograf i operator drona — portret z dronem i kontrolerem"
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
