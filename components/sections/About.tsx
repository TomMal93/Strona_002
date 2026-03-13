'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { siteContent } from '@/lib/site-content'
import { cn } from '@/lib/utils'
import styles from './About.module.css'
import { useAboutAnimation } from './about/useAboutAnimation'

const ABOUT_HIGHLIGHTS_LIMIT = 3

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const highlights = siteContent.about.highlights.slice(0, ABOUT_HIGHLIGHTS_LIMIT)

  useAboutAnimation(sectionRef)

  return (
    <section
      id="about"
      ref={sectionRef}
      aria-label="O mnie"
      className={cn('section-dark-bg px-6 py-20 md:py-28 lg:px-20')}
    >
      <div className="mx-auto max-w-content">
        <div className={cn('mx-auto flex max-w-3xl flex-col items-center text-center', styles.sectionHeaderShell)} data-about-item>
          <span className="ui-overline">POZNAJMY SIĘ</span>
          <h2
            id="about-heading"
            className="mt-4 font-bebas text-5xl uppercase leading-[0.92] tracking-wide text-warm-white sm:text-6xl"
          >
            {siteContent.about.title}
          </h2>
          <span aria-hidden="true" className={styles.sectionTitleAccent} />
        </div>

        <div className="mt-10 grid gap-8 md:mt-12 md:grid-cols-12 md:items-center md:gap-10 lg:gap-12">
          <div className="md:col-span-5" data-about-item>
            <div className={styles.mediaShell}>
              <div aria-hidden="true" className={styles.mediaHalo} />
              <div className={styles.mediaFrame}>
                <Image
                  src="/images/hero.webp"
                  alt={siteContent.about.imageAlt}
                  width={680}
                  height={1020}
                  className="h-full w-full object-cover"
                  sizes="(max-width: 767px) 100vw, 40vw"
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-7" data-about-item>
            <p className="max-w-[34ch] font-inter text-lg leading-relaxed text-warm-white/95">
              {siteContent.about.lead}
            </p>
            <p className="mt-4 max-w-[50ch] font-inter text-base leading-relaxed text-warm-gray">
              {siteContent.about.description}
            </p>

            <ul className="mt-8 space-y-4" aria-label="Wyróżniki" data-about-highlights>
              {highlights.map((highlight) => (
                <li key={highlight.title} className={styles.highlightItem} data-about-highlight>
                  <h3 className="font-bebas text-[1.35rem] uppercase tracking-wide text-warm-white">{highlight.title}</h3>
                  <p className="mt-1 font-inter text-sm leading-relaxed text-warm-gray">{highlight.description}</p>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <a href="#services" className={styles.ctaLink}>
                {siteContent.about.ctaLabel}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
