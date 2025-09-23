export const calcularMonto = (horaEntrada, horaSalida, servicio) => {
  const diffHoras = Math.ceil((horaSalida - horaEntrada) / (1000 * 60 * 60));

  switch (servicio) {
    case "Hora":
      return diffHoras * 100; // ejemplo $100 por hora
    case "Día":
      return 500; // tarifa diaria
    case "Mensual":
      return 5000; // tarifa mensual fija
    default:
      return 0;
  }
};
