'use client'

import { useLayoutEffect } from 'react'
import type { RefObject } from 'react'

export type ServicesAnimationRefs = {
  sectionRef: RefObject<HTMLElement>
  titleRef: RefObject<HTMLHeadingElement>
  titleAccentRef: RefObject<HTMLSpanElement>
  introRef: RefObject<HTMLParagraphElement>
  timelineRef: RefObject<HTMLDivElement>
  hudBarRef: RefObject<HTMLDivElement>
  bottomTimelineRef: RefObject<HTMLDivElement>
}

const DESKTOP_BREAKPOINT = 1024

/**
 * Scroll-triggered entrance animation for the Services section.
 *
 * Multi-phase GSAP timeline:
 * Title → accent line → subtitle → timeline draw → cards clip-path wipe → details.
 * Desktop cards use a cinematic clip-path inset wipe; mobile falls back to fade+translate.
 * Respects prefers-reduced-motion.
 */
export function useServicesAnimation(refs: ServicesAnimationRefs): void {
  useLayoutEffect(() => {
    let shouldCleanup = false
    let observer: IntersectionObserver | undefined
    let revertContext: (() => void) | undefined

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const setInitialStyles = () => {
      const {
        titleRef,
        titleAccentRef,
        introRef,
        timelineRef,
        hudBarRef,
        bottomTimelineRef,
      } = refs

      const isDesktop = window.innerWidth >= DESKTOP_BREAKPOINT
      const cards = Array.from(
        refs.sectionRef.current?.querySelectorAll<HTMLElement>('[data-service-card]') ?? [],
      )
      const cornerMarks = cards.flatMap((card) =>
        Array.from(card.querySelectorAll<HTMLElement>('[data-corner-mark]')),
      )
      const sceneNumbers = cards.flatMap((card) =>
        Array.from(card.querySelectorAll<HTMLElement>('[data-scene-number]')),
      )
      const hudLines = hudBarRef.current
        ? Array.from(hudBarRef.current.querySelectorAll<HTMLElement>('[data-hud-line]'))
        : []
      const hudLabels = hudBarRef.current
        ? Array.from(hudBarRef.current.querySelectorAll<HTMLElement>('[data-hud-label]'))
        : []
      const bottomSegs = bottomTimelineRef.current
        ? Array.from(bottomTimelineRef.current.querySelectorAll<HTMLElement>('[data-bottom-seg]'))
        : []
      const bottomDiamonds = bottomTimelineRef.current
        ? Array.from(bottomTimelineRef.current.querySelectorAll<HTMLElement>('[data-bottom-diamond]'))
        : []
      const fadeElements = [titleRef.current, introRef.current] as Array<HTMLElement | null>
      const visibleFadeElements = fadeElements.filter(
        (el): el is HTMLElement => el !== null,
      )

      if (prefersReducedMotion) {
        visibleFadeElements.forEach((el) => {
          el.style.opacity = '1'
          el.style.visibility = 'inherit'
          el.style.transform = 'none'
        })
        if (titleAccentRef.current) titleAccentRef.current.style.transform = 'scaleX(1)'
        if (timelineRef.current) timelineRef.current.style.transform = 'scaleX(1)'
        hudLines.forEach((el) => { el.style.transform = 'scaleX(1)' })
        hudLabels.forEach((el) => {
          el.style.opacity = '1'
          el.style.visibility = 'inherit'
          el.style.transform = 'none'
        })
        bottomSegs.forEach((el) => { el.style.transform = 'scaleX(1)' })
        bottomDiamonds.forEach((el) => {
          el.style.opacity = '1'
          el.style.visibility = 'inherit'
        })
        cards.forEach((el) => {
          el.style.opacity = '1'
          el.style.visibility = 'inherit'
          el.style.transform = 'none'
          el.style.clipPath = 'none'
        })
        ;[...cornerMarks, ...sceneNumbers].forEach((el) => {
          el.style.opacity = '1'
          el.style.visibility = 'inherit'
        })
        return
      }

      visibleFadeElements.forEach((el) => {
        el.style.opacity = '0'
        el.style.visibility = 'hidden'
        el.style.transform = 'translate3d(0, 30px, 0)'
      })
      if (titleAccentRef.current) titleAccentRef.current.style.transform = 'scaleX(0)'
      if (timelineRef.current) timelineRef.current.style.transform = 'scaleX(0)'
      hudLines.forEach((el) => { el.style.transform = 'scaleX(0)' })
      hudLabels.forEach((el) => {
        el.style.opacity = '0'
        el.style.visibility = 'hidden'
        el.style.transform = 'translate3d(0, 8px, 0)'
      })
      bottomSegs.forEach((el) => { el.style.transform = 'scaleX(0)' })
      bottomDiamonds.forEach((el) => {
        el.style.opacity = '0'
        el.style.visibility = 'hidden'
      })
      cards.forEach((el) => {
        el.style.opacity = '0'
        el.style.visibility = 'hidden'
        el.style.transform = isDesktop
          ? 'translate3d(0, 15px, 0)'
          : 'translate3d(0, 40px, 0)'
        el.style.clipPath = isDesktop ? 'inset(0 100% 0 0)' : 'none'
      })
      ;[...cornerMarks, ...sceneNumbers].forEach((el) => {
        el.style.opacity = '0'
        el.style.visibility = 'hidden'
      })
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
        sectionRef,
        titleRef,
        titleAccentRef,
        introRef,
        timelineRef,
        hudBarRef,
        bottomTimelineRef,
      } = refs

      const ctx = gsap.context(() => {
        const cards = gsap.utils.toArray<HTMLElement>('[data-service-card]')

        const cornerMarks = cards.flatMap((card) =>
          Array.from(card.querySelectorAll('[data-corner-mark]')),
        )

        const sceneNumbers = cards.flatMap((card) =>
          Array.from(card.querySelectorAll('[data-scene-number]')),
        )

        const isDesktop = window.innerWidth >= DESKTOP_BREAKPOINT

        /* ── Reduced motion: show everything instantly ──────────────── */

        const hudLines = hudBarRef.current
          ? Array.from(hudBarRef.current.querySelectorAll('[data-hud-line]'))
          : []
        const hudInnerLines =
          hudLines.length >= 4 ? [hudLines[1], hudLines[2]] : hudLines
        const hudOuterLines =
          hudLines.length >= 4 ? [hudLines[0], hudLines[3]] : []
        const hudLabels = hudBarRef.current
          ? Array.from(hudBarRef.current.querySelectorAll('[data-hud-label]'))
          : []
        const bottomSegs = bottomTimelineRef.current
          ? Array.from(bottomTimelineRef.current.querySelectorAll('[data-bottom-seg]'))
          : []
        const bottomDiamonds = bottomTimelineRef.current
          ? Array.from(bottomTimelineRef.current.querySelectorAll('[data-bottom-diamond]'))
          : []

        if (prefersReducedMotion) {
          gsap.set([titleRef.current, introRef.current], { autoAlpha: 1, y: 0 })
          if (titleAccentRef.current) gsap.set(titleAccentRef.current, { scaleX: 1 })
          if (timelineRef.current) gsap.set(timelineRef.current, { scaleX: 1 })
          if (hudLines.length) gsap.set(hudLines, { scaleX: 1 })
          if (hudLabels.length) gsap.set(hudLabels, { autoAlpha: 1, y: 0 })
          if (bottomSegs.length) gsap.set(bottomSegs, { scaleX: 1 })
          if (bottomDiamonds.length) gsap.set(bottomDiamonds, { autoAlpha: 1 })
          gsap.set(cards, { autoAlpha: 1, y: 0, clipPath: 'none' })
          if (cornerMarks.length) gsap.set(cornerMarks, { autoAlpha: 1 })
          if (sceneNumbers.length) gsap.set(sceneNumbers, { autoAlpha: 1 })
          return
        }

        /* ── Initial states ─────────────────────────────────────────── */

        if (hudLines.length) gsap.set(hudLines, { scaleX: 0 })
        if (hudLabels.length) gsap.set(hudLabels, { autoAlpha: 0, y: 8 })
        if (bottomSegs.length) gsap.set(bottomSegs, { scaleX: 0 })
        if (bottomDiamonds.length) gsap.set(bottomDiamonds, { autoAlpha: 0 })

        gsap.set([titleRef.current, introRef.current], { autoAlpha: 0, y: 30 })

        if (titleAccentRef.current) {
          gsap.set(titleAccentRef.current, { scaleX: 0 })
        }

        if (timelineRef.current) {
          gsap.set(timelineRef.current, { scaleX: 0 })
        }

        if (isDesktop) {
          gsap.set(cards, {
            autoAlpha: 0,
            clipPath: 'inset(0 100% 0 0)',
            y: 15,
          })
        } else {
          gsap.set(cards, { autoAlpha: 0, y: 40 })
        }

        if (cornerMarks.length) gsap.set(cornerMarks, { autoAlpha: 0 })
        if (sceneNumbers.length) gsap.set(sceneNumbers, { autoAlpha: 0 })

        /* ── Scroll-triggered timeline ──────────────────────────────── */

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            once: true,
          },
        })

        // Phase 0: HUD bar lines draw from center
        if (hudInnerLines.length) {
          tl.to(hudInnerLines, {
            scaleX: 1,
            duration: 0.34,
            ease: 'power2.out',
            stagger: 0.03,
          })
        }

        if (hudOuterLines.length) {
          tl.to(
            hudOuterLines,
            {
              scaleX: 1,
              duration: 0.52,
              ease: 'power2.out',
              stagger: 0.05,
            },
            '-=0.1',
          )
        }

        // Phase 0.5: REC + timecode labels fade in
        if (hudLabels.length) {
          tl.to(
            hudLabels,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.26,
              ease: 'power2.out',
              stagger: 0.06,
            },
            '-=0.18',
          )
        }

        // Phase 1: Title fades in
        tl.to(titleRef.current, {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
        })

        // Phase 2: Accent line draws
        if (titleAccentRef.current) {
          tl.to(
            titleAccentRef.current,
            { scaleX: 1, duration: 0.5, ease: 'power2.out' },
            '-=0.3',
          )
        }

        // Phase 3: Subtitle fades in
        tl.to(
          introRef.current,
          { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out' },
          '-=0.2',
        )

        // Phase 4.5: Bottom decorative timeline
        if (bottomSegs.length) {
          tl.to(
            bottomSegs,
            { scaleX: 1, duration: 0.3, ease: 'power2.out' },
            '-=0.1',
          )
        }
        if (bottomDiamonds.length) {
          tl.to(
            bottomDiamonds,
            { autoAlpha: 1, duration: 0.3, ease: 'power2.out' },
            '-=0.2',
          )
        }

        // Phase 5: Timeline line draws (desktop only)
        if (timelineRef.current && isDesktop) {
          tl.to(
            timelineRef.current,
            { scaleX: 1, duration: 0.8, ease: 'power2.inOut' },
            '-=0.2',
          )
        }

        // Phase 5: Cards reveal — clip-path wipe (desktop) or fade+translate (mobile)
        if (isDesktop) {
          tl.to(
            cards,
            {
              autoAlpha: 1,
              clipPath: 'inset(0 0% 0 0)',
              y: 0,
              duration: 0.6,
              ease: 'power3.out',
              stagger: 0.12,
            },
            '-=0.3',
          )
        } else {
          tl.to(
            cards,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.7,
              ease: 'power2.out',
              stagger: 0.08,
            },
            '-=0.2',
          )
        }

        // Phase 6: Corner marks + scene numbers appear
        if (cornerMarks.length) {
          tl.to(
            cornerMarks,
            { autoAlpha: 1, duration: 0.3, ease: 'power2.out' },
            '-=0.1',
          )
        }

        if (sceneNumbers.length) {
          tl.to(
            sceneNumbers,
            {
              autoAlpha: 1,
              duration: 0.25,
              ease: 'power2.out',
              stagger: 0.04,
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
