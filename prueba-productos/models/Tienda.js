const mongoose = require('mongoose');

const TiendaSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, lowercase: true, trim: true },
  direccion: { type: String, trim: true },
  telefono: { type: String, trim: true },
  ruc: { type: String, required: true, unique: true, trim: true }
}, { timestamps: true });

// Middleware automático: genera el slug normalizado a partir del nombre comercial
TiendaSchema.pre('save', function () {
  if (this.isModified('nombre')) {
    this.slug = this.nombre
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
});

module.exports = mongoose.model('Tienda', TiendaSchema, 'tiendas');
