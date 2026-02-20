'use client'

import { useState } from 'react'

interface BoletaPreviewProps {
  qrBaseUrl: string
  imagenUrl: string
  diseñoTemplate: string
  rifaId: string
  boletaNumero: number
  barcode: string
}

export default function BoletaPreview({ 
  qrBaseUrl, 
  imagenUrl, 
  diseñoTemplate, 
  rifaId, 
  boletaNumero, 
  barcode 
}: BoletaPreviewProps) {
  const [imageError, setImageError] = useState(false)
  const qrUrl = `${qrBaseUrl}/${rifaId}/${boletaNumero}`
  
  return (
    <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-6">
      <h3 className="text-lg font-medium text-slate-900 mb-4">Vista Previa de Boleta</h3>
      
      {/* Ticket Layout - Exact design from image */}
      <div className="flex border-2 border-slate-800 rounded-lg overflow-hidden bg-white" style={{ width: '800px', height: '350px' }}>
        
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
                src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(qrUrl)}`}
                alt="QR Code"
                className="w-28 h-28"
              />
            </div>
          </div>
          
          {/* Barcode and Number */}
          <div className="space-y-2">
            <div className="bg-white">
              <img
                src={`https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(barcode)}&code=Code128&multiplebarcodes=false&translate-esc=false&unit=Fit&dpi=96&imagetype=Gif&rotation=0&color=%23000000&bgcolor=%23ffffff&qunit=Mm&quiet=0`}
                alt="Barcode"
                className="w-full h-12"
              />
            </div>
            <div className="text-center">
              <div className="inline-block border-2 border-slate-800 px-3 py-1">
                <span className="text-lg font-bold text-slate-900">Num: {boletaNumero.toString().padStart(4, '0')}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Section - Template Image */}
        <div className="w-2/3 relative">
          {imagenUrl && !imageError ? (
            <img
              src={imagenUrl}
              alt="Plantilla de Boleta"
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-slate-200 flex items-center justify-center">
              <div className="text-center">
                <div className="text-slate-400 mb-2">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-slate-500 text-sm">Plantilla no disponible</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Configuration Info */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
          <div className="font-medium text-slate-700 mb-1">Configuración QR:</div>
          <div className="text-slate-600 break-all text-xs">{qrUrl}</div>
        </div>
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
          <div className="font-medium text-slate-700 mb-1">Código de Barras:</div>
          <div className="text-slate-600 font-mono text-xs">{barcode}</div>
        </div>
      </div>

      <div className="mt-4 text-xs text-slate-500">
        <p>• Vista previa exacta del diseño de boleta impresa</p>
        <p>• El QR apunta a: {qrUrl}</p>
        <p>• Cada boleta tendrá número único y código de barras</p>
      </div>
    </div>
  )
}
