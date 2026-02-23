'use client'

import { useState } from 'react'
import ListaVentasPublicas from '@/components/ventasPublicas/ListaVentasPublicas'
import DetalleVentaPublica from '@/components/ventasPublicas/DetalleVentaPublica'
import EstadisticasVentasPublicas from '@/components/ventasPublicas/EstadisticasVentasPublicas'
import { ventasPublicasApi } from '@/lib/ventasPublicasApi'
import { VentaPublicaDetalle } from '@/types/ventasPublicas'

type Vista = 'lista' | 'detalle' | 'estadisticas'

export default function GestionarVentasPublicasPage() {
  const [vistaActual, setVistaActual] = useState<Vista>('lista')
  const [ventaSeleccionada, setVentaSeleccionada] = useState<VentaPublicaDetalle | null>(null)
  const [filtroEstado, setFiltroEstado] = useState('pendientes')
  const [cargandoDetalle, setCargandoDetalle] = useState(false)
  const [errorDetalle, setErrorDetalle] = useState<string | null>(null)

  const handleSelectVenta = async (ventaId: string) => {
    try {
      setCargandoDetalle(true)
      setErrorDetalle(null)

      const response = await ventasPublicasApi.getDetalleVentaPublica(ventaId)

      if (!response.success) {
        throw new Error(response.message || 'Error cargando detalles')
      }

      setVentaSeleccionada(response.data || null)
      setVistaActual('detalle')
    } catch (err: any) {
      setErrorDetalle(err.message)
    } finally {
      setCargandoDetalle(false)
    }
  }

  const handleBack = () => {
    setVentaSeleccionada(null)
    setVistaActual('lista')
  }

  const handleVentaCancelada = () => {
    handleBack()
  }

  const handleAbonoConfirmado = () => {
    // El componente se recargará automáticamente
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Gestión de Ventas Públicas
              </h1>
              <p className="text-slate-500 mt-1">
                Confirma pagos de clientes desde la web pública
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Tabs de navegación */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              setVistaActual('lista')
              setFiltroEstado('pendientes')
            }}
            className={`px-4 py-2 rounded-xl font-semibold transition-all text-sm ${
              vistaActual === 'lista'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            📋 Ventas Pendientes
          </button>

          <button
            onClick={() => {
              setVistaActual('lista')
              setFiltroEstado('')
            }}
            className={`px-4 py-2 rounded-xl font-semibold transition-all text-sm ${
              vistaActual === 'lista' && filtroEstado === ''
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            📊 Todas las Ventas
          </button>

          <button
            onClick={() => setVistaActual('estadisticas')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all text-sm ${
              vistaActual === 'estadisticas'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            📈 Estadísticas
          </button>
        </div>

        {/* Contenido principal */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:p-8">
          {/* Vista de Lista */}
          {vistaActual === 'lista' && !ventaSeleccionada && (
            <ListaVentasPublicas
              onSelectVenta={handleSelectVenta}
              filtroEstado={filtroEstado}
            />
          )}

          {/* Vista de Detalle */}
          {vistaActual === 'detalle' && ventaSeleccionada && !cargandoDetalle && (
            <DetalleVentaPublica
              venta={ventaSeleccionada}
              onBack={handleBack}
              onVentaCancelada={handleVentaCancelada}
              onAbonoConfirmado={handleAbonoConfirmado}
            />
          )}

          {/* Cargando detalle */}
          {cargandoDetalle && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <p className="text-slate-600 mt-3">Cargando detalles de la venta...</p>
            </div>
          )}

          {/* Error al cargar detalle */}
          {errorDetalle && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700">{errorDetalle}</p>
              <button
                onClick={handleBack}
                className="mt-3 text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Volver a la lista
              </button>
            </div>
          )}

          {/* Vista de Estadísticas */}
          {vistaActual === 'estadisticas' && (
            <EstadisticasVentasPublicas />
          )}
        </div>

        {/* Footer con info de ayuda */}
        <div className="mt-8 bg-indigo-50 rounded-2xl border border-indigo-100 p-4">
          <div className="flex items-start space-x-3">
            <svg
              className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="text-sm font-semibold text-indigo-900">
                💡 Flujo de Confirmación
              </p>
              <p className="text-xs text-indigo-700 mt-1">
                1. Selecciona una venta pendiente • 2. Verifica los datos del cliente y método de pago • 3. Confirma manualmente cada abono cuando identifiques el pago en Nequi/Banco • 4. El sistema actualizará automáticamente el estado
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
