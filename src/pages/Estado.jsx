export default function Estado() {
  return (
    <div className="space-y-8">
      {/* Título de la sección */}
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Estado general del parking</h1>

      {/* Resumen rápido con mini cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center justify-center">
          <span className="text-3xl">✅</span>
          <p className="mt-2 text-gray-500 text-sm">Lugares libres</p>
          <p className="text-2xl font-bold text-green-500">45</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center justify-center">
          <span className="text-3xl">🚫</span>
          <p className="mt-2 text-gray-500 text-sm">Lugares ocupados</p>
          <p className="text-2xl font-bold text-red-500">15</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center justify-center">
          <span className="text-3xl">🕒</span>
          <p className="mt-2 text-gray-500 text-sm">Últimos ingresos</p>
          <p className="text-2xl font-bold text-indigo-600">8</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center justify-center">
          <span className="text-3xl">📋</span>
          <p className="mt-2 text-gray-500 text-sm">Vehículos totales hoy</p>
          <p className="text-2xl font-bold text-gray-800">60</p>
        </div>
      </div>

      {/* Lista de vehículos recientes (placeholder) */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-500 mb-4">Últimos vehículos ingresados</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-2 text-sm text-gray-500">Matrícula</th>
              <th className="py-2 text-sm text-gray-500">Hora de ingreso</th>
              <th className="py-2 text-sm text-gray-500">Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-2 text-gray-700">ABC-1234</td>
              <td className="py-2 text-gray-700">08:15</td>
              <td className="py-2 text-green-500 font-semibold">Libre</td>
            </tr>
            <tr className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-2 text-gray-700">XYZ-5678</td>
              <td className="py-2 text-gray-700">08:45</td>
              <td className="py-2 text-red-500 font-semibold">Ocupado</td>
            </tr>
            <tr className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-2 text-gray-700">LMN-9012</td>
              <td className="py-2 text-gray-700">09:10</td>
              <td className="py-2 text-green-500 font-semibold">Libre</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

