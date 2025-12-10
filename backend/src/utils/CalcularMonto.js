export const calcularMonto = async (horaEntrada, horaSalida, servicio) => {
  try {
    // --- 1️⃣ Obtener tarifas desde tu backend ---
    const res = await fetch("https://parking-manager-nxr4.onrender.com/api/tarifas");
    if (!res.ok) throw new Error(`Error al obtener tarifas: ${res.status}`);
    const tarifas = await res.json();

    // Transformar el array [{servicio:"Hora", monto:100}, ...] en un mapa { Hora:100, Día:500, ... }
    const tarifasMap = tarifas.reduce((acc, t) => {
      acc[t.servicio] = Number(t.monto);
      return acc;
    }, {});

    // --- 2️⃣ Validar fechas ---
    const entrada = new Date(horaEntrada);
    const salida = new Date(horaSalida);

    if (isNaN(entrada) || isNaN(salida) || salida <= entrada) {
      console.warn("Horas inválidas:", horaEntrada, horaSalida);
      return 0;
    }

    // --- 3️⃣ Calcular diferencia en minutos ---
    const diffMs = salida.getTime() - entrada.getTime();
    const diffMin = Math.floor(diffMs / (1000 * 60)); // minutos totales exactos

    const minutosPorDia = 24 * 60;
    const minutosPorSemana = 7 * minutosPorDia;
    const minutosPorQuincena = 15 * minutosPorDia;

    // --- 4️⃣ Tomar tarifas dinámicas desde backend ---
    const tarifaHora = tarifasMap["Hora"] || 0;
    const tarifaDia = tarifasMap["Día"] || 0;
    const tarifaSemana = tarifasMap["Semana"] || 0;
    const tarifaQuincena = tarifasMap["Quincena"] || 0;
    const tarifaMensual = tarifasMap["Mensual"] || 0;

    // --- 5️⃣ Cálculo del monto según servicio ---
    switch (servicio) {
      case "Hora": {
        const horasCompletas = Math.floor(diffMin / 60);
        const minutosRestantes = diffMin % 60;

        let total = horasCompletas * tarifaHora;

        if (minutosRestantes >= 30 && minutosRestantes < 60) {
          total += 80; // adicional por pasarse más de media hora
        }

        return total;
      }

      case "Día": {
        if (diffMin <= minutosPorDia) {
          return tarifaDia;
        } else {
          const diasCompletos = Math.floor(diffMin / minutosPorDia);
          const minutosRestantes = diffMin % minutosPorDia;
          const horasRestantes = Math.floor(minutosRestantes / 60);
          const minutosSobrantes = minutosRestantes % 60;

          let total = diasCompletos * tarifaDia + horasRestantes * tarifaHora;

          if (minutosSobrantes >= 30 && minutosSobrantes < 60) {
            total += 80;
          }

          return total;
        }
      }

      case "Semana": {
        if (diffMin <= minutosPorSemana) {
          return tarifaSemana;
        } else {
          const semanasCompletas = Math.floor(diffMin / minutosPorSemana);
          const minutosRestantes = diffMin % minutosPorSemana;
          const diasRestantes = Math.floor(minutosRestantes / minutosPorDia);
          const horasRestantes = Math.floor(
            (minutosRestantes % minutosPorDia) / 60
          );
          const minutosSobrantes = (minutosRestantes % minutosPorDia) % 60;

          let total =
            semanasCompletas * tarifaSemana +
            diasRestantes * tarifaDia +
            horasRestantes * tarifaHora;

          if (minutosSobrantes >= 30 && minutosSobrantes < 60) {
            total += 80;
          }

          return total;
        }
      }

      case "Quincena": {
        if (diffMin <= minutosPorQuincena) {
          return tarifaQuincena;
        } else {
          const quincenasCompletas = Math.floor(diffMin / minutosPorQuincena);
          const minutosRestantes = diffMin % minutosPorQuincena;
          const diasRestantes = Math.floor(minutosRestantes / minutosPorDia);
          const horasRestantes = Math.floor(
            (minutosRestantes % minutosPorDia) / 60
          );
          const minutosSobrantes = (minutosRestantes % minutosPorDia) % 60;

          let total =
            quincenasCompletas * tarifaQuincena +
            diasRestantes * tarifaDia +
            horasRestantes * tarifaHora;

          if (minutosSobrantes >= 30 && minutosSobrantes < 60) {
            total += 80;
          }

          return total;
        }
      }

      case "Mensual":
        return tarifaMensual;

      default:
        return 0;
    }
  } catch (error) {
    console.error("Error al calcular el monto:", error);
    return 0;
  }
};

