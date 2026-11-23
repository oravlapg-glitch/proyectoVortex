const mongoose = require('mongoose');
const { Schema } = mongoose;

// La fecha se guarda como TEXTO "2026-12-05" y las horas como números (18 = 18:00).
// Así evitamos los líos de zonas horarias (Mongo guarda las Date en UTC).
const reservaSchema = new Schema(
  {
    cliente: { type: Schema.Types.ObjectId, ref: 'usuario', required: true },
    espacio: { type: Schema.Types.ObjectId, ref: 'espacio', required: true },
    fecha: { type: String, required: true },
    horaInicio: { type: Number, required: true, min: 0, max: 23 },
    horaFin: { type: Number, required: true, min: 1, max: 24 },
    precioTotal: { type: Number, required: true, min: 0 },
    estado: { type: String, enum: ['confirmada', 'cancelada', 'completada'], default: 'confirmada' },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('reserva', reservaSchema);
