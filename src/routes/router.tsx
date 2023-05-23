import { createBrowserRouter } from 'react-router-dom'
import Root from './root'
import Dashboard from './dashboard'
import RequireAuth from './guards/require-auth'
import WaitingScreen from './waiting-screen'
import Game from './game'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '',
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

export default router
