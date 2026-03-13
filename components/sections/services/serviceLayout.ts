import type { ServiceIconName } from '@/lib/site-content'

export type CardVariant = 'highlight' | 'military'

const HIGHLIGHT_ICONS = new Set<ServiceIconName>(['heart', 'flag'])

type WithServiceIcon = {
  icon: ServiceIconName
}

export function getCardVariant(icon: ServiceIconName): CardVariant {
  return HIGHLIGHT_ICONS.has(icon) ? 'highlight' : 'military'
}

export function orderServiceItems<T extends WithServiceIcon>(items: readonly T[]): T[] {
  const groupedItems = items.reduce(
    (acc, item) => {
      if (HIGHLIGHT_ICONS.has(item.icon)) {
        acc.highlight.push(item)
      } else {
        acc.regular.push(item)
      }

      return acc
    },
    { highlight: [] as T[], regular: [] as T[] },
  )

  return [...groupedItems.highlight, ...groupedItems.regular]
}

export function splitServiceRows<T>(items: readonly T[], topRowCount: number): [T[], T[]] {
  return [items.slice(0, topRowCount), items.slice(topRowCount)]
}
