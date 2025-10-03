import { useState } from "react";
import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:4000/api" });

export default function PaymentModal({ isOpen, onClose, onPaymentSaved }) {
  const [payForm, setPayForm] = useState({
    matricula: "",
    clienteId: "",
    nombre: "",
    monto: "",
    metodo: "Efectivo",
    fecha: new Date().toISOString().split("T")[0],
    concepto: "Abono Mensual",
  });

  const [payErrors, setPayErrors] = useState({});
  const [payLoading, setPayLoading] = useState(false);
  const [foundClient, setFoundClient] = useState(null);

  if (!isOpen) return null;

  const resetState = () => {
    setPayForm({
      matricula: "",
      clienteId: "",
      nombre: "",
      monto: "",
      metodo: "Efectivo",
      fecha: new Date().toISOString().split("T")[0],
      concepto: "Abono Mensual",
    });
    setPayErrors({});
    setFoundClient(null);
  };

  const closeModal = () => {
    resetState();
    onClose();
  };

  const searchClientByMatricula = async () => {
    if (!payForm.matricula.trim()) {
      setPayErrors({ matricula: "Ingrese una matrícula" });
      return;
    }
    try {
      const { data } = await API.get(
        `/clientes?search=${payForm.matricula.trim().toUpperCase()}`
      );
      if (Array.isArray(data) && data.length > 0) {
        const cliente = data[0];
        setFoundClient(cliente);
        setPayForm((prev) => ({
          ...prev,
          clienteId: cliente._id,
          nombre: cliente.nombre,
        }));
        setPayErrors({});
      } else {
        setFoundClient(null);
        setPayErrors({ matricula: "No se encontró cliente" });
      }
    } catch (err) {
      console.error("Error buscar cliente:", err);
      setFoundClient(null);
      setPayErrors({ matricula: "Error al buscar cliente" });
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!payForm.monto) errors.monto = "Ingrese un monto";
    if (!payForm.clienteId) errors.matricula = "Seleccione un cliente válido";
    if (Object.keys(errors).length) {
      setPayErrors(errors);
      return;
    }

    setPayLoading(true);
    try {
      const body = {
        monto: parseFloat(payForm.monto),
        concepto: payForm.concepto || "Abono Mensual",
        metodo: payForm.metodo || "Efectivo",
        fecha: payForm.fecha ? new Date(payForm.fecha) : new Date(),
      };

      // POST al endpoint que trabajará con historialPagos
      // Nota: ruta unificada -> /api/clientes/:id/pagos
      const { data } = await API.post(`/clientes/${payForm.clienteId}/pagos`, body);

      // Si backend devuelve el historial actualizado, podríamos pasarlo hacia el padre.
      // onPaymentSaved puede recibir data o simplemente ser una señal de refresh.
      if (onPaymentSaved) onPaymentSaved(data);
      closeModal();
    } catch (err) {
      console.error("Error al guardar pago:", err);
      setPayErrors({
        submit: err.response?.data?.error || "Error al guardar el pago",
      });
    } finally {
      setPayLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-[640px] w-full p-4">
        <h2 className="text-lg font-semibold mb-4">Registrar Pago</h2>

        <form onSubmit={handlePaymentSubmit} className="flex flex-col gap-3">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Matrícula"
              value={payForm.matricula}
              onChange={(e) =>
                setPayForm({ ...payForm, matricula: e.target.value.toUpperCase() })
              }
              className="border rounded-xl p-2 w-1/2"
            />
            <button
              type="button"
              onClick={searchClientByMatricula}
              className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600"
            >
              Buscar cliente
            </button>
            <button
              type="button"
              onClick={() => {
                setFoundClient(null);
                setPayForm({ ...payForm, clienteId: "", nombre: "" });
                setPayErrors({});
              }}
              className="bg-gray-200 px-4 py-2 rounded-xl"
            >
              Limpiar
            </button>
          </div>
          {payErrors.matricula && (
            <p className="text-red-500 text-xs">{payErrors.matricula}</p>
          )}

          {foundClient && (
            <div className="p-2 border rounded bg-gray-50">
              <p className="text-sm">
                <strong>Cliente encontrado:</strong> {foundClient.nombre} {foundClient.apellido}
              </p>
              <p className="text-sm"><strong>Matrícula:</strong> {foundClient.vehiculo?.matricula}</p>
              <p><strong>Cuota mensual:</strong> {foundClient.cuotaMensual ? `$ ${foundClient.cuotaMensual}` : "No registrada"}</p>
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Monto"
              value={payForm.monto}
              onChange={(e) => setPayForm({ ...payForm, monto: e.target.value })}
              className="border rounded-xl p-2 w-1/2"
            />
            <select
              value={payForm.metodo}
              onChange={(e) => setPayForm({ ...payForm, metodo: e.target.value })}
              className="border rounded-xl p-2 w-1/2"
            >
              <option>Efectivo</option>
              <option>Tarjeta</option>
              <option>Transferencia</option>
            </select>
          </div>

          <select
            value={payForm.concepto}
            onChange={(e) => setPayForm({ ...payForm, concepto: e.target.value })}
            className="border rounded-xl p-2"
          >
            <option>Abono Mensual</option>
            <option>Ticket Diario</option>
            <option>Otro</option>
          </select>

          <input
            type="date"
            value={payForm.fecha}
            onChange={(e) => setPayForm({ ...payForm, fecha: e.target.value })}
            className="border rounded-xl p-2"
          />

          {payErrors.submit && <p className="text-red-500 text-xs">{payErrors.submit}</p>}

          <div className="flex justify-end gap-2 mt-2">
            <button type="button" onClick={closeModal} className="px-4 py-2 rounded bg-gray-200">Cancelar</button>
            <button type="submit" disabled={payLoading} className="px-4 py-2 rounded bg-emerald-600 text-white">
              {payLoading ? "Guardando..." : "Guardar pago"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
