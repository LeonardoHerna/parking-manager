import mongoose from "mongoose";

const VehiculoSchema = new mongoose.Schema({
  matricula: { type: String, required: true, uppercase: true, trim: true },
  tipo: { type: String, enum: ["Auto", "Camioneta", "Moto", "Bici"], required: true },
  modelo: String,
});

const ClienteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  direccion: String,
  email: String,
  telefono: String,
  vehiculo: { type: VehiculoSchema, required: true },
  cochera: { type: String },          // número de cochera
  piso: { type: String, enum: ["PB", "1", "2", "3"], default: "PB" },
  cuotaMensual: { type: Number, required: true },
  formaPago: { type: String, enum: ["Efectivo", "Tarjeta", "Débito automático"], default: "Efectivo" },
  fechaPago: Date,                     // último pago realizado
  activo: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model("Cliente", ClienteSchema);
