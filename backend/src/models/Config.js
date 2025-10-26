import mongoose from "mongoose";

const ConfigSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, default: "Parking Manager" },
    address: { type: String, required: true, default: "" },
    capacity: { type: Number, required: true, default: 50 },
    ratePerHour: { type: Number, required: true, default: 100 },
    currency: { type: String, required: true, default: "UYU" },
    contactPhone: { type: String, required: true, default: "" },
    workingHours: { type: String, default: "08:00 - 20:00" },
    defaultPayment: { type: String, default: "Efectivo" },
    notifications: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Config", ConfigSchema);
