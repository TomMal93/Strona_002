import { useEffect } from 'react'
import type { HeroRefs } from './types'

/**
 * GSAP cinematic entrance animation for the hero section.
 *
 * Sequence:
 *   0–0.6s   Cinematic reveal  — dark overlay fades, backdrop blur clears, image enters
 *   0.6–1.2s Light sweep       — soft golden band travels left → right
 *   1.0–1.6s Ring activation   — ambient glow pulses, particles appear
 *   1.2–1.8s Text reveal       — eyebrow → vertical line → heading (overshoot) → description
 *   1.8–2.2s UI elements       — CTA / social icons stagger in
 *   2.2s+    Final state       — slow cinematic zoom (1 → 1.04), film grain fades in
 *
 * Desktop only (≥ 768 px). Respects prefers-reduced-motion.
 */
export function useHeroAnimations({
  sectionRef,
  eyebrowRef,
  headingRef,
  underlineRef,
  verticalLineRef,
  descriptionRef,
  ctaRef,
  cinematicOverlayRef,
  blurOverlayRef,
  lightSweepRef,
  filmGrainRef,
  particlesRef,
  ringGlowRef,
  imageRef,
}: HeroRefs) {
  useEffect(() => {
    let shouldCleanup = false
    let revertContext: (() => void) | undefined

    const runAnimation = async () => {
      const { gsap } = await import('gsap')
      if (shouldCleanup) return

      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches
      const isMobileViewport = window.matchMedia('(max-width: 767px)').matches

      const ctx = gsap.context(() => {
        const textTargets = [
          eyebrowRef.current,
          headingRef.current,
          descriptionRef.current,
          ctaRef.current,
        ].filter((el): el is HTMLElement => el !== null)

        const overlays = [
          cinematicOverlayRef.current,
          blurOverlayRef.current,
          lightSweepRef.current,
          filmGrainRef.current,
          particlesRef.current,
          ringGlowRef.current,
        ].filter((el): el is HTMLDivElement => el !== null)

        // ── Reduced motion / mobile: skip to final state immediately ────────
        if (prefersReducedMotion || isMobileViewport) {
          gsap.set(overlays, { opacity: 0, visibility: 'hidden' })
          gsap.set(
            [headingRef.current, descriptionRef.current, ctaRef.current].filter(
              (el): el is HTMLElement => el !== null,
            ),
            { autoAlpha: 1, y: 0 },
          )
          if (eyebrowRef.current)
            gsap.set(eyebrowRef.current, {
              opacity: 0.5,
              visibility: 'visible',
              y: 0,
            })
          if (underlineRef.current) gsap.set(underlineRef.current, { scaleX: 1 })
          if (verticalLineRef.current)
            gsap.set(verticalLineRef.current, { scaleY: 1 })
          if (imageRef.current)
            gsap.set(imageRef.current, { opacity: 1, x: 0, y: 0, scale: 1 })
          return
        }

        // ── Initial states ───────────────────────────────────────────────────
        gsap.set(cinematicOverlayRef.current, { opacity: 0.65 })
        gsap.set(blurOverlayRef.current, { opacity: 1 })
        gsap.set(lightSweepRef.current, { xPercent: -120 })
        gsap.set(filmGrainRef.current, { opacity: 0 })
        gsap.set(particlesRef.current, { opacity: 0 })
        gsap.set(ringGlowRef.current, { opacity: 0, scale: 0.85 })
        gsap.set(textTargets, { autoAlpha: 0, y: 30 })
        if (underlineRef.current) gsap.set(underlineRef.current, { scaleX: 0 })
        if (verticalLineRef.current)
          gsap.set(verticalLineRef.current, { scaleY: 0 })
        if (imageRef.current)
          gsap.set(imageRef.current, { opacity: 0, x: 8, y: 10, scale: 0.97 })

        const tl = gsap.timeline()

        // ── 0–0.6s: Cinematic reveal ─────────────────────────────────────────
        tl.to(
          cinematicOverlayRef.current,
          { opacity: 0, duration: 0.6, ease: 'power2.inOut' },
          0,
        )
        tl.to(
          blurOverlayRef.current,
          { opacity: 0, duration: 0.38, ease: 'power2.in' },
          0,
        )
        if (imageRef.current) {
          tl.to(
            imageRef.current,
            { opacity: 1, x: 0, y: 0, scale: 1, duration: 0.75, ease: 'power2.out' },
            0,
          )
        }

        // ── 0.55–1.2s: Light sweep ───────────────────────────────────────────
        tl.to(
          lightSweepRef.current,
          { xPercent: 120, duration: 0.65, ease: 'power1.inOut' },
          0.55,
        )

        // ── 1.0–1.6s: Ring activation + particles ────────────────────────────
        tl.to(
          ringGlowRef.current,
          { opacity: 0.9, scale: 1.1, duration: 0.32, ease: 'power2.in' },
          1.0,
        )
        tl.to(
          ringGlowRef.current,
          { opacity: 0.22, scale: 1, duration: 0.55, ease: 'power2.out' },
          1.3,
        )
        tl.to(
          particlesRef.current,
          { opacity: 1, duration: 0.4, ease: 'power2.in' },
          1.1,
        )

        // ── 1.2–1.8s: Text reveal ────────────────────────────────────────────
        tl.to(
          eyebrowRef.current,
          { opacity: 0.5, visibility: 'visible', y: 0, duration: 0.5, ease: 'power3.out' },
          1.2,
        )
        if (verticalLineRef.current) {
          tl.to(
            verticalLineRef.current,
            { scaleY: 1, duration: 0.5, ease: 'power2.out' },
            1.28,
          )
        }
        // heading: delikatny ruch z dołu + minimalny overshoot
        tl.to(
          headingRef.current,
          { autoAlpha: 1, y: 0, duration: 0.62, ease: 'back.out(1.2)' },
          1.35,
        )
        tl.to(
          descriptionRef.current,
          { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' },
          1.5,
        )
        if (underlineRef.current) {
          tl.to(
            underlineRef.current,
            { scaleX: 1, duration: 0.55, ease: 'power2.out' },
            1.55,
          )
        }

        // ── 1.8–2.2s: UI elements ────────────────────────────────────────────
        tl.to(
          ctaRef.current,
          { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power3.out' },
          1.8,
        )

        // ── 2.2s+: Final state ───────────────────────────────────────────────
        // Film grain delikatnie pojawia się
        tl.to(
          filmGrainRef.current,
          { opacity: 1, duration: 0.9, ease: 'power2.inOut' },
          2.2,
        )
        // Bardzo powolny cinematic zoom (scale 1 → 1.04)
        if (imageRef.current) {
          tl.to(
            imageRef.current,
            { scale: 1.04, duration: 12, ease: 'none' },
            2.3,
          )
        }
      }, sectionRef)

      revertContext = () => ctx.revert()
    }

    void runAnimation()

    return () => {
      shouldCleanup = true
      revertContext?.()
    }
  // Refs are stable objects returned by useRef — they never change between
  // renders, so there are no reactive values to list as dependencies.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
