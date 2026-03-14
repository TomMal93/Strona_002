import { type JSX, type Ref } from 'react'
import { siteContent } from '@/lib/site-content'
import { cn } from '@/lib/utils'
import styles from '../Hero.module.css'
import { filterSupportedSocialLinks, type SocialPlatform } from './socialPlatforms'

const ctaBaseClassName = 'px-4 py-2 text-center font-bebas text-[18px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-khaki focus-visible:outline-offset-2'

const socialIcons: Record<SocialPlatform, JSX.Element> = {
  facebook: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  instagram: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  ),
  tiktok: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9a8.19 8.19 0 0 0 4.78 1.52V7.07a4.85 4.85 0 0 1-1.01-.38z" />
    </svg>
  ),
  youtube: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
    </svg>
  ),
}

export type HeroTextBlockProps = {
  headingClassName: string
  underlineClassName: string
  animated?: boolean
  eyebrowRef?: Ref<HTMLSpanElement>
  headingRef?: Ref<HTMLParagraphElement>
  descriptionRef?: Ref<HTMLParagraphElement>
  underlineRef?: Ref<HTMLSpanElement>
  verticalLineRef?: Ref<HTMLSpanElement>
  ctaRef?: Ref<HTMLDivElement>
}

export default function HeroTextBlock({
  headingClassName,
  underlineClassName,
  animated = false,
  eyebrowRef,
  headingRef,
  descriptionRef,
  underlineRef,
  verticalLineRef,
  ctaRef,
}: HeroTextBlockProps) {
  const socialLinks = filterSupportedSocialLinks(siteContent.hero.social)

  return (
    <>
      <div className={styles.textBlock}>
        <span ref={verticalLineRef} aria-hidden="true" className={cn(styles.verticalLine, animated && styles.animScaleYZero)} />
        <span
          ref={eyebrowRef}
          className={cn(styles.gradientTextSecondary, 'block font-bebas text-[18px] uppercase tracking-heading', animated && styles.animHide)}
        >
          {siteContent.hero.eyebrow}
        </span>

        <p
          ref={headingRef}
          aria-hidden="true"
          className={cn(styles.gradientTextPrimary, styles.heroHeading, headingClassName, animated && styles.animHide)}
        >
          {siteContent.hero.headlineLine1}
          <br />
          {siteContent.hero.headlineLine2}
        </p>

        <div className="max-w-[34ch]">
          <p
            ref={descriptionRef}
            className={cn(styles.gradientTextSecondary, 'mt-6 whitespace-pre-line pb-5 font-bebas text-[16px] leading-[1.5] tracking-heading', animated && styles.animHide)}
          >
            {siteContent.hero.subtitle}
          </p>
          <span
            ref={underlineRef}
            aria-hidden="true"
            className={cn(styles.separatorLine, underlineClassName, animated && styles.animScaleXZero)}
          />
        </div>
      </div>

      <div ref={ctaRef} className={cn('mt-8 flex flex-col gap-5', animated && styles.animHide)}>
        <div className="flex flex-wrap items-center gap-8">
          <a href="#contact" className={cn(styles.ctaButton, ctaBaseClassName)}>
            {siteContent.hero.ctaLabel}
          </a>
          <a href="#about" className={cn(styles.ctaButton, styles.ctaButtonSecondary, ctaBaseClassName)}>
            {siteContent.hero.aboutLabel}
          </a>
        </div>
        <div className="flex items-center gap-5">
          {socialLinks.map(({ platform, href }) => (
            <a
              key={platform}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={platform}
              className="text-white/40 transition-colors duration-300 hover:text-white"
            >
              {socialIcons[platform]}
            </a>
          ))}
        </div>
      </div>
    </>
  )
}
