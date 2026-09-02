'use client'

import { useLayoutEffect } from 'react'
import type { RefObject } from 'react'

export type AboutAnimationRefs = {
  sectionRef: RefObject<HTMLElement>
  hudBarRef: RefObject<HTMLDivElement>
  titleRef: RefObject<HTMLHeadingElement>
  videoRef: RefObject<HTMLDivElement>
  viewfinderRef: RefObject<HTMLDivElement>
  backdropRef: RefObject<HTMLDivElement>
  copyPanelRef: RefObject<HTMLDivElement>
  leadRef: RefObject<HTMLParagraphElement>
  descriptionRef: RefObject<HTMLParagraphElement>
  statementRef: RefObject<HTMLDivElement>
  ctaRef: RefObject<HTMLDivElement>
}

/**
 * Orchestrated entrance for the About section (desktop & mobile).
 *
 * Sequence:
 * 1. Section title, HUD header & the dark viewfinder backdrop slide in first.
 * 2. Literally moments later: viewfinder HUD, portrait video, lead copy,
 *    statement panel, feature badges, and CTA buttons enter cleanly in order.
 */
export function useAboutAnimations(refs: AboutAnimationRefs): void {
  useLayoutEffect(() => {
    let shouldCleanup = false
    let revertContext: (() => void) | undefined

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const getElements = () => {
      const viewfinder = refs.viewfinderRef.current
      const statement = refs.statementRef.current
      const cta = refs.ctaRef.current
      const video = refs.videoRef.current

      return {
        title: refs.titleRef.current,
        viewfinder,
        backdrop: refs.backdropRef.current,
        copyPanel: refs.copyPanelRef.current,
        video,
        lead: refs.leadRef.current,
        description: refs.descriptionRef.current,
        statement,
        cta,
        features: cta
          ? Array.from(cta.querySelectorAll<HTMLElement>('[class*="feature"]'))
          : [],
        ctaActions: cta
          ? (cta.querySelector<HTMLElement>('[class*="ctaActions"]') ?? null)
          : null,
        hudLines: refs.hudBarRef.current
          ? Array.from(refs.hudBarRef.current.querySelectorAll<HTMLElement>('[data-hud-line]'))
          : [],
        hudLabels: refs.hudBarRef.current
          ? Array.from(refs.hudBarRef.current.querySelectorAll<HTMLElement>('[data-hud-label]'))
          : [],
        viewfinderCorners: viewfinder
          ? Array.from(viewfinder.querySelectorAll<HTMLElement>('[class*="cornerMark"]'))
              .filter((corner) => !statement?.contains(corner))
          : [],
        cameraHud: viewfinder
          ? Array.from(
              viewfinder.querySelectorAll<HTMLElement>(
                '[class*="viewfinderHudTop"] > [class*="viewfinderBattery"], [class*="viewfinderHudTop"] > [class*="viewfinderHudStatus"], [class*="viewfinderHudBottom"] > span',
              ),
            )
          : [],
        divider: viewfinder?.querySelector<HTMLElement>('[class*="viewfinderDivider"]') ?? null,
        statementCorners: statement
          ? Array.from(statement.querySelectorAll<HTMLElement>('[class*="cornerMark"]'))
          : [],
        statementCopy: statement
          ? Array.from(statement.querySelectorAll<HTMLElement>(':scope > p'))
          : [],
      }
    }

    const setInitialStyles = () => {
      const elements = getElements()

      if (prefersReducedMotion) {
        const allElements = [
          elements.title,
          elements.backdrop,
          elements.copyPanel,
          elements.video,
          elements.lead,
          elements.divider,
          elements.description,
          elements.statement,
          elements.ctaActions,
          ...elements.features,
          ...elements.hudLabels,
          ...elements.viewfinderCorners,
          ...elements.cameraHud,
          ...elements.statementCorners,
          ...elements.statementCopy,
        ].filter((el): el is HTMLElement => el !== null)

        allElements.forEach((el) => {
          el.style.opacity = '1'
          el.style.visibility = 'inherit'
          el.style.transform = 'none'
        })
        elements.hudLines.forEach((line) => {
          line.style.transform = 'scaleX(1)'
          line.style.opacity = '1'
        })
        if (elements.divider) {
          elements.divider.style.transform = 'scaleX(1)'
        }
        return
      }

      // Initial hidden states
      if (elements.backdrop) {
        elements.backdrop.style.opacity = '0'
        elements.backdrop.style.visibility = 'hidden'
        elements.backdrop.style.transform = 'translate3d(0, 40px, 0)'
      }

      if (elements.title) {
        elements.title.style.opacity = '0'
        elements.title.style.visibility = 'hidden'
        elements.title.style.transform = 'translate3d(0, 24px, 0)'
      }

      elements.hudLines.forEach((line) => {
        line.style.transform = 'scaleX(0)'
      })

      elements.hudLabels.forEach((label) => {
        label.style.opacity = '0'
        label.style.visibility = 'hidden'
        label.style.transform = 'translate3d(0, 8px, 0)'
      })

      elements.viewfinderCorners.forEach((corner) => {
        corner.style.opacity = '0'
        corner.style.visibility = 'hidden'
      })

      elements.cameraHud.forEach((hud) => {
        hud.style.opacity = '0'
        hud.style.visibility = 'hidden'
        hud.style.transform = 'translate3d(0, 6px, 0)'
      })

      if (elements.video) {
        elements.video.style.opacity = '0'
        elements.video.style.visibility = 'hidden'
        elements.video.style.transform = 'translate3d(0, 20px, 0) scale(0.98)'
      }

      if (elements.copyPanel) {
        elements.copyPanel.style.opacity = '0'
        elements.copyPanel.style.visibility = 'hidden'
        elements.copyPanel.style.transform = 'translate3d(0, 16px, 0)'
      }

      if (elements.lead) {
        elements.lead.style.opacity = '0'
        elements.lead.style.visibility = 'hidden'
        elements.lead.style.transform = 'translate3d(0, 16px, 0)'
      }

      if (elements.divider) {
        elements.divider.style.opacity = '0'
        elements.divider.style.visibility = 'hidden'
        elements.divider.style.transform = 'scaleX(0)'
      }

      if (elements.description) {
        elements.description.style.opacity = '0'
        elements.description.style.visibility = 'hidden'
        elements.description.style.transform = 'translate3d(0, 16px, 0)'
      }

      if (elements.statement) {
        elements.statement.style.opacity = '0'
        elements.statement.style.visibility = 'hidden'
        elements.statement.style.transform = 'translate3d(0, 16px, 0)'
      }

      elements.statementCorners.forEach((corner) => {
        corner.style.opacity = '0'
        corner.style.visibility = 'hidden'
      })

      elements.features.forEach((feature) => {
        feature.style.opacity = '0'
        feature.style.visibility = 'hidden'
        feature.style.transform = 'translate3d(0, 12px, 0)'
      })

      if (elements.ctaActions) {
        elements.ctaActions.style.opacity = '0'
        elements.ctaActions.style.visibility = 'hidden'
        elements.ctaActions.style.transform = 'translate3d(0, 12px, 0)'
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

      const ctx = gsap.context(() => {
        const elements = getElements()

        const hudInnerLines =
          elements.hudLines.length >= 4
            ? [elements.hudLines[1], elements.hudLines[2]]
            : elements.hudLines
        const hudOuterLines =
          elements.hudLines.length >= 4
            ? [elements.hudLines[0], elements.hudLines[3]]
            : []

        const allAnimatedElements = [
          elements.title,
          elements.backdrop,
          elements.copyPanel,
          elements.video,
          elements.lead,
          elements.divider,
          elements.description,
          elements.statement,
          elements.ctaActions,
          ...elements.features,
          ...elements.hudLabels,
          ...elements.viewfinderCorners,
          ...elements.cameraHud,
          ...elements.statementCorners,
          ...elements.statementCopy,
        ].filter((el): el is HTMLElement => el !== null)

        if (prefersReducedMotion) {
          gsap.set(allAnimatedElements, { autoAlpha: 1, clearProps: 'transform' })
          gsap.set(elements.hudLines, { scaleX: 1 })
          if (elements.divider) gsap.set(elements.divider, { scaleX: 1 })
          return
        }

        // Set GSAP initial states
        if (elements.backdrop) {
          gsap.set(elements.backdrop, { autoAlpha: 0, y: 40 })
        }
        if (elements.title) {
          gsap.set(elements.title, { autoAlpha: 0, y: 24 })
        }
        if (hudInnerLines.length) {
          gsap.set(hudInnerLines, { scaleX: 0, transformOrigin: 'center' })
        }
        if (hudOuterLines.length) {
          gsap.set(hudOuterLines, { scaleX: 0, transformOrigin: 'center' })
        }
        if (elements.hudLabels.length) {
          gsap.set(elements.hudLabels, { autoAlpha: 0, y: 8 })
        }
        if (elements.viewfinderCorners.length) {
          gsap.set(elements.viewfinderCorners, { autoAlpha: 0 })
        }
        if (elements.cameraHud.length) {
          gsap.set(elements.cameraHud, { autoAlpha: 0, y: 6 })
        }
        if (elements.video) {
          gsap.set(elements.video, { autoAlpha: 0, y: 20, scale: 0.98 })
        }
        if (elements.copyPanel) {
          gsap.set(elements.copyPanel, { autoAlpha: 0, y: 16 })
        }
        if (elements.lead) {
          gsap.set(elements.lead, { autoAlpha: 0, y: 16 })
        }
        if (elements.divider) {
          gsap.set(elements.divider, { autoAlpha: 0, scaleX: 0, transformOrigin: 'center' })
        }
        if (elements.description) {
          gsap.set(elements.description, { autoAlpha: 0, y: 16 })
        }
        if (elements.statement) {
          gsap.set(elements.statement, { autoAlpha: 0, y: 16 })
        }
        if (elements.statementCorners.length) {
          gsap.set(elements.statementCorners, { autoAlpha: 0 })
        }
        if (elements.features.length) {
          gsap.set(elements.features, { autoAlpha: 0, y: 12 })
        }
        if (elements.ctaActions) {
          gsap.set(elements.ctaActions, { autoAlpha: 0, y: 12 })
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: refs.sectionRef.current,
            start: 'top 85%',
            once: true,
          },
        })

        // ── Phase 1: Czarne tło wjeżdża pierwsze + Title & HUD ────────────
        if (elements.backdrop) {
          tl.to(
            elements.backdrop,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.7,
              ease: 'power3.out',
            },
            0,
          )
        }

        if (elements.title) {
          tl.to(
            elements.title,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.55,
              ease: 'power3.out',
            },
            0.05,
          )
        }

        if (hudInnerLines.length) {
          tl.to(
            hudInnerLines,
            {
              scaleX: 1,
              duration: 0.35,
              ease: 'power2.out',
              stagger: 0.015,
            },
            0.05,
          )
        }

        if (hudOuterLines.length) {
          tl.to(
            hudOuterLines,
            {
              scaleX: 1,
              duration: 0.48,
              ease: 'power2.out',
              stagger: 0.02,
            },
            0.1,
          )
        }

        if (elements.hudLabels.length) {
          tl.to(
            elements.hudLabels,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.28,
              ease: 'power2.out',
              stagger: 0.02,
            },
            0.15,
          )
        }

        // ── Phase 2: Dosłownie po chwili reszta animacji ─────────────────
        const contentStart = 0.35

        // Viewfinder frame corners & camera HUD
        if (elements.copyPanel) {
          tl.to(
            elements.copyPanel,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.5,
              ease: 'power3.out',
            },
            contentStart,
          )
        }

        if (elements.viewfinderCorners.length) {
          tl.to(
            elements.viewfinderCorners,
            {
              autoAlpha: 1,
              duration: 0.32,
              ease: 'power2.out',
              stagger: 0.015,
            },
            contentStart,
          )
        }

        if (elements.cameraHud.length) {
          tl.to(
            elements.cameraHud,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.32,
              ease: 'power2.out',
              stagger: 0.02,
            },
            contentStart + 0.04,
          )
        }

        // Portrait Video Frame
        if (elements.video) {
          tl.to(
            elements.video,
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.65,
              ease: 'power2.out',
            },
            contentStart + 0.05,
          )
        }

        // Copy: Lead text, divider, description
        if (elements.lead) {
          tl.to(
            elements.lead,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.48,
              ease: 'power3.out',
            },
            contentStart + 0.1,
          )
        }

        if (elements.divider) {
          tl.to(
            elements.divider,
            {
              autoAlpha: 1,
              scaleX: 1,
              duration: 0.4,
              ease: 'power2.out',
            },
            contentStart + 0.18,
          )
        }

        if (elements.description) {
          tl.to(
            elements.description,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.48,
              ease: 'power3.out',
            },
            contentStart + 0.24,
          )
        }

        // Statement Panel & Corners
        if (elements.statement) {
          tl.to(
            elements.statement,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.5,
              ease: 'power3.out',
            },
            contentStart + 0.32,
          )
        }

        if (elements.statementCorners.length) {
          tl.to(
            elements.statementCorners,
            {
              autoAlpha: 1,
              duration: 0.28,
              ease: 'power2.out',
              stagger: 0.015,
            },
            contentStart + 0.38,
          )
        }

        // Bottom CTA: Feature items & CTA actions
        if (elements.features.length) {
          tl.to(
            elements.features,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.38,
              ease: 'power2.out',
              stagger: 0.04,
            },
            contentStart + 0.42,
          )
        }

        if (elements.ctaActions) {
          tl.to(
            elements.ctaActions,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.42,
              ease: 'power3.out',
            },
            contentStart + 0.5,
          )
        }

      }, refs.sectionRef)

      revertContext = () => ctx.revert()
    }

    const rafId = window.requestAnimationFrame(() => {
      void initAnimations()
    })

    return () => {
      shouldCleanup = true
      window.cancelAnimationFrame(rafId)
      revertContext?.()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
