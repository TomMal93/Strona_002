'use client'

import { useEffect, useRef } from 'react'
import styles from '../Hero.module.css'

/**
 * FilmGrain — animated noise overlay for cinematic texture.
 *
 * Uses a tiny off-screen canvas to generate randomized noise,
 * then tiles it across the hero section via CSS background.
 * Re-generates every ~60ms for subtle movement without heavy GPU load.
 */
export default function FilmGrain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    // Small pattern tile — gets repeated via CSS
    const w = 128
    const h = 128
    canvas.width = w
    canvas.height = h

    let rafId: number
    let lastTime = 0
    const interval = 1000 / 16 // ~16fps is enough for grain

    function generateGrain(time: number) {
      if (time - lastTime < interval) {
        rafId = requestAnimationFrame(generateGrain)
        return
      }
      lastTime = time

      const imageData = ctx!.createImageData(w, h)
      const data = imageData.data

      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 255
        data[i] = v      // R
        data[i + 1] = v  // G
        data[i + 2] = v  // B
        data[i + 3] = 14 // Very low alpha for subtle grain
      }

      ctx!.putImageData(imageData, 0, 0)
      rafId = requestAnimationFrame(generateGrain)
    }

    rafId = requestAnimationFrame(generateGrain)

    return () => cancelAnimationFrame(rafId)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={styles.filmGrain}
      aria-hidden="true"
    />
  )
}
