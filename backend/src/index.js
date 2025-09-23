import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import ingresoRoutes from "./routes/IngresoRoutes.js";
import reportesRouter from "./routes/Reportes.js";
import clientesRoutes from "./routes/Clientes.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Rutas

app.use("/api/reportes", reportesRouter);
app.use("/api/ingresos", ingresoRoutes);
app.use("/api/clientes", clientesRoutes);



// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Conectado a MongoDB");
    app.listen(4000, () => console.log("🚀 Backend corriendo en http://localhost:4000"));
  })
  .catch(err => console.error("❌ Error en MongoDB:", err));
