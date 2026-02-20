import {
  ApiResponse,
  BoletaDisponible,
  BoletaBloqueada,
  BloqueoVerificacion,
  Cliente,
  VentaRequest,
  VentaResponse,
  RifaStats
} from '@/types/ventas'

class VentasApiService {
  private baseUrl =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('token')
        : null

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }

    if (token) {
      ;(headers as Record<string, string>)['Authorization'] =
        `Bearer ${token}`
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers
    })

    let data

    try {
      data = await response.json()
    } catch {
      throw new Error(
        `No se pudo parsear JSON. Status: ${response.status}`
      )
    }

    if (!response.ok) {
      const serverMessage =
        data?.message || data?.error || response.statusText
      throw new Error(
        `API Error ${response.status}: ${serverMessage}`
      )
    }

    return data
  }

  // ---------------- BOLETAS ----------------

  async getBoletasDisponibles(rifaId: string) {
    return this.request<any[]>(`/boletas/rifa/${rifaId}`)
  }

  async bloquearBoleta(boletaId: string, tiempoBloqueo = 15) {
    return this.request<BoletaBloqueada>(
      `/boletas/${boletaId}/block`,
      {
        method: 'POST',
        body: JSON.stringify({
          tiempo_bloqueo: tiempoBloqueo
        })
      }
    )
  }

  async verificarBloqueo(
    boletaId: string,
    reservaToken: string
  ) {
    return this.request<BloqueoVerificacion>(
      `/boletas/${boletaId}/check-block?reserva_token=${reservaToken}`
    )
  }

  async desbloquearBoleta(
    boletaId: string,
    reservaToken: string
  ) {
    return this.request<{ boleta_id: string }>(
      `/boletas/${boletaId}/unblock`,
      {
        method: 'POST',
        body: JSON.stringify({
          reserva_token: reservaToken
        })
      }
    )
  }

  async actualizarEstadoBoleta(
    boletaId: string,
    estado: string,
    clienteId?: string,
    ventaId?: string
  ) {
    return this.request<any>(`/boletas/${boletaId}`, {
      method: 'PUT',
      body: JSON.stringify({
        estado,
        cliente_id: clienteId,
        venta_id: ventaId
      })
    })
  }

  async getBoletaDetalle(boletaId: string) {
    return this.request<any>(`/boletas/${boletaId}`)
  }

  // ---------------- VENTAS ----------------

  async crearVenta(ventaData: VentaRequest) {
    return this.request<VentaResponse>(`/ventas`, {
      method: 'POST',
      body: JSON.stringify(ventaData)
    })
  }

  async getVentasPorRifa(rifaId: string) {
    return this.request<VentaResponse[]>(
      `/ventas/rifa/${rifaId}`
    )
  }

  async getRifaStats(rifaId: string) {
    return this.request<RifaStats>(
      `/boletas/rifa/${rifaId}/stats`
    )
  }

  async getVentasPorCliente(clienteId: string) {
  return this.request<
    {
      id: string
      monto_total: number
      total_pagado: number
      saldo_pendiente: number
      estado: string
      created_at: string
    }[]
  >(`/ventas/cliente/${clienteId}`)
}

  // ---------------- CLIENTES ----------------

  async buscarClientes(query: string) {
    return this.request<{ clientes: Cliente[] }>(
      `/clientes/search?q=${encodeURIComponent(query)}`
    )
  }

  async buscarClientePorCedula(cedula: string) {
    return this.request<Cliente>(
      `/clientes/cedula/${cedula}`
    )
  }

  async crearCliente(cliente: Cliente) {
    return this.request<{ cliente: Cliente }>(
      `/clientes`,
      {
        method: 'POST',
        body: JSON.stringify(cliente)
      }
    )
  }

  async getClienteById(clienteId: string) {
    return this.request<Cliente>(
      `/clientes/${clienteId}`
    )
  }

  async actualizarCliente(
    clienteId: string,
    cliente: Partial<Cliente>
  ) {
    return this.request<Cliente>(
      `/clientes/${clienteId}`,
      {
        method: 'PUT',
        body: JSON.stringify(cliente)
      }
    )
  }

  // ---------------- BLOQUEO PERIÓDICO ----------------

async verificarBloqueoPeriodico(
  boletaId: string,
  reservaToken: string,
  callback: (valid: boolean) => void,
  intervalo: number = 30000
): Promise<NodeJS.Timeout> {

  const intervalId = setInterval(async () => {
    try {
      const response = await this.verificarBloqueo(
        boletaId,
        reservaToken
      )

      const isValid =
        response.data.valid && !response.data.expired

      callback(isValid)

      if (!isValid) {
        clearInterval(intervalId)
      }

    } catch (error: any) {
      console.error('Error verificando bloqueo:', error)

      // 🚨 SI ES 404 → DETENER LOOP
      if (error.message.includes('404')) {
        clearInterval(intervalId)
      }

      callback(false)
    }
  }, intervalo)

  return intervalId
}


async liberarBloqueosMultiples(
  boletas: { id: string; reserva_token: string }[]
) {
  return this.request(`/boletas/unblock-multiple`, {
    method: 'POST',
    body: JSON.stringify({ boletas })
  })
}
  // ---------------- BUSCAR VENTA Pagina Gestionar ----------------

  async buscarVenta(query: string) {
    return this.request<VentaResponse[]>(
      `/ventas/search?q=${encodeURIComponent(query)}`
    )
  }

  async getVentaById(ventaId: string) {
    return this.request<VentaResponse>(
      `/ventas/${ventaId}`
    )
  }

  // ---------------- ABONOS ----------------

  async registrarAbono(
    ventaId: string,
    data: { monto: number; metodo_pago?: string }
  ) {
    return this.request<{
      message: string
      venta: VentaResponse
    }>(`/ventas/${ventaId}/abonos`, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

}

export const ventasApi = new VentasApiService()
