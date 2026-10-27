const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  marca: { type: String, required: true, trim: true },
  modelo: { type: String, trim: true },
  precio: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0, default: 0 },
  codigo_barras: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, unique: true, lowercase: true, trim: true },
  descripcion: { type: String, trim: true },
  tienda_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Tienda', 
    required: true 
  },
  proveedor_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Proveedor' 
  }
}, { timestamps: true });

// Middleware automático: genera el slug con nombre normalizado + ultimos 3 digitos del codigo de barras
ProductoSchema.pre('save', function () {
  if (this.isModified('nombre') || this.isModified('codigo_barras')) {
    const nombreLimpio = this.nombre
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const ultimosTres = this.codigo_barras ? this.codigo_barras.slice(-3) : '000';
    this.slug = `${nombreLimpio}-${ultimosTres}`;
  }
});

module.exports = mongoose.model('Producto', ProductoSchema, 'productos');
