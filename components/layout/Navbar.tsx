'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { gsap } from 'gsap'

const NAV_ITEMS = [
  { label: 'STRONA GŁÓWNA', href: '/#hero' },
  { label: 'O MNIE', href: '/#about' },
  { label: 'REALIZACJE', href: '/#promo' },
  { label: 'OPINIE', href: '/#testimonials' },
  { label: 'OFERTA', href: '/#services' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'KONTAKT', href: '/contact' },
] as const

const navLinkClassName = [
  'relative font-bebas text-[16px] tracking-heading uppercase',
  'text-white/60 hover:text-white transition-colors duration-300',
  'after:absolute after:bottom-[-2px] after:left-0 after:h-px after:w-0 after:bg-khaki',
  'after:transition-[width] after:duration-300 hover:after:w-full',
].join(' ')

const mobileNavLinkClassName =
  'font-bebas text-[28px] tracking-heading uppercase py-2 text-white/70 hover:text-white transition-colors duration-200'

const HOME_PATH = '/'
const ACTIVE_SECTION_PROGRESS = 2 / 3

function getSectionHref(href: string) {
  const [, hash = ''] = href.split('#')
  return hash ? `#${hash}` : null
}

export default function Navbar() {
  const [scrolled, setScrolled]       = useState(false)
  const [mobileOpen, setMobileOpen]   = useState(false)
  const [activeHref, setActiveHref]   = useState('/#hero')
  const headerRef                      = useRef<HTMLElement>(null)
  const mobileMenuRef                  = useRef<HTMLDivElement>(null)
  const pathname                       = usePathname()

  /* Enable blurred background shortly after user starts scrolling */
  useEffect(() => {
    let rafId = 0

    const updateScrolled = () => {
      setScrolled(window.scrollY > 8)
    }

    const onScroll = () => {
      if (rafId) return
      rafId = window.requestAnimationFrame(() => {
        updateScrolled()
        rafId = 0
      })
    }

    updateScrolled()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafId) window.cancelAnimationFrame(rafId)
    }
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

  /* Highlight the current section in the homepage navigation */
  useEffect(() => {
    if (pathname !== HOME_PATH) {
      setActiveHref('')
      return
    }

    let rafId = 0

    const updateActiveSection = () => {
      const headerOffset = headerRef.current?.offsetHeight ?? 0
      const scrollAnchor = window.scrollY + headerOffset
      const sectionItems = NAV_ITEMS.flatMap((item) => {
        const sectionHref = getSectionHref(item.href)
        if (!sectionHref) return []

        const section = document.querySelector<HTMLElement>(sectionHref)
        if (!section) return []

        return [{
          href: item.href,
          top: section.offsetTop,
          height: section.offsetHeight,
        }]
      })

      let nextActiveHref = sectionItems[0]?.href ?? ''

      for (let index = 0; index < sectionItems.length; index += 1) {
        const currentItem = sectionItems[index]
        const nextItem = sectionItems[index + 1]

        if (!nextItem) {
          if (scrollAnchor >= currentItem.top) nextActiveHref = currentItem.href
          break
        }

        const activationPoint = currentItem.top + (currentItem.height * ACTIVE_SECTION_PROGRESS)
        if (scrollAnchor >= activationPoint) {
          nextActiveHref = nextItem.href
          continue
        }

        nextActiveHref = currentItem.href
        break
      }

      setActiveHref(nextActiveHref)
    }

    const onScroll = () => {
      if (rafId) return
      rafId = window.requestAnimationFrame(() => {
        updateActiveSection()
        rafId = 0
      })
    }

    updateActiveSection()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('hashchange', updateActiveSection)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('hashchange', updateActiveSection)
      if (rafId) window.cancelAnimationFrame(rafId)
    }
  }, [pathname])

  const getDesktopLinkClassName = (href: string) => (
    href === activeHref
      ? `${navLinkClassName} text-white after:w-full`
      : navLinkClassName
  )

  const getMobileLinkClassName = (href: string) => (
    href === activeHref
      ? `${mobileNavLinkClassName} text-white`
      : mobileNavLinkClassName
  )

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
        <Link href="/" aria-label="Strona główna" className="relative h-10 w-10 flex-shrink-0 md:h-12 md:w-12">
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
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-10" aria-label="Nawigacja główna">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={getDesktopLinkClassName(item.href)}
              aria-current={item.href === activeHref ? 'location' : undefined}
            >
              {item.label}
            </Link>
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
            <Link
              key={item.href}
              href={item.href}
              className={getMobileLinkClassName(item.href)}
              aria-current={item.href === activeHref ? 'location' : undefined}
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
