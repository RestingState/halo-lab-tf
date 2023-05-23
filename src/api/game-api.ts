import { Direction } from '~/type'
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

export async function getGameForWaitingScreen(gameId: number) {
  return (
    await axiosApi.get<{
      creatorId: number
      createdAt: string
    }>(`/game/${gameId}/waiting_screen`)
  ).data
}

export async function getGameForPlay({
  gameId,
  userId,
}: {
  gameId: number
  userId: number
}) {
  return (
    await axiosApi.get<
      | {
          gameBoard: { id: number; value: 'w' | 'p' | 'h' | 'u' }[][]
          yourTurn: boolean
          allowedDirections: ('up' | 'right' | 'down' | 'left')[]
          gameFinished: false
        }
      | {
          gameBoard: { id: number; value: 'w' | 'p' | 'h' | 'u' }[][]
          gameFinished: true
          youWon: boolean
        }
    >(`/game/${gameId}/user/${userId}`)
  ).data
}

export async function getChatMessages(gameId: number) {
  return (
    await axiosApi.get<
      | {
          user: {
            id: number
            username: string
          }
          id: number
          text: string
          type: 'message'
          createdAt: Date
        }[]
      | {
          user: {
            id: number
            username: string
          }
          id: number
          text: Direction
          type: 'command'
          createdAt: Date
        }[]
    >(`/game/${gameId}/chat_messages`)
  ).data
}
