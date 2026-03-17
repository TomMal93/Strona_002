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

  const socialProofPanelRef = useRef<HTMLDivElement>(null!)

  const { title, subtitle, hudLabelLeft, hudLabelRight, items, trustedBy, socialProof } =
    siteContent.testimonials

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
    trustedPanelRef,
    socialProofPanelRef,
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

        {/* Trusted by panel */}
        <div
          ref={trustedPanelRef}
          className={styles.trustedPanel}
          data-trusted-panel
        >
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
          <div className={styles.trustedHeader}>
            <h3 className={cn(styles.trustedTitle, styles.gradientTextPrimary)}>{trustedBy.label}</h3>
          </div>
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

        {/* Social proof in numbers */}
        <div
          ref={socialProofPanelRef}
          className={styles.socialProofPanel}
          data-social-proof-panel
        >
          <span
            aria-hidden="true"
            data-corner-mark-sp
            className={cn(styles.cornerMark, styles.cornerTL)}
          />
          <span
            aria-hidden="true"
            data-corner-mark-sp
            className={cn(styles.cornerMark, styles.cornerTR)}
          />
          <span
            aria-hidden="true"
            data-corner-mark-sp
            className={cn(styles.cornerMark, styles.cornerBL)}
          />
          <span
            aria-hidden="true"
            data-corner-mark-sp
            className={cn(styles.cornerMark, styles.cornerBR)}
          />
          <div className={styles.socialProofHeader}>
            <h3 className={cn(styles.socialProofTitle, styles.gradientTextPrimary)}>
              {socialProof.label}
            </h3>
          </div>
          <div className={styles.statsGrid}>
            {socialProof.items.map((stat) => (
              <div
                key={stat.description}
                className={styles.statItem}
                data-stat-item
              >
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statDescription}>{stat.description}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
