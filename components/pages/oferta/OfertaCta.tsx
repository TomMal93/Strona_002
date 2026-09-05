'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { siteContent } from '@/lib/site-content'
import { cn } from '@/lib/utils'
import { socialIcons } from '@/components/sections/cta/CtaActions'
import heroStyles from '@/components/sections/Hero.module.css'
import styles from './OfertaCta.module.css'

export default function OfertaCta() {
  const sectionRef = useRef<HTMLElement>(null!)
  const contentRef = useRef<HTMLDivElement>(null!)

  const { title, lead } = siteContent.offerPage.cta
  const {
    phoneLabel, phoneHref,
    social,
  } = siteContent.cta

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    let disposed = false
    let revert: (() => void) | undefined

    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (disposed) return

      gsap.registerPlugin(ScrollTrigger)
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
      revert = () => ctx.revert()
    })

    return () => {
      disposed = true
      revert?.()
    }
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
                  'font-bebas uppercase leading-[0.9] tracking-wide',
                  styles.title,
                )}
              >
                {title}
              </h2>
              <p className={cn('mt-5 whitespace-pre-line font-mono leading-[1.85] tracking-wide text-white/50', styles.lead)}>
                {lead}
              </p>
            </div>

            <div className={styles.actions}>
              <div className={styles.buttonRow}>
                <a href={phoneHref} className={cn(styles.button, styles.buttonPrimary)}>
                  {phoneLabel}
                </a>
                <Link href="/contact" className={cn(styles.button, styles.buttonSecondary)}>
                  Inne formy kontaktu
                </Link>
              </div>

              <nav className={styles.socialRow} aria-label="Media społecznościowe">
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
              </nav>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
