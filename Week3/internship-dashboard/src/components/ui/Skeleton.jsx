import { cn } from '../../lib/utils'

/**
 * Skeleton loading placeholder.
 * Uses animate-pulse to create a shimmering effect while content loads.
 */
export default function Skeleton({ className }) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
    />
  )
}