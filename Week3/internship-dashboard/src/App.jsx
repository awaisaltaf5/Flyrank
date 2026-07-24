import { RouterProvider } from 'react-router-dom'
import { router } from './routes'

/**
 * App is the root component.
 * RouterProvider connects React Router to the React tree.
 */
function App() {
  return <RouterProvider router={router} />
}

export default App