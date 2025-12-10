import { useState } from "react";
import axios from "axios";
import { API_URL } from "../config"; // ⬅️ IMPORTANTE: agregada

export default function Register({ onRegister, onBackToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const { data } = await axios.post(`${API_URL}/api/auth/register`, {
        name,
        email,
        password,
      });

      onRegister && onRegister(data);
    } catch (err) {
      setError(err.response?.data?.message || "Error al registrar usuario");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      <div className="bg-white shadow-2xl rounded-3xl p-4 w-full max-w-md text-center">
        <div className="mb-8">
          <span className="text-6xl">🚗</span>
          <h1 className="text-3xl font-bold text-gray-800 mt-6">Registro</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
          <input
            type="text"
            placeholder="Nombre completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
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
          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-2xl font-semibold hover:scale-105 transform transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Registrarse
          </button>

          <button
            type="button"
            onClick={onBackToLogin}
            className="w-full bg-gray-200 text-gray-800 py-3 rounded-2xl font-semibold hover:bg-gray-300 transition-all duration-200 shadow-md"
          >
            Volver a Ingresar
          </button>
        </form>

        <p className="text-gray-500 text-sm mt-6">© 2025 Parking Manager</p>
      </div>
    </div>
  );
}
