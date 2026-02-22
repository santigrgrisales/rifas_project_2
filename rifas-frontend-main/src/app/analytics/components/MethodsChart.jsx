"use client";
import '@/lib/chartjs';
import React from 'react';
import { Bar } from 'react-chartjs-2';

export default function MethodsChart({ methods }) {
  if (!methods?.length) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
      <h2 className="text-xl font-light text-slate-900 mb-6">Ingresos por Método de Pago</h2>
      <div className="relative h-64 w-full">
        <Bar
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { display: false } },
              y: { grid: { color: '#f1f5f9' }, border: { dash: [4, 4] } }
            }
          }}
          data={{
            labels: methods.map(m => m.metodo),
            datasets: [{
              data: methods.map(m => Number(m.total)),
              backgroundColor: '#3b82f6', // blue-500
              borderRadius: 6, // Esquinas redondeadas en las barras
              barThickness: 40
            }]
          }}
        />
      </div>
    </div>
  );
}