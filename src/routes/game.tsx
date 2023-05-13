export default function Game() {
  return (
    <main className="flex h-[calc(100vh-3.5rem)] items-center justify-center">
      <div className="flex h-[95%] w-[90%] flex-col justify-between bg-slate-50 px-5 py-5">
        <h1 className="text-center text-2xl">Now it's your turn</h1>
        <div className="grid h-[90%] grid-cols-[1fr_2fr] gap-5">
          <Chat />
          <PlayingField />
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

function PlayingField() {
  return <div className="h-full bg-green-200"></div>
}
