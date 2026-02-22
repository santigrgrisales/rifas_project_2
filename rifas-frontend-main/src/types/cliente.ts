export interface Cliente {
  id: string
  nombre: string
  telefono: string
  email: string
  identificacion: string
  direccion: string
  created_at: string
  updated_at: string
}

export interface ClienteCreateRequest {
  nombre: string
  telefono: string
  email: string
  identificacion: string
  direccion: string
}

export interface ClienteUpdateRequest {
  nombre?: string
  telefono?: string
  email?: string
  direccion?: string
}

export interface ClienteListResponse {
  success: boolean
  data: Cliente[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ClienteResponse {
  success: boolean
  data: Cliente
}

export interface ClienteCreateResponse {
  success: boolean
  message: string
  data: Cliente
}

export interface ApiError {
  error: string
  message: string
  details?: Array<{
    field: string
    message: string
  }>
}
