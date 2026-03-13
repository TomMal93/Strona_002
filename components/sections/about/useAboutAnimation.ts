'use client'

import { useLayoutEffect } from 'react'
import type { RefObject } from 'react'

const ANIMATION = {
  INITIAL_Y: 20,
  DURATION: 0.7,
  EASE: 'power3.out',
  STAGGER: 0.12,
  SCROLL_START: 'top 85%',
} as const

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
        const highlights = gsap.utils.toArray<HTMLElement>('[data-about-highlight]')

        if (prefersReducedMotion) {
          gsap.set([...items, ...highlights], { autoAlpha: 1, y: 0, clearProps: 'transform' })
          return
        }

        gsap.set(items, { autoAlpha: 0, y: ANIMATION.INITIAL_Y })
        gsap.set(highlights, { autoAlpha: 0, y: ANIMATION.INITIAL_Y })

        gsap.to(items, {
          autoAlpha: 1,
          y: 0,
          duration: ANIMATION.DURATION,
          ease: ANIMATION.EASE,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: ANIMATION.SCROLL_START,
            once: true,
          },
        })

        gsap.to(highlights, {
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
          rootMargin: '0px 0px -20% 0px',
        },
      )

      observer.observe(sectionRef.current)
    }

    return () => {
      shouldCleanup = true
      observer?.disconnect()
      revertContext?.()
    }
  // Refs are stable objects returned by useRef — they never change between renders.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
