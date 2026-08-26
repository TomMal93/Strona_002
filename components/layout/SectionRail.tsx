'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const SECTIONS = [
  { id: 'hero',         label: 'STRONA GŁÓWNA' },
  { id: 'about',        label: 'O MNIE' },
  { id: 'promo',        label: 'REALIZACJE' },
  { id: 'services',     label: 'OFERTA' },
  { id: 'process',      label: 'PROCES' },
  { id: 'testimonials', label: 'OPINIE' },
  { id: 'faq',          label: 'FAQ' },
  { id: 'cta',          label: 'WSPÓŁPRACA' },
] as const

const HOME_PATH = '/'
const ACTIVE_SECTION_PROGRESS = 2 / 3

export default function SectionRail() {
  const pathname = usePathname()
  const [activeId, setActiveId] = useState<string>(SECTIONS[0].id)
  const [isRevealed, setIsRevealed] = useState(false)

  useEffect(() => {
    if (pathname !== HOME_PATH) return

    let rafId = 0

    const updateActiveSection = () => {
      const items = SECTIONS.flatMap((s) => {
        const el = document.getElementById(s.id)
        if (!el) return []
        return [{ id: s.id, rect: el.getBoundingClientRect() }]
      })

      if (items.length === 0) return

      const activationLine = window.innerHeight * ACTIVE_SECTION_PROGRESS
      let nextId = items[0].id
      for (const item of items) {
        if (item.rect.top <= activationLine) nextId = item.id
      }

      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
      setActiveId(atBottom ? items[items.length - 1].id : nextId)
      setIsRevealed(window.scrollY > window.innerHeight * 0.2)
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
    window.addEventListener('resize', updateActiveSection)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('hashchange', updateActiveSection)
      window.removeEventListener('resize', updateActiveSection)
      if (rafId) window.cancelAnimationFrame(rafId)
    }
  }, [pathname])

  if (pathname !== HOME_PATH) return null

  return (
    <nav
      aria-label="Nawigacja sekcji"
      aria-hidden={!isRevealed}
      className={[
        'fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 lg:block',
        'transition-opacity duration-500 motion-reduce:transition-none',
        isRevealed ? 'opacity-100' : 'pointer-events-none opacity-0',
      ].join(' ')}
    >
      <ul className="flex flex-col gap-7">
        {SECTIONS.map((section) => {
          const isActive = section.id === activeId
          return (
            <li key={section.id} className="flex items-center justify-end gap-3">
              <Link
                href={`/#${section.id}`}
                aria-current={isActive ? 'true' : undefined}
                onClick={(event) => event.currentTarget.blur()}
                className={[
                  'group flex items-center gap-3 font-bebas text-[15px] tracking-heading uppercase min-[1900px]:text-[18px]',
                  'transition-all duration-300',
                  'focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-khaki',
                  isActive
                    ? 'text-khaki opacity-100'
                    : 'text-white opacity-40 hover:opacity-100',
                ].join(' ')}
              >
                <span>{section.label}</span>
                <span
                  aria-hidden="true"
                  className={[
                    'block transition-all duration-300 motion-reduce:transition-none',
                    isActive
                      ? 'h-0.5 w-16 bg-khaki'
                      : 'h-px w-7 bg-white',
                  ].join(' ')}
                />
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
