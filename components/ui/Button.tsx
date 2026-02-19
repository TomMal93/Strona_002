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
  'font-inter text-sm font-semibold uppercase tracking-widest',
  'transition-colors duration-300',
  'focus-visible:outline focus-visible:outline-2',
  'focus-visible:outline-khaki focus-visible:outline-offset-2',
].join(' ')

const sizeClassName: Record<ButtonSize, string> = {
  md: 'px-6 py-3',
  lg: 'px-8 py-4',
}

const variantClassName: Record<ButtonVariant, string> = {
  primary: 'bg-khaki text-black-deep hover:bg-military-green',
  outline: 'border border-khaki text-khaki hover:bg-khaki hover:text-black-deep',
  hero: 'rounded-micro bg-khaki text-warm-white hover:bg-military-green',
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
