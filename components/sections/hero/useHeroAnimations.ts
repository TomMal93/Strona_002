import { useEffect } from 'react'
import { gsap } from 'gsap'
import type { HeroRefs } from './types'

/**
 * GSAP entrance animation for the hero section.
 *
 * Four elements (eyebrow → heading → description → CTA) fade in
 * and translate from y:40 → 0 with a 0.3 s stagger.
 * The hero image (media) is excluded so it renders immediately — important for LCP.
 * Respects prefers-reduced-motion.
 */
export function useHeroAnimations({
  sectionRef,
  eyebrowRef,
  headingRef,
  descriptionRef,
  ctaRef,
}: HeroRefs) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const isMobileViewport = window.matchMedia('(max-width: 767px)').matches

    const ctx = gsap.context(() => {
      const targets = [
        eyebrowRef.current,
        headingRef.current,
        descriptionRef.current,
        ctaRef.current,
      ].filter((el): el is HTMLElement => el !== null)

      if (prefersReducedMotion || isMobileViewport) {
        gsap.set(targets, { autoAlpha: 1, y: 0 })
        return
      }

      gsap.set(targets, { autoAlpha: 0, y: 40 })

      gsap.to(targets, {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.3,
        delay: 0.3,
      })
    }, sectionRef)

    return () => ctx.revert()
  // Refs are stable objects returned by useRef — they never change between
  // renders, so there are no reactive values to list as dependencies.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
