import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:4000/api" });

export default function HistorialPagos({ clienteId, onClose }) {
  const [pagos, setPagos] = useState([]);
  const [nuevoPago, setNuevoPago] = useState({
    monto: "",
    fecha: new Date().toISOString().split("T")[0],
    concepto: "Abono Mensual",
    metodo: "Efectivo",
  });
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  const fetchPagos = useCallback(async () => {
    if (!clienteId) return;
    try {
      setLoading(true);
      console.log("🔎 Buscando pagos de cliente:", clienteId);
      const { data } = await API.get(`/clientes/${clienteId}/pagos`);
      // data debería ser cliente.historialPagos (array)
      setPagos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al obtener pagos:", err);
      setPagos([]);
    } finally {
      setLoading(false);
    }
  }, [clienteId]);

  useEffect(() => {
    fetchPagos();
  }, [clienteId, fetchPagos]);

  const agregarPago = async () => {
    if (!nuevoPago.monto) {
      alert("Ingrese un monto");
      return;
    }
    setAdding(true);
    try {
      const body = {
        monto: Number(nuevoPago.monto),
        concepto: nuevoPago.concepto || "Abono Mensual",
        metodo: nuevoPago.metodo || "Efectivo",
        fecha: nuevoPago.fecha ? new Date(nuevoPago.fecha) : new Date(),
      };
      const { data } = await API.post(`/clientes/${clienteId}/pagos`, body);
      // Si el backend devuelve el historial actualizado, lo usamos:
      if (Array.isArray(data)) {
        setPagos(data);
      } else {
        // en caso contrario, volvemos a traer la lista
        await fetchPagos();
      }
      setNuevoPago({
        monto: "",
        fecha: new Date().toISOString().split("T")[0],
        concepto: "Abono Mensual",
        metodo: "Efectivo",
      });
    } catch (err) {
      console.error("Error al guardar el pago:", err);
      alert(err.response?.data?.error || "Hubo un problema al registrar el pago.");
    } finally {
      setAdding(false);
    }
  };

  const eliminarPago = async (pagoId) => {
    if (!window.confirm("¿Seguro que deseas eliminar este pago?")) return;
    try {
      await API.delete(`/clientes/${clienteId}/pagos/${pagoId}`);
      setPagos((prev) => prev.filter((p) => p._id !== pagoId));
    } catch (err) {
      console.error("Error al eliminar pago:", err);
      alert("No se pudo eliminar el pago.");
    }
  };

  if (!clienteId) return null;

  const totalPagos = pagos.reduce((sum, p) => sum + Number(p.monto || 0), 0);

  const formatDate = (iso) => (iso ? new Date(iso).toLocaleDateString() : "—");

  return (
    <div className="p-4 border rounded shadow bg-white max-h-[70vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Historial de Pagos</h2>
        <button onClick={onClose} className="text-red-500 font-bold hover:underline">Cerrar</button>
      </div>

      {loading ? (
        <p>Cargando pagos...</p>
      ) : (
        <>
          <table className="w-full border mb-4 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Fecha</th>
                <th className="p-2 border">Concepto</th>
                <th className="p-2 border">Método</th>
                <th className="p-2 border">Monto</th>
                <th className="p-2 border"></th>
              </tr>
            </thead>
            <tbody>
              {pagos.length > 0 ? (
                pagos.map((p) => (
                  <tr key={p._id}>
                    <td className="p-2 border">{formatDate(p.fecha)}</td>
                    <td className="p-2 border">{p.concepto || "—"}</td>
                    <td className="p-2 border">{p.metodo || "—"}</td>
                    <td className="p-2 border">${p.monto}</td>
                    <td className="p-2 border text-center">
                      <button className="text-sm text-red-600 hover:underline" onClick={() => eliminarPago(p._id)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-2 text-center text-gray-500">Sin pagos registrados</td>
                </tr>
              )}
            </tbody>
          </table>

          <p className="text-right font-semibold mb-2">Total Pagado: ${totalPagos}</p>
        </>
      )}

      {/* Formulario para agregar pago (ahora compatible con historialPagos) */}
      <div className="space-y-2">
        <input type="number" placeholder="Monto" value={nuevoPago.monto} onChange={(e) => setNuevoPago({ ...nuevoPago, monto: e.target.value })} className="border p-2 w-full" />
        <input type="date" value={nuevoPago.fecha} onChange={(e) => setNuevoPago({ ...nuevoPago, fecha: e.target.value })} className="border p-2 w-full" />
        <select value={nuevoPago.concepto} onChange={(e) => setNuevoPago({ ...nuevoPago, concepto: e.target.value })} className="border p-2 w-full">
          <option>Abono Mensual</option>
          <option>Ticket Diario</option>
          <option>Otro</option>
        </select>
        <input type="text" placeholder="Método de pago (Efectivo/Tarjeta/Transferencia)" value={nuevoPago.metodo} onChange={(e) => setNuevoPago({ ...nuevoPago, metodo: e.target.value })} className="border p-2 w-full" />
        <button onClick={agregarPago} disabled={adding} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full">
          {adding ? "Guardando..." : "Agregar Pago"}
        </button>
      </div>
    </div>
  );
}
