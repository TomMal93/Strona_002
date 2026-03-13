export type HighlightVariant = 'primary' | 'secondary'

export const PRIMARY_HIGHLIGHTS_COUNT = 2

export function getHighlightVariant(index: number): HighlightVariant {
  return index < PRIMARY_HIGHLIGHTS_COUNT ? 'primary' : 'secondary'
}
