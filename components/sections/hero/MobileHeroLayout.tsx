'use client'

import { useEffect, useState, type ReactNode } from 'react'
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

    const updateVideoPreference = () => {
      setIsVideoReady(false)
      setShouldLoadVideo(
        mobileQuery.matches && !reducedMotionQuery.matches && !connection?.saveData,
      )
    }

    updateVideoPreference()
    mobileQuery.addEventListener('change', updateVideoPreference)
    reducedMotionQuery.addEventListener('change', updateVideoPreference)

    return () => {
      mobileQuery.removeEventListener('change', updateVideoPreference)
      reducedMotionQuery.removeEventListener('change', updateVideoPreference)
    }
  }, [])

  return (
    <div className={`absolute inset-0 z-10 md:hidden ${styles.mobileFrame}`}>
      <div className={styles.mobileGroupCenter}>
        <div className={`${styles.mobileImageWrap} ${styles.mobileImageEntrance}`}>
          <div className={styles.mobileVideoStage}>
            <div aria-hidden="true" className={styles.mobileHeroPoster} />
            {shouldLoadVideo ? (
              <video
                src="/videos/hero/hero-video.mp4"
                aria-label={siteContent.about.imageAlt}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
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
  )
}
