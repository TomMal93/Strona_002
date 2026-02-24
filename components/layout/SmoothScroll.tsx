'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * SmoothScroll — wraps the app with Lenis smooth-scroll.
 * Uses a dedicated requestAnimationFrame loop to avoid
 * GSAP global ticker side effects and random scroll stalls.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const lenis = new Lenis({
      duration: 0.9,
      smoothWheel: true,
    })

    lenis.on('scroll', ScrollTrigger.update)

    let rafId = 0
    const rafHandler = (time: number) => {
      lenis.raf(time)
      rafId = window.requestAnimationFrame(rafHandler)
    }

    rafId = window.requestAnimationFrame(rafHandler)

    return () => {
      window.cancelAnimationFrame(rafId)
      lenis.off('scroll', ScrollTrigger.update)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
