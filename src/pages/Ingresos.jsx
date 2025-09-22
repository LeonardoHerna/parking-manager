import { useState } from "react";
import Modal from "../pages/Modal";

export default function Ingresos() {
  const [ingresos, setIngresos] = useState([
    { id: 1, matricula: "ABC-1234", hora: "08:15", monto: 25, metodo: "Efectivo" },
    { id: 2, matricula: "XYZ-5678", hora: "08:45", monto: 20, metodo: "Tarjeta" },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingIngreso, setEditingIngreso] = useState(null);
  const [form, setForm] = useState({ matricula: "", hora: "", monto: "", metodo: "Efectivo" });

  // Abrir modal para agregar
  const openAddModal = () => {
    setForm({ matricula: "", hora: "", monto: "", metodo: "Efectivo" });
    setEditingIngreso(null);
    setModalOpen(true);
  };

  // Abrir modal para editar
  const openEditModal = (ingreso) => {
    setForm({ ...ingreso });
    setEditingIngreso(ingreso);
    setModalOpen(true);
  };

  // Guardar cambios
  const handleSubmit = () => {
    if (editingIngreso) {
      // Modificar
      setIngresos(
        ingresos.map((item) => (item.id === editingIngreso.id ? { ...form, id: item.id } : item))
      );
    } else {
      // Agregar
      setIngresos([...ingresos, { ...form, id: Date.now() }]);
    }
  };

  // Eliminar ingreso
  const eliminarIngreso = (id) => {
    setIngresos(ingresos.filter((item) => item.id !== id));
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
            <th className="py-2 text-gray-500">Matrícula</th>
            <th className="py-2 text-gray-500">Hora</th>
            <th className="py-2 text-gray-500">Monto</th>
            <th className="py-2 text-gray-500">Método</th>
            <th className="py-2 text-gray-500">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ingresos.map((item) => (
            <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-2">{item.matricula}</td>
              <td className="py-2">{item.hora}</td>
              <td className="py-2 text-green-500 font-semibold">${item.monto}</td>
              <td className="py-2">{item.metodo}</td>
              <td className="py-2 space-x-2">
                <button
                  className="text-blue-500 hover:underline"
                  onClick={() => openEditModal(item)}
                >
                  Modificar
                </button>
                <button
                  className="text-red-500 hover:underline"
                  onClick={() => eliminarIngreso(item.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
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
            placeholder="Matrícula"
            value={form.matricula}
            onChange={(e) => setForm({ ...form, matricula: e.target.value })}
            className="border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="text"
            placeholder="Hora (HH:MM)"
            value={form.hora}
            onChange={(e) => setForm({ ...form, hora: e.target.value })}
            className="border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="number"
            placeholder="Monto"
            value={form.monto}
            onChange={(e) => setForm({ ...form, monto: e.target.value })}
            className="border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <select
            value={form.metodo}
            onChange={(e) => setForm({ ...form, metodo: e.target.value })}
            className="border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option>Efectivo</option>
            <option>Tarjeta</option>
            <option>App móvil</option>
          </select>
        </div>
      </Modal>
    </div>
  );
}
