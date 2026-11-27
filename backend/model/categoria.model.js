const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema(
    {
        nombre: { type: String, required: [true, 'El nombre es obligatorio'], unique: true, trim:true },
        prioridadPorDefecto: {type: String, enum: ['baja', 'media', 'alta'], default: 'media'},
        activa: { type: Boolean, default: true},
    },
    {timestamps: true, versionKey: false}
);

module.exports = mongoose.model('categoria', categoriaSchema);