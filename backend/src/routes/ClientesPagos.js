import express from "express";
import { agregarPago, obtenerHistorialPagos, eliminarPago } from "../controllers/clientePagosController.js";

const router = express.Router();

router.post("/clientes/:id/pagos", agregarPago);
router.get("/clientes/:id/pagos", obtenerHistorialPagos);
router.delete("/clientes/:id/pagos/:pagoId", eliminarPago);

export default router;
