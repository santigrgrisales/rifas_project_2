'use client'

import { useState } from 'react'
import type { BoletaDetail } from '@/types/boleta'

interface BoletaDetailProps {
  boleta: BoletaDetail
  onPrint?: () => void
}

export default function BoletaDetail({ boleta, onPrint }: BoletaDetailProps) {
  const [imageError, setImageError] = useState(false)
  
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
      case 'DISPONIBLE': return 'bg-green-100 text-green-800'
      case 'RESERVADA': return 'bg-yellow-100 text-yellow-800'
      case 'CON_PAGO': return 'bg-blue-100 text-blue-800'
      case 'TRANSFERIDA': return 'bg-purple-100 text-purple-800'
      case 'ANULADA': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
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
      <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-slate-900">Vista de Boleta</h3>
          <button
            onClick={onPrint}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Imprimir
          </button>
        </div>
        
        {/* Ticket Layout - Exact design from image */}
        <div className="flex border-2 border-slate-800 rounded-lg overflow-hidden bg-white mx-auto" style={{ width: '800px', height: '350px' }}>
          
          {/* Left Section - QR, Barcode, Number */}
          <div className="w-1/3 p-4 flex flex-col justify-between bg-white border-r-2 border-slate-800">
            {/* Top text */}
            <div className="text-xs text-center space-y-1 text-slate-900">
              <p>- Boleta sin jugar no juega</p>
              <p>- 128 días de caducidad</p>
              <p>- Juega hasta que quede en poder del público</p>
            </div>
            
            {/* QR Code */}
            <div className="flex justify-center">
              <div className="bg-white p-2 border border-slate-300">
                <img
                  src={boleta.qr_url}
                  alt="QR Code"
                  className="w-28 h-28"
                />
              </div>
            </div>
            
            {/* Barcode and Number */}
            <div className="space-y-2">
              <div className="bg-white">
                <img
                  src={`https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(boleta.barcode)}&code=Code128&multiplebarcodes=false&translate-esc=false&unit=Fit&dpi=96&imagetype=Gif&rotation=0&color=%23000000&bgcolor=%23ffffff&qunit=Mm&quiet=0`}
                  alt="Barcode"
                  className="w-full h-12"
                />
              </div>
              <div className="text-center">
                <div className="inline-block border-2 border-slate-800 px-3 py-1">
                  <span className="text-lg font-bold text-slate-900">Num: {boleta.numero.toString().padStart(4, '0')}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Section - Template Image */}
          <div className="w-2/3 relative">
            {boleta.imagen_url ? (
              <img
                src={boleta.imagen_url}
                alt={`Boleta ${boleta.numero}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to gradient if image fails to load
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  target.nextElementSibling?.classList.remove('hidden')
                }}
              />
            ) : null}
            
            {/* Fallback gradient when no image or image fails to load */}
            <div className={`w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center ${boleta.imagen_url ? 'hidden' : ''}`}>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900 mb-2">{boleta.rifa_nombre}</div>
                <div className="text-slate-800">Boleta #{boleta.numero.toString().padStart(4, '0')}</div>
                <div className="mt-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getEstadoColor(boleta.estado)}`}>
                    {getEstadoLabel(boleta.estado)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-medium text-slate-900 mb-4">Información de la Boleta</h3>
          
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
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-medium text-slate-900 mb-4">Información de Cliente</h3>
          
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
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-medium text-slate-900 mb-4">Información de Venta</h3>
            
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
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-medium text-slate-900 mb-4">Información de Vendedor</h3>
            
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
        <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-6">
          <h3 className="text-lg font-medium text-yellow-900 mb-4">Información de Reserva</h3>
          
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
