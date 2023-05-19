import axios from 'axios'
import { UserLocalStorage, getItemFromLocalStorage } from '~/lib/local-storage'

export const axiosApi = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
})

axiosApi.interceptors.request.use((request) => {
  const userFromLocalStorage: UserLocalStorage =
    getItemFromLocalStorage('maze-user')

  request.headers.Authorization = `Bearer ${userFromLocalStorage?.token}`
  return request
})
