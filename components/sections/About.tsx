'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { siteContent } from '@/lib/site-content'
import { cn } from '@/lib/utils'
import { useAboutAnimation } from './about/useAboutAnimation'
import styles from './About.module.css'

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)

  useAboutAnimation(sectionRef)

  const [col1, col2, col3] = siteContent.about.highlights

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-labelledby="about-heading"
      className="section-dark-bg px-6 py-20 sm:py-24 lg:px-20 lg:py-28"
    >
      <div className="relative z-10 mx-auto max-w-content">
        <div className={cn('mx-auto flex max-w-3xl flex-col items-center text-center', styles.sectionHeaderShell)}>
          <h2
            id="about-heading"
            className={cn('font-bebas text-[38px] uppercase leading-[0.9] tracking-wide md:text-[64px]', styles.headingGradient)}
          >
            {siteContent.about.title}
          </h2>
          <span aria-hidden="true" className={styles.headingAccent} />
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3 lg:items-stretch">
          <article data-about-item className={styles.textColumn}>
            <h3 className="font-bebas text-[30px] uppercase leading-[1.0] tracking-wide text-warm-white">
              {col1.title}
            </h3>
            <p className="mt-4 font-inter text-[15px] leading-relaxed text-warm-gray">
              {col1.description}
            </p>
          </article>

          <div data-about-item className={styles.imageFrame}>
            <Image
              src="/images/about_me_001.webp"
              alt={siteContent.about.imageAlt}
              width={720}
              height={1080}
              className={styles.imageMedia}
              sizes="(min-width: 1024px) 26vw, (min-width: 640px) 55vw, 92vw"
            />
          </div>

          <article data-about-item className={styles.textColumn}>
            <h3 className="font-bebas text-[30px] uppercase leading-[1.0] tracking-wide text-warm-white">
              {col2.title}
            </h3>
            <p className="mt-4 font-inter text-[15px] leading-relaxed text-warm-gray">
              {col2.description}
            </p>
            <p className="mt-3 font-inter text-[15px] leading-relaxed text-white/80">
              {col3.description}
            </p>
          </article>
        </div>
      </div>
    </section>
  )
}
