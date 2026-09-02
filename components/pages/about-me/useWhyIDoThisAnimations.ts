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
    let layoutObserver: ResizeObserver | undefined
    let revertContext: (() => void) | undefined

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const { titleRef, subtitleRef, hudBarRef, bioPanelRef } = refs
    const storyRail = hudBarRef.current

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
    const quoteFooter = bioPanelRef.current
      ? bioPanelRef.current.querySelector<HTMLElement>('[data-why-quote-footer]')
      : null
    const missionBlock = bioPanelRef.current
      ? bioPanelRef.current.querySelector<HTMLElement>('[data-why-mission-block]')
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

    const desktopLayout = window.matchMedia('(min-width: 48rem)')
    const canAttachFooterToVideo = window.matchMedia('(min-width: 1200px)')
    const alignQuoteFooterWithVideo = () => {
      if (!quoteFooter || !storyRail || !videoBlock || !desktopLayout.matches) {
        quoteFooter?.style.removeProperty('margin-right')
        quoteFooter?.style.removeProperty('margin-top')
        return
      }

      const railRight = storyRail.getBoundingClientRect().right
      const videoRect = videoBlock.getBoundingClientRect()
      const missionBottom = missionBlock?.getBoundingClientRect().bottom ?? 0
      const footerTop = quoteFooter.getBoundingClientRect().top
      const currentMarginTop = Number.parseFloat(getComputedStyle(quoteFooter).marginTop) || 0
      const footerRect = quoteFooter.getBoundingClientRect()
      const layoutScale = quoteFooter.offsetWidth > 0
        ? footerRect.width / quoteFooter.offsetWidth
        : 1

      const videoRight = videoRect.right
      quoteFooter.style.marginRight = `${Math.max(0, railRight - videoRight) / layoutScale}px`
      if (canAttachFooterToVideo.matches) {
        const contentBottom = Math.max(videoRect.bottom, missionBottom)
        quoteFooter.style.marginTop = `${currentMarginTop + (contentBottom - footerTop) / layoutScale}px`
      } else {
        quoteFooter.style.removeProperty('margin-top')
      }
    }

    if (quoteFooter && storyRail && videoBlock) {
      alignQuoteFooterWithVideo()
      layoutObserver = new ResizeObserver(alignQuoteFooterWithVideo)
      layoutObserver.observe(storyRail)
      layoutObserver.observe(videoBlock)
      if (missionBlock) layoutObserver.observe(missionBlock)
      desktopLayout.addEventListener('change', alignQuoteFooterWithVideo)
      canAttachFooterToVideo.addEventListener('change', alignQuoteFooterWithVideo)
    }

    if (prefersReducedMotion) {
      ;[titleRef.current, subtitleRef.current, bioPanelRef.current].forEach((el) => {
        if (el) {
          el.style.opacity = '1'
          el.style.visibility = 'inherit'
          el.style.transform = 'none'
        }
      })
      hudLines.forEach((el) => { el.style.transform = 'scaleX(1)' })
      storyRail?.style.setProperty('--story-line-scale', '1')
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
      return () => {
        layoutObserver?.disconnect()
        desktopLayout.removeEventListener('change', alignQuoteFooterWithVideo)
        canAttachFooterToVideo.removeEventListener('change', alignQuoteFooterWithVideo)
      }
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
    storyRail?.style.setProperty('--story-line-scale', '0')
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

        // Reveal act headings and their animated text in the same timeline window.
        tl.addLabel('actsEnter')

        if (bioPanelRef.current) {
          tl.to(bioPanelRef.current, {
            autoAlpha: 1, y: 0, duration: 0.55, ease: 'power3.out',
          }, 'actsEnter')
        }

        // Draw the vertical story axis while the acts enter.
        if (storyRail) {
          tl.to(storyRail, {
            '--story-line-scale': 1,
            duration: 1.2,
            ease: 'power2.out',
          }, 'actsEnter+=0.1')
        }

        // Words become visible as soon as the act headings start entering.
        if (bioWords.length) {
          tl.set(bioWords, { opacity: 1 }, 'actsEnter')
        }

        // Keep the paragraph reveal, but start it together with the act headings.
        if (bioParagraphs.length) {
          tl.to(bioParagraphs, {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
            stagger: 0.18,
          }, 'actsEnter')
        }

        // Feature text belongs to the acts, so it should not wait for the video.
        if (featureTitles.length) {
          tl.to(featureTitles, {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            ease: 'power3.out',
            stagger: 0.12,
          }, 'actsEnter+=0.1')
        }

        // Video block keeps its own reveal after the act content has started.
        if (videoBlock) {
          tl.to(videoBlock, {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
          }, '+=0.05')
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
      layoutObserver?.disconnect()
      desktopLayout.removeEventListener('change', alignQuoteFooterWithVideo)
      canAttachFooterToVideo.removeEventListener('change', alignQuoteFooterWithVideo)
      revertContext?.()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
