import Cliente from "../models/Clientes.js"; 

export const agregarPago = async (req, res) => {
  try {
    const { id } = req.params;
    const { monto, concepto, metodo, fecha } = req.body;

    if (monto == null || concepto == null || metodo == null) {
      return res.status(400).json({ error: "Faltan campos obligatorios (monto, concepto, metodo)" });
    }

    const cliente = await Cliente.findById(id);
    if (!cliente) return res.status(404).json({ error: "Cliente no encontrado" });

    const nuevo = {
      monto,
      concepto,
      metodo,
      fecha: fecha ? new Date(fecha) : new Date(),
    };

    cliente.historialPagos.push(nuevo);
    await cliente.save();

    // Devuelvo el historial actualizado para facilitar actualización en frontend
    return res.status(201).json(cliente.historialPagos);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error al agregar pago" });
  }
};

export const obtenerHistorialPagos = async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await Cliente.findById(id).select("historialPagos");
    if (!cliente) return res.status(404).json({ error: "Cliente no encontrado" });
    return res.json(cliente.historialPagos || []);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error al obtener historial de pagos" });
  }
};

export const eliminarPago = async (req, res) => {
  try {
    const { id, pagoId } = req.params;
    const cliente = await Cliente.findById(id);
    if (!cliente) return res.status(404).json({ error: "Cliente no encontrado" });

    const pago = cliente.historialPagos.id(pagoId);
    if (!pago) return res.status(404).json({ error: "Pago no encontrado" });

    pago.remove();
    await cliente.save();

    return res.json({ success: true, historialPagos: cliente.historialPagos });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error al eliminar pago" });
  }
};
