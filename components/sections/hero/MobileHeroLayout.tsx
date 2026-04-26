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
          <div className={`relative aspect-[3/4] w-full ${styles.mobileVideoStage}`}>
            <video
              src="/videos/about-me.mp4"
              aria-label={siteContent.about.imageAlt}
              autoPlay
              loop
              muted
              playsInline
              className="relative z-10 h-full w-full object-contain object-center [clip-path:circle(28%_at_50%_50%)] [mask-image:radial-gradient(circle_at_center,#000_5%,transparent_85%)] [-webkit-mask-image:radial-gradient(circle_at_center,#000_5%,transparent_85%)]"
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
