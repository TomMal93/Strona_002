'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { siteContent } from '@/lib/site-content'
import { cn } from '@/lib/utils'
import CtaActions from '@/components/sections/cta/CtaActions'
import CtaShell from '@/components/sections/cta/CtaShell'
import heroStyles from '@/components/sections/Hero.module.css'
import styles from './OfertaCta.module.css'

gsap.registerPlugin(ScrollTrigger)

export default function OfertaCta() {
  const sectionRef = useRef<HTMLElement>(null!)
  const contentRef = useRef<HTMLDivElement>(null!)

  const { title, lead } = siteContent.offerPage.cta
  const {
    ctaLabel, ctaHref, phoneLabel, phoneHref,
    secondaryLabel, social,
  } = siteContent.cta
  const actionsData = {
    ctaLabel, ctaHref, phoneLabel, phoneHref,
    secondaryLabel, secondaryHref: '/#promo', social,
  }

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
      aria-label="Zapraszam do kontaktu"
      className={cn(
        'section-dark-bg bg-anthracite px-6 py-20 sm:py-24 lg:px-20 lg:py-28',
        styles.section,
      )}
    >
      <div ref={contentRef} className="mx-auto max-w-content">
        <CtaShell glow={false}>
          <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
            <h2
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

          <div className="mt-10">
            <CtaActions data={actionsData} />
          </div>
        </CtaShell>
      </div>
    </section>
  )
}
