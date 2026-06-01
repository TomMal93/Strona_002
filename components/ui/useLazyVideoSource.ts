'use client'

import { useEffect, useState, type RefObject } from 'react'

export function useLazyVideoSource<T extends Element>(
  targetRef: RefObject<T>,
  enabled = true,
  rootMargin = '400px',
): boolean {
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    if (!enabled || shouldLoad) return

    const target = targetRef.current
    if (!target) return

    if (!('IntersectionObserver' in window)) {
      setShouldLoad(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setShouldLoad(true)
        observer.disconnect()
      },
      { rootMargin },
    )

    observer.observe(target)

    return () => {
      observer.disconnect()
    }
  }, [enabled, rootMargin, shouldLoad, targetRef])

  return shouldLoad
}
