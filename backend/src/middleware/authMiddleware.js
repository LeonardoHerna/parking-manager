import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, "secret123");
      req.user = await User.findById(decoded.id).select("_id");
      next();
    } catch (error) {
      res.status(401).json({ message: "Token no válido" });
    }
  }

  if (!token) return res.status(401).json({ message: "No autorizado, token ausente" });
};
