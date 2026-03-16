'use client'

import { useLayoutEffect } from 'react'
import type { RefObject } from 'react'

export type ProcessAnimationRefs = {
  sectionRef: RefObject<HTMLElement>
  titleRef: RefObject<HTMLHeadingElement>
  subtitleRef: RefObject<HTMLParagraphElement>
  hudBarRef: RefObject<HTMLDivElement>
  connectorRef: RefObject<HTMLDivElement>
  stepsContainerRef: RefObject<HTMLOListElement>
}

const DESKTOP_BREAKPOINT = 1024
const TABLET_BREAKPOINT = 768

export function useProcessAnimations(refs: ProcessAnimationRefs): void {
  useLayoutEffect(() => {
    let shouldCleanup = false
    let observer: IntersectionObserver | undefined
    let revertContext: (() => void) | undefined

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const setInitialStyles = () => {
      const { titleRef, hudBarRef, connectorRef, stepsContainerRef } = refs

      const hudLines = hudBarRef.current
        ? Array.from(hudBarRef.current.querySelectorAll<HTMLElement>('[data-hud-line]'))
        : []
      const hudLabels = hudBarRef.current
        ? Array.from(hudBarRef.current.querySelectorAll<HTMLElement>('[data-hud-label]'))
        : []
      const cornerMarks = refs.sectionRef.current
        ? Array.from(refs.sectionRef.current.querySelectorAll<HTMLElement>('[data-corner-mark]'))
        : []
      const stepCards = stepsContainerRef.current
        ? Array.from(stepsContainerRef.current.querySelectorAll<HTMLElement>('[data-process-step]'))
        : []
      const stepNodes = stepsContainerRef.current
        ? Array.from(stepsContainerRef.current.querySelectorAll<HTMLElement>('[data-process-node]'))
        : []
      const timelineLabels = stepsContainerRef.current
        ? Array.from(stepsContainerRef.current.querySelectorAll<HTMLElement>('[data-process-timeline-label]'))
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
        cornerMarks.forEach((el) => {
          el.style.opacity = '1'
          el.style.visibility = 'inherit'
        })
        if (connectorRef.current) {
          connectorRef.current.style.transform = 'scale(1)'
        }
        stepNodes.forEach((el) => {
          el.style.transform = 'scale(1)'
          el.style.opacity = '1'
          el.style.visibility = 'inherit'
        })
        stepCards.forEach((el) => {
          el.style.opacity = '1'
          el.style.visibility = 'inherit'
          el.style.transform = 'none'
        })
        timelineLabels.forEach((el) => {
          el.style.opacity = '1'
          el.style.visibility = 'inherit'
        })
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
      cornerMarks.forEach((el) => {
        el.style.opacity = '0'
        el.style.visibility = 'hidden'
      })
      if (connectorRef.current) {
        const isDesktop = window.innerWidth >= DESKTOP_BREAKPOINT
        const isMobile = window.innerWidth < TABLET_BREAKPOINT
        if (isDesktop) {
          connectorRef.current.style.transform = 'scaleX(0)'
        } else if (isMobile) {
          connectorRef.current.style.transform = 'scaleY(0)'
        }
      }
      stepNodes.forEach((el) => {
        el.style.transform = 'scale(0)'
        el.style.opacity = '0'
        el.style.visibility = 'hidden'
      })
      stepCards.forEach((el) => {
        el.style.opacity = '0'
        el.style.visibility = 'hidden'
        el.style.transform = 'translate3d(0, 20px, 0)'
      })
      timelineLabels.forEach((el) => {
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

      const { sectionRef, titleRef, subtitleRef, hudBarRef, connectorRef, stepsContainerRef } = refs

      const ctx = gsap.context(() => {
        const isDesktop = window.innerWidth >= DESKTOP_BREAKPOINT
        const isMobile = window.innerWidth < TABLET_BREAKPOINT

        const hudLines = hudBarRef.current
          ? Array.from(hudBarRef.current.querySelectorAll('[data-hud-line]'))
          : []
        const hudLabels = hudBarRef.current
          ? Array.from(hudBarRef.current.querySelectorAll('[data-hud-label]'))
          : []
        const cornerMarks = Array.from(
          sectionRef.current?.querySelectorAll('[data-corner-mark]') ?? [],
        )
        const stepCards = stepsContainerRef.current
          ? Array.from(stepsContainerRef.current.querySelectorAll('[data-process-step]'))
          : []
        const stepNodes = stepsContainerRef.current
          ? Array.from(stepsContainerRef.current.querySelectorAll('[data-process-node]'))
          : []
        const timelineLabels = stepsContainerRef.current
          ? Array.from(stepsContainerRef.current.querySelectorAll('[data-process-timeline-label]'))
          : []

        if (prefersReducedMotion) {
          if (titleRef.current) gsap.set(titleRef.current, { autoAlpha: 1, y: 0 })
          if (subtitleRef.current) gsap.set(subtitleRef.current, { autoAlpha: 1, y: 0 })
          if (hudLines.length) gsap.set(hudLines, { scaleX: 1 })
          if (hudLabels.length) gsap.set(hudLabels, { autoAlpha: 1 })
          if (cornerMarks.length) gsap.set(cornerMarks, { autoAlpha: 1 })
          if (connectorRef.current) gsap.set(connectorRef.current, { scaleX: 1, scaleY: 1 })
          if (stepNodes.length) gsap.set(stepNodes, { autoAlpha: 1, scale: 1 })
          if (stepCards.length) gsap.set(stepCards, { autoAlpha: 1, y: 0 })
          if (timelineLabels.length) gsap.set(timelineLabels, { autoAlpha: 1 })
          return
        }

        // Initial states via GSAP
        if (hudLines.length) gsap.set(hudLines, { scaleX: 0 })
        if (hudLabels.length) gsap.set(hudLabels, { autoAlpha: 0 })
        if (titleRef.current) gsap.set(titleRef.current, { autoAlpha: 0, y: 30 })
        if (subtitleRef.current) gsap.set(subtitleRef.current, { autoAlpha: 0, y: 20 })
        if (cornerMarks.length) gsap.set(cornerMarks, { autoAlpha: 0 })
        if (connectorRef.current) {
          if (isDesktop) {
            gsap.set(connectorRef.current, { scaleX: 0 })
          } else if (isMobile) {
            gsap.set(connectorRef.current, { scaleY: 0 })
          }
        }
        if (stepNodes.length) gsap.set(stepNodes, { autoAlpha: 0, scale: 0 })
        if (stepCards.length) gsap.set(stepCards, { autoAlpha: 0, y: 20 })
        if (timelineLabels.length) gsap.set(timelineLabels, { autoAlpha: 0 })

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

        // Phase 2.5: Subtitle
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

        // Phase 3: Corner marks
        if (cornerMarks.length) {
          tl.to(
            cornerMarks,
            {
              autoAlpha: 1,
              duration: 0.3,
              ease: 'power2.out',
              stagger: 0.05,
            },
            '-=0.3',
          )
        }

        // Phase 4: Connector line
        if (connectorRef.current) {
          if (isDesktop) {
            tl.to(
              connectorRef.current,
              {
                scaleX: 1,
                duration: 1.0,
                ease: 'power2.inOut',
              },
              '-=0.2',
            )
          } else if (isMobile) {
            tl.to(
              connectorRef.current,
              {
                scaleY: 1,
                duration: 1.0,
                ease: 'power2.inOut',
              },
              '-=0.2',
            )
          }
        }

        // Phase 5: Timeline nodes
        if (stepNodes.length) {
          tl.to(
            stepNodes,
            {
              autoAlpha: 1,
              scale: 1,
              duration: 0.4,
              ease: 'back.out(1.7)',
              stagger: 0.15,
            },
            '-=0.6',
          )
        }

        // Phase 6: Step cards
        if (stepCards.length) {
          tl.to(
            stepCards,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.6,
              ease: 'power3.out',
              stagger: 0.15,
            },
            '-=0.5',
          )
        }

        // Phase 7: Timeline labels
        if (timelineLabels.length) {
          tl.to(
            timelineLabels,
            {
              autoAlpha: 1,
              duration: 0.3,
              ease: 'power2.out',
              stagger: 0.1,
            },
            '-=0.3',
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
