'use client'

import { useRef, useEffect, useState } from 'react'
import { siteContent } from '@/lib/site-content'
import { cn } from '@/lib/utils'
import styles from './About.module.css'
import heroStyles from './Hero.module.css'
import { useAboutAnimations } from './about/useAboutAnimations'

const CameraIcon = () => (
  <svg viewBox="0 0 32 32" aria-hidden="true">
    <path d="M4.5 10.5h5l2.2-3h8.6l2.2 3h5a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-23a2 2 0 0 1-2-2v-12a2 2 0 0 1 2-2Z" />
    <circle cx="16" cy="18" r="5.5" />
  </svg>
)

const PinIcon = () => (
  <svg viewBox="0 0 32 32" aria-hidden="true">
    <path d="M25 13.5c0 7-9 14-9 14s-9-7-9-14a9 9 0 1 1 18 0Z" />
    <circle cx="16" cy="13.5" r="3" />
  </svg>
)

const ClapperIcon = () => (
  <svg viewBox="0 0 32 32" aria-hidden="true">
    <path d="M5 12h22v15H5zM5 12l2-7 21-3-2 7-21 3Z" />
    <path d="m10 5 3 5m4-7 3 5m4-6 3 5M11 12v15" />
  </svg>
)

const featureIcons = [CameraIcon, PinIcon, ClapperIcon]
const featureDetails = ['Od ujęć po montaż', 'Dojadę, gdzie trzeba', 'Emocje, które zostają']

function formatHudTime(frame: number): string {
  const frames = frame % 24
  const totalSeconds = Math.floor(frame / 24)
  const seconds = totalSeconds % 60
  const minutes = Math.floor(totalSeconds / 60) % 60
  const hours = Math.floor(totalSeconds / 3600) % 24

  return [hours, minutes, seconds, frames].map(value => String(value).padStart(2, '0')).join(':')
}

export default function About() {
  const [hudFrame, setHudFrame] = useState(307458)

  const sectionRef = useRef<HTMLElement>(null!)
  const hudBarRef = useRef<HTMLDivElement>(null!)
  const titleRef = useRef<HTMLHeadingElement>(null!)
  const videoRef = useRef<HTMLDivElement>(null!)
  const viewfinderRef = useRef<HTMLDivElement>(null!)
  const backdropRef = useRef<HTMLDivElement>(null!)
  const leadRef = useRef<HTMLParagraphElement>(null!)
  const descriptionRef = useRef<HTMLParagraphElement>(null!)
  const statementRef = useRef<HTMLDivElement>(null!)
  const ctaRef = useRef<HTMLDivElement>(null!)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mediaQuery.matches) return undefined

    const timer = window.setInterval(() => {
      setHudFrame(current => current + 1)
    }, 80)

    return () => window.clearInterval(timer)
  }, [])

  useAboutAnimations({
    sectionRef,
    hudBarRef,
    titleRef,
    videoRef,
    viewfinderRef,
    backdropRef,
    leadRef,
    descriptionRef,
    statementRef,
    ctaRef,
  })

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-label="O mnie"
      className="section-dark-bg px-6 py-20 md:py-28 lg:px-10"
    >
      <div className="mx-auto max-w-content">
        <div className={styles.sectionHeader}>
          <h2
            ref={titleRef}
            id="about-heading"
            className={cn(
              heroStyles.gradientTextPrimary,
              'text-center font-bebas text-3xl uppercase leading-[0.96] tracking-wide sm:text-4xl md:text-6xl md:leading-[0.9]',
            )}
          >
            {siteContent.about.title}
          </h2>

          <div ref={hudBarRef} aria-hidden="true" className={styles.hudBar}>
            <span data-hud-line="left" className={styles.hudLineLeft} />
            <span data-hud-label className={styles.hudModeLabel}>profile</span>
            <span data-hud-line="left" className={styles.hudLineLeft} />
            <span data-hud-line="right" className={styles.hudLineRight} />
            <span data-hud-label className={styles.hudTimecode}>scene 02/08</span>
            <span data-hud-line="right" className={styles.hudLineRight} />
          </div>
        </div>

        {/* One desktop viewfinder now frames the portrait and both copy panels. */}
        <div ref={viewfinderRef} className={styles.viewfinder}>
          <div ref={backdropRef} className={styles.viewfinderBackdrop} aria-hidden="true" />
          <span aria-hidden="true" className={`${styles.cornerMark} ${styles.cornerTL} ${styles.outerCorner}`} />
          <span aria-hidden="true" className={`${styles.cornerMark} ${styles.cornerTR} ${styles.outerCorner}`} />
          <span aria-hidden="true" className={`${styles.cornerMark} ${styles.cornerBL} ${styles.outerCorner}`} />
          <span aria-hidden="true" className={`${styles.cornerMark} ${styles.cornerBR} ${styles.outerCorner}`} />
          <div aria-hidden="true" className={cn(styles.viewfinderHudTop, styles.outerHudOnly)}>
            <span className={styles.viewfinderBattery}>
              <span className={styles.viewfinderBatteryBody}>
                <span className={styles.viewfinderBatteryFill} />
                <span className={styles.viewfinderBatteryLevel}>99%</span>
              </span>
              <span className={styles.viewfinderBatteryCap} />
            </span>
            <div className={styles.viewfinderHudStatus}>
              <span className={styles.viewfinderOverline}>
                <span className={styles.viewfinderRecText}>REC</span>
              </span>
            </div>
          </div>
          <div aria-hidden="true" className={cn(styles.viewfinderHudBottom, styles.outerHudOnly)}>
            <span className={styles.viewfinderResolution}>4K DCI / 25P</span>
            <span className={styles.viewfinderTimecode}>TC {formatHudTime(hudFrame)}</span>
          </div>

          <div className={styles.aboutLayout}>
            <div className={styles.videoColumn}>
              <div ref={videoRef} className={cn('relative mx-auto aspect-[3/4] w-3/4', styles.aboutVideoFrame)}>
                <video
                  src="/videos/hero/hero-video.mp4"
                  aria-label={siteContent.about.imageAlt}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className={cn(
                    'pointer-events-none relative z-10 h-full w-full origin-center translate-x-[-25%] scale-[1.725] object-contain object-center',
                    styles.aboutVideoMedia,
                  )}
                />
              </div>

            </div>

            <div className={styles.copyColumn}>
              <div className={styles.copyPanel}>
                {/* Corner marks */}
                <span aria-hidden="true" className={`${styles.cornerMark} ${styles.cornerTL}`} />
                <span aria-hidden="true" className={`${styles.cornerMark} ${styles.cornerTR}`} />
                <span aria-hidden="true" className={`${styles.cornerMark} ${styles.cornerBL}`} />
                <span aria-hidden="true" className={`${styles.cornerMark} ${styles.cornerBR}`} />
                <div aria-hidden="true" className={cn(styles.viewfinderHudTop, styles.innerHudOnly)}>
                  <span className={styles.viewfinderBattery}>
                    <span className={styles.viewfinderBatteryBody}>
                      <span className={styles.viewfinderBatteryFill} />
                      <span className={styles.viewfinderBatteryLevel}>99%</span>
                    </span>
                    <span className={styles.viewfinderBatteryCap} />
                  </span>
                  <div className={styles.viewfinderHudStatus}>
                    <span className={styles.viewfinderOverline}>
                      <span className={styles.viewfinderRecText}>REC</span>
                    </span>
                  </div>
                </div>
                <div aria-hidden="true" className={cn(styles.viewfinderHudBottom, styles.innerHudOnly)}>
                  <span className={styles.viewfinderResolution}>4K DCI / 25P</span>
                  <span className={cn(styles.viewfinderExposure, styles.hideOnMobile)}>ISO 800&nbsp;&nbsp;1/50</span>
                  <span className={styles.viewfinderTimecode}>TC {formatHudTime(hudFrame)}</span>
                </div>

                {/* Content inside the viewfinder */}
                <div className={styles.viewfinderContent}>
                  <p ref={leadRef} className={styles.viewfinderLead}>
                    {siteContent.about.lead
                      .split('historie.')
                      .flatMap((part, index, array) => {
                        if (index === array.length - 1) return [part.trimStart()]
                        return [part, 'historie.', <br key={`lead-break-historie-${index}`} />]
                      })
                      .flatMap((part, index) => {
                        if (typeof part !== 'string') return [part]
                        const chunks = part.split('pisać.')
                        return chunks.flatMap((chunk, chunkIndex) => {
                          if (chunkIndex === chunks.length - 1) return [chunk]
                          return [chunk, 'pisać.', <br key={`lead-break-pisac-${index}-${chunkIndex}`} />]
                        })
                      })}
                  </p>

                  <span aria-hidden="true" className={styles.viewfinderDivider} />

                  <p ref={descriptionRef} className={styles.viewfinderDesc}>
                    {siteContent.about.description
                      .split('I tutaj zaczyna się moja rola.')[0]
                      .split('filmem.')
                      .flatMap((part, index, array) => {
                        if (index === array.length - 1) return [part.trimStart()]
                        return [part, 'filmem.', <br key={`desc-break-filmem-${index}`} />]
                      })
                      .flatMap((part, index) => {
                        if (typeof part !== 'string') return [part]
                        const chunks = part.split('wspomnień.')
                        return chunks.flatMap((chunk, chunkIndex) => {
                          if (chunkIndex === chunks.length - 1) return [chunk]
                          return [chunk, 'wspomnień.', <br key={`desc-break-wspomnien-${index}-${chunkIndex}`} />]
                        })
                      })}
                    <strong className={styles.viewfinderEmphasis}>
                      I tutaj zaczyna się moja rola.
                    </strong>
                  </p>
                </div>
              </div>

              <div ref={statementRef} className={styles.statementPanel}>
                <span aria-hidden="true" className={`${styles.cornerMark} ${styles.cornerTL}`} />
                <span aria-hidden="true" className={`${styles.cornerMark} ${styles.cornerTR}`} />
                <span aria-hidden="true" className={`${styles.cornerMark} ${styles.cornerBL}`} />
                <span aria-hidden="true" className={`${styles.cornerMark} ${styles.cornerBR}`} />
                <p className={styles.aboutStatement}>
                  {siteContent.about.statement
                    .replace('Malxxxxx. ', 'Malxxxxx.\n')
                    .replace('tak, jak', 'tak,\njak')
                    .split('\n')
                    .flatMap((part, index, array) => {
                      if (index === array.length - 1) return [part]
                      return [part, <br key={`statement-break-${index}`} />]
                    })}
                </p>
              </div>

              <div ref={ctaRef} className={styles.bottomCta}>
                <div className={styles.features} aria-label="Najważniejsze informacje">
                  {siteContent.cta.features.map((feature, index) => {
                    const Icon = featureIcons[index]
                    return (
                      <div key={feature.label} className={styles.feature}>
                        <Icon />
                        <strong>{feature.label}</strong>
                        <span>{featureDetails[index]}</span>
                      </div>
                    )
                  })}
                </div>

                <div className={styles.ctaActions}>
                  <a
                    href="#promo"
                    className={cn(
                      heroStyles.ctaButton,
                      heroStyles.ctaButtonSecondary,
                      styles.ctaButton,
                    )}
                  >
                    {siteContent.about.ctaLabel}
                  </a>

                  <a
                    href="/contact#bio"
                    className={cn(
                      heroStyles.ctaButton,
                      heroStyles.ctaButtonSecondary,
                      styles.ctaButton,
                    )}
                  >
                    Więcej o mnie
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
