import type { ServiceIconName } from '@/lib/site-content'
import { cn } from '@/lib/utils'

const iconClassName = 'h-5 w-5 text-khaki'

export function ServiceIcon({ icon, className }: { icon: ServiceIconName; className?: string }) {
  switch (icon) {
    case 'crosshair':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={cn(iconClassName, className)}>
          <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1.8" />
          <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      )
    case 'heart':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={cn(iconClassName, className)}>
          <path
            d="M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.4-7 10-7 10Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
        </svg>
      )
    case 'drone':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={cn(iconClassName, className)}>
          <circle cx="6" cy="6" r="3" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="18" cy="6" r="3" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="18" cy="18" r="3" stroke="currentColor" strokeWidth="1.8" />
          <path d="M9 9l6 6M15 9l-6 6" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      )
    case 'wheel':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={cn(iconClassName, className)}>
          <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
          <path d="M12 4v5M20 12h-5M12 20v-5M4 12h5" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      )
    case 'flag':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={cn(iconClassName, className)}>
          <path d="M6 3v18M6 4h10l-2 4 2 4H6" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      )
  }
}
