import { useState } from 'react'
import Modal from '../playground/Modal'
import CustomTabs from '../playground/Tabs'
import Disclosure from '../playground/Disclosure'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs'

export default function Playground() {
  const [count, setCount] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const tabData = [
    {
      id: 'tab1',
      label: 'First Tab',
      content: (
        <p className="text-gray-700">
          This is the content of the first tab. You can put any React components
          here.
        </p>
      ),
    },
    {
      id: 'tab2',
      label: 'Second Tab',
      content: (
        <p className="text-gray-700">
          This is the content of the second tab. Arrow keys navigate between
          tabs.
        </p>
      ),
    },
    {
      id: 'tab3',
      label: 'Third Tab',
      content: (
        <p className="text-gray-700">
          This is the content of the third tab. Follows WAI-ARIA practices.
        </p>
      ),
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Interactive Playground
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Explore React features and Tailwind CSS utilities in this interactive
          demo space.
        </p>

        <div className="space-y-12 text-left">
          {/* Modal Demo */}
          <div className="bg-white p-8 rounded-lg shadow">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Modal Component
            </h2>
            <p className="text-gray-600 mb-4">
              A modal dialog with focus trap, Escape key support, and focus
              return.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Open Modal
            </button>
            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title="Example Modal"
            >
              <p className="mb-4">
                This modal demonstrates proper accessibility features:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Focus trap keeps focus inside the modal</li>
                <li>Press Escape to close</li>
                <li>Focus returns to trigger on close</li>
                <li>Proper ARIA attributes</li>
              </ul>
            </Modal>
          </div>

          {/* Tabs Demo */}
          <div className="bg-white p-8 rounded-lg shadow">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Tabs Component
            </h2>
            <p className="text-gray-600 mb-4">
              Accessible tabs with arrow key navigation and ARIA attributes.
            </p>
            <CustomTabs tabs={tabData} />
          </div>

          {/* shadcn/ui Dialog Comparison */}
          <div className="bg-white p-8 rounded-lg shadow">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              shadcn/ui Dialog Comparison
            </h2>
            <p className="text-gray-600 mb-4">
              Radix-based accessible dialog with similar focus management and ARIA.
            </p>
            <Dialog>
              <DialogTrigger className="inline-flex items-center justify-center rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
                Open shadcn Dialog
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Example shadcn Dialog</DialogTitle>
                </DialogHeader>
                <p className="text-gray-700">
                  This shadcn/ui dialog uses Radix primitives and includes
                  built-in focus trap, Escape handling, and ARIA attributes.
                </p>
              </DialogContent>
            </Dialog>
          </div>

          {/* shadcn/ui Tabs Comparison */}
          <div className="bg-white p-8 rounded-lg shadow">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              shadcn/ui Tabs Comparison
            </h2>
            <p className="text-gray-600 mb-4">
              Radix-based accessible tabs with similar API and styling.
            </p>
            <Tabs defaultValue="tab1">
              <TabsList>
                {tabData.map(tab => (
                  <TabsTrigger key={tab.id} value={tab.id}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {tabData.map(tab => (
                <TabsContent key={tab.id} value={tab.id}>
                  {tab.content}
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Disclosure Demo */}
          <div className="bg-white p-8 rounded-lg shadow">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Disclosure Component
            </h2>
            <p className="text-gray-600 mb-4">
              Collapsible sections with proper aria-expanded handling.
            </p>
            <Disclosure title="First Disclosure Section">
              <p className="text-gray-700">
                This is the content of the first disclosure. Click the header to
                toggle visibility. Supports keyboard navigation with Enter and
                Space.
              </p>
            </Disclosure>
            <Disclosure title="Second Disclosure Section">
              <p className="text-gray-700">
                This is the content of the second disclosure. Each disclosure
                manages its own state independently.
              </p>
            </Disclosure>
            <Disclosure title="Third Disclosure Section">
              <p className="text-gray-700">
                Disclosures follow WAI-ARIA Authoring Practices for accessibility.
              </p>
            </Disclosure>
          </div>

          {/* Counter Demo */}
          <div className="bg-white p-8 rounded-lg shadow max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Counter Demo
            </h2>
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => setCount(c => c - 1)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Decrease
              </button>
              <span className="text-3xl font-bold text-gray-900 min-w-[80px]">
                {count}
              </span>
              <button
                onClick={() => setCount(c => c + 1)}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Increase
              </button>
            </div>
            {count !== 0 && (
              <button
                onClick={() => setCount(0)}
                className="mt-4 text-gray-500 hover:text-gray-700 underline"
              >
                Reset
              </button>
            )}
          </div>

          {/* Tailwind CSS Features */}
          <div className="bg-white p-8 rounded-lg shadow max-w-2xl mx-auto text-left">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Tailwind CSS Features
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border-l-4 border-blue-400">
                <p className="text-blue-700">
                  <strong>Info:</strong> This project uses Tailwind CSS v3 for
                  styling.
                </p>
              </div>
              <div className="p-4 bg-green-50 border-l-4 border-green-400">
                <p className="text-green-700">
                  <strong>Success:</strong> All components are fully responsive.
                </p>
              </div>
              <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400">
                <p className="text-yellow-700">
                  <strong>Warning:</strong> This is a demo warning message.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
