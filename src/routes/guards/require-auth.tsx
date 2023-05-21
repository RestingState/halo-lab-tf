import { PropsWithChildren } from 'react'
import useUser from '~/hooks/useUser'
import { Navigate } from 'react-router-dom'

export default function RequireAuth({ children }: PropsWithChildren) {
  const { user } = useUser()

  if (!user.isAuthed) {
    return <Navigate to={'/dashboard'} />
  }

  return <>{children}</>
}
