'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { siteContent } from '@/lib/site-content'
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
  const videoRef = useRef<HTMLVideoElement>(null!)
  const ytGridRef = useRef<HTMLDivElement>(null!)
  const bottomTimelineRef = useRef<HTMLDivElement>(null!)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [timecode, setTimecode] = useState('00:00/00:00')

  const handlePlayPause = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play()
      setIsPlaying(true)
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    function formatTime(sec: number): string {
      const m = Math.floor(sec / 60)
      const s = Math.floor(sec % 60)
      return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    }

    const onTimeUpdate = () => {
      const dur = video.duration || 1
      setProgress(video.currentTime / dur)
      setTimecode(`${formatTime(video.currentTime)}/${formatTime(dur)}`)
    }

    const onLoadedMetadata = () => {
      setTimecode(`00:00/${formatTime(video.duration)}`)
    }

    video.addEventListener('timeupdate', onTimeUpdate)
    video.addEventListener('loadedmetadata', onLoadedMetadata)
    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate)
      video.removeEventListener('loadedmetadata', onLoadedMetadata)
    }
  }, [])

  usePromoAnimations({
    sectionRef,
    hudBarRef,
    titleRef,
    subtitleRef,
    videoFrameRef,
    ytGridRef,
    bottomTimelineRef,
  })

  const { promo } = siteContent

  return (
    <section
      ref={sectionRef}
      id="promo"
      aria-labelledby="promo-heading"
      className={cn(
        'bg-anthracite px-6 py-20 sm:py-24 lg:px-20 lg:py-32',
        'section-dark-bg',
      )}
    >
      <div className="mx-auto max-w-content">
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
            <span data-hud-line className={styles.hudLineLeft} />
            <span data-hud-label className={styles.hudLabel}>preview</span>
            <span data-hud-line className={styles.hudLineLeft} />
            <span data-hud-line className={styles.hudLineRight} />
            <span data-hud-label className={styles.hudLabel}>scena 03/06</span>
            <span data-hud-line className={styles.hudLineRight} />
          </div>

          <p
            ref={subtitleRef}
            className={cn(
              'mt-5 whitespace-pre-line font-mono text-[0.95rem] leading-[1.85] tracking-wide text-white/50',
              styles.sectionSubtitle,
            )}
          >
            {promo.subtitle}
          </p>
        </div>

        {/* ── Hero video ──────────────────────────────────────────── */}
        <div ref={videoFrameRef} className={styles.videoFrame}>
          <span aria-hidden="true" data-corner-mark className={`${styles.cornerMark} ${styles.cornerTL}`} />
          <span aria-hidden="true" data-corner-mark className={`${styles.cornerMark} ${styles.cornerTR}`} />
          <span aria-hidden="true" data-corner-mark className={`${styles.cornerMark} ${styles.cornerBL}`} />
          <span aria-hidden="true" data-corner-mark className={`${styles.cornerMark} ${styles.cornerBR}`} />

          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            poster={promo.heroVideo.poster}
          >
            <source src={promo.heroVideo.src} type="video/mp4" />
          </video>

          <button
            type="button"
            className={cn(
              styles.videoPlayOverlay,
              isPlaying && styles.videoPlayOverlayPlaying,
            )}
            onClick={handlePlayPause}
            aria-label={isPlaying ? 'Zatrzymaj film' : 'Odtwórz film promocyjny'}
          >
            <span className={styles.videoPlayBtn}>
              {isPlaying ? (
                <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor">
                  <rect x="6" y="5" width="4" height="14" />
                  <rect x="14" y="5" width="4" height="14" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </span>
          </button>

          <div aria-hidden="true" className={styles.videoBottomBar}>
            <span className={styles.videoCodec}>H.265/LOG3</span>
            <span className={styles.videoProgress}>
              <span
                className={styles.videoProgressFill}
                style={{ transform: `scaleX(${progress})` }}
              />
            </span>
            <span className={styles.videoTimecode}>{timecode}</span>
          </div>
        </div>

        {/* ── YouTube grid ────────────────────────────────────────── */}
        <div ref={ytGridRef} className={styles.ytGrid}>
          {promo.youtubeVideos.map((video) => (
            <YouTubeFacade
              key={video.id + video.title}
              videoId={video.id}
              title={video.title}
            />
          ))}
        </div>

        {/* ── Bottom timeline ─────────────────────────────────────── */}
        <div ref={bottomTimelineRef} aria-hidden="true" className={styles.bottomTimeline}>
          <span data-bottom-seg className={styles.bottomTimelineLine} />
          {promo.youtubeVideos.map((video) => (
            <span key={video.id + video.title} data-bottom-diamond className={styles.bottomTimelineDiamond}>◆</span>
          ))}
        </div>
      </div>
    </section>
  )
}
