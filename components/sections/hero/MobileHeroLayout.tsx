import type { ReactNode } from 'react'
import { siteContent } from '@/lib/site-content'
import styles from '../Hero.module.css'

type MobileHeroLayoutProps = {
  children: ReactNode
}

export default function MobileHeroLayout({ children }: MobileHeroLayoutProps) {
  return (
    <div className={`relative z-10 mx-auto h-full origin-top-left scale-[calc(100vw/var(--mobile-frame-w))] px-[10px] md:hidden ${styles.mobileFrame}`}>
      <div className={styles.mobileGroupCenter}>
        <div className={`relative ${styles.mobileImageWrap} ${styles.mobileImageEntrance}`}>
          <div className="relative z-10 aspect-[3/4] w-full [clip-path:circle(30%_at_50%_50%)]">
            <video
              src="/videos/about-me.mp4"
              aria-label={siteContent.about.imageAlt}
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-contain object-center"
            />
          </div>
        </div>

        <div className={`w-full ${styles.mobileTextWrap}`}>
          <div className={`w-full rounded-xl p-4 text-center ${styles.mobileTextHalo} ${styles.mobileTextPanel} ${styles.mobilePanelEntrance}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
