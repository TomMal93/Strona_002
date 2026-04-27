'use client'

import { useEffect, useRef, useState } from 'react'
import { usePreloaderGate } from './usePreloaderGate'
import styles from './Preloader.module.css'

const SESSION_KEY = 'intro:played:v1'
const FADE_OUT_MS = 600

type Phase = 'visible' | 'leaving' | 'gone'

// Default to 'visible' so the overlay is part of the first paint (no FOUC
// where Hero flashes before the loader). The inline boot script in layout.tsx
// adds `html.intro-played` for returning visitors — we read it in useEffect
// and immediately switch to 'gone' for them.
export default function Preloader() {
  const [phase, setPhase] = useState<Phase>('visible')
  const overlayRef = useRef<HTMLDivElement>(null)
  const wordmarkRef = useRef<HTMLDivElement>(null)
  const dividerRef = useRef<HTMLSpanElement>(null)
  const subtitleRef = useRef<HTMLSpanElement>(null)

  // Skip immediately for returning visitors (within the same session).
  useEffect(() => {
    let alreadyPlayed = false
    try {
      alreadyPlayed = window.sessionStorage.getItem(SESSION_KEY) === '1'
    } catch {
      // sessionStorage unavailable — fall back to playing the intro.
    }
    if (alreadyPlayed) {
      setPhase('gone')
      return
    }
    document.body.classList.add('intro-active')
    window.dispatchEvent(new CustomEvent('intro:active'))
  }, [])

  const gate = usePreloaderGate(phase === 'visible')

  // Entrance animation while visible.
  useEffect(() => {
    if (phase !== 'visible') return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    let revert: (() => void) | undefined
    let cancelled = false

    void import('gsap').then(({ gsap }) => {
      if (cancelled) return
      const ctx = gsap.context(() => {
        gsap.set(wordmarkRef.current, { autoAlpha: 0, y: 24 })
        gsap.set(dividerRef.current, { scaleX: 0 })
        gsap.set(subtitleRef.current, { autoAlpha: 0, y: 8 })

        const tl = gsap.timeline()
        tl.to(wordmarkRef.current, {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
        })
        tl.to(dividerRef.current, {
          scaleX: 1,
          duration: 0.8,
          ease: 'power2.out',
        }, '-=0.5')
        tl.to(subtitleRef.current, {
          autoAlpha: 0.7,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
        }, '-=0.55')
      }, overlayRef)
      revert = () => ctx.revert()
    })

    return () => {
      cancelled = true
      revert?.()
    }
  }, [phase])

  // Leave when the gate opens.
  useEffect(() => {
    if (phase !== 'visible' || gate !== 'ready') return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const finish = () => {
      try {
        window.sessionStorage.setItem(SESSION_KEY, '1')
      } catch {
        // ignore
      }
      document.body.classList.remove('intro-active')
      window.dispatchEvent(new CustomEvent('intro:done'))
      setPhase('gone')
    }

    if (prefersReducedMotion) {
      setPhase('leaving')
      finish()
      return
    }

    setPhase('leaving')
    let cancelled = false
    void import('gsap').then(({ gsap }) => {
      if (cancelled) return
      gsap.to(overlayRef.current, {
        autoAlpha: 0,
        scale: 1.04,
        duration: FADE_OUT_MS / 1000,
        ease: 'power2.inOut',
        onComplete: finish,
      })
    })

    return () => {
      cancelled = true
    }
  }, [phase, gate])

  // Cleanup body class if component unmounts mid-intro.
  useEffect(() => {
    return () => {
      document.body.classList.remove('intro-active')
    }
  }, [])

  if (phase === 'gone') return null

  return (
    <div
      ref={overlayRef}
      className={styles.overlay}
      role="status"
      aria-live="polite"
      aria-label="Ładowanie strony"
      data-intro-overlay=""
    >
      <div aria-hidden="true" className={styles.halo} />
      <div className={styles.wordmarkRow}>
        <div ref={wordmarkRef} className={styles.wordmark}>
          <span className={styles.wordmarkPrimary}>MALESZYK.</span>
          <span className={styles.wordmarkAccent}>MEDIA</span>
        </div>
        <span ref={dividerRef} aria-hidden="true" className={styles.divider} />
        <span ref={subtitleRef} className={styles.subtitle}>
          Fotografia &amp; Film
        </span>
      </div>
    </div>
  )
}
