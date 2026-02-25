'use client'

import { useRef } from 'react'
import { siteContent, type ServiceIconName } from '@/lib/site-content'
import { cn } from '@/lib/utils'
import styles from './Services.module.css'
import { ServiceIcon } from './services/ServiceIcon'
import { useServicesAnimation } from './services/useServicesAnimation'

type ServiceItem = (typeof siteContent.services.items)[number]
type CardVariant = 'highlight' | 'military'
type CardStyleClassNames = {
  card: string
  line: string
  title: string
  text: string
  badge: string
  icon: string
}

const HIGHLIGHT_ICONS = new Set<ServiceIconName>(['heart', 'flag'])

const DESKTOP_START_CLASS_NAMES = [
  'lg:col-start-2',
  'lg:col-start-4',
  'lg:col-start-1',
  'lg:col-start-3',
  'lg:col-start-5',
] as const
const TOP_ROW_START_CLASS_NAMES = DESKTOP_START_CLASS_NAMES.slice(0, 2)
const BOTTOM_ROW_START_CLASS_NAMES = DESKTOP_START_CLASS_NAMES.slice(2)
const TOP_ROW_COUNT = 2

function getCardVariant(icon: ServiceIconName): CardVariant {
  return HIGHLIGHT_ICONS.has(icon) ? 'highlight' : 'military'
}

function orderServiceItems(items: readonly ServiceItem[]): ServiceItem[] {
  const highlightItems = items.filter((item) => HIGHLIGHT_ICONS.has(item.icon))
  const regularItems = items.filter((item) => !HIGHLIGHT_ICONS.has(item.icon))
  return [...highlightItems, ...regularItems]
}

const CARD_STYLE_MAP: Record<CardVariant, CardStyleClassNames> = {
  highlight: {
    card: styles.serviceCardHighlight,
    line: styles.cardTopLineHighlight,
    title: styles.highlightTitle,
    text: styles.highlightText,
    badge: styles.iconBadgeHighlight,
    icon: styles.iconHighlight,
  },
  military: {
    card: styles.serviceCardMilitary,
    line: styles.cardTopLineMilitary,
    title: styles.militaryTitle,
    text: styles.militaryText,
    badge: styles.iconBadgeMilitary,
    icon: styles.iconMilitary,
  },
}

function getCardStyleClassNames(variant: CardVariant): CardStyleClassNames {
  return CARD_STYLE_MAP[variant]
}

type ServiceCardProps = {
  item: ServiceItem
  desktopStartClassName: string
}

function ServiceCard({ item, desktopStartClassName }: ServiceCardProps) {
  const variant = getCardVariant(item.icon)
  const variantClassNames = getCardStyleClassNames(variant)

  return (
    <li
      data-service-card
      className={cn(
        'rounded-micro p-5 sm:p-6 md:h-auto md:col-span-1 lg:col-span-2',
        desktopStartClassName,
        variantClassNames.card,
        styles.serviceCard,
      )}
    >
      <div className={styles.contentLayer}>
        <div className={cn('mb-5', styles.cardTopLine, variantClassNames.line)} aria-hidden="true" />

        <p className={cn('ui-overline mx-auto text-khaki/90', styles.cardTag)}>
          {item.tag}
        </p>

        <h3
          className={cn(
            'font-bebas text-2xl md:text-3xl uppercase leading-[1.0] tracking-wide text-warm-white',
            variantClassNames.title,
            styles.cardTitle,
          )}
        >
          {item.title}
        </h3>

        <span className={styles.iconDock}>
          <span className={cn(styles.iconBadge, variantClassNames.badge)}>
            <ServiceIcon icon={item.icon} className={variantClassNames.icon} />
          </span>
        </span>

        <p
          className={cn(
            'mx-auto max-w-[38ch] text-center font-inter text-sm leading-relaxed text-warm-gray',
            variantClassNames.text,
            styles.cardDescription,
          )}
        >
          {item.description}
        </p>
      </div>
    </li>
  )
}

type ServiceCardsRowProps = {
  items: ServiceItem[]
  startClassNames: readonly string[]
  colsClass?: string
}

function ServiceCardsRow({ items, startClassNames, colsClass = '' }: ServiceCardsRowProps) {
  return (
    <ul className={cn('grid gap-5 md:gap-y-0 lg:grid-cols-6', colsClass, styles.cardsGrid)}>
      {items.map((item, index) => (
        <ServiceCard
          key={item.title}
          item={item}
          desktopStartClassName={startClassNames[index] ?? ''}
        />
      ))}
    </ul>
  )
}

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null)
  const orderedItems = orderServiceItems(siteContent.services.items)
  const topRowItems = orderedItems.slice(0, TOP_ROW_COUNT)
  const bottomRowItems = orderedItems.slice(TOP_ROW_COUNT)

  useServicesAnimation(sectionRef)

  return (
    // --- Services section: heading + intro + cards grid ---------------------
    <section
      ref={sectionRef}
      id="services"
      aria-labelledby="services-heading"
      className={cn(
        'bg-anthracite px-6 py-20 sm:py-24 lg:px-20 lg:py-32',
        styles.sectionBackground,
      )}
    >
      <div className="mx-auto max-w-content">
        <div className={cn('mx-auto flex max-w-3xl flex-col items-center text-center', styles.sectionHeaderShell)}>
          <h2
            id="services-heading"
            className={cn(
              'text-center font-bebas text-5xl uppercase leading-[0.9] tracking-wide text-warm-white sm:text-6xl',
              styles.sectionTitle,
            )}
          >
            {siteContent.services.title}
          </h2>
          <span aria-hidden="true" className={styles.sectionTitleAccent} />

          <p
            className={cn(
              'mt-5 max-w-2xl whitespace-pre-line font-inter font-light text-[16px] leading-[1.75] text-white/60',
              styles.sectionIntro,
            )}
          >
            {siteContent.services.subtitle}
          </p>
        </div>

        {/* --- Services cards list -------------------------------------------- */}
        <div className="mt-12 space-y-7 lg:mt-14 lg:space-y-9">
          <ServiceCardsRow items={topRowItems} startClassNames={TOP_ROW_START_CLASS_NAMES} colsClass="sm:grid-cols-2" />
          <div className={styles.rowDivider} aria-hidden="true" />
          <ServiceCardsRow items={bottomRowItems} startClassNames={BOTTOM_ROW_START_CLASS_NAMES} colsClass="sm:grid-cols-2 md:grid-cols-3" />
        </div>
      </div>
    </section>
  )
}
