import { useState, useRef, useEffect, type KeyboardEvent } from 'react'

interface DisclosureProps {
  title: string
  children: React.ReactNode
}

export default function Disclosure({ title, children }: DisclosureProps) {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const toggle = () => setIsOpen(prev => !prev)

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggle()
    }
  }

  useEffect(() => {
    if (isOpen && contentRef.current) {
      const focusableElements = contentRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      ;(focusableElements[0] as HTMLElement | undefined)?.focus()
    }
  }, [isOpen])

  return (
    <div className="border border-gray-200 rounded mb-4">
      <h3>
        <button
          ref={buttonRef}
          id={`disclosure-button-${title.replace(/\s+/g, '-').toLowerCase()}`}
          onClick={toggle}
          onKeyDown={handleKeyDown}
          aria-expanded={isOpen}
          aria-controls={`disclosure-content-${title.replace(/\s+/g, '-').toLowerCase()}`}
          className="w-full flex justify-between items-center p-4 text-left font-medium text-gray-900 hover:bg-gray-50 transition-colors"
        >
          <span>{title}</span>
          <span
            className="text-gray-500 transition-transform"
            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            ▼
          </span>
        </button>
      </h3>
      <div
        id={`disclosure-content-${title.replace(/\s+/g, '-').toLowerCase()}`}
        ref={contentRef}
        role="region"
        aria-labelledby={`disclosure-button-${title.replace(/\s+/g, '-').toLowerCase()}`}
        hidden={!isOpen}
        className="p-4 bg-gray-50"
      >
        {children}
      </div>
    </div>
  )
}