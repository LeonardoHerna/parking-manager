import { useState } from "react";
import axios from "axios";
import { API_URL } from "../config"; // ⬅️ Agregado

export default function Login({ onLogin, onGoToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });

      onLogin(data);
    } catch (err) {
      setError(err.response?.data?.message || "Error en el login");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      <div className="bg-white shadow-2xl rounded-3xl p-12 w-full max-w-md text-center">

        {/* Logo */}
        <div className="mb-8">
          <span className="text-6xl">🚗</span>
          <h1 className="text-3xl font-bold text-gray-800 mt-4">Parking Manager</h1>
        </div>

        {/* Formulario */}
        <form onSubmit={handleLogin} className="flex flex-col space-y-4">
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

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-2xl font-semibold hover:scale-105 transform transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Ingresar
          </button>

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
