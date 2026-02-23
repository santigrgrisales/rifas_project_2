'use client'

import { useRouter } from 'next/navigation'

export default function VentasHomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
              Dashboard
            </button>
            <div className="w-px h-6 bg-slate-200"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              <h1 className="text-lg font-bold text-slate-900">Sistema de Ventas</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-2xl font-bold text-slate-900">
            ¿Qué deseas hacer?
          </h2>
          <p className="text-slate-500 mt-2">
            Selecciona una opción para continuar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nueva Venta */}
          <button
            onClick={() => router.push('/ventas/nueva-venta')}
            className="group bg-white border border-slate-200 rounded-2xl p-8 text-left hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 card-hover"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white mb-5 shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-shadow">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
              Nueva venta
            </h3>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              Registrar una nueva venta de boletas para un cliente
            </p>
            <div className="mt-5 flex items-center text-xs font-semibold text-indigo-600 group-hover:text-indigo-700">
              Comenzar
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </div>
          </button>

          {/* Gestionar / Abonos */}
          <button
            onClick={() => router.push('/ventas/gestionar')}
            className="group bg-white border border-slate-200 rounded-2xl p-8 text-left hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300 card-hover"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white mb-5 shadow-lg shadow-emerald-500/25 group-hover:shadow-emerald-500/40 transition-shadow">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a5 5 0 00-10 0v2M5 13h14l-1.5 8h-11L5 13z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
              Cobrar venta pendiente
            </h3>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              Registrar pagos o abonos a ventas existentes
            </p>
            <div className="mt-5 flex items-center text-xs font-semibold text-emerald-600 group-hover:text-emerald-700">
              Gestionar
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </div>
          </button>
        </div>
      </main>
    </div>
  )
}