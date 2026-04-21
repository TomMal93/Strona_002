'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import styles from '../Cta.module.css'

type Props = {
  children: React.ReactNode
  glow?: boolean
  glowRef?: React.RefObject<HTMLDivElement>
  cornerTLRef?: React.RefObject<HTMLSpanElement>
  cornerTRRef?: React.RefObject<HTMLSpanElement>
  cornerBLRef?: React.RefObject<HTMLSpanElement>
  cornerBRRef?: React.RefObject<HTMLSpanElement>
  crosshairTopRef?: React.RefObject<HTMLSpanElement>
  crosshairBottomRef?: React.RefObject<HTMLSpanElement>
}

export default function CtaShell({
  children,
  glow = true,
  glowRef,
  cornerTLRef,
  cornerTRRef,
  cornerBLRef,
  cornerBRRef,
  crosshairTopRef,
  crosshairBottomRef,
}: Props) {
  return (
    <div className={styles.ctaShell}>
      {glow ? (
        <div ref={glowRef} aria-hidden="true" className={styles.ctaGlow}>
          <div className={styles.glowOrb} />
          <div className={styles.glowOrbWarm} />
        </div>
      ) : null}
      <div aria-hidden="true" className={styles.ctaVignette} />

      <span ref={cornerTLRef} aria-hidden="true" className={cn(styles.cornerMark, styles.cornerTL)} />
      <span ref={cornerTRRef} aria-hidden="true" className={cn(styles.cornerMark, styles.cornerTR)} />
      <span ref={cornerBLRef} aria-hidden="true" className={cn(styles.cornerMark, styles.cornerBL)} />
      <span ref={cornerBRRef} aria-hidden="true" className={cn(styles.cornerMark, styles.cornerBR)} />

      <span ref={crosshairTopRef} aria-hidden="true" className={cn(styles.crosshair, styles.crosshairTop)} />
      <span ref={crosshairBottomRef} aria-hidden="true" className={cn(styles.crosshair, styles.crosshairBottom)} />

      <div aria-hidden="true" className={styles.focusCircle} />

      <div className={styles.ctaContent}>{children}</div>
    </div>
  )
}
