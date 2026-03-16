'use client'

import { useLayoutEffect } from 'react'
import type { RefObject } from 'react'

export type PromoAnimationRefs = {
  sectionRef: RefObject<HTMLElement>
  hudBarRef: RefObject<HTMLDivElement>
  titleRef: RefObject<HTMLHeadingElement>
  subtitleRef: RefObject<HTMLParagraphElement>
  videoFrameRef: RefObject<HTMLDivElement>
  ytGridRef: RefObject<HTMLDivElement>
  bottomTimelineRef: RefObject<HTMLDivElement>
}

export function usePromoAnimations(refs: PromoAnimationRefs): void {
  useLayoutEffect(() => {
    let shouldCleanup = false
    let observer: IntersectionObserver | undefined
    let revertContext: (() => void) | undefined

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const setInitialStyles = () => {
      const {
        hudBarRef,
        titleRef,
        subtitleRef,
        videoFrameRef,
        ytGridRef,
        bottomTimelineRef,
      } = refs

      const fadeElements = [titleRef.current, subtitleRef.current] as Array<HTMLElement | null>
      const visibleFadeElements = fadeElements.filter(
        (el): el is HTMLElement => el !== null,
      )
      const hudLines = hudBarRef.current
        ? Array.from(hudBarRef.current.querySelectorAll<HTMLElement>('[data-hud-line]'))
        : []
      const hudLabels = hudBarRef.current
        ? Array.from(hudBarRef.current.querySelectorAll<HTMLElement>('[data-hud-label]'))
        : []
      const corners = videoFrameRef.current
        ? Array.from(videoFrameRef.current.querySelectorAll<HTMLElement>('[data-corner-mark]'))
        : []
      const ytCards = ytGridRef.current
        ? Array.from(ytGridRef.current.children) as HTMLElement[]
        : []
      const bottomLine = bottomTimelineRef.current?.querySelector<HTMLElement>('[data-bottom-seg]') ?? null
      const bottomDiamonds = bottomTimelineRef.current
        ? Array.from(bottomTimelineRef.current.querySelectorAll<HTMLElement>('[data-bottom-diamond]'))
        : []

        if (prefersReducedMotion) {
          visibleFadeElements.forEach((el) => {
            el.style.opacity = '1'
            el.style.visibility = 'inherit'
            el.style.transform = 'none'
          })
        if (videoFrameRef.current) {
          videoFrameRef.current.style.opacity = '1'
          videoFrameRef.current.style.visibility = 'inherit'
          videoFrameRef.current.style.transform = 'none'
        }
        hudLines.forEach((el) => { el.style.transform = 'scaleX(1)' })
        hudLabels.forEach((el) => {
          el.style.opacity = '1'
          el.style.visibility = 'inherit'
          el.style.transform = 'none'
        })
        corners.forEach((el) => {
          el.style.opacity = '1'
          el.style.visibility = 'inherit'
        })
        ytCards.forEach((el) => {
          el.style.opacity = '1'
          el.style.visibility = 'inherit'
          el.style.transform = 'none'
        })
        if (bottomLine) bottomLine.style.transform = 'scaleX(1)'
        bottomDiamonds.forEach((el) => {
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
      if (videoFrameRef.current) {
        videoFrameRef.current.style.opacity = '0'
        videoFrameRef.current.style.visibility = 'hidden'
        videoFrameRef.current.style.transform = 'none'
      }
      hudLines.forEach((el) => { el.style.transform = 'scaleX(0)' })
      hudLabels.forEach((el) => {
        el.style.opacity = '0'
        el.style.visibility = 'hidden'
        el.style.transform = 'translate3d(0, 8px, 0)'
      })
      corners.forEach((el) => {
        el.style.opacity = '0'
        el.style.visibility = 'hidden'
      })
      ytCards.forEach((el) => {
        el.style.opacity = '0'
        el.style.visibility = 'hidden'
        el.style.transform = 'translate3d(0, 20px, 0)'
      })
      if (bottomLine) bottomLine.style.transform = 'scaleX(0)'
      bottomDiamonds.forEach((el) => {
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
        hudBarRef,
        titleRef,
        subtitleRef,
        videoFrameRef,
        ytGridRef,
        bottomTimelineRef,
      } = refs

      const ctx = gsap.context(() => {
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
        const corners = videoFrameRef.current
          ? Array.from(videoFrameRef.current.querySelectorAll('[data-corner-mark]'))
          : []
        const ytCards = ytGridRef.current
          ? Array.from(ytGridRef.current.children)
          : []
        const bottomLine = bottomTimelineRef.current
          ? bottomTimelineRef.current.querySelector('[data-bottom-seg]')
          : null
        const bottomDiamonds = bottomTimelineRef.current
          ? Array.from(bottomTimelineRef.current.querySelectorAll('[data-bottom-diamond]'))
          : []

        if (prefersReducedMotion) {
          gsap.set([titleRef.current, subtitleRef.current, videoFrameRef.current], { autoAlpha: 1, y: 0 })
          if (hudLines.length) gsap.set(hudLines, { scaleX: 1 })
          if (hudLabels.length) gsap.set(hudLabels, { autoAlpha: 1, y: 0 })
          if (corners.length) gsap.set(corners, { autoAlpha: 1 })
          if (ytCards.length) gsap.set(ytCards, { autoAlpha: 1, y: 0 })
          if (bottomLine) gsap.set(bottomLine, { scaleX: 1 })
          if (bottomDiamonds.length) gsap.set(bottomDiamonds, { autoAlpha: 1 })
          return
        }

        /* ── Initial states ─────────────────────────────────────────── */

        gsap.set([titleRef.current, subtitleRef.current], { autoAlpha: 0, y: 30 })
        gsap.set(videoFrameRef.current, { autoAlpha: 0 })
        if (hudLines.length) gsap.set(hudLines, { scaleX: 0 })
        if (hudLabels.length) gsap.set(hudLabels, { autoAlpha: 0, y: 8 })
        if (corners.length) gsap.set(corners, { autoAlpha: 0 })
        if (ytCards.length) gsap.set(ytCards, { autoAlpha: 0, y: 20 })
        if (bottomLine) gsap.set(bottomLine, { scaleX: 0 })
        if (bottomDiamonds.length) gsap.set(bottomDiamonds, { autoAlpha: 0 })

        /* ── Scroll-triggered timeline ──────────────────────────────── */

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            once: true,
          },
        })

        // 1. HUD lines
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

        // 2. HUD labels
        if (hudLabels.length) {
          tl.to(
            hudLabels,
            { autoAlpha: 1, y: 0, duration: 0.26, ease: 'power2.out', stagger: 0.06 },
            '-=0.18',
          )
        }

        // 3. Title
        tl.to(titleRef.current, {
          autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out',
        }, '-=0.1')

        // 4. Subtitle
        tl.to(subtitleRef.current, {
          autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out',
        }, '-=0.3')

        // 5. Video frame
        tl.to(videoFrameRef.current, {
          autoAlpha: 1, duration: 1.2, ease: 'power1.out',
        }, '-=0.3')

        // 6. Corner marks
        if (corners.length) {
          tl.to(corners, {
            autoAlpha: 1, duration: 0.4, ease: 'power2.out', stagger: 0.06,
          }, '-=0.4')
        }

        // 7. YouTube cards
        if (ytCards.length) {
          tl.to(ytCards, {
            autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.12,
          }, '-=0.2')
        }

        // 8. Bottom timeline
        if (bottomLine) {
          tl.to(bottomLine, { scaleX: 1, duration: 0.5, ease: 'power2.out' }, '-=0.3')
        }
        if (bottomDiamonds.length) {
          tl.to(bottomDiamonds, {
            autoAlpha: 1, duration: 0.3, ease: 'power2.out', stagger: 0.06,
          }, '-=0.2')
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
