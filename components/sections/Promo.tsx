'use client'

import {
  useRef,
  useState,
  useCallback,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react'
import { siteContent } from '@/lib/site-content'
import CinematicVideoPlayer from '@/components/ui/CinematicVideoPlayer'
import { useLazyVideoSource } from '@/components/ui/useLazyVideoSource'
import { cn } from '@/lib/utils'
import styles from './Promo.module.css'
import heroStyles from './Hero.module.css'
import { YouTubeFacade } from './promo/YouTubeFacade'
import { usePromoAnimations } from './promo/usePromoAnimations'

export default function Promo() {
  const sectionRef = useRef<HTMLElement>(null!)
  const hudBarRef = useRef<HTMLDivElement>(null!)
  const titleRef = useRef<HTMLHeadingElement>(null!)
  const subtitleRef = useRef<HTMLParagraphElement>(null!)
  const videoFrameRef = useRef<HTMLDivElement>(null!)
  const ytGridRef = useRef<HTMLDivElement>(null!)
  const ytCarouselShellRef = useRef<HTMLDivElement>(null!)
  const swipeStateRef = useRef<{
    pointerId: number
    startX: number
    startY: number
  } | null>(null)
  const isAnimatingRef = useRef(false)
  const bottomTimelineRef = useRef<HTMLDivElement>(null!)
  const [activeVideoIndex, setActiveVideoIndex] = useState(1)
  const [activeDomVideoIndex, setActiveDomVideoIndex] = useState(2)
  const [isTrackTransitionDisabled, setIsTrackTransitionDisabled] = useState(false)

  usePromoAnimations({
    sectionRef,
    hudBarRef,
    titleRef,
    subtitleRef,
    videoFrameRef,
    ytGridRef,
    ytCarouselShellRef,
    bottomTimelineRef,
  })

  const { promo } = siteContent
  const shouldLoadHeroVideo = useLazyVideoSource(videoFrameRef)
  const totalVideos = promo.youtubeVideos.length
  const extendedVideos = [
    promo.youtubeVideos[totalVideos - 1],
    ...promo.youtubeVideos,
    promo.youtubeVideos[0],
  ]

  const handlePrevVideo = useCallback(() => {
    if (totalVideos <= 1 || isAnimatingRef.current) return

    if (activeVideoIndex <= 0) {
      isAnimatingRef.current = true
      setIsTrackTransitionDisabled(false)
      setActiveVideoIndex(totalVideos - 1)
      setActiveDomVideoIndex(0)
      return
    }

    const newIndex = activeVideoIndex - 1
    setIsTrackTransitionDisabled(false)
    setActiveVideoIndex(newIndex)
    setActiveDomVideoIndex(newIndex + 1)
  }, [activeVideoIndex, totalVideos])

  const handleNextVideo = useCallback(() => {
    if (totalVideos <= 1 || isAnimatingRef.current) return

    if (activeVideoIndex >= totalVideos - 1) {
      isAnimatingRef.current = true
      setIsTrackTransitionDisabled(false)
      setActiveVideoIndex(0)
      setActiveDomVideoIndex(totalVideos + 1)
      return
    }

    const newIndex = activeVideoIndex + 1
    setIsTrackTransitionDisabled(false)
    setActiveVideoIndex(newIndex)
    setActiveDomVideoIndex(newIndex + 1)
  }, [activeVideoIndex, totalVideos])

  const handleDot = useCallback((index: number) => {
    if (isAnimatingRef.current) return
    setIsTrackTransitionDisabled(false)
    setActiveVideoIndex(index)
    setActiveDomVideoIndex(index + 1)
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
      handleNextVideo()
      return
    }
    handlePrevVideo()
  }, [handleNextVideo, handlePrevVideo])

  const handlePointerCancel = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    swipeStateRef.current = null
  }, [])

  const handleTrackTransitionEnd = useCallback(() => {
    if (!isAnimatingRef.current) return

    setIsTrackTransitionDisabled(true)
    setActiveDomVideoIndex(activeVideoIndex + 1)

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsTrackTransitionDisabled(false)
        isAnimatingRef.current = false
      })
    })
  }, [activeVideoIndex])

  return (
    <section
      ref={sectionRef}
      id="promo"
      aria-labelledby="promo-heading"
      className={cn(
        'bg-anthracite px-6 py-20 sm:py-24 lg:px-20 lg:py-16',
        'section-dark-bg',
      )}
    >
      <div className={styles.promoCanvas}>
        {/* ── Header ──────────────────────────────────────────────── */}
        <div className={cn('mx-auto flex max-w-3xl flex-col items-center text-center', styles.sectionHeaderShell)}>
          <h2
            ref={titleRef}
            id="promo-heading"
            className={cn(
              heroStyles.gradientTextPrimary,
              'text-center font-bebas text-5xl uppercase leading-[0.9] tracking-wide sm:text-6xl',
            )}
          >
            {promo.title}
          </h2>

          <div ref={hudBarRef} aria-hidden="true" className={styles.hudBar}>
            <span data-hud-line="left" className={styles.hudLineLeft} />
            <span data-hud-label className={styles.hudLabel}>preview</span>
            <span data-hud-line="left" className={styles.hudLineLeft} />
            <span data-hud-line="right" className={styles.hudLineRight} />
            <span data-hud-label className={styles.hudLabel}>scene 03/08</span>
            <span data-hud-line="right" className={styles.hudLineRight} />
          </div>

          <p
            ref={subtitleRef}
            className={cn(
              'section-subtitle-responsive mt-5 whitespace-pre-line font-mono text-[0.95rem] leading-[1.85] tracking-wide text-white/50',
              styles.sectionSubtitle,
            )}
          >
            {promo.subtitle}
          </p>
        </div>

        {/* ── Hero video ──────────────────────────────────────────── */}
        <CinematicVideoPlayer
          ref={videoFrameRef}
          className={styles.videoFrame}
          src={promo.heroVideo.src}
          fallbackSrc="/videos/promo-reel.mp4"
          poster={promo.heroVideo.poster}
          shouldLoad={shouldLoadHeroVideo}
          playLabel="film promocyjny"
          muted
        >
          <span aria-hidden="true" className={styles.frameCodec}>H.265 / LOG3</span>
          <span aria-hidden="true" className={styles.frameDuration}>00:00:16</span>
          <span aria-hidden="true" className={styles.framePreview}>Director&apos;s preview</span>
          <span aria-hidden="true" data-corner-mark className={`${styles.cornerMark} ${styles.cornerTL}`} />
          <span aria-hidden="true" data-corner-mark className={`${styles.cornerMark} ${styles.cornerTR}`} />
          <span aria-hidden="true" data-corner-mark className={`${styles.cornerMark} ${styles.cornerBL}`} />
          <span aria-hidden="true" data-corner-mark className={`${styles.cornerMark} ${styles.cornerBR}`} />
        </CinematicVideoPlayer>

        {/* ── YouTube grid ────────────────────────────────────────── */}
        <div
          ref={ytCarouselShellRef}
          className={styles.ytCarouselShell}
          data-mobile-carousel
        >
          <div
            className={styles.ytCarouselViewport}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
          >
            <div
              className={cn(
                styles.ytCarouselTrack,
                isTrackTransitionDisabled && styles.ytCarouselTrackNoTransition,
              )}
              style={{ transform: `translate3d(-${activeDomVideoIndex * 100}%, 0, 0)` }}
              onTransitionEnd={handleTrackTransitionEnd}
            >
              {extendedVideos.map((video, index) => (
                <div key={`${video.id}-${index}`} className={styles.ytCarouselSlide}>
                  <YouTubeFacade
                    videoId={video.id}
                    title={video.title}
                  />
                </div>
              ))}
            </div>
          </div>

          <nav className={styles.ytCarouselNav} aria-label="Nawigacja filmów">
            <button
              type="button"
              className={styles.ytNavBtn}
              onClick={handlePrevVideo}
              aria-label="Poprzedni film"
            >
              <svg viewBox="0 0 24 24">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <div className={styles.ytDots}>
              {promo.youtubeVideos.map((video, index) => (
                <button
                  key={video.id}
                  type="button"
                  className={cn(styles.ytDot, index === activeVideoIndex && styles.ytDotActive)}
                  onClick={() => handleDot(index)}
                  aria-label={`Film ${index + 1}`}
                  aria-current={index === activeVideoIndex ? 'true' : undefined}
                />
              ))}
            </div>

            <button
              type="button"
              className={styles.ytNavBtn}
              onClick={handleNextVideo}
              aria-label="Następny film"
            >
              <svg viewBox="0 0 24 24">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </nav>
        </div>

        <div ref={ytGridRef} className={styles.ytGrid}>
          {promo.youtubeVideos.map((video, index) => (
            <YouTubeFacade
              key={video.id + video.title}
              videoId={video.id}
              title={video.title}
              index={index}
            />
          ))}
        </div>

        <div className={styles.creativeProcess} data-promo-process aria-label="Proces twórczy">
          <span data-promo-line className={`${styles.processLine} ${styles.processLineTop}`} aria-hidden="true" />
          <span data-promo-line className={`${styles.processLine} ${styles.processLineBottom}`} aria-hidden="true" />
          <p className={styles.processHeading}>Proces twórczy</p>
          <ProcessItem
            title="Scenariusz"
            subtitle="Koncepcja i historia"
            icon={<path d="M4 3h13v18H4zM8 7h5M8 11h5M8 15h4M17 7h3v12h-3" />}
          />
          <span className={styles.processDot} aria-hidden="true">•</span>
          <ProcessItem
            title="Zdjęcia"
            subtitle="Obraz i atmosfera"
            icon={<><path d="M4 8h16v11H4zM8 8l1.4-3h5.2L16 8" /><circle cx="12" cy="13.5" r="3.5" /></>}
          />
          <span className={styles.processDot} aria-hidden="true">•</span>
          <ProcessItem
            title="Montaż"
            subtitle="Rytm i emocje"
            icon={<><circle cx="6" cy="6" r="3" /><path d="M8.12 8.12 12 12" /><path d="M20 4 8.12 15.88" /><circle cx="6" cy="18" r="3" /><path d="M14.8 14.8 20 20" /></>}
          />
        </div>

        {/* ── Bottom timeline ─────────────────────────────────────── */}
        <div ref={bottomTimelineRef} aria-hidden="true" className={styles.bottomTimeline}>
          <span data-bottom-seg className={styles.bottomTimelineLine} />
          {promo.youtubeVideos.map((video) => (
            <span key={video.id + video.title} data-bottom-diamond className={styles.bottomTimelineDiamond}>◆</span>
          ))}
        </div>

        <blockquote className={styles.promoQuote} data-promo-quote>
          <p>Najsilniejszy przekaz nie mówi, co myśleć. Sprawia, że zaczynasz czuć.</p>
        </blockquote>
      </div>
    </section>
  )
}

function ProcessItem({
  title,
  subtitle,
  icon,
}: {
  title: string
  subtitle: string
  icon: ReactNode
}) {
  return (
    <div className={styles.processItem}>
      <svg viewBox="0 0 24 24" aria-hidden="true">{icon}</svg>
      <div>
        <strong>{title}</strong>
        <span>{subtitle}</span>
      </div>
    </div>
  )
}
