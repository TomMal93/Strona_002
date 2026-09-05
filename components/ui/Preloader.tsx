'use client'

import { useEffect, useState } from 'react'
import { usePreloaderGate } from './usePreloaderGate'
import styles from './Preloader.module.css'

const SESSION_KEY = 'intro:played:v1'
const FADE_OUT_MS = 400

type Phase = 'visible' | 'leaving' | 'gone'

export default function Preloader() {
  const [phase, setPhase] = useState<Phase>('visible')

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
      document.body.classList.remove('intro-active')
      window.dispatchEvent(new CustomEvent('intro:done'))
      setPhase('gone')
      return
    }

    document.body.classList.add('intro-active')
    window.dispatchEvent(new CustomEvent('intro:active'))
  }, [])

  const gate = usePreloaderGate(phase === 'visible')

  useEffect(() => {
    if (phase !== 'visible' || gate !== 'ready') return

    try {
      window.sessionStorage.setItem(SESSION_KEY, '1')
    } catch {
      // sessionStorage is optional.
    }
    document.body.classList.remove('intro-active')
    window.dispatchEvent(new CustomEvent('intro:done'))

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('gone')
      return
    }

    setPhase('leaving')
  }, [phase, gate])

  useEffect(() => {
    if (phase !== 'leaving') return

    const timeoutId = window.setTimeout(() => setPhase('gone'), FADE_OUT_MS)
    return () => window.clearTimeout(timeoutId)
  }, [phase])

  useEffect(() => () => {
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
      <div className={styles.wordmarkRow}>
        <div className={styles.wordmark}>
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
