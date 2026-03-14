'use client'

import { useLayoutEffect } from 'react'
import type { RefObject } from 'react'

export type AboutAnimationRefs = {
  sectionRef: RefObject<HTMLElement>
  titleRef: RefObject<HTMLHeadingElement>
  titleAccentRef: RefObject<HTMLSpanElement>
  viewfinderRef: RefObject<HTMLDivElement>
  leadRef: RefObject<HTMLParagraphElement>
  descriptionRef: RefObject<HTMLParagraphElement>
  statementRef: RefObject<HTMLDivElement>
  ctaRef: RefObject<HTMLDivElement>
}

/**
 * Scroll-triggered entrance animation for the About section.
 *
 * Title + accent line → viewfinder frame → text → camera params → CTA.
 * Respects prefers-reduced-motion.
 */
export function useAboutAnimations(refs: AboutAnimationRefs): void {
  useLayoutEffect(() => {
    let shouldCleanup = false
    let observer: IntersectionObserver | undefined
    let revertContext: (() => void) | undefined

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const initAnimations = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])

      if (shouldCleanup) return

      gsap.registerPlugin(ScrollTrigger)

      const {
        sectionRef,
        titleRef,
        titleAccentRef,
        viewfinderRef,
        leadRef,
        descriptionRef,
        statementRef,
        ctaRef,
      } = refs

      const ctx = gsap.context(() => {
        const fadeElements = [
          titleRef.current as HTMLElement | null,
          leadRef.current as HTMLElement | null,
          descriptionRef.current as HTMLElement | null,
          statementRef.current as HTMLElement | null,
          ctaRef.current as HTMLElement | null,
        ].filter((el): el is HTMLElement => el !== null)

        const corners = viewfinderRef.current
          ? Array.from(viewfinderRef.current.querySelectorAll('[class*="cornerMark"]'))
          : []

        /* ── Reduced motion: show everything instantly ──────────────── */

        if (prefersReducedMotion) {
          gsap.set(fadeElements, { autoAlpha: 1, y: 0 })
          if (titleAccentRef.current)
            gsap.set(titleAccentRef.current, { scaleX: 1 })
          if (corners.length) gsap.set(corners, { autoAlpha: 1 })
          return
        }

        /* ── Initial states ─────────────────────────────────────────── */

        gsap.set(fadeElements, { autoAlpha: 0, y: 30 })
        if (corners.length) gsap.set(corners, { autoAlpha: 0 })

        if (titleAccentRef.current)
          gsap.set(titleAccentRef.current, { scaleX: 0 })

        /* ── Scroll-triggered timeline ──────────────────────────────── */

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            once: true,
          },
        })

        // Title fades in
        tl.to(titleRef.current, {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
        })

        // Title accent line draws
        if (titleAccentRef.current) {
          tl.to(
            titleAccentRef.current,
            { scaleX: 1, duration: 0.5, ease: 'power2.out' },
            '-=0.3',
          )
        }

        // Viewfinder corner marks appear
        if (corners.length) {
          tl.to(corners, {
            autoAlpha: 1,
            duration: 0.4,
            ease: 'power2.out',
            stagger: 0.06,
          }, '-=0.2')
        }

        // Lead text
        tl.to(
          leadRef.current,
          { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' },
          '-=0.3',
        )

        // Description
        tl.to(
          descriptionRef.current,
          { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' },
          '-=0.35',
        )

        // Statement
        tl.to(
          statementRef.current,
          { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' },
          '-=0.3',
        )

        // CTA
        tl.to(
          ctaRef.current,
          { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' },
          '-=0.3',
        )
      }, sectionRef)

      revertContext = () => ctx.revert()
    }

    if (refs.sectionRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          const hasIntersecting = entries.some((e) => e.isIntersecting)
          if (!hasIntersecting) return
          observer?.disconnect()
          void initAnimations()
        },
        { root: null, threshold: 0, rootMargin: '0px 0px -25% 0px' },
      )
      observer.observe(refs.sectionRef.current)
    }

    return () => {
      shouldCleanup = true
      observer?.disconnect()
      revertContext?.()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
