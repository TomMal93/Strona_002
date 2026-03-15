'use client'

import React, { useRef } from 'react'
import { siteContent } from '@/lib/site-content'
import { cn } from '@/lib/utils'
import styles from './Process.module.css'
import { useProcessAnimations } from './process/useProcessAnimations'

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null!)
  const titleRef = useRef<HTMLHeadingElement>(null!)
  const subtitleRef = useRef<HTMLParagraphElement>(null!)
  const hudBarRef = useRef<HTMLDivElement>(null!)
  const connectorRef = useRef<HTMLDivElement>(null!)
  const stepsContainerRef = useRef<HTMLOListElement>(null!)

  useProcessAnimations({
    sectionRef,
    titleRef,
    subtitleRef,
    hudBarRef,
    connectorRef,
    stepsContainerRef,
  })

  const { title, subtitle, hudLabelLeft, hudLabelRight, steps } = siteContent.process

  return (
    <section
      ref={sectionRef}
      id="process"
      aria-labelledby="process-heading"
      className={cn(
        'bg-anthracite px-6 py-20 sm:py-24 lg:px-20 lg:py-32',
        'section-dark-bg',
      )}
    >
      <div className="mx-auto max-w-content">
        {/* Header: title + HUD bar (underline) */}
        <div className={cn('mx-auto max-w-3xl', styles.sectionHeader)}>
          <h2
            ref={titleRef}
            id="process-heading"
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

        {/* Timeline */}
        <div className={styles.timelineShell}>
          {/* Corner marks (viewfinder) */}
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

          {/* Connector line */}
          <div
            ref={connectorRef}
            className={styles.connectorLine}
            aria-hidden="true"
          />

          {/* Steps grid */}
          <ol ref={stepsContainerRef} className={styles.stepsGrid}>
            {steps.map((step) => (
              <li key={step.number} className={styles.stepCard} data-process-step>
                <span
                  className={styles.stepNode}
                  data-process-node
                  aria-hidden="true"
                />
                <span className={styles.stepNumber}>{step.number}</span>
                <span className={styles.stepLabel}>{step.label}</span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
                <span className={styles.stepTimeline} data-process-timeline-label>
                  {step.timeline}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
