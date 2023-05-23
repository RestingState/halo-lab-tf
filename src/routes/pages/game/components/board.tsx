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

export default Board
