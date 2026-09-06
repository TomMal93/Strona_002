'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

/**
 * SmoothScroll — wraps the app with Lenis smooth-scroll.
 * Uses a dedicated requestAnimationFrame loop to avoid
 * GSAP global ticker side effects and random scroll stalls.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const lenisRef = useRef<import('lenis').default | null>(null)
  const previousPathnameRef = useRef(pathname)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobileViewport = window.matchMedia('(max-width: 767px)').matches
    if (prefersReducedMotion || isMobileViewport) return

    let disposed = false
    let disposeLenis: (() => void) | undefined

    void Promise.all([
      import('lenis'),
      import('gsap/ScrollTrigger'),
    ]).then(([{ default: Lenis }, { ScrollTrigger }]) => {
      if (disposed) return

      const lenis = new Lenis({
        duration: 0.9,
        smoothWheel: true,
        anchors: {
          offset: -72,
        },
      })
      lenisRef.current = lenis

      lenis.on('scroll', ScrollTrigger.update)

      let refreshRafId = 0
      const refreshScrollTriggers = () => {
        window.cancelAnimationFrame(refreshRafId)
        refreshRafId = window.requestAnimationFrame(() => ScrollTrigger.refresh())
      }
      window.addEventListener('resize', refreshScrollTriggers)
      window.addEventListener('orientationchange', refreshScrollTriggers)

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
        window.cancelAnimationFrame(refreshRafId)
        window.removeEventListener('resize', refreshScrollTriggers)
        window.removeEventListener('orientationchange', refreshScrollTriggers)
        window.removeEventListener('intro:active', onIntroActive)
        window.removeEventListener('intro:done', onIntroDone)
        lenis.off('scroll', ScrollTrigger.update)
        lenis.destroy()
        lenisRef.current = null
      }
    })

    return () => {
      disposed = true
      disposeLenis?.()
    }
  }, [])

  /* Next.js may preserve the previous scroll offset between Pages. Lenis also
     sees cross-page hash clicks before their destination exists. Once the new
     route is committed, reset plain routes to the top and resolve hash routes
     against the newly rendered document. */
  useEffect(() => {
    const routeChanged = previousPathnameRef.current !== pathname
    previousPathnameRef.current = pathname
    if (!routeChanged) return

    const rafId = window.requestAnimationFrame(() => {
      const hash = decodeURIComponent(window.location.hash.slice(1))
      const hashTarget = hash
        ? document.getElementById(hash) ?? document.getElementsByName(hash)[0]
        : null

      if (lenisRef.current) {
        lenisRef.current.scrollTo(hashTarget ?? 0, {
          immediate: true,
          offset: hashTarget ? -72 : 0,
        })
        return
      }

      if (hashTarget) {
        hashTarget.scrollIntoView({ block: 'start' })
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      }
    })

    return () => window.cancelAnimationFrame(rafId)
  }, [pathname])

  return <>{children}</>
}
