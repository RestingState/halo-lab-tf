import { createBrowserRouter } from 'react-router-dom'
import Root from './root'
import RequireAuth from './guards/require-auth'
import WaitingScreen from './pages/waiting-screen/waiting-screen'
import Dashboard from './pages/dashboard/dashboard'
import Game from './pages/game/game'

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
