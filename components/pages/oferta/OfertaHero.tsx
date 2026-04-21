'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { siteContent } from '@/lib/site-content'
import { cn } from '@/lib/utils'
import styles from './OfertaHero.module.css'

export default function OfertaHero() {
  const sectionRef = useRef<HTMLElement>(null!)
  const eyebrowRef = useRef<HTMLParagraphElement>(null!)
  const titleRef = useRef<HTMLHeadingElement>(null!)
  const leadRef = useRef<HTMLParagraphElement>(null!)

  const { eyebrow, title, lead } = siteContent.offerPage.hero

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      gsap.from([eyebrowRef.current, titleRef.current, leadRef.current], {
        y: 28,
        autoAlpha: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.12,
        delay: 0.15,
      })
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
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <p ref={eyebrowRef} className={cn('ui-overline text-khaki/90', styles.eyebrow)}>
          {eyebrow}
        </p>
        <h1
          ref={titleRef}
          id="oferta-heading"
          className={cn(
            'mt-4 font-bebas text-5xl uppercase leading-[0.9] tracking-wide text-warm-white sm:text-6xl',
            styles.title,
          )}
        >
          {title}
        </h1>
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
