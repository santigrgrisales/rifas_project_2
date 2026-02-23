import React from 'react';

export default function KPISection({ data }) {
  const { finanzas, resumen_boletas } = data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col justify-center transition-shadow hover:shadow-md">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Recaudo Real</h3>
        <p className="text-3xl font-bold text-slate-900">${finanzas.recaudo_real.toLocaleString()}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col justify-center transition-shadow hover:shadow-md">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Proyección Total</h3>
        <p className="text-3xl font-bold text-slate-900">${finanzas.proyeccion_total.toLocaleString()}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col justify-center transition-shadow hover:shadow-md">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Cumplimiento</h3>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-bold text-indigo-600">{finanzas.porcentaje_cumplimiento}%</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col justify-center transition-shadow hover:shadow-md">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Boletas Pagadas</h3>
        <p className="text-3xl font-bold text-emerald-600">{resumen_boletas.pagadas}</p>
      </div>
    </div>
  );
}