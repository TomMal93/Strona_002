'use client'

import { useRef } from 'react'
import { siteContent } from '@/lib/site-content'
import { cn } from '@/lib/utils'
import styles from './AboutMeGear.module.css'
import { useAboutMeGearAnimations } from './useAboutMeGearAnimations'

export default function AboutMeGear() {
  const sectionRef = useRef<HTMLElement>(null!)
  const titleRef = useRef<HTMLHeadingElement>(null!)
  const subtitleRef = useRef<HTMLParagraphElement>(null!)
  const hudBarRef = useRef<HTMLDivElement>(null!)
  const statsGridRef = useRef<HTMLDivElement>(null!)
  const equipGridRef = useRef<HTMLDivElement>(null!)

  useAboutMeGearAnimations({
    sectionRef,
    titleRef,
    subtitleRef,
    hudBarRef,
    statsGridRef,
    equipGridRef,
  })

  const { gear } = siteContent.aboutMe

  return (
    <section
      ref={sectionRef}
      aria-labelledby="aboutme-gear-heading"
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
            id="aboutme-gear-heading"
            className={cn(
              styles.gradientTextPrimary,
              'text-center font-bebas text-5xl uppercase leading-[0.9] tracking-wide sm:text-6xl',
              styles.sectionTitle,
            )}
          >
            {gear.title}
          </h2>
          <div ref={hudBarRef} aria-hidden="true" className={styles.hudBar}>
            <span data-hud-line className={styles.hudLineLeft} />
            <span data-hud-label className={styles.hudLabelLeft}>
              {gear.hudLabelLeft}
            </span>
            <span data-hud-line className={styles.hudLineLeft} />
            <span data-hud-line className={styles.hudLineRight} />
            <span data-hud-label className={styles.hudLabelRight}>
              {gear.hudLabelRight}
            </span>
            <span data-hud-line className={styles.hudLineRight} />
          </div>

          <p
            ref={subtitleRef}
            className="mt-5 whitespace-pre-line font-mono text-[0.95rem] leading-[1.85] tracking-wide text-white/50"
          >
            Sprzęt i doświadczenie — w liczbach i szczegółach.
          </p>
        </div>

        {/* Stats counter */}
        <div ref={statsGridRef} className={styles.statsGrid}>
          {gear.stats.map((stat) => (
            <div key={stat.label} className={styles.statItem} data-stat-item>
              <span
                className={styles.statAccentTop}
                aria-hidden="true"
                data-stat-accent
              />
              <span className={styles.statValue}>
                <span data-stat-value data-target={stat.value}>
                  0
                </span>
                {stat.suffix}
              </span>
              <span className={styles.statLabel}>{stat.label}</span>
              <span
                className={styles.statAccentBottom}
                aria-hidden="true"
                data-stat-accent
              />
            </div>
          ))}
        </div>

        {/* Equipment grid */}
        <div ref={equipGridRef} className={styles.equipmentGrid}>
          {gear.items.map((item) => (
            <div key={item.name} className={styles.equipCard} data-equip-card>
              <span
                aria-hidden="true"
                className={cn(styles.equipCornerMark, styles.equipCornerTL)}
              />
              <span
                aria-hidden="true"
                className={cn(styles.equipCornerMark, styles.equipCornerTR)}
              />
              <span
                aria-hidden="true"
                className={cn(styles.equipCornerMark, styles.equipCornerBL)}
              />
              <span
                aria-hidden="true"
                className={cn(styles.equipCornerMark, styles.equipCornerBR)}
              />

              <span className={styles.equipCategory}>{item.category}</span>
              <h3 className={styles.equipName}>{item.name}</h3>
              <span className={styles.equipSpec}>{item.spec}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
