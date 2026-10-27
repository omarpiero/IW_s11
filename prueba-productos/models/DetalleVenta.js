const mongoose = require('mongoose');

const DetalleVentaSchema = new mongoose.Schema({
  venta_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Venta', 
    required: true 
  },
  producto_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Producto', 
    required: true 
  },
  cantidad: { type: Number, required: true, min: 1 },
  precio_unitario: { type: Number, required: true, min: 0 },
  subtotal: { type: Number, required: true, min: 0 }
}, { timestamps: true });

// Middleware automático: Calcula el subtotal si no viene explícito
DetalleVentaSchema.pre('save', function () {
  if (this.cantidad && this.precio_unitario) {
    this.subtotal = Number((this.cantidad * this.precio_unitario).toFixed(2));
  }
});

module.exports = mongoose.model('DetalleVenta', DetalleVentaSchema, 'detalles_venta');
