import mongoose from "mongoose";

const ingresoSchema = new mongoose.Schema({
  patente: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  },
  tipoVehiculo: {
    type: String,
    enum: ["Auto", "Camioneta", "Moto", "Bici"],
    required: true,
  },
  servicio: {
    type: String,
    enum: ["Hora", "Día", "Mensual"],
    required: true,
  },
  horaEntrada: {
    type: Date,
    default: Date.now,
  },
  horaSalida: {
    type: Date,
  },
  monto: {
    type: Number,
    default: 0,
  },
  estado: {
    type: String,
    enum: ["Activo", "Finalizado"],
    default: "Activo",
  },
}, { timestamps: true });

export default mongoose.model("Ingreso", ingresoSchema);
