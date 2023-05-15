type Key = 'maze-user'

export const getItemFromLocalStorage = (key: Key) =>
  JSON.parse(localStorage.getItem(key) as string)

export const setItemToLocalStorage = (key: Key, item: any) =>
  localStorage.setItem(key, JSON.stringify(item))

export const removeItemFromLocalStorage = (key: Key) =>
  localStorage.removeItem(key)
