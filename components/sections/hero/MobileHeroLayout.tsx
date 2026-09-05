import type { ReactNode } from 'react'
import styles from '../Hero.module.css'

type MobileHeroLayoutProps = {
  children: ReactNode
}

export default function MobileHeroLayout({ children }: MobileHeroLayoutProps) {
  return (
    <div className={`absolute inset-0 z-10 md:hidden ${styles.mobileFrame}`}>
      <div className={styles.mobileGroupCenter}>
        <div className={styles.mobileImageWrap}>
          <div className={styles.mobileVideoStage}>
            <video
              src="/videos/hero/hero-video.mp4"
              aria-hidden="true"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className={styles.mobileHeroVideo}
            />
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
