import { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import Estado from "../pages/Estado";
import Ingresos from "../pages/Ingresos";
import Reportes from "../pages/Reportes";
import Configuracion from "../pages/Configuracion";
import Clientes from "../pages/Clientes";

export default function Dashboard({ onLogout }) {
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [ultimasOps, setUltimasOps] = useState([]);
  const CAPACIDAD_TOTAL = 60; // Dato ficticio
  
  // 🔹 Función para traer ingresos desde el backend
  const fetchIngresos = async () => {
    try {
      const { data } = await axios.get("http://localhost:4000/api/ingresos");
      const ingresosFiltrados = Array.isArray(data)
        ? data.map((item) => ({
            tipo: item?.tipoVehiculo || "-",
            servicio: item?.servicio || "-",
            horaIngreso: item?.horaEntrada || null,
            horaEgreso: item?.horaSalida || null,
            accion: item?.estado || "-",
          }))
        : [];
      setUltimasOps(ingresosFiltrados);
    } catch (error) {
      console.error("Error al obtener ingresos:", error);
      setUltimasOps([]);
    }
  };

  // 🔹 Cargar datos iniciales + Suscripción a eventos
  useEffect(() => {
    fetchIngresos(); // primera carga

    // Conexión a Socket.IO
    const socket = io("http://localhost:4000", {
      transports: ["websocket"],
    });

    // Escuchar eventos que el backend emita
    socket.on("ingresoActualizado", () => {
      console.log("Evento ingresoActualizado recibido");
      fetchIngresos();
    });

    socket.on("ingresoNuevo", () => {
      console.log("Evento ingresoNuevo recibido");
      fetchIngresos();
    });

    

    // Limpieza al desmontar
    return () => socket.disconnect();
  }, []);

  const tarifas = [
    { tipo: "Bicicleta", hora: "$50", noche: "$150", dia: "$250", mes: "$1500" },
    { tipo: "Moto", hora: "$160", noche: "$200", dia: "$300", mes: "$3000" },
    { tipo: "Auto", hora: "$160", noche: "$370", dia: "$470", mes: "$4200" },
    { tipo: "Camioneta", hora: "$160", noche: "$470", dia: "$570", mes: "$5200" },
  ];

  const libres = CAPACIDAD_TOTAL - ultimasOps.length;

  
  const renderSection = () => {
    switch (activeSection) {
      case "Dashboard":
        return (
          <main className="space-y-8">
            {/* Cards principales */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 p-6 flex flex-col justify-between">
                <h2 className="text-lg font-semibold text-gray-500 mb-4 text-center">Lugares libres</h2>
                <p className="text-6xl font-bold text-green-500 text-center">{libres}</p>
              </div>
              <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 p-6 flex flex-col justify-between">
                <h2 className="text-lg font-semibold text-gray-500 mb-4 text-center">Lugares ocupados</h2>
                <p className="text-6xl font-bold text-red-500 text-center">{ultimasOps.length}</p>
              </div>
              <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 p-6 flex flex-col justify-between">
                <h2 className="text-lg font-semibold text-gray-500 mb-4 text-center">Últimos ingresos</h2>
                <p className="text-6xl font-bold text-indigo-600 text-center">{ultimasOps.length}</p>
              </div>
            </div>

            {/* Tabla de tarifas */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">Tarifas actuales</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-center border-collapse">
                  <thead>
                    <tr className="border-b bg-gray-100">
                      <th className="py-3 px-4">Tipo</th>
                      <th className="py-3 px-4">Por hora</th>
                      <th className="py-3 px-4">Por noche</th>
                      <th className="py-3 px-4">24 horas</th>
                      <th className="py-3 px-4">Por mes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tarifas.map((t, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4 font-medium">{t.tipo}</td>
                        <td className="py-2 px-4">{t.hora}</td>
                        <td className="py-2 px-4">{t.noche}</td>
                        <td className="py-2 px-4">{t.dia}</td>
                        <td className="py-2 px-4">{t.mes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Últimas operaciones */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">Últimas operaciones</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-center border-collapse">
                  <thead>
                    <tr className="border-b bg-gray-100">
                      <th className="py-3 px-4">Tipo</th>
                      <th className="py-3 px-4">Servicio</th>
                      <th className="py-3 px-4">Hora de ingreso</th>
                      <th className="py-3 px-4">Hora de salida</th>
                      <th className="py-3 px-4">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ultimasOps.length > 0 ? (
                      ultimasOps.map((op, idx) => (
                        <tr key={idx} className="border-b hover:bg-gray-50">
                          <td className="py-2 px-4">{op.tipo || "-"}</td>
                          <td className="py-2 px-4">{op.servicio || "-"}</td>
                          <td className="py-2 px-4">
                            {op.horaIngreso
                              ? new Date(op.horaIngreso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                              : "-"}
                          </td>
                          <td className="py-2 px-4">
                            {op.horaEgreso
                              ? new Date(op.horaEgreso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                              : "-"}
                          </td>
                          <td className="py-2 px-4">
                            {op.accion ? (
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  op.accion === "Ingreso"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {op.accion}
                              </span>
                            ) : (
                              "-"
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="py-4 text-center text-gray-500">
                          No hay operaciones registradas.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        );
      case "Estado":
        return <Estado />;
      case "Ingresos":
        return <Ingresos />;
      case "Reportes":
        return <Reportes />;
      case "Configuración":
        return <Configuracion />;
      case "Clientes":
        return <Clientes />;
      default:
        return <Estado />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col border-r border-gray-200">
        <div className="p-6 text-3xl font-bold text-indigo-600">🚗 Parking</div>
        <nav className="flex-1 px-4 py-6 space-y-4">
          {[
            { icon: "🏠", label: "Dashboard" },
            { icon: "📊", label: "Estado" },
            { icon: "🚘", label: "Ingresos" },
            { icon: "📈", label: "Reportes" },
            { icon: "👥", label: "Clientes" },
            { icon: "⚙️", label: "Configuración" },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveSection(item.label)}
              className={`w-full flex items-center py-3 px-4 rounded-lg transition-all duration-200 ${
                activeSection === item.label
                  ? "bg-indigo-50 shadow-sm"
                  : "hover:bg-indigo-50 hover:shadow-sm"
              }`}
            >
              <span className="text-2xl mr-3">{item.icon}</span>
              <span className="text-lg font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center py-2 px-4 bg-red-500 text-white rounded-xl hover:bg-red-600 transition font-semibold"
          >
            🔓 Salir
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-auto">
        <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center border-b border-gray-200">
          <h1 className="text-2xl font-semibold">{activeSection}</h1>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200">🔔</button>
            <div className="flex items-center space-x-2">
              <span className="text-xl">👤</span>
              <span className="font-medium">Admin</span>
            </div>
          </div>
        </header>
        <div className="p-8">{renderSection()}</div>
      </div>
    </div>
  );
}
