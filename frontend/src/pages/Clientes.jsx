import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "../pages/Modal";
import HistorialPagos from "../pages/HistorialDePagos";
import { API_URL } from "../config"; // ⬅️ AGREGADO

export default function Clientes() {
  const [clientes, setClientes] = useState([]);

  // Modal de agregar/editar
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Modal de detalles
  const [detailModal, setDetailModal] = useState(false);
  const [detailData, setDetailData] = useState(null);

  // Modal historial pagos
  const [historyModal, setHistoryModal] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);

  const [_errors, setErrors] = useState({});
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    direccion: "",
    email: "",
    telefono: "",
    vehiculo: { matricula: "", tipo: "Auto", modelo: "" },
    cochera: "",
    piso: "PB",
    cuotaMensual: "",
    formaPago: "Efectivo",
  });

  // 🔹 Traer clientes
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/clientes`);
        setClientes(res.data);
      } catch (err) {
        console.error("Error cargando clientes:", err);
      }
    };
    fetchClientes();
  }, []);

  const resetForm = () => {
    setForm({
      nombre: "",
      apellido: "",
      direccion: "",
      email: "",
      telefono: "",
      vehiculo: { matricula: "", tipo: "Auto", modelo: "" },
      cochera: "",
      piso: "PB",
      cuotaMensual: "",
      formaPago: "Efectivo",
    });
    setErrors({});
  };

  const openAddModal = () => {
    resetForm();
    setIsEditing(false);
    setEditId(null);
    setModalOpen(true);
  };

  const openEditModal = (c) => {
    setForm({
      nombre: c.nombre,
      apellido: c.apellido,
      direccion: c.direccion,
      email: c.email,
      telefono: c.telefono,
      vehiculo: { ...c.vehiculo },
      cochera: c.cochera,
      piso: c.piso,
      cuotaMensual: c.cuotaMensual,
      formaPago: c.formaPago,
    });
    setIsEditing(true);
    setEditId(c._id);
    setModalOpen(true);
  };

  const openDetailModal = (c) => {
    setDetailData(c);
    setDetailModal(true);
  };

  const openHistoryModal = () => {
    if (!selectedCliente) {
      alert("Seleccione un cliente para ver su historial de pagos.");
      return;
    }
    setHistoryModal(true);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.nombre.trim()) newErrors.nombre = "Nombre es obligatorio";
    if (!form.apellido.trim()) newErrors.apellido = "Apellido es obligatorio";
    if (!form.vehiculo.matricula.trim())
      newErrors.matricula = "Matrícula es obligatoria";
    if (!form.cuotaMensual || form.cuotaMensual <= 0)
      newErrors.cuotaMensual = "Cuota válida requerida";
    if (!form.cochera) newErrors.cochera = "Número de cochera obligatorio";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔹 Crear / Editar cliente
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (isEditing) {
        const { data } = await axios.put(
          `${API_URL}/api/clientes/${editId}`,
          form
        );
        setClientes((prev) => prev.map((x) => (x._id === editId ? data : x)));
      } else {
        const { data } = await axios.post(`${API_URL}/api/clientes`, form);
        setClientes([data, ...clientes]);
      }
      setModalOpen(false);
    } catch (err) {
      console.error("Error guardando cliente:", err);
    }
  };

  // 🔹 Eliminar cliente
  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este cliente?")) return;

    try {
      await axios.delete(`${API_URL}/api/clientes/${id}`);
      setClientes((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Error eliminando cliente:", err);
    }
  };

  

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Clientes / Cocheras fijas
      </h1>

      <div className="flex gap-3 flex-wrap">
        <button
          onClick={openAddModal}
          className="bg-indigo-500 text-white py-2 px-4 rounded-2xl hover:bg-indigo-600 transition"
        >
          Agregar Cliente
        </button>

        <select
          className="border rounded-xl px-4 py-2"
          value={selectedCliente?._id || ""}
          onChange={(e) =>
            setSelectedCliente(clientes.find((c) => c._id === e.target.value))
          }
        >
          <option value="">Seleccionar cliente</option>
          {clientes.map((c) => (
            <option key={c._id} value={c._id}>
              {c.nombre} {c.apellido} - {c.vehiculo.matricula}
            </option>
          ))}
        </select>

        <button
          onClick={openHistoryModal}
          className="bg-emerald-500 text-white py-2 px-4 rounded-2xl hover:bg-emerald-600 transition"
        >
          Historial de Pagos
        </button>
      </div>

      {/* Tabla de clientes */}
      <div className="bg-white rounded-2xl shadow-md p-6 overflow-x-auto">
        <table className="w-full text-center min-w-[1300px]">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-2 text-sm text-gray-500">Nombre</th>
              <th className="py-2 text-sm text-gray-500">Apellido</th>
              <th className="py-2 text-sm text-gray-500">Teléfono</th>
              <th className="py-2 text-sm text-gray-500">Email</th>
              <th className="py-2 text-sm text-gray-500">Matrícula</th>
              <th className="py-2 text-sm text-gray-500">Tipo</th>
              <th className="py-2 text-sm text-gray-500">Modelo</th>
              <th className="py-2 text-sm text-gray-500">Piso</th>
              <th className="py-2 text-sm text-gray-500">Cochera</th>
              <th className="py-2 text-sm text-gray-500">Cuota</th>
              <th className="py-2 text-sm text-gray-500">Forma Pago</th>
              <th className="py-2 text-sm text-gray-500">Estado</th>
              <th className="py-2 text-sm text-gray-500">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((c) => (
              <tr
                key={c._id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-2">{c.nombre}</td>
                <td className="py-2">{c.apellido}</td>
                <td className="py-2">{c.telefono}</td>
                <td className="py-2">{c.email}</td>
                <td className="py-2">{c.vehiculo.matricula}</td>
                <td className="py-2">{c.vehiculo.tipo}</td>
                <td className="py-2">{c.vehiculo.modelo}</td>
                <td className="py-2">{c.piso}</td>
                <td className="py-2">{c.cochera}</td>
                <td className="py-2">${c.cuotaMensual}</td>
                <td className="py-2">{c.formaPago}</td>
                <td className="py-2">
                  {c.activo ? (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      Activo
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                      Inactivo
                    </span>
                  )}
                </td>
                <td className="py-2 flex gap-2 px-2">
                  <button
                    onClick={() => openDetailModal(c)}
                    className="text-blue-500 hover:underline text-sm px-1"
                  >
                    Detalles
                  </button>
                  <button
                    onClick={() => openEditModal(c)}
                    className="text-indigo-500 hover:underline text-sm px-1"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="text-red-500 hover:underline text-sm px-1"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Agregar/Editar */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditing ? "Editar Cliente" : "Agregar Cliente"}
        onSubmit={handleSubmit}
        modalClassName="max-w-[1400px] w-full p-4"
      >
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Nombre"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="border rounded-xl p-2 w-1/2"
            />
            <input
              type="text"
              placeholder="Apellido"
              value={form.apellido}
              onChange={(e) => setForm({ ...form, apellido: e.target.value })}
              className="border rounded-xl p-2 w-1/2"
            />
          </div>

          <input
            type="text"
            placeholder="Dirección"
            value={form.direccion}
            onChange={(e) => setForm({ ...form, direccion: e.target.value })}
            className="border rounded-xl p-2 w-full"
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border rounded-xl p-2 w-full"
          />
          <input
            type="tel"
            placeholder="Teléfono"
            value={form.telefono}
            onChange={(e) => setForm({ ...form, telefono: e.target.value })}
            className="border rounded-xl p-2 w-full"
          />

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Matrícula"
              value={form.vehiculo.matricula}
              onChange={(e) =>
                setForm({
                  ...form,
                  vehiculo: { ...form.vehiculo, matricula: e.target.value },
                })
              }
              className="border rounded-xl p-2 w-1/3"
            />
            <input
              type="text"
              placeholder="Modelo"
              value={form.vehiculo.modelo}
              onChange={(e) =>
                setForm({
                  ...form,
                  vehiculo: { ...form.vehiculo, modelo: e.target.value },
                })
              }
              className="border rounded-xl p-2 w-1/3"
            />
            <select
              value={form.vehiculo.tipo}
              onChange={(e) =>
                setForm({
                  ...form,
                  vehiculo: { ...form.vehiculo, tipo: e.target.value },
                })
              }
              className="border rounded-xl p-2 w-1/3"
            >
              <option>Auto</option>
              <option>Camioneta</option>
              <option>Moto</option>
              <option>Bici</option>
            </select>
          </div>

          <div className="flex gap-2">
            <select
              value={form.piso}
              onChange={(e) => setForm({ ...form, piso: e.target.value })}
              className="border rounded-xl p-2 w-1/2"
            >
              <option>PB</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
            </select>
            <input
              type="text"
              placeholder="Cochera"
              value={form.cochera}
              onChange={(e) => setForm({ ...form, cochera: e.target.value })}
              className="border rounded-xl p-2 w-1/2"
            />
          </div>

          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Cuota Mensual"
              value={form.cuotaMensual}
              onChange={(e) =>
                setForm({ ...form, cuotaMensual: e.target.value })
              }
              className="border rounded-xl p-2 w-1/2"
            />
            <select
              value={form.formaPago}
              onChange={(e) => setForm({ ...form, formaPago: e.target.value })}
              className="border rounded-xl p-2 w-1/2"
            >
              <option>Efectivo</option>
              <option>Tarjeta</option>
              <option>Transferencia</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* Modal Detalles */}
      <Modal
        isOpen={detailModal}
        onClose={() => setDetailModal(false)}
        title="Detalle del Cliente"
        hideActions
      >
        {detailData && (
          <div className="space-y-2 text-sm">
            <p>
              <strong>Nombre:</strong> {detailData.nombre} {detailData.apellido}
            </p>
            <p>
              <strong>Email:</strong> {detailData.email}
            </p>
            <p>
              <strong>Teléfono:</strong> {detailData.telefono}
            </p>
            <p>
              <strong>Dirección:</strong> {detailData.direccion}
            </p>
            <p>
              <strong>Matrícula:</strong> {detailData.vehiculo.matricula}
            </p>
            <p>
              <strong>Modelo:</strong> {detailData.vehiculo.modelo}
            </p>
            <p>
              <strong>Cochera:</strong> Piso {detailData.piso} / N°{" "}
              {detailData.cochera}
            </p>
            <p>
              <strong>Cuota:</strong> ${detailData.cuotaMensual}
            </p>
            <p>
              <strong>Forma de pago:</strong> {detailData.formaPago}
            </p>
            <p>
              <strong>Estado:</strong> {detailData.activo ? "Activo" : "Inactivo"}
            </p>
          </div>
        )}
      </Modal>

      {/* Modal Historial Pagos */}
      <Modal
        isOpen={historyModal}
        onClose={() => setHistoryModal(false)}
        title="Historial de Pagos"
        hideActions
        modalClassName="max-w-[800px] w-full p-4"
      >
        {selectedCliente && (
          <HistorialPagos
            clienteId={selectedCliente._id}
            onClose={() => setHistoryModal(false)}
          />
        )}
      </Modal>
    </div>
  );
}
