import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines class names with clsx and resolves Tailwind conflicts.
 * 
 * @example
 * cn('px-2 py-1', 'px-4') 
 * // → 'py-1 px-4' (px-4 wins the conflict)
 * 
 * @example
 * cn('bg-primary-500', isActive && 'bg-primary-600')
 * // → conditional classes handled cleanly
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}