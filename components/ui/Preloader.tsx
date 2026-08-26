'use client'

import { gsap } from 'gsap'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { usePreloaderGate } from './usePreloaderGate'
import styles from './Preloader.module.css'

const SESSION_KEY = 'intro:played:v1'
const FADE_OUT_MS = 600

type Phase = 'visible' | 'gone'

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
  useLayoutEffect(() => {
    if (phase !== 'visible') return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      gsap.set(wordmarkRef.current, {
        autoAlpha: 1,
      })
      gsap.set(dividerRef.current, {
        autoAlpha: 1,
        scaleX: 1,
      })
      gsap.set(subtitleRef.current, {
        autoAlpha: 0.7,
      })
      return
    }

    const ctx = gsap.context(() => {
      gsap.set(wordmarkRef.current, { autoAlpha: 0 })
      gsap.set(dividerRef.current, {
        autoAlpha: 0,
        scaleX: 0.35,
        transformOrigin: 'center center',
      })
      gsap.set(subtitleRef.current, { autoAlpha: 0 })
    }, overlayRef)

    let cancelled = false
    let timeline: gsap.core.Timeline | null = null

    const startEntrance = () => {
      if (cancelled) return

      timeline = gsap.timeline({ defaults: { overwrite: 'auto' } })
      timeline.to(wordmarkRef.current, {
        autoAlpha: 1,
        duration: 1,
        ease: 'power2.out',
      })
      timeline.to(dividerRef.current, {
        autoAlpha: 1,
        scaleX: 1,
        duration: 0.9,
        ease: 'power3.out',
      }, '-=0.45')
      timeline.to(subtitleRef.current, {
        autoAlpha: 0.7,
        duration: 0.65,
        ease: 'power3.out',
      }, '-=0.55')
    }

    if (document.fonts) {
      void document.fonts.ready.then(startEntrance, startEntrance)
    } else {
      startEntrance()
    }

    return () => {
      cancelled = true
      timeline?.kill()
      ctx.revert()
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
      finish()
      return
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { overwrite: 'auto' },
        onComplete: finish,
      })
      tl.to(dividerRef.current, {
        autoAlpha: 0,
        xPercent: 130,
        scaleX: 0.82,
        duration: 0.46,
        ease: 'power3.in',
      })
      tl.to(subtitleRef.current, {
        autoAlpha: 0,
        y: -6,
        duration: 0.35,
        ease: 'power2.in',
      }, '<')
      tl.to(wordmarkRef.current, {
        autoAlpha: 0,
        y: -8,
        duration: 0.38,
        ease: 'power2.in',
      }, '<+=0.05')
      tl.to(overlayRef.current, {
        autoAlpha: 0,
        scale: 1.04,
        duration: FADE_OUT_MS / 1000,
        ease: 'power2.inOut',
      }, '-=0.08')
    }, overlayRef)

    return () => {
      ctx.revert()
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
          MALESZYK
          <span className={styles.dot}>.</span>
          <span className={styles.media}>MEDIA</span>
        </div>
        <span ref={dividerRef} aria-hidden="true" className={styles.divider} />
        <span ref={subtitleRef} className={styles.subtitle}>
          Fotografia &amp; Film
        </span>
      </div>
    </div>
  )
}
