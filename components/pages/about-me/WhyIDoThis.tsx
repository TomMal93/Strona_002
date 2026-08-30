'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { siteContent } from '@/lib/site-content'
import { cn } from '@/lib/utils'
import styles from './WhyIDoThis.module.css'
import { useWhyIDoThisAnimations } from './useWhyIDoThisAnimations'
import WhyIDoThisVideo from './WhyIDoThisVideo'

const sceneTags = [
  ['Wyczucie chwili', 'Naturalne emocje', 'Spokój w działaniu'],
  ['Filmowe spojrzenie', 'Prawdziwe tempo', 'Kadry z charakterem'],
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

function Tags({ items, label }: { items: string[]; label: string }) {
  return (
    <div className={styles.tagsBlock}>
      <p className={styles.microLabel}>{label}</p>
      <div className={styles.tags}>
        {items.map((item) => <span key={item}>{item}</span>)}
      </div>
    </div>
  )
}

function MissionIcon({ type }: { type: 'mountain' | 'camera' | 'story' }) {
  if (type === 'mountain') {
    return <svg viewBox="0 0 48 40" aria-hidden="true"><path d="m3 35 13-24 8 13 5-8 16 19H3Z" /><path d="m12 19 5 5 4-5" /></svg>
  }
  if (type === 'camera') {
    return <svg viewBox="0 0 48 40" aria-hidden="true"><path d="M5 13h10l3-5h13l3 5h9v22H5V13Z" /><circle cx="24" cy="24" r="8" /><path d="M38 18h1" /></svg>
  }
  return <svg viewBox="0 0 48 40" aria-hidden="true"><rect x="4" y="8" width="40" height="27" rx="3" /><path d="m20 16 11 6.5L20 29V16Z" /></svg>
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
            Notatki reżysera <span aria-hidden="true">•</span> Trzy akty mojej drogi
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
                <Tags items={sceneTags[0]} label="Kluczowe emocje" />
              </div>

              <figure className={styles.frame}>
                <div className={styles.frameTop}><span>H.265/LOG3</span><span>00:00:02:14</span></div>
                <div className={styles.imageStage}>
                  <Image
                    src="/images/contact/contact-hero.webp"
                    alt="Przemek z aparatem podczas pracy w plenerze"
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
                    src="/images/Hero_v4.png"
                    alt="Filmowy portret w ciepłym świetle"
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
                <Tags items={sceneTags[1]} label="Kluczowe elementy" />
              </div>
            </article>

            <article className={cn(styles.scene, styles.sceneThree)}>
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
                  <p className={styles.microLabel}>Notatki z planu</p>
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

                <div className={styles.missionBlock}>
                  <p className={styles.microLabel}>To moja misja</p>
                  <div className={styles.missionGrid}>
                    {[
                      ['mountain', 'Prawdziwa atmosfera'],
                      ['camera', 'Autentyczne chwile'],
                      ['story', 'Opowieść w obrazie'],
                    ].map(([type, label], index) => (
                      <div key={label} data-why-feature-card data-why-feature-row={index + 6} className={styles.missionItem}>
                        <MissionIcon type={type as 'mountain' | 'camera' | 'story'} />
                        <span>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div data-why-video-block className={cn(styles.frame, styles.videoFrame)}>
                <WhyIDoThisVideo
                  embedded
                  videoOverride={{
                    type: 'self-hosted',
                    src: '/videos/contact/contact.mp4',
                    poster: '/images/contact/bio.webp',
                  }}
                />
              </div>
            </article>

            <footer className={styles.quoteFooter}>
              <span aria-hidden="true" className={styles.quoteMark}>“</span>
              <p>Film to nie to, co widać. To to, co czuje widz, gdy światła gasną.</p>
              <span className={styles.signature}>Przemek</span>
            </footer>
          </div>
        </div>
      </div>
    </section>
  )
}
