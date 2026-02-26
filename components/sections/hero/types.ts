import type { RefObject } from 'react'

export type HeroRefs = {
  sectionRef: RefObject<HTMLElement>
  eyebrowRef: RefObject<HTMLSpanElement>
  headingRef: RefObject<HTMLParagraphElement>
  underlineRef: RefObject<HTMLSpanElement>
  descriptionRef: RefObject<HTMLParagraphElement>
  ctaRef: RefObject<HTMLElement>
}
