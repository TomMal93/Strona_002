'use client'

import { useLayoutEffect } from 'react'
import type { RefObject } from 'react'

export type WhyIDoThisAnimationRefs = {
  sectionRef: RefObject<HTMLElement>
  titleRef: RefObject<HTMLHeadingElement>
  subtitleRef: RefObject<HTMLParagraphElement>
  hudBarRef: RefObject<HTMLDivElement>
  bioPanelRef: RefObject<HTMLDivElement>
}

export function useWhyIDoThisAnimations(refs: WhyIDoThisAnimationRefs): void {
  useLayoutEffect(() => {
    let shouldCleanup = false
    let observer: IntersectionObserver | undefined
    let revertContext: (() => void) | undefined

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const { titleRef, subtitleRef, hudBarRef, bioPanelRef } = refs

    const hudLines = hudBarRef.current
      ? Array.from(hudBarRef.current.querySelectorAll<HTMLElement>('[data-hud-line]'))
      : []
    const hudLabels = hudBarRef.current
      ? Array.from(hudBarRef.current.querySelectorAll<HTMLElement>('[data-hud-label]'))
      : []
    const bioWords = bioPanelRef.current
      ? Array.from(bioPanelRef.current.querySelectorAll<HTMLElement>('[data-why-word]'))
      : []
    const bioParagraphs = bioPanelRef.current
      ? Array.from(bioPanelRef.current.querySelectorAll<HTMLElement>('[data-why-paragraph]'))
      : []
    const videoBlock = bioPanelRef.current
      ? bioPanelRef.current.querySelector<HTMLElement>('[data-why-video-block]')
      : null
    const featureTitlesRaw = bioPanelRef.current
      ? Array.from(bioPanelRef.current.querySelectorAll<HTMLElement>('[data-why-feature-card]'))
      : []
    // Order top-to-bottom across both columns: row 0 left, row 0 right, row 1 left, ...
    const featureTitles = [...featureTitlesRaw].sort((a, b) => {
      const rowA = Number(a.dataset.whyFeatureRow ?? 0)
      const rowB = Number(b.dataset.whyFeatureRow ?? 0)
      if (rowA !== rowB) return rowA - rowB
      return featureTitlesRaw.indexOf(a) - featureTitlesRaw.indexOf(b)
    })

    if (prefersReducedMotion) {
      ;[titleRef.current, subtitleRef.current, bioPanelRef.current].forEach((el) => {
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
      bioWords.forEach((el) => {
        el.style.opacity = '1'
      })
      bioParagraphs.forEach((el) => {
        el.style.opacity = '1'
        el.style.visibility = 'inherit'
        el.style.transform = 'none'
      })
      if (videoBlock) {
        videoBlock.style.opacity = '1'
        videoBlock.style.visibility = 'inherit'
        videoBlock.style.transform = 'none'
      }
      featureTitles.forEach((el) => {
        el.style.opacity = '1'
        el.style.visibility = 'inherit'
        el.style.transform = 'none'
      })
      return
    }

    // Initial hidden states
    ;[titleRef.current, subtitleRef.current].forEach((el) => {
      if (el) {
        el.style.opacity = '0'
        el.style.visibility = 'hidden'
        el.style.transform = 'translate3d(0, 30px, 0)'
      }
    })
    if (bioPanelRef.current) {
      bioPanelRef.current.style.opacity = '0'
      bioPanelRef.current.style.visibility = 'hidden'
      bioPanelRef.current.style.transform = 'translate3d(0, 20px, 0)'
    }
    hudLines.forEach((el) => { el.style.transform = 'scaleX(0)' })
    hudLabels.forEach((el) => {
      el.style.opacity = '0'
      el.style.visibility = 'hidden'
    })
    bioWords.forEach((el) => {
      el.style.opacity = '0'
    })
    bioParagraphs.forEach((el) => {
      el.style.opacity = '0'
      el.style.visibility = 'hidden'
      el.style.transform = 'translate3d(0, -24px, 0)'
    })
    if (videoBlock) {
      videoBlock.style.opacity = '0'
      videoBlock.style.visibility = 'hidden'
      videoBlock.style.transform = 'translate3d(0, 20px, 0)'
    }
    featureTitles.forEach((el) => {
      el.style.opacity = '0'
      el.style.visibility = 'hidden'
      el.style.transform = 'translate3d(0, -20px, 0)'
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
            start: 'top 85%',
            once: true,
          },
        })

        // HUD lines
        if (hudLines.length) {
          tl.to(hudLines, {
            scaleX: 1, duration: 0.22, ease: 'power2.out', stagger: 0.01,
          })
        }

        // HUD labels
        if (hudLabels.length) {
          tl.to(hudLabels, {
            autoAlpha: 1, y: 0, duration: 0.14, ease: 'power2.out', stagger: 0.02,
          }, '-=0.06')
        }

        // Title
        tl.to(titleRef.current, {
          autoAlpha: 1, y: 0, duration: 0.62, ease: 'power3.out',
        }, '-=0.08')

        // Subtitle
        if (subtitleRef.current) {
          tl.to(subtitleRef.current, {
            autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out',
          }, '-=0.3')
        }

        // Bio panel fade in
        if (bioPanelRef.current) {
          tl.to(bioPanelRef.current, {
            autoAlpha: 1, y: 0, duration: 0.55, ease: 'power3.out',
          }, '-=0.2')
        }

        // Words become visible immediately so paragraph-level stagger drives the reveal
        if (bioWords.length) {
          tl.set(bioWords, { opacity: 1 }, '<')
        }

        // Paragraphs cascade in from top to bottom
        if (bioParagraphs.length) {
          tl.to(bioParagraphs, {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
            stagger: 0.18,
          }, '-=0.25')
        }

        // Video block reveals after the text
        if (videoBlock) {
          tl.to(videoBlock, {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
          }, '+=0.05')
        }

        // Feature titles cascade in from top to bottom (row by row, both columns)
        if (featureTitles.length) {
          tl.to(featureTitles, {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            ease: 'power3.out',
            stagger: 0.12,
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
