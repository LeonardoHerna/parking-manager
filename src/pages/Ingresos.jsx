import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../pages/Modal";

export default function Ingresos() {
  const [ingresos, setIngresos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIngreso, setEditingIngreso] = useState(null);
  const [form, setForm] = useState({
    patente: "",
    tipoVehiculo: "Auto",
    servicio: "Hora",
    fechaEntrada: "",
    horaEntrada: "",
    monto: 0,
  });

  // Obtener ingresos desde el backend
  useEffect(() => {
    const fetchIngresos = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/api/ingresos");
        setIngresos(data);
      } catch (error) {
        console.error("Error al obtener ingresos:", error);
      }
    };
    fetchIngresos();
  }, []);

  // Abrir modal para agregar
  const openAddModal = () => {
    setForm({
      patente: "",
      tipoVehiculo: "Auto",
      servicio: "Hora",
      fechaEntrada: "",
      horaEntrada: "",
      monto: 0,
    });
    setEditingIngreso(null);
    setModalOpen(true);
  };

  // Abrir modal para editar
  const openEditModal = (ingreso) => {
    const fecha = new Date(ingreso.horaEntrada);
    setForm({
      patente: ingreso.patente,
      tipoVehiculo: ingreso.tipoVehiculo,
      servicio: ingreso.servicio,
      fechaEntrada: fecha.toISOString().slice(0, 10), // YYYY-MM-DD
      horaEntrada: fecha.toTimeString().slice(0, 5),   // HH:MM
      monto: ingreso.monto,
    });
    setEditingIngreso(ingreso);
    setModalOpen(true);
  };

  // Guardar cambios
  const handleSubmit = async () => {
    try {
      const horaEntradaCompleta = new Date(`${form.fechaEntrada}T${form.horaEntrada}`);

      const payload = {
        patente: form.patente.toUpperCase(),
        tipoVehiculo: form.tipoVehiculo,
        servicio: form.servicio,
        horaEntrada: horaEntradaCompleta,
        monto: Number(form.monto),
      };

      if (editingIngreso) {
        const { data } = await axios.put(
          `http://localhost:4000/api/ingresos/${editingIngreso._id}`,
          payload
        );
        setIngresos(
          ingresos.map((item) => (item._id === editingIngreso._id ? data : item))
        );
      } else {
        const { data } = await axios.post(
          "http://localhost:4000/api/ingresos",
          payload
        );
        setIngresos([data, ...ingresos]);
      }

      setModalOpen(false);
    } catch (error) {
      console.error("Error al guardar ingreso:", error);
    }
  };

  // Eliminar ingreso
  const eliminarIngreso = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/ingresos/${id}`);
      setIngresos(ingresos.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error al eliminar ingreso:", error);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Ingresos del parking</h1>

      <button
        onClick={openAddModal}
        className="bg-indigo-500 text-white py-2 px-4 rounded-2xl hover:bg-indigo-600 transition"
      >
        Agregar ingreso
      </button>

      <table className="w-full text-left mt-4 bg-white rounded-2xl shadow-md">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="py-2 text-gray-500">Patente</th>
            <th className="py-2 text-gray-500">Tipo</th>
            <th className="py-2 text-gray-500">Servicio</th>
            <th className="py-2 text-gray-500">Fecha de entrada</th>
            <th className="py-2 text-gray-500">Hora de entrada</th>
            <th className="py-2 text-gray-500">Monto</th>
            <th className="py-2 text-gray-500">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ingresos.map((item) => {
            const fechaEntrada = new Date(item.horaEntrada);
            const fecha = fechaEntrada.toLocaleDateString();
            const hora = fechaEntrada.toTimeString().slice(0, 5); // HH:MM
            return (
              <tr key={item._id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-2">{item.patente}</td>
                <td className="py-2">{item.tipoVehiculo}</td>
                <td className="py-2">{item.servicio}</td>
                <td className="py-2">{fecha}</td>
                <td className="py-2">{hora}</td>
                <td className="py-2 text-green-500 font-semibold">${item.monto}</td>
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
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Modal */}
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
          <select
            value={form.servicio}
            onChange={(e) => setForm({ ...form, servicio: e.target.value })}
            className="border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option>Hora</option>
            <option>Día</option>
            <option>Mensual</option>
          </select>
          <input
            type="date"
            placeholder="Fecha de ingreso"
            value={form.fechaEntrada}
            onChange={(e) => setForm({ ...form, fechaEntrada: e.target.value })}
            className="border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="time"
            placeholder="Hora de ingreso"
            value={form.horaEntrada}
            onChange={(e) => setForm({ ...form, horaEntrada: e.target.value })}
            className="border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="number"
            placeholder="Monto"
            value={form.monto}
            onChange={(e) => setForm({ ...form, monto: e.target.value })}
            className="border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      </Modal>
    </div>
  );
}
