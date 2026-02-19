'use client'

import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { HeroRefs } from './types'

gsap.registerPlugin(ScrollTrigger)

export function useHeroAnimations({
  sectionRef,
  mediaRef,
  headlineRef,
  subtitleRef,
  ctaRef,
  scrollRef,
}: HeroRefs) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      const chars = headlineRef.current?.querySelectorAll('.split-char')

      if (prefersReducedMotion) {
        gsap.set(chars ?? [], { autoAlpha: 1, y: 0 })
        gsap.set([subtitleRef.current, ctaRef.current], { autoAlpha: 1, y: 0 })
        gsap.set(scrollRef.current, { autoAlpha: 1 })
        gsap.set(mediaRef.current, { opacity: 0.6 })
        return
      }

      gsap.set(chars ?? [], { autoAlpha: 0, y: 50 })
      gsap.set([subtitleRef.current, ctaRef.current], {
        autoAlpha: 0,
        y: 50,
      })
      gsap.set(scrollRef.current, { autoAlpha: 0 })
      gsap.set(mediaRef.current, { opacity: 0 })

      const tl = gsap.timeline({ delay: 0.4 })

      tl.to(mediaRef.current, {
        opacity: 0.6,
        duration: 1.5,
        ease: 'power2.out',
      })
        .to(
          chars ?? [],
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.04,
            ease: 'power2.out',
          },
          '-=1.0',
        )
        .to(
          subtitleRef.current,
          { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power2.out' },
          '-=0.5',
        )
        .to(
          ctaRef.current,
          { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out' },
          '-=0.5',
        )
        .to(
          scrollRef.current,
          { autoAlpha: 1, duration: 0.6, ease: 'power2.out' },
          '-=0.3',
        )

      gsap.fromTo(
        mediaRef.current,
        { yPercent: -5 },
        {
          yPercent: 15,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        },
      )
    })

    return () => ctx.revert()
  }, [sectionRef, mediaRef, headlineRef, subtitleRef, ctaRef, scrollRef])
}
