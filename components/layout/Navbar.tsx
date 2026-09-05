'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils'
import styles from './Navbar.module.css'

const NAV_ITEMS = [
  { label: 'STRONA GŁÓWNA', href: '/#hero' },
  { label: 'O MNIE', href: '/#about' },
  { label: 'REALIZACJE', href: '/#promo' },
  { label: 'OFERTA', href: '/oferta' },
  { label: 'PROCES', href: '/#process' },
  { label: 'OPINIE', href: '/#testimonials' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'WSPÓŁPRACA', href: '/#cta' },
  { label: 'O MNIE', href: '/o-mnie' },
  { label: 'KONTAKT', href: '/contact' },
] as const

const DESKTOP_NAV_ITEMS = NAV_ITEMS.filter((item) => (
  item.href === '/#hero'
  || item.href === '/oferta'
  || item.href === '/o-mnie'
  || item.href === '/contact'
))

const navLinkClassName = [
  'relative inline-flex min-h-11 items-center font-bebas text-[16px] tracking-heading uppercase min-[1800px]:text-[20px]',
  'text-white/60 hover:text-white transition-colors duration-300',
  'after:absolute after:bottom-[-2px] after:left-0 after:h-px after:w-0 after:bg-khaki',
  'after:transition-[width] after:duration-300 hover:after:w-full',
].join(' ')

const mobileNavLinkClassName = [
  styles.mobileNavLink,
  'flex min-h-16 w-full items-center gap-4 py-3',
  'font-bebas uppercase text-warm-white transition-colors duration-300',
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-khaki',
].join(' ')

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
  const mobileToggleRef                = useRef<HTMLButtonElement>(null)
  const firstMobileLinkRef             = useRef<HTMLAnchorElement>(null)
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
    window.addEventListener('resize', updateScrolled)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', updateScrolled)
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

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const menuItems = el.querySelectorAll('[data-mobile-menu-item]')

    if (prefersReducedMotion) {
      gsap.set(el, {
        autoAlpha: mobileOpen ? 1 : 0,
        y: 0,
      })
      gsap.set(menuItems, {
        autoAlpha: mobileOpen ? 1 : 0,
        y: 0,
      })
      if (!mobileOpen) return

      // Move focus after the button's native click focus has settled.
      const focusTimer = window.setTimeout(() => {
        firstMobileLinkRef.current?.focus({ preventScroll: true })
      }, 0)
      return () => window.clearTimeout(focusTimer)
    }

    const ctx = gsap.context(() => {
      if (mobileOpen) {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: -8 },
          {
            autoAlpha: 1,
            y: 0,
            duration: prefersReducedMotion ? 0 : 0.35,
            ease: 'power3.out',
          },
        )
        gsap.fromTo(
          menuItems,
          { autoAlpha: 0, y: 16 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.055,
            delay: 0.08,
            ease: 'power3.out',
          },
        )
        window.requestAnimationFrame(() => firstMobileLinkRef.current?.focus())
      } else {
        gsap.to(el, {
          autoAlpha: 0,
          y: -8,
          duration: 0.2,
          ease: 'power2.in',
        })
      }
    }, el)

    return () => ctx.revert()
  }, [mobileOpen])

  /* Keep the page behind the full-screen menu still and close it on desktop. */
  useEffect(() => {
    if (!mobileOpen) return

    const previousOverflow = document.body.style.overflow
    const desktopQuery = window.matchMedia('(min-width: 768px)')
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setMobileOpen(false)
    }

    document.body.style.overflow = 'hidden'
    desktopQuery.addEventListener('change', closeOnDesktop)

    return () => {
      document.body.style.overflow = previousOverflow
      desktopQuery.removeEventListener('change', closeOnDesktop)
    }
  }, [mobileOpen])

  /* Close mobile menu on Escape */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!mobileOpen) return

      if (e.key === 'Escape') {
        setMobileOpen(false)
        mobileToggleRef.current?.focus()
        return
      }

      if (e.key !== 'Tab') return

      const menu = mobileMenuRef.current
      if (!menu) return

      const focusable = Array.from(menu.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )).filter((element) => !element.hasAttribute('disabled'))

      if (focusable.length === 0) {
        e.preventDefault()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement

      if (e.shiftKey && (active === first || !menu.contains(active))) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [mobileOpen])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  /* Highlight the current section in the homepage navigation */
  useEffect(() => {
    if (pathname !== HOME_PATH) {
      setActiveHref(pathname)
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

  const getMobileLinkClassName = (href: string) => cn(
    mobileNavLinkClassName,
    href === activeHref
      ? styles.mobileNavLinkActive
      : 'text-warm-gray hover:text-warm-white',
  )
  const hasSolidHeader = pathname === '/o-mnie' || pathname === '/contact'
  const headerSurfaceClassName = hasSolidHeader
    ? (scrolled || mobileOpen
        ? 'bg-[#0f0f12]/68 backdrop-blur-md'
        : 'bg-[#0f0f12]')
    : (scrolled || mobileOpen
        ? 'bg-[#0f0f12]/50 md:bg-[#0f0f12]/90 backdrop-blur-md'
        : 'bg-transparent')

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className={`flex h-[60px] items-center justify-between px-5 py-0 md:h-auto md:min-h-0 md:px-12 md:py-2 lg:px-20 min-[1800px]:px-24 min-[1800px]:py-3 transition-[background-color,backdrop-filter] duration-500 ${headerSurfaceClassName}`}>

        {/* Logo */}
        <Link
          href="/"
          aria-label="Strona główna"
          className="relative inline-flex min-h-11 shrink-0 items-center font-bebas text-[1.006rem] uppercase tracking-heading text-warm-white transition-colors duration-500 ease-out hover:text-khaki focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-khaki min-[1800px]:text-[1.3rem]"
        >
          MALESZYK
          <span className="text-[#c8503c]">.</span>
          <span className="bg-[linear-gradient(130deg,rgb(var(--c-warm))_0%,rgb(255_238_175)_45%,rgb(var(--c-gold))_100%)] bg-clip-text text-transparent">
            MEDIA
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-6 md:flex lg:gap-10 min-[1800px]:gap-14" aria-label="Nawigacja główna">
          {DESKTOP_NAV_ITEMS.map((item) => (
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
          ref={mobileToggleRef}
          className={cn(
            'flex h-11 w-11 flex-col items-center justify-center gap-[5px] border md:hidden',
            'transition-[border-color,background-color] duration-300',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-khaki',
            mobileOpen
              ? 'border-khaki/55 bg-khaki/10'
              : 'border-white/15 bg-black-deep/20 hover:border-khaki/45',
          )}
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label={mobileOpen ? 'Zamknij menu' : 'Otwórz menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
        >
          <span
            className={`block h-px w-5 bg-warm-white origin-center transition-transform duration-300 ${
              mobileOpen ? 'translate-y-[6px] rotate-45' : ''
            }`}
          />
          <span
            className={`block h-px w-5 bg-warm-white transition-opacity duration-300 ${
              mobileOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block h-px w-5 bg-warm-white origin-center transition-transform duration-300 ${
              mobileOpen ? 'translate-y-[-6px] -rotate-45' : ''
            }`}
          />
        </button>
      </div>

      {/* Mobile dropdown menu */}
      <div
        ref={mobileMenuRef}
        id="mobile-menu"
        className={cn(
          styles.mobileMenu,
          'invisible pointer-events-none absolute left-0 right-0 top-full border-t border-khaki/25 md:hidden',
          mobileOpen && 'pointer-events-auto',
        )}
        aria-hidden={!mobileOpen}
        role="dialog"
        aria-modal={mobileOpen ? 'true' : undefined}
        aria-label="Menu mobilne"
      >
        <nav
          className="mx-auto flex h-full w-full max-w-content flex-col px-6 pb-6 pt-8"
          aria-label="Nawigacja mobilna"
        >
          <div data-mobile-menu-item className="mb-5 flex items-center justify-between gap-4">
            <p className="font-inter text-[10px] uppercase tracking-overline text-khaki">
              Nawigacja
            </p>
            <span
              aria-hidden="true"
              className="h-px flex-1 bg-gradient-to-r from-khaki/45 to-transparent"
            />
          </div>

          <div className="flex flex-1 flex-col justify-start pt-8">
            {DESKTOP_NAV_ITEMS.map((item, index) => (
              <Link
                key={item.href}
                ref={index === 0 ? firstMobileLinkRef : undefined}
                href={item.href}
                className={getMobileLinkClassName(item.href)}
                aria-current={item.href === activeHref ? 'location' : undefined}
                data-mobile-menu-item
                onClick={() => setMobileOpen(false)}
              >
                <span className="w-6 shrink-0 font-inter text-[10px] tracking-overline text-khaki/70">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className={cn(
                  'text-[clamp(2rem,10vw,3.25rem)] leading-none tracking-heading',
                  item.href === activeHref && [
                    'bg-[linear-gradient(130deg,rgb(var(--c-warm))_0%,rgb(255_238_175)_45%,rgb(var(--c-gold))_100%)]',
                    'bg-clip-text text-transparent',
                  ],
                )}>
                  {item.label}
                </span>
              </Link>
            ))}
          </div>

          <div data-mobile-menu-item className="mt-5 border-l border-khaki/55 pl-4">
            <p className="font-bebas text-lg uppercase tracking-heading text-warm-white">
              Kadry z charakterem.
            </p>
            <p className="font-inter text-[11px] text-warm-gray/65">
              Historie z emocją.
            </p>
          </div>
        </nav>
      </div>
    </header>
  )
}
