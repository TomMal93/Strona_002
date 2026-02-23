'use client'

import { useEffect } from 'react'
import { gsap } from 'gsap'
import type { HeroRefs } from './types'

/**
 * GSAP entrance animation for the hero section.
 *
 * Sequence: eyebrow → heading → description → CTA → image → circles
 * Each element fades in and translates from y:40 → 0 with power3.out easing.
 * Respects prefers-reduced-motion.
 */
export function useHeroAnimations({
  sectionRef,
  eyebrowRef,
  headingRef,
  descriptionRef,
  ctaRef,
  imageRef,
  largeCircleRef,
  smallCircleRef,
}: HeroRefs) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const ctx = gsap.context(() => {
      const allTargets = [
        eyebrowRef.current,
        headingRef.current,
        descriptionRef.current,
        ctaRef.current,
        imageRef.current,
        largeCircleRef.current,
        smallCircleRef.current,
      ].filter(Boolean)

      if (prefersReducedMotion) {
        gsap.set(allTargets, { autoAlpha: 1, y: 0 })
        return
      }

      // Initial state — hidden & shifted down
      gsap.set(allTargets, { autoAlpha: 0, y: 40 })

      const tl = gsap.timeline({ delay: 0.3 })

      // 1. Eyebrow
      tl.to(eyebrowRef.current, {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
      })

      // 2. Heading
      tl.to(
        headingRef.current,
        { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out' },
        '-=0.7',
      )

      // 3. Description
      tl.to(
        descriptionRef.current,
        { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out' },
        '-=0.7',
      )

      // 4. CTA
      tl.to(
        ctaRef.current,
        { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out' },
        '-=0.7',
      )

      // 5. Image
      tl.to(
        imageRef.current,
        { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out' },
        '-=0.7',
      )

      // 6. Circles (may be hidden on mobile via CSS — GSAP handles gracefully)
      const circles = [
        largeCircleRef.current,
        smallCircleRef.current,
      ].filter(Boolean)

      if (circles.length > 0) {
        tl.to(
          circles,
          { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out' },
          '-=0.7',
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [
    sectionRef,
    eyebrowRef,
    headingRef,
    descriptionRef,
    ctaRef,
    imageRef,
    largeCircleRef,
    smallCircleRef,
  ])
}
