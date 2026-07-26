import { useState, useRef, useEffect, type KeyboardEvent } from 'react'

interface Tab {
  id: string
  label: string
  content: React.ReactNode
}

interface TabsProps {
  tabs: Tab[]
}

export default function Tabs({ tabs }: TabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id ?? '')
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const tabPanelRef = useRef<HTMLDivElement>(null)

  const handleKeyDown = (e: KeyboardEvent, index: number) => {
    let newIndex: number

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault()
        newIndex = index === 0 ? tabs.length - 1 : index - 1
        tabRefs.current[newIndex]?.focus()
        setActiveTab(tabs[newIndex].id)
        break
      case 'ArrowRight':
        e.preventDefault()
        newIndex = index === tabs.length - 1 ? 0 : index + 1
        tabRefs.current[newIndex]?.focus()
        setActiveTab(tabs[newIndex].id)
        break
      case 'Home':
        e.preventDefault()
        tabRefs.current[0]?.focus()
        setActiveTab(tabs[0].id)
        break
      case 'End':
        e.preventDefault()
        tabRefs.current[tabs.length - 1]?.focus()
        setActiveTab(tabs[tabs.length - 1].id)
        break
      default:
        break
    }
  }

  useEffect(() => {
    tabPanelRef.current?.focus()
  }, [activeTab])

  return (
    <div className="w-full">
      <div
        role="tablist"
        aria-label="Sample Tabs"
        className="flex border-b border-gray-200"
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={el => { tabRefs.current[index] = el }}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            onClick={() => setActiveTab(tab.id)}
            onKeyDown={e => handleKeyDown(e, index)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map(tab => (
        <div
          key={tab.id}
          ref={activeTab === tab.id ? tabPanelRef : undefined}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={activeTab !== tab.id}
          tabIndex={0}
          className="p-4 bg-white border border-t-0 border-gray-200 rounded-b"
        >
          {tab.content}
        </div>
      ))}
    </div>
  )
}