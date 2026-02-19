'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

/**
 * SmoothScroll — wraps the app with Lenis smooth-scroll.
 * Integrates with the global requestAnimationFrame loop so GSAP
 * ScrollTrigger can hook in seamlessly (tech-spec.md / ADR-002).
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
    })

    let frameId: number

    function raf(time: number) {
      lenis.raf(time)
      frameId = requestAnimationFrame(raf)
    }

    frameId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frameId)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
