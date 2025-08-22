import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api, Event, TicketType } from '../../services/api'

function EventPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState<Event | null>(null)
  const [tickets, setTickets] = useState<TicketType[]>([])
  const [selected, setSelected] = useState<TicketType | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadEvent() {
      if (!id) return
      try {
        setLoading(true)
        const [eventData] = await Promise.all([
          api.getEvent(id),
          api.getEventTickets(id)
        ])
        setEvent(eventData)
        setTickets(eventData.ticketTypes || [])
        if (eventData.ticketTypes.length > 0) {
          setSelected(eventData.ticketTypes[0])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar evento')
      } finally {
        setLoading(false)
      }
    }
    loadEvent()
  }, [id])

  function onBuy() {
    if (!selected || !event) return
    const order = {
      eventId: event.id,
      items: [{ ticketTypeId: selected.id, quantity }]
    }
    localStorage.setItem('checkout', JSON.stringify(order))
    navigate('/checkout')
  }

  if (loading) {
    return <div className="text-center py-8">Carregando evento...</div>
  }

  if (error || !event) {
    return <p className="text-sm text-red-600">{error || 'Evento não encontrado.'}</p>
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden">
        <img src={event.bannerUrl} alt={event.name} className="w-full max-h-80 object-cover" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h1 className="text-2xl font-semibold">{event.name}</h1>
          <p className="opacity-80">{event.description}</p>
          <div className="text-sm opacity-70">{event.location} • {new Date(event.dateTime).toLocaleString()} • {event.category}</div>
        </div>
        <div className="space-y-3">
          <h3 className="font-medium">Ingressos</h3>
          <div className="space-y-2">
            {tickets.map((t) => (
              <button key={t.id} onClick={() => setSelected(t)} className={`w-full text-left p-3 rounded-md border hover:bg-gray-50 dark:hover:bg-gray-800 ${selected?.id===t.id? 'ring-2 ring-indigo-500 border-indigo-500' : ''}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{t.name}</div>
                    <div className="text-xs opacity-70">Qtd. disponível: {t.quantityTotal}</div>
                  </div>
                  <div className="font-semibold">R$ {Number(t.price).toFixed(2)}</div>
                </div>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm opacity-80">Quantidade</label>
            <input type="number" min={1} value={quantity} onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))} className="w-20 rounded-md border px-2 py-1 bg-white dark:bg-gray-900" />
          </div>
          <button disabled={!selected} onClick={onBuy} className="w-full px-4 py-2 rounded-md bg-indigo-600 text-white disabled:opacity-50">Comprar ingresso</button>
        </div>
      </div>
    </div>
  )
}

export default EventPage


