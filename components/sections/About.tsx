'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { siteContent } from '@/lib/site-content'
import { cn } from '@/lib/utils'
import styles from './About.module.css'
import { useAboutAnimations } from './about/useAboutAnimations'

/**
 * About — "Kim jestem" section.
 *
 * Desktop (≥1024px): overlap layout — photo on the left, text block
 *   slides over the photo from the right (negative margin creates overlap).
 * Mobile: stacked — photo full-width, text block below, counters in a 3-col row.
 *
 * Animations (GSAP + ScrollTrigger, lazy-loaded):
 *   1. Image reveal  — clip-path curtain (inset right 100% → 0%)
 *   2. Text block    — fade-in + translate from right, delayed
 *   3. Counters      — count from 0 to target value on scroll
 */
export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const imageWrapRef = useRef<HTMLDivElement>(null)
  const textBlockRef = useRef<HTMLDivElement>(null)
  const counterRefs = useRef<(HTMLSpanElement | null)[]>([])

  useAboutAnimations({ sectionRef, imageWrapRef, textBlockRef, counterRefs })

  const { about } = siteContent

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-labelledby="about-heading"
      className="section-dark-bg overflow-hidden px-6 py-20 sm:py-24 lg:px-16 lg:py-32"
    >
      <div className="mx-auto max-w-content">

        {/* ── Overlap layout: photo left, text right ──────────────────────── */}
        <div className={styles.layoutWrap}>

          {/* Photo — clip-path reveal animated by GSAP */}
          <div ref={imageWrapRef} className={styles.imageWrap}>
            <Image
              src="/images/hero.webp"
              alt="Fotograf — portret autora"
              fill
              className="object-cover object-top"
              sizes="(min-width: 1024px) 58vw, 100vw"
            />
          </div>

          {/* Text block — fades in and slides from right */}
          <div ref={textBlockRef} className={styles.textBlock}>

            {/* Short accent line above heading */}
            <span className={styles.headingLine} aria-hidden="true" />

            <h2
              id="about-heading"
              className="mt-4 font-bebas text-5xl uppercase leading-[0.9] tracking-wide text-white lg:text-6xl"
            >
              {about.heading}
            </h2>

            <p className="mt-6 whitespace-pre-line font-inter text-[16px] leading-[1.75] text-warm-gray lg:text-[18px]">
              {about.description}
            </p>

            <a
              href="#services"
              className={cn(
                styles.ctaButton,
                'mt-8 inline-block px-6 py-3 font-inter text-[15px] uppercase tracking-[0.12em]',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
              )}
            >
              {about.cta}
            </a>
          </div>
        </div>

        {/* ── Counters ────────────────────────────────────────────────────── */}
        <div className={styles.countersRow}>
          {about.counters.map((counter, i) => (
            <div key={counter.label} className={styles.counterBlock}>
              <p className="font-bebas text-5xl text-white lg:text-6xl">
                <span
                  ref={(el) => { counterRefs.current[i] = el }}
                  data-target={counter.value}
                  aria-label={`${counter.value}${counter.suffix}`}
                >
                  0
                </span>
                <span aria-hidden="true">{counter.suffix}</span>
              </p>
              <span className={styles.counterLine} aria-hidden="true" />
              <p className="font-inter text-sm text-warm-gray">{counter.label}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
