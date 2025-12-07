import { Link } from '@tanstack/react-router'
import { forwardRef } from 'react'

interface BaseButtonProps {
  children: React.ReactNode
  variant?:
    | 'primary'
    | 'secondary'
    | 'black'
    | 'outline'
    | 'ghost'
    | 'text'
    | 'navbar'
    | 'dark'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  className?: string
}

interface ButtonProps extends BaseButtonProps {
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

interface LinkButtonProps extends BaseButtonProps {
  to: string
  external?: boolean
}

type ButtonComponentProps = ButtonProps | LinkButtonProps

const buttonVariants = {
  primary: 'bg-primary-500 hover:bg-primary-600 text-white',
  secondary: 'bg-accent-500 hover:bg-accent-600 text-white',
  black: 'bg-black hover:bg-gray-800 text-white',
  outline: 'border-2 border-white text-white hover:bg-white hover:text-black',
  dark: 'border-2 border-black text-black hover:bg-black hover:text-white',
  ghost: 'text-primary-500 hover:bg-primary-50',
  text: 'text-white hover:text-gray-300 underline text-button',
  navbar: 'bg-white hover:bg-gray-100 text-black',
}

const buttonSizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
}

const textButtonSizes = {
  sm: 'px-1 py-1 text-sm',
  md: 'px-2 py-1 text-base',
  lg: 'px-2 py-1 text-lg',
}

const getButtonClasses = (
  variant: string,
  size: string,
  disabled: boolean,
  className: string,
) => {
  const isTextVariant = variant === 'text'
  const sizeClasses = isTextVariant
    ? textButtonSizes[size as keyof typeof textButtonSizes]
    : buttonSizes[size as keyof typeof buttonSizes]
  const borderRadius = isTextVariant ? '' : 'rounded-full'

  const baseClasses = `inline-flex items-center justify-center ${borderRadius} font-medium transition-colors gap-2 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 ${sizeClasses} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${buttonVariants[variant as keyof typeof buttonVariants]}`

  // Split custom classes and apply them with higher specificity
  const customClasses = className.split(' ').filter((cls) => cls.trim())
  const mergedClasses = baseClasses.split(' ').filter((baseCls) => {
    // Remove base class if custom class overrides it
    return !customClasses.some(
      (customCls) =>
        (baseCls.startsWith('w-') && customCls.startsWith('w-')) ||
        (baseCls.startsWith('h-') && customCls.startsWith('h-')) ||
        (baseCls.startsWith('px-') && customCls.startsWith('px-')) ||
        (baseCls.startsWith('py-') && customCls.startsWith('py-')) ||
        (baseCls === 'px-6' && customCls.startsWith('p-')) ||
        (baseCls === 'py-3' && customCls.startsWith('p-')) ||
        (baseCls.startsWith('rounded') && customCls.startsWith('rounded')) ||
        (baseCls.startsWith('bg-') && customCls.startsWith('bg-')) ||
        (baseCls.startsWith('text-') && customCls.startsWith('text-')),
    )
  })

  return [...mergedClasses, ...customClasses].join(' ')
}

export const Button = forwardRef<HTMLButtonElement, ButtonComponentProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      disabled = false,
      className = '',
      ...props
    },
    ref,
  ) => {
    const classes = getButtonClasses(variant, size, disabled, className)

    if ('to' in props) {
      const { to, external } = props

      if (external) {
        return (
          <a
            href={to}
            target="_blank"
            rel="noopener noreferrer"
            className={classes}
          >
            {children}
          </a>
        )
      }

      return (
        <Link to={to} className={classes}>
          {children}
        </Link>
      )
    }

    const { onClick, type = 'button' } = props

    return (
      <button
        ref={ref}
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={classes}
      >
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'