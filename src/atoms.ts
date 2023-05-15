import { atom } from 'jotai'
import { getItemFromLocalStorage } from './lib/local-storage'

type User = {
  user: {
    id: number
    username: string
  }
  token: string
}
type UserLocalStorage = null | User
const userFromLocalStorage: UserLocalStorage =
  getItemFromLocalStorage('maze-user')

const userDefaultValues = { isAuthed: false } as const
const userAtomInitial = userFromLocalStorage
  ? { ...userFromLocalStorage, isAuthed: true }
  : userDefaultValues

export const userAtom = atom(userAtomInitial)
