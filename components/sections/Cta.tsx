'use client'

import React, { useRef } from 'react'
import { siteContent } from '@/lib/site-content'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button'
import styles from './Cta.module.css'
import { useCtaAnimations } from './cta/useCtaAnimations'

export default function Cta() {
  const sectionRef = useRef<HTMLElement>(null!)
  const titleRef = useRef<HTMLHeadingElement>(null!)
  const subtitleRef = useRef<HTMLParagraphElement>(null!)
  const hudBarRef = useRef<HTMLDivElement>(null!)
  const headlineRef = useRef<HTMLParagraphElement>(null!)
  const descRef = useRef<HTMLParagraphElement>(null!)
  const buttonsRef = useRef<HTMLDivElement>(null!)

  useCtaAnimations({
    sectionRef,
    titleRef,
    subtitleRef,
    hudBarRef,
    headlineRef,
    descRef,
    buttonsRef,
  })

  const { title, subtitle, hudLabelLeft, hudLabelRight, ctaLabel, ctaHref, secondaryLabel, secondaryHref } =
    siteContent.cta

  return (
    <section
      ref={sectionRef}
      id="cta"
      aria-labelledby="cta-heading"
      className={cn(
        'bg-anthracite px-6 py-20 sm:py-24 lg:px-20 lg:py-32',
        'section-dark-bg',
      )}
    >
      <div className="mx-auto max-w-content">
        {/* Header: title + HUD bar */}
        <div className={cn('mx-auto max-w-3xl', styles.sectionHeader)}>
          <h2
            ref={titleRef}
            id="cta-heading"
            className={cn(
              styles.gradientTextPrimary,
              'text-center font-bebas text-5xl uppercase leading-[0.9] tracking-wide sm:text-6xl',
              styles.sectionTitle,
            )}
          >
            {title}
          </h2>
          <div ref={hudBarRef} aria-hidden="true" className={styles.hudBar}>
            <span data-hud-line className={styles.hudLineLeft} />
            <span data-hud-label className={styles.hudLabelLeft}>
              {hudLabelLeft}
            </span>
            <span data-hud-line className={styles.hudLineLeft} />
            <span data-hud-line className={styles.hudLineRight} />
            <span data-hud-label className={styles.hudLabelRight}>
              {hudLabelRight}
            </span>
            <span data-hud-line className={styles.hudLineRight} />
          </div>

          <p
            ref={subtitleRef}
            className="mt-5 whitespace-pre-line font-mono text-[0.95rem] leading-[1.85] tracking-wide text-white/50"
          >
            {subtitle}
          </p>
        </div>

        {/* CTA content */}
        <div className={styles.ctaShell}>
          {/* Corner marks */}
          <span aria-hidden="true" className={cn(styles.cornerMark, styles.cornerTL)} />
          <span aria-hidden="true" className={cn(styles.cornerMark, styles.cornerTR)} />
          <span aria-hidden="true" className={cn(styles.cornerMark, styles.cornerBL)} />
          <span aria-hidden="true" className={cn(styles.cornerMark, styles.cornerBR)} />

          {/* Glow */}
          <div aria-hidden="true" className={styles.ctaGlow} />

          {/* Headline */}
          <p ref={headlineRef} className={cn(styles.ctaHeadline, styles.gradientTextPrimary)}>
            Twoja historia zasługuje na więcej niż zwykłe nagranie
          </p>

          {/* Description */}
          <p ref={descRef} className={styles.ctaSubtitle}>
            Opowiedz mi o swoim projekcie — razem stworzymy materiał,
            {'\n'}który zostanie z Tobą na lata.
          </p>

          {/* Buttons */}
          <div ref={buttonsRef} className={styles.ctaButtons}>
            <Button as="a" href={ctaHref} variant="primary" size="lg">
              {ctaLabel}
            </Button>
            <Button as="a" href={secondaryHref} variant="outline" size="lg">
              {secondaryLabel}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
