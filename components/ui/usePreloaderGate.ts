import { useEffect, useState } from 'react'

const MIN_VISIBLE_MS = 1100
const MAX_WAIT_MS = 6000

const MOBILE_QUERY = '(max-width: 767px)'
const DESKTOP_HERO_IMAGE = '/images/Hero.webp'
const MOBILE_HERO_VIDEO = '/videos/hero/hero-video.mp4'

type GateState = 'loading' | 'ready'

function preloadDesktopImage(signal: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    if (signal.aborted) return resolve()
    const img = new Image()
    img.decoding = 'async'
    img.src = DESKTOP_HERO_IMAGE
    const finish = () => resolve()
    if (typeof img.decode === 'function') {
      img.decode().then(finish, finish)
    } else {
      img.onload = finish
      img.onerror = finish
    }
    signal.addEventListener('abort', finish, { once: true })
  })
}

function preloadMobileVideo(signal: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    if (signal.aborted) return resolve()
    const video = document.createElement('video')
    video.preload = 'auto'
    video.muted = true
    video.playsInline = true
    video.src = MOBILE_HERO_VIDEO
    const finish = () => {
      video.removeAttribute('src')
      video.load()
      resolve()
    }
    video.addEventListener('loadeddata', finish, { once: true })
    video.addEventListener('error', finish, { once: true })
    signal.addEventListener('abort', finish, { once: true })
  })
}

function waitForFonts(signal: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    if (signal.aborted) return resolve()
    if (typeof document === 'undefined' || !document.fonts) return resolve()
    document.fonts.ready.then(() => resolve()).catch(() => resolve())
    signal.addEventListener('abort', () => resolve(), { once: true })
  })
}

function waitForWindowLoad(signal: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    if (signal.aborted) return resolve()
    if (document.readyState === 'complete') return resolve()
    const onLoad = () => resolve()
    window.addEventListener('load', onLoad, { once: true })
    signal.addEventListener('abort', () => {
      window.removeEventListener('load', onLoad)
      resolve()
    }, { once: true })
  })
}

function delay(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    if (signal.aborted) return resolve()
    const id = window.setTimeout(resolve, ms)
    signal.addEventListener('abort', () => {
      window.clearTimeout(id)
      resolve()
    }, { once: true })
  })
}

export function usePreloaderGate(active: boolean): GateState {
  const [state, setState] = useState<GateState>('loading')

  useEffect(() => {
    if (!active) {
      setState('ready')
      return
    }

    const ctrl = new AbortController()
    const startedAt = performance.now()
    const isMobile = window.matchMedia(MOBILE_QUERY).matches

    const heroAsset = isMobile
      ? preloadMobileVideo(ctrl.signal)
      : preloadDesktopImage(ctrl.signal)

    const safety = window.setTimeout(() => {
      if (!ctrl.signal.aborted) setState('ready')
    }, MAX_WAIT_MS)

    Promise.all([
      waitForFonts(ctrl.signal),
      heroAsset,
      waitForWindowLoad(ctrl.signal),
    ])
      .then(async () => {
        const elapsed = performance.now() - startedAt
        const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed)
        if (remaining > 0) await delay(remaining, ctrl.signal)
        if (!ctrl.signal.aborted) setState('ready')
      })
      .catch(() => {
        if (!ctrl.signal.aborted) setState('ready')
      })

    return () => {
      window.clearTimeout(safety)
      ctrl.abort()
    }
  }, [active])

  return state
}
