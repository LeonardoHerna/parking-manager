export const calcularMonto = (horaEntrada, horaSalida, servicio) => {
  const diffHoras = Math.ceil((horaSalida - horaEntrada) / (1000 * 60 * 60));

  const tarifaHora = 140;
  const tarifaDiaria = 370;
  const tarifaMensual = 4200;

  switch (servicio) {
    case "Hora":
      return diffHoras * tarifaHora;

    case "Día": {
      const horasPorDia = 24;
      if (diffHoras <= horasPorDia) {
        return tarifaDiaria;
      } else {
        const diasExtras = Math.floor(diffHoras / horasPorDia);
        const horasRestantes = diffHoras % horasPorDia;
        return tarifaDiaria * diasExtras + (horasRestantes > 0 ? tarifaHora * horasRestantes : 0);
      }
    }

    case "Mensual":
      return tarifaMensual;

    default:
      return 0;
  }
};
