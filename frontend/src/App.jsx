import { useState } from "react";
import Dashboard from "./components/dashboard";
import Login from "./components/login";
import Register from "./components/register";

export default function App() {
  const [screen, setScreen] = useState("login"); // "login" | "register" | "dashboard"

  const handleLogin = (credentials) => {
    // Aquí ira la lógica de login con backend
    console.log("Login con:", credentials);
    setScreen("dashboard");
  };

  const handleRegister = (data) => {
    // Aquí ira la lógica de registro con backend
    console.log("Registro con:", data);
    setScreen("dashboard");
  };

  return (
    <div className="h-screen w-screen bg-gray-100">
      {screen === "login" && (
        <Login
          onLogin={handleLogin}
          onGoToRegister={() => setScreen("register")}
        />
      )}
      {screen === "register" && (
        <Register
          onRegister={handleRegister}
          onBackToLogin={() => setScreen("login")}
        />
      )}
      {screen === "dashboard" && <Dashboard onLogout={() => setScreen("login")} />}
    </div>
  );
}
