import { io, Socket } from 'socket.io-client'
import { Direction } from '~/type'

export type ReceiveCreatedGameResponse = {
  id: number
  boardId: number
  creatorId: number
  winnerId: number | null
  status: 'pending' | 'in_process' | 'finished'
  createdAt: Date
  updatedAt: Date
}

export interface ServerToClientEvents {
  gameCreated: (game: ReceiveCreatedGameResponse) => void
  gameStarted: (gameId: number) => void
  turnChange: () => void
  gameFinished: () => void
}

export interface ClientToServerEvents {
  createGame: (
    cb: (
      res:
        | { id: number }
        | {
            error_message:
              | 'User already plays another game or waits for another game to start'
              | 'Server error'
          }
    ) => void
  ) => void
  joinGame: (
    data: { userId: number; gameId: number },
    cb: (res: {
      error_message:
        | "User with such userId doesn't exists"
        | "Game with such gameId doesn't exists"
        | 'User already plays another game or waits for another game to start'
        | 'User already waits for this game to start'
        | 'User already plays in this game'
        | 'Server error'
    }) => void
  ) => void
  move: (
    data: {
      userId: number
      gameId: number
      direction: Direction
    },
    cb: (res: {
      error_message:
        | "User with such userId doesn't exists"
        | "Game with such gameId doesn't exists"
        | 'This direction is not allowed'
        | 'Server error'
    }) => void
  ) => void
  giveUp: (
    data: { userId: number; gameId: number },
    cb: (res: {
      error_message:
        | "User with such userId doesn't exists"
        | "Game with such gameId doesn't exists"
        | 'Server error'
    }) => void
  ) => void
}

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  import.meta.env.VITE_SERVER_URL,
  { autoConnect: false }
)

socket.onAny((event, ...args) => {
  console.log(event, args)
})

export default socket
