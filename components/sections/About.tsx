'use client'

import { useRef, useEffect, useState } from 'react'
import { siteContent } from '@/lib/site-content'
import { cn } from '@/lib/utils'
import styles from './About.module.css'
import heroStyles from './Hero.module.css'
import { useAboutAnimations } from './about/useAboutAnimations'

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
  const viewfinderRef = useRef<HTMLDivElement>(null!)
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
    viewfinderRef,
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
        <div className="grid gap-8 md:items-center md:gap-10 lg:gap-12">
          <div>
            <div className={styles.introCluster}>
              {/* Title */}
              <div className="w-full text-center">
                <h2
                  ref={titleRef}
                  id="about-heading"
                  className={cn(
                    heroStyles.gradientTextPrimary,
                    'font-bebas text-3xl uppercase leading-[0.96] tracking-wide sm:text-4xl',
                  )}
                >
                  {siteContent.about.title}
                </h2>
              </div>

              <div ref={hudBarRef} aria-hidden="true" className={styles.hudBar}>
                <span data-hud-line="left" className={styles.hudLineLeft} />
                <span data-hud-label className={styles.hudModeLabel}>profile</span>
                <span data-hud-line="left" className={styles.hudLineLeft} />
                <span data-hud-line="right" className={styles.hudLineRight} />
                <span data-hud-label className={styles.hudTimecode}>scene 02/07</span>
                <span data-hud-line="right" className={styles.hudLineRight} />
              </div>

              {/* Viewfinder frame */}
              <div ref={viewfinderRef} className={styles.viewfinder}>
                {/* Corner marks */}
                <span aria-hidden="true" className={`${styles.cornerMark} ${styles.cornerTL}`} />
                <span aria-hidden="true" className={`${styles.cornerMark} ${styles.cornerTR}`} />
                <span aria-hidden="true" className={`${styles.cornerMark} ${styles.cornerBL}`} />
                <span aria-hidden="true" className={`${styles.cornerMark} ${styles.cornerBR}`} />
                <div aria-hidden="true" className={styles.viewfinderHudTop}>
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
                <div aria-hidden="true" className={styles.viewfinderHudBottom}>
                  <span className={styles.viewfinderResolution}>4K DCI / 25P</span>
                  <span className={styles.viewfinderExposure}>ISO 800&nbsp;&nbsp;F2.8&nbsp;&nbsp;1/125</span>
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

              <div ref={ctaRef} className={styles.statementCta}>
                <div className={styles.statementCtaRow}>
                  <a href="#promo" className={`${styles.ctaLink} ${styles.ctaLinkFirst}`}>
                    {siteContent.about.ctaLabel}
                  </a>
                  <span aria-hidden="true" className={styles.statementSeparator} />
                  <a href="/contact" className={styles.ctaLink}>
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
