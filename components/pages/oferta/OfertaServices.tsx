'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { siteContent } from '@/lib/site-content'
import { useLazyVideoSource } from '@/components/ui/useLazyVideoSource'
import { cn } from '@/lib/utils'
import { ServiceIcon } from '@/components/sections/services/ServiceIcon'
import styles from './OfertaServices.module.css'

gsap.registerPlugin(ScrollTrigger)

type ServiceItem = (typeof siteContent.services.items)[number]

type OfertaServiceBlockProps = {
  item: ServiceItem
  index: number
}

function OfertaServiceBlock({ item, index }: OfertaServiceBlockProps) {
  const videoFrameRef = useRef<HTMLDivElement>(null!)
  const shouldLoadVideo = useLazyVideoSource(videoFrameRef)
  const sceneNumber = String(index + 1).padStart(2, '0')
  const mediaFirst = index % 2 === 1

  return (
    <article
      data-offer-block
      className={cn(
        styles.block,
        'grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start lg:gap-14',
      )}
    >
      <div className={cn(styles.media, mediaFirst && 'lg:order-2')}>
        <div ref={videoFrameRef} className={styles.videoFrame}>
          <span aria-hidden="true" className={styles.sceneTag}>
            SCENE {sceneNumber} / 03
          </span>
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            className={styles.video}
            poster={item.video.poster}
            controls
            muted
            playsInline
            preload="metadata"
          >
            {shouldLoadVideo && <source src={item.video.src} type="video/mp4" />}
          </video>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.header}>
          <span className={styles.iconDock} aria-hidden="true">
            <ServiceIcon icon={item.icon} className="h-6 w-6" />
          </span>
          <p className="ui-overline text-khaki/90">{item.tag}</p>
          <h2
            className={cn(
              'font-bebas text-3xl uppercase leading-[1.0] tracking-wide text-warm-white md:text-4xl lg:text-5xl',
            )}
          >
            {item.title}
          </h2>
        </div>

        <p className="mt-6 font-inter text-sm leading-relaxed text-warm-gray">
          {item.lead}
        </p>
      </div>

      <div className={cn(styles.details, 'lg:order-3')}>
        <div className={styles.detailsHeader}>
          <p className="ui-overline text-khaki/90">Rozszerzone info</p>
          <h3 className="font-bebas text-2xl uppercase leading-[1.0] tracking-wide text-warm-white md:text-3xl">
            Co obejmuje usługa
          </h3>
        </div>

        <p className={styles.detailsDescription}>
          {item.description}
        </p>

        <ul className={styles.bullets}>
          {item.bullets.map((bullet) => (
            <li key={bullet} className={styles.bullet}>
              <span aria-hidden="true" className={styles.bulletDot} />
              <span className={styles.bulletText}>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}

export default function OfertaServices() {
  const sectionRef = useRef<HTMLElement>(null!)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      const blocks = gsap.utils.toArray<HTMLElement>('[data-offer-block]')
      blocks.forEach((block) => {
        gsap.from(block, {
          y: 40,
          autoAlpha: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: block,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      aria-label="Szczegóły oferty"
      className="section-dark-bg px-6 py-20 sm:py-24 lg:px-20 lg:py-28"
    >
      <div className="mx-auto flex max-w-content flex-col gap-16 sm:gap-20 lg:gap-24">
        {siteContent.services.items.map((item, index) => (
          <OfertaServiceBlock key={item.title} item={item} index={index} />
        ))}
      </div>
    </section>
  )
}
