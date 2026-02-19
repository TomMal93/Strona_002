'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * SmoothScroll — wraps the app with Lenis smooth-scroll.
 * Integrates with GSAP ticker so ScrollTrigger always receives
 * Lenis scroll position (fix: aud_001 punkt 1).
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
    })

    lenis.on('scroll', ScrollTrigger.update)

    function rafHandler(time: number) {
      // GSAP ticker time is in seconds, Lenis expects milliseconds.
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(rafHandler)
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(rafHandler)
    }
  }, [])

  return <>{children}</>
}
