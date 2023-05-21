import { useAtom } from 'jotai'
import { useCallback } from 'react'
import { userAtom } from '~/atoms'
import {
  UserLocalStorage,
  removeItemFromLocalStorage,
} from '~/lib/local-storage'
import { setItemToLocalStorage } from '~/lib/local-storage'

export default function useUser() {
  const [user, setUser] = useAtom(userAtom)

  const handleSetUser = (data: NonNullable<UserLocalStorage>) => {
    setUser({ ...data, isAuthed: true })
    setItemToLocalStorage('maze-user', data)
  }

  const handleClearUser = useCallback(() => {
    setUser({ isAuthed: false, token: '', user: null })
    removeItemFromLocalStorage('maze-user')
  }, [setUser])

  return { user, handleSetUser, handleClearUser }
}
