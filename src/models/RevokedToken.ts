import mongoose from "mongoose";

const RevokedTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  revokedAt: { type: Date, default: () => new Date() }
}, { timestamps: true });

// Opcional: índice TTL para limpiar tokens después de X segundos (ej: 3 horas = 10800s)
// RevokedTokenSchema.index({ revokedAt: 1 }, { expireAfterSeconds: 10800 });

export const RevokedToken = mongoose.models.RevokedToken || mongoose.model("RevokedToken", RevokedTokenSchema);
