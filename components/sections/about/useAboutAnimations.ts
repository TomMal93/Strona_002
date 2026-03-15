'use client'

import { useLayoutEffect } from 'react'
import type { RefObject } from 'react'

export type AboutAnimationRefs = {
  sectionRef: RefObject<HTMLElement>
  hudBarRef: RefObject<HTMLDivElement>
  titleRef: RefObject<HTMLHeadingElement>
  viewfinderRef: RefObject<HTMLDivElement>
  leadRef: RefObject<HTMLParagraphElement>
  descriptionRef: RefObject<HTMLParagraphElement>
  statementRef: RefObject<HTMLDivElement>
  ctaRef: RefObject<HTMLDivElement>
}

/**
 * Scroll-triggered entrance animation for the About section.
 *
 * Title + HUD → viewfinder frame → text → camera params → CTA.
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

    const setInitialStyles = () => {
      const {
        hudBarRef,
        titleRef,
        viewfinderRef,
        leadRef,
        descriptionRef,
        statementRef,
        ctaRef,
      } = refs

      const fadeElements = [
        titleRef.current,
        leadRef.current,
        descriptionRef.current,
        statementRef.current,
        ctaRef.current,
      ] as Array<HTMLElement | null>
      const visibleFadeElements = fadeElements.filter(
        (el): el is HTMLElement => el !== null,
      )

      const viewfinderElement = viewfinderRef.current
      const hudLines = hudBarRef.current
        ? Array.from(hudBarRef.current.querySelectorAll<HTMLElement>('[data-hud-line]'))
        : []
      const hudLabels = hudBarRef.current
        ? Array.from(hudBarRef.current.querySelectorAll<HTMLElement>('[data-hud-label]'))
        : []
      const corners = viewfinderElement
        ? Array.from(viewfinderElement.querySelectorAll<HTMLElement>('[class*="cornerMark"]'))
        : []
      const topHudItems = viewfinderElement
        ? Array.from(
            viewfinderElement.querySelectorAll<HTMLElement>(
              '[class*="viewfinderBattery"], [class*="viewfinderHudStatus"]',
            ),
          )
        : []
      const bottomHudItems = viewfinderElement
        ? Array.from(
            viewfinderElement.querySelectorAll<HTMLElement>(
              '[class*="viewfinderResolution"], [class*="viewfinderExposure"], [class*="viewfinderTimecode"]',
            ),
          )
        : []
      const contentElements = viewfinderElement
        ? Array.from(
            viewfinderElement.querySelectorAll<HTMLElement>(
              '[class*="viewfinderLead"], [class*="viewfinderDivider"], [class*="viewfinderDesc"]',
            ),
          )
        : []

      if (prefersReducedMotion) {
        visibleFadeElements.forEach((el) => {
          el.style.opacity = '1'
          el.style.visibility = 'inherit'
          el.style.transform = 'none'
        })
        if (viewfinderElement) {
          viewfinderElement.style.opacity = '1'
          viewfinderElement.style.visibility = 'inherit'
          viewfinderElement.style.transform = 'none'
          viewfinderElement.style.clipPath = 'inset(0% 0% 0% 0%)'
        }
        hudLines.forEach((el) => { el.style.transform = 'scaleX(1)' })
        hudLabels.forEach((el) => {
          el.style.opacity = '1'
          el.style.visibility = 'inherit'
          el.style.transform = 'none'
        })
        ;[...corners, ...topHudItems, ...bottomHudItems, ...contentElements].forEach((el) => {
          el.style.opacity = '1'
          el.style.visibility = 'inherit'
          el.style.transform = 'none'
        })
        return
      }

      visibleFadeElements.forEach((el) => {
        el.style.opacity = '0'
        el.style.visibility = 'hidden'
        el.style.transform = 'translate3d(0, 30px, 0)'
      })
      if (viewfinderElement) {
        viewfinderElement.style.opacity = '0'
        viewfinderElement.style.visibility = 'hidden'
        viewfinderElement.style.transform = 'translate3d(0, 28px, 0) scale(0.985)'
        viewfinderElement.style.clipPath = 'inset(0% 0% 100% 0%)'
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
      topHudItems.forEach((el) => {
        el.style.opacity = '0'
        el.style.visibility = 'hidden'
        el.style.transform = 'translate3d(0, -10px, 0)'
      })
      bottomHudItems.forEach((el) => {
        el.style.opacity = '0'
        el.style.visibility = 'hidden'
        el.style.transform = 'translate3d(0, 10px, 0)'
      })
      contentElements.forEach((el) => {
        el.style.opacity = '0'
        el.style.visibility = 'hidden'
        el.style.transform = 'translate3d(0, 22px, 0)'
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
        viewfinderRef,
        leadRef,
        descriptionRef,
        statementRef,
        ctaRef,
      } = refs

      const ctx = gsap.context(() => {
        const viewfinderElement = viewfinderRef.current
        const statementElement = statementRef.current
        const ctaElement = ctaRef.current
        const titleElement = titleRef.current
        const leadElement = leadRef.current
        const descriptionElement = descriptionRef.current

        const fadeElements = [
          titleElement,
          leadElement,
          descriptionElement,
          statementElement,
          ctaElement,
        ] as Array<HTMLElement | null>
        const visibleFadeElements = fadeElements.filter(
          (el): el is HTMLElement => el !== null,
        )

        const corners = viewfinderElement
          ? Array.from(viewfinderElement.querySelectorAll('[class*="cornerMark"]'))
          : []
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
        const topHudItems = viewfinderElement
          ? Array.from(
              viewfinderElement.querySelectorAll(
                '[class*="viewfinderBattery"], [class*="viewfinderHudStatus"]',
              ),
            )
          : []
        const bottomHudItems = viewfinderElement
          ? Array.from(
              viewfinderElement.querySelectorAll(
                '[class*="viewfinderResolution"], [class*="viewfinderExposure"], [class*="viewfinderTimecode"]',
              ),
            )
          : []
        const contentElements = viewfinderElement
          ? Array.from(
              viewfinderElement.querySelectorAll(
                '[class*="viewfinderLead"], [class*="viewfinderDivider"], [class*="viewfinderDesc"]',
              ),
            )
          : []
        /* ── Reduced motion: show everything instantly ──────────────── */

        if (prefersReducedMotion) {
          gsap.set(visibleFadeElements, { autoAlpha: 1, y: 0 })
          if (viewfinderElement) {
            gsap.set(viewfinderElement, { autoAlpha: 1, y: 0, scale: 1, clipPath: 'inset(0% 0% 0% 0%)' })
          }
          if (hudLines.length) gsap.set(hudLines, { scaleX: 1 })
          if (hudLabels.length) gsap.set(hudLabels, { autoAlpha: 1, y: 0 })
          if (topHudItems.length) gsap.set(topHudItems, { autoAlpha: 1, y: 0 })
          if (bottomHudItems.length) gsap.set(bottomHudItems, { autoAlpha: 1, y: 0 })
          if (contentElements.length) gsap.set(contentElements, { autoAlpha: 1, y: 0 })
          if (corners.length) gsap.set(corners, { autoAlpha: 1 })
          return
        }

        /* ── Initial states ─────────────────────────────────────────── */

        gsap.set(visibleFadeElements, { autoAlpha: 0, y: 30 })
        if (viewfinderElement) {
          gsap.set(viewfinderElement, {
            autoAlpha: 0,
            y: 28,
            scale: 0.985,
            clipPath: 'inset(0% 0% 100% 0%)',
          })
        }
        if (hudLines.length) gsap.set(hudLines, { scaleX: 0 })
        if (hudLabels.length) gsap.set(hudLabels, { autoAlpha: 0, y: 8 })
        if (topHudItems.length) gsap.set(topHudItems, { autoAlpha: 0, y: -10 })
        if (bottomHudItems.length) gsap.set(bottomHudItems, { autoAlpha: 0, y: 10 })
        if (contentElements.length) gsap.set(contentElements, { autoAlpha: 0, y: 22 })
        if (corners.length) gsap.set(corners, { autoAlpha: 0 })

        /* ── Scroll-triggered timeline ──────────────────────────────── */

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            once: true,
          },
        })

        if (hudInnerLines.length) {
          tl.to(hudInnerLines, {
            scaleX: 1,
            duration: 0.18,
            ease: 'power2.out',
            stagger: 0.01,
          })
        }

        if (hudOuterLines.length) {
          tl.to(
            hudOuterLines,
            {
              scaleX: 1,
              duration: 0.24,
              ease: 'power2.out',
              stagger: 0.015,
            },
            '-=0.05',
          )
        }

        if (hudLabels.length) {
          tl.to(
            hudLabels,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.14,
              ease: 'power2.out',
              stagger: 0.02,
            },
            '-=0.06',
          )
        }

        tl.to(titleElement, {
          autoAlpha: 1,
          y: 0,
          duration: 0.62,
          ease: 'power3.out',
        }, '-=0.08')

        if (viewfinderElement) {
          tl.to(
            viewfinderElement,
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              clipPath: 'inset(0% 0% 0% 0%)',
              duration: 0.72,
              ease: 'power3.out',
            },
            '-=0.16',
          )
        }

        if (corners.length) {
          tl.to(
            corners,
            {
              autoAlpha: 1,
              duration: 0.22,
              ease: 'power2.out',
              stagger: 0.04,
            },
            '-=0.34',
          )
        }

        if (topHudItems.length) {
          tl.to(
            topHudItems,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.34,
              ease: 'power2.out',
              stagger: 0.05,
            },
            '-=0.1',
          )
        }

        if (bottomHudItems.length) {
          tl.to(
            bottomHudItems,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.34,
              ease: 'power2.out',
              stagger: 0.05,
            },
            '-=0.22',
          )
        }

        if (contentElements.length) {
          tl.to(
            contentElements,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.55,
              ease: 'power3.out',
              stagger: 0.08,
            },
            '-=0.04',
          )
        }

        tl.to(
          statementElement,
          { autoAlpha: 1, y: 0, duration: 0.62, ease: 'power3.out' },
          '-=0.12',
        )

        tl.to(
          ctaElement,
          { autoAlpha: 1, y: 0, duration: 0.56, ease: 'power3.out' },
          '-=0.34',
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
