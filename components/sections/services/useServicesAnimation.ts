'use client'

import { useEffect } from 'react'
import type { RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const ANIMATION = {
  INITIAL_Y: 40,
  DURATION: 0.7,
  EASE: 'power2.out',
  STAGGER: 0.08,
  SCROLL_START: 'top 75%',
} as const

/**
 * GSAP scroll-triggered entrance animation for the Services section cards.
 *
 * Cards tagged with [data-service-card] fade in and translate from y:40 → 0
 * with a stagger, triggered when the section enters the viewport.
 * Respects prefers-reduced-motion.
 */
export function useServicesAnimation(sectionRef: RefObject<HTMLElement>) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('[data-service-card]')

      if (prefersReducedMotion) {
        gsap.set(cards, { autoAlpha: 1, y: 0 })
        return
      }

      gsap.set(cards, { autoAlpha: 0, y: ANIMATION.INITIAL_Y })
      gsap.to(cards, {
        autoAlpha: 1,
        y: 0,
        duration: ANIMATION.DURATION,
        ease: ANIMATION.EASE,
        stagger: ANIMATION.STAGGER,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: ANIMATION.SCROLL_START,
          once: true,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  // Refs are stable objects returned by useRef — they never change between
  // renders, so there are no reactive values to list as dependencies.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
