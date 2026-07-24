import { cn } from '../../lib/utils'

export default function Card({ children, className }) {
  return (
    <div className={cn('rounded-xl border border-border bg-background shadow-card', className)}>
      {children}
    </div>
  )
}

function CardHeader({ children, className }) {
  return (
    <div className={cn('flex items-center justify-between border-b border-border px-6 py-4', className)}>
      {children}
    </div>
  )
}

function CardContent({ children, className }) {
  return <div className={cn('px-6 py-4', className)}>{children}</div>
}

function CardFooter({ children, className }) {
  return (
    <div className={cn('flex items-center border-t border-border px-6 py-4', className)}>
      {children}
    </div>
  )
}

Card.Header = CardHeader
Card.Content = CardContent
Card.Footer = CardFooter