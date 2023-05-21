import upArrowSrc from '~/assets/svg/up_arrow.svg'
import rightArrowSrc from '~/assets/svg/right_arrow.svg'
import downArrowSrc from '~/assets/svg/down_arrow.svg'
import leftArrowSrc from '~/assets/svg/left_arrow.svg'
import { ComponentPropsWithoutRef, useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getGameForPlay } from '~/api/game-api'
import useUser from '~/hooks/useUser'
import { useNavigate, useParams } from 'react-router-dom'
import Loader from '~/components/loader'
import { SERVER_ERROR } from '~/constants'
import socket from '~/api/socket'
import { Direction } from '~/type'
import { toast } from 'react-toastify'
import ConfirmToast from '~/components/confirm-toast'

export default function Game() {
  const { user } = useUser()
  const { gameId } = useParams()
  const queryClient = useQueryClient()
  const { data, isLoading, isError } = useQuery({
    queryKey: ['gameBoard'],
    queryFn: () =>
      getGameForPlay({
        userId: user.user!.id,
        gameId: +(gameId as string),
      }),
  })

  useEffect(() => {
    const handleTurnChange = () =>
      queryClient.invalidateQueries({ queryKey: ['gameBoard'] })

    const handleGameFinish = () =>
      queryClient.invalidateQueries({ queryKey: ['gameBoard'] })

    socket.on('turnChange', handleTurnChange)
    socket.on('gameFinished', handleGameFinish)

    return () => {
      socket.off('turnChange', handleTurnChange)
      socket.off('gameFinished', handleGameFinish)
    }
  }, [queryClient])

  const handleMove = (direction: Direction) => {
    socket.emit(
      'move',
      {
        userId: user.user!.id,
        gameId: +(gameId as string),
        direction,
      },
      console.log
    )
  }

  return (
    <main className="flex h-[calc(100vh-3.5rem)] items-center justify-center">
      <div className="flex h-[95%] w-[90%] flex-col justify-between bg-slate-50 px-5 py-5">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader size={200} />
          </div>
        ) : isError || !data ? (
          <div className="flex h-full items-center justify-center text-2xl text-red-700">
            {SERVER_ERROR}
          </div>
        ) : (
          <>
            <h1 className="text-center text-2xl">
              {data.gameFinished ? (
                data.youWon ? (
                  <div className="text-green-700">You won</div>
                ) : (
                  <div className="text-red-700">You lost</div>
                )
              ) : data.yourTurn ? (
                <div className="text-green-700">Now it's your turn</div>
              ) : (
                <div className="text-red-700">Now it's your opponent turn</div>
              )}
            </h1>
            <div className="grid h-[90%] grid-cols-[1fr_2fr] gap-5">
              <Chat />
              <div className="flex h-full flex-col justify-between">
                <Board gameBoard={data.gameBoard} />
                {data.gameFinished ? (
                  <ActionPanel gameFinished={data.gameFinished} />
                ) : (
                  <ActionPanel
                    yourTurn={data.yourTurn}
                    allowedDirections={data.allowedDirections}
                    onMove={handleMove}
                    gameFinished={data.gameFinished}
                  />
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  )
}

const messages = [
  {
    id: 1,
    message: 'Hello, how are you?',
    user: {
      username: 'Alex',
    },
    date: '2023-05-22 15:16:45',
  },
  {
    id: 2,
    message: 'd',
    user: {
      username: 'Augustin Porebryk',
    },
    date: '2023-05-22 15:16:45',
  },
  {
    id: 3,
    message:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In lacus leo, commodo non mauris at, consectetur blandit est.',
    user: {
      username: 'Vafla',
    },
    date: '2023-05-22 15:16:45',
  },
  {
    id: 4,
    message:
      'Nullam molestie consectetur feugiat. Duis molestie elit vel nunc congue hendrerit.',
    user: {
      username: 'Denji Banana',
    },
    date: '2023-05-22 15:16:45',
  },
  {
    id: 5,
    message: 'Mauris ullamcorper',
    user: {
      username: 'Dijego Maradonna',
    },
    date: '2023-05-22 15:16:45',
  },
  {
    id: 6,
    message: 'Mauris ullamcorper',
    user: {
      username: 'Dijego Maradonna',
    },
    date: '2023-05-22 15:16:45',
  },
  {
    id: 7,
    message: 'Mauris ullamcorper',
    user: {
      username: 'Dijego Maradonna',
    },
    date: '2023-05-22 15:16:45',
  },
  {
    id: 8,
    message: 'Mauris ullamcorper',
    user: {
      username: 'Dijego Maradonna',
    },
    date: '2023-05-22 15:16:45',
  },
  {
    id: 9,
    message:
      'Nullam molestie consectetur feugiat. Duis molestie elit vel nunc congue hendrerit',
    user: {
      username: 'Dijego Maradonna',
    },
    date: '2023-05-22 15:16:45',
  },
  {
    id: 10,
    message:
      'Nullam molestie consectetur feugiat. Duis molestie elit vel nunc congue hendrerit',
    user: {
      username: 'Dijego Maradonna',
    },
    date: '2023-05-22 15:16:45',
  },
]

function Chat() {
  return (
    <div className="flex h-full flex-col gap-5">
      <div className="relative grow rounded-md border">
        <div className="absolute inset-0 flex h-full flex-col-reverse gap-2 overflow-y-auto p-2">
          {messages.map(({ id, message, date, user }) => {
            const datetime = new Date(date)
            return (
              <div
                key={id}
                className="grid grid-cols-[max-content_100px_2fr] gap-2"
              >
                <div>
                  {`${datetime.getHours()}:${datetime.getMinutes()}:${datetime.getSeconds()}`}
                </div>
                <div className="truncate">{`${user.username}:`}</div>
                <div>{message}</div>
              </div>
            )
          })}
        </div>
      </div>
      <form className="flex gap-5">
        <input
          type="text"
          id="first_name"
          className="block w-full border bg-gray-100 p-2.5 text-sm focus:outline-0"
          placeholder="Type your message here"
          required
        />
        <button className="btn btn-blue">Send</button>
      </form>
    </div>
  )
}

type BoardProps = {
  gameBoard: { id: number; value: 'w' | 'p' | 'h' | 'u' }[][]
}

function Board({ gameBoard }: BoardProps) {
  const getCellColor = (value: 'w' | 'p' | 'h' | 'u') => {
    if (value === 'w') return 'bg-slate-500'
    if (value === 'p') return 'bg-slate-50'
    if (value === 'h') return 'bg-slate-200'
    if (value === 'u') return 'bg-green-200'
  }

  return (
    <div className="grid h-[80%] grid-cols-[repeat(8,min-content)] grid-rows-[repeat(8,min-content)] place-content-center gap-2">
      {gameBoard.map((row) =>
        row.map(({ id, value }) => (
          <div
            className={`h-10 w-10 border ${getCellColor(value)}`}
            key={id}
          ></div>
        ))
      )}
    </div>
  )
}

type ActionPanelProps =
  | {
      yourTurn: boolean
      allowedDirections: ('up' | 'right' | 'down' | 'left')[]
      onMove: (direction: Direction) => void
      gameFinished: false
    }
  | { gameFinished: true }

function ActionPanel(props: ActionPanelProps) {
  const navigate = useNavigate()

  const handleGiveUp = () => {
    const confirm = () => console.log('confirm')
    toast(<ConfirmToast confirm={confirm} />, {
      autoClose: false,
      position: 'bottom-center',
    })
  }

  const handleExit = () => navigate('/dashboard')

  return (
    <div className="relative">
      <div className="flex justify-center">
        {props.gameFinished ? (
          <button className="btn btn-blue">Watch replay</button>
        ) : (
          <div className="grid grid-cols-[repeat(3,max-content)] gap-2">
            <div />
            <MovementButton
              src={upArrowSrc}
              disabled={
                !props.yourTurn || !props.allowedDirections.includes('up')
              }
              onClick={() => props.onMove('up')}
            />
            <div />
            <MovementButton
              src={leftArrowSrc}
              disabled={
                !props.yourTurn || !props.allowedDirections.includes('left')
              }
              onClick={() => props.onMove('left')}
            />
            <MovementButton
              src={downArrowSrc}
              disabled={
                !props.yourTurn || !props.allowedDirections.includes('down')
              }
              onClick={() => props.onMove('down')}
            />
            <MovementButton
              src={rightArrowSrc}
              disabled={
                !props.yourTurn || !props.allowedDirections.includes('right')
              }
              onClick={() => props.onMove('right')}
            />
          </div>
        )}
      </div>
      <div className="absolute bottom-0 right-0 flex gap-5">
        <button
          className="btn btn-red"
          disabled={props.gameFinished}
          onClick={handleGiveUp}
        >
          Give up
        </button>
        <button
          className="btn btn-red"
          disabled={!props.gameFinished}
          onClick={handleExit}
        >
          Exit
        </button>
      </div>
    </div>
  )
}

type MovementButtonProps = {
  src: string
  className?: string
  disabled: boolean
} & ComponentPropsWithoutRef<'button'>

const MovementButton = ({
  src,
  className,
  disabled,
  ...rest
}: MovementButtonProps) => {
  return (
    <button
      className={`btn btn-blue ${className}`}
      disabled={disabled}
      {...rest}
    >
      <img className="h-6 w-6" src={src} />
    </button>
  )
}
