import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { getGameForWaitingScreen } from '~/api/game-api'
import Loader from '~/components/loader'
import { SERVER_ERROR } from '~/constants'
import useUser from '~/hooks/useUser'
import { getDateDiff } from '~/lib/date'
import { toast } from 'react-toastify'
import ConfirmToast from '~/components/confirm-toast'
import socket from '~/api/socket'

export default function WaitingScreen() {
  const [waitingTime, setWaitingTime] = useState(new Date())
  const { gameId } = useParams()
  const { data, isLoading, isError } = useQuery({
    queryKey: ['waitingScreen'],
    queryFn: () => getGameForWaitingScreen(+(gameId as string)),
  })
  const { user } = useUser()

  useEffect(() => {
    const intervalId = setInterval(() => {
      setWaitingTime(new Date())
    }, 1000)

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  const handleCancelGame = () => {
    const confirm = () => {
      socket.emit(
        'cancelGame',
        {
          gameId: +(gameId as string),
        },
        () => toast.error(SERVER_ERROR)
      )
    }

    toast(
      <ConfirmToast
        title="You really want to cancel game?"
        confirm={confirm}
      />,
      {
        autoClose: false,
        position: 'bottom-center',
      }
    )
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center text-2xl">
      {isLoading ? (
        <Loader size={100} />
      ) : isError || !data ? (
        <div className="text-red-700">{SERVER_ERROR}</div>
      ) : data.creatorId !== user.user?.id ? (
        <Navigate to={'/'} />
      ) : (
        <div className="flex flex-col gap-20">
          <WaitingTime
            waitingTime={waitingTime}
            createdAt={new Date(data.createdAt)}
          />
          <button
            className="btn btn-red mx-auto text-lg"
            onClick={handleCancelGame}
          >
            Cancel game
          </button>
        </div>
      )}
    </div>
  )
}

function WaitingTime({
  waitingTime,
  createdAt,
}: {
  waitingTime: Date
  createdAt: Date
}) {
  const { hours, minutes, seconds } = getDateDiff(waitingTime, createdAt)

  return (
    <div>
      {`You started a new game ${hours ? `${hours} hours` : ''} ${
        minutes ? `${minutes} minutes` : ''
      } ${
        seconds ? `${seconds} seconds` : ''
      } ago. Waiting for a second player…`}
    </div>
  )
}
