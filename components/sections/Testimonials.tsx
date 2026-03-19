'use client'

import React, { useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import { siteContent } from '@/lib/site-content'
import { cn } from '@/lib/utils'
import styles from './Testimonials.module.css'
import { useTestimonialsAnimation } from './testimonials/useTestimonialsAnimation'

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null!)
  const titleRef = useRef<HTMLHeadingElement>(null!)
  const subtitleRef = useRef<HTMLParagraphElement>(null!)
  const hudBarRef = useRef<HTMLDivElement>(null!)
  const carouselShellRef = useRef<HTMLDivElement>(null!)
  const trackRef = useRef<HTMLDivElement>(null!)
  const trustedPanelRef = useRef<HTMLDivElement>(null!)
  const isAnimating = useRef(false)

  const { title, subtitle, hudLabelLeft, hudLabelRight, items, socialProof, trustedBy } =
    siteContent.testimonials
  const socialProofRef = useRef<HTMLDivElement>(null!)

  const total = items.length
  const [activeIndex, setActiveIndex] = useState(1)

  // Extended items: [clone_last, ...items, clone_first]
  const extendedItems = [items[total - 1], ...items, items[0]]

  const { goTo } = useTestimonialsAnimation({
    sectionRef,
    titleRef,
    subtitleRef,
    hudBarRef,
    carouselShellRef,
    trackRef,
    socialProofRef,
    trustedPanelRef,
    totalSlides: total,
    initialDomIndex: activeIndex + 1,
  })

  const handlePrev = useCallback(() => {
    if (isAnimating.current) return
    if (activeIndex <= 0) {
      // Wrap: animate to clone of last (domIndex 0), then snap to real last
      isAnimating.current = true
      setActiveIndex(total - 1)
      goTo(0, total, {
        onComplete: () => {
          goTo(total, total, { instant: true })
          isAnimating.current = false
        },
      })
    } else {
      const newIndex = activeIndex - 1
      setActiveIndex(newIndex)
      goTo(newIndex + 1, total)
    }
  }, [activeIndex, total, goTo])

  const handleNext = useCallback(() => {
    if (isAnimating.current) return
    if (activeIndex >= total - 1) {
      // Wrap: animate to clone of first (domIndex total+1), then snap to real first
      isAnimating.current = true
      setActiveIndex(0)
      goTo(total + 1, total, {
        onComplete: () => {
          goTo(1, total, { instant: true })
          isAnimating.current = false
        },
      })
    } else {
      const newIndex = activeIndex + 1
      setActiveIndex(newIndex)
      goTo(newIndex + 1, total)
    }
  }, [activeIndex, total, goTo])

  const handleDot = useCallback(
    (index: number) => {
      if (isAnimating.current) return
      setActiveIndex(index)
      goTo(index + 1, total)
    },
    [goTo, total],
  )

  // Active DOM index for visual styling
  const activeDomIndex = activeIndex + 1

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      aria-labelledby="testimonials-heading"
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
            id="testimonials-heading"
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

        {/* Carousel */}
        <div ref={carouselShellRef} className={styles.carouselShell} data-carousel-shell>
          <div className={styles.carouselViewport}>
            <div ref={trackRef} className={styles.carouselTrack}>
              {extendedItems.map((item, domIndex) => {
                const isActive = domIndex === activeDomIndex
                // Clones at edges also match active when wrapping visually
                const isCloneOfActive =
                  (domIndex === 0 && activeIndex === total - 1) ||
                  (domIndex === total + 1 && activeIndex === 0)
                const shouldBeActive = isActive || isCloneOfActive

                return (
                  <div
                    key={`${item.author}-${domIndex}`}
                    className={styles.carouselSlide}
                    data-slide
                    {...(!shouldBeActive ? { 'data-inactive': '' } : {})}
                  >
                    <blockquote
                      className={styles.testimonialCard}
                      data-testimonial-card
                    >
                      <span
                        className={styles.cardTagline}
                        data-testimonial-tagline
                      >
                        {item.tagline}
                      </span>
                      <span className={styles.cardNumber} aria-hidden="true">
                        {String(
                          domIndex === 0
                            ? total
                            : domIndex === total + 1
                              ? 1
                              : domIndex,
                        ).padStart(2, '0')}
                      </span>
                      <p className={styles.quoteText}>
                        <span className={styles.quoteOpen}>&ldquo;</span>
                        {item.quote}
                        <span className={styles.quoteClose}>&rdquo;</span>
                      </p>
                      <span className={styles.cardDivider} />
                      <footer className={styles.cardFooter}>
                        <cite className={styles.authorName}>{item.author}</cite>
                        <span className={styles.authorContext}>{item.context}</span>
                      </footer>
                    </blockquote>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Navigation */}
          <nav className={styles.carouselNav} aria-label="Nawigacja opinii">
            <button
              className={styles.navBtn}
              onClick={handlePrev}
              aria-label="Poprzednia opinia"
            >
              <svg viewBox="0 0 24 24">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <div className={styles.dots}>
              {items.map((_, i) => (
                <button
                  key={i}
                  className={cn(styles.dot, i === activeIndex && styles.dotActive)}
                  onClick={() => handleDot(i)}
                  aria-label={`Opinia ${i + 1}`}
                  aria-current={i === activeIndex ? 'true' : undefined}
                />
              ))}
            </div>

            <button
              className={styles.navBtn}
              onClick={handleNext}
              aria-label="Następna opinia"
            >
              <svg viewBox="0 0 24 24">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </nav>
        </div>

        {/* Social proof bar — cinematic HUD readout */}
        <div
          ref={socialProofRef}
          className={styles.socialProofBar}
          data-social-proof
        >
          {/* Film-strip perforations top */}
          <div className={styles.filmStripEdge} aria-hidden="true">
            {Array.from({ length: 24 }).map((_, i) => (
              <span key={i} className={styles.perforation} />
            ))}
          </div>

          {/* Scanning line */}
          <span className={styles.scanLine} aria-hidden="true" />

          {/* Stats grid */}
          <div className={styles.statsGrid}>
            {socialProof.items.map((stat, i) => (
              <div key={stat.tag} className={styles.statCell} data-stat-cell>
                <span className={styles.statTag} data-stat-tag>{stat.tag}</span>
                <span className={styles.statValue} data-stat-value data-target={stat.value} data-suffix={stat.suffix}>
                  <span className={styles.statNumber} data-stat-number>0</span>
                  <span className={styles.statSuffix}>{stat.suffix}</span>
                </span>
                <span className={styles.statLabel}>{stat.label}</span>
                {i < socialProof.items.length - 1 && (
                  <span className={styles.statDivider} aria-hidden="true" />
                )}
              </div>
            ))}
          </div>

          {/* Trusted by — integrated into social proof bar */}
          <div
            ref={trustedPanelRef}
            className={styles.trustedSection}
            data-trusted-panel
          >
            <span aria-hidden="true" className={styles.trustedDivider} />
            <h3 className={cn(styles.trustedTitle, styles.gradientTextPrimary)}>{trustedBy.label}</h3>
            <ul className={styles.logosStrip}>
              {trustedBy.clients.map((client) => (
                <li
                  key={client.name}
                  className={styles.logoItem}
                  data-trusted-item
                >
                  <Image
                    src={client.logo}
                    alt={client.name}
                    width={120}
                    height={48}
                    className={styles.logoImage}
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* Film-strip perforations bottom */}
          <div className={styles.filmStripEdge} aria-hidden="true">
            {Array.from({ length: 24 }).map((_, i) => (
              <span key={i} className={styles.perforation} />
            ))}
          </div>

          {/* Viewfinder corner brackets */}
          <span className={cn(styles.viewfinderCorner, styles.vfTL)} aria-hidden="true" />
          <span className={cn(styles.viewfinderCorner, styles.vfTR)} aria-hidden="true" />
          <span className={cn(styles.viewfinderCorner, styles.vfBL)} aria-hidden="true" />
          <span className={cn(styles.viewfinderCorner, styles.vfBR)} aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
