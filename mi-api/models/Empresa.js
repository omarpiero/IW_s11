const mongoose = require('mongoose');

const EmpresaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  slug: { type: String, unique: true, lowercase: true, trim: true },
  direccion: String,
  telefono: String
}, { timestamps: true });

// Middleware: Normaliza tildes y caracteres especiales a letras limpias antes de generar el slug
EmpresaSchema.pre('save', function () {
  if (this.isModified('nombre')) {
    this.slug = this.nombre
      .normalize('NFD')                     // Separa letras de sus tildes
      .replace(/[\u0300-\u036f]/g, '')     // Elimina las marcas de acento (í -> i)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')         // Reemplaza todo lo no alfanumérico por un guión
      .replace(/^-+|-+$/g, '');            // Elimina guiones sobrantes al inicio o final
  }
});

module.exports = mongoose.model('Empresa', EmpresaSchema, 'empresas');
