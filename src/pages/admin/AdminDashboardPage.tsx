import { useEffect, useState } from 'react'
import baseEvents from '../../store/mockEvents'
import { TicketType } from '../../services/api'

type AdminEvent = {
  id: string
  name: string
  description: string
  location: string
  dateTime: string
  image: string
  category: string
  ticketTypes: TicketType[]
}

function AdminDashboardPage() {
  const [ok, setOk] = useState(false)

  // Admin managed stores
  const [locations, setLocations] = useState<string[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [visibleFilters, setVisibleFilters] = useState<string[]>([])
  const [events, setEvents] = useState<AdminEvent[]>([])
  const [users, setUsers] = useState<Array<{ name?: string; email: string }>>([])
  const [organizerEvents, setOrganizerEvents] = useState<AdminEvent[]>([])
  const [hiddenLocations, setHiddenLocations] = useState<string[]>([])
  const [hiddenCategories, setHiddenCategories] = useState<string[]>([])

  // Local inputs
  const [newLocation, setNewLocation] = useState('')
  const [newCategory, setNewCategory] = useState('')

  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem('adminAuth') || 'null')
    setOk(!!admin)

    setLocations(JSON.parse(localStorage.getItem('adminLocations') || '[]'))
    setCategories(JSON.parse(localStorage.getItem('adminCategories') || '[]'))
    // migrate old format (object) -> new array format
    const storedEnabled = localStorage.getItem('adminFiltersEnabled')
    const storedVisible = localStorage.getItem('adminVisibleFilters')
    if (storedVisible) {
      setVisibleFilters(JSON.parse(storedVisible))
    } else if (storedEnabled) {
      try {
        const obj = JSON.parse(storedEnabled) as Record<string, boolean>
        const arr = Object.entries(obj).filter(([,v])=>!!v).map(([k])=>k)
        setVisibleFilters(arr)
        localStorage.setItem('adminVisibleFilters', JSON.stringify(arr))
      } catch {
        const arr = ['city','category','dateRange']
        setVisibleFilters(arr)
        localStorage.setItem('adminVisibleFilters', JSON.stringify(arr))
      }
    } else {
      const arr = ['city','category','dateRange']
      setVisibleFilters(arr)
      localStorage.setItem('adminVisibleFilters', JSON.stringify(arr))
    }
    setEvents(JSON.parse(localStorage.getItem('adminEvents') || '[]'))
    setOrganizerEvents(JSON.parse(localStorage.getItem('myEvents') || '[]'))
    setHiddenLocations(JSON.parse(localStorage.getItem('adminHiddenLocations') || '[]'))
    setHiddenCategories(JSON.parse(localStorage.getItem('adminHiddenCategories') || '[]'))

    const organizers = JSON.parse(localStorage.getItem('organizers') || '[]') as Array<{name?:string; email:string}>
    setUsers(organizers.map(o => ({ name: o.name, email: o.email })))
  }, [])

  function addLocation() {
    if (!newLocation.trim()) return
    const next = Array.from(new Set([...locations, newLocation.trim()]))
    setLocations(next)
    setNewLocation('')
    localStorage.setItem('adminLocations', JSON.stringify(next))
  }
  function removeLocation(loc: string) {
    const next = locations.filter(l => l !== loc)
    setLocations(next)
    localStorage.setItem('adminLocations', JSON.stringify(next))
  }

  function hideLocation(loc: string) {
    const next = Array.from(new Set([...hiddenLocations, loc]))
    setHiddenLocations(next)
    localStorage.setItem('adminHiddenLocations', JSON.stringify(next))
  }
  function unhideLocation(loc: string) {
    const next = hiddenLocations.filter(l => l !== loc)
    setHiddenLocations(next)
    localStorage.setItem('adminHiddenLocations', JSON.stringify(next))
  }

  function addCategory() {
    if (!newCategory.trim()) return
    const next = Array.from(new Set([...categories, newCategory.trim()]))
    setCategories(next)
    setNewCategory('')
    localStorage.setItem('adminCategories', JSON.stringify(next))
  }
  function removeCategory(cat: string) {
    const next = categories.filter(c => c !== cat)
    setCategories(next)
    localStorage.setItem('adminCategories', JSON.stringify(next))
  }

  function hideCategory(cat: string) {
    const next = Array.from(new Set([...hiddenCategories, cat]))
    setHiddenCategories(next)
    localStorage.setItem('adminHiddenCategories', JSON.stringify(next))
  }
  function unhideCategory(cat: string) {
    const next = hiddenCategories.filter(c => c !== cat)
    setHiddenCategories(next)
    localStorage.setItem('adminHiddenCategories', JSON.stringify(next))
  }

  function addVisibleFilter(key: string) {
    const k = key.trim()
    if (!k) return
    const next = Array.from(new Set([...visibleFilters, k]))
    setVisibleFilters(next)
    localStorage.setItem('adminVisibleFilters', JSON.stringify(next))
  }
  function removeVisibleFilter(key: string) {
    const next = visibleFilters.filter(f => f !== key)
    setVisibleFilters(next)
    localStorage.setItem('adminVisibleFilters', JSON.stringify(next))
  }

  function removeEvent(id: string) {
    const next = events.filter(e => e.id !== id)
    setEvents(next)
    localStorage.setItem('adminEvents', JSON.stringify(next))
  }

  function clearAdminAuth() {
    localStorage.removeItem('adminAuth')
    setOk(false)
  }

  function removeOrganizer(email: string) {
    const organizers = JSON.parse(localStorage.getItem('organizers') || '[]') as Array<{name?:string; email:string}>
    const next = organizers.filter(o => o.email !== email)
    localStorage.setItem('organizers', JSON.stringify(next))
    setUsers(next.map(o => ({ name: o.name, email: o.email })))
  }

  if (!ok) {
    return <p className="text-sm">Acesso negado. Faça login em /admin/login</p>
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Admin</h1>
          <p className="text-sm opacity-70">Gerencie localidades, categorias, filtros, eventos e usuários</p>
        </div>
        <button onClick={clearAdminAuth} className="px-3 py-1 rounded-md border text-sm">Sair</button>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border p-4 bg-white dark:bg-gray-800 space-y-3">
          <h2 className="font-medium">Localidades</h2>
          <div className="flex gap-2">
            <input value={newLocation} onChange={(e)=>setNewLocation(e.target.value)} placeholder="Adicionar cidade" className="flex-1 rounded-md border px-3 py-2 bg-white dark:bg-gray-900" />
            <button onClick={addLocation} className="px-3 py-2 rounded-md border">Adicionar</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Cadastradas (admin)</h3>
              <ul className="text-sm space-y-1">
                {locations.map(l => (
                  <li key={l} className="flex items-center justify-between border rounded-md p-2">
                    <span>{l}</span>
                    <div className="flex gap-2">
                      <button onClick={()=>removeLocation(l)} className="text-xs px-2 py-1 rounded-md border">Remover</button>
                      <button onClick={()=>hideLocation(l)} className="text-xs px-2 py-1 rounded-md border">Ocultar</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Existentes (detectadas)</h3>
              <ul className="text-sm space-y-1 max-h-64 overflow-auto">
                {Array.from(new Set([
                  ...events.map(e => e.location.split(',')[0].trim()),
                  ...organizerEvents.map(e => e.location.split(',')[0].trim()),
                  ...baseEvents.map(e => e.location.split(',')[0].trim()),
                ])).map((l) => (
                  <li key={l} className="flex items-center justify-between border rounded-md p-2">
                    <span>{l}</span>
                    <button onClick={()=>hideLocation(l)} className="text-xs px-2 py-1 rounded-md border">Ocultar</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {hiddenLocations.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mt-3">Localidades ocultas</h3>
              <ul className="text-sm space-y-1">
                {hiddenLocations.map(l => (
                  <li key={l} className="flex items-center justify-between border rounded-md p-2">
                    <span>{l}</span>
                    <button onClick={()=>unhideLocation(l)} className="text-xs px-2 py-1 rounded-md border">Reativar</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="rounded-xl border p-4 bg-white dark:bg-gray-800 space-y-3">
          <h2 className="font-medium">Categorias</h2>
          <div className="flex gap-2">
            <input value={newCategory} onChange={(e)=>setNewCategory(e.target.value)} placeholder="Adicionar categoria" className="flex-1 rounded-md border px-3 py-2 bg-white dark:bg-gray-900" />
            <button onClick={addCategory} className="px-3 py-2 rounded-md border">Adicionar</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Cadastradas (admin)</h3>
              <ul className="text-sm space-y-1">
                {categories.map(c => (
                  <li key={c} className="flex items-center justify-between border rounded-md p-2">
                    <span>{c}</span>
                    <div className="flex gap-2">
                      <button onClick={()=>removeCategory(c)} className="text-xs px-2 py-1 rounded-md border">Remover</button>
                      <button onClick={()=>hideCategory(c)} className="text-xs px-2 py-1 rounded-md border">Ocultar</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Existentes (detectadas)</h3>
              <ul className="text-sm space-y-1 max-h-64 overflow-auto">
                {Array.from(new Set([
                  ...events.map(e => e.category),
                  ...organizerEvents.map(e => e.category),
                  ...baseEvents.map(e => e.category),
                ])).map((c) => (
                  <li key={c} className="flex items-center justify-between border rounded-md p-2">
                    <span>{c}</span>
                    <button onClick={()=>hideCategory(c)} className="text-xs px-2 py-1 rounded-md border">Ocultar</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {hiddenCategories.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mt-3">Categorias ocultas</h3>
              <ul className="text-sm space-y-1">
                {hiddenCategories.map(c => (
                  <li key={c} className="flex items-center justify-between border rounded-md p-2">
                    <span>{c}</span>
                    <button onClick={()=>unhideCategory(c)} className="text-xs px-2 py-1 rounded-md border">Reativar</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border p-4 bg-white dark:bg-gray-800 space-y-3">
          <h2 className="font-medium">Filtros visíveis</h2>
          <div className="flex gap-2">
            <input id="newFilterInput" placeholder="Ex.: city, category, dateRange" className="flex-1 rounded-md border px-3 py-2 bg-white dark:bg-gray-900" />
            <button onClick={()=>{
              const el = document.getElementById('newFilterInput') as HTMLInputElement | null
              addVisibleFilter(el?.value || '')
              if (el) el.value = ''
            }} className="px-3 py-2 rounded-md border">Adicionar</button>
          </div>
          <ul className="flex flex-wrap gap-2 text-sm">
            {visibleFilters.map(f => (
              <li key={f} className="flex items-center gap-2 border rounded-md px-2 py-1">
                <span>{f}</span>
                <button onClick={()=>removeVisibleFilter(f)} className="text-xs px-2 py-0.5 rounded-md border">Remover</button>
              </li>
            ))}
          </ul>
          <p className="text-xs opacity-70">Suportados atualmente: city, category, dateRange.</p>
        </div>

        <div className="rounded-xl border p-4 bg-white dark:bg-gray-800 space-y-3">
          <h2 className="font-medium">Usuários (organizadores)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="p-2">Nome</th>
                  <th className="p-2">E-mail</th>
                  <th className="p-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.email} className="border-t">
                    <td className="p-2">{u.name || '-'}</td>
                    <td className="p-2">{u.email}</td>
                    <td className="p-2">
                      <button onClick={()=>removeOrganizer(u.email)} className="text-xs px-2 py-1 rounded-md border">Remover</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="rounded-xl border p-4 bg-white dark:bg-gray-800 space-y-3">
        <h2 className="font-medium">Eventos globais</h2>
        <p className="text-sm opacity-70">Adicionar/remover eventos que aparecem para todos os usuários.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="p-2">Nome</th>
                <th className="p-2">Local</th>
                <th className="p-2">Data</th>
                <th className="p-2">Categoria</th>
                <th className="p-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {events.map(ev => (
                <tr key={ev.id} className="border-t">
                  <td className="p-2">{ev.name}</td>
                  <td className="p-2">{ev.location}</td>
                  <td className="p-2">{new Date(ev.dateTime).toLocaleString()}</td>
                  <td className="p-2">{ev.category}</td>
                  <td className="p-2">
                    <button onClick={()=>removeEvent(ev.id)} className="text-xs px-2 py-1 rounded-md border">Remover</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-xl border p-4 bg-white dark:bg-gray-800 space-y-3">
        <h2 className="font-medium">Todos os eventos</h2>
        <p className="text-sm opacity-70">Lista consolidada de eventos (Admin, Organizadores e Mock).</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="p-2">Origem</th>
                <th className="p-2">Nome</th>
                <th className="p-2">Local</th>
                <th className="p-2">Data</th>
                <th className="p-2">Categoria</th>
              </tr>
            </thead>
            <tbody>
              {([...events, ...organizerEvents, ...baseEvents] as any[]).map((ev: any) => {
                const origin = events.some(e => e.id === ev.id)
                  ? 'Admin'
                  : organizerEvents.some(e => e.id === ev.id)
                    ? 'Organizador'
                    : 'Mock'
                return (
                  <tr key={`${origin}-${ev.id}`} className="border-t">
                    <td className="p-2">{origin}</td>
                    <td className="p-2">{ev.name}</td>
                    <td className="p-2">{ev.location}</td>
                    <td className="p-2">{new Date(ev.dateTime).toLocaleString()}</td>
                    <td className="p-2">{ev.category}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default AdminDashboardPage


