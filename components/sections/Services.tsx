'use client'

import React, { useEffect, useRef, useState } from 'react'
import { siteContent } from '@/lib/site-content'
import { cn } from '@/lib/utils'
import styles from './Services.module.css'
import heroStyles from './Hero.module.css'
import Button from '@/components/ui/Button'
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
  cornerTL: string
  cornerBR: string
  videoFrame: string
  bullet: string
  bulletDot: string
  playButton: string
  playButtonPlaying: string
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
    cornerTL: '',
    cornerBR: '',
    videoFrame: styles.videoFrameHighlight,
    bullet: styles.bulletHighlight,
    bulletDot: styles.bulletDotHighlight,
    playButton: styles.playButtonHighlight,
    playButtonPlaying: styles.playButtonPlayingHighlight,
  },
  military: {
    card: styles.sceneCardMilitary,
    reelLine1: styles.reelLineMilitary1,
    reelLine2: styles.reelLineMilitary2,
    title: styles.militaryTitle,
    text: styles.militaryText,
    lensRing: styles.lensRingMilitary,
    icon: styles.iconMilitary,
    cornerTL: styles.cornerTLMilitary,
    cornerBR: styles.cornerBRMilitary,
    videoFrame: styles.videoFrameMilitary,
    bullet: styles.bulletMilitary,
    bulletDot: styles.bulletDotMilitary,
    playButton: styles.playButtonMilitary,
    playButtonPlaying: styles.playButtonPlayingMilitary,
  },
}

type SceneCardProps = {
  item: ServiceItem
  index: number
}

function SceneCard({ item, index }: SceneCardProps) {
  const variant = getCardVariant(item.icon)
  const v = VARIANT_CLASSES[variant]
  const videoRef = useRef<HTMLVideoElement>(null!)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const onPause = () => setIsPlaying(false)
    const onPlay = () => setIsPlaying(true)
    const onEnded = () => {
      setIsPlaying(false)
      video.currentTime = 0
    }

    video.addEventListener('pause', onPause)
    video.addEventListener('play', onPlay)
    video.addEventListener('ended', onEnded)

    return () => {
      video.removeEventListener('pause', onPause)
      video.removeEventListener('play', onPlay)
      video.removeEventListener('ended', onEnded)
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
      data-service-card
      className={cn(
        'rounded-micro',
        styles.sceneCard,
        v.card,
      )}
    >
      <span
        aria-hidden="true"
        data-corner-mark
        className={cn(styles.cornerMark, styles.cornerTL, v.cornerTL)}
      />
      <span
        aria-hidden="true"
        data-corner-mark
        className={cn(styles.cornerMark, styles.cornerBR, v.cornerBR)}
      />

      <span aria-hidden="true" data-scene-number className={styles.sceneNumber}>
        {getSceneNumber(index)}
      </span>

      <div className={styles.contentLayer}>
        <div className={styles.reelLines} aria-hidden="true">
          <span className={cn(styles.reelLine, v.reelLine1)} />
          <span className={cn(styles.reelLine, v.reelLine2)} />
        </div>

        <div className={cn(styles.videoFrame, v.videoFrame)}>
          <span className={styles.videoBadge}>{item.tag}</span>
          <span className={styles.videoStatus}>{isPlaying ? 'preview on' : 'click to play'}</span>

          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            ref={videoRef}
            className={styles.cardVideo}
            poster={item.video.poster}
            preload="metadata"
            muted
            playsInline
            onClick={toggleVideo}
          >
            <source src={item.video.src} type="video/mp4" />
          </video>

          <button
            type="button"
            className={cn(
              styles.playButton,
              v.playButton,
              isPlaying && styles.playButtonPlaying,
              isPlaying && v.playButtonPlaying,
            )}
            onClick={toggleVideo}
            aria-label={isPlaying ? `Zatrzymaj podgląd: ${item.title}` : `Odtwórz podgląd: ${item.title}`}
          >
            <span className={styles.playIcon}>
              {isPlaying ? 'II' : 'PLAY'}
            </span>
          </button>
        </div>

        <div className={styles.cardBody}>
          <div className={styles.cardHeader}>
            <span className={styles.lensDock}>
              <span className={cn(styles.lensRing, v.lensRing)}>
                <ServiceIcon icon={item.icon} className={v.icon} />
              </span>
            </span>

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
  const bottomTimelineRef = useRef<HTMLDivElement>(null!)
  const orderedItems = orderServiceItems(siteContent.services.items)

  useServicesAnimation({
    sectionRef,
    titleRef,
    titleAccentRef,
    introRef,
    hudBarRef,
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
              SCENA 04 / 06
            </span>
            <span data-hud-line="right" className={styles.hudLineRight} />
          </div>

          <p
            ref={introRef}
            className={cn(
              'mt-5 whitespace-pre-line font-mono text-[0.95rem] leading-[1.85] tracking-wide text-white/50',
              styles.sectionIntro,
            )}
          >
            {siteContent.services.subtitle}
          </p>
        </div>

        <div className="mt-12 lg:mt-14">
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
          <Button as="a" href="#contact" variant="outline" size="lg" className={styles.ctaButton}>
            {siteContent.services.ctaLabel}
          </Button>
        </div>
      </div>
    </section>
  )
}
