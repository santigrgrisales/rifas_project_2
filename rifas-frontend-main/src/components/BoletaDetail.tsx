'use client'

import BoletaTicket from './BoletaTicket'
import type { BoletaDetail } from '@/types/boleta'

interface BoletaDetailProps {
  boleta: BoletaDetail
  onPrint?: () => void
}

export default function BoletaDetail({ boleta, onPrint }: BoletaDetailProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount)
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'DISPONIBLE': return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10'
      case 'RESERVADA': return 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/10'
      case 'CON_PAGO': return 'bg-sky-50 text-sky-700 ring-1 ring-sky-600/10'
      case 'TRANSFERIDA': return 'bg-violet-50 text-violet-700 ring-1 ring-violet-600/10'
      case 'ANULADA': return 'bg-red-50 text-red-700 ring-1 ring-red-600/10'
      default: return 'bg-slate-100 text-slate-700'
    }
  }

  const getEstadoLabel = (estado: string) => {
    switch (estado) {
      case 'DISPONIBLE': return 'Disponible'
      case 'RESERVADA': return 'Reservada'
      case 'CON_PAGO': return 'Con Pago'
      case 'TRANSFERIDA': return 'Transferida'
      case 'ANULADA': return 'Anulada'
      default: return estado
    }
  }

  return (
    <div className="space-y-6">
      {/* Ticket Preview */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-900">Vista de Boleta</h3>
          <button
            onClick={onPrint}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all flex items-center gap-2 font-semibold shadow-md shadow-indigo-500/20 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Imprimir
          </button>
        </div>
        
        <BoletaTicket
          qrUrl={boleta.qr_url}
          barcode={boleta.barcode}
          numero={boleta.numero}
          imagenUrl={(boleta as { imagen_url?: string | null }).imagen_url ?? (boleta as { imagenUrl?: string | null }).imagenUrl}
          rifaNombre={boleta.rifa_nombre}
          estado={boleta.estado}
          clienteInfo={boleta.cliente_info}
        />
      </div>

      {/* Detailed Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Información de la Boleta</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Número:</span>
              <span className="text-sm font-medium text-slate-900">#{boleta.numero.toString().padStart(4, '0')}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Estado:</span>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getEstadoColor(boleta.estado)}`}>
                {getEstadoLabel(boleta.estado)}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Rifa:</span>
              <span className="text-sm font-medium text-slate-900">{boleta.rifa_nombre}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Código de Barras:</span>
              <span className="text-sm font-mono text-slate-900">{boleta.barcode}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Fecha Creación:</span>
              <span className="text-sm text-slate-900">{formatDate(boleta.created_at)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Última Actualización:</span>
              <span className="text-sm text-slate-900">{formatDate(boleta.updated_at)}</span>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Información de Cliente</h3>
          
          {boleta.cliente_info ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Nombre:</span>
                <span className="text-sm font-medium text-slate-900">{boleta.cliente_info.nombre}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Identificación:</span>
                <span className="text-sm font-medium text-slate-900">{boleta.cliente_info.identificacion}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Teléfono:</span>
                <span className="text-sm font-medium text-slate-900">{boleta.cliente_info.telefono}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Email:</span>
                <span className="text-sm font-medium text-slate-900">{boleta.cliente_info.email}</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="text-slate-400">
                <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <p className="text-sm text-slate-500">Sin cliente asignado</p>
            </div>
          )}
        </div>

        {/* Sale Information */}
        {boleta.venta_info && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Información de Venta</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">ID Venta:</span>
                <span className="text-sm font-medium text-slate-900">{boleta.venta_info.id}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Fecha Venta:</span>
                <span className="text-sm text-slate-900">{formatDate(boleta.venta_info.fecha_venta)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Total Pagado:</span>
                <span className="text-sm font-medium text-green-600">{formatCurrency(boleta.venta_info.total_pagado)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Saldo Pendiente:</span>
                <span className="text-sm font-medium text-orange-600">{formatCurrency(boleta.venta_info.saldo_pendiente)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Método Pago:</span>
                <span className="text-sm font-medium text-slate-900">{boleta.venta_info.metodo_pago}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Estado Venta:</span>
                <span className="text-sm font-medium text-slate-900">{boleta.venta_info.estado}</span>
              </div>
            </div>
          </div>
        )}

        {/* Seller Information */}
        {boleta.vendedor_info && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Información de Vendedor</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Nombre:</span>
                <span className="text-sm font-medium text-slate-900">{boleta.vendedor_info.nombre}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Email:</span>
                <span className="text-sm font-medium text-slate-900">{boleta.vendedor_info.email}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reservation Information */}
      {boleta.reserva_token && (
        <div className="bg-amber-50/80 rounded-2xl border border-amber-200 p-6">
          <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wider mb-4">Información de Reserva</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-yellow-700">Token de Reserva:</span>
              <p className="font-mono text-sm text-yellow-900 mt-1">{boleta.reserva_token}</p>
            </div>
            
            {boleta.bloqueo_hasta && (
              <div>
                <span className="text-sm text-yellow-700">Bloqueado hasta:</span>
                <p className="text-sm text-yellow-900 mt-1">{formatDate(boleta.bloqueo_hasta)}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
