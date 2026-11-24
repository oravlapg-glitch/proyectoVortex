const mongoose = require('mongoose');
const espacioSchema = new mongoose.Schema(
    {
        nombre: {type: String, required: [true, 'El nombre es obligatorio'], unique: true, trim: true },
        tipo: {type: String, required: true, enum : { values: ['pc', 'sala'], message: 'tipo debe de ser pc o sala'}},
        descripcion: { type: String, default: ''},
        capacidad: { type: Number,required: true, min: [1, 'Capacidad minima es 1']},
        precioHora: { type: Number, required: true, min: [0,'El precio no puede ser negativo']},
        imagen: { type: String, default : '' },
        activo: { type: Boolean, default: true}
    },
    {timestamps: true, versionKey: false}
);
module.exports = mongoose.model('espacio', espacioSchema);