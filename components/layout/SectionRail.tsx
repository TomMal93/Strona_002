'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const SECTIONS = [
  { id: 'hero',         label: 'STRONA GŁÓWNA' },
  { id: 'about',        label: 'O MNIE' },
  { id: 'promo',        label: 'REALIZACJE' },
  { id: 'testimonials', label: 'OPINIE' },
  { id: 'process',      label: 'PROCES' },
  { id: 'faq',          label: 'FAQ' },
  { id: 'cta',          label: 'WSPÓŁPRACA' },
] as const

const HOME_PATH = '/'
const ACTIVE_SECTION_PROGRESS = 2 / 3

export default function SectionRail() {
  const pathname = usePathname()
  const [activeId, setActiveId] = useState<string>(SECTIONS[0].id)

  useEffect(() => {
    if (pathname !== HOME_PATH) return

    let rafId = 0

    const updateActiveSection = () => {
      const headerEl = document.querySelector<HTMLElement>('header')
      const headerOffset = headerEl?.offsetHeight ?? 0
      const scrollAnchor = window.scrollY + headerOffset

      const items = SECTIONS.flatMap((s) => {
        const el = document.getElementById(s.id)
        if (!el) return []
        return [{ id: s.id, top: el.offsetTop, height: el.offsetHeight }]
      })

      if (items.length === 0) return

      let nextId = items[0].id

      for (let i = 0; i < items.length; i += 1) {
        const current = items[i]
        const next = items[i + 1]

        if (!next) {
          if (scrollAnchor >= current.top) nextId = current.id
          break
        }

        const activationPoint = current.top + current.height * ACTIVE_SECTION_PROGRESS
        if (scrollAnchor >= activationPoint) {
          nextId = next.id
          continue
        }

        nextId = current.id
        break
      }

      setActiveId(nextId)
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
      className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
    >
      <ul role="list" className="flex flex-col gap-4">
        {SECTIONS.map((section) => {
          const isActive = section.id === activeId
          return (
            <li key={section.id} className="flex items-center justify-end gap-3">
              <Link
                href={`/#${section.id}`}
                aria-current={isActive ? 'true' : undefined}
                className={[
                  'group flex items-center gap-3 font-bebas text-[12px] tracking-heading uppercase',
                  'transition-colors duration-300',
                  'focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-khaki',
                  isActive ? 'text-khaki' : 'text-white/40 hover:text-white/80',
                ].join(' ')}
              >
                <span>{section.label}</span>
                <span
                  aria-hidden="true"
                  className={[
                    'block transition-all duration-300 motion-reduce:transition-none',
                    isActive
                      ? 'h-0.5 w-12 bg-khaki'
                      : 'h-px w-7 bg-white/40 group-hover:bg-white/80',
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
