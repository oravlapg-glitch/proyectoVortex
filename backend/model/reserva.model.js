const mongoose = require('mongoose');
const { Schema } = mongoose;

const reservaSchema = new Schema(
  {
    cliente: { type: Schema.Types.ObjectId, ref: 'usuario', required: true },
    espacio: { type: Schema.Types.ObjectId, ref: 'espacio', required: true },
    fecha: { type: String, required: true },             // "2026-12-05"
    horaInicio: { type: Number, required: true, min: 0, max: 23 },
    horaFin: { type: Number, required: true, min: 1, max: 24 },
    precioTotal: { type: Number, required: true, min: 0 },
    estado: { type: String, enum: ['confirmada', 'cancelada', 'completada'], default: 'confirmada' },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('reserva', reservaSchema);