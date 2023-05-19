import { atom } from 'jotai'
import { UserLocalStorage, getItemFromLocalStorage } from './lib/local-storage'

const userFromLocalStorage: UserLocalStorage =
  getItemFromLocalStorage('maze-user')

const userDefaultValues = { isAuthed: false } as const
const userAtomInitial = userFromLocalStorage
  ? { ...userFromLocalStorage, isAuthed: true }
  : userDefaultValues

export const userAtom = atom(userAtomInitial)
