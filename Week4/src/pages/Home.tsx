export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Week 4
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          This is a React + TypeScript application built with Vite and
          Tailwind CSS v3. Navigate to the Playground to explore interactive
          demos.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              React + TypeScript
            </h3>
            <p className="text-gray-600">
              Built with modern React and TypeScript for type safety.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Vite
            </h3>
            <p className="text-gray-600">
              Fast development server and optimized production builds.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Tailwind CSS v3
            </h3>
            <p className="text-gray-600">
              Utility-first CSS framework for rapid UI development.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}