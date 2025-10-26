import User from "../models/User.js";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id }, "secret123", { expiresIn: "7d" });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const user = await User.create({ name, email, password });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar usuario", error });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        shift: user.shift,
        preferences: user.preferences,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Credenciales inválidas" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al iniciar sesión", error });
  }
};

// ✅ Obtener datos del usuario logueado
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el perfil", error });
  }
};

// ✅ Obtener preferencias del usuario
export const getUserPreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(user.preferences);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener preferencias", error });
  }
};

// ✅ Actualizar preferencias
export const updateUserPreferences = async (req, res) => {
  try {
    const { theme, soundAlerts, visualAlerts } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    user.preferences = { theme, soundAlerts, visualAlerts };
    await user.save();

    res.json({ message: "Preferencias actualizadas correctamente", preferences: user.preferences });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar preferencias", error });
  }
};
