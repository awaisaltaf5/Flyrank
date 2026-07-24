import { cn } from '../../lib/utils'

const variants = {
  default: 'bg-muted text-muted-foreground',
  primary: 'bg-primary-50 text-primary-700',
  success: 'bg-success-muted text-success',
  warning: 'bg-warning-muted text-warning',
  error: 'bg-error-muted text-error',
}

export default function Badge({ children, variant = 'default', className }) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  )
}