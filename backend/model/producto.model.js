const mongoose = require('mongoose');

// Merchandising de la tienda
const productoSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: [true, 'El nombre es obligatorio'], unique: true, trim: true },
    categoria: { type: String, required: true, enum: ['ropa', 'perifericos', 'accesorios', 'comida', 'bebida', 'bonos', 'torneos'] }, // tienda + carta + bonos + torneos
    descripcion: { type: String, default: '' },
    precio: { type: Number, required: true, min: [0, 'El precio no puede ser negativo'] },
    tallas: [String], // solo para ropa: ["S", "M", "L", "XL"]
    stock: { type: Number, required: true, min: [0, 'El stock no puede ser negativo'] },
    imagen: { type: String, default: '' },
    activo: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('producto', productoSchema);
