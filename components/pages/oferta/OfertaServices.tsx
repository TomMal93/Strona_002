'use client'

import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { siteContent } from '@/lib/site-content'
import CinematicVideoPlayer from '@/components/ui/CinematicVideoPlayer'
import { useLazyVideoSource } from '@/components/ui/useLazyVideoSource'
import styles from './OfertaServices.module.css'
import { OFERTA_HERO_ENTERED_EVENT } from './ofertaAnimation'

gsap.registerPlugin(ScrollTrigger)

type ServiceItem = (typeof siteContent.services.items)[number]

const OFFER_AUDIENCES: Record<ServiceItem['title'], string> = {
  'Film okolicznościowy':
    'Dla osób, które chcą zachować autentyczne emocje i najważniejsze wspomnienia w wyjątkowej formie.',
  'Profesjonalny montaż':
    'Dla twórców, firm i osób, które mają nagrany materiał i potrzebują nadać mu profesjonalny rytm oraz charakter.',
  'Materiały promocyjne':
    'Dla marek, lokalnych biznesów i organizatorów wydarzeń, którzy chcą skutecznie przyciągać uwagę odbiorców.',
}

const OFFER_FORMATS: Record<ServiceItem['title'], string> = {
  'Film okolicznościowy':
    'Krótki film idealny do udostępnienia oraz pełniejsza wersja, do której można wracać przez lata.',
  'Profesjonalny montaż':
    'Rolki, shorty, filmy na YouTube i dłuższe materiały dopasowane do docelowej platformy.',
  'Materiały promocyjne':
    'Spoty, rolki i materiały wizerunkowe przygotowane do strony internetowej oraz social mediów.',
}

type InfoIconProps = {
  type: 'scope' | 'audience' | 'format'
}

function InfoIcon({ type }: InfoIconProps) {
  if (type === 'audience') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="9" cy="8" r="3" />
        <circle cx="16.5" cy="9" r="2.5" />
        <path d="M3.5 19c.4-4 2.5-6 5.5-6s5.1 2 5.5 6" />
        <path d="M14 14c3.5-.6 5.8 1.1 6.5 4.5" />
      </svg>
    )
  }

  if (type === 'format') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="5" width="16" height="14" rx="1" />
        <path d="M7 8h10M7 16h10" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3.5" y="6" width="17" height="14" rx="1" />
      <path d="M7 3v6M17 3v6M3.5 10h17M8 14l2 2 4-4" />
    </svg>
  )
}

type OfertaServiceBlockProps = {
  item: ServiceItem
  index: number
}

function OfertaServiceBlock({ item, index }: OfertaServiceBlockProps) {
  const videoFrameRef = useRef<HTMLDivElement>(null!)
  const shouldLoadVideo = useLazyVideoSource(videoFrameRef)
  const sceneNumber = String(index + 1).padStart(2, '0')

  return (
    <article data-offer-block className={styles.block}>
      <div className={styles.media}>
        <CinematicVideoPlayer
          ref={videoFrameRef}
          className={styles.videoFrame}
          videoClassName={styles.video}
          src={item.video.src}
          poster={item.video.poster}
          shouldLoad={shouldLoadVideo}
          bottomLabel={item.tag}
          playLabel={item.title}
          showPlayOverlay={false}
        >
          {({ togglePlayback }) => (
            <>
              <span aria-hidden="true" className={styles.sceneTag}>
                SCENA {sceneNumber} / 03
              </span>

              <div className={styles.cinematicCopy}>
                <div className={styles.tagLine}>
                  <span>{item.tag}</span>
                  <span aria-hidden="true" className={styles.tagRule} />
                </div>
                <h2 className={styles.title}>{item.title}</h2>
                <p className={styles.lead}>{item.lead}</p>
                <button type="button" className={styles.previewButton} onClick={togglePlayback}>
                  Zobacz przykład
                  <span aria-hidden="true">▶</span>
                </button>
              </div>
            </>
          )}
        </CinematicVideoPlayer>
      </div>

      <div className={styles.detailsPanel}>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoIcon}><InfoIcon type="scope" /></span>
            <div>
              <h3>Co obejmuje</h3>
              <p>{item.description}</p>
            </div>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoIcon}><InfoIcon type="audience" /></span>
            <div>
              <h3>Dla kogo</h3>
              <p>{OFFER_AUDIENCES[item.title]}</p>
            </div>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoIcon}><InfoIcon type="format" /></span>
            <div>
              <h3>Format</h3>
              <p>{OFFER_FORMATS[item.title]}</p>
            </div>
          </div>
        </div>

        <div className={styles.scopeHeading}>
          <span aria-hidden="true" />
          <h3>Zakres usługi</h3>
          <span aria-hidden="true" />
        </div>

        <ul className={styles.bullets}>
          {item.bullets.map((bullet) => (
            <li key={bullet} className={styles.bullet}>
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

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context((_, contextSafe) => {
      const blocks = gsap.utils.toArray<HTMLElement>('[data-offer-block]')
      gsap.set(blocks, { y: 40, autoAlpha: 0 })

      const animateBlocks = () => {
        blocks.forEach((block) => {
          gsap.to(block, {
            y: 0,
            autoAlpha: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: block,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          })
        })

        ScrollTrigger.refresh()
      }

      const revealBlocks = contextSafe
        ? (contextSafe(animateBlocks) as () => void)
        : animateBlocks

      window.addEventListener(OFERTA_HERO_ENTERED_EVENT, revealBlocks, { once: true })

      return () => window.removeEventListener(OFERTA_HERO_ENTERED_EVENT, revealBlocks)
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      aria-label="Szczegóły oferty"
      className="section-dark-bg px-6 pb-20 pt-2 sm:py-24 lg:px-20 lg:pb-28 lg:pt-6"
    >
      <div className="mx-auto flex max-w-content flex-col gap-16 sm:gap-20 lg:gap-24">
        {siteContent.services.items.map((item, index) => (
          <OfertaServiceBlock key={item.title} item={item} index={index} />
        ))}
      </div>
    </section>
  )
}
