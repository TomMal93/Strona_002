import type { RefObject } from 'react'
import { siteContent } from '@/lib/site-content'
import Button from '@/components/ui/Button'
import { heroClassNames } from './classNames'
import SplitLetters from './SplitLetters'

type HeroContentProps = {
  headlineRef: RefObject<HTMLHeadingElement>
  subtitleRef: RefObject<HTMLParagraphElement>
  ctaRef: RefObject<HTMLAnchorElement>
}

export default function HeroContent({
  headlineRef,
  subtitleRef,
  ctaRef,
}: HeroContentProps) {
  return (
    <div className={heroClassNames.contentWrapper}>
      <h1
        ref={headlineRef}
        className={heroClassNames.headline}
      >
        <SplitLetters text={siteContent.hero.headlineLine1} />
        <br />
        <SplitLetters text={siteContent.hero.headlineLine2} className="text-khaki" />
      </h1>

      <p
        ref={subtitleRef}
        className={heroClassNames.subtitle}
      >
        {siteContent.hero.subtitle}
      </p>

      <Button
        as="a"
        ref={ctaRef}
        href="#contact"
        variant="hero"
        size="lg"
        className={heroClassNames.cta}
      >
        {siteContent.hero.ctaLabel}
      </Button>
    </div>
  )
}
