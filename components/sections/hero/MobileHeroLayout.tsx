import type { ReactNode } from 'react'
import Image from 'next/image'
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
          <div className="relative z-10 aspect-[3/4] w-full">
            <Image
              src="/images/about-me-section.png"
              alt="Fotograf i operator drona — portret z dronem i kontrolerem"
              fill
              className="object-contain object-center"
              priority
              quality={75}
              sizes="(max-width: 767px) 72vw, 1px"
            />
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
