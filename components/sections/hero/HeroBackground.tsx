import type { RefObject } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { heroClassNames } from './classNames'
import styles from '../Hero.module.css'

type HeroBackgroundProps = {
  mediaRef: RefObject<HTMLDivElement>
  hasHeroVideo: boolean
  heroVideoSrc: string
}

export default function HeroBackground({
  mediaRef,
  hasHeroVideo,
  heroVideoSrc,
}: HeroBackgroundProps) {
  return (
    <>
      <div
        ref={mediaRef}
        className={heroClassNames.media}
        aria-hidden="true"
      >
        {hasHeroVideo ? (
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster="/video/hero-poster.jpg"
          >
            <source src={heroVideoSrc} type="video/mp4" />
          </video>
        ) : (
          <Image
            src="/video/hero-poster.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
      </div>

      <div
        aria-hidden="true"
        className={heroClassNames.gradientOverlay}
      />

      <div
        aria-hidden="true"
        className={cn(heroClassNames.grainOverlay, styles.grainOverlay)}
      />
    </>
  )
}
