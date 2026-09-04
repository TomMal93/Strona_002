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
  { icon: 'whatsapp', label: 'WhatsApp' },
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

function MonitorFigure({
  className,
  forwardRef,
  priority = false,
}: {
  className?: string
  forwardRef?: React.Ref<HTMLElement>
  priority?: boolean
}) {
  const { hero } = siteContent.contactPage
  return (
    <figure ref={forwardRef} className={cn(styles.monitor, className)}>
      <div className={styles.monitorBar} aria-hidden="true">
        <span>H.265 / LOG3</span>
        <span>00:00:00:00</span>
      </div>
      <div className={styles.monitorImage}>
        <Image
          src={hero.image}
          alt={hero.imageAlt}
          fill
          priority={priority}
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
  )
}

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
      <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
      <path d="M8.5 9.5c.3-.6.6-.7 1.1-.7h.6c.3 0 .6.2.7.5l.8 2c.1.3.1.6-.1.8l-.5.6c-.2.2-.2.4-.1.6.5.9 1.3 1.7 2.2 2.2.2.1.4.1.6-.1l.6-.5c.2-.2.5-.2.8-.1l2 .8c.3.1.5.4.5.7v.6c0 .5-.1.8-.7 1.1-1 .5-2.6.4-5.1-1.2-2.5-1.6-3.8-3.7-4.1-5.1-.2-.8.1-1.3.6-1.6z" />
    </svg>
  )
}

export default function ContactHero() {
  const sectionRef = useRef<HTMLElement>(null!)
  const contentRef = useRef<HTMLDivElement>(null!)
  const monitorRef = useRef<HTMLElement>(null!)
  const bottomStripRef = useRef<HTMLDivElement>(null!)
  const { features } = siteContent.cta
  const { hero } = siteContent.contactPage
  const { contact } = siteContent.aboutMe
  const phoneHref = `tel:${contact.phone.replace(/\s/g, '')}`
  const emailHref = `mailto:${contact.email}?subject=${encodeURIComponent('Zapytanie ofertowe')}`
  const whatsappHref = `https://wa.me/${contact.phone.replace(/\D/g, '')}?text=${encodeURIComponent('Dzień dobry, chciałbym zapytać o ofertę.')}`
  const contactValues = [contact.email, contact.phone, 'WhatsApp']
  const visibleSocials = siteContent.cta.social.filter(({ platform }) => (
    platform === 'instagram' || platform === 'facebook' || platform === 'youtube'
  ))

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      const title = contentRef.current.querySelector('[data-contact-title]')
      const frame = contentRef.current.querySelector('[data-contact-frame]')
      const lead = contentRef.current.querySelector('[data-contact-lead]')
      const panel = contentRef.current.querySelector('[data-contact-panel]')
      const featureItems = contentRef.current.querySelectorAll('[data-contact-feature]')
      const strip = bottomStripRef.current
      const stripChildren = strip ? Array.from(strip.children) : []

      // Initial hidden states
      const shells = [title, frame, strip].filter(Boolean) as Element[]
      gsap.set(shells, { autoAlpha: 0, y: 24 })

      const innerContent = [lead, panel, ...Array.from(featureItems)].filter(Boolean) as Element[]
      gsap.set(innerContent, { autoAlpha: 0, y: 16 })
      gsap.set(stripChildren, { autoAlpha: 0, y: 10 })
      if (monitorRef.current) gsap.set(monitorRef.current, { autoAlpha: 0, x: 28 })

      const tl = gsap.timeline({ delay: 0.15 })

      // Beat 1 — header, frame, bottom strip
      tl.to(shells, {
        autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out',
      })

      // Beat 2 — text, buttons, benefits, bottom strip content, image
      tl.to(innerContent, {
        autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out',
      }, '-=0.15')

      if (stripChildren.length) {
        tl.to(stripChildren, {
          autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out',
        }, '<')
      }

      if (monitorRef.current) {
        tl.to(monitorRef.current, {
          autoAlpha: 1, x: 0, duration: 0.8, ease: 'power3.out',
        }, '<')
      }
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
            <h1 id="contact-heading" data-contact-title className={styles.title}>
              <span>{hero.titleLine1}</span>
              <span>{hero.titleLine2}</span>
            </h1>

            <div data-contact-frame className={styles.contactFrame}>
              <div className={styles.monitorMobileWrapper}>
                <MonitorFigure priority />
              </div>

              <p data-contact-lead className={styles.lead}>{hero.lead}</p>

              <div data-contact-panel className={styles.contactPanel}>
                <div className={styles.contactActionsRow}>
                  <div className={styles.contactGrid}>
                    {contactItems.map((item, index) => {
                      const href = index === 0
                        ? emailHref
                        : index === 1
                          ? phoneHref
                          : whatsappHref
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
                      <div key={feature.label} data-contact-feature className={styles.feature}>
                        <Icon />
                        <strong>{feature.label}</strong>
                        <span className={styles.featureDetail}>{featureDetails[index]}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          <MonitorFigure
            forwardRef={monitorRef}
            className={styles.monitorDesktop}
          />
        </div>

        <div ref={bottomStripRef} className={styles.bottomStrip}>
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
