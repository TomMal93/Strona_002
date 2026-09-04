import type { RefObject } from 'react'

export type HeroRefs = {
  sectionRef: RefObject<HTMLElement | null>
  eyebrowRef: RefObject<HTMLSpanElement | null>
  headingRef: RefObject<HTMLParagraphElement | null>
  underlineRef: RefObject<HTMLSpanElement | null>
  verticalLineRef: RefObject<HTMLSpanElement | null>
  descriptionRef: RefObject<HTMLParagraphElement | null>
  ctaRef: RefObject<HTMLElement | null>
}
