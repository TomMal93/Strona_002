'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { siteContent } from '@/lib/site-content'
import CinematicVideoPlayer from '@/components/ui/CinematicVideoPlayer'
import { useLazyVideoSource } from '@/components/ui/useLazyVideoSource'
import { cn } from '@/lib/utils'
import { ServiceIcon } from '@/components/sections/services/ServiceIcon'
import styles from './OfertaServices.module.css'

gsap.registerPlugin(ScrollTrigger)

type ServiceItem = (typeof siteContent.services.items)[number]

const OFFER_DETAILS_DESCRIPTIONS: Partial<Record<ServiceItem['title'], string>> = {
  'Film okolicznościowy':
    'Film, który uchwyci Wasze emocje, najpiękniejsze chwile i atmosferę całego dnia — pamiątka na całe życie. Dbam o naturalne kadry, dyskretną pracę w trakcie wydarzenia i montaż, który prowadzi przez najważniejsze momenty bez sztucznego przeciągania historii. Materiał może obejmować zarówno dynamiczny skrót, jak i dłuższą formę dopasowaną do charakteru uroczystości.',
  'Profesjonalny montaż':
    'Montuję filmy z Twoich materiałów, od vlogów na YouTube przez rolki na media społecznościowe. Porządkuję ujęcia, wybieram najmocniejsze fragmenty, układam tempo i dbam o spójność obrazu oraz dźwięku. W zależności od potrzeb mogę przygotować krótką, dynamiczną wersję do publikacji albo dłuższy materiał gotowy do prezentacji klientom, rodzinie lub społeczności.',
  'Materiały promocyjne':
    'Twoja marka w najlepszym świetle — przyciągnij uwagę odbiorców. Tworzę materiały, które jasno pokazują produkt, usługę lub wydarzenie i są dopasowane do miejsca publikacji: strony internetowej, kampanii reklamowej albo social mediów. Stawiam na czytelny przekaz, dobre tempo i ujęcia, które wzmacniają charakter marki zamiast tylko dekorować film.',
}

type OfertaServiceBlockProps = {
  item: ServiceItem
  index: number
}

function OfertaServiceBlock({ item, index }: OfertaServiceBlockProps) {
  const videoFrameRef = useRef<HTMLDivElement>(null!)
  const shouldLoadVideo = useLazyVideoSource(videoFrameRef)
  const sceneNumber = String(index + 1).padStart(2, '0')
  const mediaFirst = index % 2 === 1
  const detailsDescription = OFFER_DETAILS_DESCRIPTIONS[item.title] ?? item.description

  return (
    <article
      data-offer-block
      className={cn(
        styles.block,
        'grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start lg:gap-14',
      )}
    >
      <div className={cn(styles.body, !mediaFirst && 'lg:order-2')}>
        <div className={styles.header}>
          <span className={styles.iconDock} aria-hidden="true">
            <ServiceIcon icon={item.icon} className="h-6 w-6" />
          </span>
          <p className="ui-overline text-khaki/90">{item.tag}</p>
          <h2
            className={cn(
              styles.title,
              'font-bebas text-3xl uppercase leading-[1.0] tracking-wide text-warm-white md:text-4xl lg:text-5xl',
            )}
          >
            {item.title}
          </h2>
        </div>

        <p className="mt-6 text-center font-inter text-sm leading-relaxed text-warm-gray">
          {item.lead}
        </p>
      </div>

      <div className={cn(styles.media, !mediaFirst && 'lg:order-1')}>
        <CinematicVideoPlayer
          ref={videoFrameRef}
          className={styles.videoFrame}
          videoClassName={styles.video}
          src={item.video.src}
          poster={item.video.poster}
          shouldLoad={shouldLoadVideo}
          bottomLabel={item.tag}
          playLabel={item.title}
        >
          <span aria-hidden="true" className={styles.sceneTag}>
            SCENE {sceneNumber} / 03
          </span>
        </CinematicVideoPlayer>
      </div>

      <div className={cn(styles.details, 'lg:order-3')}>
        <div className={styles.detailsHeader}>
          <h3 className="text-center font-bebas text-2xl uppercase leading-[1.0] tracking-wide text-warm-white md:text-3xl lg:text-left">
            Co obejmuje usługa
          </h3>
        </div>

        <p className={styles.detailsDescription}>
          {detailsDescription}
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
      className="section-dark-bg px-6 pb-20 pt-2 sm:py-24 lg:px-20 lg:py-28"
    >
      <div className="mx-auto flex max-w-content flex-col gap-16 sm:gap-20 lg:gap-24">
        {siteContent.services.items.map((item, index) => (
          <OfertaServiceBlock key={item.title} item={item} index={index} />
        ))}
      </div>
    </section>
  )
}
