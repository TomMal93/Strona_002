import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'outline' | 'hero'
type ButtonSize = 'md' | 'lg'

type CommonProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  children: React.ReactNode
}

type NativeButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: 'button'
  }

type AnchorButtonProps = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    as: 'a'
    href: string
  }

type ButtonProps = NativeButtonProps | AnchorButtonProps

const baseClassName = [
  'font-inter',
  'transition-colors duration-300',
  'focus-visible:outline focus-visible:outline-2',
  'focus-visible:outline-khaki focus-visible:outline-offset-2',
].join(' ')

const sizeClassName: Record<ButtonSize, string> = {
  md: 'px-6 py-3',
  lg: 'px-8 py-4',
}

const variantClassName: Record<ButtonVariant, string> = {
  primary: 'text-sm font-semibold uppercase tracking-widest bg-khaki text-black-deep hover:bg-military-green',
  outline: 'text-sm font-semibold uppercase tracking-widest border border-khaki text-khaki hover:bg-khaki hover:text-black-deep',
  hero: [
    'inline-flex items-center gap-3',
    'rounded-full border border-khaki/70 px-7 py-3.5',
    'text-[18px] font-medium text-white',
    'hover:bg-white/10',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
    'focus-visible:ring-offset-2 focus-visible:ring-offset-black',
  ].join(' '),
}

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      as = 'button',
      variant = 'primary',
      size = 'md',
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const mergedClassName = cn(
      baseClassName,
      sizeClassName[size],
      variantClassName[variant],
      className,
    )

    if (as === 'a') {
      const anchorProps = props as AnchorHTMLAttributes<HTMLAnchorElement>
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={mergedClassName}
          {...anchorProps}
        >
          {children}
        </a>
      )
    }

    const buttonProps = props as ButtonHTMLAttributes<HTMLButtonElement>
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={mergedClassName}
        {...buttonProps}
      >
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'

export default Button
