// routes/empleadoRoutes.js
const express = require('express');
const mongoose = require('mongoose');
const Empleado = require('../models/Empleado');

const router = express.Router();

// 1. Obtener todos los empleados con los datos de su empresa: GET /api/empleados
router.get('/empleados', async (req, res) => {
  try {
    const empleados = await Empleado.find().populate('empresa_id');
    res.json(empleados);
  } catch (error) {
    console.error('Error al obtener los empleados:', error);
    res.status(500).json({ mensaje: 'Error al obtener los empleados' });
  }
});

// 2. Obtener un empleado por ID, por DNI o por SLUG: GET /api/empleados/:identificador
router.get('/empleados/:identificador', async (req, res) => {
  try {
    const { identificador } = req.params;
    const esObjectId = mongoose.Types.ObjectId.isValid(identificador);

    const empleado = await Empleado.findOne({
      $or: [
        { dni: identificador.trim() },
        { slug: identificador.toLowerCase().trim() },
        ...(esObjectId ? [{ _id: identificador }] : [])
      ]
    }).populate('empresa_id');

    if (!empleado) {
      return res.status(404).json({ mensaje: 'Empleado no encontrado' });
    }

    res.json(empleado);
  } catch (error) {
    console.error('Error al buscar el empleado:', error);
    res.status(500).json({ mensaje: 'Error al obtener el empleado' });
  }
});

module.exports = router;
