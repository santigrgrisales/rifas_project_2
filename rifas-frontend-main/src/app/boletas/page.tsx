'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function BoletasPage() {
  const [userRole, setUserRole] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/login')
      return
    }

    try {
      const user = JSON.parse(userData)
      setUserRole(user.rol)
      
      // Check if user has SUPER_ADMIN role
      if (user.rol !== 'SUPER_ADMIN') {
        router.push('/dashboard')
        return
      }
    } catch (error) {
      router.push('/login')
    }
  }, [router])

  if (userRole && userRole !== 'SUPER_ADMIN') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-6 py-4 rounded-lg max-w-md">
          <h2 className="text-lg font-medium mb-2">Acceso Restringido</h2>
          <p>Este módulo solo está disponible para usuarios con rol SUPER_ADMIN</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 font-semibold shadow-md shadow-indigo-500/20 transition-all"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (!userRole) {
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
                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <h1 className="text-lg font-bold text-slate-900">Boletas</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Opción: Crear Boletas */}
          <div className="group bg-white rounded-2xl border border-slate-200 p-8 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 card-hover cursor-pointer"
               onClick={() => router.push('/boletas/crear')}>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-shadow">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-700 transition-colors">Crear Boletas</h2>
                <p className="text-sm text-slate-500">Genera nuevas boletas para las rifas disponibles</p>
              </div>
              <div className="flex items-center text-sm font-semibold text-indigo-600 group-hover:text-indigo-700">
                Ir a crear boletas
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </div>
            </div>
          </div>

          {/* Opción: Ver Boletas */}
          <div className="group bg-white rounded-2xl border border-slate-200 p-8 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300 card-hover cursor-pointer"
               onClick={() => router.push('/boletas/ver')}>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:shadow-emerald-500/40 transition-shadow">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">Ver Boletas</h2>
                <p className="text-sm text-slate-500">Consulta todas las boletas por rifa</p>
              </div>
              <div className="flex items-center text-sm font-semibold text-emerald-600 group-hover:text-emerald-700">
                Ir a ver boletas
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Guía rápida</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              </div>
              <div>
                <strong className="text-slate-900">Crear Boletas:</strong> <span className="text-slate-500">Genera nuevas boletas para las rifas activas</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              </div>
              <div>
                <strong className="text-slate-900">Ver Boletas:</strong> <span className="text-slate-500">Consulta el estado y detalles de todas las boletas</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
