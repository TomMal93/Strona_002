'use client'

import { useLayoutEffect } from 'react'
import type { RefObject } from 'react'

export type CtaAnimationRefs = {
  sectionRef: RefObject<HTMLElement>
  titleRef: RefObject<HTMLHeadingElement>
  subtitleRef: RefObject<HTMLParagraphElement>
  hudBarRef: RefObject<HTMLDivElement>
  statsRef: RefObject<HTMLDivElement>
  descRef: RefObject<HTMLParagraphElement>
  buttonsRef: RefObject<HTMLDivElement>
  cornerTLRef: RefObject<HTMLSpanElement>
  cornerTRRef: RefObject<HTMLSpanElement>
  cornerBLRef: RefObject<HTMLSpanElement>
  cornerBRRef: RefObject<HTMLSpanElement>
  crosshairTopRef: RefObject<HTMLSpanElement>
  crosshairBottomRef: RefObject<HTMLSpanElement>
  glowRef: RefObject<HTMLDivElement>
  separatorRef: RefObject<HTMLDivElement>
}

/* ── Count-up helper ──────────────────────────────────────────────────── */

function animateCountUp(
  el: HTMLElement,
  target: string,
  duration: number,
  gsapInstance: typeof import('gsap')['gsap'],
) {
  // Extract numeric part and suffix (e.g. "200+" → 200, "+")
  const match = target.match(/^(\d+)(.*)$/)
  if (!match) {
    // Non-numeric values like "4K" — just reveal
    el.textContent = target
    return
  }

  const endValue = parseInt(match[1], 10)
  const suffix = match[2] || ''
  const proxy = { val: 0 }

  gsapInstance.to(proxy, {
    val: endValue,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      el.textContent = `${Math.round(proxy.val)}${suffix}`
    },
  })
}

export function useCtaAnimations(refs: CtaAnimationRefs): void {
  useLayoutEffect(() => {
    let shouldCleanup = false
    let observer: IntersectionObserver | undefined
    let revertContext: (() => void) | undefined

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const allCorners = [
      refs.cornerTLRef,
      refs.cornerTRRef,
      refs.cornerBLRef,
      refs.cornerBRRef,
    ]
    const allCrosshairs = [refs.crosshairTopRef, refs.crosshairBottomRef]

    const setInitialStyles = () => {
      const {
        titleRef, hudBarRef, statsRef, descRef, buttonsRef,
        subtitleRef, glowRef, separatorRef,
      } = refs

      const hudLines = hudBarRef.current
        ? Array.from(hudBarRef.current.querySelectorAll<HTMLElement>('[data-hud-line]'))
        : []
      const hudLabels = hudBarRef.current
        ? Array.from(hudBarRef.current.querySelectorAll<HTMLElement>('[data-hud-label]'))
        : []

      if (prefersReducedMotion) {
        ;[titleRef, subtitleRef, statsRef, descRef, buttonsRef].forEach((ref) => {
          if (ref.current) {
            ref.current.style.opacity = '1'
            ref.current.style.visibility = 'inherit'
            ref.current.style.transform = 'none'
          }
        })
        hudLines.forEach((el) => { el.style.transform = 'scaleX(1)' })
        hudLabels.forEach((el) => {
          el.style.opacity = '1'
          el.style.visibility = 'inherit'
        })
        allCorners.forEach((ref) => {
          if (ref.current) ref.current.style.opacity = '0.5'
        })
        allCrosshairs.forEach((ref) => {
          if (ref.current) ref.current.style.opacity = '0.4'
        })
        if (separatorRef.current) {
          separatorRef.current.style.transform = 'scaleX(1)'
        }
        if (glowRef.current) {
          glowRef.current.style.opacity = '1'
        }
        return
      }

      // Hidden initial states
      ;[titleRef, subtitleRef, descRef, buttonsRef].forEach((ref) => {
        if (ref.current) {
          ref.current.style.opacity = '0'
          ref.current.style.visibility = 'hidden'
          ref.current.style.transform = 'translate3d(0, 30px, 0)'
        }
      })
      if (statsRef.current) {
        statsRef.current.style.opacity = '0'
        statsRef.current.style.visibility = 'hidden'
        statsRef.current.style.transform = 'translate3d(0, 20px, 0) scale(0.97)'
      }
      hudLines.forEach((el) => { el.style.transform = 'scaleX(0)' })
      hudLabels.forEach((el) => {
        el.style.opacity = '0'
        el.style.visibility = 'hidden'
      })
      allCorners.forEach((ref) => {
        if (ref.current) ref.current.style.opacity = '0'
      })
      allCrosshairs.forEach((ref) => {
        if (ref.current) ref.current.style.opacity = '0'
      })
      if (separatorRef.current) {
        separatorRef.current.style.transform = 'scaleX(0)'
      }
      if (glowRef.current) {
        glowRef.current.style.opacity = '0'
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

      const {
        sectionRef, titleRef, subtitleRef, hudBarRef,
        statsRef, descRef, buttonsRef, glowRef, separatorRef,
      } = refs

      const ctx = gsap.context(() => {
        const hudLines = hudBarRef.current
          ? Array.from(hudBarRef.current.querySelectorAll('[data-hud-line]'))
          : []
        const hudLabels = hudBarRef.current
          ? Array.from(hudBarRef.current.querySelectorAll('[data-hud-label]'))
          : []

        const cornerEls = allCorners
          .map((ref) => ref.current)
          .filter(Boolean) as HTMLElement[]

        const crosshairEls = allCrosshairs
          .map((ref) => ref.current)
          .filter(Boolean) as HTMLElement[]

        // Stat value elements for count-up
        const statValueEls = statsRef.current
          ? Array.from(statsRef.current.querySelectorAll<HTMLElement>('[data-stat-value]'))
          : []

        if (prefersReducedMotion) {
          if (titleRef.current) gsap.set(titleRef.current, { autoAlpha: 1, y: 0 })
          if (subtitleRef.current) gsap.set(subtitleRef.current, { autoAlpha: 1, y: 0 })
          if (hudLines.length) gsap.set(hudLines, { scaleX: 1 })
          if (hudLabels.length) gsap.set(hudLabels, { autoAlpha: 1 })
          if (statsRef.current) gsap.set(statsRef.current, { autoAlpha: 1, y: 0, scale: 1 })
          if (descRef.current) gsap.set(descRef.current, { autoAlpha: 1, y: 0 })
          if (buttonsRef.current) gsap.set(buttonsRef.current, { autoAlpha: 1, y: 0 })
          if (cornerEls.length) gsap.set(cornerEls, { opacity: 0.5 })
          if (crosshairEls.length) gsap.set(crosshairEls, { opacity: 0.4 })
          if (glowRef.current) gsap.set(glowRef.current, { opacity: 1 })
          if (separatorRef.current) gsap.set(separatorRef.current, { scaleX: 1 })
          return
        }

        // Initial states via GSAP
        if (hudLines.length) gsap.set(hudLines, { scaleX: 0 })
        if (hudLabels.length) gsap.set(hudLabels, { autoAlpha: 0 })
        if (titleRef.current) gsap.set(titleRef.current, { autoAlpha: 0, y: 30 })
        if (subtitleRef.current) gsap.set(subtitleRef.current, { autoAlpha: 0, y: 20 })
        if (statsRef.current) gsap.set(statsRef.current, { autoAlpha: 0, y: 20, scale: 0.97 })
        if (descRef.current) gsap.set(descRef.current, { autoAlpha: 0, y: 20, filter: 'blur(4px)' })
        if (buttonsRef.current) gsap.set(buttonsRef.current, { autoAlpha: 0, y: 20 })
        if (cornerEls.length) gsap.set(cornerEls, { opacity: 0, scale: 0.5 })
        if (crosshairEls.length) gsap.set(crosshairEls, { opacity: 0, scale: 0 })
        if (glowRef.current) gsap.set(glowRef.current, { opacity: 0, scale: 0.8 })
        if (separatorRef.current) gsap.set(separatorRef.current, { scaleX: 0 })

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
            { autoAlpha: 1, duration: 0.3, ease: 'power2.out', stagger: 0.06 },
            '-=0.2',
          )
        }

        // Phase 2: Title
        tl.to(
          titleRef.current,
          { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' },
          '-=0.1',
        )

        // Phase 3: Subtitle
        if (subtitleRef.current) {
          tl.to(
            subtitleRef.current,
            { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out' },
            '-=0.2',
          )
        }

        // Phase 4: Glow fade in
        if (glowRef.current) {
          tl.to(
            glowRef.current,
            { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' },
            '-=0.3',
          )
        }

        // Phase 5: Corner marks draw-in
        if (cornerEls.length) {
          tl.to(
            cornerEls,
            {
              opacity: 0.5,
              scale: 1,
              duration: 0.6,
              ease: 'power3.out',
              stagger: 0.08,
              onComplete: () => {
                cornerEls.forEach((el) => {
                  el.style.animationPlayState = 'running'
                })
              },
            },
            '-=0.8',
          )
        }

        // Phase 6: Crosshairs pop in
        if (crosshairEls.length) {
          tl.to(
            crosshairEls,
            {
              opacity: 0.4,
              scale: 1,
              duration: 0.5,
              ease: 'back.out(1.7)',
              stagger: 0.1,
              onComplete: () => {
                crosshairEls.forEach((el) => {
                  el.style.animationPlayState = 'running'
                })
              },
            },
            '-=0.4',
          )
        }

        // Phase 7: Stats strip — slide up + scale in, then count-up
        if (statsRef.current) {
          tl.to(
            statsRef.current,
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              ease: 'power3.out',
              onComplete: () => {
                // Trigger count-up on each stat value
                statValueEls.forEach((el) => {
                  const target = el.getAttribute('data-target')
                  if (target) {
                    animateCountUp(el, target, 1.6, gsap)
                  }
                })
              },
            },
            '-=0.3',
          )
        }

        // Phase 8: Separator line
        if (separatorRef.current) {
          tl.to(
            separatorRef.current,
            { scaleX: 1, duration: 0.6, ease: 'power2.out' },
            '-=0.4',
          )
        }

        // Phase 9: Description — blur-to-sharp
        if (descRef.current) {
          tl.to(
            descRef.current,
            {
              autoAlpha: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: 0.8,
              ease: 'power3.out',
            },
            '-=0.3',
          )
        }

        // Phase 10: Buttons
        if (buttonsRef.current) {
          tl.to(
            buttonsRef.current,
            { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' },
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
