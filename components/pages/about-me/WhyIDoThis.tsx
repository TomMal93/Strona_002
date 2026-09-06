'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { siteContent } from '@/lib/site-content'
import { cn } from '@/lib/utils'
import styles from './WhyIDoThis.module.css'
import { useWhyIDoThisAnimations } from './useWhyIDoThisAnimations'
import WhyIDoThisVideo from './WhyIDoThisVideo'

const sceneTags = [
  ['Wyczucie chwili', 'Naturalne emocje', 'Spokój w działaniu', 'Szczerość momentu'],
  ['Filmowe spojrzenie', 'Prawdziwe tempo', 'Kadry z charakterem', 'Światło i dźwięk'],
]

function SceneHeading({ number }: { number: string }) {
  return (
    <div className={styles.sceneHeading}>
      <span className={styles.timelineDot} aria-hidden="true" />
      <span className={styles.sceneNumber}>Akt {number}</span>
      <span data-hud-line className={styles.sceneRule} aria-hidden="true" />
    </div>
  )
}

function Tags({ items }: { items: string[] }) {
  return (
    <div className={styles.tagsBlock}>
      <div className={styles.tags}>
        {items.map((item) => <span key={item}>{item}</span>)}
      </div>
    </div>
  )
}

type MissionIconType = 'mountain' | 'camera' | 'story' | 'light' | 'sound'

function MissionIcon({ type }: { type: MissionIconType }) {
  if (type === 'mountain') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m2 20 7-11 5 7 4-5 4 9H2Z" />
        <path d="m8 11 3 4 3-4" />
      </svg>
    )
  }
  if (type === 'camera') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 7h4l2-3h6l2 3h4v13H3V7Z" />
        <circle cx="12" cy="13.5" r="3.5" />
      </svg>
    )
  }
  if (type === 'light') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="3.5" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" />
      </svg>
    )
  }
  if (type === 'sound') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 10v4h4l5 4V6l-5 4H4Z" />
        <path d="M16 9c1.5 1.5 1.5 4.5 0 6M18.5 6.5c3 3 3 8 0 11" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m10 9 6 3-6 3V9Z" />
    </svg>
  )
}

export default function WhyIDoThis() {
  const sectionRef = useRef<HTMLElement>(null!)
  const titleRef = useRef<HTMLHeadingElement>(null!)
  const subtitleRef = useRef<HTMLParagraphElement>(null!)
  const hudBarRef = useRef<HTMLDivElement>(null!)
  const bioPanelRef = useRef<HTMLDivElement>(null!)

  useWhyIDoThisAnimations({ sectionRef, titleRef, subtitleRef, hudBarRef, bioPanelRef })

  const { bio } = siteContent.aboutMe
  const paragraphs = bio.text.split('\n\n').map((paragraph) => paragraph.replace(/\n/g, ' '))

  return (
    <section
      ref={sectionRef}
      aria-labelledby="why-i-do-this-heading"
      className={cn('section-dark-bg', styles.section)}
    >
      <div className={styles.container}>
        <header className={styles.sectionHeader}>
          <h2 ref={titleRef} id="why-i-do-this-heading" className={styles.sectionTitle}>
            {bio.title}
          </h2>
          <p ref={subtitleRef} className={styles.sectionKicker}>
            Trzy akty mojej drogi
          </p>
        </header>

        <div ref={hudBarRef} className={styles.storyRail}>
          <div ref={bioPanelRef} className={styles.story}>
            <article className={cn(styles.scene, styles.sceneOne)}>
              <div className={styles.sceneCopy}>
                <SceneHeading number="I" />
                <h3>Początek<br />każdej podróży</h3>
                <p data-why-paragraph>{paragraphs[0]}</p>
                <p data-why-paragraph>{paragraphs[1]}</p>
                <Tags items={sceneTags[0]} />
              </div>

              <figure className={styles.frame}>
                <div className={styles.frameTop}><span>H.265/LOG3</span><span>00:00:02:14</span></div>
                <div className={styles.imageStage}>
                  <Image
                    src="/images/contact/why-act-1-journey-v1.webp"
                    alt="Filmowiec z aparatem na górskim szlaku o świcie"
                    fill
                    sizes="(max-width: 767px) 100vw, 58vw"
                    className={styles.sceneImage}
                  />
                </div>
                <div className={styles.frameBottom}><span>01</span><span>Akt I</span></div>
              </figure>
            </article>

            <article className={cn(styles.scene, styles.sceneTwo)}>
              <figure className={cn(styles.frame, styles.quoteFrame)}>
                <div className={styles.frameTop}><span>H.265/LOG3</span><span>00:00:06:47</span></div>
                <div className={styles.imageStage}>
                  <Image
                    src="/images/contact/why-act-2-campfire-v1.webp"
                    alt="Filmowiec przy ognisku w lesie o zmierzchu"
                    fill
                    sizes="(max-width: 767px) 100vw, 56vw"
                    className={styles.sceneImage}
                  />
                  <blockquote>Film to więcej niż obraz.<br />To pamięć, uczucie, perspektywa.</blockquote>
                </div>
                <div className={styles.frameBottom}><span>02</span><span>Akt II</span></div>
              </figure>

              <div className={styles.sceneCopy}>
                <SceneHeading number="II" />
                <h3>Odkrycie<br />głębszego sensu</h3>
                <p data-why-paragraph>{paragraphs[2]}</p>
                <Tags items={sceneTags[1]} />
              </div>
            </article>

            <article className={cn(styles.scene, styles.sceneThree)}>
              <div className={styles.sceneCopyColumn}>
                <div className={styles.sceneCopy}>
                  <SceneHeading number="III" />
                  <h3>Dziś buduję opowieści</h3>
                  <p data-why-paragraph className={styles.highlightLine}>
                    Dziś nie tylko nagrywam — buduję opowieści. Każdy projekt zaczynam od uważnej
                    obserwacji ludzi, miejsca i emocji. Łączę obraz, ruch i dźwięk tak, aby historia
                    miała własny rytm. Powstaje film, który pozwala na nowo przeżyć to, co wydarzyło
                    się naprawdę.
                  </p>
                  <div className={styles.directorNotes}>
                    {[
                      ['01', 'Obserwuję', 'Szukam gestów i reakcji, których nie da się wyreżyserować.'],
                      ['02', 'Czekam', 'Daję wydarzeniom własne tempo, żeby emocje pozostały prawdziwe.'],
                      ['03', 'Opowiadam', 'Łączę światło, ruch i dźwięk w historię, do której chce się wracać.'],
                    ].map(([number, title, description], index) => (
                      <div key={number} data-why-feature-card data-why-feature-row={index + 3} className={styles.noteRow}>
                        <span>{number}</span>
                        <div>
                          <strong>{title}</strong>
                          <p>{description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div data-why-mission-block className={styles.missionBlock}>
                  <div className={styles.missionGrid}>
                    {[
                      { type: 'mountain', title: 'Atmosfera', subtitle: 'Prawdziwy klimat' },
                      { type: 'camera', title: 'Autentyczność', subtitle: 'Prawdziwe chwile' },
                      { type: 'story', title: 'Opowieść', subtitle: 'Historia w obrazie' },
                      { type: 'light', title: 'Światło', subtitle: 'Buduje nastrój' },
                    ].map((item, index) => (
                      <div
                        key={item.title}
                        data-why-feature-card
                        data-why-feature-row={index + 6}
                        className={styles.missionItem}
                      >
                        <MissionIcon type={item.type as MissionIconType} />
                        <div>
                          <strong>{item.title}</strong>
                          <span>{item.subtitle}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div data-why-video-block className={cn(styles.frame, styles.videoFrame)}>
                <div className={styles.frameTop}><span>H.265/LOG3</span><span>00:00:10:21</span></div>
                <WhyIDoThisVideo
                  embedded
                  fillAvailableHeight
                  videoOverride={{
                    type: 'self-hosted',
                    src: '/videos/contact/contact.mp4',
                    poster: '/images/contact/bio.webp',
                  }}
                />
                <div className={styles.frameBottom}><span>03</span><span>Akt III</span></div>
              </div>
            </article>

            <footer data-why-quote-footer className={styles.quoteFooter}>
              <span aria-hidden="true" className={styles.quoteMark}>“</span>
              <p>Film to nie to, co widać. To to, co czuje widz, gdy światła gasną.</p>
            </footer>
          </div>
        </div>
      </div>
    </section>
  )
}
