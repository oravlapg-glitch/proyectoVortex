const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema(
    {
        nombre: { 
            type: String, required: [true, 'El nombre es obligatorio'], trim: true },
        email: {
            type: String, 
            required: [true, 'Email obligatorio'],
            unique: true,
            trim : true,
            match : [/^\S+@\S+\.\S+$/, 'Email no valido'],
        },
        password: { 
            type: String, required: true, select: false },
        rol: {
            type: String, 
            enum: ['CLIENTE', 'AGENTE', 'ADMIN'], 
            default: 'CLIENTE' 
        
        },
    },
        {
            timestamps: true,
            versionKey: false
        }
)
module.exports = mongoose.model('usuario', usuarioSchema);