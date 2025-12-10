import { useEffect, useState } from "react";
import axios from "axios";

export default function Estado() {
  const [ingresos, setIngresos] = useState([]);
  const CAPACIDAD_TOTAL = 60;

  const API_URL = import.meta.env.VITE_API_URL; // ⬅ VARIABLE DE ENTORNO

  useEffect(() => {
    const fetchIngresos = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/ingresos`);
        setIngresos(data);
      } catch (error) {
        console.error("Error al obtener ingresos:", error);
      }
    };
    fetchIngresos();
  }, [API_URL]);

  // ---- Cálculos ----
  const ocupados = ingresos.filter((i) => i.estado === "Activo").length;
  const libres = CAPACIDAD_TOTAL - ocupados;

  const hoy = new Date().toLocaleDateString();
  const totalHoy = ingresos.filter((i) =>
    new Date(i.horaEntrada).toLocaleDateString() === hoy
  ).length;

  const ultimos = [...ingresos]
    .sort((a, b) => new Date(b.horaEntrada) - new Date(a.horaEntrada))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Estado general del parking
      </h1>

      {/* Resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center">
          <span className="text-3xl">✅</span>
          <p className="mt-2 text-gray-500 text-sm">Lugares libres</p>
          <p className="text-2xl font-bold text-green-500">{libres}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center">
          <span className="text-3xl">🚫</span>
          <p className="mt-2 text-gray-500 text-sm">Lugares ocupados</p>
          <p className="text-2xl font-bold text-red-500">{ocupados}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center">
          <span className="text-3xl">🕒</span>
          <p className="mt-2 text-gray-500 text-sm">Últimos ingresos</p>
          <p className="text-2xl font-bold text-indigo-600">{ultimos.length}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center">
          <span className="text-3xl">📋</span>
          <p className="mt-2 text-gray-500 text-sm">Vehículos totales hoy</p>
          <p className="text-2xl font-bold text-gray-800">{totalHoy}</p>
        </div>
      </div>

      {/* Tabla últimos ingresos */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-500 mb-4">
          Últimos vehículos ingresados
        </h2>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-2 text-sm text-gray-500">Matrícula</th>
              <th className="py-2 text-sm text-gray-500">Hora de ingreso</th>
              <th className="py-2 text-sm text-gray-500">Estado</th>
            </tr>
          </thead>

          <tbody>
            {ultimos.map((item) => (
              <tr
                key={item._id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-2 text-gray-700">{item.patente}</td>
                <td className="py-2 text-gray-700">
                  {new Date(item.horaEntrada).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td
                  className={`py-2 font-semibold ${
                    item.estado === "Activo"
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {item.estado}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

