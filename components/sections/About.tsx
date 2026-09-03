'use client'

import { useRef, useEffect } from 'react'
import { siteContent } from '@/lib/site-content'
import { cn } from '@/lib/utils'
import CinematicVideoPlayer from '@/components/ui/CinematicVideoPlayer'
import { useLazyVideoSource } from '@/components/ui/useLazyVideoSource'
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

const INITIAL_HUD_FRAME = 307458

export default function About() {
  const sectionRef = useRef<HTMLElement>(null!)
  const hudBarRef = useRef<HTMLDivElement>(null!)
  const titleRef = useRef<HTMLHeadingElement>(null!)
  const videoRef = useRef<HTMLDivElement>(null!)
  const mobileVideoRef = useRef<HTMLDivElement>(null!)
  const viewfinderRef = useRef<HTMLDivElement>(null!)
  const backdropRef = useRef<HTMLDivElement>(null!)
  const copyPanelRef = useRef<HTMLDivElement>(null!)
  const leadRef = useRef<HTMLParagraphElement>(null!)
  const descriptionRef = useRef<HTMLParagraphElement>(null!)
  const statementRef = useRef<HTMLDivElement>(null!)
  const ctaRef = useRef<HTMLDivElement>(null!)
  const outerTimecodeRef = useRef<HTMLSpanElement>(null!)
  const innerTimecodeRef = useRef<HTMLSpanElement>(null!)
  const shouldLoadDesktopVideo = useLazyVideoSource(videoRef)
  const shouldLoadMobileVideo = useLazyVideoSource(mobileVideoRef)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mediaQuery.matches) return undefined

    let frame = INITIAL_HUD_FRAME
    const timer = window.setInterval(() => {
      frame += 1
      const timecode = `TC ${formatHudTime(frame)}`

      if (outerTimecodeRef.current) outerTimecodeRef.current.textContent = timecode
      if (innerTimecodeRef.current) innerTimecodeRef.current.textContent = timecode
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
    copyPanelRef,
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
        <div className={cn('mx-auto max-w-3xl', styles.sectionHeader)}>
          <h2
            ref={titleRef}
            id="about-heading"
            className={cn(
              heroStyles.gradientTextPrimary,
              'text-center font-bebas text-5xl uppercase leading-[0.9] tracking-wide sm:text-6xl',
            )}
          >
            {siteContent.about.title}
          </h2>

          <div ref={hudBarRef} aria-hidden="true" className={styles.hudBar}>
            <span className={styles.hudBarHalf}>
              <span data-hud-line="left" className={styles.hudLineLeft} />
              <span data-hud-label className={styles.hudModeLabel}>profile</span>
              <span data-hud-line="left" className={styles.hudLineLeft} />
            </span>
            <span className={styles.hudBarHalf}>
              <span data-hud-line="right" className={styles.hudLineRight} />
              <span data-hud-label className={styles.hudTimecode}>scene 02/08</span>
              <span data-hud-line="right" className={styles.hudLineRight} />
            </span>
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
            <span ref={outerTimecodeRef} className={styles.viewfinderTimecode}>
              TC {formatHudTime(INITIAL_HUD_FRAME)}
            </span>
          </div>

          <div className={styles.aboutLayout}>
            <div className={styles.videoColumn}>
              <div ref={videoRef} className={cn('relative mx-auto aspect-[3/4] w-3/4', styles.aboutVideoFrame)}>
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <video
                  aria-label={siteContent.about.imageAlt}
                  poster="/images/Hero.webp"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className={cn(
                    'pointer-events-none relative z-10 h-full w-full origin-center translate-x-[-25%] scale-[1.725] object-contain object-center',
                    styles.aboutVideoMedia,
                  )}
                >
                  {shouldLoadDesktopVideo && <source src="/videos/hero/hero-video.mp4" type="video/mp4" />}
                </video>
              </div>

            </div>

            <div className={styles.copyColumn}>
              <div ref={copyPanelRef} className={styles.copyPanel}>
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
                  <span ref={innerTimecodeRef} className={styles.viewfinderTimecode}>
                    TC {formatHudTime(INITIAL_HUD_FRAME)}
                  </span>
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
                        const chunks = part.split('Potem obrazem.')
                        return chunks.flatMap((chunk, chunkIndex) => {
                          if (chunkIndex === chunks.length - 1) return [chunk]
                          return [chunk, 'Potem obrazem.', <br key={`lead-break-obrazem-${index}-${chunkIndex}`} />]
                        })
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

                  <CinematicVideoPlayer
                    ref={mobileVideoRef}
                    className={styles.mobileVideoFrame}
                    src={siteContent.promo.heroVideo.src}
                    poster={siteContent.promo.heroVideo.poster}
                    shouldLoad={shouldLoadMobileVideo}
                    playLabel="film promocyjny"
                    showFullscreen={false}
                    muted
                  >
                    <span aria-hidden="true" className={`${styles.cornerMark} ${styles.cornerTL}`} />
                    <span aria-hidden="true" className={`${styles.cornerMark} ${styles.cornerTR}`} />
                    <span aria-hidden="true" className={`${styles.cornerMark} ${styles.cornerBL}`} />
                    <span aria-hidden="true" className={`${styles.cornerMark} ${styles.cornerBR}`} />
                  </CinematicVideoPlayer>

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
                    .replace('Maleszyk. ', 'Maleszyk.\n')
                    .replace('tak, jak', 'tak,\njak')
                    .split('\n')
                    .flatMap((part, index, array) => {
                      if (index === array.length - 1) return [part]
                      return [part, <br key={`statement-break-${index}`} />]
                    })}
                </p>
              </div>

              <div ref={ctaRef} className={styles.bottomCta}>
                <div className={styles.ctaActions}>
                  <a
                    href="/o-mnie#bio"
                    className={cn(
                      heroStyles.ctaButton,
                      heroStyles.ctaButtonSecondary,
                      'px-4 py-2 font-bebas text-[1.15rem] uppercase tracking-widest sm:text-[1.35rem]',
                    )}
                  >
                    <span className={styles.desktopCtaLabel}>Dowiedz się więcej o mnie</span>
                    <span className={styles.mobileCtaLabel}>Więcej o mnie</span>
                  </a>

                  <a
                    href="#promo"
                    className={cn(
                      heroStyles.ctaButton,
                      heroStyles.ctaButtonSecondary,
                      'px-4 py-2 font-bebas text-[1.15rem] uppercase tracking-widest sm:text-[1.35rem]',
                    )}
                  >
                    Zobacz realizacje
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
