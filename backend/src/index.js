import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import http from "http"; // necesario para Socket.IO
import { Server as SocketIOServer } from "socket.io"; // importar socket.io
import ingresoRoutes from "./routes/IngresoRoutes.js";
import reportesRouter from "./routes/Reportes.js";
import clientesRoutes from "./routes/Clientes.js";

dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Crear servidor HTTP explícito
const server = http.createServer(app);

// Inicializar Socket.IO
const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Escucha de conexiones
io.on("connection", (socket) => {
  console.log("✅ Cliente conectado:", socket.id);
  socket.on("disconnect", () => {
    console.log("❌ Cliente desconectado:", socket.id);
  });
});

// Middleware para exponer io a las rutas
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Rutas
app.use("/api/reportes", reportesRouter);
app.use("/api/ingresos", ingresoRoutes);
app.use("/api/clientes", clientesRoutes);

// Conexión a MongoDB y levantar servidor
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Conectado a MongoDB");
    server.listen(4000, () =>
      console.log("🚀 Backend corriendo en http://localhost:4000")
    );
  })
  .catch(err => console.error("❌ Error en MongoDB:", err));
