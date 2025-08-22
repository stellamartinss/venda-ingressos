import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../services/api'

function OrganizerSignupPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [document, setDocument] = useState('')
  const [bank, setBank] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      const response = await api.signup({ 
        name, 
        email, 
        password, 
        role: 'ORGANIZER' 
      })
      localStorage.setItem('authToken', response.token)
      localStorage.setItem('authUser', JSON.stringify(response.user))
      navigate('/organizador/painel')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro no cadastro')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Cadastro de organizador</h1>
      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3">
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <input required placeholder="Nome" value={name} onChange={(e)=>setName(e.target.value)} className="rounded-md border px-3 py-2 bg-white dark:bg-gray-900" />
        <input required type="email" placeholder="E-mail" value={email} onChange={(e)=>setEmail(e.target.value)} className="rounded-md border px-3 py-2 bg-white dark:bg-gray-900" />
        <input required type="password" placeholder="Senha" value={password} onChange={(e)=>setPassword(e.target.value)} className="rounded-md border px-3 py-2 bg-white dark:bg-gray-900" />
        <input placeholder="CPF/CNPJ (opcional)" value={document} onChange={(e)=>setDocument(e.target.value)} className="rounded-md border px-3 py-2 bg-white dark:bg-gray-900" />
        <input placeholder="Dados bancários (opcional)" value={bank} onChange={(e)=>setBank(e.target.value)} className="rounded-md border px-3 py-2 bg-white dark:bg-gray-900" />
        <button disabled={loading} className="px-4 py-2 rounded-md bg-indigo-600 text-white disabled:opacity-50">
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>
    </div>
  )
}

export default OrganizerSignupPage


