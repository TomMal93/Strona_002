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
  ytCarouselShellRef: RefObject<HTMLDivElement>
  bottomTimelineRef: RefObject<HTMLDivElement>
}

export function usePromoAnimations(refs: PromoAnimationRefs): void {
  useLayoutEffect(() => {
    let shouldCleanup = false
    let revertContext: (() => void) | undefined

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const setInitialStyles = () => {
      const {
        sectionRef,
        hudBarRef,
        titleRef,
        subtitleRef,
        videoFrameRef,
        ytGridRef,
        ytCarouselShellRef,
        bottomTimelineRef,
      } = refs

      const carouselShell = ytCarouselShellRef.current
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
      const promoLines = sectionRef.current
        ? Array.from(sectionRef.current.querySelectorAll<HTMLElement>('[data-promo-line]'))
        : []
      const promoProcess = sectionRef.current?.querySelector<HTMLElement>('[data-promo-process]') ?? null
      const promoQuote = sectionRef.current?.querySelector<HTMLElement>('[data-promo-quote]') ?? null

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
        if (ytGridRef.current) {
          ytGridRef.current.style.opacity = '1'
          ytGridRef.current.style.visibility = 'inherit'
          ytGridRef.current.style.transform = 'none'
        }
        if (carouselShell) {
          carouselShell.style.opacity = '1'
          carouselShell.style.visibility = 'inherit'
          carouselShell.style.transform = 'none'
        }
        if (bottomLine) bottomLine.style.transform = 'scaleX(1)'
        promoLines.forEach((el) => { el.style.transform = 'scaleX(1)' })
        ;[promoProcess, promoQuote].forEach((el) => {
          if (!el) return
          el.style.opacity = '1'
          el.style.visibility = 'inherit'
          el.style.transform = 'none'
        })
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
      if (ytGridRef.current) {
        ytGridRef.current.style.opacity = '0'
        ytGridRef.current.style.visibility = 'hidden'
        ytGridRef.current.style.transform = 'translate3d(-18px, 0, 0)'
      }
      if (carouselShell) {
        carouselShell.style.opacity = '0'
        carouselShell.style.visibility = 'hidden'
        carouselShell.style.transform = 'translate3d(0, 24px, 0)'
      }
      if (bottomLine) bottomLine.style.transform = 'scaleX(0)'
      promoLines.forEach((el) => { el.style.transform = 'scaleX(0)' })
      if (promoProcess) {
        promoProcess.style.opacity = '0'
        promoProcess.style.visibility = 'hidden'
        promoProcess.style.transform = 'translate3d(0, 22px, 0)'
      }
      if (promoQuote) {
        promoQuote.style.opacity = '0'
        promoQuote.style.visibility = 'hidden'
        promoQuote.style.transform = 'translate3d(0, 14px, 0)'
      }
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
        ytCarouselShellRef,
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
        const carouselShell = ytCarouselShellRef.current
        const bottomLine = bottomTimelineRef.current
          ? bottomTimelineRef.current.querySelector('[data-bottom-seg]')
          : null
        const bottomDiamonds = bottomTimelineRef.current
          ? Array.from(bottomTimelineRef.current.querySelectorAll('[data-bottom-diamond]'))
          : []
        const promoLines = sectionRef.current
          ? Array.from(sectionRef.current.querySelectorAll('[data-promo-line]'))
          : []
        const promoProcess = sectionRef.current?.querySelector('[data-promo-process]') ?? null
        const promoQuote = sectionRef.current?.querySelector('[data-promo-quote]') ?? null
        const processLines = promoProcess
          ? Array.from(promoProcess.querySelectorAll('[data-promo-line]'))
          : []


        if (prefersReducedMotion) {
          gsap.set([titleRef.current, subtitleRef.current, videoFrameRef.current], { autoAlpha: 1, y: 0 })
          if (hudLines.length) gsap.set(hudLines, { scaleX: 1 })
          if (hudLabels.length) gsap.set(hudLabels, { autoAlpha: 1, y: 0 })
          if (corners.length) gsap.set(corners, { autoAlpha: 1 })
          if (ytCards.length) gsap.set(ytCards, { autoAlpha: 1, y: 0 })
          if (ytGridRef.current) gsap.set(ytGridRef.current, { autoAlpha: 1, x: 0 })
          if (carouselShell) gsap.set(carouselShell, { autoAlpha: 1, y: 0 })
          if (bottomLine) gsap.set(bottomLine, { scaleX: 1 })
          if (promoLines.length) gsap.set(promoLines, { scaleX: 1 })
          if (promoProcess) gsap.set(promoProcess, { autoAlpha: 1, y: 0 })
          if (promoQuote) gsap.set(promoQuote, { autoAlpha: 1, y: 0 })
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
        if (ytGridRef.current) gsap.set(ytGridRef.current, { autoAlpha: 0, x: -18 })
        if (carouselShell) gsap.set(carouselShell, { autoAlpha: 0, y: 24 })
        if (bottomLine) gsap.set(bottomLine, { scaleX: 0 })
        if (promoLines.length) gsap.set(promoLines, { scaleX: 0 })
        if (promoProcess) gsap.set(promoProcess, { autoAlpha: 0, y: 22 })
        if (promoQuote) gsap.set(promoQuote, { autoAlpha: 0, y: 14 })
        if (bottomDiamonds.length) gsap.set(bottomDiamonds, { autoAlpha: 0 })

        /* ── Scroll-triggered timeline ──────────────────────────────── */

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 92%',
            once: true,
          },
        })

        // 1. HUD lines
        if (hudInnerLines.length) {
          tl.to(hudInnerLines, {
            scaleX: 1,
            duration: 0.34,
            ease: 'power2.out',
            stagger: 0.015,
          })
        }

        if (hudOuterLines.length) {
          tl.to(
            hudOuterLines,
            {
              scaleX: 1,
              duration: 0.52,
              ease: 'power2.out',
              stagger: 0.025,
            },
            '-=0.1',
          )
        }

        // 2. HUD labels
        if (hudLabels.length) {
          tl.to(
            hudLabels,
            { autoAlpha: 1, y: 0, duration: 0.26, ease: 'power2.out', stagger: 0.015 },
            '-=0.18',
          )
        }

        // 3. Title
        tl.to(titleRef.current, {
          autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out',
        }, '-=0.1')

        // 4. Subtitle
        tl.to(subtitleRef.current, {
          autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out',
        }, '-=0.3')

        // 5. Video frame
        tl.to(videoFrameRef.current, {
          autoAlpha: 1, duration: 0.75, ease: 'power1.out',
        }, '-=0.3')

        // 6. Corner marks
        if (corners.length) {
          tl.to(corners, {
            autoAlpha: 1, duration: 0.3, ease: 'power2.out', stagger: 0.012,
          }, '-=0.4')
        }

        // 7. Desktop playlist frame and cards / mobile carousel shell
        if (ytGridRef.current) {
          tl.to(ytGridRef.current, {
            autoAlpha: 1, x: 0, duration: 0.55, ease: 'power3.out',
          }, '-=0.55')
        }
        if (ytCards.length) {
          tl.to(ytCards, {
            autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out', stagger: 0.008,
          }, '-=0.35')
        }
        if (carouselShell) {
          tl.to(carouselShell, {
            autoAlpha: 1, y: 0, duration: 0.55, ease: 'power3.out',
          }, '-=0.35')
        }

        // 8. Creative process panel and its separator lines
        if (promoProcess) {
          tl.to(promoProcess, {
            autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out',
          }, '-=0.25')
        }
        if (processLines.length) {
          tl.to(processLines, {
            scaleX: 1,
            duration: 0.55,
            ease: 'power2.out',
            stagger: 0.06,
          }, '-=0.38')
        }

        // 9. Closing quote
        if (promoQuote) {
          tl.to(promoQuote, {
            autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out',
          }, '-=0.3')
        }


        // 10. Legacy mobile timeline
        if (bottomLine) {
          tl.to(bottomLine, { scaleX: 1, duration: 0.5, ease: 'power2.out' }, '-=0.3')
        }
        if (bottomDiamonds.length) {
          tl.to(bottomDiamonds, {
            autoAlpha: 1, duration: 0.3, ease: 'power2.out', stagger: 0.015,
          }, '-=0.2')
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
