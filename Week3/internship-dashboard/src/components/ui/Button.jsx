import { cn } from '../../lib/utils'

/**
 * Button variants and sizes are defined as objects.
 * This pattern makes it easy to add new variants without rewriting JSX.
 */
const variants = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
  secondary: 'bg-muted text-foreground hover:bg-accent focus:ring-muted-foreground',
  outline: 'border border-border bg-background hover:bg-accent focus:ring-primary-500',
  ghost: 'hover:bg-accent hover:text-foreground focus:ring-primary-500',
  danger: 'bg-error text-white hover:bg-error/90 focus:ring-error',
}

const sizes = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 py-2 text-sm',
  lg: 'h-12 px-6 text-base',
}

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  disabled,
  ...props 
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}