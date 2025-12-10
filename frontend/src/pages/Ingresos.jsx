import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../pages/Modal";
import Tickets from "../pages/Ticket";
import PaymentModal from "../pages/paymentModal";
import { API_URL } from "../config";

export default function Ingresos() {
  const [ingresos, setIngresos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIngreso, setEditingIngreso] = useState(null);
  const [ticketOpen, setTicketOpen] = useState(false);
  const [selectedIngreso, setSelectedIngreso] = useState(null);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [tarifas, setTarifas] = useState([]);


  const [form, setForm] = useState({
    patente: "",
    tipoVehiculo: "Auto",
    servicio: "Hora",
    fechaEntrada: "",
    horaEntrada: "",
    monto: 0,
  });

  const notifyUpdate = () => window.dispatchEvent(new Event("ingresos:update"));

  const fetchIngresos = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/ingresos`);
      setIngresos(Array.isArray(data) ? data : []);
      console.log("API_URL:", API_URL);
    } catch (error) {
      console.error("Error al obtener ingresos:", error);
    }
  };

  const fetchTarifas = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/tarifas`);
      setTarifas(data);
      console.log(data)
    } catch (error) {
      console.error("Error al obtener tarifas:", error);
    }
  };

  useEffect(() => {
    fetchIngresos();
    fetchTarifas();
  }, []);

  const openAddModal = () => {
    const tarifaHora = tarifas.find((t) => t.servicio === "Hora");
    setForm({
      patente: "",
      tipoVehiculo: "Auto",
      servicio: "Hora",
      fechaEntrada: "",
      horaEntrada: "",
      monto: tarifaHora ? Number(tarifaHora.monto) : 0,
    });
    setEditingIngreso(null);
    setModalOpen(true);
  };

  const openEditModal = (ingreso) => {
    const fecha = new Date(ingreso.horaEntrada);
    setForm({
      patente: ingreso.patente,
      tipoVehiculo: ingreso.tipoVehiculo,
      servicio: ingreso.servicio,
      fechaEntrada: fecha.toISOString().slice(0, 10),
      horaEntrada: fecha.toTimeString().slice(0, 5),
      monto: Number(ingreso.monto) || 0,
    });
    setEditingIngreso(ingreso);
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const horaEntradaCompleta = new Date(
        `${form.fechaEntrada}T${form.horaEntrada}`
      );

      // 🔹 Buscar tarifa correspondiente
      const tarifaSeleccionada = tarifas.find(
        (t) => t.servicio === form.servicio
      );
      const montoTarifa = tarifaSeleccionada ? Number(tarifaSeleccionada.monto) : 0;

      if (isNaN(montoTarifa) || montoTarifa <= 0) {
        alert("Error: Monto inválido o tarifa no encontrada.");
        return;
      }

      const payload = {
        patente: form.patente.toUpperCase(),
        tipoVehiculo: form.tipoVehiculo,
        servicio: form.servicio,
        horaEntrada: horaEntradaCompleta,
        monto: montoTarifa,
      };

      if (editingIngreso) {
        const { data } = await axios.put(
          `${API_URL}/api/ingresos/${editingIngreso._id}`,
          payload
        );
        setIngresos((prev) =>
          prev.map((item) => (item._id === editingIngreso._id ? data : item))
        );
      } else {
        const { data } = await axios.post(
          `${API_URL}/api/ingresos`,
          payload
        );
        setIngresos((prev) => [data, ...prev]);
      }

      setModalOpen(false);
      notifyUpdate();
    } catch (error) {
      console.error("Error al guardar ingreso:", error);
      alert("Hubo un problema al guardar el ingreso.");
    }
  };

  const eliminarIngreso = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/ingresos/${id}`);
      setIngresos((prev) => prev.filter((item) => item._id !== id));
      notifyUpdate();
    } catch (error) {
      console.error("Error al eliminar ingreso:", error);
    }
  };

  const marcarSalida = async (id) => {
    try {
      const { data } = await axios.put(
        `${API_URL}/api/ingresos/${id}/finalizar`
      );
      setIngresos((prev) => 
        prev.map((item) => (item._id === id ? data : item))
      );
      notifyUpdate();
    } catch (error) {
      console.error("Error al marcar salida:", error);
    }
  };

  const openTicket = (ingreso) => {
    setSelectedIngreso(ingreso);
    setTicketOpen(true);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Ingresos del parking</h1>

      <div className="flex gap-3">
        <button
          onClick={openAddModal}
          className="bg-indigo-500 text-white py-2 px-4 rounded-2xl hover:bg-indigo-600 transition"
        >
          Agregar ingreso
        </button>

        <button
          onClick={() => setPayModalOpen(true)}
          className="bg-emerald-500 text-white py-2 px-4 rounded-2xl hover:bg-emerald-600 transition"
        >
          Registrar Pago
        </button>
      </div>

      <table className="w-full text-center mt-4 bg-white rounded-2xl shadow-md">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="py-2 text-gray-500">Patente</th>
            <th className="py-2 text-gray-500">Tipo</th>
            <th className="py-2 text-gray-500">Servicio</th>
            <th className="py-2 text-gray-500">Fecha entrada</th>
            <th className="py-2 text-gray-500">Hora entrada</th>
            <th className="py-2 text-gray-500">Hora salida</th>
            <th className="py-2 text-gray-500">Estado</th>
            <th className="py-2 text-gray-500">Tarifa</th>
            <th className="py-2 px-6 text-gray-500">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ingresos.length > 0 ? (
            ingresos.map((item) => {
              const fechaEntrada = new Date(item.horaEntrada);
              const fecha = fechaEntrada.toLocaleDateString();
              const hora = fechaEntrada.toTimeString().slice(0, 5);
              const horaSalida = item.horaSalida
                ? new Date(item.horaSalida).toTimeString().slice(0, 5)
                : "-";

              return (
                <tr
                  key={item._id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-2">{item.patente}</td>
                  <td className="py-2">{item.tipoVehiculo}</td>
                  <td className="py-2">{item.servicio}</td>
                  <td className="py-2">{fecha}</td>
                  <td className="py-2">{hora}</td>
                  <td className="py-2">{horaSalida}</td>
                  <td className="py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        item.estado === "Activo"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.estado}
                    </span>
                  </td>
                  <td className="py-2 text-green-600 font-semibold">
                    {item.monto ? `$${item.monto}` : "-"}
                  </td>
                  <td className="py-2 space-x-2">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => openEditModal(item)}
                    >
                      Modificar
                    </button>
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => eliminarIngreso(item._id)}
                    >
                      Eliminar
                    </button>
                    {item.estado === "Activo" && (
                      <button
                        className="text-purple-500 hover:underline"
                        onClick={() => marcarSalida(item._id)}
                      >
                        Marcar salida
                      </button>
                    )}
                    <button
                      className="text-indigo-500 hover:underline"
                      onClick={() => openTicket(item)}
                    >
                      Ticket
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="9" className="text-center py-4 text-gray-500">
                No hay ingresos registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal agregar/editar ingreso */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingIngreso ? "Modificar ingreso" : "Agregar ingreso"}
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col space-y-3">
          <input
            type="text"
            placeholder="Patente"
            value={form.patente}
            onChange={(e) => setForm({ ...form, patente: e.target.value })}
            className="border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <select
            value={form.tipoVehiculo}
            onChange={(e) => setForm({ ...form, tipoVehiculo: e.target.value })}
            className="border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option>Auto</option>
            <option>Camioneta</option>
            <option>Moto</option>
            <option>Bici</option>
          </select>

          {/* Select de servicio con tarifas dinámicas */}
          <select
            value={form.servicio || "Hora"}
            onChange={(e) => {
              const nuevoServicio = e.target.value;
              const tarifa = tarifas.find((t) => t.servicio === nuevoServicio);
              setForm({
                ...form,
                servicio: nuevoServicio,
                monto: tarifa ? Number(tarifa.monto) : 0,
              });
            }}
            className="border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">Seleccione servicio...</option>
            {tarifas.map((t) => (
              <option key={t.servicio} value={t.servicio}>
                {t.servicio} — ${t.monto}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={form.fechaEntrada}
            onChange={(e) => setForm({ ...form, fechaEntrada: e.target.value })}
            className="border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="time"
            value={form.horaEntrada}
            onChange={(e) => setForm({ ...form, horaEntrada: e.target.value })}
            className="border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          {/* Campo de monto solo lectura */}
          <input
            type="number"
            placeholder="Monto"
            value={form.monto}
            readOnly
            className="border border-gray-300 rounded-xl p-2 bg-gray-100 text-gray-600 focus:outline-none"
          />
        </div>
      </Modal>

      {ticketOpen && (
        <Tickets ingreso={selectedIngreso} onClose={() => setTicketOpen(false)} />
      )}

      <PaymentModal
        isOpen={payModalOpen}
        onClose={() => setPayModalOpen(false)}
        onPaymentSaved={fetchIngresos}
      />
    </div>
  );
}


