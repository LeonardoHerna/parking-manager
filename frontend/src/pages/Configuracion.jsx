
export default function Configuracion() {
  return (
    <div className="space-y-8">
      {/* Título de la sección */}
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Configuración del sistema</h1>

      {/* Formulario de ajustes generales */}
      <div className="bg-white rounded-2xl shadow-md p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-500 mb-4">Ajustes generales</h2>

        <div className="flex flex-col space-y-4">
          {/* Nombre del parking */}
          <div className="flex flex-col">
            <label className="text-gray-600 mb-1">Nombre del Parking</label>
            <input
              type="text"
              placeholder="Parking Manager"
              className="border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Dirección */}
          <div className="flex flex-col">
            <label className="text-gray-600 mb-1">Dirección</label>
            <input
              type="text"
              placeholder="Calle Falsa 123"
              className="border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Notificaciones */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Notificaciones activas</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-indigo-500 transition-all"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition-transform"></div>
            </label>
          </div>

          {/* Botón guardar cambios */}
          <button className="bg-indigo-500 text-white py-3 rounded-2xl font-semibold hover:bg-indigo-600 transition-all shadow-md">
            Guardar cambios
          </button>
        </div>
      </div>

      {/* Formulario avanzado / placeholders */}
      <div className="bg-white rounded-2xl shadow-md p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-500 mb-4">Ajustes avanzados</h2>

        <div className="flex flex-col space-y-4">
          {/* Método de pago */}
          <div className="flex flex-col">
            <label className="text-gray-600 mb-1">Método de pago predeterminado</label>
            <select className="border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400">
              <option>Efectivo</option>
              <option>Tarjeta</option>
              <option>App móvil</option>
            </select>
          </div>

          {/* Horario de operación */}
          <div className="flex flex-col">
            <label className="text-gray-600 mb-1">Horario de operación</label>
            <input
              type="text"
              placeholder="08:00 - 20:00"
              className="border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
