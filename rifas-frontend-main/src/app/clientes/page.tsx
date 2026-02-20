'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { clienteApi } from '@/lib/clienteApi'
import { Cliente, ClienteListResponse } from '@/types/cliente'
import ClienteList from '@/components/ClienteList'
import ClienteForm from '@/components/ClienteForm'

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    fetchClientes()
  }, [router])

  const fetchClientes = async (page: number = 1, search: string = '') => {
    try {
      setLoading(true)
      const response: ClienteListResponse = await clienteApi.getClientes(page, pagination.limit, search)
      setClientes(response.data)
      setPagination(response.pagination)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar clientes')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCliente = () => {
    setEditingCliente(null)
    setShowForm(true)
  }

  const handleEditCliente = (cliente: Cliente) => {
    setEditingCliente(cliente)
    setShowForm(true)
  }

  const handleDeleteCliente = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      return
    }

    try {
      await clienteApi.deleteCliente(id)
      fetchClientes(pagination.page)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar cliente')
    }
  }

  const handleFormSubmit = async (clienteData: any) => {
    try {
      if (editingCliente) {
        await clienteApi.updateCliente(editingCliente.id, clienteData)
      } else {
        await clienteApi.createCliente(clienteData)
      }
      setShowForm(false)
      setEditingCliente(null)
      fetchClientes(pagination.page)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar cliente')
    }
  }

  const handleSearch = (search: string) => {
    fetchClientes(1, search)
  }

  const handlePageChange = (page: number) => {
    fetchClientes(page)
  }

  if (loading && clientes.length === 0) {
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
                onClick={() => router.push('/dashboard')}
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                ← Dashboard
              </button>
              <h1 className="text-2xl font-light text-slate-900">Clientes</h1>
            </div>
            <button
              onClick={handleCreateCliente}
              className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Nuevo Cliente
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

        {showForm ? (
          <ClienteForm
            cliente={editingCliente}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setShowForm(false)
              setEditingCliente(null)
            }}
          />
        ) : (
          <ClienteList
            clientes={clientes}
            pagination={pagination}
            onEdit={handleEditCliente}
            onDelete={handleDeleteCliente}
            onSearch={handleSearch}
            onPageChange={handlePageChange}
            loading={loading}
          />
        )}
      </main>
    </div>
  )
}
