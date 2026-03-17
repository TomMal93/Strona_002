'use client'

import { useLayoutEffect } from 'react'
import type { RefObject } from 'react'

export type AboutMeVideoAnimationRefs = {
  sectionRef: RefObject<HTMLElement>
  titleRef: RefObject<HTMLHeadingElement>
  subtitleRef: RefObject<HTMLParagraphElement>
  hudBarRef: RefObject<HTMLDivElement>
  videoShellRef: RefObject<HTMLDivElement>
}

export function useAboutMeVideoAnimations(refs: AboutMeVideoAnimationRefs): void {
  useLayoutEffect(() => {
    let shouldCleanup = false
    let observer: IntersectionObserver | undefined
    let revertContext: (() => void) | undefined

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const { titleRef, subtitleRef, hudBarRef, videoShellRef } = refs

    const hudLines = hudBarRef.current
      ? Array.from(hudBarRef.current.querySelectorAll<HTMLElement>('[data-hud-line]'))
      : []
    const hudLabels = hudBarRef.current
      ? Array.from(hudBarRef.current.querySelectorAll<HTMLElement>('[data-hud-label]'))
      : []

    const elements = [titleRef.current, subtitleRef.current, videoShellRef.current]

    if (prefersReducedMotion) {
      elements.forEach((el) => {
        if (el) {
          el.style.opacity = '1'
          el.style.visibility = 'inherit'
          el.style.transform = 'none'
        }
      })
      hudLines.forEach((el) => { el.style.transform = 'scaleX(1)' })
      hudLabels.forEach((el) => {
        el.style.opacity = '1'
        el.style.visibility = 'inherit'
      })
      return
    }

    elements.forEach((el) => {
      if (el) {
        el.style.opacity = '0'
        el.style.visibility = 'hidden'
        el.style.transform = 'translate3d(0, 30px, 0)'
      }
    })
    hudLines.forEach((el) => { el.style.transform = 'scaleX(0)' })
    hudLabels.forEach((el) => {
      el.style.opacity = '0'
      el.style.visibility = 'hidden'
    })

    const initAnimations = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])

      if (shouldCleanup) return
      gsap.registerPlugin(ScrollTrigger)

      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: refs.sectionRef.current,
            start: 'top 70%',
            once: true,
          },
        })

        if (hudLines.length) {
          tl.to(hudLines, {
            scaleX: 1, duration: 0.22, ease: 'power2.out', stagger: 0.01,
          })
        }

        if (hudLabels.length) {
          tl.to(hudLabels, {
            autoAlpha: 1, y: 0, duration: 0.14, ease: 'power2.out', stagger: 0.02,
          }, '-=0.06')
        }

        tl.to(titleRef.current, {
          autoAlpha: 1, y: 0, duration: 0.62, ease: 'power3.out',
        }, '-=0.08')

        if (subtitleRef.current) {
          tl.to(subtitleRef.current, {
            autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out',
          }, '-=0.3')
        }

        if (videoShellRef.current) {
          tl.to(videoShellRef.current, {
            autoAlpha: 1, y: 0, duration: 0.72, ease: 'power3.out',
          }, '-=0.2')
        }
      }, refs.sectionRef)

      revertContext = () => ctx.revert()
    }

    if (refs.sectionRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((e) => e.isIntersecting)) return
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
