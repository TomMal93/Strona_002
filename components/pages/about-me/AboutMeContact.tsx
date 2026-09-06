'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { siteContent } from '@/lib/site-content'
import { cn } from '@/lib/utils'
import { socialIcons } from '@/components/sections/cta/CtaActions'
import styles from './AboutMeContact.module.css'
import { useAboutMeContactAnimations } from './useAboutMeContactAnimations'

export default function AboutMeContact() {
  const sectionRef = useRef<HTMLElement>(null!)
  const titleRef = useRef<HTMLHeadingElement>(null!)
  const subtitleRef = useRef<HTMLParagraphElement>(null!)
  const hudBarRef = useRef<HTMLDivElement>(null!)
  const contactPanelRef = useRef<HTMLDivElement>(null!)

  useAboutMeContactAnimations({
    sectionRef,
    titleRef,
    subtitleRef,
    hudBarRef,
    contactPanelRef,
  })

  const { contact } = siteContent.aboutMe
  const phoneHref = `tel:${contact.phone.replace(/\s/g, '')}`

  return (
    <section
      ref={sectionRef}
      aria-labelledby="aboutme-contact-heading"
      className={cn(
        'section-dark-bg bg-anthracite px-6 py-20 sm:py-24 lg:px-20 lg:py-28',
        styles.section,
      )}
    >
      <div className="mx-auto max-w-content">
        <div className={styles.shell}>
          <span aria-hidden="true" className={cn(styles.corner, styles.cornerTL)} />
          <span aria-hidden="true" className={cn(styles.corner, styles.cornerTR)} />
          <span aria-hidden="true" className={cn(styles.corner, styles.cornerBL)} />
          <span aria-hidden="true" className={cn(styles.corner, styles.cornerBR)} />

          <div className={styles.content}>
            <div className={styles.sectionHeader}>
              <h2
                ref={titleRef}
                id="aboutme-contact-heading"
                className={styles.sectionTitle}
              >
                {contact.title}
              </h2>

              <div ref={hudBarRef} aria-hidden="true" className={styles.hudBar}>
                <span data-hud-line className={styles.hudLineLeft} />
                <span data-hud-label className={styles.hudLabelLeft}>
                  {contact.hudLabelLeft}
                </span>
                <span data-hud-line className={styles.hudLineLeft} />
                <span data-hud-line className={styles.hudLineRight} />
                <span data-hud-label className={styles.hudLabelRight}>
                  {contact.hudLabelRight}
                </span>
                <span data-hud-line className={styles.hudLineRight} />
              </div>

              <p ref={subtitleRef} className={styles.subtitle}>
                Masz wydarzenie, historię albo pomysł, który warto pokazać?<br />
                Opowiedz mi o nim.<br />
                Wspólnie ustalimy, jak zamienić go w film z charakterem.
              </p>
            </div>

            <div ref={contactPanelRef} className={styles.contactPanel}>
              <div className={styles.contactInfo} role="group" aria-label="Dane kontaktowe">
                <a href={phoneHref} className={styles.contactItem}>
                  <span className={styles.contactLabel}>Telefon</span>
                  <span className={styles.contactValue}>{contact.phone}</span>
                </a>
                <a href={`mailto:${contact.email}`} className={styles.contactItem}>
                  <span className={styles.contactLabel}>E-mail</span>
                  <span className={styles.contactValue}>{contact.email}</span>
                </a>
              </div>

              <div className={styles.actions}>
                <div className={styles.buttonRow}>
                  <a href={phoneHref} className={cn(styles.button, styles.buttonPrimary)}>
                    {contact.ctaLabel}
                  </a>
                  <Link href="/oferta" className={cn(styles.button, styles.buttonSecondary)}>
                    Sprawdź ofertę
                  </Link>
                </div>

                <nav className={styles.socialRow} aria-label="Media społecznościowe">
                  {contact.socials.map((social) => (
                    <a
                      key={social.platform}
                      href={social.href}
                      className={styles.socialLink}
                      aria-label={social.label}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {socialIcons[social.platform]}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
