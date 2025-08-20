import { FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, Event, OrganizerReport } from '../services/api'

type TicketInput = { name: string; price: number; quantity: number }

function DashboardPage() {
  const navigate = useNavigate()
  const [authed, setAuthed] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [events, setEvents] = useState<Event[]>([])
  const [report, setReport] = useState<OrganizerReport | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [dateTime, setDateTime] = useState('')
  const [image, setImage] = useState('')
  const [tickets, setTickets] = useState<TicketInput[]>([{ name: 'Pista', price: 50, quantity: 100 }])

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem('authToken')
      const user = JSON.parse(localStorage.getItem('authUser') || 'null')
      if (!token || !user || user.role !== 'ORGANIZER') {
        navigate('/organizador/login')
        return
      }
      setAuthed(true)
      
      try {
        setLoading(true)
        setError('')
        
        // Try to load data from backend, but handle missing endpoints gracefully
        try {
          const [eventsResponse, reportData] = await Promise.all([
            api.getOrganizerEvents(),
            api.getOrganizerReport()
          ])
          setEvents(eventsResponse.data || [])
          setReport(reportData)
        } catch (apiError) {
          console.warn('Backend endpoints not available yet:', apiError)
          // Set fallback data until backend is ready
          setEvents([])
          setReport({
            totalSold: 0,
            gross: 0,
            fee: 0,
            net: 0
          })
          setError('Backend endpoints não disponíveis ainda. Usando dados de exemplo.')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados')
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [navigate])

  function addTicket() {
    setTickets(prev => [...prev, { name: '', price: 0, quantity: 0 }])
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!authed) return
    
    try {
      setLoading(true)
      setError('')
      
      const eventData = {
        name,
        description,
        location,
        city: location,
        dateTime,
        image: image || 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600&auto=format&fit=crop',
        category: 'Outros',
        tickets: tickets.map(t => ({
          name: t.name,
          price: Number(t.price),
          quantity: Number(t.quantity)
        }))
      }
      
      await api.createEvent(eventData)
      
      // Try to reload events after creating new one
      try {
        const eventsResponse = await api.getOrganizerEvents()
        setEvents(eventsResponse.data || [])
      } catch (apiError) {
        console.warn('Could not reload events:', apiError)
        // Add the new event to local state as fallback
        const newEvent: Event = {
          id: Date.now().toString(),
          ...eventData,
          organizerId: JSON.parse(localStorage.getItem('authUser') || '{}').id || 'unknown'
        }
        setEvents(prev => [...prev, newEvent])
      }
      
      // Reset form
      setName(''); setDescription(''); setLocation(''); setDateTime(''); setImage(''); 
      setTickets([{ name: 'Pista', price: 50, quantity: 100 }])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar evento')
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    localStorage.removeItem('authToken')
    localStorage.removeItem('authUser')
    navigate('/organizador/login')
  }

  if (loading) {
    return <div className="text-center py-8">Carregando painel...</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Painel do organizador</h1>
          <p className="text-sm opacity-70">Gerencie seus eventos e acompanhe vendas</p>
        </div>
        <button onClick={logout} className="px-3 py-1 rounded-md border text-sm">Sair</button>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200">
          <p className="text-sm">{error}</p>
        </div>
      )}

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form onSubmit={onSubmit} className="lg:col-span-2 space-y-3 rounded-xl border p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Criar novo evento</h2>
            <Link to="/organizador/novo" className="text-sm px-2 py-1 rounded-md border">Abrir página dedicada</Link>
          </div>
          <input required placeholder="Nome do evento" value={name} onChange={(e)=>setName(e.target.value)} className="w-full rounded-md border px-3 py-2 bg-white dark:bg-gray-900" />
          <textarea required placeholder="Descrição" value={description} onChange={(e)=>setDescription(e.target.value)} className="w-full rounded-md border px-3 py-2 bg-white dark:bg-gray-900" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input required placeholder="Local" value={location} onChange={(e)=>setLocation(e.target.value)} className="rounded-md border px-3 py-2 bg-white dark:bg-gray-900" />
            <input required type="datetime-local" placeholder="Data" value={dateTime} onChange={(e)=>setDateTime(e.target.value)} className="rounded-md border px-3 py-2 bg-white dark:bg-gray-900" />
            </div>
          <input placeholder="URL da imagem (opcional)" value={image} onChange={(e)=>setImage(e.target.value)} className="w-full rounded-md border px-3 py-2 bg-white dark:bg-gray-900" />
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Ingressos</h3>
              <button type="button" onClick={addTicket} className="text-sm px-2 py-1 rounded-md border">Adicionar tipo</button>
            </div>
            {tickets.map((t, idx) => (
              <div key={idx} className="grid grid-cols-3 gap-2">
                <input placeholder="Nome" value={t.name} onChange={(e)=>{
                  const v = e.target.value; setTickets(prev=>prev.map((x,i)=>i===idx?{...x, name:v}:x))
                }} className="rounded-md border px-2 py-1 bg-white dark:bg-gray-900" />
                <input type="number" placeholder="Preço" value={t.price} onChange={(e)=>{
                  const v = Number(e.target.value); setTickets(prev=>prev.map((x,i)=>i===idx?{...x, price:v}:x))
                }} className="rounded-md border px-2 py-1 bg-white dark:bg-gray-900" />
                <input type="number" placeholder="Quantidade" value={t.quantity} onChange={(e)=>{
                  const v = Number(e.target.value); setTickets(prev=>prev.map((x,i)=>i===idx?{...x, quantity:v}:x))
                }} className="rounded-md border px-2 py-1 bg-white dark:bg-gray-900" />
              </div>
            ))}
          </div>
          <button disabled={loading} className="px-4 py-2 rounded-md bg-indigo-600 text-white disabled:opacity-50">
            {loading ? 'Salvando...' : 'Criar evento'}
          </button>
        </form>

        <div className="space-y-4">
          <div className="rounded-xl border p-4">
            <h2 className="font-medium mb-2">Relatório</h2>
            {report ? (
              <ul className="text-sm space-y-1">
                <li>Ingressos vendidos: <span className="font-semibold">{report?.totalSold}</span></li>
                <li>Total arrecadado: <span className="font-semibold">R$ {report?.gross?.toFixed(2)}</span></li>
                <li>Taxas (R$ 2,00 por ingresso): <span className="font-semibold">R$ {report?.fee?.toFixed(2)}</span></li>
                <li>Valor líquido: <span className="font-semibold">R$ {report?.net?.toFixed(2)}</span></li>
              </ul>
            ) : (
              <p className="text-sm opacity-70">Carregando relatório...</p>
            )}
          </div>
          <div className="rounded-xl border p-4">
            <h2 className="font-medium mb-2">Meus eventos</h2>
            <ul className="space-y-2 text-sm">
              {events.length === 0 && <li className="opacity-70">Nenhum evento criado ainda.</li>}
              {events.map((e) => (
                <li key={e.id} className="border rounded-md p-2">
                  <div className="font-medium">{e.name}</div>
                  <div className="opacity-70">{e.location} • {e.dateTime ? new Date(e.dateTime).toLocaleString() : ''}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}

export default DashboardPage


