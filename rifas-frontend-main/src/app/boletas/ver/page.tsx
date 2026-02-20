'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { boletaApi } from '@/lib/boletaApi'
import { Boleta, BoletaListResponse } from '@/types/boleta'
import { Rifa } from '@/types/rifa'
import { rifaApi } from '@/lib/rifaApi'
import BoletaList from '@/components/BoletaList'

export default function VerBoletasPage() {
  const [boletas, setBoletas] = useState<Boleta[]>([])
  const [rifas, setRifas] = useState<Rifa[]>([])
  const [selectedRifa, setSelectedRifa] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/login')
      return
    }

    try {
      const user = JSON.parse(userData)
      setUserRole(user.rol)
      
      // Check if user has SUPER_ADMIN role
      if (user.rol !== 'SUPER_ADMIN') {
        setError('No tienes permisos para acceder a este módulo')
        setLoading(false)
        return
      }
      
      fetchRifas()
    } catch (error) {
      router.push('/login')
    }
  }, [router])

  const fetchRifas = async () => {
    try {
      const response = await rifaApi.getRifas()
      setRifas(response.data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar rifas')
    } finally {
      setLoading(false)
    }
  }

  const fetchBoletas = async (rifaId: string) => {
    if (!rifaId) return
    
    try {
      setLoading(true)
      const response: BoletaListResponse = await boletaApi.getBoletasByRifa(rifaId)
      setBoletas(response.data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar boletas')
    } finally {
      setLoading(false)
    }
  }

  const handleRifaChange = (rifaId: string) => {
    setSelectedRifa(rifaId)
    fetchBoletas(rifaId)
  }

  if (userRole === 'SUPER_ADMIN' && error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-md">
          {error}
        </div>
      </div>
    )
  }

  if (userRole && userRole !== 'SUPER_ADMIN') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-6 py-4 rounded-lg max-w-md">
          <h2 className="text-lg font-medium mb-2">Acceso Restringido</h2>
          <p>Este módulo solo está disponible para usuarios con rol SUPER_ADMIN</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (loading && rifas.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/boletas')}
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                ← Boletas
              </button>
              <h1 className="text-2xl font-light text-slate-900">Ver Boletas</h1>
            </div>
            <button
              onClick={() => router.push('/boletas/crear')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Crear Boletas
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
          <label htmlFor="rifa" className="block text-sm font-medium text-slate-700 mb-2">
            Seleccionar Rifa
          </label>
          <select
            id="rifa"
            value={selectedRifa}
            onChange={(e) => handleRifaChange(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none text-slate-900 bg-white"
          >
            <option value="">Selecciona una rifa...</option>
            {rifas.map((rifa) => (
              <option key={rifa.id} value={rifa.id}>
                {rifa.nombre} ({rifa.estado})
              </option>
            ))}
          </select>
        </div>

        {selectedRifa && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-medium text-slate-900">
                    {rifas.find(r => r.id === selectedRifa)?.nombre}
                  </h2>
                  <p className="text-sm text-slate-600">
                    Estado: <span className="font-medium">{rifas.find(r => r.id === selectedRifa)?.estado}</span>
                  </p>
                </div>
                <div className="mt-2 sm:mt-0 text-right">
                  <p className="text-sm text-slate-600">
                    Total de boletas: <span className="font-medium text-slate-900">{boletas.length}</span>
                  </p>
                </div>
              </div>
            </div>

            <BoletaList
              boletas={boletas}
              loading={loading}
            />
          </div>
        )}

        {!selectedRifa && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
            <div className="text-slate-500">
              <div className="text-lg mb-2">Selecciona una rifa</div>
              <div className="text-sm">Para ver las boletas disponibles</div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
