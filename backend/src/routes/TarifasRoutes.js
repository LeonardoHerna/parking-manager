import express from "express";
import Tarifa from "../models/Tarifa.js";

const router = express.Router();

// Obtener todas las tarifas
router.get("/", async (req, res) => {
  try {
    const tarifas = await Tarifa.find();
    res.json(tarifas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener tarifas" });
  }
});

export default router;
