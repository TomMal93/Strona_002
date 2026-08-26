'use client'

import { useRef } from 'react'
import { siteContent } from '@/lib/site-content'
import styles from './Cta.module.css'
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

const LeafIcon = () => (
  <svg viewBox="0 0 32 32" aria-hidden="true">
    <path d="M27 5C15 5 7 11 7 20c0 3 2 5 5 5 9 0 15-8 15-20Z" />
    <path d="M5 28c4-8 9-12 17-17" />
  </svg>
)

const featureIcons = [CameraIcon, PinIcon, LeafIcon]

export default function Cta() {
  const sectionRef = useRef<HTMLElement>(null!)
  const eyebrowRef = useRef<HTMLParagraphElement>(null!)
  const titleRef = useRef<HTMLHeadingElement>(null!)
  const subtitleRef = useRef<HTMLParagraphElement>(null!)
  const primaryBtnRef = useRef<HTMLAnchorElement>(null!)
  const secondaryLinkRef = useRef<HTMLAnchorElement>(null!)
  const featuresRef = useRef<HTMLDivElement>(null!)

  useCtaAnimations({ sectionRef, eyebrowRef, titleRef, subtitleRef, primaryBtnRef, secondaryLinkRef, featuresRef })

  const { eyebrow, title, subtitle, ctaLabel, ctaHref, secondaryLabel, secondaryHref, features } = siteContent.cta

  return (
    <section ref={sectionRef} id="cta" aria-labelledby="cta-heading" className={styles.section}>
      <div className={styles.background} aria-hidden="true" />
      <div className={styles.grain} aria-hidden="true" />

      <div className={styles.content}>
        <p ref={eyebrowRef} className={styles.eyebrow}>{eyebrow}</p>
        <h2 ref={titleRef} id="cta-heading" className={styles.title}>{title}</h2>
        <p ref={subtitleRef} className={styles.subtitle}>{subtitle}</p>

        <div className={styles.actions}>
          <a ref={primaryBtnRef} href={ctaHref} className={styles.primaryButton}>
            <span>{ctaLabel}</span>
            <span className={styles.buttonArrow} aria-hidden="true">→</span>
          </a>
          <a ref={secondaryLinkRef} href={secondaryHref} className={styles.secondaryLink}>
            {secondaryLabel}<span aria-hidden="true">→</span>
          </a>
        </div>

        <div ref={featuresRef} className={styles.features} aria-label="Najważniejsze informacje">
          {features.map((feature, index) => {
            const Icon = featureIcons[index]
            return (
              <div key={feature.label} className={styles.feature}>
                <Icon />
                <span>{feature.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
