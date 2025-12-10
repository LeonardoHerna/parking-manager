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
  formaPago: { type: String, enum: ["Efectivo", "Tarjeta", "Transferencia"], default: "Efectivo" },
  fechaPago: Date,                     // último pago realizado
  activo: { type: Boolean, default: true },

  // 🔹 Historial general de pagos (ya existente)
  historialPagos: [
    {
      fecha: { type: Date, default: Date.now },
      monto: { type: Number, required: true },
      concepto: { 
        type: String,
        enum: ["Abono Mensual", "Ticket Diario", "Otro"],
        default: "Abono Mensual"
      },
      metodo: { 
        type: String,
        enum: ["Efectivo", "Tarjeta", "Transferencia"],
        default: "Efectivo"
      }
    }
  ],

  // 🔹 NUEVO: Pagos específicos para el componente ClientesPagos
  clientesPagos: [
    {
      fecha: { type: Date, default: Date.now },
      monto: { type: Number, required: true },
      mes: { type: String, required: true },          // ejemplo: "Septiembre"
      anio: { type: Number, required: true },         // ejemplo: 2025
      metodo: { type: String, enum: ["Efectivo", "Tarjeta", "Transferencia"], default: "Efectivo" },
      observacion: { type: String }                   // campo opcional
    }
  ]

}, { timestamps: true });

export default mongoose.model("Cliente", ClienteSchema);
