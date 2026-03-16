'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { siteContent } from '@/lib/site-content'
import { cn } from '@/lib/utils'
import styles from './AboutMeHero.module.css'
import { useAboutMeHeroAnimations } from './useAboutMeHeroAnimations'

type AboutMeHeroProps = {
  heroOverride?: {
    name?: string
    tagline?: string
    resolution?: string
    backgroundImage?: string
    backgroundAlt?: string
    showRecIndicator?: boolean
    showTimecode?: boolean
  }
}

export default function AboutMeHero({ heroOverride }: AboutMeHeroProps) {
  const sectionRef = useRef<HTMLElement>(null!)
  const bgRef = useRef<HTMLDivElement>(null!)
  const nameRef = useRef<HTMLHeadingElement>(null!)
  const taglineRef = useRef<HTMLParagraphElement>(null!)
  const hudOverlayRef = useRef<HTMLDivElement>(null!)

  useAboutMeHeroAnimations({
    sectionRef,
    bgRef,
    nameRef,
    taglineRef,
    hudOverlayRef,
  })

  const hero = {
    showRecIndicator: true,
    showTimecode: true,
    ...siteContent.aboutMe.hero,
    ...heroOverride,
  }

  return (
    <section
      ref={sectionRef}
      aria-label="Profil reżysera"
      className={styles.heroSection}
    >
      {/* Parallax background */}
      <div ref={bgRef} className={styles.heroBg}>
        <Image
          src={hero.backgroundImage}
          alt={hero.backgroundAlt}
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
        />
      </div>

      {/* Overlay */}
      <div className={styles.heroOverlay} aria-hidden="true" />

      {/* Film strip sprocket holes */}
      <div className={styles.filmStripLeft} aria-hidden="true" />
      <div className={styles.filmStripRight} aria-hidden="true" />

      {/* Content */}
      <div className={styles.heroContent}>
        <h1 ref={nameRef} className={styles.heroName}>
          {hero.name}
        </h1>
        <p ref={taglineRef} className={styles.heroTagline}>
          {hero.tagline}
        </p>
      </div>

      {/* HUD overlay */}
      <div ref={hudOverlayRef} className={styles.hudOverlay} aria-hidden="true">
        <span className={cn(styles.cornerMark, styles.cornerTL)} />
        <span className={cn(styles.cornerMark, styles.cornerTR)} />
        <span className={cn(styles.cornerMark, styles.cornerBL)} />
        <span className={cn(styles.cornerMark, styles.cornerBR)} />

        {hero.showRecIndicator ? (
          <span className={styles.recIndicator}>
            <span className={styles.recDot} />
            <span className={styles.recText}>REC</span>
          </span>
        ) : null}

        <span
          className={cn(
            styles.resolutionLabel,
            !hero.showTimecode && styles.resolutionLabelBottomRight,
          )}
        >
          {hero.resolution}
        </span>

        {hero.showTimecode ? (
          <span className={styles.timecode}>00:00:00:00</span>
        ) : null}
      </div>
    </section>
  )
}
