import express from "express";
import Config from "../models/Config.js";

const router = express.Router();

// GET /api/config - obtiene o crea configuración
router.get("/", async (req, res) => {
  try {
    let config = await Config.findOne();
    if (!config) {
      config = await Config.create({});
    }
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener configuración" });
  }
});

// PUT /api/config - actualiza configuración
router.put("/", async (req, res) => {
  try {
    let config = await Config.findOne();
    if (!config) {
      config = new Config(req.body);
    } else {
      Object.assign(config, req.body);
    }
    await config.save();
    res.json(config);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al guardar configuración" });
  }
});

export default router;
