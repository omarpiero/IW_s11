// routes/empresaRoutes.js
const express = require('express');
const mongoose = require('mongoose');
const Empresa = require('../models/Empresa');
const Empleado = require('../models/Empleado');

const router = express.Router();

// 1. Obtener todas las empresas: GET /api/empresas
router.get('/empresas', async (req, res) => {
  try {
    const empresas = await Empresa.find();
    res.json(empresas);
  } catch (error) {
    console.error('Error al listar empresas:', error);
    res.status(500).json({ mensaje: 'Error al obtener las empresas' });
  }
});

// 2. Obtener una empresa por ID o por SLUG: GET /api/empresas/:identificador
router.get('/empresas/:identificador', async (req, res) => {
  try {
    const { identificador } = req.params;
    const esObjectId = mongoose.Types.ObjectId.isValid(identificador);

    // Busca por slug amigable O por _id original
    const empresa = await Empresa.findOne({
      $or: [
        { slug: identificador.toLowerCase().trim() },
        ...(esObjectId ? [{ _id: identificador }] : [])
      ]
    });

    if (!empresa) {
      return res.status(404).json({ mensaje: 'Empresa no encontrada' });
    }
    res.json(empresa);
  } catch (error) {
    console.error('Error al buscar la empresa:', error);
    res.status(500).json({ mensaje: 'Error al obtener la empresa' });
  }
});

// 3. Obtener todos los empleados de una empresa (por ID o por SLUG): GET /api/empresas/:identificador/empleados
router.get('/empresas/:identificador/empleados', async (req, res) => {
  try {
    const { identificador } = req.params;
    const esObjectId = mongoose.Types.ObjectId.isValid(identificador);

    // 1. Buscamos primero la empresa por su slug o ID
    const empresa = await Empresa.findOne({
      $or: [
        { slug: identificador.toLowerCase().trim() },
        ...(esObjectId ? [{ _id: identificador }] : [])
      ]
    });

    if (!empresa) {
      return res.status(404).json({ mensaje: 'Empresa no encontrada' });
    }

    // 2. Traemos los empleados que pertenecen al _id de esa empresa
    const empleados = await Empleado.find({ empresa_id: empresa._id });
    res.json(empleados);
  } catch (error) {
    console.error('Error al obtener empleados de la empresa:', error);
    res.status(500).json({ mensaje: 'Error al obtener los empleados' });
  }
});

module.exports = router;
