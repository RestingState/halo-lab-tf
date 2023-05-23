import { useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getGameForPlay } from '~/api/game-api'
import useUser from '~/hooks/useUser'
import { useParams } from 'react-router-dom'
import Loader from '~/components/loader'
import { SERVER_ERROR } from '~/constants'
import socket from '~/api/socket'
import { Direction } from '~/type'
import { toast } from 'react-toastify'
import Chat from './components/chat'
import Board from './components/board'
import ActionPanel from './components/action-panel'

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

  useEffect(() => {
    socket.emit('joinGameRoom', { gameId: +(gameId as string) }, () =>
      toast.error(SERVER_ERROR)
    )
  }, [gameId])

  const handleMove = (direction: Direction) => {
    socket.emit(
      'move',
      {
        userId: user.user!.id,
        gameId: +(gameId as string),
        direction,
      },
      () => toast.error(SERVER_ERROR)
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
                <div className="text-red-700">
                  Now it's your opponent's turn
                </div>
              )}
            </h1>
            <div className="grid h-[90%] grid-cols-[1fr_2fr] gap-5">
              {data.gameFinished ? (
                <Chat gameFinished={data.gameFinished} />
              ) : (
                <Chat
                  gameFinished={data.gameFinished}
                  yourTurn={data.yourTurn}
                  allowedDirections={data.allowedDirections}
                  onMove={handleMove}
                />
              )}
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
