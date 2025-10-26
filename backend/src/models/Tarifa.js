import mongoose from "mongoose";

const TarifaSchema = new mongoose.Schema({
  servicio: {
    type: String,
    required: true,
    enum: ["Hora", "Día", "Semana", "Quincena","Mensual"],
  },
  monto: {
    type: Number,
    required: true,
  },
});

export default mongoose.model("Tarifa", TarifaSchema);
