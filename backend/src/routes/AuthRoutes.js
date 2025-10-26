import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  getUserPreferences,
  updateUserPreferences,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getUserProfile);
router.get("/preferences", protect, getUserPreferences);
router.put("/preferences", protect, updateUserPreferences);

export default router;
