"use client";

import { useEffect, useState } from "react";
import { getReporteRifa } from "./services/analytics.service";
import FiltersBar from "./components/FiltersBar";
import KPISection from "./components/KPISection";
import RevenueChart from "./components/RevenueChart";
import MethodsChart from "./components/MethodsChart";
import TicketsChart from "./components/TicketsChart";
import { useRouter } from "next/navigation";

/* =======================
   TIPOS
======================= */
type Rifa = {
  id: string;
  nombre: string;
};

type Props = {
  rifas: Rifa[];
};

export default function AnalyticsDashboard({ rifas }: Props) {
  const router = useRouter();

  const onBack = () => {
    router.push('/dashboard');
  };

  const [selectedRifa, setSelectedRifa] = useState<string | null>(
    rifas.length ? rifas[0].id : null
  );

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedRifa) return;

    const fetchData = async () => {
      setLoading(true);
      const result = await getReporteRifa(
        selectedRifa,
        fechaInicio,
        fechaFin
      );
      setData(result);
      setLoading(false);
    };

    fetchData();
  }, [selectedRifa, fechaInicio, fechaFin]);

  if (!rifas.length) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-slate-500">No hay rifas disponibles</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 font-medium transition-colors"
                title="Volver al Dashboard"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                Dashboard
              </button>
              <div className="w-px h-6 bg-slate-200"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                </div>
                <h1 className="text-lg font-bold text-slate-900">Análisis de Rifas</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FiltersBar
          rifas={rifas}
          selectedRifa={selectedRifa}
          setSelectedRifa={setSelectedRifa}
          fechaInicio={fechaInicio}
          fechaFin={fechaFin}
          setFechaInicio={setFechaInicio}
          setFechaFin={setFechaFin}
        />

        {loading && !data ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-slate-400 animate-pulse font-medium text-lg">Procesando métricas...</div>
          </div>
        ) : data ? (
          <div className={`space-y-6 ${loading ? 'opacity-50 pointer-events-none' : 'transition-opacity duration-300'}`}>
            <KPISection data={data} />
            <RevenueChart serie={data.serie_diaria} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MethodsChart methods={data.metodos_pago} />
              <TicketsChart resumen={data.resumen_boletas} />
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}