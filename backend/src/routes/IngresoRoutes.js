import express from "express";
import {
  crearIngreso,
  obtenerIngresos,
  modificarIngreso,
  finalizarIngreso as finalizarIngresoController,
  eliminarIngreso,
} from "../controllers/ingresoController.js";

import { calcularMonto } from "../utils/CalcularMonto.js"; // importa tu función

const router = express.Router();

// Listar todos los ingresos
router.get("/", obtenerIngresos);

// Crear nuevo ingreso
router.post("/", async (req, res) => {
  try {
    const nuevoIngreso = await crearIngreso(req, res);

    // Emitir evento a todos los clientes conectados
    req.io?.emit("ingresoCreado", nuevoIngreso);

    // responder al cliente
    res.status(201).json(nuevoIngreso);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Modificar ingreso existente
router.put("/:id", async (req, res) => {
  try {
    const ingresoModificado = await modificarIngreso(req, res);

    // Emitir evento de actualización
    req.io?.emit("ingresoActualizado", ingresoModificado);

    res.json(ingresoModificado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Finalizar ingreso (registrar salida)
router.put("/:id/finalizar", async (req, res) => {
  try {
    const ingreso = await finalizarIngresoController(req, res); // tu función original

    if (!ingreso.monto) {
      ingreso.monto = calcularMonto(
        new Date(ingreso.horaEntrada),
        new Date(),
        ingreso.servicio
      );
      ingreso.horaSalida = new Date();
      ingreso.estado = "Inactivo";
      await ingreso.save();
    }

    // Emitir evento de actualización
    req.io?.emit("ingresoActualizado", ingreso);

    res.json(ingreso);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar ingreso
router.delete("/:id", async (req, res) => {
  try {
    const eliminado = await eliminarIngreso(req);

    // Emitir evento de eliminación
    req.io?.emit("ingresoEliminado", req.params.id);

    res.json({ message: "Ingreso eliminado correctamente", eliminado });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;
