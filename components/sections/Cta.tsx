'use client'

import React, { useRef } from 'react'
import { siteContent } from '@/lib/site-content'
import { cn } from '@/lib/utils'
import styles from './Cta.module.css'
import { useCtaAnimations } from './cta/useCtaAnimations'

/* ── Inline SVG icons ─────────────────────────────────────────────────── */

const PhoneIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={styles.btnIcon}
    aria-hidden="true"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

const ArrowRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn(styles.btnIcon, styles.btnIconArrow)}
    aria-hidden="true"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

export default function Cta() {
  const sectionRef = useRef<HTMLElement>(null!)
  const titleRef = useRef<HTMLHeadingElement>(null!)
  const subtitleRef = useRef<HTMLParagraphElement>(null!)
  const hudBarRef = useRef<HTMLDivElement>(null!)
  const statsRef = useRef<HTMLDivElement>(null!)
  const descRef = useRef<HTMLParagraphElement>(null!)
  const buttonsRef = useRef<HTMLDivElement>(null!)
  const cornerTLRef = useRef<HTMLSpanElement>(null!)
  const cornerTRRef = useRef<HTMLSpanElement>(null!)
  const cornerBLRef = useRef<HTMLSpanElement>(null!)
  const cornerBRRef = useRef<HTMLSpanElement>(null!)
  const crosshairTopRef = useRef<HTMLSpanElement>(null!)
  const crosshairBottomRef = useRef<HTMLSpanElement>(null!)
  const glowRef = useRef<HTMLDivElement>(null!)
  const separatorRef = useRef<HTMLDivElement>(null!)

  useCtaAnimations({
    sectionRef,
    titleRef,
    subtitleRef,
    hudBarRef,
    statsRef,
    descRef,
    buttonsRef,
    cornerTLRef,
    cornerTRRef,
    cornerBLRef,
    cornerBRRef,
    crosshairTopRef,
    crosshairBottomRef,
    glowRef,
    separatorRef,
  })

  const {
    title, subtitle, hudLabelLeft, hudLabelRight, stats,
    ctaLabel, ctaHref, phoneLabel, phoneHref,
    secondaryLabel, secondaryHref,
  } = siteContent.cta

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

        {/* CTA content — layered composition */}
        <div className={styles.ctaShell}>
          {/* ── Background layer: dual glow + vignette ── */}
          <div ref={glowRef} aria-hidden="true" className={styles.ctaGlow}>
            <div className={styles.glowOrb} />
            <div className={styles.glowOrbWarm} />
          </div>
          <div aria-hidden="true" className={styles.ctaVignette} />

          {/* ── Mid-ground layer: frame + crosshairs ── */}
          <span ref={cornerTLRef} aria-hidden="true" className={cn(styles.cornerMark, styles.cornerTL)} />
          <span ref={cornerTRRef} aria-hidden="true" className={cn(styles.cornerMark, styles.cornerTR)} />
          <span ref={cornerBLRef} aria-hidden="true" className={cn(styles.cornerMark, styles.cornerBL)} />
          <span ref={cornerBRRef} aria-hidden="true" className={cn(styles.cornerMark, styles.cornerBR)} />

          {/* Crosshair marks — top and bottom center */}
          <span ref={crosshairTopRef} aria-hidden="true" className={cn(styles.crosshair, styles.crosshairTop)} />
          <span ref={crosshairBottomRef} aria-hidden="true" className={cn(styles.crosshair, styles.crosshairBottom)} />

          {/* Dashed focus circle */}
          <div aria-hidden="true" className={styles.focusCircle} />

          {/* ── Foreground layer: content ── */}
          <div className={styles.ctaContent}>
            {/* ── Stats strip ── */}
            <div ref={statsRef} className={styles.statsStrip}>
              {stats.map((stat, i) => (
                <React.Fragment key={stat.label}>
                  {i > 0 && (
                    <span aria-hidden="true" className={styles.statDivider} />
                  )}
                  <div className={styles.statItem}>
                    <span
                      className={styles.statValue}
                      data-stat-value
                      data-target={stat.value}
                    >
                      {stat.value}
                    </span>
                    <span className={styles.statLabel}>{stat.label}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>

            {/* Separator */}
            <div ref={separatorRef} aria-hidden="true" className={styles.ctaSeparator} />

            {/* Description */}
            <p ref={descRef} className={styles.ctaSubtitle}>
              Opowiedz mi o swoim projekcie — razem stworzymy materiał,
              {'\n'}który zostanie z Tobą na lata.
            </p>

            {/* ── Buttons ── */}
            <div ref={buttonsRef} className={styles.ctaButtons}>
              {/* Primary — animated border + shimmer */}
              <a href={ctaHref} className={styles.btnPrimary}>
                <span aria-hidden="true" className={styles.btnBorderGlow} />
                <span aria-hidden="true" className={styles.btnShimmer} />
                <span className={styles.btnPrimaryInner}>
                  {ctaLabel}
                  <ArrowRightIcon />
                </span>
              </a>

              {/* Secondary group */}
              <div className={styles.btnSecondaryRow}>
                {/* Phone — ghost pill with pulse ring */}
                <a href={phoneHref} className={styles.btnGhost}>
                  <span aria-hidden="true" className={styles.btnPulseRing} />
                  <PhoneIcon />
                  {phoneLabel}
                </a>

                {/* Tertiary text link */}
                <a href={secondaryHref} className={styles.btnTertiary}>
                  {secondaryLabel}
                  <ArrowRightIcon />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
