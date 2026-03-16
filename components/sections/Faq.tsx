'use client'

import React, { useState, useRef } from 'react'
import { siteContent } from '@/lib/site-content'
import { cn } from '@/lib/utils'
import styles from './Faq.module.css'
import { useFaqAnimations } from './faq/useFaqAnimations'

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const sectionRef = useRef<HTMLElement>(null!)
  const titleRef = useRef<HTMLHeadingElement>(null!)
  const subtitleRef = useRef<HTMLParagraphElement>(null!)
  const hudBarRef = useRef<HTMLDivElement>(null!)
  const itemsContainerRef = useRef<HTMLDivElement>(null!)

  useFaqAnimations({
    sectionRef,
    titleRef,
    subtitleRef,
    hudBarRef,
    itemsContainerRef,
  })

  const { title, subtitle, hudLabelLeft, hudLabelRight, items } = siteContent.faq

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index))
  }

  return (
    <section
      ref={sectionRef}
      id="faq"
      aria-labelledby="faq-heading"
      className={cn(
        'bg-anthracite px-6 py-20 sm:py-24 lg:px-20 lg:py-32',
        'section-dark-bg',
      )}
    >
      <div className="mx-auto max-w-content">
        {/* Header: title + HUD bar + subtitle */}
        <div className={cn('mx-auto max-w-3xl', styles.sectionHeader)}>
          <h2
            ref={titleRef}
            id="faq-heading"
            className={cn(
              styles.gradientTextPrimary,
              'text-center font-bebas text-5xl uppercase leading-[0.9] tracking-wide sm:text-6xl',
              styles.sectionTitle,
            )}
          >
            {title}
          </h2>
          <div ref={hudBarRef} aria-hidden="true" className={styles.hudBar}>
            <span data-hud-line className={styles.hudLineLeft} />
            <span data-hud-label className={styles.hudLabelLeft}>
              {hudLabelLeft}
            </span>
            <span data-hud-line className={styles.hudLineLeft} />
            <span data-hud-line className={styles.hudLineRight} />
            <span data-hud-label className={styles.hudLabelRight}>
              {hudLabelRight}
            </span>
            <span data-hud-line className={styles.hudLineRight} />
          </div>

          <p
            ref={subtitleRef}
            className="mt-5 whitespace-pre-line font-mono text-[0.95rem] leading-[1.85] tracking-wide text-white/50"
          >
            {subtitle}
          </p>
        </div>

        {/* FAQ Shell with corner marks */}
        <div className={styles.faqShell}>
          {/* Corner marks */}
          <span
            aria-hidden="true"
            data-corner-mark
            className={cn(styles.cornerMark, styles.cornerTL)}
          />
          <span
            aria-hidden="true"
            data-corner-mark
            className={cn(styles.cornerMark, styles.cornerTR)}
          />
          <span
            aria-hidden="true"
            data-corner-mark
            className={cn(styles.cornerMark, styles.cornerBL)}
          />
          <span
            aria-hidden="true"
            data-corner-mark
            className={cn(styles.cornerMark, styles.cornerBR)}
          />

          {/* Film strip indicator (desktop only) */}
          <div className={styles.filmStrip} aria-hidden="true">
            {items.map((item, i) => (
              <span
                key={item.number}
                data-film-marker
                className={cn(
                  styles.filmStripMarker,
                  openIndex === i && styles.filmStripMarkerActive,
                )}
              />
            ))}
          </div>

          {/* FAQ items accordion */}
          <div ref={itemsContainerRef} className={styles.itemsList}>
            {items.map((item, i) => {
              const isOpen = openIndex === i
              return (
                <div
                  key={item.number}
                  className={cn(styles.faqItem, isOpen && styles.faqItemActive)}
                  data-faq-item
                >
                  <button
                    className={styles.faqQuestion}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${i}`}
                    onClick={() => handleToggle(i)}
                  >
                    <span
                      className={cn(
                        styles.questionNumber,
                        isOpen && styles.questionNumberActive,
                      )}
                    >
                      {item.number}
                    </span>
                    <span className={styles.questionText}>{item.question}</span>
                    <span
                      className={cn(
                        styles.toggleIcon,
                        isOpen && styles.toggleIconOpen,
                      )}
                    >
                      +
                    </span>
                  </button>
                  <div
                    id={`faq-answer-${i}`}
                    role="region"
                    aria-labelledby={`faq-question-${i}`}
                    className={cn(
                      styles.faqAnswer,
                      isOpen && styles.faqAnswerOpen,
                    )}
                  >
                    <div className={styles.answerInner}>
                      <span className={styles.scanLineOverlay} aria-hidden="true" />
                      <p className={styles.answerText}>{item.answer}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
