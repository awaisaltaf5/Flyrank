import { Outlet } from 'react-router-dom'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'

/**
 * RootLayout is the global shell for every page.
 * It renders the navigation, main content area, and footer.
 * 
 * The <Outlet /> is where React Router injects the matched page.
 */
export default function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
      <Navigation />
      
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
      
      <Footer />
    </div>
  )
}