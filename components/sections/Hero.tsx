'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * SplitLetters — renderuje każdą literę tekstu w osobnym <span>,
 * co pozwala na GSAP stagger per litera (design.md §4: "Litery/słowa
 * wjeżdżają od dołu — GSAP stagger").
 */
function SplitLetters({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  return (
    <>
      {text.split('').map((char, i) => (
        <span
          key={i}
          className={`inline-block split-char${className ? ` ${className}` : ''}`}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </>
  )
}

/**
 * Hero — sekcja pełnoekranowa (FR-01 … FR-04, tech-spec.md).
 *
 * FR-01  tło wideo: autoplay / mute / loop + fallback statycznego obrazu
 *        + fade-in po załadowaniu (design.md §4)
 *        + parallax scroll (design.md §4: "Tło przesuwa się wolniej niż scroll")
 * FR-02  overlay z teksturą ziarna — animowany CSS (globals.css .grain-overlay)
 * FR-03  animowane hasło/podtytuł — GSAP stagger per litera (design.md §4)
 * FR-04  przycisk CTA → sekcja #contact, border-radius 2px (design.md §5)
 */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const heroVideoSrc = '/video/hero.mp4'
  const hasHeroVideo = false

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // GSAP context scoped to this component — safe cleanup on unmount
    const ctx = gsap.context(() => {
      const chars = headlineRef.current?.querySelectorAll('.split-char')

      if (prefersReducedMotion) {
        // Skip all animations — reveal elements immediately (WCAG 2.1 SC 2.3.3)
        gsap.set(chars ?? [], { autoAlpha: 1, y: 0 })
        gsap.set([subtitleRef.current, ctaRef.current], { autoAlpha: 1, y: 0 })
        gsap.set(scrollRef.current, { autoAlpha: 1 })
        gsap.set(mediaRef.current, { opacity: 0.6 })
        return
      }

      // Set initial hidden state (done here, not in CSS, so SSR HTML stays visible)
      gsap.set(chars ?? [], { autoAlpha: 0, y: 50 })
      gsap.set([subtitleRef.current, ctaRef.current], {
        autoAlpha: 0,
        y: 50,
      })
      gsap.set(scrollRef.current, { autoAlpha: 0 })

      // FR-01 — Video fade-in: start hidden, reveal with delay
      // (design.md §4: "Tło wideo pojawia się z opóźnieniem po załadowaniu")
      gsap.set(mediaRef.current, { opacity: 0 })

      // FR-03 — cinematic text reveal sequence
      const tl = gsap.timeline({ delay: 0.4 })

      // Video fade-in — runs first, overlaps with text reveal
      tl.to(mediaRef.current, {
        opacity: 0.6,
        duration: 1.5,
        ease: 'power2.out',
      })
        // Stagger per letter (design.md §4: "Litery/słowa wjeżdżają od dołu")
        .to(
          chars ?? [],
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.04,
            ease: 'power2.out',
          },
          '-=1.0',
        )
        .to(
          subtitleRef.current,
          { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power2.out' },
          '-=0.5',
        )
        .to(
          ctaRef.current,
          { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out' },
          '-=0.5',
        )
        .to(
          scrollRef.current,
          { autoAlpha: 1, duration: 0.6, ease: 'power2.out' },
          '-=0.3',
        )

      // Parallax (design.md §4: "Tło przesuwa się wolniej niż scroll — efekt głębi")
      gsap.fromTo(
        mediaRef.current,
        { yPercent: -5 },
        {
          yPercent: 15,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        },
      )
    })

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full h-screen overflow-hidden bg-black-deep"
    >
      {/* ── FR-01: Video background + fallback image ───────────────────── */}
      {/*
       * h-[120%] daje zapas na ruch parallax (yPercent -5 → 15).
       * Opacity sterowane przez GSAP (fade-in 0→0.6), nie przez CSS.
       */}
      <div
        ref={mediaRef}
        className="absolute inset-0 h-[120%] w-full will-change-transform"
        aria-hidden="true"
      >
        {hasHeroVideo ? (
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster="/video/hero-poster.jpg"
          >
            <source src={heroVideoSrc} type="video/mp4" />
          </video>
        ) : (
          <Image
            src="/video/hero-poster.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
      </div>

      {/* ── Gradient overlay (depth) ───────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-black-deep/50 via-transparent to-black-deep/85"
      />

      {/* ── FR-02: Grain texture overlay ──────────────────────────────── */}
      <div
        aria-hidden="true"
        className="grain-overlay absolute inset-0 z-10 pointer-events-none"
      />

      {/* ── FR-03 + FR-04: Content ─────────────────────────────────────── */}
      <div className="relative z-20 flex h-full flex-col justify-center max-w-[1280px] mx-auto px-6 lg:px-20">

        {/* Headline — Bebas Neue, 96–120 px (design.md §3) */}
        <h1
          ref={headlineRef}
          className="font-bebas uppercase leading-[0.9] tracking-wider
                     text-[80px] sm:text-[100px] lg:text-[120px]
                     text-warm-white"
        >
          <SplitLetters text="Zamrażam" />
          <br />
          <SplitLetters text="Chwile" className="text-khaki" />
        </h1>

        {/* Subtitle — Inter Light */}
        <p
          ref={subtitleRef}
          className="mt-6 max-w-lg font-inter font-light text-lg lg:text-xl text-warm-gray"
        >
          Fotografia i film — wydarzenia militarne, drony, ślub,
          off&#8209;road i sesje rodzinne.
        </p>

        {/* FR-04 — CTA button → #contact */}
        {/* design.md §5: "border-radius 2px, uppercase" */}
        <a
          ref={ctaRef}
          href="#contact"
          className="mt-10 self-start inline-block
                     font-inter font-semibold text-sm uppercase tracking-widest
                     px-8 py-4
                     bg-khaki text-warm-white
                     rounded-[2px]
                     transition-colors duration-300
                     hover:bg-military-green
                     focus-visible:outline focus-visible:outline-2
                     focus-visible:outline-khaki focus-visible:outline-offset-2"
        >
          Skontaktuj się
        </a>
      </div>

      {/* ── Scroll indicator ──────────────────────────────────────────── */}
      <div
        ref={scrollRef}
        aria-hidden="true"
        className="absolute bottom-10 left-1/2 z-20 -translate-x-1/2
                   flex flex-col items-center gap-2"
      >
        <span className="font-inter text-xs uppercase tracking-widest text-warm-gray">
          Przewiń
        </span>
        {/* Animated line */}
        <div className="w-px h-12 bg-gradient-to-b from-warm-gray to-transparent animate-pulse" />
      </div>
    </section>
  )
}
