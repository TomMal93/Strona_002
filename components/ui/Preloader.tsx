'use client'

import { useEffect, useRef, useState } from 'react'
import { usePreloaderGate } from './usePreloaderGate'
import styles from './Preloader.module.css'

const SESSION_KEY = 'intro:played:v1'
const FADE_OUT_MS = 400

type Phase = 'visible' | 'leaving' | 'gone'

function finishIntro() {
  document.documentElement.classList.remove('intro-active')
  document.body.classList.remove('intro-active')
  window.dispatchEvent(new CustomEvent('intro:done'))
}

export default function Preloader() {
  const [phase, setPhase] = useState<Phase>('visible')
  const [typographyReady, setTypographyReady] = useState(false)
  const wordmarkRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let alreadyPlayed = false
    try {
      alreadyPlayed = window.sessionStorage.getItem(SESSION_KEY) === '1'
    } catch {
      // sessionStorage unavailable — fall back to playing the intro.
    }

    // On small screens the poster is the critical visual and must paint
    // immediately; the decorative intro is reserved for larger viewports.
    const isSmallViewport = window.matchMedia('(max-width: 767px)').matches
    if (alreadyPlayed || isSmallViewport) {
      if (isSmallViewport) {
        try {
          window.sessionStorage.setItem(SESSION_KEY, '1')
        } catch {
          // sessionStorage is optional.
        }
      }
      finishIntro()
      setPhase('gone')
      return
    }

    document.documentElement.classList.add('intro-active')
    document.body.classList.add('intro-active')
    window.dispatchEvent(new CustomEvent('intro:active'))
  }, [])

  useEffect(() => {
    if (phase !== 'visible') return

    const wordmark = wordmarkRef.current
    if (!wordmark || !document.fonts) {
      setTypographyReady(true)
      return
    }

    const { fontFamily } = window.getComputedStyle(wordmark)
    let cancelled = false

    void document.fonts
      .load(`400 16px ${fontFamily}`, 'MALESZYK.MEDIA Fotografia & Film')
      .then(() => {
        if (!cancelled) setTypographyReady(true)
      }, () => {
        if (!cancelled) setTypographyReady(true)
      })

    return () => {
      cancelled = true
    }
  }, [phase])

  const gate = usePreloaderGate(phase === 'visible')

  useEffect(() => {
    if (phase !== 'visible' || gate !== 'ready') return

    try {
      window.sessionStorage.setItem(SESSION_KEY, '1')
    } catch {
      // sessionStorage is optional.
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finishIntro()
      setPhase('gone')
      return
    }

    setPhase('leaving')
  }, [phase, gate])

  useEffect(() => {
    if (phase !== 'leaving') return

    const timeoutId = window.setTimeout(() => {
      finishIntro()
      setPhase('gone')
    }, FADE_OUT_MS)
    return () => window.clearTimeout(timeoutId)
  }, [phase])

  useEffect(() => () => {
    document.documentElement.classList.remove('intro-active')
    document.body.classList.remove('intro-active')
  }, [])

  if (phase === 'gone') return null

  return (
    <div
      className={`${styles.overlay} ${phase === 'leaving' ? styles.overlayLeaving : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Ładowanie strony"
      data-intro-overlay=""
    >
      <div aria-hidden="true" className={styles.halo} />
      <div
        className={`${styles.wordmarkRow} ${typographyReady ? styles.wordmarkRowReady : ''}`}
      >
        <div ref={wordmarkRef} className={styles.wordmark}>
          MALESZYK
          <span className={styles.dot}>.</span>
          <span className={styles.media}>MEDIA</span>
        </div>
        <span aria-hidden="true" className={styles.divider} />
        <span className={styles.subtitle}>Fotografia &amp; Film</span>
      </div>
    </div>
  )
}
