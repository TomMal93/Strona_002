import type { ServiceIconName } from '@/lib/site-content'

export type CardVariant = 'highlight' | 'military'

const HIGHLIGHT_ICONS = new Set<ServiceIconName>(['heart', 'flag'])

type WithServiceIcon = {
  icon: ServiceIconName
}

export function getCardVariant(icon: ServiceIconName): CardVariant {
  return HIGHLIGHT_ICONS.has(icon) ? 'highlight' : 'military'
}

const DISPLAY_ORDER: ServiceIconName[] = ['heart', 'wheel', 'flag']

export function orderServiceItems<T extends WithServiceIcon>(items: readonly T[]): T[] {
  const byIcon = new Map(items.map((item) => [item.icon, item]))
  return DISPLAY_ORDER.flatMap((icon) => {
    const item = byIcon.get(icon)
    return item ? [item] : []
  })
}

export function getSceneNumber(index: number): string {
  return String(index + 1).padStart(2, '0')
}
