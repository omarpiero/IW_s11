const mongoose = require('mongoose');

const VentaSchema = new mongoose.Schema({
  numero_factura: { type: String, required: true, unique: true, trim: true },
  fecha: { type: Date, default: Date.now },
  total: { type: Number, required: true, default: 0, min: 0 },
  metodo_pago: { 
    type: String, 
    required: true, 
    default: 'Efectivo',
    enum: ['Efectivo', 'Tarjeta de Crédito', 'Tarjeta de Débito', 'Transferencia Bancaria', 'Yape / Plin']
  },
  cliente_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Cliente', 
    required: true 
  },
  tienda_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Tienda', 
    required: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('Venta', VentaSchema, 'ventas');
