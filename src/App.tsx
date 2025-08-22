import { Link, Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [dark, setDark] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark'
  })

  useEffect(() => {
    const root = document.documentElement
    if (dark) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [dark])

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <header className="border-b bg-white/70 dark:bg-gray-900/70 backdrop-blur sticky top-0 z-10">
        <div className="container flex items-center justify-between py-4">
          <Link to="/" className="font-semibold text-lg">Venda Ingressos</Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/" className="hover:underline">Eventos</Link>
            <Link to="/organizador/login" className="btn btn-primary">Login</Link>
            {/* <Link to="/admin" className="hover:underline">Admin</Link>
            <Link to="/admin/login" className="hover:underline">Login Admin</Link> */}
            <button onClick={() => setDark(v=>!v)} className="border rounded-md px-2 py-1 text-xs">
              {dark ? 'Claro' : 'Escuro'}
            </button>
          </nav>
        </div>
      </header>
      <main className="container py-6">
        <Outlet />
      </main>
      <footer className="border-t py-6 text-center text-sm opacity-70">
        © {new Date().getFullYear()} Venda Ingressos
      </footer>
    </div>
  )
}

export default App
