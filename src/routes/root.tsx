import { useEffect } from 'react'
import { Outlet, redirect } from 'react-router-dom'
import { axiosApi } from '~/api/axios'
import useUser from '~/hooks/useUser'

export default function Root() {
  const { handleClearUser } = useUser()

  useEffect(() => {
    const responseInterceptor = axiosApi.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response.status === 401) {
          handleClearUser()
          redirect('/dashboard')
        }
      }
    )

    return () => {
      axiosApi.interceptors.response.eject(responseInterceptor)
    }
  }, [handleClearUser])

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
