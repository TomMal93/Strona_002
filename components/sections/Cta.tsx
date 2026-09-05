'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { siteContent } from '@/lib/site-content'
import styles from './Cta.module.css'
import heroStyles from './Hero.module.css'
import { socialIcons } from './cta/CtaActions'
import { useCtaAnimations } from './cta/useCtaAnimations'

const CameraIcon = () => (
  <svg viewBox="0 0 32 32" aria-hidden="true">
    <path d="M4.5 10.5h5l2.2-3h8.6l2.2 3h5a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-23a2 2 0 0 1-2-2v-12a2 2 0 0 1 2-2Z" />
    <circle cx="16" cy="18" r="5.5" />
  </svg>
)

const PinIcon = () => (
  <svg viewBox="0 0 32 32" aria-hidden="true">
    <path d="M25 13.5c0 7-9 14-9 14s-9-7-9-14a9 9 0 1 1 18 0Z" />
    <circle cx="16" cy="13.5" r="3" />
  </svg>
)

const ClapperIcon = () => (
  <svg viewBox="0 0 32 32" aria-hidden="true">
    <path d="M5 12h22v15H5zM5 12l2-7 21-3-2 7-21 3Z" />
    <path d="m10 5 3 5m4-7 3 5m4-6 3 5M11 12v15" />
  </svg>
)

const featureIcons = [CameraIcon, PinIcon, ClapperIcon]
const featureDetails = ['Od ujęć po montaż', 'Dojadę, gdzie trzeba', 'Emocje, które zostają']

const stories = [
  { className: styles.storyWedding, src: '/images/cta/wedding-story.webp', label: 'Miłość / Ślub' },
  { className: styles.storyEvent, src: '/images/cta/event-story.webp', label: 'Wydarzenia / Eventy' },
  { className: styles.storyMusic, src: '/images/cta/music-story.webp', label: 'Muzyka / Teledyski' },
  { className: styles.storyBrand, src: '/images/cta/brand-story.webp', label: 'Marka / Komercja' },
]

const formatPhoneNumber = (phoneHref: string): string => {
  const number = phoneHref.replace(/^tel:/, '')
  return number.replace(/^(\+48)(\d{3})(\d{3})(\d{3})$/, '$1 $2 $3 $4')
}

export default function Cta() {
  const sectionRef = useRef<HTMLElement>(null!)
  const titleRef = useRef<HTMLHeadingElement>(null!)
  const hudBarRef = useRef<HTMLDivElement>(null!)
  const subtitleRef = useRef<HTMLParagraphElement>(null!)
  const primaryBtnRef = useRef<HTMLAnchorElement>(null!)
  const secondaryLinkRef = useRef<HTMLAnchorElement>(null!)
  const featuresRef = useRef<HTMLDivElement>(null!)
  const socialRef = useRef<HTMLDivElement>(null!)
  const mosaicRef = useRef<HTMLDivElement>(null!)

  useCtaAnimations({
    sectionRef,
    titleRef,
    hudBarRef,
    subtitleRef,
    primaryBtnRef,
    secondaryLinkRef,
    featuresRef,
    socialRef,
    mosaicRef,
  })

  const { title, subtitle, hudLabelLeft, hudLabelRight, phoneLabel, phoneHref, features, social } = siteContent.cta
  const phoneNumber = formatPhoneNumber(phoneHref)

  return (
    <section
      ref={sectionRef}
      id="cta"
      aria-labelledby="cta-heading"
      className={`${styles.section} section-dark-bg`}
    >
      <div className={styles.layout}>
        <div className={styles.content}>
          <div className={styles.sectionHeader}>
            <h2 ref={titleRef} id="cta-heading" className={styles.title}>
              {title.split('\n').map((line) => (
                <span key={line} className={styles.titleLine}>{line}</span>
              ))}
            </h2>
            <div ref={hudBarRef} aria-hidden="true" className={styles.hudBar}>
              <span data-hud-line className={styles.hudLineLeft} />
              <span data-hud-label className={styles.hudLabelLeft}>{hudLabelLeft}</span>
              <span data-hud-line className={styles.hudLineLeft} />
              <span data-hud-line className={styles.hudLineRight} />
              <span data-hud-label className={styles.hudLabelRight}>{hudLabelRight}</span>
              <span data-hud-line className={styles.hudLineRight} />
            </div>
          </div>

          <div className={styles.ctaPanel}>
            <p ref={subtitleRef} className={`${styles.subtitle} section-subtitle-responsive`}>{subtitle}</p>

            <div ref={featuresRef} className={styles.features} role="list" aria-label="Najważniejsze informacje">
              {features.map((feature, index) => {
                const Icon = featureIcons[index]
                return (
                  <div key={feature.label} className={styles.feature} role="listitem">
                    <Icon />
                    <strong>{feature.label}</strong>
                    <span>{featureDetails[index]}</span>
                  </div>
                )
              })}
            </div>

            <div className={styles.actionGroup}>
              <div className={styles.actions}>
                <a
                  ref={primaryBtnRef}
                  href={phoneHref}
                  className={`${heroStyles.ctaButton} ${heroStyles.ctaButtonPrimary} ${styles.actionButton} ${styles.phoneButton}`}
                >
                  <span>{phoneLabel}</span>
                  <span className={styles.phoneNumber}>{phoneNumber}</span>
                </a>
                <Link
                  ref={secondaryLinkRef}
                  href="/oferta"
                  className={`${heroStyles.ctaButton} ${heroStyles.ctaButtonSecondary} ${styles.actionButton}`}
                >
                  Oferta
                </Link>
              </div>

              <nav ref={socialRef} className={styles.socialRow} aria-label="Media społecznościowe">
                {social.map(({ platform, href }) => (
                  <a
                    key={platform}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={platform}
                    className={styles.socialLink}
                  >
                    {socialIcons[platform]}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>

        <div ref={mosaicRef} className={styles.mosaic} aria-hidden="true">
          {stories.map((story) => (
            <figure key={story.label} className={`${styles.story} ${story.className}`}>
              <Image src={story.src} alt="" fill sizes="(min-width: 900px) 50vw, 100vw" />
              <figcaption>{story.label}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
