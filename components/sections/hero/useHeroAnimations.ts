import { useEffect } from 'react'
import { gsap } from 'gsap'
import type { HeroRefs } from './types'

/**
 * GSAP entrance animation for the hero section.
 *
 * Sequence: eyebrow → heading → description → underline (scaleX draw) → CTA.
 * Underline is the separator line below the description — draws left to right.
 * The hero image (media) is excluded so it renders immediately — important for LCP.
 * Respects prefers-reduced-motion.
 */
export function useHeroAnimations({
  sectionRef,
  eyebrowRef,
  headingRef,
  underlineRef,
  descriptionRef,
  ctaRef,
}: HeroRefs) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const isMobileViewport = window.matchMedia('(max-width: 767px)').matches

    const ctx = gsap.context(() => {
      const fadeTargets = [
        eyebrowRef.current,
        headingRef.current,
        descriptionRef.current,
        ctaRef.current,
      ].filter((el): el is HTMLElement => el !== null)

      if (prefersReducedMotion || isMobileViewport) {
        gsap.set(fadeTargets, { autoAlpha: 1, y: 0 })
        if (underlineRef.current) {
          gsap.set(underlineRef.current, { scaleX: 1 })
        }
        return
      }

      gsap.set(fadeTargets, { autoAlpha: 0, y: 40 })

      if (underlineRef.current) {
        gsap.set(underlineRef.current, { scaleX: 0 })
      }

      const tl = gsap.timeline({ delay: 0.3 })

      // eyebrow → heading → description fade + slide
      tl.to([eyebrowRef.current, headingRef.current, descriptionRef.current].filter(Boolean), {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.3,
      })

      // separator line draws from left to right after description
      if (underlineRef.current) {
        tl.to(underlineRef.current, {
          scaleX: 1,
          duration: 0.6,
          ease: 'power2.out',
        }, '-=0.5')
      }

      // CTA fades in last
      tl.to(ctaRef.current, {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
      }, '-=0.3')
    }, sectionRef)

    return () => ctx.revert()
  // Refs are stable objects returned by useRef — they never change between
  // renders, so there are no reactive values to list as dependencies.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
