import { axiosApi } from './axios'

export async function getAllGamesForWaitingList(queries: {
  status: 'pending' | 'in_process' | 'finished'
}) {
  return (
    await axiosApi.get<
      {
        id: number
        createdAt: string
        creator: { id: number; username: string }
      }[]
    >(`/game/waiting_list?status=${queries.status}`)
  ).data
}
