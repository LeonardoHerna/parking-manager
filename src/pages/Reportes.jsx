export default function Reportes() {
  return (
    <div className="space-y-8">
      {/* Título de la sección */}
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Reportes y estadísticas</h1>

      {/* Resumen de KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center justify-center">
          <span className="text-3xl">📊</span>
          <p className="mt-2 text-gray-500 text-sm">Ingresos totales</p>
          <p className="text-2xl font-bold text-green-500">$5,200</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center justify-center">
          <span className="text-3xl">🚗</span>
          <p className="mt-2 text-gray-500 text-sm">Vehículos diarios</p>
          <p className="text-2xl font-bold text-indigo-600">220</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center justify-center">
          <span className="text-3xl">🕒</span>
          <p className="mt-2 text-gray-500 text-sm">Promedio por ticket</p>
          <p className="text-2xl font-bold text-gray-800">$23.6</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center justify-center">
          <span className="text-3xl">📈</span>
          <p className="mt-2 text-gray-500 text-sm">Ocupación máxima</p>
          <p className="text-2xl font-bold text-red-500">95%</p>
        </div>
      </div>

      {/* Placeholder para gráficos */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-500 mb-4">Gráficos de ocupación e ingresos</h2>
        <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
          {/* Aquí se puede integrar Chart.js, Recharts u otra librería */}
          Gráfico de ejemplo
        </div>
      </div>

      {/* Tabla de resumen histórico */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-500 mb-4">Resumen histórico (últimos 7 días)</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-2 text-sm text-gray-500">Día</th>
              <th className="py-2 text-sm text-gray-500">Vehículos</th>
              <th className="py-2 text-sm text-gray-500">Ingresos</th>
              <th className="py-2 text-sm text-gray-500">Ocupación</th>
            </tr>
          </thead>
          <tbody>
            {[
              { dia: "Lunes", vehiculos: 180, ingresos: "$4,100", ocupacion: "80%" },
              { dia: "Martes", vehiculos: 200, ingresos: "$4,500", ocupacion: "85%" },
              { dia: "Miércoles", vehiculos: 220, ingresos: "$5,200", ocupacion: "90%" },
              { dia: "Jueves", vehiculos: 210, ingresos: "$4,900", ocupacion: "88%" },
              { dia: "Viernes", vehiculos: 230, ingresos: "$5,400", ocupacion: "92%" },
              { dia: "Sábado", vehiculos: 250, ingresos: "$5,800", ocupacion: "95%" },
              { dia: "Domingo", vehiculos: 190, ingresos: "$4,300", ocupacion: "82%" },
            ].map((row) => (
              <tr key={row.dia} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-2 text-gray-700">{row.dia}</td>
                <td className="py-2 text-gray-700">{row.vehiculos}</td>
                <td className="py-2 text-green-500 font-semibold">{row.ingresos}</td>
                <td className="py-2 text-gray-700">{row.ocupacion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
