const mongoose = require('mongoose');
const { Schema } = mongoose;

const lineaSchema = new Schema(
  {
    producto: { type: Schema.Types.ObjectId, ref: 'producto', required: true },
    nombre: { type: String, required: true },
    talla: { type: String, default: null },
    cantidad: { type: Number, required: true, min: 1 },
    precioUnitario: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const pedidoSchema = new Schema(
  {
    codigo: { type: String, unique: true },
    cliente: { type: Schema.Types.ObjectId, ref: 'usuario', required: true },
    lineas: {
      type: [lineaSchema],
      validate: [(v) => v.length > 0, 'El pedido necesita al menos un producto'],
    },
    total: { type: Number, required: true, min: 0 },
    estado: { type: String, enum: ['pendiente', 'listo', 'recogido', 'cancelado'], default: 'pendiente' },
    fechaRecogida: { type: Date, default: null },
  },
  { timestamps: true, versionKey: false }
);

pedidoSchema.pre('validate', function () {
  if (!this.codigo) this.codigo = 'PD-' + Date.now().toString(36).toUpperCase();
});

module.exports = mongoose.model('pedido', pedidoSchema);