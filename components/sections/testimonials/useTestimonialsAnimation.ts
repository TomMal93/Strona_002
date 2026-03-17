'use client'

import { useLayoutEffect, useRef, useCallback } from 'react'
import type { RefObject } from 'react'

export type TestimonialsAnimationRefs = {
  sectionRef: RefObject<HTMLElement>
  titleRef: RefObject<HTMLHeadingElement>
  subtitleRef: RefObject<HTMLParagraphElement>
  hudBarRef: RefObject<HTMLDivElement>
  carouselShellRef: RefObject<HTMLDivElement>
  trackRef: RefObject<HTMLDivElement>
  trustedPanelRef: RefObject<HTMLDivElement>
  socialProofPanelRef: RefObject<HTMLDivElement>
  totalSlides: number
  initialDomIndex: number
}

type GoToOptions = {
  instant?: boolean
  onComplete?: () => void
}

type GsapModule = typeof import('gsap')

function calcTrackX(
  track: HTMLElement,
  domIndex: number,
): number {
  const viewport = track.parentElement
  if (!viewport) return 0
  const slides = Array.from(track.querySelectorAll<HTMLElement>('[data-slide]'))
  if (!slides.length) return 0
  const slideWidth = slides[0].offsetWidth
  const viewportWidth = viewport.offsetWidth
  const centerOffset = (viewportWidth - slideWidth) / 2
  return centerOffset - domIndex * slideWidth
}

export function useTestimonialsAnimation(
  refs: TestimonialsAnimationRefs,
): { goTo: (domIndex: number, totalSlides: number, options?: GoToOptions) => void } {
  const gsapRef = useRef<GsapModule['gsap'] | null>(null)

  const goTo = useCallback(
    (domIndex: number, _totalSlides: number, options?: GoToOptions) => {
      const gsap = gsapRef.current
      const track = refs.trackRef.current
      if (!gsap || !track) return

      const x = calcTrackX(track, domIndex)

      if (options?.instant) {
        gsap.set(track, { x })
      } else {
        gsap.to(track, {
          x,
          duration: 0.5,
          ease: 'power2.inOut',
          onComplete: options?.onComplete,
        })
      }
    },
    [refs.trackRef],
  )

  useLayoutEffect(() => {
    let shouldCleanup = false
    let observer: IntersectionObserver | undefined
    let revertContext: (() => void) | undefined

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const setInitialStyles = () => {
      const { titleRef, hudBarRef, carouselShellRef, trustedPanelRef, socialProofPanelRef } = refs

      const hudLines = hudBarRef.current
        ? Array.from(hudBarRef.current.querySelectorAll<HTMLElement>('[data-hud-line]'))
        : []
      const hudLabels = hudBarRef.current
        ? Array.from(hudBarRef.current.querySelectorAll<HTMLElement>('[data-hud-label]'))
        : []
      const trustedPanel = trustedPanelRef.current
      const trustedCornerMarks = trustedPanel
        ? Array.from(trustedPanel.querySelectorAll<HTMLElement>('[data-corner-mark]'))
        : []
      const trustedItems = trustedPanel
        ? Array.from(trustedPanel.querySelectorAll<HTMLElement>('[data-trusted-item]'))
        : []
      const socialProofPanel = socialProofPanelRef.current
      const socialProofCornerMarks = socialProofPanel
        ? Array.from(socialProofPanel.querySelectorAll<HTMLElement>('[data-corner-mark-sp]'))
        : []
      const statItems = socialProofPanel
        ? Array.from(socialProofPanel.querySelectorAll<HTMLElement>('[data-stat-item]'))
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
        if (carouselShellRef.current) {
          carouselShellRef.current.style.opacity = '1'
          carouselShellRef.current.style.visibility = 'inherit'
          carouselShellRef.current.style.transform = 'none'
        }
        if (trustedPanel) {
          trustedPanel.style.opacity = '1'
          trustedPanel.style.visibility = 'inherit'
          trustedPanel.style.transform = 'none'
        }
        trustedCornerMarks.forEach((el) => {
          el.style.opacity = '1'
          el.style.visibility = 'inherit'
        })
        trustedItems.forEach((el) => {
          el.style.opacity = '1'
          el.style.visibility = 'inherit'
        })
        if (socialProofPanel) {
          socialProofPanel.style.opacity = '1'
          socialProofPanel.style.visibility = 'inherit'
          socialProofPanel.style.transform = 'none'
        }
        socialProofCornerMarks.forEach((el) => {
          el.style.opacity = '1'
          el.style.visibility = 'inherit'
        })
        statItems.forEach((el) => {
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
      if (carouselShellRef.current) {
        carouselShellRef.current.style.opacity = '0'
        carouselShellRef.current.style.visibility = 'hidden'
        carouselShellRef.current.style.transform = 'translate3d(0, 20px, 0)'
      }
      if (trustedPanel) {
        trustedPanel.style.opacity = '0'
        trustedPanel.style.visibility = 'hidden'
        trustedPanel.style.transform = 'translate3d(0, 20px, 0)'
      }
      trustedCornerMarks.forEach((el) => {
        el.style.opacity = '0'
        el.style.visibility = 'hidden'
      })
      trustedItems.forEach((el) => {
        el.style.opacity = '0'
        el.style.visibility = 'hidden'
      })
      if (socialProofPanel) {
        socialProofPanel.style.opacity = '0'
        socialProofPanel.style.visibility = 'hidden'
        socialProofPanel.style.transform = 'translate3d(0, 20px, 0)'
      }
      socialProofCornerMarks.forEach((el) => {
        el.style.opacity = '0'
        el.style.visibility = 'hidden'
      })
      statItems.forEach((el) => {
        el.style.opacity = '0'
        el.style.visibility = 'hidden'
      })
    }

    setInitialStyles()

    // Center the track on the initial slide
    const track = refs.trackRef.current
    if (track) {
      const x = calcTrackX(track, refs.initialDomIndex)
      track.style.transform = `translateX(${x}px)`
    }

    const initAnimations = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])

      if (shouldCleanup) return

      gsap.registerPlugin(ScrollTrigger)
      gsapRef.current = gsap

      const { sectionRef, titleRef, subtitleRef, hudBarRef, carouselShellRef, trustedPanelRef, socialProofPanelRef } = refs

      const ctx = gsap.context(() => {
        const hudLines = hudBarRef.current
          ? Array.from(hudBarRef.current.querySelectorAll('[data-hud-line]'))
          : []
        const hudLabels = hudBarRef.current
          ? Array.from(hudBarRef.current.querySelectorAll('[data-hud-label]'))
          : []
        const trustedPanel = trustedPanelRef.current
        const trustedCornerMarks = trustedPanel
          ? Array.from(trustedPanel.querySelectorAll('[data-corner-mark]'))
          : []
        const trustedItems = trustedPanel
          ? Array.from(trustedPanel.querySelectorAll('[data-trusted-item]'))
          : []
        const socialProofPanel = socialProofPanelRef.current
        const socialProofCornerMarks = socialProofPanel
          ? Array.from(socialProofPanel.querySelectorAll('[data-corner-mark-sp]'))
          : []
        const statItems = socialProofPanel
          ? Array.from(socialProofPanel.querySelectorAll('[data-stat-item]'))
          : []

        if (prefersReducedMotion) {
          if (titleRef.current) gsap.set(titleRef.current, { autoAlpha: 1, y: 0 })
          if (subtitleRef.current) gsap.set(subtitleRef.current, { autoAlpha: 1, y: 0 })
          if (hudLines.length) gsap.set(hudLines, { scaleX: 1 })
          if (hudLabels.length) gsap.set(hudLabels, { autoAlpha: 1 })
          if (carouselShellRef.current) gsap.set(carouselShellRef.current, { autoAlpha: 1, y: 0 })
          if (trustedPanel) gsap.set(trustedPanel, { autoAlpha: 1, y: 0 })
          if (trustedCornerMarks.length) gsap.set(trustedCornerMarks, { autoAlpha: 1 })
          if (trustedItems.length) gsap.set(trustedItems, { autoAlpha: 1 })
          if (socialProofPanel) gsap.set(socialProofPanel, { autoAlpha: 1, y: 0 })
          if (socialProofCornerMarks.length) gsap.set(socialProofCornerMarks, { autoAlpha: 1 })
          if (statItems.length) gsap.set(statItems, { autoAlpha: 1 })
          return
        }

        // Initial states via GSAP
        if (hudLines.length) gsap.set(hudLines, { scaleX: 0 })
        if (hudLabels.length) gsap.set(hudLabels, { autoAlpha: 0 })
        if (titleRef.current) gsap.set(titleRef.current, { autoAlpha: 0, y: 30 })
        if (subtitleRef.current) gsap.set(subtitleRef.current, { autoAlpha: 0, y: 20 })
        if (carouselShellRef.current) gsap.set(carouselShellRef.current, { autoAlpha: 0, y: 20 })
        if (trustedPanel) gsap.set(trustedPanel, { autoAlpha: 0, y: 20 })
        if (trustedCornerMarks.length) gsap.set(trustedCornerMarks, { autoAlpha: 0 })
        if (trustedItems.length) gsap.set(trustedItems, { autoAlpha: 0 })
        if (socialProofPanel) gsap.set(socialProofPanel, { autoAlpha: 0, y: 20 })
        if (socialProofCornerMarks.length) gsap.set(socialProofCornerMarks, { autoAlpha: 0 })
        if (statItems.length) gsap.set(statItems, { autoAlpha: 0 })

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

        // Phase 4: Carousel
        if (carouselShellRef.current) {
          tl.to(
            carouselShellRef.current,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.6,
              ease: 'power3.out',
            },
            '-=0.2',
          )
        }

        // Phase 5: Trusted panel
        if (trustedPanel) {
          tl.to(
            trustedPanel,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.6,
              ease: 'power3.out',
            },
            '-=0.2',
          )
        }

        // Phase 6: Trusted items
        if (trustedItems.length) {
          tl.to(
            trustedItems,
            {
              autoAlpha: 1,
              duration: 0.3,
              ease: 'power2.out',
              stagger: 0.08,
            },
            '-=0.3',
          )
        }

        // Phase 7: Social proof panel
        if (socialProofPanel) {
          tl.to(
            socialProofPanel,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.6,
              ease: 'power3.out',
            },
            '-=0.2',
          )
        }

        // Phase 8: Stat items
        if (statItems.length) {
          tl.to(
            statItems,
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

  return { goTo }
}
