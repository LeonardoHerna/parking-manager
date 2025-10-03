import express from "express";
import Cliente from "../models/Clientes.js"; 


const router = express.Router();




// 🔹 Listado con filtros opcionales (por nombre, apellido o matrícula)
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;
    const query = search
      ? {
          $or: [
            { nombre: new RegExp(search, "i") },
            { apellido: new RegExp(search, "i") },
            { "vehiculo.matricula": new RegExp(search, "i") }
          ]
        }
      : {};
    const clientes = await Cliente.find(query).sort({ nombre: 1 });
    res.json(clientes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener clientes" });
  }
});

// 🔹 Alta
router.post("/", async (req, res) => {
  try {
    // Validación mínima: nombre, apellido, vehículo.matricula, cuotaMensual
    const { nombre, apellido, vehiculo, cuotaMensual } = req.body;
    if (!nombre || !apellido || !vehiculo?.matricula || !cuotaMensual) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const nuevoCliente = new Cliente(req.body);
    const cliente = await nuevoCliente.save();
    res.json(cliente);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Error al crear cliente" });
  }
});

// 🔹 Edición
router.put("/:id", async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(cliente);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Error al actualizar cliente" });
  }
});

// 🔹 Baja
router.delete("/:id", async (req, res) => {
  try {
    await Cliente.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Error al eliminar cliente" });
  }
});

export default router;

