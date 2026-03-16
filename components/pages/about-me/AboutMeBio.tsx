'use client'

import { useRef } from 'react'
import { siteContent } from '@/lib/site-content'
import { cn } from '@/lib/utils'
import styles from './AboutMeBio.module.css'
import { useAboutMeBioAnimations } from './useAboutMeBioAnimations'

export default function AboutMeBio() {
  const sectionRef = useRef<HTMLElement>(null!)
  const titleRef = useRef<HTMLHeadingElement>(null!)
  const subtitleRef = useRef<HTMLParagraphElement>(null!)
  const hudBarRef = useRef<HTMLDivElement>(null!)
  const bioPanelRef = useRef<HTMLDivElement>(null!)

  useAboutMeBioAnimations({
    sectionRef,
    titleRef,
    subtitleRef,
    hudBarRef,
    bioPanelRef,
  })

  const { bio } = siteContent.aboutMe

  // Split text into words for typewriter effect
  const words = bio.text.split(/(\s+)/)

  return (
    <section
      ref={sectionRef}
      aria-labelledby="aboutme-bio-heading"
      className={cn(
        'bg-anthracite px-6 py-20 sm:py-24 lg:px-20 lg:py-32',
        'section-dark-bg',
      )}
    >
      <div className="mx-auto max-w-content">
        {/* Header */}
        <div className={cn('mx-auto max-w-3xl', styles.sectionHeader)}>
          <h2
            ref={titleRef}
            id="aboutme-bio-heading"
            className={cn(
              styles.gradientTextPrimary,
              'text-center font-bebas text-5xl uppercase leading-[0.9] tracking-wide sm:text-6xl',
              styles.sectionTitle,
            )}
          >
            {bio.title}
          </h2>
          <div ref={hudBarRef} aria-hidden="true" className={styles.hudBar}>
            <span data-hud-line className={styles.hudLineLeft} />
            <span data-hud-label className={styles.hudLabelLeft}>
              {bio.hudLabelLeft}
            </span>
            <span data-hud-line className={styles.hudLineLeft} />
            <span data-hud-line className={styles.hudLineRight} />
            <span data-hud-label className={styles.hudLabelRight}>
              {bio.hudLabelRight}
            </span>
            <span data-hud-line className={styles.hudLineRight} />
          </div>

          <p
            ref={subtitleRef}
            className="mt-5 whitespace-pre-line font-mono text-[0.95rem] leading-[1.85] tracking-wide text-white/50"
          >
            Director&apos;s Notes
          </p>
        </div>

        {/* Bio panel — script style */}
        <div ref={bioPanelRef} className={styles.bioPanel}>
          <span aria-hidden="true" className={cn(styles.cornerMark, styles.cornerTL)} />
          <span aria-hidden="true" className={cn(styles.cornerMark, styles.cornerTR)} />
          <span aria-hidden="true" className={cn(styles.cornerMark, styles.cornerBL)} />
          <span aria-hidden="true" className={cn(styles.cornerMark, styles.cornerBR)} />

          <span aria-hidden="true" className={styles.notesLabel}>NOTES</span>

          <p className={styles.bioText}>
            {words.map((word, i) =>
              /^\s+$/.test(word) ? (
                word
              ) : (
                <span key={i} data-bio-word className={styles.bioWord}>
                  {word}
                </span>
              ),
            )}
          </p>
        </div>
      </div>
    </section>
  )
}
