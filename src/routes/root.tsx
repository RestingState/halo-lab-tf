import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { axiosApi } from '~/api/axios'
import socket from '~/api/socket'
import useUser from '~/hooks/useUser'

export default function Root() {
  const { user, handleClearUser } = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    const responseInterceptor = axiosApi.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response.status === 401) {
          handleClearUser()
          navigate('/dashboard')
        }
      }
    )

    return () => {
      axiosApi.interceptors.response.eject(responseInterceptor)
    }
  }, [navigate, handleClearUser])

  useEffect(() => {
    if (user.isAuthed) {
      socket.auth = { token: user.token }
      socket.connect()

      const handleGameStart = (gameId: number) => {
        navigate(`/game/${gameId}`)
      }

      socket.on('gameStarted', handleGameStart)

      return () => {
        socket.auth = {}
        socket.disconnect()

        socket.off('gameStarted', handleGameStart)
      }
    }
  }, [user, navigate])

  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

function Header() {
  return (
    <header className="flex h-14 items-center justify-center border-b bg-slate-50">
      <span className="text-2xl">Maze</span>
    </header>
  )
}
