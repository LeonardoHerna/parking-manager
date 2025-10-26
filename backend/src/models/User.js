import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const preferencesSchema = new mongoose.Schema({
  theme: { type: String, default: "light" },
  soundAlerts: { type: Boolean, default: true },
  visualAlerts: { type: Boolean, default: true },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "Empleado",
  },
  shift: {
    type: String,
    default: "08:00 - 16:00",
  },
  preferences: {
    type: preferencesSchema,
    default: () => ({}),
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
