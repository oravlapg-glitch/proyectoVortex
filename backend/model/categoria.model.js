const mongoose = require('mongoose');

// Categorías de ticket: Incidencia técnica, Reservas, Tienda...
const categoriaSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: [true, 'El nombre es obligatorio'], unique: true, trim: true },
    // Prioridad con la que nace un ticket de esta categoría (el agente la puede cambiar)
    prioridadPorDefecto: { type: String, enum: ['baja', 'media', 'alta'], default: 'media' },
    activa: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('categoria', categoriaSchema);
