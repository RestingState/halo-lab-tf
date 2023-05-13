const games = [
  { id: 1, username: 'Alex', date: '2023-05-22 15:16:45' },
  { id: 2, username: 'Denys', date: '2023-05-22 15:16:45' },
  { id: 3, username: 'Augustin Porebryk', date: '2023-05-22 15:16:45' },
  { id: 4, username: 'Augustin Porebryk', date: '2023-05-22 15:16:45' },
  { id: 5, username: 'Augustin Porebryk', date: '2023-05-22 15:16:45' },
  { id: 6, username: 'Augustin Porebryk', date: '2023-05-22 15:16:45' },
  { id: 7, username: 'Augustin Porebryk', date: '2023-05-22 15:16:45' },
  { id: 8, username: 'Augustin Porebryk', date: '2023-05-22 15:16:45' },
  { id: 9, username: 'Augustin Porebryk', date: '2023-05-22 15:16:45' },
  {
    id: 10,
    username: 'Augustin Porebryk',
    date: '2023-05-22 15:16:45',
  },
  { id: 11, username: 'Augustin Porebryk', date: '2023-05-22 15:16:45' },
  { id: 12, username: 'Augustin Porebryk', date: '2023-05-22 15:16:45' },
]

const cell = 'px-12 py-2 border'

export default function Dashboard() {
  return (
    <main className="flex h-[calc(100vh-3.5rem)] items-center justify-center">
      <div className="flex max-h-[60%] max-w-xl flex-col gap-5 bg-slate-50 p-10 py-5">
        <h1 className="text-center text-2xl">Hello, &#60;username&#62;</h1>
        {games.length === 0 ? (
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
                {games.map(({ id, username, date }) => (
                  <tr key={id} className="cursor-pointer hover:bg-slate-100">
                    <td className={cell}>{date}</td>
                    <td className={cell}>{username}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <button className="btn btn-blue">New game</button>
      </div>
    </main>
  )
}
