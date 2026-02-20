'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { boletaApi } from '@/lib/boletaApi'
import type { BoletaDetail } from '@/types/boleta'

export default function BoletaPrintPage() {
  const params = useParams()
  const router = useRouter()
  const [boleta, setBoleta] = useState<BoletaDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    
    if (!token) {
      router.push('/login')
      return
    }

    fetchBoletaDetail()
  }, [router])

  const fetchBoletaDetail = async () => {
    try {
      setLoading(true)
      const boletaId = params.id as string
      
      if (!boletaId) {
        setError('ID de boleta no proporcionado')
        return
      }

      const response = await boletaApi.getBoletaById(boletaId)
      setBoleta(response.data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los detalles de la boleta')
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  useEffect(() => {
    if (boleta) {
      // Auto-print when page loads
      setTimeout(() => {
        handlePrint()
      }, 1000)
    }
  }, [boleta])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-slate-500">Cargando boleta para impresión...</div>
      </div>
    )
  }

  if (error || !boleta) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-md">
          <h2 className="text-lg font-medium mb-2">Error</h2>
          <p>{error || 'No se encontró la boleta'}</p>
          <button
            onClick={() => window.close()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Print Controls - Hidden when printing */}
      <div className="no-print mb-6 flex justify-center space-x-4">
        <button
          onClick={handlePrint}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Imprimir Boleta
        </button>
        <button
          onClick={() => window.close()}
          className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Cerrar
        </button>
      </div>

      {/* Printable Ticket */}
      <div className="flex justify-center">
        <div className="border-2 border-slate-800 rounded-lg overflow-hidden bg-white" style={{ width: '600px', height: '262px' }}>
          
          {/* Left Section - QR, Barcode, Number */}
          <div className="w-1/3 p-3 flex flex-col justify-between bg-white border-r-2 border-slate-800">
            {/* Top text */}
            <div className="text-xs text-center space-y-1 text-slate-900">
              <p>- Boleta sin jugar no juega</p>
              <p>- 128 días de caducidad</p>
              <p>- Juega hasta que quede en poder del público</p>
            </div>
            
            {/* QR Code */}
            <div className="flex justify-center">
              <div className="bg-white p-1">
                <img
                  src={boleta.qr_url}
                  alt="QR Code"
                  className="w-20 h-20"
                />
              </div>
            </div>
            
            {/* Barcode and Number */}
            <div className="space-y-2">
              <div className="bg-white">
                <img
                  src={`https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(boleta.barcode)}&code=Code128&multiplebarcodes=false&translate-esc=false&unit=Fit&dpi=96&imagetype=Gif&rotation=0&color=%23000000&bgcolor=%23ffffff&qunit=Mm&quiet=0`}
                  alt="Barcode"
                  className="w-full h-8"
                />
              </div>
              <div className="text-center">
                <div className="inline-block border-2 border-slate-800 px-2 py-1">
                  <span className="text-sm font-bold text-slate-900">Num: {boleta.numero.toString().padStart(4, '0')}</span>
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
                <div className="text-lg font-bold text-slate-900 mb-1">{boleta.rifa_nombre}</div>
                <div className="text-slate-800 text-sm">Boleta #{boleta.numero.toString().padStart(4, '0')}</div>
                <div className="mt-1">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    boleta.estado === 'DISPONIBLE' ? 'bg-green-100 text-green-800' :
                    boleta.estado === 'RESERVADA' ? 'bg-yellow-100 text-yellow-800' :
                    boleta.estado === 'CON_PAGO' ? 'bg-blue-100 text-blue-800' :
                    boleta.estado === 'TRANSFERIDA' ? 'bg-purple-100 text-purple-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {boleta.estado === 'DISPONIBLE' ? 'Disponible' :
                     boleta.estado === 'RESERVADA' ? 'Reservada' :
                     boleta.estado === 'CON_PAGO' ? 'Con Pago' :
                     boleta.estado === 'TRANSFERIDA' ? 'Transferida' :
                     boleta.estado}
                  </span>
                </div>
                {boleta.cliente_info && (
                  <div className="mt-2 text-xs text-slate-800">
                    <p className="font-medium">{boleta.cliente_info.nombre}</p>
                    <p className="text-xs">{boleta.cliente_info.identificacion}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information - Hidden when printing */}
      <div className="no-print mt-6 max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-medium text-slate-900 mb-4">Información Adicional</h3>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-slate-600">ID Boleta:</span>
            <p className="font-medium text-slate-900">{boleta.id}</p>
          </div>
          <div>
            <span className="text-slate-600">Código Barras:</span>
            <p className="font-mono text-slate-900">{boleta.barcode}</p>
          </div>
          <div>
            <span className="text-slate-600">Fecha Creación:</span>
            <p className="text-slate-900">{new Date(boleta.created_at).toLocaleString('es-CO')}</p>
          </div>
          <div>
            <span className="text-slate-600">QR URL:</span>
            <p className="text-slate-900 break-all">{boleta.qr_url}</p>
          </div>
        </div>

        {boleta.cliente_info && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <h4 className="font-medium text-slate-900 mb-2">Información del Cliente</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-600">Nombre:</span>
                <p className="text-slate-900">{boleta.cliente_info.nombre}</p>
              </div>
              <div>
                <span className="text-slate-600">Teléfono:</span>
                <p className="text-slate-900">{boleta.cliente_info.telefono}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @media print {
          @page {
            size: auto;
            margin: 0;
          }
          
          body {
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          
          .min-h-screen {
            min-height: auto !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          
          /* Ensure ticket maintains exact dimensions when printing */
          .border-2 {
            border-width: 2pt !important;
          }
          
          /* Fix image scaling for print */
          img {
            max-width: 100% !important;
            max-height: 100% !important;
            object-fit: contain !important;
            page-break-inside: avoid;
          }
          
          /* Ensure proper ticket layout */
          .w-2\\/3 {
            width: 66.666667% !important;
          }
          
          .w-1\\/3 {
            width: 33.333333% !important;
          }
          
          /* Prevent text from wrapping */
          .whitespace-nowrap {
            white-space: nowrap !important;
          }
          
          /* Hide all non-print elements */
          .no-print {
            display: none !important;
          }
          
          /* Ensure proper spacing */
          .space-y-2 > * + * {
            margin-top: 0.5rem !important;
          }
          
          /* Fix barcode and QR code sizing */
          .w-28 {
            width: 7rem !important;
          }
          
          .h-28 {
            height: 7rem !important;
          }
          
          .h-12 {
            height: 3rem !important;
          }
        }
      `}</style>
    </div>
  )
}
