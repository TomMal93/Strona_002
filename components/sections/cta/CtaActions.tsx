'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import styles from '../Cta.module.css'

const PhoneIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={styles.btnIcon}
    aria-hidden="true"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

const ArrowRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn(styles.btnIcon, styles.btnIconArrow)}
    aria-hidden="true"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

export type SocialPlatform = 'youtube' | 'facebook' | 'instagram' | 'whatsapp' | 'messenger'

export const socialIcons: Record<SocialPlatform, React.ReactElement> = {
  youtube: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
    </svg>
  ),
  facebook: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  instagram: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  ),
  whatsapp: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.76.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.86 1.21 3.06c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.35.19 1.86.12.57-.08 1.75-.71 2-1.4.25-.69.25-1.28.17-1.4-.07-.12-.27-.2-.57-.35zM12 2a10 10 0 0 0-8.54 15.18L2 22l4.94-1.42A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-2.93.84.86-2.85-.2-.31A8.2 8.2 0 1 1 12 20.2z" />
    </svg>
  ),
  messenger: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.2 5.44 3.14 7.17.17.15.27.36.28.59l.05 1.77a.8.8 0 0 0 1.12.71l1.97-.87a.8.8 0 0 1 .53-.04c.9.25 1.86.38 2.91.38 5.64 0 10-4.13 10-9.7C22 6.13 17.64 2 12 2zm6 7.6-2.94 4.66a1.5 1.5 0 0 1-2.17.4L10.55 12.7a.6.6 0 0 0-.72 0l-3.17 2.4c-.42.32-.98-.18-.71-.63L8.9 9.81a1.5 1.5 0 0 1 2.17-.4l2.34 1.96a.6.6 0 0 0 .72 0l3.17-2.4c.42-.32.98.18.71.63z" />
    </svg>
  ),
}

export type CtaActionsData = {
  ctaLabel: string
  ctaHref: string
  phoneLabel: string
  phoneHref: string
  secondaryLabel: string
  secondaryHref: string
  social: ReadonlyArray<{ platform: SocialPlatform; href: string }>
}

type Props = {
  data: CtaActionsData
  primaryBtnRef?: React.RefObject<HTMLAnchorElement>
  secondaryRowRef?: React.RefObject<HTMLDivElement>
  socialRowRef?: React.RefObject<HTMLDivElement>
}

export default function CtaActions({
  data,
  primaryBtnRef,
  secondaryRowRef,
  socialRowRef,
}: Props) {
  const { ctaLabel, ctaHref, phoneLabel, phoneHref, secondaryLabel, secondaryHref, social } = data

  return (
    <div className={styles.ctaActions}>
      <div ref={secondaryRowRef} className={styles.secondaryRow}>
        <a href={ctaHref} className={styles.btnTertiary}>
          {ctaLabel}
          <ArrowRightIcon />
        </a>
        <span aria-hidden="true" className={styles.dotSeparator} />
        <a href={secondaryHref} className={styles.btnTertiary}>
          {secondaryLabel}
          <ArrowRightIcon />
        </a>
      </div>

      <a ref={primaryBtnRef} href={phoneHref} className={styles.btnPrimary}>
        <span aria-hidden="true" className={cn(styles.btnPulseRing, styles.btnPulseRing1)} />
        <span aria-hidden="true" className={cn(styles.btnPulseRing, styles.btnPulseRing2)} />
        <span className={styles.btnPrimaryInner}>
          <PhoneIcon />
          {phoneLabel}
        </span>
      </a>

      <div ref={socialRowRef} className={styles.socialRow}>
        {social.map(({ platform, href }) => (
          <a
            key={platform}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={platform}
            className={styles.socialLink}
          >
            {socialIcons[platform]}
          </a>
        ))}
      </div>
    </div>
  )
}
