'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ClienteSearch from '@/components/ventas/ClienteSearch'
import { Cliente } from '@/types/ventas'
import ListaVentasPendientes from '@/components/ventas/ListaVentasPendientes'

export default function GestionarAbonosPage() {
  const router = useRouter()

  const [clienteSeleccionado, setClienteSeleccionado] =
    useState<Cliente | null>(null)

  const volverVentas = () => router.push('/ventas')
  const volverDashboard = () => router.push('/dashboard')

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header alineado con /ventas y /ventas/nueva-venta */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-3">
            <button
              type="button"
              onClick={volverVentas}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
              Ventas
            </button>
            <div className="w-px h-6 bg-slate-200"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a5 5 0 00-10 0v2M5 13h14l-1.5 8h-11L5 13z" /></svg>
              </div>
              <h1 className="text-lg font-bold text-slate-900">
                Gestionar Abonos
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Paso 1: Buscar Cliente */}
        {!clienteSeleccionado && (
          <ClienteSearch
            onClienteSelected={(cliente) => {
              setClienteSeleccionado(cliente)
            }}
            onClienteCreated={(cliente) => {
              setClienteSeleccionado(cliente)
            }}
          />
        )}

        {/* Paso 2: Cliente Seleccionado */}
        {clienteSeleccionado && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Cliente Seleccionado
                  </h2>
                  <p className="text-slate-700 mt-1">
                    {clienteSeleccionado.nombre}
                  </p>
                  <p className="text-sm text-slate-500">
                    {clienteSeleccionado.telefono}
                  </p>
                  {clienteSeleccionado.email && (
                    <p className="text-sm text-slate-500">
                      {clienteSeleccionado.email}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => setClienteSeleccionado(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition-colors"
                >
                  Cambiar Cliente
                </button>
              </div>
            </div>

            {/* Paso 3: Listar ventas pendientes */}
            <ListaVentasPendientes
              clienteId={clienteSeleccionado.id}
            />
          </div>
        )}
      </main>
    </div>
  )
}