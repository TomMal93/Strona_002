'use client'

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { siteContent } from '@/lib/site-content'
import { useLazyVideoSource } from '@/components/ui/useLazyVideoSource'
import { cn } from '@/lib/utils'
import styles from './Services.module.css'
import heroStyles from './Hero.module.css'
import { ServiceIcon } from './services/ServiceIcon'
import { useServicesAnimation } from './services/useServicesAnimation'
import {
  getCardVariant,
  getSceneNumber,
  orderServiceItems,
  type CardVariant,
} from './services/serviceLayout'

type ServiceItem = (typeof siteContent.services.items)[number]

type VariantClassNames = {
  card: string
  reelLine1: string
  reelLine2: string
  title: string
  text: string
  lensRing: string
  icon: string
  videoFrame: string
  bullet: string
  bulletDot: string
}

const VARIANT_CLASSES: Record<CardVariant, VariantClassNames> = {
  highlight: {
    card: styles.sceneCardHighlight,
    reelLine1: styles.reelLineHighlight1,
    reelLine2: styles.reelLineHighlight2,
    title: styles.highlightTitle,
    text: styles.highlightText,
    lensRing: styles.lensRingHighlight,
    icon: styles.iconHighlight,
    videoFrame: styles.videoFrameHighlight,
    bullet: styles.bulletHighlight,
    bulletDot: styles.bulletDotHighlight,
  },
  military: {
    card: styles.sceneCardMilitary,
    reelLine1: styles.reelLineMilitary1,
    reelLine2: styles.reelLineMilitary2,
    title: styles.militaryTitle,
    text: styles.militaryText,
    lensRing: styles.lensRingMilitary,
    icon: styles.iconMilitary,
    videoFrame: styles.videoFrameMilitary,
    bullet: styles.bulletMilitary,
    bulletDot: styles.bulletDotMilitary,
  },
}

type SceneCardProps = {
  item: ServiceItem
  index: number
  animate?: boolean
  className?: string
}

function SceneCard({ item, index, animate = true, className }: SceneCardProps) {
  const variant = getCardVariant(item.icon)
  const v = VARIANT_CLASSES[variant]
  const videoFrameRef = useRef<HTMLDivElement>(null!)
  const videoRef = useRef<HTMLVideoElement>(null!)
  const shouldLoadVideo = useLazyVideoSource(videoFrameRef)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const onPause = () => setIsPlaying(false)
    const onPlay = () => {
      setIsPlaying(true)
      window.dispatchEvent(
        new CustomEvent('app:video-play', { detail: { target: video } }),
      )
    }
    const onEnded = () => {
      setIsPlaying(false)
      video.currentTime = 0
    }

    const onOtherVideoPlay = (e: Event) => {
      const customEvent = e as CustomEvent<{ target: HTMLVideoElement }>
      if (customEvent.detail?.target !== video && !video.paused) {
        video.pause()
      }
    }

    video.addEventListener('pause', onPause)
    video.addEventListener('play', onPlay)
    video.addEventListener('ended', onEnded)
    window.addEventListener('app:video-play', onOtherVideoPlay)

    return () => {
      video.removeEventListener('pause', onPause)
      video.removeEventListener('play', onPlay)
      video.removeEventListener('ended', onEnded)
      window.removeEventListener('app:video-play', onOtherVideoPlay)
    }
  }, [])

  const toggleVideo = () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      void video.play()
      return
    }

    video.pause()
  }

  return (
    <li
      {...(animate ? { 'data-service-card': '' } : {})}
      className={cn(
        styles.sceneCard,
        v.card,
        className,
      )}
    >
      <span aria-hidden="true" data-scene-number className={styles.sceneNumber}>
        {getSceneNumber(index)}
      </span>

      <div className={styles.contentLayer}>
        <div className={styles.reelLines} aria-hidden="true">
          <span className={cn(styles.reelLine, v.reelLine1)} />
          <span className={cn(styles.reelLine, v.reelLine2)} />
        </div>

        <div ref={videoFrameRef} className={cn(styles.videoFrame, v.videoFrame)}>
          <button
            type="button"
            className={styles.videoStatus}
            onClick={toggleVideo}
            aria-label={isPlaying ? `Zatrzymaj podgląd: ${item.title}` : `Odtwórz podgląd: ${item.title}`}
          >
            {isPlaying ? 'preview on' : 'click to play'}
          </button>

          <video
            ref={videoRef}
            className={styles.cardVideo}
            poster={item.video.poster}
            preload="none"
            muted
            playsInline
            onClick={toggleVideo}
          >
            {shouldLoadVideo && (
              <>
                <source
                  src={item.video.src}
                  type={item.video.src.toLowerCase().endsWith('.webm') ? 'video/webm' : 'video/mp4'}
                />
                <source src={item.video.fallbackSrc} type="video/mp4" />
              </>
            )}
          </video>
        </div>

        <div className={styles.cardBody}>
          <div className={styles.cardHeader}>
            <div>
              <p className={cn('ui-overline text-khaki/90', styles.cardTag)}>
                {item.tag}
              </p>

              <h3
                className={cn(
                  'font-bebas text-2xl md:text-3xl uppercase leading-[1.0] tracking-wide text-warm-white',
                  v.title,
                  styles.cardTitle,
                )}
              >
                {item.title}
              </h3>
            </div>

            <span className={styles.lensDock}>
              <span className={cn(styles.lensRing, v.lensRing)}>
                <ServiceIcon icon={item.icon} className={v.icon} />
              </span>
            </span>
          </div>

          <p
            className={cn(
              'font-inter text-sm leading-relaxed text-warm-gray',
              v.text,
              styles.cardLead,
            )}
          >
            {item.lead}
          </p>

          <ul className={styles.bulletList}>
            {item.bullets.map((bullet) => (
              <li key={bullet} className={cn(styles.bulletItem, v.bullet)}>
                <span aria-hidden="true" className={cn(styles.bulletDot, v.bulletDot)} />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          <p
            className={cn(
              'font-inter text-sm leading-relaxed text-warm-gray',
              v.text,
              styles.cardDescription,
            )}
          >
            {item.description}
          </p>
        </div>
      </div>
    </li>
  )
}

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null!)
  const titleRef = useRef<HTMLHeadingElement>(null!)
  const titleAccentRef = useRef<HTMLSpanElement>(null!)
  const introRef = useRef<HTMLParagraphElement>(null!)
  const hudBarRef = useRef<HTMLDivElement>(null!)
  const mobileCarouselRef = useRef<HTMLDivElement>(null!)
  const bottomTimelineRef = useRef<HTMLDivElement>(null!)
  const swipeStateRef = useRef<{
    pointerId: number
    startX: number
    startY: number
  } | null>(null)
  const isAnimatingRef = useRef(false)
  const [activeCardIndex, setActiveCardIndex] = useState(0)
  const [activeDomCardIndex, setActiveDomCardIndex] = useState(1)
  const [isTrackTransitionDisabled, setIsTrackTransitionDisabled] = useState(false)
  const orderedItems = orderServiceItems(siteContent.services.items)
  const totalCards = orderedItems.length
  const extendedItems = [
    orderedItems[totalCards - 1],
    ...orderedItems,
    orderedItems[0],
  ]

  const handlePrevCard = useCallback(() => {
    if (totalCards <= 1 || isAnimatingRef.current) return

    if (activeCardIndex <= 0) {
      isAnimatingRef.current = true
      setIsTrackTransitionDisabled(false)
      setActiveCardIndex(totalCards - 1)
      setActiveDomCardIndex(0)
      return
    }

    const newIndex = activeCardIndex - 1
    setIsTrackTransitionDisabled(false)
    setActiveCardIndex(newIndex)
    setActiveDomCardIndex(newIndex + 1)
  }, [activeCardIndex, totalCards])

  const handleNextCard = useCallback(() => {
    if (totalCards <= 1 || isAnimatingRef.current) return

    if (activeCardIndex >= totalCards - 1) {
      isAnimatingRef.current = true
      setIsTrackTransitionDisabled(false)
      setActiveCardIndex(0)
      setActiveDomCardIndex(totalCards + 1)
      return
    }

    const newIndex = activeCardIndex + 1
    setIsTrackTransitionDisabled(false)
    setActiveCardIndex(newIndex)
    setActiveDomCardIndex(newIndex + 1)
  }, [activeCardIndex, totalCards])

  const handleDot = useCallback((index: number) => {
    if (isAnimatingRef.current) return
    setIsTrackTransitionDisabled(false)
    setActiveCardIndex(index)
    setActiveDomCardIndex(index + 1)
  }, [])

  const handlePointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse') return
    event.currentTarget.setPointerCapture(event.pointerId)
    swipeStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
    }
  }, [])

  const handlePointerUp = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const swipe = swipeStateRef.current
    if (!swipe || swipe.pointerId !== event.pointerId) return
    event.currentTarget.releasePointerCapture(event.pointerId)

    const deltaX = event.clientX - swipe.startX
    const deltaY = event.clientY - swipe.startY
    const horizontalThreshold = 36
    const isHorizontalGesture = Math.abs(deltaX) > Math.abs(deltaY)

    swipeStateRef.current = null

    if (!isHorizontalGesture || Math.abs(deltaX) < horizontalThreshold) return
    if (deltaX < 0) {
      handleNextCard()
      return
    }
    handlePrevCard()
  }, [handleNextCard, handlePrevCard])

  const handlePointerCancel = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    swipeStateRef.current = null
  }, [])

  const handleTrackTransitionEnd = useCallback(() => {
    if (!isAnimatingRef.current) return

    setIsTrackTransitionDisabled(true)
    setActiveDomCardIndex(activeCardIndex + 1)

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsTrackTransitionDisabled(false)
        isAnimatingRef.current = false
      })
    })
  }, [activeCardIndex])

  useServicesAnimation({
    sectionRef,
    titleRef,
    titleAccentRef,
    introRef,
    hudBarRef,
    mobileCarouselRef,
    bottomTimelineRef,
  })

  return (
    <section
      ref={sectionRef}
      id="services"
      aria-labelledby="services-heading"
      className={cn(
        'bg-anthracite px-6 py-20 sm:py-24 lg:px-20 lg:py-32',
        'section-dark-bg',
      )}
    >
      <div className="mx-auto max-w-content">
        <div className={cn('mx-auto flex max-w-3xl flex-col items-center text-center', styles.sectionHeaderShell)}>
          <h2
            ref={titleRef}
            id="services-heading"
            className={cn(
              heroStyles.gradientTextPrimary,
              'text-center font-bebas text-5xl uppercase leading-[0.9] tracking-wide sm:text-6xl',
              styles.sectionTitle,
            )}
          >
            {siteContent.services.title}
          </h2>

          <div ref={hudBarRef} aria-hidden="true" className={styles.hudBar}>
            <span data-hud-line="left" className={styles.hudLineLeft} />
            <span data-hud-label className={styles.hudPlayIndicator}>
              PROGRAM
            </span>
            <span data-hud-line="left" className={styles.hudLineLeft} />
            <span data-hud-line="right" className={styles.hudLineRight} />
            <span data-hud-label className={styles.hudTimecode}>
              SCENE 04 / 08
            </span>
            <span data-hud-line="right" className={styles.hudLineRight} />
          </div>

          <p
            ref={introRef}
            className={cn(
              'section-subtitle-responsive mt-5 whitespace-pre-line font-mono text-[0.95rem] leading-[1.85] tracking-wide text-white/50',
              styles.sectionIntro,
            )}
          >
            {siteContent.services.subtitle}
          </p>
        </div>

        <div className="mt-8 lg:mt-10">
          <div ref={mobileCarouselRef} className={styles.mobileCarouselShell}>
            <div
              className={styles.mobileCarouselViewport}
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerCancel}
            >
              <ul
                className={cn(
                  styles.mobileCarouselTrack,
                  isTrackTransitionDisabled && styles.mobileCarouselTrackNoTransition,
                )}
                style={{ transform: `translate3d(-${activeDomCardIndex * 100}%, 0, 0)` }}
                onTransitionEnd={handleTrackTransitionEnd}
              >
                {extendedItems.map((item, index) => (
                  <SceneCard
                    key={`${item.title}-${index}`}
                    item={item}
                    index={index === 0 ? totalCards - 1 : index === totalCards + 1 ? 0 : index - 1}
                    animate={false}
                    className={styles.mobileCarouselSlide}
                  />
                ))}
              </ul>
            </div>

            <nav className={styles.mobileCarouselNav} aria-label="Nawigacja oferty">
              <button
                type="button"
                className={styles.mobileNavBtn}
                onClick={handlePrevCard}
                aria-label="Poprzednia karta oferty"
              >
                <svg viewBox="0 0 24 24">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              <div className={styles.mobileDots}>
                {orderedItems.map((item, index) => (
                  <button
                    key={item.title}
                    type="button"
                    className={cn(styles.mobileDot, index === activeCardIndex && styles.mobileDotActive)}
                    onClick={() => handleDot(index)}
                    aria-label={`Karta oferty ${index + 1}`}
                    aria-current={index === activeCardIndex ? 'true' : undefined}
                  />
                ))}
              </div>

              <button
                type="button"
                className={styles.mobileNavBtn}
                onClick={handleNextCard}
                aria-label="Następna karta oferty"
              >
                <svg viewBox="0 0 24 24">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </nav>
          </div>

          <ul className={styles.cardsContainer}>
            {orderedItems.map((item, index) => (
              <SceneCard
                key={item.title}
                item={item}
                index={index}
              />
            ))}
          </ul>
        </div>

        <div ref={bottomTimelineRef} aria-hidden="true" className={styles.bottomTimeline}>
          <span data-bottom-seg className={styles.bottomTimelineLine} />
          {orderedItems.map((item) => (
            <span key={item.title} data-bottom-diamond className={styles.bottomTimelineDiamond}>◆</span>
          ))}
        </div>

        <div className={styles.sectionCta}>
          <a
            href={siteContent.services.ctaHref}
            data-cta-link
            className={cn(
              heroStyles.ctaButton,
              heroStyles.ctaButtonSecondary,
              'px-4 py-2 font-bebas text-[1.15rem] uppercase tracking-widest sm:text-[1.35rem]',
            )}
          >
            {siteContent.services.ctaLabel}
          </a>

          <a
            href={siteContent.services.secondaryCtaHref}
            data-cta-link
            className={cn(
              heroStyles.ctaButton,
              heroStyles.ctaButtonSecondary,
              'px-4 py-2 font-bebas text-[1.15rem] uppercase tracking-widest sm:text-[1.35rem]',
            )}
          >
            {siteContent.services.secondaryCtaLabel}
          </a>
        </div>
      </div>
    </section>
  )
}
