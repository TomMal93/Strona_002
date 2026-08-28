'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { siteContent } from '@/lib/site-content'
import { cn } from '@/lib/utils'
import { socialIcons } from '@/components/sections/cta/CtaActions'
import heroStyles from '@/components/sections/Hero.module.css'
import styles from './OfertaCta.module.css'

gsap.registerPlugin(ScrollTrigger)

export default function OfertaCta() {
  const sectionRef = useRef<HTMLElement>(null!)
  const contentRef = useRef<HTMLDivElement>(null!)

  const { title, lead, label, href } = siteContent.offerPage.cta
  const {
    phoneLabel, phoneHref,
    secondaryLabel, social,
  } = siteContent.cta

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      gsap.from(contentRef.current, {
        y: 28,
        autoAlpha: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      aria-labelledby="oferta-cta-heading"
      className={cn(
        'section-dark-bg bg-anthracite px-6 py-20 sm:py-24 lg:px-20 lg:py-28',
        styles.section,
      )}
    >
      <div ref={contentRef} className="mx-auto max-w-content">
        <div className={styles.shell}>
          <span aria-hidden="true" className={cn(styles.corner, styles.cornerTL)} />
          <span aria-hidden="true" className={cn(styles.corner, styles.cornerTR)} />
          <span aria-hidden="true" className={cn(styles.corner, styles.cornerBL)} />
          <span aria-hidden="true" className={cn(styles.corner, styles.cornerBR)} />

          <div className={styles.content}>
            <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
              <h2
                id="oferta-cta-heading"
                className={cn(
                  heroStyles.gradientTextPrimary,
                  'font-bebas text-5xl uppercase leading-[0.9] tracking-wide sm:text-6xl',
                )}
              >
                {title}
              </h2>
              <p className="mt-5 whitespace-pre-line font-mono text-[0.95rem] leading-[1.85] tracking-wide text-white/50">
                {lead}
              </p>
            </div>

            <div className={styles.actions}>
              <div className={styles.buttonRow}>
                <a href={href} className={cn(styles.button, styles.buttonPrimary)}>
                  {label}
                </a>
                <a href={phoneHref} className={cn(styles.button, styles.buttonSecondary)}>
                  {phoneLabel}
                </a>
              </div>

              <a href="/#promo" className={styles.portfolioLink}>
                {secondaryLabel}
              </a>

              <div className={styles.socialRow} aria-label="Media społecznościowe">
                {social.map(({ platform, href: socialHref }) => (
                  <a
                    key={platform}
                    href={socialHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={platform}
                    className={styles.socialLink}
                  >
                    {socialIcons[platform]}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
