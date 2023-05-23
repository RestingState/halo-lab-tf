import { useQuery, useQueryClient } from '@tanstack/react-query'
import { FormEvent, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { z } from 'zod'
import { getChatMessages } from '~/api/game-api'
import socket, { ReceiveMessageReceivedResponse } from '~/api/socket'
import Loader from '~/components/loader'
import { SERVER_ERROR } from '~/constants'
import useUser from '~/hooks/useUser'
import { Direction } from '~/type'

type ChatProps =
  | {
      yourTurn: boolean
      allowedDirections: ('up' | 'right' | 'down' | 'left')[]
      onMove: (direction: Direction) => void
      gameFinished: false
    }
  | { gameFinished: true }

function Chat(props: ChatProps) {
  const { gameId } = useParams()
  const { user } = useUser()
  const queryClient = useQueryClient()
  const { data, isLoading, isError } = useQuery({
    queryKey: ['chatMessages'],
    queryFn: () => getChatMessages(+(gameId as string)),
  })
  const [text, setText] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMessageReceive = (message: ReceiveMessageReceivedResponse) => {
      // TODO: remove any
      queryClient.setQueryData(['chatMessages'], (oldData: any) =>
        oldData ? [...oldData, message] : oldData
      )
    }

    socket.on('messageReceived', handleMessageReceive)

    return () => {
      socket.off('messageReceived', handleMessageReceive)
    }
  }, [queryClient])

  useEffect(() => {
    if (
      bottomRef.current &&
      data &&
      data.length &&
      data[data.length - 1].user.id === user.user!.id
    ) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [data, user.user])

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (text.startsWith('/')) {
      const result = z
        .enum(['up', 'right', 'down', 'left'])
        .safeParse(text.slice(1))

      if (!result.success) {
        toast.error(
          'There are only /up, /right, /down and /left commands available'
        )
        return
      }

      if (props.gameFinished) {
        toast.error('You cannot send commands on finished game')
        return
      }

      const { yourTurn, allowedDirections, onMove } = props
      if (!yourTurn) {
        toast.error('You can use commands only during your turn')
        return
      }

      if (!allowedDirections.includes(result.data)) {
        toast.error('You cannot make this move')
        return
      }

      onMove(result.data)
    } else {
      socket.emit(
        'sendMessage',
        {
          userId: user.user!.id,
          gameId: +(gameId as string),
          text,
        },
        () => toast.error(SERVER_ERROR)
      )
    }

    setText('')
  }

  const getTimeString = (date: Date) => {
    const hours =
      date.getHours() < 10 ? `0${date.getHours()}` : `${date.getHours()}`
    const minutes =
      date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`
    const seconds =
      date.getSeconds() < 10 ? `0${date.getSeconds()}` : `${date.getSeconds()}`

    return `${hours}:${minutes}:${seconds}`
  }

  return (
    <div className="flex h-full flex-col gap-5">
      <div className="relative grow rounded-md border">
        <div className="absolute inset-0 flex h-full flex-col-reverse gap-2 overflow-y-auto p-2">
          {isLoading ? (
            <div className="flex justify-center">
              <Loader size={50} />
            </div>
          ) : isError || !data ? (
            <div className="text-center text-red-700">{SERVER_ERROR}</div>
          ) : (
            <>
              <div ref={bottomRef} />
              {[...data]
                .reverse()
                .map(({ id, text, createdAt, user, type }) => {
                  const timeString = getTimeString(new Date(createdAt))

                  if (type === 'message') {
                    return (
                      <div
                        key={id}
                        className="grid grid-cols-[max-content_100px_2fr] gap-2"
                      >
                        <div>{timeString}</div>
                        <div className="truncate">{`${user.username}:`}</div>
                        <div>{text}</div>
                      </div>
                    )
                  } else {
                    return (
                      <div
                        key={id}
                        className="grid grid-cols-[max-content_1fr] gap-2"
                      >
                        <div>{timeString}</div>
                        {type === 'command' ? (
                          <div className="text-blue-700">{`(going ${text})`}</div>
                        ) : (
                          <div className="text-orange-500">{text}</div>
                        )}
                      </div>
                    )
                  }
                })}
            </>
          )}
        </div>
      </div>
      <form className="flex gap-5" onSubmit={onSubmit}>
        <input
          type="text"
          id="text"
          className="block w-full border bg-gray-100 p-2.5 text-sm focus:outline-0"
          placeholder="Type your message here"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <button className="btn btn-blue" type="submit">
          Send
        </button>
      </form>
    </div>
  )
}

export default Chat
