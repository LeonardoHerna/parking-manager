import React, { useRef } from "react";

export default function Tickets({ ingreso, onClose }) {
  const ticketRef = useRef();

  const imprimir = () => {
    const contenido = ticketRef.current.innerHTML;
    const ventana = window.open("", "PRINT", "height=400,width=600");
    ventana.document.write(`<html><head><title>Ticket Parking</title></head><body>${contenido}</body></html>`);
    ventana.document.close();
    ventana.focus();
    ventana.print();
    ventana.close();
  };

  if (!ingreso) return null;

  const fechaEntrada = new Date(ingreso.horaEntrada).toLocaleString();
  const fechaSalida = ingreso.horaSalida
    ? new Date(ingreso.horaSalida).toLocaleString()
    : "-";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
        <h2 className="text-xl font-semibold text-center mb-4">Ticket de Comprobante</h2>
        <div ref={ticketRef} className="text-sm text-gray-800 space-y-2">
          <p><strong>Patente:</strong> {ingreso.patente}</p>
          <p><strong>Tipo de Vehículo:</strong> {ingreso.tipoVehiculo}</p>
          <p><strong>Servicio:</strong> {ingreso.servicio}</p>
          <p><strong>Entrada:</strong> {fechaEntrada}</p>
          <p><strong>Salida:</strong> {fechaSalida}</p>
          <p><strong>Monto:</strong> {ingreso.monto ? `$${ingreso.monto}` : "-"}</p>
          <hr className="my-2" />
          <p className="text-center text-xs">Ticket sin valor fiscal</p>
        </div>

        <div className="flex justify-between mt-4">
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-1 rounded hover:bg-gray-500"
          >
            Cerrar
          </button>
          <button
            onClick={imprimir}
            className="bg-indigo-500 text-white px-4 py-1 rounded hover:bg-indigo-600"
          >
            Imprimir
          </button>
        </div>
      </div>
    </div>
  );


}
