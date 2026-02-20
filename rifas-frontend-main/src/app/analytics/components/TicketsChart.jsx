"use client";
import '@/lib/chartjs';
import React from 'react';
import { Doughnut } from 'react-chartjs-2';

export default function TicketsChart({ resumen }) {
  if (!resumen) return null;

  const data = [
    resumen.disponibles,
    resumen.reservadas,
    resumen.abonadas,
    resumen.pagadas,
    resumen.anuladas
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
      <h2 className="text-xl font-light text-slate-900 mb-6">Distribución de Boletas</h2>
      <div className="relative h-64 w-full flex justify-center">
        <Doughnut
          options={{
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%', // Hace la dona más delgada y elegante
            plugins: {
              legend: { 
                position: 'right',
                labels: { color: '#64748b', font: { family: 'inherit' }, usePointStyle: true }
              }
            }
          }}
          data={{
            labels: ['Disponibles','Reservadas','Abonadas','Pagadas','Anuladas'],
            datasets: [{
              data,
              // Paleta profesional que combina con slate
              backgroundColor: ['#cbd5e1', '#fbbf24', '#818cf8', '#34d399', '#f87171'],
              borderWidth: 0,
              hoverOffset: 4
            }]
          }}
        />
      </div>
    </div>
  );
}