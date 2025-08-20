import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AdminLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    // Simple mock auth: change here if you want to configure elsewhere
    if (email === 'admin@local' && password === 'admin') {
      localStorage.setItem('adminAuth', JSON.stringify({ email }))
      navigate('/admin')
    } else {
      setError('Credenciais inválidas. Dica: admin@local / admin')
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Login Administrador</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <input required type="email" placeholder="E-mail" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full rounded-md border px-3 py-2 bg-white dark:bg-gray-900" />
        <input required type="password" placeholder="Senha" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full rounded-md border px-3 py-2 bg-white dark:bg-gray-900" />
        <button className="w-full px-4 py-2 rounded-md bg-indigo-600 text-white">Entrar</button>
      </form>
    </div>
  )
}

export default AdminLoginPage


