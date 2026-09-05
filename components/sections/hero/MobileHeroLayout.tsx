'use client'

import { useEffect, useState, type ReactNode } from 'react'
import Image from 'next/image'
import { siteContent } from '@/lib/site-content'
import styles from '../Hero.module.css'

type MobileHeroLayoutProps = {
  children: ReactNode
}

export default function MobileHeroLayout({ children }: MobileHeroLayoutProps) {
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false)
  const [isVideoReady, setIsVideoReady] = useState(false)

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 767px)')
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const connection = (navigator as Navigator & {
      connection?: { saveData?: boolean }
    }).connection
    let fallbackTimer = 0

    const startVideo = () => {
      window.clearTimeout(fallbackTimer)
      setShouldLoadVideo(true)
    }

    const updateVideoPreference = () => {
      window.clearTimeout(fallbackTimer)
      setIsVideoReady(false)
      setShouldLoadVideo(false)

      if (!mobileQuery.matches || reducedMotionQuery.matches || connection?.saveData) return

      // Keep the early LCP path image-only. Motion starts on the first user
      // interaction, with a fallback for visitors who simply watch the hero.
      fallbackTimer = window.setTimeout(startVideo, 6_000)
    }

    updateVideoPreference()
    mobileQuery.addEventListener('change', updateVideoPreference)
    reducedMotionQuery.addEventListener('change', updateVideoPreference)
    window.addEventListener('pointerdown', startVideo, { once: true, passive: true })
    window.addEventListener('scroll', startVideo, { once: true, passive: true })

    return () => {
      window.clearTimeout(fallbackTimer)
      mobileQuery.removeEventListener('change', updateVideoPreference)
      reducedMotionQuery.removeEventListener('change', updateVideoPreference)
      window.removeEventListener('pointerdown', startVideo)
      window.removeEventListener('scroll', startVideo)
    }
  }, [])

  return (
    <>
      <link
        rel="preload"
        as="image"
        href="/images/hero/hero-video-poster.webp"
        fetchPriority="high"
        media="(max-width: 767px)"
      />
      <div className={`absolute inset-0 z-10 md:hidden ${styles.mobileFrame}`}>
        <div className={styles.mobileGroupCenter}>
          <div className={styles.mobileImageWrap}>
            <div className={styles.mobileVideoStage}>
              <Image
                src="/images/hero/hero-video-poster.webp"
                alt={siteContent.about.imageAlt}
                fill
                priority
                fetchPriority="high"
                unoptimized
                sizes="(max-width: 767px) 100vw, 1px"
                className={styles.mobileHeroPoster}
              />
              {shouldLoadVideo ? (
                <video
                  src="/videos/hero/hero-video.mp4"
                  poster="/images/hero/hero-video-poster.webp"
                  aria-hidden="true"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  onLoadedData={() => setIsVideoReady(true)}
                  className={`${styles.mobileHeroVideo} ${isVideoReady ? styles.mobileHeroVideoReady : ''}`}
                />
              ) : null}
            </div>
          </div>

          <div className={styles.mobileTextWrap}>
            <div className={`rounded-xl text-center ${styles.mobileTextHalo} ${styles.mobileTextPanel} ${styles.mobilePanelEntrance}`}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
