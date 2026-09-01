'use client'

import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from 'react'
import { cn } from '@/lib/utils'
import styles from './CinematicVideoPlayer.module.css'

type CinematicVideoPlayerProps = {
  src: string
  poster: string
  shouldLoad: boolean
  className?: string
  videoClassName?: string
  playLabel?: string
  muted?: boolean
  showPlayOverlay?: boolean
  clickToToggle?: boolean
  children?: ReactNode | ((controls: { isPlaying: boolean; togglePlayback: () => void }) => ReactNode)
}

const CinematicVideoPlayer = forwardRef<HTMLDivElement, CinematicVideoPlayerProps>(
  (
    {
      src,
      poster,
      shouldLoad,
      className,
      videoClassName,
      playLabel = 'film',
      muted = false,
      showPlayOverlay = true,
      clickToToggle = false,
      children,
    },
    ref,
  ) => {
    const videoRef = useRef<HTMLVideoElement>(null!)
    const progressRef = useRef<HTMLButtonElement>(null!)
    const [isPlaying, setIsPlaying] = useState(false)
    const [progress, setProgress] = useState(0)
    const [volume, setVolume] = useState(1)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [timecode, setTimecode] = useState('00:00/00:00')
    const sourceType = src.toLowerCase().endsWith('.webm') ? 'video/webm' : 'video/mp4'

    const handlePlayPause = useCallback(() => {
      const video = videoRef.current
      if (!video) return

      if (video.paused) {
        void video.play()
        setIsPlaying(true)
        return
      }

      video.pause()
      setIsPlaying(false)
    }, [])

    const handleVolumeChange = useCallback((value: number) => {
      const nextVolume = Math.min(1, Math.max(0, value))
      const video = videoRef.current
      if (video) video.volume = nextVolume
      setVolume(nextVolume)
    }, [])

    const handleFullscreen = useCallback(() => {
      const frame = videoRef.current?.parentElement
      if (!frame) return

      if (document.fullscreenElement) {
        void document.exitFullscreen()
        return
      }

      void frame.requestFullscreen()
    }, [])

    const handleProgressSeek = useCallback((event: ReactMouseEvent<HTMLButtonElement>) => {
      const video = videoRef.current
      const progressEl = progressRef.current
      if (!video || !progressEl || !Number.isFinite(video.duration) || video.duration <= 0) return

      const rect = progressEl.getBoundingClientRect()
      const clickRatio = (event.clientX - rect.left) / rect.width
      const nextProgress = Math.min(1, Math.max(0, clickRatio))

      video.currentTime = video.duration * nextProgress
      setProgress(nextProgress)
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

      const onVolumeChange = () => {
        setVolume(video.volume)
      }

      const onPlay = () => {
        setIsPlaying(true)
        window.dispatchEvent(
          new CustomEvent('app:video-play', { detail: { target: video } }),
        )
      }
      const onPause = () => setIsPlaying(false)

      const onOtherVideoPlay = (e: Event) => {
        const customEvent = e as CustomEvent<{ target: HTMLVideoElement }>
        if (customEvent.detail?.target !== video && !video.paused) {
          video.pause()
        }
      }

      video.addEventListener('timeupdate', onTimeUpdate)
      video.addEventListener('loadedmetadata', onLoadedMetadata)
      video.addEventListener('volumechange', onVolumeChange)
      video.addEventListener('play', onPlay)
      video.addEventListener('pause', onPause)
      window.addEventListener('app:video-play', onOtherVideoPlay)
      return () => {
        video.removeEventListener('timeupdate', onTimeUpdate)
        video.removeEventListener('loadedmetadata', onLoadedMetadata)
        video.removeEventListener('volumechange', onVolumeChange)
        video.removeEventListener('play', onPlay)
        video.removeEventListener('pause', onPause)
        window.removeEventListener('app:video-play', onOtherVideoPlay)
      }
    }, [])

    useEffect(() => {
      const frame = videoRef.current?.parentElement

      const onFullscreenChange = () => {
        setIsFullscreen(document.fullscreenElement === frame)
      }

      document.addEventListener('fullscreenchange', onFullscreenChange)
      return () => document.removeEventListener('fullscreenchange', onFullscreenChange)
    }, [])

    return (
      <div ref={ref} className={cn(styles.frame, className)}>
        {typeof children === 'function'
          ? children({ isPlaying, togglePlayback: handlePlayPause })
          : children}

        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          ref={videoRef}
          className={cn(styles.video, clickToToggle && styles.videoClickable, videoClassName)}
          onClick={clickToToggle ? handlePlayPause : undefined}
          loop
          muted={muted}
          playsInline
          preload="metadata"
          poster={poster}
        >
          {shouldLoad && <source src={src} type={sourceType} />}
        </video>

        {showPlayOverlay && (
          <button
            type="button"
            className={cn(styles.playOverlay, isPlaying && styles.playOverlayPlaying)}
            onClick={handlePlayPause}
            aria-label={isPlaying ? `Zatrzymaj ${playLabel}` : `Odtwórz ${playLabel}`}
          >
            <span className={cn(styles.playBtn, isPlaying && styles.playBtnPlaying)}>
              <span className={cn(styles.playIcon, styles.playIconPlay)}>
                <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <span className={cn(styles.playIcon, styles.playIconPause)}>
                <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor">
                  <rect x="6" y="5" width="4" height="14" />
                  <rect x="14" y="5" width="4" height="14" />
                </svg>
              </span>
            </span>
          </button>
        )}

        <div className={styles.bottomBar}>
          <button
            ref={progressRef}
            type="button"
            className={styles.progress}
            onClick={handleProgressSeek}
            aria-label="Przewiń film do wybranego momentu"
          >
            <span className={styles.progressTrack}>
              <span className={styles.progressFill} style={{ transform: `scaleX(${progress})` }} />
            </span>
          </button>
          <span className={styles.timecode}>{timecode}</span>
        </div>

        <div className={styles.controls} role="group" aria-label="Kontrolki filmu">
          {!muted && (
            <label className={styles.volumeControl}>
              <span className={styles.controlLabel}>Volume</span>
              <input
                className={styles.volumeSlider}
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(event) => handleVolumeChange(Number(event.currentTarget.value))}
                aria-label="Głośność filmu"
              />
            </label>
          )}
          <button
            type="button"
            className={styles.controlButton}
            onClick={handleFullscreen}
            aria-label={isFullscreen ? 'Wyłącz pełny ekran' : 'Włącz pełny ekran'}
          >
            {isFullscreen ? (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 3v6H3" />
                <path d="M15 3v6h6" />
                <path d="M9 21v-6H3" />
                <path d="M15 21v-6h6" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 3H3v5" />
                <path d="M16 3h5v5" />
                <path d="M8 21H3v-5" />
                <path d="M16 21h5v-5" />
              </svg>
            )}
          </button>
        </div>
      </div>
    )
  },
)

CinematicVideoPlayer.displayName = 'CinematicVideoPlayer'

export default CinematicVideoPlayer
