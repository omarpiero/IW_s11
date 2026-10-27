const mongoose = require('mongoose');

const ProveedorSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  contacto: { type: String, trim: true },
  telefono: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  direccion: { type: String, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('Proveedor', ProveedorSchema, 'proveedores');
