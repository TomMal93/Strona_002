'use client'

import { useLayoutEffect } from 'react'
import type { RefObject } from 'react'

export type CtaAnimationRefs = {
  sectionRef: RefObject<HTMLElement>
  eyebrowRef: RefObject<HTMLParagraphElement>
  titleRef: RefObject<HTMLHeadingElement>
  subtitleRef: RefObject<HTMLParagraphElement>
  primaryBtnRef: RefObject<HTMLAnchorElement>
  secondaryLinkRef: RefObject<HTMLAnchorElement>
  featuresRef: RefObject<HTMLDivElement>
}

export function useCtaAnimations(refs: CtaAnimationRefs): void {
  useLayoutEffect(() => {
    let shouldCleanup = false
    let revertContext: (() => void) | undefined
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const initAnimations = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
      if (shouldCleanup) return
      gsap.registerPlugin(ScrollTrigger)

      const ctx = gsap.context(() => {
        const copy = [refs.eyebrowRef.current, refs.titleRef.current, refs.subtitleRef.current]
        const actions = [refs.primaryBtnRef.current, refs.secondaryLinkRef.current]
        const features = refs.featuresRef.current ? Array.from(refs.featuresRef.current.children) : []
        const all = [...copy, ...actions, ...features].filter(Boolean)

        if (reducedMotion) {
          gsap.set(all, { autoAlpha: 1, y: 0 })
          return
        }

        gsap.set(copy, { autoAlpha: 0, y: 24 })
        gsap.set(features, { autoAlpha: 0, y: 16 })
        gsap.set(actions, { autoAlpha: 0, y: 18 })

        gsap.timeline({ scrollTrigger: { trigger: refs.sectionRef.current, start: 'top 82%', once: true } })
          .to(refs.eyebrowRef.current, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power2.out' })
          .to(refs.titleRef.current, { autoAlpha: 1, y: 0, duration: 0.72, ease: 'power3.out' }, '-=0.2')
          .to(refs.subtitleRef.current, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power3.out' }, '-=0.38')
          .to(features, { autoAlpha: 1, y: 0, duration: 0.42, stagger: 0.1, ease: 'power3.out' }, '-=0.2')
          .to(refs.primaryBtnRef.current, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power3.out' }, '-=0.2')
          .to(refs.secondaryLinkRef.current, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out' }, '-=0.3')
      }, refs.sectionRef)

      revertContext = () => ctx.revert()
    }

    void initAnimations()
    return () => { shouldCleanup = true; revertContext?.() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
