const API_BASE = 'http://localhost:4000'

export type User = {
  id: string
  name: string
  email: string
  role: 'CUSTOMER' | 'ORGANIZER'
}

export type AuthResponse = {
  user: User
  token: string
}

export type Event = {
  id: string
  name: string
  description: string
  location: string
  dateTime: string
  bannerUrl: string
  category: string
  organizerId: string
}

export type PaginatedResponse<T> = {
  count: number
  data: T[]
  success: boolean
}

export type CreateEventRequest = {
  name: string
  description: string
  location: string
  dateTime: string
  image?: string
  category: string
  tickets: Array<{
    name: string
    price: number
    quantity: number
  }>
}

export type TicketType = {
  id: string
  name: string
  price: number
  quantity: number
  eventId: string
}

export type OrderItem = {
  ticketTypeId: string
  quantity: number
}

export type PurchaseRequest = {
  eventId: string
  items: OrderItem[]
}

export type Order = {
  id: string
  eventId: string
  items: Array<{
    ticketTypeId: string
    ticketTypeName: string
    quantity: number
    price: number
  }>
  total: number
  status: string
  createdAt: string
}

export type OrganizerReport = {
  totalSold: number
  gross: number
  fee: number
  net: number
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE) {
    this.baseUrl = baseUrl
  }

  private getAuthHeader(): HeadersInit {
    const token = localStorage.getItem('authToken')
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
        ...options.headers,
      },
      ...options,
    }

    const response = await fetch(url, config)
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erro na requisição' }))
      throw new Error(error.message || `HTTP ${response.status}`)
    }

    return response.json()
  }

  // Auth
  async signup(data: { name: string; email: string; password: string; role: 'CUSTOMER' | 'ORGANIZER' }): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Events
  async getEvents(filters?: { city?: string; category?: string }): Promise<PaginatedResponse<Event>> {
    const params = new URLSearchParams()
    if (filters?.city) params.append('city', filters.city)
    if (filters?.category) params.append('category', filters.category)
    
    return this.request<PaginatedResponse<Event>>(`/events?${params.toString()}`)
  }

  async getEvent(id: string): Promise<Event> {
    return this.request<Event>(`/events/${id}`)
  }

  async createEvent(data: CreateEventRequest): Promise<Event> {
    return this.request<Event>('/events', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getOrganizerEvents(): Promise<PaginatedResponse<Event>> {
    return this.request<PaginatedResponse<Event>>('/events/my')
  }

  async getEventTickets(eventId: string): Promise<TicketType[]> {
    return this.request<TicketType[]>(`/events/${eventId}/tickets`)
  }

  // Orders
  async purchaseTickets(data: PurchaseRequest): Promise<Order> {
    return this.request<Order>('/orders/purchase', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getMyOrders(): Promise<Order[]> {
    return this.request<Order[]>('/orders/my')
  }

  // Reports
  async getOrganizerReport(): Promise<OrganizerReport> {
    return this.request<OrganizerReport>('/organizer/report')
  }
}

export const api = new ApiClient()
