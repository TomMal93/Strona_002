'use client'

import { useEffect, useRef } from 'react'
import styles from '../Hero.module.css'

/**
 * CinematicReveal — full-screen letterbox bars that slide away on load.
 *
 * Creates a film-style reveal:
 * 1. Black bars cover the viewport (top + bottom)
 * 2. After a short delay, bars slide out with easing
 * 3. Component unmounts after animation completes
 *
 * Uses GSAP for precise timing coordination with the hero entrance sequence.
 */
export default function CinematicReveal() {
  const topBarRef = useRef<HTMLDivElement>(null)
  const bottomBarRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      if (containerRef.current) containerRef.current.style.display = 'none'
      return
    }

    let shouldCleanup = false
    let revertContext: (() => void) | undefined

    const runReveal = async () => {
      const { gsap } = await import('gsap')
      if (shouldCleanup) return

      const ctx = gsap.context(() => {
        const tl = gsap.timeline()

        // Bars start fully covering the screen
        gsap.set([topBarRef.current, bottomBarRef.current], { yPercent: 0 })

        // After 0.3s, bars slide away
        tl.to(topBarRef.current, {
          yPercent: -100,
          duration: 1.2,
          ease: 'power4.inOut',
          delay: 0.3,
        })
        tl.to(bottomBarRef.current, {
          yPercent: 100,
          duration: 1.2,
          ease: 'power4.inOut',
        }, '<')

        // Hide container after bars are gone
        tl.set(containerRef.current, { display: 'none' })
      })

      revertContext = () => ctx.revert()
    }

    void runReveal()

    return () => {
      shouldCleanup = true
      revertContext?.()
    }
  }, [])

  return (
    <div ref={containerRef} className={styles.cinematicReveal}>
      <div ref={topBarRef} className={styles.letterboxBar} />
      <div ref={bottomBarRef} className={`${styles.letterboxBar} ${styles.letterboxBarBottom}`} />
    </div>
  )
}
