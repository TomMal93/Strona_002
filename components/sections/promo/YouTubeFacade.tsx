'use client'

import { useState, useCallback, useEffect, useId } from 'react'
import Image from 'next/image'
import styles from '../Promo.module.css'

type YouTubeFacadeProps = {
  videoId: string
  title: string
  index?: number
}

export function YouTubeFacade({ videoId, title, index }: YouTubeFacadeProps) {
  const instanceId = useId()
  const [loaded, setLoaded] = useState(false)

  const handleClick = useCallback(() => {
    setLoaded(true)
    window.dispatchEvent(
      new CustomEvent('app:video-play', { detail: { target: instanceId } }),
    )
  }, [instanceId])

  useEffect(() => {
    const onOtherVideoPlay = (e: Event) => {
      const customEvent = e as CustomEvent<{ target: unknown }>
      if (customEvent.detail?.target !== instanceId) {
        setLoaded(false)
      }
    }

    window.addEventListener('app:video-play', onOtherVideoPlay)
    return () => {
      window.removeEventListener('app:video-play', onOtherVideoPlay)
    }
  }, [instanceId])

  const cornerMarks = (
    <>
      <span aria-hidden="true" className={`${styles.cornerMark} ${styles.cornerTL}`} />
      <span aria-hidden="true" className={`${styles.cornerMark} ${styles.cornerTR}`} />
      <span aria-hidden="true" className={`${styles.cornerMark} ${styles.cornerBL}`} />
      <span aria-hidden="true" className={`${styles.cornerMark} ${styles.cornerBR}`} />
    </>
  )

  if (loaded) {
    return (
      <div className={styles.ytCard}>
        <div className={styles.ytEmbed}>
          {cornerMarks}
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className={styles.ytIframe}
          />
        </div>
        <VideoDetails title={title} index={index} />
      </div>
    )
  }

  return (
    <div className={styles.ytCard}>
      <button
        type="button"
        className={styles.ytThumbnailBtn}
        onClick={handleClick}
        aria-label={`Odtwórz: ${title}`}
      >
        <Image
          src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
          alt=""
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 640px"
          className={styles.ytThumbnail}
          loading="lazy"
        />
        <span className={styles.ytScanline} aria-hidden="true" />
        {cornerMarks}
        <span className={styles.ytPlayBtn} aria-hidden="true">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </button>
      <VideoDetails title={title} index={index} />
    </div>
  )
}

function VideoDetails({
  title,
  index,
}: Pick<YouTubeFacadeProps, 'title' | 'index'>) {
  return (
    <div className={styles.ytDetails}>
      {typeof index === 'number' && (
        <span className={styles.ytIndex} aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </span>
      )}
      <div className={styles.ytCopy}>
        <p className={styles.ytTitle}>{title}</p>
      </div>
    </div>
  )
}
