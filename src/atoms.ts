import { atom } from 'jotai'
import { UserLocalStorage, getItemFromLocalStorage } from './lib/local-storage'

const userFromLocalStorage: UserLocalStorage =
  getItemFromLocalStorage('maze-user')

const userDefaultValues = { isAuthed: false, token: '', user: null } as const
const userAtomInitial = userFromLocalStorage
  ? ({ ...userFromLocalStorage, isAuthed: true } as const)
  : userDefaultValues

export const userAtom = atom(userAtomInitial)
