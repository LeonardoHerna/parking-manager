import { useState } from "react";

export default function Login({ onLogin, onGoToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      <div className="bg-white shadow-2xl rounded-3xl p-12 w-full max-w-md text-center">
        {/* Logo */}
        <div className="mb-8">
          <span className="text-6xl">🚗</span>
          <h1 className="text-3xl font-bold text-gray-800 mt-4">Parking Manager</h1>
        </div>

        {/* Formulario */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onLogin({ email, password });
          }}
          className="flex flex-col space-y-4"
        >
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />

          {/* Botón Ingresar */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-2xl font-semibold hover:scale-105 transform transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Ingresar
          </button>

          {/* Botón Registrarse */}
          <button
            type="button"
            onClick={onGoToRegister}
            className="w-full bg-gray-200 text-gray-800 py-3 rounded-2xl font-semibold hover:bg-gray-300 transition-all duration-200 shadow-md"
          >
            Registrarse
          </button>
        </form>

        <p className="text-gray-500 text-sm mt-6">© 2025 Parking Manager</p>
      </div>
    </div>
  );
}
