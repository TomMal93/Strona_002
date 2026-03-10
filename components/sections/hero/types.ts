import type { RefObject } from 'react'

export type HeroRefs = {
  sectionRef: RefObject<HTMLElement>
  eyebrowRef: RefObject<HTMLSpanElement>
  headingRef: RefObject<HTMLParagraphElement>
  underlineRef: RefObject<HTMLSpanElement>
  verticalLineRef: RefObject<HTMLSpanElement>
  descriptionRef: RefObject<HTMLParagraphElement>
  ctaRef: RefObject<HTMLElement>
  cinematicOverlayRef: RefObject<HTMLDivElement>
  blurOverlayRef: RefObject<HTMLDivElement>
  lightSweepRef: RefObject<HTMLDivElement>
  filmGrainRef: RefObject<HTMLDivElement>
  particlesRef: RefObject<HTMLDivElement>
  ringGlowRef: RefObject<HTMLDivElement>
  imageRef: RefObject<HTMLDivElement>
}
