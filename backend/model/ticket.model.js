const mongoose = require('mongoose');
const {Schema} = mongoose;
const ESTADOS =['abierto', 'en_curso', 'pendiente_cliente', 'resuelto', 'cerrado'];
const PRIORIDADES = ['baja', 'media', 'alta'];

const mensajeSchema = new Schema(
    {
        autor: {type: Schema.Types.ObjectId, ref: 'usuario', required: true},
        texto: {type: String, required: [true, 'El mensaje no puede estar vacio'], trim: true},
    },
    {timestamps: {createdAt: 'fecha', updatedAt: false}, versionKey: false}
);

const cambioEstadoSchema = new Schema(
    {
        usuario: {type: Schema.Types.ObjectId, ref: 'usuario', required: true},
        de: {type: String, enum: [...ESTADOS, null], default: null},
        a: { type: String, enum: ESTADOS, required: true},
    },
    { timestamps: {createdAt: 'fecha', updatedAt: false}, versionKey: false, _id: false}
);

const ticketSchema = new Schema(
    {
        codigo: {type: String, unique: true},
        cliente:{type: Schema.Types.ObjectId, ref: 'usuario', required: true},
        agente: {type: Schema.Types.ObjectId, ref:'usuario', default: null},
        categoria: {type: Schema.Types.ObjectId, ref: 'categoria', required:true},
        pedido: {type: Schema.Types.ObjectId, ref: 'pedido', default: null},
        asunto: {type: String, required: [true,'El asunto es obligatorio'], trim: true, maxlength: 120},
        descripcion: {type: String, required: [true,'La descripcion es obligatoria'], trim: true},
        prioridad: {type: String, enum:PRIORIDADES, default: 'media'},
        estado: {type: String, enum:ESTADOS, default: 'abierto'},
        mensajes: [mensajeSchema],
        historial: [cambioEstadoSchema]
    },
    {timestamps: true, versionKey: false}
);
ticketSchema.pre('validate', function(){
    if (!this.codigo) this.codigo = 'TK-'+ Date.now().toString(36).toUpperCase();
});
const Ticket = mongoose.model('ticket', ticketSchema);
module.exports = {Ticket,ESTADOS, PRIORIDADES};