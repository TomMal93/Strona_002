'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { siteContent } from '@/lib/site-content'
import styles from './ContactHero.module.css'

export default function ContactHero() {
  const sectionRef = useRef<HTMLElement>(null!)
  const contentRef = useRef<HTMLDivElement>(null!)
  const imageRef = useRef<HTMLDivElement>(null!)
  const { hero } = siteContent.contactPage
  const { contact } = siteContent.aboutMe
  const phoneHref = `tel:${contact.phone.replace(/\s/g, '')}`

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      const contentItems = contentRef.current.querySelectorAll('[data-contact-hero-item]')

      gsap.from(contentItems, {
        y: 28,
        autoAlpha: 0,
        duration: 0.75,
        ease: 'power3.out',
        stagger: 0.09,
        delay: 0.2,
      })

      gsap.from(imageRef.current, {
        x: 32,
        autoAlpha: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.3,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      aria-labelledby="contact-heading"
      className={styles.section}
    >
      <div className={styles.ambientGlow} aria-hidden="true" />

      <div className={styles.layout}>
        <div ref={contentRef} className={styles.content}>
          <div data-contact-hero-item className={styles.eyebrowRow}>
            <span className={styles.eyebrowLine} aria-hidden="true" />
            <span className={styles.eyebrow}>{hero.eyebrow}</span>
            <span className={styles.scene}>SCENE 01 / 02</span>
          </div>

          <h1 id="contact-heading" data-contact-hero-item className={styles.title}>
            <span>{hero.titleLine1}</span>
            <span className={styles.titleAccent}>{hero.titleLine2}</span>
          </h1>

          <p data-contact-hero-item className={styles.lead}>{hero.lead}</p>

          <div data-contact-hero-item className={styles.actions}>
            <a href={`mailto:${contact.email}`} className={styles.primaryAction}>
              <span>Napisz wiadomość</span>
              <span aria-hidden="true">↗</span>
            </a>
            <a href={phoneHref} className={styles.secondaryAction}>
              {contact.phone}
            </a>
          </div>

          <dl data-contact-hero-item className={styles.details}>
            <div>
              <dt>Czas odpowiedzi</dt>
              <dd>{hero.availability}</dd>
            </div>
            <div>
              <dt>Obszar działania</dt>
              <dd>{hero.location}</dd>
            </div>
          </dl>
        </div>

        <div ref={imageRef} className={styles.visual}>
          <div className={styles.imageFrame}>
            <Image
              src={hero.image}
              alt={hero.imageAlt}
              fill
              priority
              quality={82}
              sizes="(max-width: 767px) 88vw, (max-width: 1199px) 45vw, 520px"
              className={styles.image}
            />
            <div className={styles.imageOverlay} aria-hidden="true" />
            <span className={`${styles.corner} ${styles.cornerTopLeft}`} aria-hidden="true" />
            <span className={`${styles.corner} ${styles.cornerTopRight}`} aria-hidden="true" />
            <span className={`${styles.corner} ${styles.cornerBottomLeft}`} aria-hidden="true" />
            <span className={`${styles.corner} ${styles.cornerBottomRight}`} aria-hidden="true" />
          </div>

          <div className={styles.visualMeta} aria-hidden="true">
            <span><i /> AVAILABLE FOR PROJECTS</span>
            <span>POLAND / WORLDWIDE</span>
          </div>
        </div>
      </div>

      <div className={styles.scrollCue} aria-hidden="true">
        <span />
        WIĘCEJ
      </div>
    </section>
  )
}
