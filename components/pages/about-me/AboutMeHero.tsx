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
    framedImage?: boolean
  }
}

export default function AboutMeHero({ heroOverride }: AboutMeHeroProps) {
  const sectionRef = useRef<HTMLElement>(null!)
  const bgRef = useRef<HTMLDivElement>(null!)
  const nameRef = useRef<HTMLHeadingElement>(null!)
  const taglineRef = useRef<HTMLParagraphElement>(null!)

  useAboutMeHeroAnimations({
    sectionRef,
    bgRef,
    nameRef,
    taglineRef,
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
      className={cn(
        styles.heroSection,
        hero.framedImage && styles.heroSectionFramed,
      )}
    >
      {/* Parallax background */}
      <div
        ref={bgRef}
        className={cn(
          styles.heroBg,
          hero.framedImage && styles.heroBgFramed,
        )}
      >
        <Image
          src={hero.backgroundImage}
          alt={hero.backgroundAlt}
          fill
          priority
          sizes="100vw"
          style={
            hero.framedImage
              ? { objectFit: 'cover', objectPosition: 'center center' }
              : { objectFit: 'cover', objectPosition: 'center 20%' }
          }
        />
      </div>

      {/* Overlay */}
      <div className={styles.heroOverlay} aria-hidden="true" />

      {/* Film strip sprocket holes */}
      {!hero.framedImage ? (
        <>
          <div className={styles.filmStripLeft} aria-hidden="true" />
          <div className={styles.filmStripRight} aria-hidden="true" />
        </>
      ) : null}

      {/* Content */}
      <div className={styles.heroContent}>
        <h1 ref={nameRef} className={styles.heroName}>
          {hero.name}
        </h1>
        <p ref={taglineRef} className={styles.heroTagline}>
          {hero.tagline}
        </p>
      </div>

    </section>
  )
}
