'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { siteContent } from '@/lib/site-content'
import { cn } from '@/lib/utils'
import styles from './AboutMeBio.module.css'
import { useAboutMeBioAnimations } from './useAboutMeBioAnimations'

function GearIcon({ index }: { index: number }) {
  if (index === 0) return <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M4 10h7l2-3h6l2 3h7v16H4V10Z" /><circle cx="16" cy="18" r="5" /></svg>
  if (index === 1) return <svg viewBox="0 0 32 32" aria-hidden="true"><rect x="11" y="4" width="10" height="17" rx="5" /><path d="M7 16v1a9 9 0 0 0 18 0v-1M16 26v3M11 29h10" /></svg>
  if (index === 2) return <svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="8" cy="8" r="4" /><circle cx="24" cy="8" r="4" /><circle cx="8" cy="24" r="4" /><circle cx="24" cy="24" r="4" /><path d="m11 11 10 10m0-10L11 21M13 16h6" /></svg>
  return <svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="6" /><path d="M16 2v5M16 25v5M2 16h5M25 16h5M6 6l4 4M22 22l4 4M26 6l-4 4M10 22l-4 4" /></svg>
}

export default function AboutMeBio() {
  const sectionRef = useRef<HTMLElement>(null!)
  const titleRef = useRef<HTMLHeadingElement>(null!)
  const subtitleRef = useRef<HTMLParagraphElement>(null!)
  const hudBarRef = useRef<HTMLDivElement>(null!)
  const bioPanelRef = useRef<HTMLDivElement>(null!)

  useAboutMeBioAnimations({ sectionRef, titleRef, subtitleRef, hudBarRef, bioPanelRef })

  const { profile } = siteContent.aboutMe
  const [introLead, introBody = ''] = profile.intro.split(' — ')

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
              <Image src="/images/contact/contact.webp" alt="Przemek z aparatem podczas pracy w plenerze" fill sizes="(max-width: 767px) 92vw, (max-width: 1199px) 45vw, 620px" className={styles.portraitImage} />
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
                return <li key={item} className={styles.gearItem}><span className={styles.gearIcon}><GearIcon index={index} /></span><span><strong>{label}</strong>{detail && <small>{detail}</small>}</span></li>
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
