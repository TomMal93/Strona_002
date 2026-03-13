import Image from 'next/image'
import { siteContent } from '@/lib/site-content'
import { cn } from '@/lib/utils'
import styles from './About.module.css'
import { getHighlightVariant } from './about/highlightLayout'

export default function About() {
  const highlights = siteContent.about.highlights

  return (
    <section
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
            <div className="w-fit">
              <h2
                id="about-heading"
                className="font-bebas text-5xl uppercase leading-[0.92] tracking-wide text-warm-white sm:text-6xl"
              >
                {siteContent.about.title}
              </h2>
              <span aria-hidden="true" className={styles.sectionTitleAccent} />
            </div>

            <div className={styles.glassPanel}>
              <span className="ui-overline mb-3 block">POZNAJMY SIĘ</span>
              <p className="whitespace-pre-line font-inter text-2xl leading-relaxed text-warm-white/95">
                {siteContent.about.lead}
              </p>
              <p className="mt-4 whitespace-pre-line font-inter text-xl leading-relaxed text-warm-gray">
                {siteContent.about.description}
              </p>

              <ul className={styles.highlightsGrid} aria-label="Wyróżniki">
                {highlights.map((highlight, index) => {
                  const variant = getHighlightVariant(index)

                  return (
                  <li
                    key={highlight.title}
                    className={cn(
                      styles.highlightItem,
                      variant === 'primary' ? styles.highlightItemPrimary : styles.highlightItemSecondary,
                    )}
                  >
                    <div className={styles.highlightTopLine} aria-hidden="true" />
                    <h3 className="font-bebas text-[1.5rem] uppercase leading-[1.05] tracking-[0.02em] text-warm-white sm:text-[1.65rem]">{highlight.title}</h3>
                    <p className="mt-1.5 font-inter text-base leading-relaxed text-warm-gray/95 sm:text-[1.0625rem]">{highlight.description}</p>
                  </li>
                  )
                })}
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
