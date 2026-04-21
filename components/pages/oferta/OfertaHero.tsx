'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { siteContent } from '@/lib/site-content'
import { cn } from '@/lib/utils'
import styles from './OfertaHero.module.css'
import heroStyles from '@/components/sections/Hero.module.css'
import servicesStyles from '@/components/sections/Services.module.css'

export default function OfertaHero() {
  const sectionRef = useRef<HTMLElement>(null!)
  const titleRef = useRef<HTMLHeadingElement>(null!)
  const hudBarRef = useRef<HTMLDivElement>(null!)
  const leadRef = useRef<HTMLParagraphElement>(null!)

  const { eyebrow, title, lead } = siteContent.offerPage.hero

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      const hudLines = hudBarRef.current?.querySelectorAll<HTMLElement>('[data-hud-line]') ?? []
      const hudLabels = hudBarRef.current?.querySelectorAll<HTMLElement>('[data-hud-label]') ?? []

      gsap.set([titleRef.current, leadRef.current], { autoAlpha: 0, y: 28 })
      if (hudLines.length) gsap.set(hudLines, { scaleX: 0 })
      if (hudLabels.length) gsap.set(hudLabels, { autoAlpha: 0, y: 8 })

      const tl = gsap.timeline({ delay: 0.15 })

      if (hudLines.length) {
        tl.to(hudLines, {
          scaleX: 1,
          duration: 0.5,
          ease: 'power2.out',
          stagger: 0.05,
        })
      }
      if (hudLabels.length) {
        tl.to(
          hudLabels,
          { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.out', stagger: 0.06 },
          '-=0.18',
        )
      }
      tl.to(
        titleRef.current,
        { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' },
        '-=0.1',
      )
      tl.to(
        leadRef.current,
        { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        '-=0.3',
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      aria-labelledby="oferta-heading"
      className={cn(
        'section-dark-bg bg-anthracite px-6 pt-32 pb-20 sm:pt-36 sm:pb-24 lg:px-20 lg:pt-40 lg:pb-28',
        styles.heroSection,
      )}
    >
      <div
        className={cn(
          'mx-auto flex max-w-3xl flex-col items-center text-center',
          servicesStyles.sectionHeaderShell,
        )}
      >
        <h1
          ref={titleRef}
          id="oferta-heading"
          className={cn(
            heroStyles.gradientTextPrimary,
            'text-center font-bebas text-6xl uppercase leading-[0.9] tracking-wide sm:text-7xl lg:text-8xl',
          )}
        >
          {title}
        </h1>

        <div ref={hudBarRef} aria-hidden="true" className={servicesStyles.hudBar}>
          <span data-hud-line="left" className={servicesStyles.hudLineLeft} />
          <span data-hud-line="right" className={servicesStyles.hudLineRight} />
        </div>

        <p
          ref={leadRef}
          className={cn(
            'mt-5 whitespace-pre-line font-mono text-[0.95rem] leading-[1.85] tracking-wide text-white/50',
            styles.lead,
          )}
        >
          {lead}
        </p>
      </div>
    </section>
  )
}
