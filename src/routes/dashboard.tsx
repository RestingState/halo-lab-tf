import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { signin, signup } from '~/api/auth-api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { getAllGamesForWaitingList } from '~/api/game-api'
import Loader from '~/components/loader'
import useUser from '~/hooks/useUser'
import socket, { ReceiveCreatedGameResponse } from '~/api/socket'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { SERVER_ERROR } from '~/constants'

const cell = 'px-12 py-2 border'

export default function Dashboard() {
  const { user } = useUser()

  if (!user.isAuthed) {
    return <AuthModal />
  }

  return <GameList />
}

function GameList() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['waitingList'],
    queryFn: () => getAllGamesForWaitingList({ status: 'pending' }),
  })
  const queryClient = useQueryClient()
  const { user } = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    if (user.isAuthed) {
      const receiveCreatedGameListener = (game: ReceiveCreatedGameResponse) => {
        // TODO: remove any
        queryClient.setQueryData(['waitingList'], (oldData: any) =>
          oldData ? [...oldData, game] : oldData
        )
      }

      socket.on('gameCreated', receiveCreatedGameListener)

      return () => {
        socket.off('gameCreated', receiveCreatedGameListener)
      }
    }
  }, [user, queryClient])

  const onExistingGameClick = (gameId: number) => {
    socket.emit(
      'joinGame',
      { userId: user.user?.id as number, gameId },
      (res) => {
        if (
          res.error_message ===
          'User already plays another game or waits for another game to start'
        ) {
          toast.error("You're already in game")
        } else if (res.error_message === 'Game is not in pending state') {
          toast.error('Game is not available anymore')
        } else if (
          res.error_message === 'User already waits for this game to start'
        ) {
          navigate(`/game/${gameId}/waiting-screen`)
        } else if (res.error_message === 'User already plays in this game') {
          navigate(`/game/${gameId}`)
        } else {
          toast.error('Server error')
        }
      }
    )
  }

  const onNewGameClick = () => {
    socket.emit('createGame', (res) => {
      if ('error_message' in res) {
        if (
          res.error_message ===
          'User already plays another game or waits for another game to start'
        ) {
          toast.error("You're already waiting on a game start or play one")
        } else {
          toast.error(SERVER_ERROR)
        }
      } else {
        navigate(`/game/${res.id}/waiting-screen`)
      }
    })
  }

  return (
    <>
      <main className="flex h-[calc(100vh-3.5rem)] items-center justify-center">
        <div className="flex max-h-[60%] max-w-xl flex-col gap-5 bg-slate-50 p-10 py-5">
          <h1 className="text-center text-2xl">Hello, &#60;username&#62;</h1>
          {isLoading ? (
            <div className="flex justify-center px-32 py-5">
              <Loader size={100} />
            </div>
          ) : isError || !data ? (
            <div className="p-10 text-xl text-red-700">{SERVER_ERROR}</div>
          ) : data.length === 0 ? (
            <p>No games were found. Create one yourself!</p>
          ) : (
            <div className="overflow-y-auto">
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th className={cell}>Datetime</th>
                    <th className={cell}>Username</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map(({ id, createdAt, creator }) => {
                    const date = new Date(createdAt)
                    return (
                      <tr
                        key={id}
                        className="cursor-pointer hover:bg-slate-100"
                        onClick={() => onExistingGameClick(id)}
                      >
                        <td className={cell}>{date.toLocaleString()}</td>
                        <td className={cell}>{creator.username}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
          <button className="btn btn-blue" onClick={onNewGameClick}>
            New game
          </button>
        </div>
      </main>
    </>
  )
}

const formSchema = z.object({
  username: z
    .string()
    .min(4, 'username must contain at least 4 characters')
    .max(12, 'username must contain at most 12 characters'),
  password: z
    .string()
    .min(8, 'password must contain at least 8 characters')
    .max(32, 'password must contain at most 32 characters'),
})

type FormSchemaType = z.infer<typeof formSchema>

function AuthModal() {
  const [type, setType] = useState<'sign in' | 'registration'>('sign in')
  const [error, setError] = useState('')

  const { handleSetUser } = useUser()
  const signinMutation = useMutation({
    mutationFn: signin,
    onSuccess: (data) => {
      handleSetUser(data.data)
    },
    onError: (error: Error | AxiosError) => {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          setError(error.response.data.message)
          return
        }
      }
      setError('Server error. Try again later')
    },
  })
  const signupMutation = useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      handleSetUser(data.data)
    },
    onError: (error: Error | AxiosError) => {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          setError(error.response.data.message)
        }
      }
      setError('Server error. Try again later')
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    if (type === 'sign in') {
      signinMutation.mutate(data)
    } else {
      signupMutation.mutate(data)
    }
  }

  const onTypeChange = () => {
    if (type === 'sign in') setType('registration')
    else setType('sign in')
  }

  return (
    <div
      aria-hidden="true"
      className="fixed left-0 right-0 top-0 z-50 flex h-[calc(100%-1rem)] max-h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden p-4 md:inset-0"
    >
      <div className="relative max-h-full w-full max-w-md">
        <div className="relative rounded-lg bg-slate-50 shadow">
          <div className="px-6 py-6 lg:px-8">
            <h3 className="mb-4 text-center text-xl font-medium text-gray-900">
              {type === 'sign in' ? 'Sign in' : 'Registration'}
            </h3>
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label
                  htmlFor="username"
                  className="mb-2 block text-sm font-medium text-gray-900"
                >
                  Your username
                </label>
                <input
                  type="username"
                  id="username"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="blueberry"
                  {...register('username')}
                />
                {errors.username && (
                  <div className="err-msg">{errors.username.message}</div>
                )}
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-gray-900"
                >
                  Your password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  {...register('password')}
                />
                {errors.password && (
                  <div className="err-msg">{errors.password.message}</div>
                )}
              </div>
              {error && <div className="err-msg text-center">{error}</div>}

              <button
                type="submit"
                className="btn btn-blue mx-auto block"
                disabled={signinMutation.isLoading || signupMutation.isLoading}
              >
                {type === 'sign in' ? 'Login to your account' : 'Sign up'}
              </button>

              <div className="text-sm font-medium text-gray-500">
                {type === 'sign in'
                  ? 'Not registered? '
                  : 'Already have an account? '}
                <span
                  onClick={onTypeChange}
                  className="cursor-pointer text-blue-700 hover:underline"
                >
                  {type === 'sign in' ? 'Create account' : 'Sign in'}
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
