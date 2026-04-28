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

  const { profile } = siteContent.aboutMe
  const introWords = profile.intro.split(/(\s+)/)

  return (
    <section
      ref={sectionRef}
      id="bio"
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
            {profile.title}
          </h2>
          <div ref={hudBarRef} aria-hidden="true" className={styles.hudBar}>
            <span data-hud-line className={styles.hudLineLeft} />
            <span data-hud-label className={styles.hudLabelLeft}>
              {profile.hudLabelLeft}
            </span>
            <span data-hud-line className={styles.hudLineLeft} />
            <span data-hud-line className={styles.hudLineRight} />
            <span data-hud-label className={styles.hudLabelRight}>
              {profile.hudLabelRight}
            </span>
            <span data-hud-line className={styles.hudLineRight} />
          </div>

          <p
            ref={subtitleRef}
            className="mt-5 whitespace-pre-line font-mono text-[0.95rem] leading-[1.85] tracking-wide text-white/50"
          >
            {profile.subtitle}
          </p>
        </div>

        {/* Profile panel */}
        <div ref={bioPanelRef} className={styles.bioPanel}>
          {/* Outer corner marks — visible on desktop, hidden on mobile */}
          <span aria-hidden="true" className={cn(styles.cornerMark, styles.cornerOuter, styles.cornerTL)} />
          <span aria-hidden="true" className={cn(styles.cornerMark, styles.cornerOuter, styles.cornerTR)} />
          <span aria-hidden="true" className={cn(styles.cornerMark, styles.cornerOuter, styles.cornerBL)} />
          <span aria-hidden="true" className={cn(styles.cornerMark, styles.cornerOuter, styles.cornerBR)} />
          <span aria-hidden="true" className={cn(styles.notesLabel, styles.notesLabelOuter)}>NOTES</span>

          {/* Intro sub-panel */}
          <div data-bio-block className={styles.bioPanelText}>
            <span aria-hidden="true" className={cn(styles.cornerMark, styles.cornerInner, styles.cornerTL)} />
            <span aria-hidden="true" className={cn(styles.cornerMark, styles.cornerInner, styles.cornerTR)} />
            <span aria-hidden="true" className={cn(styles.cornerMark, styles.cornerInner, styles.cornerBL)} />
            <span aria-hidden="true" className={cn(styles.cornerMark, styles.cornerInner, styles.cornerBR)} />
            <span aria-hidden="true" className={cn(styles.notesLabel, styles.notesLabelInner)}>NOTES</span>

            <p className={cn(styles.bioText, styles.bioTextIntro)}>
              {introWords.map((token, i) =>
                /^\s+$/.test(token) ? (
                  token
                ) : (
                  <span key={`intro-${i}`} data-bio-word className={styles.bioWord}>
                    {token}
                  </span>
                ),
              )}
            </p>
          </div>

          {/* Profile grid: location + specialties */}
          <div className={styles.profileGrid}>
            <article data-bio-block className={styles.infoBlock}>
              <span aria-hidden="true" className={cn(styles.cornerMark, styles.cornerInner, styles.cornerTL)} />
              <span aria-hidden="true" className={cn(styles.cornerMark, styles.cornerInner, styles.cornerTR)} />
              <span aria-hidden="true" className={cn(styles.cornerMark, styles.cornerInner, styles.cornerBL)} />
              <span aria-hidden="true" className={cn(styles.cornerMark, styles.cornerInner, styles.cornerBR)} />
              <span aria-hidden="true" className={cn(styles.notesLabel, styles.notesLabelInner)}>NOTES</span>

              <header className={styles.infoHeader}>
                <span aria-hidden="true" className={styles.infoRule} />
                <h3 className={styles.infoLabel}>{profile.locationLabel}</h3>
                <span aria-hidden="true" className={styles.infoRule} />
              </header>
              <p className={styles.infoBody}>{profile.locationText}</p>
            </article>

            <article data-bio-block className={styles.infoBlock}>
              <span aria-hidden="true" className={cn(styles.cornerMark, styles.cornerInner, styles.cornerTL)} />
              <span aria-hidden="true" className={cn(styles.cornerMark, styles.cornerInner, styles.cornerTR)} />
              <span aria-hidden="true" className={cn(styles.cornerMark, styles.cornerInner, styles.cornerBL)} />
              <span aria-hidden="true" className={cn(styles.cornerMark, styles.cornerInner, styles.cornerBR)} />
              <span aria-hidden="true" className={cn(styles.notesLabel, styles.notesLabelInner)}>NOTES</span>

              <header className={styles.infoHeader}>
                <span aria-hidden="true" className={styles.infoRule} />
                <h3 className={styles.infoLabel}>{profile.specialtiesLabel}</h3>
                <span aria-hidden="true" className={styles.infoRule} />
              </header>
              <ul className={styles.specialtiesList}>
                {profile.specialties.map((item) => (
                  <li key={item} className={styles.specialtyItem}>
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </div>

          {/* Stats row */}
          <section data-bio-block className={styles.statsBlock} aria-label={profile.statsLabel}>
            <header className={styles.infoHeader}>
              <span aria-hidden="true" className={styles.infoRule} />
              <h3 className={styles.infoLabel}>{profile.statsLabel}</h3>
              <span aria-hidden="true" className={styles.infoRule} />
            </header>
            <ul className={styles.statsRow}>
              {profile.stats.map((stat) => (
                <li key={stat.label} className={styles.statBlock}>
                  <span className={cn(styles.statValue, styles.gradientTextPrimary)}>{stat.value}</span>
                  <span className={styles.statLabel}>{stat.label}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Gear */}
          <section data-bio-block className={styles.gearBlock} aria-label={profile.gearLabel}>
            <header className={styles.infoHeader}>
              <span aria-hidden="true" className={styles.infoRule} />
              <h3 className={styles.infoLabel}>{profile.gearLabel}</h3>
              <span aria-hidden="true" className={styles.infoRule} />
            </header>
            <ul className={styles.gearList}>
              {profile.gear.map((item) => (
                <li key={item} className={styles.gearItem}>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Mini CTA */}
          <div data-bio-block className={styles.profileCta}>
            <a href={profile.cta.href} className={styles.profileCtaLink}>
              {profile.cta.label}
              <span aria-hidden="true" className={styles.profileCtaArrow}>↓</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
