'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { siteContent } from '@/lib/site-content'
import { cn } from '@/lib/utils'
import styles from './AboutMeVideo.module.css'
import { useAboutMeVideoAnimations } from './useAboutMeVideoAnimations'

type AboutMeVideoProps = {
  videoOverride?: {
    title?: string
    hudLabelLeft?: string
    hudLabelRight?: string
    type?: 'youtube' | 'self-hosted'
    youtubeId?: string
    src?: string
    poster?: string
  }
}

export default function AboutMeVideo({ videoOverride }: AboutMeVideoProps) {
  const sectionRef = useRef<HTMLElement>(null!)
  const titleRef = useRef<HTMLHeadingElement>(null!)
  const subtitleRef = useRef<HTMLParagraphElement>(null!)
  const hudBarRef = useRef<HTMLDivElement>(null!)
  const videoShellRef = useRef<HTMLDivElement>(null!)
  const videoRef = useRef<HTMLVideoElement>(null!)

  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [timecode, setTimecode] = useState('00:00/00:00')

  const video = {
    ...siteContent.aboutMe.video,
    ...videoOverride,
  }
  const isYouTube = video.type === 'youtube'

  const handlePlayPause = useCallback(() => {
    const vid = videoRef.current
    if (!vid) return
    if (vid.paused) {
      vid.play()
      setIsPlaying(true)
    } else {
      vid.pause()
      setIsPlaying(false)
    }
  }, [])

  useEffect(() => {
    if (isYouTube) return
    const vid = videoRef.current
    if (!vid) return

    function formatTime(sec: number): string {
      const m = Math.floor(sec / 60)
      const s = Math.floor(sec % 60)
      return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    }

    const onTimeUpdate = () => {
      const dur = vid.duration || 1
      setProgress(vid.currentTime / dur)
      setTimecode(`${formatTime(vid.currentTime)}/${formatTime(dur)}`)
    }

    const onLoadedMetadata = () => {
      setTimecode(`00:00/${formatTime(vid.duration)}`)
    }

    vid.addEventListener('timeupdate', onTimeUpdate)
    vid.addEventListener('loadedmetadata', onLoadedMetadata)
    return () => {
      vid.removeEventListener('timeupdate', onTimeUpdate)
      vid.removeEventListener('loadedmetadata', onLoadedMetadata)
    }
  }, [isYouTube])

  useAboutMeVideoAnimations({
    sectionRef,
    titleRef,
    subtitleRef,
    hudBarRef,
    videoShellRef,
  })

  return (
    <section
      ref={sectionRef}
      aria-labelledby="aboutme-video-heading"
      className={cn(
        'bg-anthracite px-6 py-20 sm:py-24 lg:px-20 lg:py-32',
        'section-dark-bg',
      )}
    >
      <div className="mx-auto max-w-content">
        {/* Header */}
        <div className={cn('mx-auto max-w-3xl', styles.sectionHeader)}>
          <h2
            ref={titleRef}
            id="aboutme-video-heading"
            className={cn(
              styles.gradientTextPrimary,
              'text-center font-bebas text-5xl uppercase leading-[0.9] tracking-wide sm:text-6xl',
              styles.sectionTitle,
            )}
          >
            {video.title}
          </h2>
          <div ref={hudBarRef} aria-hidden="true" className={styles.hudBar}>
            <span data-hud-line className={styles.hudLineLeft} />
            <span data-hud-label className={styles.hudLabelLeft}>
              {video.hudLabelLeft}
            </span>
            <span data-hud-line className={styles.hudLineLeft} />
            <span data-hud-line className={styles.hudLineRight} />
            <span data-hud-label className={styles.hudLabelRight}>
              {video.hudLabelRight}
            </span>
            <span data-hud-line className={styles.hudLineRight} />
          </div>

          <p
            ref={subtitleRef}
            className="mt-5 whitespace-pre-line font-mono text-[0.95rem] leading-[1.85] tracking-wide text-white/50"
          >
            Poznaj mnie bliżej — w kilka minut.
          </p>
        </div>

        {/* Video player */}
        <div
          ref={videoShellRef}
          className={cn(
            styles.videoShell,
            isYouTube ? styles.videoShellLandscape : styles.videoShellPortrait,
          )}
        >
          <div className={styles.videoHalo} aria-hidden="true" />

          {/* Sprocket holes */}
          <div
            className={cn(
              styles.sprocketTop,
              isYouTube ? styles.sprocketLandscape : styles.sprocketPortrait,
            )}
            aria-hidden="true"
          />

          <div
            className={cn(
              styles.videoFrame,
              isYouTube ? styles.videoFrameLandscape : styles.videoFramePortrait,
            )}
          >
            <span aria-hidden="true" className={cn(styles.cornerMark, styles.cornerTL)} />
            <span aria-hidden="true" className={cn(styles.cornerMark, styles.cornerTR)} />
            <span aria-hidden="true" className={cn(styles.cornerMark, styles.cornerBL)} />
            <span aria-hidden="true" className={cn(styles.cornerMark, styles.cornerBR)} />

            {isYouTube ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?rel=0`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <>
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <video
                  ref={videoRef}
                  muted
                  loop
                  playsInline
                  poster={video.poster}
                >
                  <source src={video.src} type="video/mp4" />
                </video>

                <button
                  type="button"
                  className={cn(
                    styles.videoPlayOverlay,
                    isPlaying && styles.videoPlayOverlayPlaying,
                  )}
                  onClick={handlePlayPause}
                  aria-label={isPlaying ? 'Zatrzymaj film' : 'Odtwórz film'}
                >
                  <span
                    className={cn(
                      styles.videoPlayBtn,
                      isPlaying && styles.videoPlayBtnPlaying,
                    )}
                  >
                    <span className={cn(styles.videoPlayIcon, styles.videoPlayIconPlay)}>
                      <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                    <span className={cn(styles.videoPlayIcon, styles.videoPlayIconPause)}>
                      <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor">
                        <rect x="6" y="5" width="4" height="14" />
                        <rect x="14" y="5" width="4" height="14" />
                      </svg>
                    </span>
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
              </>
            )}
          </div>

          {/* Sprocket holes bottom */}
          <div
            className={cn(
              styles.sprocketBottom,
              isYouTube ? styles.sprocketLandscape : styles.sprocketPortrait,
            )}
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  )
}
