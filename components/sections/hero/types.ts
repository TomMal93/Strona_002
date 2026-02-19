import type { RefObject } from 'react'

export type HeroRefs = {
  sectionRef: RefObject<HTMLElement>
  mediaRef: RefObject<HTMLDivElement>
  headlineRef: RefObject<HTMLHeadingElement>
  subtitleRef: RefObject<HTMLParagraphElement>
  ctaRef: RefObject<HTMLAnchorElement>
  scrollRef: RefObject<HTMLDivElement>
}
