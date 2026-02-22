'use client'

import { useState } from 'react'
import { getStorageImageUrl } from '@/lib/storageImageUrl'

interface BoletaTicketProps {
  qrUrl: string
  barcode: string
  numero: number
  imagenUrl?: string | null
  rifaNombre: string
  estado: string
  clienteInfo?: { nombre: string; identificacion?: string } | null
}

const estadoColors: Record<string, string> = {
  DISPONIBLE: 'bg-green-100 text-green-800',
  RESERVADA: 'bg-yellow-100 text-yellow-800',
  CON_PAGO: 'bg-blue-100 text-blue-800',
  TRANSFERIDA: 'bg-purple-100 text-purple-800',
  ANULADA: 'bg-red-100 text-red-800',
}

const estadoLabels: Record<string, string> = {
  DISPONIBLE: 'Disponible',
  RESERVADA: 'Reservada',
  CON_PAGO: 'Con Pago',
  TRANSFERIDA: 'Transferida',
  ANULADA: 'Anulada',
}

export default function BoletaTicket({
  qrUrl,
  barcode,
  numero,
  imagenUrl,
  rifaNombre,
  estado,
  clienteInfo,
}: BoletaTicketProps) {
  const [imageError, setImageError] = useState(false)
  const imagen = getStorageImageUrl(imagenUrl ?? null) ?? imagenUrl
  const hasImagen = Boolean(imagen && imagen.trim())
  const color = estadoColors[estado] ?? 'bg-gray-100 text-gray-800'
  const label = estadoLabels[estado] ?? estado

  return (
    <div className="flex border-2 border-slate-800 rounded-lg overflow-hidden bg-white mx-auto" style={{ width: '800px', height: '352px' }}>
      {/* Left Section — proporción 720/3222 */}
      <div className="flex-shrink-0 p-4 flex flex-col justify-between bg-white border-r-2 border-slate-800" style={{ width: '179px' }}>
        <div className="text-xs text-center space-y-1 text-slate-900">
          <p>- Boleta sin jugar no juega</p>
          <p>- 128 días de caducidad</p>
          <p>- Juega hasta que quede en poder del público</p>
        </div>
        <div className="flex justify-center">
          <div className="bg-white p-2 border border-slate-300">
            <img src={qrUrl} alt="QR Code" className="w-28 h-28" />
          </div>
        </div>
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
              <span className="text-lg font-bold text-slate-900">Num: {numero.toString().padStart(4, '0')}</span>
            </div>
          </div>
        </div>
      </div>
      {/* Right Section — proporción 2502/3222 */}
      <div className="flex-shrink-0 h-full relative min-h-0 flex" style={{ width: '621px' }}>
        {hasImagen && !imageError && imagen ? (
          <img
            src={imagen}
            alt={`Plantilla boleta ${numero}`}
            className="w-full h-full object-cover object-center"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full min-h-[200px] bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900 mb-2">{rifaNombre}</div>
              <div className="text-slate-800">Boleta #{numero.toString().padStart(4, '0')}</div>
              <div className="mt-2">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${color}`}>{label}</span>
              </div>
              {clienteInfo && (
                <div className="mt-2 text-xs text-slate-800">
                  <p className="font-medium">{clienteInfo.nombre}</p>
                  {clienteInfo.identificacion && <p className="text-xs">{clienteInfo.identificacion}</p>}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
