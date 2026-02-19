'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

/**
 * Hero — sekcja pełnoekranowa (FR-01 … FR-04, tech-spec.md).
 *
 * FR-01  tło wideo: autoplay / mute / loop (element <video> z placeholderem)
 * FR-02  overlay z teksturą ziarna — animowany CSS (globals.css .grain-overlay)
 * FR-03  animowane hasło/podtytuł — GSAP timeline z text reveal
 * FR-04  przycisk CTA → sekcja #contact
 */
export default function Hero() {
  const headlineRef      = useRef<HTMLHeadingElement>(null)
  const subtitleRef      = useRef<HTMLParagraphElement>(null)
  const ctaRef           = useRef<HTMLAnchorElement>(null)
  const scrollRef        = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // GSAP context scoped to this component — safe cleanup on unmount
    const ctx = gsap.context(() => {
      // Set initial hidden state (done here, not in CSS, so SSR HTML stays visible)
      gsap.set([headlineRef.current, subtitleRef.current, ctaRef.current], {
        autoAlpha: 0,
        y: 50,
      })
      gsap.set(scrollRef.current, { autoAlpha: 0 })

      // FR-03 — cinematic text reveal sequence
      const tl = gsap.timeline({ delay: 0.4 })

      tl.to(headlineRef.current, {
        autoAlpha: 1,
        y: 0,
        duration: 1.2,
        ease: 'power2.out',
      })
        .to(
          subtitleRef.current,
          { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power2.out' },
          '-=0.7',
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
    })

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="hero"
      className="relative w-full h-screen overflow-hidden bg-black-deep"
    >
      {/* ── FR-01: Video background ────────────────────────────────────── */}
      {/*
       * UWAGA: brak pliku wideo — element <video> jest przygotowany
       * strukturalnie. Dodaj plik /public/video/hero.mp4 (<10 MB, H.264)
       * i odkomentuj <source>. Poster zastępuje obraz do czasu załadowania.
       */}
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-60"
        autoPlay
        muted
        loop
        playsInline
        poster="/video/hero-poster.jpg"
        aria-hidden="true"
      >
        {/* <source src="/video/hero.mp4" type="video/mp4" /> */}
      </video>

      {/* ── Gradient overlay (depth) ───────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-black-deep/50 via-transparent to-black-deep/85"
      />

      {/* ── FR-02: Grain texture overlay ──────────────────────────────── */}
      {/*
       * UWAGA: tekstura ziarna zaimplementowana jako animowany CSS pseudo-
       * element (globals.css .grain-overlay). Alternatywą jest Canvas lub
       * dedykowany plik PNG/GIF, który dałby większą kontrolę nad efektem
       * kosztem dodatkowego zasobu.
       */}
      <div
        aria-hidden="true"
        className="grain-overlay absolute inset-0 z-10 pointer-events-none"
      />

      {/* ── FR-03 + FR-04: Content ─────────────────────────────────────── */}
      <div className="relative z-20 flex h-full flex-col justify-center max-w-[1280px] mx-auto px-6 lg:px-20">

        {/* Headline — Bebas Neue, 96–120 px (design.md) */}
        <h1
          ref={headlineRef}
          className="font-bebas uppercase leading-[0.9] tracking-wider
                     text-[80px] sm:text-[100px] lg:text-[120px]
                     text-warm-white"
        >
          {/*
           * UWAGA: tekst zastępczy — należy uzupełnić faktycznym hasłem
           * dostarczonym przez klienta.
           */}
          Zamrażam
          <br />
          <span className="text-khaki">Chwile</span>
        </h1>

        {/* Subtitle — Inter Light */}
        <p
          ref={subtitleRef}
          className="mt-6 max-w-lg font-inter font-light text-lg lg:text-xl text-warm-gray"
        >
          {/*
           * UWAGA: tekst zastępczy — należy uzupełnić finalnym opisem
           * od klienta.
           */}
          Fotografia i film — wydarzenia militarne, drony, ślub,
          off&#8209;road i sesje rodzinne.
        </p>

        {/* FR-04 — CTA button → #contact */}
        <a
          ref={ctaRef}
          href="#contact"
          className="mt-10 self-start inline-block
                     font-inter font-semibold text-sm uppercase tracking-widest
                     px-8 py-4
                     bg-khaki text-warm-white
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
