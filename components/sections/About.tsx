'use client'

import { useRef, useCallback } from 'react'
import Image from 'next/image'
import { siteContent } from '@/lib/site-content'
import styles from './About.module.css'
import { useAboutAnimations } from './about/useAboutAnimations'

export default function About() {
  const highlights = siteContent.about.highlights

  const sectionRef = useRef<HTMLElement>(null!)
  const titleRef = useRef<HTMLHeadingElement>(null!)
  const titleAccentRef = useRef<HTMLSpanElement>(null!)
  const viewfinderRef = useRef<HTMLDivElement>(null!)
  const leadRef = useRef<HTMLParagraphElement>(null!)
  const descriptionRef = useRef<HTMLParagraphElement>(null!)
  const highlightRefs = useRef<(HTMLLIElement | null)[]>([])
  const ctaRef = useRef<HTMLDivElement>(null!)

  const setHighlightRef = useCallback(
    (index: number) => (el: HTMLLIElement | null) => {
      highlightRefs.current[index] = el
    },
    [],
  )

  useAboutAnimations({
    sectionRef,
    titleRef,
    titleAccentRef,
    viewfinderRef,
    leadRef,
    descriptionRef,
    highlightRefs,
    ctaRef,
  })

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-label="O mnie"
      className="section-dark-bg px-6 py-20 md:py-28 lg:px-10"
    >
      <div className="grid gap-8 md:grid-cols-12 md:items-center md:gap-10 lg:gap-12">
          <div className="md:col-span-6">
            <div className={styles.mediaShell}>
              <div aria-hidden="true" className={styles.mediaHalo} />
              <div className={styles.mediaFrame}>
                <Image
                  src="/images/about_me_001.png"
                  alt={siteContent.about.imageAlt}
                  width={680}
                  height={1020}
                  className="h-full w-full object-cover"
                  sizes="(max-width: 767px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-5">
            {/* Title */}
            <div className="w-fit">
              <h2
                ref={titleRef}
                id="about-heading"
                className="font-bebas text-5xl uppercase leading-[0.92] tracking-wide text-warm-white sm:text-6xl"
              >
                {siteContent.about.title}
              </h2>
              <span ref={titleAccentRef} aria-hidden="true" className={styles.sectionTitleAccent} />
            </div>

            {/* Viewfinder frame */}
            <div ref={viewfinderRef} className={styles.viewfinder}>
              {/* Corner marks */}
              <span aria-hidden="true" className={`${styles.cornerMark} ${styles.cornerTL}`} />
              <span aria-hidden="true" className={`${styles.cornerMark} ${styles.cornerTR}`} />
              <span aria-hidden="true" className={`${styles.cornerMark} ${styles.cornerBL}`} />
              <span aria-hidden="true" className={`${styles.cornerMark} ${styles.cornerBR}`} />

              {/* Content inside the viewfinder */}
              <div className={styles.viewfinderContent}>
                <span className={styles.viewfinderOverline}>REC</span>

                <p ref={leadRef} className={styles.viewfinderLead}>
                  {siteContent.about.lead}
                </p>

                <span aria-hidden="true" className={styles.viewfinderDivider} />

                <p ref={descriptionRef} className={styles.viewfinderDesc}>
                  {siteContent.about.description}
                </p>
              </div>
            </div>

            {/* Camera-style parameters */}
            <ul className={styles.cameraParams} aria-label="Wyróżniki">
              {highlights.map((highlight, index) => (
                <li
                  key={highlight.title}
                  ref={setHighlightRef(index)}
                  className={styles.paramItem}
                >
                  <span className={styles.paramLabel}>{highlight.title}</span>
                  <span className={styles.paramDesc}>{highlight.description}</span>
                </li>
              ))}
            </ul>

            <div ref={ctaRef} className="mt-6">
              <a href="#services" className={styles.ctaLink}>
                {siteContent.about.ctaLabel}
              </a>
            </div>
          </div>
      </div>
    </section>
  )
}
