import express from "express";
import {
  crearIngreso,
  obtenerIngresos,
  modificarIngreso, 
  finalizarIngreso,
  eliminarIngreso,
} from "../controllers/ingresoController.js";

const router = express.Router();

// Listar todos los ingresos
router.get("/", obtenerIngresos);

// Crear nuevo ingreso
router.post("/", crearIngreso);

// Modificar ingreso existente
router.put("/:id", modificarIngreso); 

// Finalizar ingreso (registrar salida)
router.put("/:id/finalizar", finalizarIngreso);

// Eliminar ingreso
router.delete("/:id", eliminarIngreso);

export default router;
