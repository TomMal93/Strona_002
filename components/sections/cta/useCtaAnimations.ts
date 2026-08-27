'use client'

import { useLayoutEffect } from 'react'
import type { RefObject } from 'react'

export type CtaAnimationRefs = {
  sectionRef: RefObject<HTMLElement>
  eyebrowRef: RefObject<HTMLParagraphElement>
  titleRef: RefObject<HTMLHeadingElement>
  subtitleRef: RefObject<HTMLParagraphElement>
  subtitleDividerRef: RefObject<HTMLDivElement>
  primaryBtnRef: RefObject<HTMLAnchorElement>
  secondaryLinkRef: RefObject<HTMLAnchorElement>
  featuresRef: RefObject<HTMLDivElement>
  socialRef: RefObject<HTMLDivElement>
  mosaicRef: RefObject<HTMLDivElement>
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
        const socialLinks = refs.socialRef.current ? Array.from(refs.socialRef.current.children) : []
        const stories = refs.mosaicRef.current
          ? Array.from(refs.mosaicRef.current.children) as HTMLElement[]
          : []
        const storyImages = stories
          .map((story) => story.querySelector('img'))
          .filter((image): image is HTMLImageElement => image !== null)
        const all = [...copy, ...actions, ...features, ...socialLinks].filter(Boolean)

        if (reducedMotion) {
          gsap.set(all, { autoAlpha: 1, y: 0 })
          gsap.set(refs.subtitleDividerRef.current, { autoAlpha: 1, scaleX: 1 })
          gsap.set(stories, { autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0%)' })
          gsap.set(storyImages, { scale: 1 })
          return
        }

        gsap.set(copy, { autoAlpha: 0, y: 24 })
        gsap.set(features, { autoAlpha: 0, y: 16 })
        gsap.set(actions, { autoAlpha: 0, y: 18 })
        gsap.set(socialLinks, { autoAlpha: 0, y: 10 })
        gsap.set(refs.subtitleDividerRef.current, { autoAlpha: 0, scaleX: 0 })
        gsap.set(stories, {
          autoAlpha: 0,
          clipPath: 'inset(0% 0% 100% 0%)',
          willChange: 'clip-path, opacity',
        })
        gsap.set(storyImages, { scale: 1.1, willChange: 'transform' })

        const timeline = gsap.timeline({
          scrollTrigger: { trigger: refs.sectionRef.current, start: 'top 82%', once: true },
        })

        timeline
          .to(refs.eyebrowRef.current, {
            autoAlpha: 1,
            y: 0,
            duration: 0.36,
            ease: 'power2.out',
          }, 0)
          .to(refs.titleRef.current, {
            autoAlpha: 1,
            y: 0,
            duration: 0.62,
            ease: 'power3.out',
          }, 0.08)
          .addLabel('body', 0.52)
          .to(stories, {
            autoAlpha: 1,
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 0.9,
            stagger: 0.1,
            ease: 'power3.inOut',
            clearProps: 'clipPath,willChange',
          }, 'body')
          .to(storyImages, {
            scale: 1,
            duration: 1.25,
            stagger: 0.1,
            ease: 'power3.out',
            clearProps: 'transform,willChange',
          }, 'body')
          .to(refs.subtitleRef.current, {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
            ease: 'power3.out',
          }, 'body')
          .to(features, {
            autoAlpha: 1,
            y: 0,
            duration: 0.42,
            stagger: 0.1,
            ease: 'power3.out',
          }, 'body+=0.15')
          .to(refs.subtitleDividerRef.current, {
            autoAlpha: 1,
            scaleX: 1,
            duration: 0.55,
            ease: 'power3.out',
          }, 'body+=0.15')
          .to(refs.primaryBtnRef.current, {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
            ease: 'power3.out',
          }, 'body+=0.3')
          .to(refs.secondaryLinkRef.current, {
            autoAlpha: 1,
            y: 0,
            duration: 0.4,
            ease: 'power3.out',
          }, 'body+=0.38')
          .to(socialLinks, {
            autoAlpha: 1,
            y: 0,
            duration: 0.35,
            stagger: 0.06,
            ease: 'power2.out',
          }, 'body+=0.38')
      }, refs.sectionRef)

      revertContext = () => ctx.revert()
    }

    void initAnimations()
    return () => { shouldCleanup = true; revertContext?.() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
