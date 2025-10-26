import mongoose from "mongoose";
import Tarifa from "./models/Tarifa.js";

const MONGO_URI = "mongodb://127.0.0.1:27017/parkingDB"; 

const seedTarifas = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Conectado a MongoDB");

    // Elimina las tarifas anteriores (opcional)
    await Tarifa.deleteMany();

    // Inserta tarifas iniciales
    await Tarifa.insertMany([
      { servicio: "Hora", monto: 140 },
      { servicio: "Día", monto: 370 },
      { servicio: "Semana", monto: 2500 },
      { servicio: "Quincena", monto: 3000 },
      { servicio: "Mensual", monto: 4200 },
    ]);

    console.log("✅ Tarifas insertadas correctamente");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error insertando tarifas:", error);
  }
};

seedTarifas();
