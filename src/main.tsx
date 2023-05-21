import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Root from './routes/root'
import Dashboard from './routes/dashboard'
import Game from './routes/game'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import WaitingScreen from './routes/waiting-screen'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import RequireAuth from './routes/guards/require-auth'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'game/:gameId/waiting-screen',
        element: (
          <RequireAuth>
            <WaitingScreen />
          </RequireAuth>
        ),
      },
      {
        path: 'game/:gameId',
        element: (
          <RequireAuth>
            <Game />
          </RequireAuth>
        ),
      },
    ],
  },
])

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ToastContainer />
    </QueryClientProvider>
  </React.StrictMode>
)
