import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import http from "http"; 
import { Server as SocketIOServer } from "socket.io"; 
import ingresoRoutes from "./routes/IngresoRoutes.js";
import reportesRouter from "./routes/Reportes.js";
import clientesRoutes from "./routes/Clientes.js";
import ClientesPagosRoutes from "./routes/ClientesPagos.js";
import authRoutes from "./routes/AuthRoutes.js";
import configRoutes from "./routes/ConfigRoutes.js";
import tarifasRoutes from "./routes/TarifasRoutes.js";

dotenv.config();

const app = express();

// CORS para desarrollo y producción
app.use(cors({
  origin: [
    "http://localhost:5173",
    process.env.FRONTEND_URL
  ],
  credentials: true
}));

app.use(express.json());

const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      process.env.FRONTEND_URL
    ],
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

io.on("connection", (socket) => {
  console.log("✅ Cliente conectado:", socket.id);
  socket.on("disconnect", () => {
    console.log("❌ Cliente desconectado:", socket.id);
  });
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/api/reportes", reportesRouter);
app.use("/api/ingresos", ingresoRoutes);
app.use("/api/clientes", clientesRoutes);
app.use("/api", ClientesPagosRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/config", configRoutes);
app.use("/api/tarifas", tarifasRoutes);

// ⛔ Ya NO usar puerto fijo
const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Conectado a MongoDB");
    server.listen(PORT, () =>
      console.log(`🚀 Backend corriendo en puerto ${PORT}`)
    );
  })
  .catch(err => console.error("❌ Error en MongoDB:", err));
