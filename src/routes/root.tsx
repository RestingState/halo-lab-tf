import { Outlet } from 'react-router-dom'

export default function Root() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

function Header() {
  return (
    <header className="flex h-14 items-center justify-center border-b bg-slate-50">
      <span className="text-2xl">Maze</span>
    </header>
  )
}
