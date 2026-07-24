import { createBrowserRouter } from 'react-router-dom'
import RootLayout from '../layouts/RootLayout'
import Home from '../pages/Home'
import Projects from '../pages/Projects'
import Tasks from '../pages/Tasks'
import Calendar from '../pages/Calendar'
import Profile from '../pages/Profile'
import Settings from '../pages/Settings'
import HealthCheck from '../pages/HealthCheck'
import NotFound from '../pages/NotFound'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'projects', element: <Projects /> },
      { path: 'tasks', element: <Tasks /> },
      { path: 'calendar', element: <Calendar /> },
      { path: 'profile', element: <Profile /> },
      { path: 'settings', element: <Settings /> },
      { path: 'health', element: <HealthCheck /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])