"use client";
import '@/lib/chartjs';
import React from 'react';
import { Line } from 'react-chartjs-2';

export default function RevenueChart({ serie }) {
  if (!serie?.length) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
      <h2 className="text-lg font-bold text-slate-900 mb-6">Evolución del Recaudo</h2>
      <div className="relative h-80 w-full">
        <Line
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { display: false } },
              y: { border: { dash: [4, 4] }, grid: { color: '#f1f5f9' } } // Líneas sutiles slate-100
            }
          }}
          data={{
            labels: serie.map(s => new Date(s.fecha).toLocaleDateString()),
            datasets: [{
              label: 'Recaudo',
              data: serie.map(s => Number(s.total)),
              borderColor: '#6366f1', // indigo-500
              backgroundColor: 'rgba(99,102,241,0.08)',
              borderWidth: 2,
              pointBackgroundColor: '#ffffff',
              pointBorderColor: '#6366f1',
              pointBorderWidth: 2,
              fill: true,
              tension: 0.4
            }]
          }}
        />
      </div>
    </div>
  );
}