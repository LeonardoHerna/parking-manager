import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "../pages/Modal";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [errors, setErrors] = useState({});

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

  // Traer clientes desde el backend
  const fetchClientes = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/clientes?search=${search}`);
      setClientes(res.data);
    } catch (err) {
      console.error("Error cargando clientes:", err);
    }
  };

  // Fetch clientes al cargar y cuando cambia el search
  useEffect(() => {
    fetchClientes();
  });

  const openAddModal = () => {
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
    setModalOpen(true);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.nombre.trim()) newErrors.nombre = "Nombre es obligatorio";
    if (!form.apellido.trim()) newErrors.apellido = "Apellido es obligatorio";
    if (!form.vehiculo.matricula.trim()) newErrors.matricula = "Matrícula es obligatoria";
    if (!form.cuotaMensual || form.cuotaMensual <= 0) newErrors.cuotaMensual = "Cuota válida requerida";
    if (!form.cochera) newErrors.cochera = "Número de cochera obligatorio";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const { data } = await axios.post("http://localhost:4000/api/clientes", form);
      setClientes([data, ...clientes]);
      setModalOpen(false);
    } catch (err) {
      console.error("Error guardando cliente:", err);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Clientes / Cocheras fijas</h1>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <input
          type="text"
          placeholder="Buscar por nombre o patente..."
          className="border rounded-xl px-4 py-2 w-full sm:w-1/2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={openAddModal}
          className="bg-indigo-500 text-white py-2 px-4 rounded-2xl hover:bg-indigo-600 transition"
        >
          Agregar Cliente
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 overflow-x-auto">
        <table className="w-full text-left min-w-[1200px]">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-2 text-sm text-gray-500">Nombre</th>
              <th className="py-2 text-sm text-gray-500">Apellido</th>
              <th className="py-2 text-sm text-gray-500">Teléfono</th>
              <th className="py-2 text-sm text-gray-500">Email</th>
              <th className="py-2 text-sm text-gray-500">Matricula</th>
              <th className="py-2 text-sm text-gray-500">Tipo</th>
              <th className="py-2 text-sm text-gray-500">Modelo</th>
              <th className="py-2 text-sm text-gray-500">Piso</th>
              <th className="py-2 text-sm text-gray-500">Cochera</th>
              <th className="py-2 text-sm text-gray-500">Cuota</th>
              <th className="py-2 text-sm text-gray-500">Forma Pago</th>
              <th className="py-2 text-sm text-gray-500">Último pago</th>
              <th className="py-2 text-sm text-gray-500">Estado</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((c) => (
              <tr key={c._id} className="border-b border-gray-100 hover:bg-gray-50">
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
                <td className="py-2">{c.fechaPago ? new Date(c.fechaPago).toLocaleDateString() : "-"}</td>
                <td className="py-2">
                  {c.activo ? (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Activo</span>
                  ) : (
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">Inactivo</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Agregar Cliente"
        onSubmit={handleSubmit}
        modalClassName="max-w-[1400px] w-full p-4"
      >
        <div className="flex flex-col md:flex-row gap-6 h-[70vh] w-full">
          {/* Columna izquierda */}
          <div className="flex flex-col flex-1 gap-3">
            <input type="text" placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className="border rounded-xl p-2 focus:ring-2 focus:ring-indigo-400 w-full" />
            {errors.nombre && <p className="text-red-500 text-xs">{errors.nombre}</p>}
            <input type="text" placeholder="Apellido" value={form.apellido} onChange={(e) => setForm({ ...form, apellido: e.target.value })} className="border rounded-xl p-2 focus:ring-2 focus:ring-indigo-400 w-full" />
            {errors.apellido && <p className="text-red-500 text-xs">{errors.apellido}</p>}
            <input type="text" placeholder="Dirección" value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} className="border rounded-xl p-2 focus:ring-2 focus:ring-indigo-400 w-full" />
            <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="border rounded-xl p-2 focus:ring-2 focus:ring-indigo-400 w-full" />
            <input type="text" placeholder="Teléfono" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} className="border rounded-xl p-2 focus:ring-2 focus:ring-indigo-400 w-full" />
          </div>

          {/* Columna central */}
          <div className="flex flex-col flex-1 gap-3">
            <input type="text" placeholder="Matrícula" value={form.vehiculo.matricula} onChange={(e) => setForm({ ...form, vehiculo: { ...form.vehiculo, matricula: e.target.value } })} className="border rounded-xl p-2 focus:ring-2 focus:ring-indigo-400 w-full" />
            {errors.matricula && <p className="text-red-500 text-xs">{errors.matricula}</p>}
            <select value={form.vehiculo.tipo} onChange={(e) => setForm({ ...form, vehiculo: { ...form.vehiculo, tipo: e.target.value } })} className="border rounded-xl p-2 focus:ring-2 focus:ring-indigo-400 w-full">
              <option>Auto</option>
              <option>Camioneta</option>
              <option>Moto</option>
              <option>Bici</option>
            </select>
            <input type="text" placeholder="Modelo" value={form.vehiculo.modelo} onChange={(e) => setForm({ ...form, vehiculo: { ...form.vehiculo, modelo: e.target.value } })} className="border rounded-xl p-2 focus:ring-2 focus:ring-indigo-400 w-full" />
          </div>

          {/* Columna derecha */}
          <div className="flex flex-col flex-1 gap-3">
            <select value={form.piso} onChange={(e) => setForm({ ...form, piso: e.target.value })} className="border rounded-xl p-2 focus:ring-2 focus:ring-indigo-400 w-full">
              <option>PB</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
            </select>
            <input type="number" placeholder="Número de cochera" value={form.cochera} onChange={(e) => setForm({ ...form, cochera: e.target.value })} className="border rounded-xl p-2 focus:ring-2 focus:ring-indigo-400 w-full" />
            {errors.cochera && <p className="text-red-500 text-xs">{errors.cochera}</p>}
            <input type="number" placeholder="Cuota mensual" value={form.cuotaMensual} onChange={(e) => setForm({ ...form, cuotaMensual: e.target.value })} className="border rounded-xl p-2 focus:ring-2 focus:ring-indigo-400 w-full" />
            {errors.cuotaMensual && <p className="text-red-500 text-xs">{errors.cuotaMensual}</p>}
            <select value={form.formaPago} onChange={(e) => setForm({ ...form, formaPago: e.target.value })} className="border rounded-xl p-2 focus:ring-2 focus:ring-indigo-400 w-full">
              <option>Efectivo</option>
              <option>Tarjeta</option>
              <option>Débito automático</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
