import upArrowSrc from '~/assets/svg/up_arrow.svg'
import rightArrowSrc from '~/assets/svg/right_arrow.svg'
import downArrowSrc from '~/assets/svg/down_arrow.svg'
import leftArrowSrc from '~/assets/svg/left_arrow.svg'
import { useState } from 'react'

export default function Game() {
  return (
    <main className="flex h-[calc(100vh-3.5rem)] items-center justify-center">
      <div className="flex h-[95%] w-[90%] flex-col justify-between bg-slate-50 px-5 py-5">
        <h1 className="text-center text-2xl">Now it's your turn</h1>
        <div className="grid h-[90%] grid-cols-[1fr_2fr] gap-5">
          <Chat />
          <PlayingWindow />
        </div>
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

type MovementButtonProps = {
  src: string
  className?: string
}

const MovementButton = ({ src, className }: MovementButtonProps) => {
  return (
    <button className={`btn btn-blue ${className}`}>
      <img className="h-6 w-6" src={src} />
    </button>
  )
}

const board: ('w' | 'p' | 'h' | 'u')[] = Array.from(
  { length: 64 },
  (_, i) => 'h'
)
board[22] = 'u'
board[21] = 'w'
board[14] = 'w'
board[23] = 'p'

function PlayingWindow() {
  const [activeLeaveBtn, setActiveLeaveButton] = useState<'Give up' | 'Exit'>(
    'Give up'
  )

  const getCellColor = (cellIdx: number) => {
    const cellType = board[cellIdx]
    if (cellType === 'w') return 'slate-500'
    if (cellType === 'p') return 'slate-50'
    if (cellType === 'h') return 'slate-200'
    if (cellType === 'u') return 'green-200'
  }

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="grid h-[80%] grid-cols-[repeat(8,min-content)] grid-rows-[repeat(8,min-content)] place-content-center gap-2">
        {board.map((_, idx) => (
          <div
            className={`h-10 w-10 border bg-${getCellColor(idx)}`}
            key={idx}
          ></div>
        ))}
      </div>
      <div className="relative">
        <div className="flex justify-center">
          <div className="grid grid-cols-[repeat(3,max-content)] gap-2">
            <div />
            <MovementButton src={upArrowSrc} />
            <div />
            <MovementButton src={leftArrowSrc} />
            <MovementButton src={downArrowSrc} />
            <MovementButton src={rightArrowSrc} />
          </div>
        </div>
        <div className="absolute bottom-0 right-0 flex gap-5">
          <button className="btn btn-red" disabled={activeLeaveBtn === 'Exit'}>
            Give up
          </button>
          <button
            className="btn btn-red"
            disabled={activeLeaveBtn === 'Give up'}
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  )
}
