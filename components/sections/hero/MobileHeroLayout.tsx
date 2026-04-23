import type { ReactNode } from 'react'
import styles from '../Hero.module.css'

type MobileHeroLayoutProps = {
  children: ReactNode
}

export default function MobileHeroLayout({ children }: MobileHeroLayoutProps) {
  return (
    <div className={`relative z-10 mx-auto h-auto origin-top-left scale-[calc(100vw/var(--mobile-frame-w))] px-[10px] md:hidden ${styles.mobileFrame}`}>
      <div className={styles.mobileGroupCenter}>
        <div className={`relative ${styles.mobileImageWrap} ${styles.mobileImageEntrance}`}>
          <div aria-hidden="true" className={styles.portraitHalo} />
          <div className={styles.mobileVideoCircle}>
            <video
              className="h-full w-full object-cover object-center"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Wideo przedstawiające fotografa i operatora drona"
            >
              <source src="/videos/about-me.mp4" type="video/mp4" />
            </video>
          </div>
        </div>

        <div className={`w-full ${styles.mobileTextWrap} ${styles.mobileTextWrapCentered}`}>
          <div className={`w-full rounded-xl p-4 text-center ${styles.mobileTextHalo} ${styles.mobileTextPanel} ${styles.mobilePanelEntrance}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
