'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { siteContent } from '@/lib/site-content'
import { cn } from '@/lib/utils'
import styles from './Services.module.css'

gsap.registerPlugin(ScrollTrigger)

// --- Service icons ----------------------------------------------------------
const iconClassName = 'h-5 w-5 text-khaki'

function ServiceIcon({ icon }: { icon: string }) {
  switch (icon) {
    case 'crosshair':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={iconClassName}>
          <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1.8" />
          <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      )
    case 'heart':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={iconClassName}>
          <path
            d="M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.4-7 10-7 10Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
        </svg>
      )
    case 'drone':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={iconClassName}>
          <circle cx="6" cy="6" r="3" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="18" cy="6" r="3" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="18" cy="18" r="3" stroke="currentColor" strokeWidth="1.8" />
          <path d="M9 9l6 6M15 9l-6 6" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      )
    case 'wheel':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={iconClassName}>
          <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
          <path d="M12 4v5M20 12h-5M12 20v-5M4 12h5" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      )
    case 'flag':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={iconClassName}>
          <path d="M6 3v18M6 4h10l-2 4 2 4H6" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      )
    default:
      return null
  }
}

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null)

  // --- Card entrance animation (FR-07) --------------------------------------
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('[data-service-card]')

      if (prefersReducedMotion) {
        gsap.set(cards, { autoAlpha: 1, y: 0 })
        return
      }

      gsap.set(cards, { autoAlpha: 0, y: 40 })
      gsap.to(cards, {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    // --- Services section: heading + intro + cards grid ---------------------
    <section
      ref={sectionRef}
      id="services"
      aria-labelledby="services-heading"
      className="bg-anthracite px-6 py-20 sm:py-24 lg:px-20 lg:py-32"
    >
      <div className="mx-auto max-w-content">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <p
            className={cn(
              'ui-overline inline-flex items-center gap-2 rounded-micro border border-khaki/55 bg-khaki/10 px-4 py-1.5',
              'shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]',
            )}
          >
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-khaki/85" />
            {siteContent.services.overline}
          </p>

          <h2
            id="services-heading"
            className="mt-4 font-oswald text-5xl uppercase leading-[1.1] tracking-wide text-warm-white sm:text-6xl"
          >
            {siteContent.services.title}
          </h2>

          <p className="mt-5 max-w-2xl font-inter text-base leading-relaxed text-warm-gray sm:text-lg">
            {siteContent.services.subtitle}
          </p>
        </div>

        {/* --- Services cards list -------------------------------------------- */}
        <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:mt-14 lg:grid-cols-6">
          {siteContent.services.items.map((item, index) => {
            const itemsCount = siteContent.services.items.length
            const isTwoCardsInLastDesktopRow = itemsCount % 3 === 2
            const isFirstItemInLastDesktopRow = index === itemsCount - 2

            return (
            <li
              key={item.title}
              data-service-card
              className={cn(
                'h-full rounded-micro p-6 md:col-span-1 lg:col-span-2',
                isTwoCardsInLastDesktopRow && isFirstItemInLastDesktopRow && 'lg:col-start-2',
                styles.serviceCard,
              )}
            >
              <div className={styles.contentLayer}>
                <div className={cn('mb-5', styles.cardTopLine)} aria-hidden="true" />

                <div className="flex flex-col items-center gap-3 text-center">
                  <h3 className="font-oswald text-3xl uppercase leading-[1.2] tracking-wide text-warm-white">
                    {item.title}
                  </h3>
                </div>

                <p className="mx-auto mt-3 max-w-[38ch] text-center font-inter text-sm leading-relaxed text-warm-gray">
                  {item.description}
                </p>

              </div>
              <span className={styles.iconDock}>
                <span className={styles.iconBadge}>
                  <ServiceIcon icon={item.icon} />
                </span>
              </span>
            </li>
          )
          })}
        </ul>
      </div>
    </section>
  )
}
