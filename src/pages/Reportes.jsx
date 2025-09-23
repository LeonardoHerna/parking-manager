import { useEffect, useState } from "react";
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';

export default function Reportes() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("http://localhost:4000/api/reportes/estadisticas");
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Error cargando estadísticas", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (!stats) return <p>No hay datos</p>;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Reportes y estadísticas</h1>

      {/* ---- KPIs ---- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card icon="📊" label="Ingresos totales" value={`$${stats.totalIngresos}`} color="text-green-500" />
        <Card icon="🚗" label="Vehículos diarios" value={stats.vehiculosHoy} color="text-indigo-600" />
        <Card icon="🕒" label="Promedio por ticket" value={`$${stats.promedioTicket.toFixed(2)}`} color="text-gray-800" />
        <Card icon="📈" label="Ocupación máxima" value={`${stats.ocupacionMaxima.toFixed(0)}%`} color="text-red-500" />
      </div>

      {/* ---- Gráfico ---- */}
      {stats.resumen7dias && (
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-500 mb-4">Ingresos últimos 7 días</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.resumen7dias}>
                <Line type="monotone" dataKey="ingresos" stroke="#4F46E5" strokeWidth={3}/>
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="dia" />
                <YAxis />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ---- Tabla ---- */}
      {stats.resumen7dias && (
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-500 mb-4">Resumen histórico (últimos 7 días)</h2>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-2 text-sm text-gray-500">Día</th>
                <th className="py-2 text-sm text-gray-500">Vehículos</th>
                <th className="py-2 text-sm text-gray-500">Ingresos</th>
              </tr>
            </thead>
            <tbody>
              {stats.resumen7dias.map((row) => (
                <tr key={row.dia} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 text-gray-700">{row.dia}</td>
                  <td className="py-2 text-gray-700">{row.vehiculos}</td>
                  <td className="py-2 text-green-500 font-semibold">${row.ingresos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Card({ icon, label, value, color }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center justify-center">
      <span className="text-3xl">{icon}</span>
      <p className="mt-2 text-gray-500 text-sm">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
