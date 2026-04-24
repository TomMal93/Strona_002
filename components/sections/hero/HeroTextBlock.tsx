import { type JSX, type Ref } from 'react'
import { siteContent } from '@/lib/site-content'
import { cn } from '@/lib/utils'
import styles from '../Hero.module.css'
import { filterSupportedSocialLinks, type SocialPlatform } from './socialPlatforms'

const socialIcons: Record<SocialPlatform, JSX.Element> = {
  facebook: (
    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  instagram: (
    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  ),
  tiktok: (
    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9a8.19 8.19 0 0 0 4.78 1.52V7.07a4.85 4.85 0 0 1-1.01-.38z" />
    </svg>
  ),
  youtube: (
    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
    </svg>
  ),
  messenger: (
    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.2 5.44 3.14 7.17.17.15.27.36.28.59l.05 1.77a.8.8 0 0 0 1.12.71l1.97-.87a.8.8 0 0 1 .53-.04c.9.25 1.86.38 2.91.38 5.64 0 10-4.13 10-9.7C22 6.13 17.64 2 12 2zm6 7.6-2.94 4.66a1.5 1.5 0 0 1-2.17.4L10.55 12.7a.6.6 0 0 0-.72 0l-3.17 2.4c-.42.32-.98-.18-.71-.63L8.9 9.81a1.5 1.5 0 0 1 2.17-.4l2.34 1.96a.6.6 0 0 0 .72 0l3.17-2.4c.42-.32.98.18.71.63z" />
    </svg>
  ),
  whatsapp: (
    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.76.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.86 1.21 3.06c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.35.19 1.86.12.57-.08 1.75-.71 2-1.4.25-.69.25-1.28.17-1.4-.07-.12-.27-.2-.57-.35zM12 2a10 10 0 0 0-8.54 15.18L2 22l4.94-1.42A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-2.93.84.86-2.85-.2-.31A8.2 8.2 0 1 1 12 20.2z" />
    </svg>
  ),
}

export type HeroTextBlockProps = {
  headingClassName: string
  underlineClassName: string
  eyebrowClassName?: string
  subtitleClassName?: string
  ctaClassName?: string
  subtitleWrapClassName?: string
  socialIconClassName?: string
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
  eyebrowClassName = 'block font-bebas text-[21px] uppercase tracking-heading',
  subtitleClassName = 'mt-6 whitespace-pre-line pb-5 font-bebas text-[19px] leading-[1.5] tracking-heading',
  ctaClassName = 'px-4 py-2 text-center font-bebas text-[23px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-khaki focus-visible:outline-offset-2',
  subtitleWrapClassName = 'max-w-[34ch]',
  socialIconClassName = '[&>svg]:h-[21px] [&>svg]:w-[21px]',
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
          className={cn(styles.gradientTextSecondary, eyebrowClassName, animated && styles.animHide)}
        >
          {siteContent.hero.eyebrow}
        </span>

        <p
          ref={headingRef}
          aria-hidden="true"
          className={cn(styles.gradientTextPrimary, styles.heroHeading, headingClassName, animated && styles.animHide)}
        >
          <span className="whitespace-nowrap">{siteContent.hero.headlineLine1}</span>
          <br />
          <span className="whitespace-nowrap">{siteContent.hero.headlineLine2}</span>
        </p>

        <div className={subtitleWrapClassName}>
          <p
            ref={descriptionRef}
            className={cn(styles.gradientTextSecondary, subtitleClassName, animated && styles.animHide)}
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
          <a href={siteContent.hero.ctaHref} className={cn(styles.ctaButton, ctaClassName)}>
            {siteContent.hero.ctaLabel}
          </a>
          <a href="#about" className={cn(styles.ctaButton, styles.ctaButtonSecondary, ctaClassName)}>
            {siteContent.hero.aboutLabel}
          </a>
        </div>
        <div className="flex items-center gap-7 md:gap-5">
          {socialLinks.map(({ platform, href }) => (
            <a
              key={platform}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={platform}
              className={cn('text-[rgb(255_238_175/0.55)] transition-colors duration-300 hover:text-[rgb(255_238_175/0.95)]', socialIconClassName)}
            >
              {socialIcons[platform]}
            </a>
          ))}
        </div>
      </div>
    </>
  )
}
