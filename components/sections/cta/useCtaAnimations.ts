'use client'

import { useLayoutEffect } from 'react'
import type { RefObject } from 'react'

export type CtaAnimationRefs = {
  sectionRef: RefObject<HTMLElement>
  titleRef: RefObject<HTMLHeadingElement>
  subtitleRef: RefObject<HTMLParagraphElement>
  hudBarRef: RefObject<HTMLDivElement>
  headlineRef: RefObject<HTMLParagraphElement>
  descRef: RefObject<HTMLParagraphElement>
  buttonsRef: RefObject<HTMLDivElement>
}

export function useCtaAnimations(refs: CtaAnimationRefs): void {
  useLayoutEffect(() => {
    let shouldCleanup = false
    let observer: IntersectionObserver | undefined
    let revertContext: (() => void) | undefined

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const setInitialStyles = () => {
      const { titleRef, hudBarRef, headlineRef, descRef, buttonsRef } = refs

      const hudLines = hudBarRef.current
        ? Array.from(hudBarRef.current.querySelectorAll<HTMLElement>('[data-hud-line]'))
        : []
      const hudLabels = hudBarRef.current
        ? Array.from(hudBarRef.current.querySelectorAll<HTMLElement>('[data-hud-label]'))
        : []

      if (prefersReducedMotion) {
        if (titleRef.current) {
          titleRef.current.style.opacity = '1'
          titleRef.current.style.visibility = 'inherit'
          titleRef.current.style.transform = 'none'
        }
        if (refs.subtitleRef.current) {
          refs.subtitleRef.current.style.opacity = '1'
          refs.subtitleRef.current.style.visibility = 'inherit'
          refs.subtitleRef.current.style.transform = 'none'
        }
        hudLines.forEach((el) => { el.style.transform = 'scaleX(1)' })
        hudLabels.forEach((el) => {
          el.style.opacity = '1'
          el.style.visibility = 'inherit'
        })
        if (headlineRef.current) {
          headlineRef.current.style.opacity = '1'
          headlineRef.current.style.visibility = 'inherit'
          headlineRef.current.style.transform = 'none'
        }
        if (descRef.current) {
          descRef.current.style.opacity = '1'
          descRef.current.style.visibility = 'inherit'
          descRef.current.style.transform = 'none'
        }
        if (buttonsRef.current) {
          buttonsRef.current.style.opacity = '1'
          buttonsRef.current.style.visibility = 'inherit'
          buttonsRef.current.style.transform = 'none'
        }
        return
      }

      // Hidden initial states
      if (titleRef.current) {
        titleRef.current.style.opacity = '0'
        titleRef.current.style.visibility = 'hidden'
        titleRef.current.style.transform = 'translate3d(0, 30px, 0)'
      }
      if (refs.subtitleRef.current) {
        refs.subtitleRef.current.style.opacity = '0'
        refs.subtitleRef.current.style.visibility = 'hidden'
        refs.subtitleRef.current.style.transform = 'translate3d(0, 20px, 0)'
      }
      hudLines.forEach((el) => { el.style.transform = 'scaleX(0)' })
      hudLabels.forEach((el) => {
        el.style.opacity = '0'
        el.style.visibility = 'hidden'
      })
      if (headlineRef.current) {
        headlineRef.current.style.opacity = '0'
        headlineRef.current.style.visibility = 'hidden'
        headlineRef.current.style.transform = 'translate3d(0, 30px, 0)'
      }
      if (descRef.current) {
        descRef.current.style.opacity = '0'
        descRef.current.style.visibility = 'hidden'
        descRef.current.style.transform = 'translate3d(0, 20px, 0)'
      }
      if (buttonsRef.current) {
        buttonsRef.current.style.opacity = '0'
        buttonsRef.current.style.visibility = 'hidden'
        buttonsRef.current.style.transform = 'translate3d(0, 20px, 0)'
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

      const { sectionRef, titleRef, subtitleRef, hudBarRef, headlineRef, descRef, buttonsRef } = refs

      const ctx = gsap.context(() => {
        const hudLines = hudBarRef.current
          ? Array.from(hudBarRef.current.querySelectorAll('[data-hud-line]'))
          : []
        const hudLabels = hudBarRef.current
          ? Array.from(hudBarRef.current.querySelectorAll('[data-hud-label]'))
          : []

        if (prefersReducedMotion) {
          if (titleRef.current) gsap.set(titleRef.current, { autoAlpha: 1, y: 0 })
          if (subtitleRef.current) gsap.set(subtitleRef.current, { autoAlpha: 1, y: 0 })
          if (hudLines.length) gsap.set(hudLines, { scaleX: 1 })
          if (hudLabels.length) gsap.set(hudLabels, { autoAlpha: 1 })
          if (headlineRef.current) gsap.set(headlineRef.current, { autoAlpha: 1, y: 0 })
          if (descRef.current) gsap.set(descRef.current, { autoAlpha: 1, y: 0 })
          if (buttonsRef.current) gsap.set(buttonsRef.current, { autoAlpha: 1, y: 0 })
          return
        }

        // Initial states via GSAP
        if (hudLines.length) gsap.set(hudLines, { scaleX: 0 })
        if (hudLabels.length) gsap.set(hudLabels, { autoAlpha: 0 })
        if (titleRef.current) gsap.set(titleRef.current, { autoAlpha: 0, y: 30 })
        if (subtitleRef.current) gsap.set(subtitleRef.current, { autoAlpha: 0, y: 20 })
        if (headlineRef.current) gsap.set(headlineRef.current, { autoAlpha: 0, y: 30 })
        if (descRef.current) gsap.set(descRef.current, { autoAlpha: 0, y: 20 })
        if (buttonsRef.current) gsap.set(buttonsRef.current, { autoAlpha: 0, y: 20 })

        // Scroll-triggered timeline
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            once: true,
          },
        })

        // Phase 0: HUD bar lines
        if (hudLines.length) {
          tl.to(hudLines, {
            scaleX: 1,
            duration: 0.5,
            ease: 'power2.out',
            stagger: 0.05,
          })
        }

        // Phase 1: HUD labels
        if (hudLabels.length) {
          tl.to(
            hudLabels,
            {
              autoAlpha: 1,
              duration: 0.3,
              ease: 'power2.out',
              stagger: 0.06,
            },
            '-=0.2',
          )
        }

        // Phase 2: Title
        tl.to(
          titleRef.current,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
          },
          '-=0.1',
        )

        // Phase 3: Subtitle
        if (subtitleRef.current) {
          tl.to(
            subtitleRef.current,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.6,
              ease: 'power3.out',
            },
            '-=0.2',
          )
        }

        // Phase 4: CTA headline
        if (headlineRef.current) {
          tl.to(
            headlineRef.current,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              ease: 'power3.out',
            },
            '-=0.2',
          )
        }

        // Phase 5: CTA description
        if (descRef.current) {
          tl.to(
            descRef.current,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.6,
              ease: 'power3.out',
            },
            '-=0.3',
          )
        }

        // Phase 6: Buttons
        if (buttonsRef.current) {
          tl.to(
            buttonsRef.current,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.6,
              ease: 'power3.out',
            },
            '-=0.2',
          )
        }
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
