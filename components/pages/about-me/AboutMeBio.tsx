'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { siteContent } from '@/lib/site-content'
import { cn } from '@/lib/utils'
import styles from './AboutMeBio.module.css'
import { useAboutMeBioAnimations } from './useAboutMeBioAnimations'

function GearIcon({ index }: { index: number }) {
  if (index === 0) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 7h4l2-3h6l2 3h4v13H3V7Z" />
        <circle cx="12" cy="13.5" r="3.5" />
      </svg>
    )
  }
  if (index === 1) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="9" y="3" width="6" height="12" rx="3" />
        <path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3M8 22h8" />
      </svg>
    )
  }
  if (index === 2) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="6" cy="6" r="3" />
        <circle cx="18" cy="6" r="3" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="18" r="3" />
        <path d="m8.5 8.5 7 7m0-7-7 7M10 12h4" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M19.07 4.93l-2.12 2.12M7.05 16.95l-2.12 2.12" />
    </svg>
  )
}

export default function AboutMeBio() {
  const sectionRef = useRef<HTMLElement>(null!)
  const titleRef = useRef<HTMLHeadingElement>(null!)
  const subtitleRef = useRef<HTMLParagraphElement>(null!)
  const hudBarRef = useRef<HTMLDivElement>(null!)
  const bioPanelRef = useRef<HTMLDivElement>(null!)

  useAboutMeBioAnimations({ sectionRef, titleRef, subtitleRef, hudBarRef, bioPanelRef })

  const { profile } = siteContent.aboutMe
  const [introLead, introMiddle = '', ...introBodyLines] = profile.intro.split('\n')
  const introBody = introBodyLines.join('\n')

  return (
    <section ref={sectionRef} id="bio" aria-labelledby="aboutme-bio-heading" className={cn(styles.section, 'section-dark-bg')}>
      <div className={styles.container}>
        <header className={styles.sectionHeader}>
          <h2 ref={titleRef} id="aboutme-bio-heading" className={styles.sectionTitle}>{profile.title}</h2>
          <div ref={hudBarRef} aria-hidden="true" className={styles.hudBar}>
            <span data-hud-line className={styles.hudLine} />
            <span data-hud-label className={styles.hudLabel}>{profile.hudLabelLeft}</span>
            <span data-hud-line className={styles.hudLineShort} />
            <span data-hud-line className={styles.hudLineShort} />
            <span data-hud-label className={styles.hudLabel}>{profile.hudLabelRight}</span>
            <span data-hud-line className={styles.hudLine} />
          </div>
        </header>

        <div ref={bioPanelRef} className={styles.profilePanel}>
          <div className={styles.identityGrid}>
            <div className={styles.copyColumn}>
              <div data-bio-block className={styles.introBlock}>
                <p className={styles.introLead}>
                  {introLead.split(/(\s+)/).map((token, index) => /^\s+$/.test(token)
                    ? token
                    : <span key={`${token}-${index}`} data-bio-word>{token}</span>)}
                </p>
                {introMiddle && <p className={styles.introMiddle}>{introMiddle}</p>}
                {introBody && <p className={styles.introBody}>{introBody}</p>}
                <span aria-hidden="true" className={styles.accentRule} />
              </div>

              <div className={styles.infoGrid}>
                <article data-bio-block className={styles.infoBlock}>
                  <h3 className={styles.infoTitle}>{profile.locationLabel}</h3>
                  <ul className={styles.detailList}>
                    {profile.locationText.split(/, |\. /).filter(Boolean).map((item) => <li key={item}>{item.replace(/\.$/, '')}</li>)}
                  </ul>
                </article>

                <article data-bio-block className={styles.infoBlock}>
                  <h3 className={styles.infoTitle}>{profile.specialtiesLabel}</h3>
                  <ul className={styles.detailList}>
                    {profile.specialties.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </article>
              </div>
            </div>

            <figure data-bio-block className={styles.portraitFrame}>
              <Image src="/images/contact/contact.webp" alt="Fotograf z aparatem podczas pracy w plenerze" fill sizes="(max-width: 767px) 92vw, (max-width: 1199px) 45vw, 620px" className={styles.portraitImage} />
              <span aria-hidden="true" className={styles.portraitShade} />
              <span aria-hidden="true" className={cn(styles.frameCorner, styles.frameCornerTL)} />
              <span aria-hidden="true" className={cn(styles.frameCorner, styles.frameCornerTR)} />
              <span aria-hidden="true" className={cn(styles.frameCorner, styles.frameCornerBL)} />
              <span aria-hidden="true" className={cn(styles.frameCorner, styles.frameCornerBR)} />
              <span className={cn(styles.frameLabel, styles.frameLabelLeft)}>FILMMAKER</span>
              <span className={cn(styles.frameLabel, styles.frameLabelRight)}>VISUAL STORYTELLER</span>
              <figcaption className={styles.cameraMeta}>4K &nbsp; | &nbsp; 25FPS &nbsp; | &nbsp; CINEMATIC</figcaption>
            </figure>
          </div>

          <section data-bio-block className={styles.gearBlock} aria-label={profile.gearLabel}>
            <section className={styles.statsBlock} aria-label={profile.statsLabel}>
              {profile.stats.map((stat, index) => (
                <div key={stat.label} className={styles.statItem}>
                  <span className={styles.statValue}>{stat.value}</span>
                  <span className={styles.statLabel}>{stat.label}</span>
                  {index < profile.stats.length - 1 && <span aria-hidden="true" className={styles.statDivider} />}
                </div>
              ))}
            </section>
            <ul className={styles.gearList}>
              {profile.gear.map((item, index) => {
                const [label, detail] = item.split(' — ')
                return (
                  <li key={item} className={styles.gearItem}>
                    <span className={styles.gearIcon}>
                      <GearIcon index={index} />
                    </span>
                    <div>
                      <strong>{label}</strong>
                      {detail && <span>{detail}</span>}
                    </div>
                  </li>
                )
              })}
            </ul>
          </section>

          <div data-bio-block className={styles.profileCta}>
            <a href={profile.cta.href} className={styles.profileCtaLink}>{profile.cta.label}</a>
          </div>
        </div>
      </div>
    </section>
  )
}
