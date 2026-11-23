const mongoose = require('mongoose');

// PCs y salas en una sola colección: el campo "tipo" los distingue
const espacioSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: [true, 'El nombre es obligatorio'], unique: true, trim: true },
    tipo: { type: String, required: true, enum: { values: ['pc', 'sala'], message: 'tipo debe ser pc o sala' } },
    descripcion: { type: String, default: '' },
    capacidad: { type: Number, required: true, min: [1, 'La capacidad mínima es 1'] },
    specs: [String], // ej: ["RTX 4070", "Monitor 240 Hz"] o ["PS5", "TV 65\""]
    precioHora: { type: Number, required: true, min: [0, 'El precio no puede ser negativo'] },
    imagen: { type: String, default: '' },
    activo: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('espacio', espacioSchema);
