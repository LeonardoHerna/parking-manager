import express from "express";
import Ingreso from "../models/Ingreso.js";

const router = express.Router();

router.get("/estadisticas", async (req, res) => {
  try {
    const ahora = new Date();
    const inicioHoy = new Date(ahora);
    inicioHoy.setHours(0, 0, 0, 0);
    const finHoy = new Date(ahora);
    finHoy.setHours(23, 59, 59, 999);

    const ingresosHoy = await Ingreso.find({
      horaEntrada: { $gte: inicioHoy, $lte: finHoy },
    });

    const totalIngresos = ingresosHoy.reduce((acc, i) => acc + (i.monto || 0), 0);
    const vehiculosHoy = ingresosHoy.length;
    const promedioTicket = vehiculosHoy ? totalIngresos / vehiculosHoy : 0;

    const capacidad = 60;
    const ocupacionMaxima = (vehiculosHoy / capacidad) * 100;

    // ---- 🔹 Calcular resumen últimos 7 días ----
    const resumen7dias = [];
    for (let i = 6; i >= 0; i--) {
      const dia = new Date();
      dia.setHours(0, 0, 0, 0);
      dia.setDate(dia.getDate() - i);

      const inicio = new Date(dia);
      const fin = new Date(dia);
      fin.setHours(23, 59, 59, 999);

      const ingresosDia = await Ingreso.find({
        horaEntrada: { $gte: inicio, $lte: fin },
      });

      const ingresosTotal = ingresosDia.reduce((acc, v) => acc + (v.monto || 0), 0);

      // Formato de fecha corto: ej. "23/09"
      const diaLabel = dia.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit" });

      resumen7dias.push({
        dia: diaLabel,
        vehiculos: ingresosDia.length,
        ingresos: ingresosTotal,
      });
    }

    res.json({
      totalIngresos,
      vehiculosHoy,
      promedioTicket,
      ocupacionMaxima,
      resumen7dias, // 👈 Ahora lo recibe el frontend
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener estadísticas" });
  }
});

export default router;
