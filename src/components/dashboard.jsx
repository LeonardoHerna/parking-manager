import { useState } from "react";
import Estado from "../pages/Estado";
import Ingresos from "../pages/Ingresos";
import Reportes from "../pages/Reportes";
import Configuracion from "../pages/Configuracion";
import Clientes from "../pages/Clientes";

export default function Dashboard({ onLogout }) {
  const [activeSection, setActiveSection] = useState("Dashboard");

  // Función para renderizar la sección correspondiente
  const renderSection = () => {
    switch (activeSection) {
      case "Dashboard":
        return (
          <main className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 p-6 flex flex-col justify-between">
              <h2 className="text-lg font-semibold text-gray-500 mb-4">Lugares libres</h2>
              <p className="text-6xl font-bold text-green-500">45</p>
            </div>
            <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 p-6 flex flex-col justify-between">
              <h2 className="text-lg font-semibold text-gray-500 mb-4">Lugares ocupados</h2>
              <p className="text-6xl font-bold text-red-500">15</p>
            </div>
            <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 p-6 flex flex-col justify-between">
              <h2 className="text-lg font-semibold text-gray-500 mb-4">Últimos ingresos</h2>
              <p className="text-6xl font-bold text-indigo-600">8</p>
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
        return <Clientes />
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
                activeSection === item.label ? "bg-indigo-50 shadow-sm" : "hover:bg-indigo-50 hover:shadow-sm"
              }`}
            >
              <span className="text-2xl mr-3">{item.icon}</span>
              <span className="text-lg font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Botón de salir */}
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
        {/* Header */}
        <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center border-b border-gray-200">
          <h1 className="text-2xl font-semibold">{activeSection}</h1>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200">
              🔔
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-xl">👤</span>
              <span className="font-medium">Admin</span>
            </div>
          </div>
        </header>

        {/* Renderizado dinámico de la sección */}
        <div className="p-8">{renderSection()}</div>
      </div>
    </div>
  );
}
