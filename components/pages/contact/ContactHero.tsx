'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { siteContent } from '@/lib/site-content'
import { socialIcons } from '@/components/sections/cta/CtaActions'
import { cn } from '@/lib/utils'
import heroStyles from '@/components/sections/Hero.module.css'
import styles from './ContactHero.module.css'

const contactItems = [
  { icon: 'mail', label: 'E-mail' },
  { icon: 'phone', label: 'Telefon' },
  { icon: 'location', label: 'Lokalizacja' },
] as const

const benefits = [
  { icon: '◴', lines: ['Szybka', 'odpowiedź'] },
  { icon: '▱', lines: ['Konkretna', 'rozmowa'] },
  { icon: '▰', lines: ['Pomysł →', 'realizacja'] },
] as const

function ContactIcon({ type }: { type: (typeof contactItems)[number]['icon'] }) {
  if (type === 'mail') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4.5 6.5h15v11h-15z" />
        <path d="m5.2 7.3 6.8 5.4 6.8-5.4" />
      </svg>
    )
  }

  if (type === 'phone') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M8.1 4.5 10 8.2 8.4 9.8c1 2.1 2.7 3.8 4.8 4.8l1.6-1.6 3.7 1.9-.4 3c-.1.9-.9 1.6-1.8 1.6A12.8 12.8 0 0 1 4.5 7.7c0-.9.7-1.7 1.6-1.8l2-.4Z" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 21s6-5.4 6-11a6 6 0 1 0-12 0c0 5.6 6 11 6 11Z" />
      <circle cx="12" cy="10" r="2.2" />
    </svg>
  )
}

export default function ContactHero() {
  const sectionRef = useRef<HTMLElement>(null!)
  const contentRef = useRef<HTMLDivElement>(null!)
  const monitorRef = useRef<HTMLElement>(null!)
  const { hero } = siteContent.contactPage
  const { contact } = siteContent.aboutMe
  const phoneHref = `tel:${contact.phone.replace(/\s/g, '')}`
  const contactValues = [contact.email, contact.phone, hero.location]
  const visibleSocials = siteContent.cta.social.filter(({ platform }) => (
    platform === 'instagram' || platform === 'facebook' || platform === 'youtube'
  ))

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      const contentItems = contentRef.current.querySelectorAll('[data-contact-hero-item]')

      gsap.from(contentItems, {
        y: 24,
        autoAlpha: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.08,
        delay: 0.18,
      })

      gsap.from(monitorRef.current, {
        x: 28,
        autoAlpha: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.28,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      aria-labelledby="contact-heading"
      className={cn('section-dark-bg', styles.section)}
    >
      <div className={styles.shell}>
        <div className={styles.mainGrid}>
          <div ref={contentRef} className={styles.content}>
            <h1 id="contact-heading" data-contact-hero-item className={styles.title}>
              <span>{hero.titleLine1}</span>
              <span>{hero.titleLine2}</span>
            </h1>

            <p data-contact-hero-item className={styles.lead}>{hero.lead}</p>

            <div data-contact-hero-item className={styles.contactPanel}>
              <div className={styles.contactGrid}>
                {contactItems.map((item, index) => {
                  const href = index === 0
                    ? `mailto:${contact.email}`
                    : index === 1
                      ? phoneHref
                      : 'https://www.google.com/maps/search/?api=1&query=Polska'
                  const isExternal = index === 2

                  return (
                    <a
                      key={item.label}
                      href={href}
                      className={styles.contactItem}
                      target={isExternal ? '_blank' : undefined}
                      rel={isExternal ? 'noopener noreferrer' : undefined}
                    >
                      <span className={styles.contactIcon}>
                        <ContactIcon type={item.icon} />
                      </span>
                      <span className={styles.contactItemCopy}>
                        <strong>{item.label}</strong>
                        <small>{contactValues[index]}</small>
                      </span>
                    </a>
                  )
                })}
              </div>

              <div className={styles.benefits}>
                {benefits.map((benefit, index) => (
                  <div key={benefit.lines[0]} className={styles.benefit}>
                    <span className={styles.benefitIcon} aria-hidden="true">{benefit.icon}</span>
                    <span>{benefit.lines[0]}<br />{benefit.lines[1]}</span>
                    {index < benefits.length - 1 ? <i aria-hidden="true" /> : null}
                  </div>
                ))}
              </div>
            </div>

            <a
              data-contact-hero-item
              href={`mailto:${contact.email}`}
              className={cn(heroStyles.ctaButton, heroStyles.ctaButtonPrimary, styles.primaryAction)}
            >
              <span>Zapytaj o termin</span>
              <span aria-hidden="true">→</span>
            </a>
          </div>

          <figure ref={monitorRef} className={styles.monitor}>
            <span className={`${styles.monitorCorner} ${styles.monitorCornerTL}`} aria-hidden="true" />
            <span className={`${styles.monitorCorner} ${styles.monitorCornerTR}`} aria-hidden="true" />
            <span className={`${styles.monitorCorner} ${styles.monitorCornerBL}`} aria-hidden="true" />
            <span className={`${styles.monitorCorner} ${styles.monitorCornerBR}`} aria-hidden="true" />

            <div className={styles.monitorBar} aria-hidden="true">
              <span>H.265 / LOG3</span>
              <span>00:00:00:00</span>
            </div>
            <div className={styles.monitorImage}>
              <Image
                src={hero.image}
                alt={hero.imageAlt}
                fill
                priority
                quality={88}
                sizes="(max-width: 767px) 94vw, (max-width: 1199px) 52vw, 720px"
              />
              <span className={styles.monitorShade} aria-hidden="true" />
            </div>
            <figcaption className={styles.monitorBar}>
              <span>Real people. Real stories.</span>
              <span>4K / 25FPS</span>
            </figcaption>
          </figure>
        </div>

        <div className={styles.bottomStrip}>
          <p>Od pierwszej wiadomości<br />do gotowego filmu.</p>
          <span className={styles.bottomDivider} aria-hidden="true" />
          <small>Dobre historie<br />zaczynają się od rozmowy.</small>
          <nav aria-label="Media społecznościowe" className={styles.socials}>
            {visibleSocials.map(({ platform, href }) => (
              <a key={platform} href={href} target="_blank" rel="noopener noreferrer">
                <span aria-hidden="true">{socialIcons[platform]}</span>
                {platform}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </section>
  )
}
