import { FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, CreateEventRequest } from '../../services/api'

type TicketInput = { id?: string; name: string; price: number; quantity: number }

function NewEventPage() {
  const navigate = useNavigate()
  const [authed, setAuthed] = useState<boolean>(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [dateTime, setDateTime] = useState('')
  const [image, setImage] = useState('')
  const [category, setCategory] = useState('')
  const [tickets, setTickets] = useState<TicketInput[]>([{ name: 'Pista', price: 50, quantity: 100 }])

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    const user = JSON.parse(localStorage.getItem('authUser') || 'null')
    if (!token || !user || user.role !== 'ORGANIZER') {
      navigate('/organizador/login')
    } else {
      setAuthed(true)
    }
  }, [navigate])

  function addTicket() {
    setTickets(prev => [...prev, { name: '', price: 0, quantity: 0 }])
  }

  function removeTicket(idx: number) {
    setTickets(prev => prev.filter((_, i) => i !== idx))
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    
    if (!authed) return
    
    try {
      setLoading(true)
      setError('')
      
      const eventData: CreateEventRequest = {
        name,
        description,
        location,
        dateTime: dateTime,
        bannerUrl: image || 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600&auto=format&fit=crop',
        category: category || 'Outros',
        ticketTypes: tickets.map(t => ({
          name: t.name,
          price: Number(t.price),
          quantityTotal: Number(t.quantity)
        }))
      }
      
      await api.createEvent(eventData)
      navigate('/organizador/painel')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar evento')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Novo evento</h1>
        <p className="text-sm opacity-70">Preencha os dados do seu evento</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 rounded-xl border p-4 bg-white dark:bg-gray-800">
        {error && <div className="text-red-600 text-sm">{error}</div>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input required placeholder="Nome do evento" value={name} onChange={(e)=>setName(e.target.value)} className="rounded-md border px-3 py-2 bg-white dark:bg-gray-900" />
          <input required placeholder="Categoria (ex.: Música, Tecnologia)" value={category} onChange={(e)=>setCategory(e.target.value)} className="rounded-md border px-3 py-2 bg-white dark:bg-gray-900" />
          <input required placeholder="Local (Cidade, UF)" value={location} onChange={(e)=>setLocation(e.target.value)} className="rounded-md border px-3 py-2 bg-white dark:bg-gray-900" />
          <input required type="datetime-local" placeholder="Data" value={dateTime} onChange={(e)=>setDateTime(e.target.value)} className="rounded-md border px-3 py-2 bg-white dark:bg-gray-900" />
        </div>
        <textarea required placeholder="Descrição" value={description} onChange={(e)=>setDescription(e.target.value)} className="w-full rounded-md border px-3 py-2 bg-white dark:bg-gray-900" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
          <input placeholder="URL da imagem (opcional)" value={image} onChange={(e)=>setImage(e.target.value)} className="rounded-md border px-3 py-2 bg-white dark:bg-gray-900" />
          {image && <img src={image} alt="Pré-visualização" className="h-24 w-full object-cover rounded-md border" />}
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Ingressos</h3>
            <button type="button" onClick={addTicket} className="text-sm px-2 py-1 rounded-md border">Adicionar tipo</button>
          </div>
          {tickets.map((t, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-2 items-center">
              <input placeholder="Nome" value={t.name} onChange={(e)=>{
                const v = e.target.value; setTickets(prev=>prev.map((x,i)=>i===idx?{...x, name:v}:x))
              }} className="col-span-4 rounded-md border px-2 py-1 bg-white dark:bg-gray-900" />
              <input type="number" min={0} placeholder="Preço" value={t.price} onChange={(e)=>{
                const v = Number(e.target.value); setTickets(prev=>prev.map((x,i)=>i===idx?{...x, price:v}:x))
              }} className="col-span-3 rounded-md border px-2 py-1 bg-white dark:bg-gray-900" />
              <input type="number" min={0} placeholder="Quantidade" value={t.quantity} onChange={(e)=>{
                const v = Number(e.target.value); setTickets(prev=>prev.map((x,i)=>i===idx?{...x, quantity:v}:x))
              }} className="col-span-3 rounded-md border px-2 py-1 bg-white dark:bg-gray-900" />
              <button type="button" onClick={()=>removeTicket(idx)} className="col-span-2 text-sm px-2 py-1 rounded-md border">Remover</button>
            </div>
          ))}
        </div>
        <div className="flex gap-2 justify-end">
          <button type="button" onClick={()=>navigate('/organizador/painel')} className="px-4 py-2 rounded-md border">Cancelar</button>
          <button disabled={loading} className="px-4 py-2 rounded-md bg-indigo-600 text-white disabled:opacity-50">
            {loading ? 'Salvando...' : 'Salvar evento'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default NewEventPage


