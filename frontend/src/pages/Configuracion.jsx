import React, { useEffect, useState } from "react";

export default function Configuracion() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    theme: "light",
    soundAlerts: true,
    visualAlerts: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  const API_URL = "http://localhost:4000/api/auth";

  
  const applyTheme = (theme) => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  };

  // 📦 Cargar usuario y preferencias
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setStatus({ type: "error", message: "Sesión no encontrada. Inicia sesión nuevamente." });
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        // Obtenemos datos del usuario
        const userRes = await fetch(`${API_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!userRes.ok) throw new Error("No se pudo obtener la información del usuario.");
        const userData = await userRes.json();
        setUser(userData);

        // Obtenemos preferencias
        const prefRes = await fetch(`${API_URL}/preferences`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (prefRes.ok) {
          const prefData = await prefRes.json();
          setForm(prefData);
          applyTheme(prefData.theme);
          localStorage.setItem("theme", prefData.theme);
        } else {
          const savedTheme = localStorage.getItem("theme") || "light";
          applyTheme(savedTheme);
        }
      } catch (err) {
        setStatus({ type: "error", message: err.message });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // 🔄 Manejadores
  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    const newVal = type === "checkbox" ? checked : value;
    setForm((prev) => ({ ...prev, [name]: newVal }));

    if (name === "theme") {
      applyTheme(newVal);
      localStorage.setItem("theme", newVal);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setStatus({ type: "error", message: "Sesión no válida." });
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/preferences`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("No se pudieron guardar las preferencias.");
      const data = await res.json();
      setStatus({ type: "success", message: "Preferencias guardadas correctamente." });
      applyTheme(data.preferences.theme);
      localStorage.setItem("theme", data.preferences.theme);
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    const defaults = { theme: "light", soundAlerts: true, visualAlerts: true };
    setForm(defaults);
    applyTheme("light");
    localStorage.setItem("theme", "light");
    setStatus({ type: "info", message: "Preferencias restablecidas a los valores predeterminados." });
  };

  if (loading) return <div className="p-4 text-gray-600">Cargando configuración...</div>;

  return (
    <div className="space-y-6 transition-colors duration-300 dark:bg-gray-900 dark:text-gray-100 p-4 rounded-xl">
      <header>
        <h1 className="text-2xl font-bold">Configuración personal</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Ajusta tus preferencias personales para el uso del sistema.
        </p>
      </header>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Información personal */}
        {user && (
          <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 space-y-4">
            <h2 className="text-lg font-semibold">Información del empleado</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                  Nombre de usuario
                </label>
                <input
                  type="text"
                  value={user.name || ""}
                  readOnly
                  className="mt-1 block w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-2 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Rol</label>
                <input
                  type="text"
                  value={user.role || "Empleado"}
                  readOnly
                  className="mt-1 block w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-2 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Turno</label>
                <input
                  type="text"
                  value={user.shift || "08:00 - 16:00"}
                  readOnly
                  className="mt-1 block w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-2 cursor-not-allowed"
                />
              </div>
            </div>
          </section>
        )}

        {/* Preferencias */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 space-y-4">
          <h2 className="text-lg font-semibold">Preferencias del sistema</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tema */}
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Tema visual</label>
              <select
                name="theme"
                value={form.theme}
                onChange={handleChange}
                className="mt-1 block w-full rounded-xl border p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 border-gray-300 dark:border-gray-700 dark:bg-gray-900"
              >
                <option value="light">Claro</option>
                <option value="dark">Oscuro</option>
              </select>
            </div>

            {/* Sonido */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">Sonido de alertas</p>
                <p className="text-xs text-gray-400">Reproducir sonido al registrar ingreso/salida</p>
              </div>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="soundAlerts"
                  checked={form.soundAlerts}
                  onChange={handleChange}
                  className="sr-only"
                />
                <span
                  className={`relative inline-block w-11 h-6 rounded-full transition-all ${
                    form.soundAlerts ? "bg-indigo-500" : "bg-gray-200 dark:bg-gray-700"
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      form.soundAlerts ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </span>
              </label>
            </div>

            {/* Visual alerts */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">Alertas visuales</p>
                <p className="text-xs text-gray-400">
                  Mostrar advertencias cuando el estacionamiento esté casi lleno
                </p>
              </div>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="visualAlerts"
                  checked={form.visualAlerts}
                  onChange={handleChange}
                  className="sr-only"
                />
                <span
                  className={`relative inline-block w-11 h-6 rounded-full transition-all ${
                    form.visualAlerts ? "bg-indigo-500" : "bg-gray-200 dark:bg-gray-700"
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      form.visualAlerts ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </span>
              </label>
            </div>
          </div>
        </section>

        {/* Acciones */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 space-y-4">
          <h2 className="text-lg font-semibold">Opciones rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-2 rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              Restaurar valores
            </button>

            <button
              type="button"
              onClick={() => setStatus({ type: "info", message: "Función próxima: Reportar incidente." })}
              className="bg-yellow-100 dark:bg-yellow-700 text-yellow-700 dark:text-yellow-100 py-2 rounded-2xl hover:bg-yellow-200 dark:hover:bg-yellow-600 transition"
            >
              Reportar problema
            </button>

            <button
              type="submit"
              disabled={saving}
              className={`bg-indigo-500 text-white py-2 rounded-2xl font-semibold hover:bg-indigo-600 transition ${
                saving ? "opacity-80 cursor-not-allowed" : ""
              }`}
            >
              {saving ? "Guardando..." : "Guardar preferencias"}
            </button>
          </div>
        </section>
      </form>

      {/* Mensajes */}
      <div aria-live="polite" className="min-h-[1.5rem]">
        {status && (
          <div
            className={`px-4 py-2 rounded-lg text-sm ${
              status.type === "success"
                ? "bg-green-50 text-green-700 dark:bg-green-800 dark:text-green-100"
                : status.type === "error"
                ? "bg-red-50 text-red-700 dark:bg-red-800 dark:text-red-100"
                : "bg-blue-50 text-blue-700 dark:bg-blue-800 dark:text-blue-100"
            }`}
          >
            {status.message}
          </div>
        )}
      </div>
    </div>
  );
}
