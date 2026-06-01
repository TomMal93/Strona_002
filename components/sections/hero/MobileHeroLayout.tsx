import type { ReactNode } from 'react'
import { siteContent } from '@/lib/site-content'
import styles from '../Hero.module.css'

type MobileHeroLayoutProps = {
  children: ReactNode
}

export default function MobileHeroLayout({ children }: MobileHeroLayoutProps) {
  return (
    <div className={`relative z-10 mx-auto md:hidden ${styles.mobileFrame}`}>
      <div className={styles.mobileGroupCenter}>
        <div className={`relative ${styles.mobileImageWrap} ${styles.mobileImageEntrance}`}>
          <div className={`relative ${styles.mobileVideoStage}`}>
            <video
              src="/videos/hero/hero-video.mp4"
              aria-label={siteContent.about.imageAlt}
              autoPlay
              loop
              muted
              playsInline
              className="relative z-10 h-full w-full object-cover object-center [clip-path:circle(45%_at_50%_50%)] [mask-image:radial-gradient(circle_at_center,#000_30%,transparent_85%)] [-webkit-mask-image:radial-gradient(circle_at_center,#000_30%,transparent_85%)]"
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
