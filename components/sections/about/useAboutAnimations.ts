'use client'

import { useLayoutEffect } from 'react'
import type { RefObject } from 'react'

export type AboutAnimationRefs = {
  sectionRef: RefObject<HTMLElement>
  hudBarRef: RefObject<HTMLDivElement>
  titleRef: RefObject<HTMLHeadingElement>
  videoRef: RefObject<HTMLDivElement>
  viewfinderRef: RefObject<HTMLDivElement>
  leadRef: RefObject<HTMLParagraphElement>
  descriptionRef: RefObject<HTMLParagraphElement>
  statementRef: RefObject<HTMLDivElement>
  ctaRef: RefObject<HTMLDivElement>
}

/**
 * A restrained, scroll-triggered entrance for the About section.
 *
 * Frames, copy, and portrait emerge together as one cinematic composition.
 * The portrait takes slightly longer to reach full exposure.
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
      const video = refs.videoRef.current

      return {
        title: refs.titleRef.current,
        viewfinder,
        video,
        videoMedia: video?.querySelector<HTMLVideoElement>('video') ?? null,
        lead: refs.leadRef.current,
        description: refs.descriptionRef.current,
        statement,
        cta: refs.ctaRef.current,
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
      const fadeElements = [
        elements.title,
        elements.video,
        elements.lead,
        elements.divider,
        elements.description,
        elements.cta,
        ...elements.hudLabels,
        ...elements.viewfinderCorners,
        ...elements.cameraHud,
        ...elements.statementCorners,
        ...elements.statementCopy,
      ].filter((element): element is HTMLElement => element !== null)

      if (prefersReducedMotion) {
        fadeElements.forEach((element) => {
          element.style.opacity = '1'
          element.style.visibility = 'inherit'
          element.style.transform = 'none'
          element.style.removeProperty('filter')
        })
        elements.hudLines.forEach((line) => {
          line.style.transform = 'scaleX(1)'
          line.style.opacity = '1'
          line.style.removeProperty('filter')
        })
        elements.videoMedia?.style.removeProperty('filter')
        return
      }

      fadeElements.forEach((element) => {
        element.style.opacity = element === elements.video ? '0.18' : '0.08'
        element.style.visibility = 'inherit'
        if (element !== elements.video) {
          element.style.filter = 'brightness(0.22) blur(0.7px)'
        }
      })
      elements.title?.style.setProperty('transform', 'translate3d(0, 18px, 0)')
      if (elements.video) {
        elements.video.style.opacity = '0.18'
        elements.video.style.visibility = 'inherit'
        elements.video.style.transform = 'translate3d(0, 6px, 0) scale(0.99)'
      }
      if (elements.videoMedia) {
        elements.videoMedia.style.filter = 'brightness(0.08) contrast(1.4) saturate(0.42)'
      }
      ;[elements.lead, elements.divider, elements.description].forEach((element) => {
        element?.style.setProperty('transform', 'translate3d(0, 14px, 0)')
      })
      elements.statementCopy.forEach((element) => {
        element.style.transform = 'translate3d(0, 12px, 0)'
      })
      elements.cta?.style.setProperty('transform', 'translate3d(0, 8px, 0)')
      elements.hudLines.forEach((line) => {
        line.style.opacity = '0.08'
        line.style.filter = 'brightness(0.22) blur(0.7px)'
        line.style.transform = 'scaleX(0.92)'
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

      const ctx = gsap.context(() => {
        const elements = getElements()
        const allVisibleElements = [
          elements.title,
          elements.video,
          elements.lead,
          elements.divider,
          elements.description,
          elements.cta,
          ...elements.hudLabels,
          ...elements.viewfinderCorners,
          ...elements.cameraHud,
          ...elements.statementCorners,
          ...elements.statementCopy,
        ].filter((element): element is HTMLElement => element !== null)

        if (prefersReducedMotion) {
          gsap.set(allVisibleElements, { autoAlpha: 1, clearProps: 'transform,filter' })
          gsap.set(elements.hudLines, { opacity: 1, scaleX: 1, clearProps: 'filter' })
          gsap.set(elements.videoMedia, { clearProps: 'filter' })
          return
        }

        const copyElements = [elements.lead, elements.divider, elements.description]
          .filter((element): element is HTMLElement => element !== null)
        const shadowElements = allVisibleElements.filter(
          (element) => element !== elements.video,
        )

        // Re-assert initial values inside the GSAP context so cleanup restores
        // every inline style applied before the asynchronous import completed.
        gsap.set(shadowElements, {
          autoAlpha: 0.08,
          filter: 'brightness(0.22) blur(0.7px)',
        })
        gsap.set(elements.title, { y: 18 })
        gsap.set(elements.video, { autoAlpha: 0.18, y: 6, scale: 0.99 })
        gsap.set(elements.videoMedia, {
          filter: 'brightness(0.08) contrast(1.4) saturate(0.42)',
        })
        gsap.set(copyElements, { y: 14 })
        gsap.set(elements.statementCopy, { y: 12 })
        gsap.set(elements.cta, { y: 8 })
        gsap.set(elements.hudLines, {
          opacity: 0.08,
          filter: 'brightness(0.22) blur(0.7px)',
          scaleX: 0.92,
          transformOrigin: 'center',
        })

        const timeline = gsap.timeline({
          defaults: { ease: 'power3.out' },
          scrollTrigger: {
            trigger: refs.sectionRef.current,
            start: 'top 78%',
            once: true,
          },
        })

        // The complete composition emerges in one shared, unhurried reveal.
        timeline
          .to(
            shadowElements,
            {
              autoAlpha: 1,
              filter: 'brightness(1) blur(0px)',
              duration: 1.3,
              ease: 'sine.inOut',
            },
            0,
          )
          .to(elements.title, { y: 0, duration: 1.1 }, 0)
          .to(
            elements.hudLines,
            {
              opacity: 1,
              filter: 'brightness(1) blur(0px)',
              scaleX: 1,
              duration: 1.1,
              ease: 'power2.out',
            },
            0,
          )
          .to(
            copyElements,
            { y: 0, duration: 1.2, stagger: 0.04 },
            0,
          )
          .to(
            elements.statementCopy,
            { y: 0, duration: 1.2, stagger: 0.04 },
            0,
          )
          .to(
            elements.cta,
            { y: 0, duration: 1.1 },
            0,
          )

        timeline
          .to(
            elements.video,
            { autoAlpha: 1, y: 0, scale: 1, duration: 1.65, ease: 'power2.out' },
            0,
          )
          .to(
            elements.videoMedia,
            {
              filter: 'brightness(1) contrast(1) saturate(1)',
              duration: 1.85,
              ease: 'sine.inOut',
            },
            0,
          )

      }, refs.sectionRef)

      revertContext = () => ctx.revert()
    }

    // Let the Hero settle before ScrollTrigger measures the section position.
    const rafId = window.requestAnimationFrame(() => {
      void initAnimations()
    })

    return () => {
      shouldCleanup = true
      window.cancelAnimationFrame(rafId)
      revertContext?.()
    }
  // The refs are stable for the lifetime of the section.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
