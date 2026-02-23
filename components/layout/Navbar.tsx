'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

const NAV_ITEMS = [
  { label: 'O MNIE', href: '#about' },
  { label: 'GALERIA', href: '#portfolio' },
  { label: 'KONTAKT', href: '#contact' },
] as const

function LogoMark() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer triangle — outline */}
      <polygon
        points="20,3 37,34 3,34"
        fill="none"
        stroke="#ff3b3b"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Inner triangle — filled */}
      <polygon
        points="20,14 30,32 10,32"
        fill="#ff3b3b"
      />
    </svg>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled]       = useState(false)
  const [mobileOpen, setMobileOpen]   = useState(false)
  const headerRef                      = useRef<HTMLElement>(null)
  const mobileMenuRef                  = useRef<HTMLDivElement>(null)

  /* Darken background after scrolling past the fold */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
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
      <div className={`flex items-center justify-between px-6 py-5 md:px-12 lg:px-20 transition-all duration-500 ${
        scrolled || mobileOpen
          ? 'bg-[#0f0f12]/90 backdrop-blur-md'
          : 'bg-transparent'
      }`}>

        {/* Logo */}
        <a href="#hero" aria-label="Strona główna" className="flex-shrink-0">
          <LogoMark />
        </a>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-10" aria-label="Nawigacja główna">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={[
                'relative font-bebas text-[16px] tracking-[0.15em] uppercase',
                'text-white/60 hover:text-white transition-colors duration-300',
                'after:absolute after:bottom-[-2px] after:left-0 after:h-px after:w-0 after:bg-[#ff3b3b]',
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
              className="font-bebas text-[28px] tracking-[0.15em] uppercase py-2 text-white/70 hover:text-white transition-colors duration-200"
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
