'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  nombre: string
  rol: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      router.push('/login')
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    } catch (error) {
      router.push('/login')
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/20">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900 leading-tight">Sistema de Rifas</h1>
                <p className="text-[11px] text-slate-400 -mt-0.5">Panel de Administración</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-2">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  {user.nombre.charAt(0).toUpperCase()}
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900 leading-tight">{user.nombre}</p>
                  <p className="text-[11px] text-slate-500 leading-tight">{user.rol === 'SUPER_ADMIN' ? 'Super Admin' : user.rol}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                title="Cerrar sesión"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <h2 className="text-2xl font-bold text-slate-900">
            ¡Hola, {user.nombre.split(' ')[0]}! 👋
          </h2>
          <p className="text-slate-500 mt-1">Aquí tienes un resumen de tu sistema de rifas</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 animate-fade-in" style={{animationDelay: '0.05s'}}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Rol</p>
                <p className="text-lg font-bold text-slate-900">{user.rol === 'SUPER_ADMIN' ? 'Super Admin' : user.rol}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 animate-fade-in" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Estado</p>
                <p className="text-lg font-bold text-emerald-600">Activo</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 animate-fade-in" style={{animationDelay: '0.15s'}}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Email</p>
                <p className="text-sm font-semibold text-slate-900 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modules Section */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-900 mb-1">Módulos</h3>
          <p className="text-sm text-slate-500">Accede a las herramientas de gestión</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Módulo de Ventas */}
          {(user.rol === 'SUPER_ADMIN' || user.rol === 'VENDEDOR') && (
            <a
              href="/ventas"
              className="group bg-white rounded-2xl border border-slate-200 p-6 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 card-hover animate-fade-in"
              style={{animationDelay: '0.2s'}}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-shadow">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">Ventas</h4>
                  <span className="inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded-full bg-indigo-50 text-[11px] font-semibold text-indigo-600">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
                    En vivo
                  </span>
                </div>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">Sistema de ventas con bloqueo de boletas en tiempo real</p>
              <div className="mt-4 flex items-center text-xs font-semibold text-indigo-600 group-hover:text-indigo-700">
                Ir a Ventas
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>
          )}

          {/* Módulo de Ventas Públicas */}
          {(user.rol === 'SUPER_ADMIN' || user.rol === 'VENDEDOR') && (
            <a
              href="/ventas-publicas"
              className="group bg-white rounded-2xl border border-slate-200 p-6 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300 card-hover animate-fade-in"
              style={{animationDelay: '0.25s'}}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/25 group-hover:shadow-emerald-500/40 transition-shadow">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">Ventas Públicas</h4>
                  <span className="inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded-full bg-emerald-50 text-[11px] font-semibold text-emerald-600">
                    ✨ Nuevo
                  </span>
                </div>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">Confirmar pagos y abonos desde la web pública</p>
              <div className="mt-4 flex items-center text-xs font-semibold text-emerald-600 group-hover:text-emerald-700">
                Ir a Ventas Públicas
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>
          )}
              
          {/* Clientes */}
          <a
            href="/clientes"
            className="group bg-white rounded-2xl border border-slate-200 p-6 hover:border-sky-200 hover:shadow-lg hover:shadow-sky-500/5 transition-all duration-300 card-hover animate-fade-in"
            style={{animationDelay: '0.3s'}}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-sky-500/25 group-hover:shadow-sky-500/40 transition-shadow">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors">Clientes</h4>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">Gestionar clientes del sistema</p>
            <div className="mt-4 flex items-center text-xs font-semibold text-sky-600 group-hover:text-sky-700">
              Ir a Clientes
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </a>

          {/* Rifas */}
          {user.rol === 'SUPER_ADMIN' && (
            <a
              href="/rifas"
              className="group bg-white rounded-2xl border border-slate-200 p-6 hover:border-amber-200 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-300 card-hover animate-fade-in"
              style={{animationDelay: '0.35s'}}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-amber-500/25 group-hover:shadow-amber-500/40 transition-shadow">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                </div>
                <h4 className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors">Rifas</h4>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">Gestionar rifas, premios y sorteos</p>
              <div className="mt-4 flex items-center text-xs font-semibold text-amber-600 group-hover:text-amber-700">
                Ir a Rifas
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>
          )}

          {/* Boletas */}
          {user.rol === 'SUPER_ADMIN' && (
            <a
              href="/boletas"
              className="group bg-white rounded-2xl border border-slate-200 p-6 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-300 card-hover animate-fade-in"
              style={{animationDelay: '0.4s'}}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-violet-500/25 group-hover:shadow-violet-500/40 transition-shadow">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h4 className="text-base font-bold text-slate-900 group-hover:text-violet-700 transition-colors">Boletas</h4>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">Ver y gestionar todas las boletas del sistema</p>
              <div className="mt-4 flex items-center text-xs font-semibold text-violet-600 group-hover:text-violet-700">
                Ir a Boletas
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>
          )}

          {/* Reportes */}
          {(user.rol === 'SUPER_ADMIN' || user.rol === 'VENDEDOR') ? (
            <a
              href="/analytics"
              className="group bg-white rounded-2xl border border-slate-200 p-6 hover:border-rose-200 hover:shadow-lg hover:shadow-rose-500/5 transition-all duration-300 card-hover animate-fade-in"
              style={{animationDelay: '0.45s'}}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-rose-500/25 group-hover:shadow-rose-500/40 transition-shadow">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h4 className="text-base font-bold text-slate-900 group-hover:text-rose-700 transition-colors">Reportes</h4>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">Ver reportes, métricas y análisis de ventas</p>
              <div className="mt-4 flex items-center text-xs font-semibold text-rose-600 group-hover:text-rose-700">
                Ir a Reportes
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>
          ) : (
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 opacity-50 animate-fade-in" style={{animationDelay: '0.45s'}}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-slate-200 rounded-xl flex items-center justify-center text-slate-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h4 className="text-base font-bold text-slate-400">Reportes</h4>
              </div>
              <p className="text-sm text-slate-400">Próximamente</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
