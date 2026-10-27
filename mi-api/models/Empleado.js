const mongoose = require('mongoose');

const EmpleadoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  dni: { type: String, unique: true, required: true, trim: true },
  slug: { type: String, unique: true, lowercase: true, trim: true },
  cargo: String,
  empresa_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Empresa',
    required: true
  }
}, { timestamps: true });

// Middleware: Genera un slug limpio eliminando acentos (ej: "maría pérez" -> "maria-perez-0002")
EmpleadoSchema.pre('save', function () {
  if (this.isModified('nombre') || this.isModified('apellido') || this.isModified('dni')) {
    const textoLimpio = `${this.nombre} ${this.apellido}`
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const ultimosDigitos = this.dni ? this.dni.slice(-4) : '';
    this.slug = ultimosDigitos ? `${textoLimpio}-${ultimosDigitos}` : textoLimpio;
  }
});

module.exports = mongoose.model('Empleado', EmpleadoSchema, 'empleados');
