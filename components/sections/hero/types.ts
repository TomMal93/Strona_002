import type { RefObject } from 'react'

export type HeroRefs = {
  sectionRef: RefObject<HTMLElement>
  eyebrowRef: RefObject<HTMLSpanElement>
  headingRef: RefObject<HTMLHeadingElement>
  descriptionRef: RefObject<HTMLParagraphElement>
  ctaRef: RefObject<HTMLDivElement>
  imageRef: RefObject<HTMLDivElement>
  largeCircleRef: RefObject<HTMLDivElement>
  smallCircleRef: RefObject<HTMLDivElement>
}
