'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { siteContent } from '@/lib/site-content'
import { socialIcons } from '@/components/sections/cta/CtaActions'
import { cn } from '@/lib/utils'
import styles from './ContactHero.module.css'

const contactItems = [
  { icon: 'mail', label: 'E-mail' },
  { icon: 'phone', label: 'Telefon' },
  { icon: 'location', label: 'Lokalizacja' },
] as const

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

function ContactIcon({ type }: { type: (typeof contactItems)[number]['icon'] }) {
  if (type === 'mail') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    )
  }

  if (type === 'phone') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

export default function ContactHero() {
  const sectionRef = useRef<HTMLElement>(null!)
  const contentRef = useRef<HTMLDivElement>(null!)
  const monitorRef = useRef<HTMLElement>(null!)
  const { features } = siteContent.cta
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

            <div className={styles.contactFrame}>
              <p data-contact-hero-item className={styles.lead}>{hero.lead}</p>

              <div data-contact-hero-item className={styles.contactPanel}>
                <div className={styles.contactActionsRow}>
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
                          aria-label={`${item.label}: ${contactValues[index]}`}
                          target={isExternal ? '_blank' : undefined}
                          rel={isExternal ? 'noopener noreferrer' : undefined}
                        >
                          <span className={styles.contactIcon}>
                            <ContactIcon type={item.icon} />
                          </span>
                          <span className={styles.contactValue}>
                            {contactValues[index]}
                          </span>
                        </a>
                      )
                    })}
                  </div>

                  <aside className={styles.stepsPanel} aria-label="Etapy rozpoczęcia współpracy">
                    <ol className={styles.stepsList}>
                      <li>
                        <span>01</span>
                        <p><b>Opowiedz</b><small>Napisz, czego potrzebujesz.</small></p>
                      </li>
                      <li>
                        <span>02</span>
                        <p><b>Ustalamy kierunek</b><small>Dobieramy formę i termin.</small></p>
                      </li>
                      <li>
                        <span>03</span>
                        <p><b>Realizujemy</b><small>Zamieniamy pomysł w film.</small></p>
                      </li>
                    </ol>
                  </aside>
                </div>

                <div className={styles.features} aria-label="Najważniejsze informacje">
                  {features.map((feature, index) => {
                    const Icon = featureIcons[index]
                    return (
                      <div key={feature.label} className={styles.feature}>
                        <Icon />
                        <strong>{feature.label}</strong>
                        <span>{featureDetails[index]}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          <figure ref={monitorRef} className={styles.monitor}>
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
