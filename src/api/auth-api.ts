import { axiosApi } from './axios'

export async function signup(body: { username: string; password: string }) {
  return axiosApi.post<{
    user: { id: number; username: string }
    token: string
  }>('/auth/signup', body)
}

export async function signin(body: { username: string; password: string }) {
  return axiosApi.post<{
    user: { id: number; username: string }
    token: string
  }>('/auth/login', body)
}
