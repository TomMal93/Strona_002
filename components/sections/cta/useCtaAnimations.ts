'use client'

import { useLayoutEffect } from 'react'
import type { RefObject } from 'react'

export type CtaAnimationRefs = {
  sectionRef: RefObject<HTMLElement>
  titleRef: RefObject<HTMLHeadingElement>
  subtitleRef: RefObject<HTMLParagraphElement>
  hudBarRef: RefObject<HTMLDivElement>
  primaryBtnRef: RefObject<HTMLAnchorElement>
  secondaryRowRef: RefObject<HTMLDivElement>
  socialRowRef: RefObject<HTMLDivElement>
  cornerTLRef: RefObject<HTMLSpanElement>
  cornerTRRef: RefObject<HTMLSpanElement>
  cornerBLRef: RefObject<HTMLSpanElement>
  cornerBRRef: RefObject<HTMLSpanElement>
  crosshairTopRef: RefObject<HTMLSpanElement>
  crosshairBottomRef: RefObject<HTMLSpanElement>
  glowRef: RefObject<HTMLDivElement>
}

export function useCtaAnimations(refs: CtaAnimationRefs): void {
  useLayoutEffect(() => {
    let shouldCleanup = false
    let revertContext: (() => void) | undefined

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const allCorners = [
      refs.cornerTLRef,
      refs.cornerTRRef,
      refs.cornerBLRef,
      refs.cornerBRRef,
    ]
    const allCrosshairs = [refs.crosshairTopRef, refs.crosshairBottomRef]

    const setInitialStyles = () => {
      const {
        titleRef, hudBarRef, primaryBtnRef, secondaryRowRef, socialRowRef,
        subtitleRef, glowRef,
      } = refs

      const hudLines = hudBarRef.current
        ? Array.from(hudBarRef.current.querySelectorAll<HTMLElement>('[data-hud-line]'))
        : []
      const hudLabels = hudBarRef.current
        ? Array.from(hudBarRef.current.querySelectorAll<HTMLElement>('[data-hud-label]'))
        : []

      if (prefersReducedMotion) {
        ;[titleRef, subtitleRef, primaryBtnRef, secondaryRowRef, socialRowRef].forEach((ref) => {
          if (ref.current) {
            ref.current.style.opacity = '1'
            ref.current.style.visibility = 'inherit'
            ref.current.style.transform = 'none'
          }
        })
        hudLines.forEach((el) => { el.style.transform = 'scaleX(1)' })
        hudLabels.forEach((el) => {
          el.style.opacity = '1'
          el.style.visibility = 'inherit'
        })
        allCorners.forEach((ref) => {
          if (ref.current) ref.current.style.opacity = '0.5'
        })
        allCrosshairs.forEach((ref) => {
          if (ref.current) ref.current.style.opacity = '0.4'
        })
        if (glowRef.current) {
          glowRef.current.style.opacity = '1'
        }
        return
      }

      // Hidden initial states
      ;[titleRef, subtitleRef, primaryBtnRef, secondaryRowRef].forEach((ref) => {
        if (ref.current) {
          ref.current.style.opacity = '0'
          ref.current.style.visibility = 'hidden'
          ref.current.style.transform = 'translate3d(0, 30px, 0)'
        }
      })
      hudLines.forEach((el) => { el.style.transform = 'scaleX(0)' })
      hudLabels.forEach((el) => {
        el.style.opacity = '0'
        el.style.visibility = 'hidden'
      })
      allCorners.forEach((ref) => {
        if (ref.current) ref.current.style.opacity = '0'
      })
      allCrosshairs.forEach((ref) => {
        if (ref.current) ref.current.style.opacity = '0'
      })
      if (glowRef.current) {
        glowRef.current.style.opacity = '0'
      }
    }

    setInitialStyles()

    const initAnimations = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])

      if (shouldCleanup) return

      gsap.registerPlugin(ScrollTrigger)

      const {
        sectionRef, titleRef, subtitleRef, hudBarRef,
        primaryBtnRef, secondaryRowRef, socialRowRef, glowRef,
      } = refs

      const ctx = gsap.context(() => {
        const hudLines = hudBarRef.current
          ? Array.from(hudBarRef.current.querySelectorAll('[data-hud-line]'))
          : []
        const hudLabels = hudBarRef.current
          ? Array.from(hudBarRef.current.querySelectorAll('[data-hud-label]'))
          : []

        const cornerEls = allCorners
          .map((ref) => ref.current)
          .filter(Boolean) as HTMLElement[]

        const crosshairEls = allCrosshairs
          .map((ref) => ref.current)
          .filter(Boolean) as HTMLElement[]

        if (prefersReducedMotion) {
          if (titleRef.current) gsap.set(titleRef.current, { autoAlpha: 1, y: 0 })
          if (subtitleRef.current) gsap.set(subtitleRef.current, { autoAlpha: 1, y: 0 })
          if (hudLines.length) gsap.set(hudLines, { scaleX: 1 })
          if (hudLabels.length) gsap.set(hudLabels, { autoAlpha: 1 })
          if (primaryBtnRef.current) gsap.set(primaryBtnRef.current, { autoAlpha: 1, y: 0 })
          if (secondaryRowRef.current) gsap.set(secondaryRowRef.current, { autoAlpha: 1, y: 0 })
          if (socialRowRef.current) gsap.set(socialRowRef.current, { autoAlpha: 1, y: 0 })
          if (cornerEls.length) gsap.set(cornerEls, { opacity: 0.5 })
          if (crosshairEls.length) gsap.set(crosshairEls, { opacity: 0.4 })
          if (glowRef.current) gsap.set(glowRef.current, { opacity: 1 })
          return
        }

        // Initial states via GSAP
        if (hudLines.length) gsap.set(hudLines, { scaleX: 0 })
        if (hudLabels.length) gsap.set(hudLabels, { autoAlpha: 0 })
        if (titleRef.current) gsap.set(titleRef.current, { autoAlpha: 0, y: 30 })
        if (subtitleRef.current) gsap.set(subtitleRef.current, { autoAlpha: 0, y: 20 })
        if (primaryBtnRef.current) gsap.set(primaryBtnRef.current, { autoAlpha: 0, y: 24, scale: 0.96 })
        if (secondaryRowRef.current) gsap.set(secondaryRowRef.current, { autoAlpha: 0, y: 16 })
        if (socialRowRef.current) gsap.set(socialRowRef.current, { autoAlpha: 0, y: 12 })
        if (cornerEls.length) gsap.set(cornerEls, { opacity: 0, scale: 0.5 })
        if (crosshairEls.length) gsap.set(crosshairEls, { opacity: 0, scale: 0 })
        if (glowRef.current) gsap.set(glowRef.current, { opacity: 0, scale: 0.8 })

        // Scroll-triggered timeline
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 92%',
            once: true,
          },
        })

        // Phase 0: HUD bar lines
        if (hudLines.length) {
          tl.to(hudLines, {
            scaleX: 1,
            duration: 0.5,
            ease: 'power2.out',
            stagger: 0.025,
          })
        }

        // Phase 1: HUD labels
        if (hudLabels.length) {
          tl.to(
            hudLabels,
            { autoAlpha: 1, duration: 0.3, ease: 'power2.out', stagger: 0.015 },
            '-=0.2',
          )
        }

        // Phase 2: Title
        tl.to(
          titleRef.current,
          { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' },
          '-=0.1',
        )

        // Phase 3: Subtitle
        if (subtitleRef.current) {
          tl.to(
            subtitleRef.current,
            { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out' },
            '-=0.2',
          )
        }

        // Phase 4: Glow fade in
        if (glowRef.current) {
          tl.to(
            glowRef.current,
            { opacity: 1, scale: 1, duration: 0.75, ease: 'power2.out' },
            '-=0.3',
          )
        }

        // Phase 5: Corner marks draw-in
        if (cornerEls.length) {
          tl.to(
            cornerEls,
            {
              opacity: 0.5,
              scale: 1,
              duration: 0.4,
              ease: 'power3.out',
              stagger: 0.015,
              onComplete: () => {
                cornerEls.forEach((el) => {
                  el.style.animationPlayState = 'running'
                })
              },
            },
            '-=0.5',
          )
        }

        // Phase 6: Crosshairs pop in
        if (crosshairEls.length) {
          tl.to(
            crosshairEls,
            {
              opacity: 0.4,
              scale: 1,
              duration: 0.35,
              ease: 'back.out(1.7)',
              stagger: 0.015,
              onComplete: () => {
                crosshairEls.forEach((el) => {
                  el.style.animationPlayState = 'running'
                })
              },
            },
            '-=0.3',
          )
        }

        // Phase 7: Primary CTA — dominant reveal
        if (primaryBtnRef.current) {
          tl.to(
            primaryBtnRef.current,
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.6,
              ease: 'power3.out',
            },
            '-=0.25',
          )
        }

        // Phase 8: Secondary row
        if (secondaryRowRef.current) {
          tl.to(
            secondaryRowRef.current,
            { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out' },
            '-=0.3',
          )
        }

        // Phase 9: Social icons
        if (socialRowRef.current) {
          const socialIconEls = Array.from(
            socialRowRef.current.querySelectorAll<HTMLElement>('a'),
          )
          tl.to(
            socialRowRef.current,
            { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out' },
            '-=0.25',
          )
          if (socialIconEls.length) {
            gsap.set(socialIconEls, { autoAlpha: 0, y: 8 })
            tl.to(
              socialIconEls,
              { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power3.out', stagger: 0.012 },
              '-=0.3',
            )
          }
        }
      }, sectionRef)

      revertContext = () => ctx.revert()
    }

    void initAnimations()

    return () => {
      shouldCleanup = true
      revertContext?.()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
