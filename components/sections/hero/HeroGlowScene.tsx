'use client'

import { useEffect, useRef } from 'react'
import styles from '../Hero.module.css'

interface Star {
  x: number
  y: number
  size: number
  baseOpacity: number
  phase: number
  phaseSpeed: number
  isBright: boolean
}

function gaussianRandom(mean: number, sigma: number): number {
  const u = 1 - Math.random()
  const v = Math.random()
  const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
  return mean + z * sigma
}

function createStars(w: number, h: number): Star[] {
  const stars: Star[] = []
  const cx = w * 0.50
  const cy = h * 0.30

  // Gęsto skupione gwiazdy wokół głowy
  for (let i = 0; i < 68; i++) {
    stars.push({
      x: gaussianRandom(cx, w * 0.20),
      y: gaussianRandom(cy, h * 0.16),
      size: 0.35 + Math.random() * 1.3,
      baseOpacity: 0.14 + Math.random() * 0.58,
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: 0.004 + Math.random() * 0.011,
      isBright: Math.random() < 0.18,
    })
  }

  // Rzadkie gwiazdy rozrzucone po całej scenie
  for (let i = 0; i < 22; i++) {
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      size: 0.25 + Math.random() * 0.75,
      baseOpacity: 0.04 + Math.random() * 0.14,
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: 0.002 + Math.random() * 0.006,
      isBright: false,
    })
  }

  return stars
}

export default function HeroGlowScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let rafId: number
    let stars: Star[] = []

    function resize() {
      const parent = canvas!.parentElement
      if (!parent) return
      canvas!.width = parent.clientWidth
      canvas!.height = parent.clientHeight
      stars = createStars(canvas!.width, canvas!.height)
    }

    const ro = new ResizeObserver(resize)
    if (canvas.parentElement) ro.observe(canvas.parentElement)
    resize()

    function draw() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const s of stars) {
        s.phase += s.phaseSpeed
        const opacity = s.baseOpacity * (0.38 + 0.62 * Math.sin(s.phase))
        if (opacity <= 0) continue

        if (s.isBright) {
          // Halo świetlne wokół jasnej gwiazdy
          const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 9)
          glow.addColorStop(0, `rgba(165, 225, 235, ${opacity * 0.55})`)
          glow.addColorStop(1, 'rgba(0,0,0,0)')
          ctx.beginPath()
          ctx.arc(s.x, s.y, s.size * 9, 0, Math.PI * 2)
          ctx.fillStyle = glow
          ctx.fill()

          // Promienie krzyżowe (główne)
          ctx.save()
          ctx.strokeStyle = `rgba(190, 235, 245, ${opacity * 0.32})`
          ctx.lineWidth = 0.5
          const ray = s.size * 14
          ctx.beginPath()
          ctx.moveTo(s.x - ray, s.y)
          ctx.lineTo(s.x + ray, s.y)
          ctx.moveTo(s.x, s.y - ray)
          ctx.lineTo(s.x, s.y + ray)
          ctx.stroke()

          // Promienie ukośne (krótsze)
          ctx.strokeStyle = `rgba(190, 235, 245, ${opacity * 0.14})`
          const diag = ray * 0.55
          ctx.beginPath()
          ctx.moveTo(s.x - diag, s.y - diag)
          ctx.lineTo(s.x + diag, s.y + diag)
          ctx.moveTo(s.x + diag, s.y - diag)
          ctx.lineTo(s.x - diag, s.y + diag)
          ctx.stroke()
          ctx.restore()
        }

        // Rdzeń gwiazdy
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200, 232, 240, ${opacity})`
        ctx.fill()
      }

      rafId = requestAnimationFrame(draw)
    }

    if (!prefersReduced) rafId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
    }
  }, [])

  return (
    <div className={styles.glowScene}>
      <div className={styles.starHalo} />
      <canvas ref={canvasRef} className={styles.dustCanvas} />
    </div>
  )
}
