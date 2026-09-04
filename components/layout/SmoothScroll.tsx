'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

/**
 * SmoothScroll — wraps the app with Lenis smooth-scroll.
 * Uses a dedicated requestAnimationFrame loop to avoid
 * GSAP global ticker side effects and random scroll stalls.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    let disposed = false
    let disposeLenis: (() => void) | undefined

    void import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      if (disposed) return

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

      // Pause Lenis while the intro overlay is visible so the user can't scroll behind it.
      if (document.body.classList.contains('intro-active')) {
        lenis.stop()
      }
      const onIntroActive = () => lenis.stop()
      const onIntroDone = () => lenis.start()
      window.addEventListener('intro:active', onIntroActive)
      window.addEventListener('intro:done', onIntroDone)

      disposeLenis = () => {
        window.cancelAnimationFrame(rafId)
        window.removeEventListener('intro:active', onIntroActive)
        window.removeEventListener('intro:done', onIntroDone)
        lenis.off('scroll', ScrollTrigger.update)
        lenis.destroy()
      }
    })

    return () => {
      disposed = true
      disposeLenis?.()
    }
  }, [])

  return <>{children}</>
}
