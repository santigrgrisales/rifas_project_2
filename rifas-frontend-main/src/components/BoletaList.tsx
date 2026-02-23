'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import type { Boleta } from '@/types/boleta'

interface BoletaListProps {
  boletas: Boleta[]
  loading: boolean
}

export default function BoletaList({ boletas, loading }: BoletaListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const router = useRouter()

  const fallbackColors = 'bg-slate-100 text-slate-800'

  // Determina label y clases del estado según la boleta
  const getEstadoInfo = (boleta: Boleta) => {
  const estadoRaw = boleta.estado?.toString().trim().toUpperCase() || ''

  // RESERVADA (con o sin cliente)
  if (estadoRaw === 'RESERVADA') {
    if (boleta.cliente_info) {
      return { label: 'RESERVADA', classes: 'bg-blue-600 text-white' }
    }
    return { label: 'BLOQUEADA MOMENTÁNEAMENTE', classes: 'bg-amber-200 text-black' }
  }

  // ABONADA 
  if (estadoRaw === 'ABONADA') {
    return { label: 'ABONADA', classes: 'bg-orange-400 text-black' }
  }

  // PAGADA
  if (estadoRaw === 'PAGADA' || estadoRaw === 'CON_PAGO') {
    return { label: 'PAGADA', classes: 'bg-green-700 text-white' }
  }

  // ANULADA / CANCELADA
  if (estadoRaw === 'ANULADA' || estadoRaw === 'CANCELADA') {
    return { label: 'CANCELADA', classes: 'bg-red-600 text-white' }
  }

  // DISPONIBLE
  if (estadoRaw === 'DISPONIBLE') {
    return { label: 'DISPONIBLE', classes: 'bg-emerald-300 text-black' }
  }

  // TRANSFERIDA
  if (estadoRaw === 'TRANSFERIDA') {
    return { label: 'TRANSFERIDA', classes: 'bg-purple-100 text-purple-800' }
  }

  // Fallback seguro
  return {
    label: estadoRaw || 'DESCONOCIDO',
    classes: 'bg-slate-100 text-slate-800'
  }
}

  // Filter and paginate boletas
  const filteredBoletas = useMemo(() => {
    if (!searchTerm) return boletas

    const searchLower = searchTerm.toLowerCase()
    return boletas.filter(boleta => {
      const numeroStr = boleta.numero?.toString().padStart(4, '0') || ''
      const nombre = boleta.cliente_info?.nombre?.toLowerCase() || ''
      const identificacion = boleta.cliente_info?.identificacion?.toString() || ''
      return (
        numeroStr.includes(searchLower) ||
        nombre.includes(searchLower) ||
        identificacion.includes(searchTerm)
        
      )
    })
  }, [boletas, searchTerm])

  const paginatedBoletas = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredBoletas.slice(startIndex, endIndex)
  }, [filteredBoletas, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredBoletas.length / itemsPerPage)
  const startIndex = filteredBoletas.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
  const endIndex = Math.min(currentPage * itemsPerPage, filteredBoletas.length)
  

  const handlePageChange = (page: number) => {
    if (page < 1) page = 1
    if (page > totalPages) page = totalPages
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1)
  }

  const formatBoletaNumber = (numero: number) => {
    return numero.toString().padStart(4, '0')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-slate-500">Cargando boletas...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar por número de boleta (0000), nombre o identificación del cliente..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none text-slate-900 placeholder-slate-400 bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="itemsPerPage" className="text-sm text-slate-600">
              Mostrar:
            </label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none text-slate-900 bg-white"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-slate-600">
            Mostrando <span className="font-medium text-slate-900">{startIndex}</span> a{' '}
            <span className="font-medium text-slate-900">{endIndex}</span> de{' '}
            <span className="font-medium text-slate-900">{filteredBoletas.length}</span> boletas
            {filteredBoletas.length !== boletas.length && (
              <span> (filtradas de <span className="font-medium text-slate-900">{boletas.length}</span> totales)</span>
            )}
          </div>

          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('')
                setCurrentPage(1)
              }}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Limpiar búsqueda
            </button>
          )}
        </div>
      </div>

      {/* Boletas Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Número</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Contacto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Identificación</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Vendedor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">QR</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {paginatedBoletas.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                    {searchTerm ? 'No se encontraron boletas que coincidan con la búsqueda' : 'No hay boletas para mostrar'}
                  </td>
                </tr>
              ) : (
                paginatedBoletas.map((boleta) => {
                  const estado = getEstadoInfo(boleta)
                  return (

                    console.log("CLIENTE INFO:", boleta.cliente_info),

                    <tr key={boleta.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-lg font-mono font-bold text-slate-900">{formatBoletaNumber(boleta.numero)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${estado.classes}`}>
                          {estado.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900">{boleta.cliente_info ? boleta.cliente_info.nombre : '-'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900">{boleta.cliente_info ? boleta.cliente_info.telefono : '-'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900">{boleta.cliente_info ? boleta.cliente_info.identificacion : '-'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900">{boleta.vendedor_info ? boleta.vendedor_info.nombre : '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {boleta.qr_url ? (
                          <button onClick={() => window.open(boleta.qr_url || '', '_blank')} className="text-blue-600 hover:text-blue-900 text-xs font-medium flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1z" />
                            </svg>
                            Ver QR
                          </button>
                        ) : (
                          <span className="text-slate-400 text-xs">No disponible</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button onClick={() => router.push(`/boletas/${boleta.id}`)} className="text-blue-600 hover:text-blue-900 text-xs font-medium flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Ver
                          </button>
                          <button onClick={() => router.push(`/boletas/${boleta.id}/print`)} className="text-green-600 hover:text-green-900 text-xs font-medium flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            Imprimir
                          </button>
                        </div>
                      </td>
                    </tr>
                  )

                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-slate-600">
              Página <span className="font-medium text-slate-900">{currentPage}</span> de <span className="font-medium text-slate-900">{totalPages}</span>
            </div>

            <div className="flex items-center space-x-2">
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700">Anterior</button>

              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }

                  return (
                    <button key={pageNum} onClick={() => handlePageChange(pageNum)} className={`px-3 py-1 text-sm border rounded-lg ${currentPage === pageNum ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-300 text-slate-700 hover:bg-slate-50'}`}>
                      {pageNum}
                    </button>
                  )
                })}
              </div>

              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700">Siguiente</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}