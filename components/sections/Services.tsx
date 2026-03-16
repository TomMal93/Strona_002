'use client'

import React, { useRef } from 'react'
import { siteContent } from '@/lib/site-content'
import { cn } from '@/lib/utils'
import styles from './Services.module.css'
import heroStyles from './Hero.module.css'
import { ServiceIcon } from './services/ServiceIcon'
import { useServicesAnimation } from './services/useServicesAnimation'
import {
  getCardVariant,
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
  },
}

function formatSceneNumber(index: number): string {
  return String(index + 1).padStart(2, '0')
}

type SceneCardProps = {
  item: ServiceItem
  index: number
}

function SceneCard({ item, index }: SceneCardProps) {
  const variant = getCardVariant(item.icon)
  const v = VARIANT_CLASSES[variant]

  return (
    <li
      data-service-card
      className={cn(
        'rounded-micro',
        styles.sceneCard,
        v.card,
      )}
    >
      {/* Corner marks — film frame registration */}
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

      {/* Scene number */}
      <span aria-hidden="true" data-scene-number className={styles.sceneNumber}>
        {formatSceneNumber(index)}
      </span>

      <div className={styles.contentLayer}>
        {/* Double reel lines */}
        <div className={styles.reelLines} aria-hidden="true">
          <span className={cn(styles.reelLine, v.reelLine1)} />
          <span className={cn(styles.reelLine, v.reelLine2)} />
        </div>

        <p className={cn('ui-overline mx-auto text-khaki/90', styles.cardTag)}>
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

        <span className={styles.lensDock}>
          <span className={cn(styles.lensRing, v.lensRing)}>
            <ServiceIcon icon={item.icon} className={v.icon} />
          </span>
        </span>

        <p
          className={cn(
            'mx-auto max-w-[38ch] text-center font-inter text-sm leading-relaxed text-warm-gray',
            v.text,
            styles.cardDescription,
          )}
        >
          {item.description}
        </p>
      </div>
    </li>
  )
}

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null!)
  const titleRef = useRef<HTMLHeadingElement>(null!)
  const titleAccentRef = useRef<HTMLSpanElement>(null!)
  const introRef = useRef<HTMLParagraphElement>(null!)
  const timelineRef = useRef<HTMLDivElement>(null!)
  const hudBarRef = useRef<HTMLDivElement>(null!)
  const bottomTimelineRef = useRef<HTMLDivElement>(null!)
  const orderedItems = orderServiceItems(siteContent.services.items)

  useServicesAnimation({
    sectionRef,
    titleRef,
    titleAccentRef,
    introRef,
    timelineRef,
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
          {/* HUD bar — editing timeline interface */}
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
            Pięć ścieżek, jeden cel — <span className="text-amber-200/90 font-medium">materiał, który zostaje w pamięci.</span>
            {'\n'}Wybierz scenę, która pasuje do Twojej historii.
          </p>

        </div>

        {/* --- Film strip cards grid ------------------------------------------ */}
        <div className="mt-12 lg:mt-14">
          <ul className={styles.cardsContainer}>
            {/* Timeline line (desktop) */}
            <div ref={timelineRef} className={styles.timelineLine} aria-hidden="true" />

            {orderedItems.map((item, index) => (
              <SceneCard
                key={item.title}
                item={item}
                index={index}
              />
            ))}
          </ul>
        </div>

        {/* Bottom decorative line — timeline markers */}
        <div ref={bottomTimelineRef} aria-hidden="true" className={styles.bottomTimeline}>
          <span data-bottom-seg className={styles.bottomTimelineLine} />
          {orderedItems.map((item) => (
            <span key={item.title} data-bottom-diamond className={styles.bottomTimelineDiamond}>◆</span>
          ))}
        </div>
      </div>
    </section>
  )
}
