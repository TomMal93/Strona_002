'use client'

import { useLayoutEffect } from 'react'
import type { RefObject } from 'react'

type AboutRefs = {
  sectionRef: RefObject<HTMLElement | null>
  imageWrapRef: RefObject<HTMLDivElement | null>
  textBlockRef: RefObject<HTMLDivElement | null>
  counterRefs: RefObject<(HTMLSpanElement | null)[]>
}

const SCROLL_START = 'top 70%'

/**
 * GSAP scroll-triggered animations for the About section.
 *
 * Sequence (on scroll):
 *   1. Image reveal — clip-path curtain from right (inset right 100% → 0%)
 *   2. Text block   — fade-in + translate from right (delay 0.4s)
 *   3. Counters     — count from 0 to target value (delay 0.6s)
 *
 * Respects prefers-reduced-motion: skips all animations, sets final state immediately.
 */
export function useAboutAnimations({ sectionRef, imageWrapRef, textBlockRef, counterRefs }: AboutRefs) {
  useLayoutEffect(() => {
    let shouldCleanup = false
    let observer: IntersectionObserver | undefined
    let revertContext: (() => void) | undefined

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Hide elements immediately (before paint) to avoid flash before GSAP loads.
    if (!prefersReducedMotion) {
      if (imageWrapRef.current) {
        imageWrapRef.current.style.clipPath = 'inset(0 100% 0 0)'
      }
      if (textBlockRef.current) {
        textBlockRef.current.style.opacity = '0'
        textBlockRef.current.style.visibility = 'hidden'
        textBlockRef.current.style.transform = 'translate3d(60px, 0, 0)'
      }
    }

    const initAnimations = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])

      if (shouldCleanup) return

      gsap.registerPlugin(ScrollTrigger)

      const ctx = gsap.context(() => {
        const counterEls = (counterRefs.current ?? []).filter(
          (el): el is HTMLSpanElement => el !== null,
        )

        if (prefersReducedMotion) {
          // Snap counters to target values immediately
          counterEls.forEach((el) => {
            el.textContent = el.dataset.target ?? '0'
          })
          return
        }

        const trigger = { trigger: sectionRef.current, start: SCROLL_START, once: true }

        // 1. Image clip-path reveal
        if (imageWrapRef.current) {
          gsap.to(imageWrapRef.current, {
            clipPath: 'inset(0 0% 0 0)',
            duration: 1.2,
            ease: 'power3.inOut',
            scrollTrigger: trigger,
          })
        }

        // 2. Text block fade-in + slide from right
        if (textBlockRef.current) {
          gsap.to(textBlockRef.current, {
            autoAlpha: 1,
            x: 0,
            duration: 1.0,
            ease: 'power3.out',
            delay: 0.4,
            scrollTrigger: trigger,
          })
        }

        // 3. Counter count-up
        counterEls.forEach((el) => {
          const target = Number(el.dataset.target ?? '0')
          const obj = { value: 0 }
          gsap.to(obj, {
            value: target,
            duration: 1.5,
            ease: 'power2.out',
            delay: 0.6,
            onUpdate: () => {
              el.textContent = Math.round(obj.value).toString()
            },
            scrollTrigger: trigger,
          })
        })
      }, sectionRef)

      revertContext = () => ctx.revert()
    }

    if (sectionRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          const isVisible = entries.some((e) => e.isIntersecting)
          if (!isVisible) return
          observer?.disconnect()
          void initAnimations()
        },
        { root: null, threshold: 0, rootMargin: '0px 0px -20% 0px' },
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
