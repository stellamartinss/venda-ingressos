export type TicketType = {
  id: string
  name: string
  price: number
  quantity: number
}

export type EventItem = {
  id: string
  name: string
  description: string
  location: string
  dateTime: string
  bannerUrl: string
  category: string
  ticketTypes: TicketType[]
}

const events: EventItem[] = [
  {
    id: '1',
    name: 'Festival de Música Urbana',
    description: 'O maior festival de música urbana com artistas nacionais e internacionais.',
    location: 'São Paulo, SP',
    dateTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString(),
    bannerUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1600&auto=format&fit=crop',
    category: 'Música',
    ticketTypes: [
      { id: 't1', name: 'Pista', price: 80, quantity: 200 },
      { id: 't2', name: 'Camarote', price: 180, quantity: 50 },
    ],
  },
  {
    id: '2',
    name: 'Conferência de Tecnologia',
    description: 'Novidades em IA, Cloud e DevTools com palestrantes renomados.',
    location: 'Belo Horizonte, MG',
    dateTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
    bannerUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1600&auto=format&fit=crop',
    category: 'Tecnologia',
    ticketTypes: [
      { id: 't1', name: 'Lote 1', price: 120, quantity: 150 },
      { id: 't2', name: 'Estudante', price: 60, quantity: 100 },
    ],
  },
  {
    id: '3',
    name: 'Mostra de Cinema Independente',
    description: 'Sessões especiais com diretores e debates.',
    location: 'Curitiba, PR',
    dateTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45).toISOString(),
    bannerUrl: 'https://images.unsplash.com/photo-1497015289639-54688650d173?q=80&w=1600&auto=format&fit=crop',
    category: 'Cinema',
    ticketTypes: [
      { id: 't1', name: 'Inteira', price: 40, quantity: 100 },
      { id: 't2', name: 'Meia', price: 20, quantity: 100 },
    ],
  },
]

export default events


