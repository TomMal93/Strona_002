import type { RefObject } from 'react'

export type HeroRefs = {
  sectionRef: RefObject<HTMLElement>
  eyebrowRef: RefObject<HTMLSpanElement>
  headingRef: RefObject<HTMLParagraphElement>
  descriptionRef: RefObject<HTMLParagraphElement>
  ctaRef: RefObject<HTMLAnchorElement>
}
