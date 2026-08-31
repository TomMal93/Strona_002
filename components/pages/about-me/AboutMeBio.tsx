'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { siteContent } from '@/lib/site-content'
import { cn } from '@/lib/utils'
import styles from './AboutMeBio.module.css'
import { useAboutMeBioAnimations } from './useAboutMeBioAnimations'

const statIcons = ['◎', '▱', '4K', '◷'] as const
const gearIcons = ['▣', '◉', '✣', '◌'] as const

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
      <span aria-hidden="true" className={cn(styles.pageCorner, styles.pageCornerTL)} />
      <span aria-hidden="true" className={cn(styles.pageCorner, styles.pageCornerTR)} />
      <span aria-hidden="true" className={cn(styles.pageCorner, styles.pageCornerBL)} />
      <span aria-hidden="true" className={cn(styles.pageCorner, styles.pageCornerBR)} />
      <span aria-hidden="true" className={styles.logLabel}>M.265 / LOG3</span>
      <span aria-hidden="true" className={styles.timecode}>00:00:16</span>

      <div className={styles.container}>
        <header className={styles.sectionHeader}>
          <h2 ref={titleRef} id="aboutme-bio-heading" className={styles.sectionTitle}>{profile.title}</h2>
          <div ref={hudBarRef} aria-hidden="true" className={styles.hudBar}>
            <span data-hud-line className={styles.hudLine} />
            <span data-hud-label className={styles.hudLabel}>{profile.hudLabelLeft}</span>
            <span data-hud-line className={styles.hudLineShort} />
            <span className={styles.reticle}>+</span>
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
                  <h3 className={styles.infoTitle}><span aria-hidden="true" className={styles.titleIcon}>⌖</span>{profile.locationLabel}</h3>
                  <ul className={styles.detailList}>
                    {profile.locationText.split(/, |\. /).filter(Boolean).map((item) => <li key={item}>{item.replace(/\.$/, '')}</li>)}
                  </ul>
                </article>

                <article data-bio-block className={styles.infoBlock}>
                  <h3 className={styles.infoTitle}><span aria-hidden="true" className={styles.titleIcon}>☆</span>{profile.specialtiesLabel}</h3>
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

          <section data-bio-block className={styles.statsBlock} aria-label={profile.statsLabel}>
            {profile.stats.map((stat, index) => (
              <div key={stat.label} className={styles.statItem}>
                <span aria-hidden="true" className={styles.statIcon}>{statIcons[index]}</span>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </section>

          <section data-bio-block className={styles.gearBlock} aria-label={profile.gearLabel}>
            <h3 className={styles.gearHeading}><span />{profile.gearLabel}<span /></h3>
            <ul className={styles.gearList}>
              {profile.gear.map((item, index) => {
                const [label, detail] = item.split(' — ')
                return <li key={item} className={styles.gearItem}><span aria-hidden="true" className={styles.gearIcon}>{gearIcons[index]}</span><span><strong>{label}</strong>{detail && <small>{detail}</small>}</span></li>
              })}
            </ul>
          </section>

          <div data-bio-block className={styles.profileCta}>
            <a href={profile.cta.href} className={styles.profileCtaLink}>{profile.cta.label}<span aria-hidden="true">→</span></a>
          </div>
        </div>
      </div>
    </section>
  )
}
