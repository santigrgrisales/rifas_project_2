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
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 font-medium transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                Dashboard
              </button>
              <div className="w-px h-6 bg-slate-200"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-sky-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <h1 className="text-lg font-bold text-slate-900">Clientes</h1>
              </div>
            </div>
            <button
              onClick={handleCreateCliente}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-4 py-2 rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all text-sm font-semibold shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/25"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
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
