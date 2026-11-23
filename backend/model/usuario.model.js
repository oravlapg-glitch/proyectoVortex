const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: [true, 'El nombre es obligatorio'], trim: true },
    email: {
      type: String,
      required: [true, 'El email es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'El email no es válido'],
    },
    // select: false → nunca se devuelve en las consultas (salvo con .select('+password'))
    password: { type: String, required: true, select: false },
    rol: { type: String, enum: ['CLIENTE', 'AGENTE', 'ADMIN'], default: 'CLIENTE' },
    activo: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('usuario', usuarioSchema);
