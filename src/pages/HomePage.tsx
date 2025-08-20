import { Link } from 'react-router-dom'
import { useMemo, useState, useEffect } from 'react'
import { api, Event } from '../services/api'

function HomePage() {
  const [city, setCity] = useState('')
  const [category, setCategory] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const adminLocations = useMemo(() => JSON.parse(localStorage.getItem('adminLocations') || '[]') as string[], [])
  const adminCategories = useMemo(() => JSON.parse(localStorage.getItem('adminCategories') || '[]') as string[], [])
  const visibleFilters = useMemo(() => JSON.parse(localStorage.getItem('adminVisibleFilters') || '["city","category","dateRange"]'), [])
  const hiddenLocations = useMemo(() => JSON.parse(localStorage.getItem('adminHiddenLocations') || '[]') as string[], [])
  const hiddenCategories = useMemo(() => JSON.parse(localStorage.getItem('adminHiddenCategories') || '[]') as string[], [])

  const cities = useMemo(() => {
    const base = Array.from(new Set(events.map(e => e.location.split(',')[0].trim())))
    return Array.from(new Set([...base, ...adminLocations]))
  }, [adminLocations, events])

  const categories = useMemo(() => {
    const base = Array.from(new Set(events.map(e => e.category)))
    return Array.from(new Set([...base, ...adminCategories]))
  }, [adminCategories, events])

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true)
        const filters: { city?: string; category?: string } = {}
        if (city) filters.city = city
        if (category) filters.category = category
        const response = await api.getEvents(filters)
        setEvents(response.data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar eventos')
      } finally {
        setLoading(false)
      }
    }
    loadEvents()
  }, [city, category])

  const filtered = useMemo(() => {
    return events.filter(e => {
      const d = new Date(e.date).getTime()
      const fromOk = dateFrom ? d >= new Date(dateFrom).getTime() : true
      const toOk = dateTo ? d <= new Date(dateTo).getTime() : true
      const cityName = e.location.split(',')[0].trim()
      const notHiddenCity = !hiddenLocations.includes(cityName)
      const notHiddenCategory = !hiddenCategories.includes(e.category)
      return fromOk && toOk && notHiddenCity && notHiddenCategory
    })
  }, [events, dateFrom, dateTo, hiddenLocations, hiddenCategories])

  if (loading) {
    return <div className="text-center py-8">Carregando eventos...</div>
  }

  if (error) {
    return <div className="text-red-600 text-center py-8">{error}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Eventos</h1>
          <p className="text-sm opacity-70">Encontre e compre seus ingressos</p>
        </div>
      </div>
      <div className="rounded-xl border p-4 bg-white dark:bg-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {visibleFilters.includes('city') && (<div>
            <label className="text-xs opacity-70">Cidade</label>
            <input list="cities" value={city} onChange={(e)=>setCity(e.target.value)} placeholder="Ex.: São Paulo" className="w-full rounded-md border px-3 py-2 bg-white dark:bg-gray-900" />
            <datalist id="cities">
              {cities.map(c => <option key={c} value={c} />)}
            </datalist>
          </div>)}
          {visibleFilters.includes('category') && (<div>
            <label className="text-xs opacity-70">Categoria</label>
            <select value={category} onChange={(e)=>setCategory(e.target.value)} className="w-full rounded-md border px-3 py-2 bg-white dark:bg-gray-900">
              <option value="">Todas</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>)}
          {visibleFilters.includes('dateRange') && (<div>
            <label className="text-xs opacity-70">De</label>
            <input type="date" value={dateFrom} onChange={(e)=>setDateFrom(e.target.value)} className="w-full rounded-md border px-3 py-2 bg-white dark:bg-gray-900" />
          </div>)}
          {visibleFilters.includes('dateRange') && (<div>
            <label className="text-xs opacity-70">Até</label>
            <input type="date" value={dateTo} onChange={(e)=>setDateTo(e.target.value)} className="w-full rounded-md border px-3 py-2 bg-white dark:bg-gray-900" />
          </div>)}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((ev) => (
          <div key={ev.id} className="rounded-xl border bg-white dark:bg-gray-800 overflow-hidden shadow-sm">
            <img src={ev.image} alt={ev.name} className="h-40 w-full object-cover" />
            <div className="p-4 space-y-2">
              <h3 className="font-medium">{ev.name}</h3>
              <p className="text-xs opacity-70">{ev.category}</p>
              <p className="text-sm opacity-70">{ev.location} • {new Date(ev.date).toLocaleDateString()}</p>
              <Link to={`/evento/${ev.id}`} className="inline-block mt-2 px-4 py-2 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700">Ver mais</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HomePage


