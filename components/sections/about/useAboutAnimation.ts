'use client'

import { useLayoutEffect } from 'react'
import type { RefObject } from 'react'

const ANIMATION = {
  INITIAL_Y: 32,
  DURATION: 0.65,
  EASE: 'power2.out',
  STAGGER: 0.10,
  SCROLL_START: 'top 78%',
} as const

/**
 * GSAP scroll-triggered entrance animation for the About section.
 *
 * Items tagged with [data-about-item] fade in and translate from y:32 → 0
 * with a stagger, triggered when the section enters the viewport.
 * Respects prefers-reduced-motion.
 */
export function useAboutAnimation(sectionRef: RefObject<HTMLElement>) {
  useLayoutEffect(() => {
    let shouldCleanup = false
    let observer: IntersectionObserver | undefined
    let revertContext: (() => void) | undefined

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const initAnimations = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])

      if (shouldCleanup) return

      gsap.registerPlugin(ScrollTrigger)

      const ctx = gsap.context(() => {
        const items = gsap.utils.toArray<HTMLElement>('[data-about-item]')

        if (prefersReducedMotion) {
          gsap.set(items, { autoAlpha: 1, y: 0, clearProps: 'transform' })
          return
        }

        gsap.set(items, { autoAlpha: 0, y: ANIMATION.INITIAL_Y })

        gsap.to(items, {
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

      revertContext = () => ctx.revert()
    }

    if (sectionRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          const hasIntersectingEntry = entries.some((entry) => entry.isIntersecting)
          if (!hasIntersectingEntry) return

          observer?.disconnect()
          void initAnimations()
        },
        {
          root: null,
          threshold: 0,
          rootMargin: '0px 0px -25% 0px',
        },
      )

      observer.observe(sectionRef.current)
    }

    return () => {
      shouldCleanup = true
      observer?.disconnect()
      revertContext?.()
    }
  // Refs are stable objects returned by useRef — they never change between
  // renders, so there are no reactive values to list as dependencies.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
