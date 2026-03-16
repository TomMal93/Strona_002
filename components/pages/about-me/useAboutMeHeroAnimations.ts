'use client'

import { useLayoutEffect } from 'react'
import type { RefObject } from 'react'

export type AboutMeHeroAnimationRefs = {
  sectionRef: RefObject<HTMLElement>
  bgRef: RefObject<HTMLDivElement>
  nameRef: RefObject<HTMLHeadingElement>
  taglineRef: RefObject<HTMLParagraphElement>
  hudOverlayRef: RefObject<HTMLDivElement>
}

export function useAboutMeHeroAnimations(refs: AboutMeHeroAnimationRefs): void {
  useLayoutEffect(() => {
    let shouldCleanup = false
    let revertContext: (() => void) | undefined

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const { nameRef, taglineRef, hudOverlayRef } = refs

    const hudElements = hudOverlayRef.current
      ? Array.from(hudOverlayRef.current.children) as HTMLElement[]
      : []

    if (prefersReducedMotion) {
      if (nameRef.current) {
        nameRef.current.style.opacity = '1'
        nameRef.current.style.clipPath = 'inset(0% 0% 0% 0%)'
      }
      if (taglineRef.current) {
        taglineRef.current.style.opacity = '1'
        taglineRef.current.style.transform = 'none'
      }
      hudElements.forEach((el) => {
        el.style.opacity = '1'
      })
      return
    }

    // Set initial hidden states
    if (nameRef.current) {
      nameRef.current.style.opacity = '0'
      nameRef.current.style.clipPath = 'inset(0% 100% 0% 0%)'
    }
    if (taglineRef.current) {
      taglineRef.current.style.opacity = '0'
      taglineRef.current.style.transform = 'translate3d(0, 20px, 0)'
    }
    hudElements.forEach((el) => {
      el.style.opacity = '0'
    })

    const initAnimations = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])

      if (shouldCleanup) return

      gsap.registerPlugin(ScrollTrigger)

      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ delay: 0.3 })

        // Clip-path wipe on name
        if (nameRef.current) {
          tl.to(nameRef.current, {
            opacity: 1,
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 0.9,
            ease: 'power3.out',
          })
        }

        // Tagline fade up
        if (taglineRef.current) {
          tl.to(
            taglineRef.current,
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: 'power2.out',
            },
            '-=0.4',
          )
        }

        // HUD elements stagger
        if (hudElements.length) {
          tl.to(
            hudElements,
            {
              opacity: 1,
              duration: 0.4,
              stagger: 0.08,
              ease: 'power2.out',
            },
            '-=0.3',
          )
        }

        // Parallax on background image
        const bgImg = refs.bgRef.current?.querySelector('img')
        if (bgImg) {
          ScrollTrigger.create({
            trigger: refs.sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
            animation: gsap.to(bgImg, { y: '-15%', ease: 'none' }),
          })
        }
      }, refs.sectionRef)

      revertContext = () => ctx.revert()
    }

    void initAnimations()

    return () => {
      shouldCleanup = true
      revertContext?.()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
