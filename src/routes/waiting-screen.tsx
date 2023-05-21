import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { getGameForWaitingScreen } from '~/api/game-api'
import Loader from '~/components/loader'
import { SERVER_ERROR } from '~/constants'
import useUser from '~/hooks/useUser'
import { getDateDiff } from '~/lib/date'

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

  return (
    <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center text-2xl">
      {isLoading ? (
        <Loader size={100} />
      ) : isError || !data ? (
        <div className="text-red-700">{SERVER_ERROR}</div>
      ) : data.creatorId !== user.user?.id ? (
        <Navigate to={'/dashboard'} />
      ) : (
        <WaitingTime
          waitingTime={waitingTime}
          createdAt={new Date(data.createdAt)}
        />
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
