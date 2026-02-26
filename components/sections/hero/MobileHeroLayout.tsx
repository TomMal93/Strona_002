import type { ReactNode } from 'react'
import Image from 'next/image'
import styles from '../Hero.module.css'

type MobileHeroLayoutProps = {
  children: ReactNode
}

export default function MobileHeroLayout({ children }: MobileHeroLayoutProps) {
  return (
    <div className={`relative z-10 mx-auto h-full origin-top-left scale-[calc(100vw/766px)] px-[10px] md:hidden ${styles.mobileFrame}`}>
      <div className={`relative ${styles.mobileGroupCenter}`}>
        <div className={`ml-auto ${styles.mobileImageWrap} ${styles.mobileImageEntrance}`}>
          <div className="relative aspect-[3/4] w-full">
            <Image
              src="/images/hero.webp"
              alt="Fotograf i operator drona — portret z dronem i kontrolerem"
              fill
              className="object-contain object-center"
              priority
              quality={75}
              sizes="(max-width: 767px) 72vw, 1px"
            />
          </div>
        </div>

        <div className={`w-fit ${styles.mobileTextWrap}`}>
          <div className={`max-w-[500px] rounded-xl p-4 text-left ${styles.mobileTextHalo} ${styles.mobileTextPanel} ${styles.mobilePanelEntrance}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
