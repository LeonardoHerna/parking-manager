import Ingreso from "../models/Ingreso.js";
import { calcularMonto } from "../utils/CalcularMonto.js";

// Crear nuevo ingreso
export const crearIngreso = async (req, res) => {
  try {
    console.log("✅ Petición recibida en crearIngreso");
    const ingreso = new Ingreso(req.body);
    await ingreso.save();
    res.status(201).json(ingreso);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Listar todos los ingresos
export const obtenerIngresos = async (req, res) => {
  try {
    const ingresos = await Ingreso.find().sort({ createdAt: -1 });
    res.json(ingresos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Modificar ingreso existente
export const modificarIngreso = async (req, res) => {
  try {
    const { id } = req.params;
    const ingreso = await Ingreso.findById(id);
    if (!ingreso) return res.status(404).json({ message: "Ingreso no encontrado" });

    ingreso.patente = req.body.patente ?? ingreso.patente;
    ingreso.tipoVehiculo = req.body.tipoVehiculo ?? ingreso.tipoVehiculo;
    ingreso.servicio = req.body.servicio ?? ingreso.servicio;
    ingreso.horaEntrada = req.body.horaEntrada ?? ingreso.horaEntrada;
    ingreso.monto = req.body.monto ?? ingreso.monto;

    await ingreso.save();
    res.json(ingreso);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Finalizar ingreso (registrar salida)
export const finalizarIngreso = async (req, res) => {
  try {
    const { id } = req.params;
    const ingreso = await Ingreso.findById(id);
    if (!ingreso) return res.status(404).json({ message: "Ingreso no encontrado" });

    ingreso.horaSalida = new Date();
    ingreso.estado = "Finalizado";

    // 🔹 Esperar correctamente el cálculo del monto
    ingreso.monto = await calcularMonto(ingreso.horaEntrada, ingreso.horaSalida, ingreso.servicio);

    await ingreso.save();
    res.json(ingreso);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar ingreso
export const eliminarIngreso = async (req) => {
  const { id } = req.params;
  const eliminado = await Ingreso.findByIdAndDelete(id);
  if (!eliminado) {
    throw new Error("Ingreso no encontrado");
  }
  return eliminado;
};
