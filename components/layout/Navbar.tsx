'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'

const NAV_ITEMS = [
  { label: 'O MNIE', href: '#about' },
  { label: 'GALERIA', href: '#portfolio' },
  { label: 'KONTAKT', href: '#contact' },
] as const

export default function Navbar() {
  const [scrolled, setScrolled]       = useState(false)
  const [mobileOpen, setMobileOpen]   = useState(false)
  const headerRef                      = useRef<HTMLElement>(null)
  const mobileMenuRef                  = useRef<HTMLDivElement>(null)

  /* Darken background after crossing hero threshold */
  useEffect(() => {
    const sentinel = document.getElementById('nav-scroll-sentinel')
    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setScrolled(!entry.isIntersecting)
      },
      {
        root: null,
        threshold: 0,
        rootMargin: '-40px 0px 0px 0px',
      },
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  /* GSAP entrance — slides in from top */
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        y: -24,
        autoAlpha: 0,
        duration: 0.9,
        ease: 'power3.out',
        delay: 0.15,
      })
    })

    return () => ctx.revert()
  }, [])

  /* GSAP mobile menu open / close */
  useEffect(() => {
    const el = mobileMenuRef.current
    if (!el) return

    if (mobileOpen) {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: -10 },
        { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.out' },
      )
    } else {
      gsap.to(el, { autoAlpha: 0, y: -10, duration: 0.2, ease: 'power2.in' })
    }
  }, [mobileOpen])

  /* Close mobile menu on Escape */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className={`flex items-center justify-between px-6 py-2 md:px-12 lg:px-20 transition-[background-color,backdrop-filter] duration-500 ${
        scrolled || mobileOpen
          ? 'bg-[#0f0f12]/90 backdrop-blur-md'
          : 'bg-transparent'
      }`}>

        {/* Logo */}
        <a href="#hero" aria-label="Strona główna" className="relative h-10 w-10 flex-shrink-0 md:h-12 md:w-12">
          <Image
            src="/images/logo_m.webp"
            alt=""
            width={96}
            height={96}
            className="pointer-events-none absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 object-contain"
            sizes="(max-width: 767px) 40px, 48px"
            priority
            aria-hidden="true"
          />
        </a>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-10" aria-label="Nawigacja główna">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={[
                'relative font-bebas text-[16px] tracking-heading uppercase',
                'text-white/60 hover:text-white transition-colors duration-300',
                'after:absolute after:bottom-[-2px] after:left-0 after:h-px after:w-0 after:bg-khaki',
                'after:transition-[width] after:duration-300 hover:after:w-full',
              ].join(' ')}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col justify-center gap-[5px] p-1"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label={mobileOpen ? 'Zamknij menu' : 'Otwórz menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
        >
          <span
            className={`block h-px w-6 bg-white origin-center transition-transform duration-300 ${
              mobileOpen ? 'translate-y-[6px] rotate-45' : ''
            }`}
          />
          <span
            className={`block h-px w-6 bg-white transition-opacity duration-300 ${
              mobileOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block h-px w-6 bg-white origin-center transition-transform duration-300 ${
              mobileOpen ? '-translate-y-[6px] -rotate-45' : ''
            }`}
          />
        </button>
      </div>

      {/* Mobile dropdown menu */}
      <div
        ref={mobileMenuRef}
        id="mobile-menu"
        className="invisible md:hidden border-t border-white/10 bg-[#0f0f12]/90 backdrop-blur-md"
        aria-hidden={!mobileOpen}
      >
        <nav
          className="flex flex-col gap-1 px-6 py-6"
          aria-label="Nawigacja mobilna"
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-bebas text-[28px] tracking-heading uppercase py-2 text-white/70 hover:text-white transition-colors duration-200"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
