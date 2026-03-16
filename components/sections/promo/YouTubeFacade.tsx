'use client'

import { useState, useCallback } from 'react'
import styles from '../Promo.module.css'

type YouTubeFacadeProps = {
  videoId: string
  title: string
}

export function YouTubeFacade({ videoId, title }: YouTubeFacadeProps) {
  const [loaded, setLoaded] = useState(false)

  const handleClick = useCallback(() => {
    setLoaded(true)
  }, [])

  if (loaded) {
    return (
      <div className={styles.ytCard}>
        <div className={styles.ytEmbed}>
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className={styles.ytIframe}
          />
        </div>
        <p className={styles.ytTitle}>{title}</p>
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
        <img
          src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
          alt=""
          className={styles.ytThumbnail}
          loading="lazy"
        />
        <span className={styles.ytScanline} aria-hidden="true" />
        <span className={styles.ytPlayBtn} aria-hidden="true">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </button>
      <p className={styles.ytTitle}>{title}</p>
    </div>
  )
}
