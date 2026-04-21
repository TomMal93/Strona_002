'use client'

import { useRef } from 'react'
import { siteContent } from '@/lib/site-content'
import { cn } from '@/lib/utils'
import styles from './Cta.module.css'
import { useCtaAnimations } from './cta/useCtaAnimations'
import CtaActions from './cta/CtaActions'
import CtaShell from './cta/CtaShell'

export default function Cta() {
  const sectionRef = useRef<HTMLElement>(null!)
  const titleRef = useRef<HTMLHeadingElement>(null!)
  const subtitleRef = useRef<HTMLParagraphElement>(null!)
  const hudBarRef = useRef<HTMLDivElement>(null!)
  const primaryBtnRef = useRef<HTMLAnchorElement>(null!)
  const secondaryRowRef = useRef<HTMLDivElement>(null!)
  const socialRowRef = useRef<HTMLDivElement>(null!)
  const cornerTLRef = useRef<HTMLSpanElement>(null!)
  const cornerTRRef = useRef<HTMLSpanElement>(null!)
  const cornerBLRef = useRef<HTMLSpanElement>(null!)
  const cornerBRRef = useRef<HTMLSpanElement>(null!)
  const crosshairTopRef = useRef<HTMLSpanElement>(null!)
  const crosshairBottomRef = useRef<HTMLSpanElement>(null!)
  const glowRef = useRef<HTMLDivElement>(null!)

  useCtaAnimations({
    sectionRef,
    titleRef,
    subtitleRef,
    hudBarRef,
    primaryBtnRef,
    secondaryRowRef,
    socialRowRef,
    cornerTLRef,
    cornerTRRef,
    cornerBLRef,
    cornerBRRef,
    crosshairTopRef,
    crosshairBottomRef,
    glowRef,
  })

  const {
    title, subtitle, hudLabelLeft, hudLabelRight,
    ctaLabel, ctaHref, phoneLabel, phoneHref,
    secondaryLabel, secondaryHref, social,
  } = siteContent.cta

  const actionsData = {
    ctaLabel, ctaHref, phoneLabel, phoneHref,
    secondaryLabel, secondaryHref, social,
  }

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
        <CtaShell
          glowRef={glowRef}
          cornerTLRef={cornerTLRef}
          cornerTRRef={cornerTRRef}
          cornerBLRef={cornerBLRef}
          cornerBRRef={cornerBRRef}
          crosshairTopRef={crosshairTopRef}
          crosshairBottomRef={crosshairBottomRef}
        >
          <CtaActions
            data={actionsData}
            primaryBtnRef={primaryBtnRef}
            secondaryRowRef={secondaryRowRef}
            socialRowRef={socialRowRef}
          />
        </CtaShell>
      </div>
    </section>
  )
}
