'use client'

import { useLayoutEffect } from 'react'
import type { RefObject } from 'react'

export type AboutMeGearAnimationRefs = {
  sectionRef: RefObject<HTMLElement>
  titleRef: RefObject<HTMLHeadingElement>
  subtitleRef: RefObject<HTMLParagraphElement>
  hudBarRef: RefObject<HTMLDivElement>
  statsGridRef: RefObject<HTMLDivElement>
  equipGridRef: RefObject<HTMLDivElement>
}

export function useAboutMeGearAnimations(refs: AboutMeGearAnimationRefs): void {
  useLayoutEffect(() => {
    let shouldCleanup = false
    let observer: IntersectionObserver | undefined
    let revertContext: (() => void) | undefined

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const { titleRef, subtitleRef, hudBarRef, statsGridRef, equipGridRef } = refs

    const hudLines = hudBarRef.current
      ? Array.from(hudBarRef.current.querySelectorAll<HTMLElement>('[data-hud-line]'))
      : []
    const hudLabels = hudBarRef.current
      ? Array.from(hudBarRef.current.querySelectorAll<HTMLElement>('[data-hud-label]'))
      : []
    const statItems = statsGridRef.current
      ? Array.from(statsGridRef.current.querySelectorAll<HTMLElement>('[data-stat-item]'))
      : []
    const statAccents = statsGridRef.current
      ? Array.from(statsGridRef.current.querySelectorAll<HTMLElement>('[data-stat-accent]'))
      : []
    const equipCards = equipGridRef.current
      ? Array.from(equipGridRef.current.querySelectorAll<HTMLElement>('[data-equip-card]'))
      : []

    const headerElements = [titleRef.current, subtitleRef.current]

    if (prefersReducedMotion) {
      headerElements.forEach((el) => {
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
      statItems.forEach((el) => {
        el.style.opacity = '1'
        el.style.transform = 'none'
      })
      statAccents.forEach((el) => { el.style.transform = 'scaleX(1)' })
      equipCards.forEach((el) => {
        el.style.opacity = '1'
        el.style.transform = 'none'
      })
      return
    }

    // Initial hidden states
    headerElements.forEach((el) => {
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
    statItems.forEach((el) => {
      el.style.opacity = '0'
      el.style.transform = 'translate3d(0, 20px, 0)'
    })
    statAccents.forEach((el) => { el.style.transform = 'scaleX(0)' })
    equipCards.forEach((el) => {
      el.style.opacity = '0'
      el.style.transform = 'translate3d(0, 24px, 0)'
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

        // Header
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

        // Stats — count-up
        if (statItems.length) {
          tl.to(statItems, {
            opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out',
          }, '-=0.2')

          // Animate stat numbers (count-up)
          const statValueEls = statsGridRef.current
            ? Array.from(statsGridRef.current.querySelectorAll<HTMLElement>('[data-stat-value]'))
            : []
          statValueEls.forEach((el) => {
            const target = parseInt(el.dataset.target || '0', 10)
            const obj = { val: 0 }
            tl.to(obj, {
              val: target,
              duration: 1.2,
              ease: 'power2.out',
              snap: { val: 1 },
              onUpdate() {
                el.textContent = String(Math.round(obj.val))
              },
            }, '<')
          })
        }

        // Accent lines
        if (statAccents.length) {
          tl.to(statAccents, {
            scaleX: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out',
          }, '-=0.8')
        }

        // Equipment cards
        if (equipCards.length) {
          tl.to(equipCards, {
            opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out',
          }, '-=0.4')
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
