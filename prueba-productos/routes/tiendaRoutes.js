const express = require('express');
const mongoose = require('mongoose');
const Tienda = require('../models/Tienda');
const Producto = require('../models/Producto');

const router = express.Router();

// 1. Obtener todas las tiendas
router.get('/tiendas', async (req, res) => {
  try {
    const tiendas = await Tienda.find().sort({ createdAt: -1 });
    res.json(tiendas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Obtener una tienda por ID o por Slug
router.get('/tiendas/:identificador', async (req, res) => {
  try {
    const { identificador } = req.params;
    const esObjectId = mongoose.Types.ObjectId.isValid(identificador);

    const tienda = await Tienda.findOne({
      $or: [
        { slug: identificador.toLowerCase().trim() },
        ...(esObjectId ? [{ _id: identificador }] : [])
      ]
    });

    if (!tienda) {
      return res.status(404).json({ error: 'Tienda no encontrada' });
    }
    res.json(tienda);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Obtener todos los productos de una tienda específica (por ID o por Slug)
router.get('/tiendas/:identificador/productos', async (req, res) => {
  try {
    const { identificador } = req.params;
    const esObjectId = mongoose.Types.ObjectId.isValid(identificador);

    const tienda = await Tienda.findOne({
      $or: [
        { slug: identificador.toLowerCase().trim() },
        ...(esObjectId ? [{ _id: identificador }] : [])
      ]
    });

    if (!tienda) {
      return res.status(404).json({ error: 'Tienda no encontrada' });
    }

    const productos = await Producto.find({ tienda_id: tienda._id }).populate('proveedor_id');
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Crear una nueva tienda (POST)
router.post('/tiendas', async (req, res) => {
  try {
    const nuevaTienda = new Tienda(req.body);
    const guardada = await nuevaTienda.save();
    res.status(201).json(guardada);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 5. Actualizar tienda por ID o por Slug (PUT)
router.put('/tiendas/:identificador', async (req, res) => {
  try {
    const { identificador } = req.params;
    const esObjectId = mongoose.Types.ObjectId.isValid(identificador);

    const tienda = await Tienda.findOne({
      $or: [
        { slug: identificador.toLowerCase().trim() },
        ...(esObjectId ? [{ _id: identificador }] : [])
      ]
    });

    if (!tienda) {
      return res.status(404).json({ error: 'Tienda no encontrada' });
    }

    // Actualizar campos
    Object.assign(tienda, req.body);
    const actualizada = await tienda.save();
    res.json(actualizada);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 6. Eliminar tienda (DELETE)
router.delete('/tiendas/:identificador', async (req, res) => {
  try {
    const { identificador } = req.params;
    const esObjectId = mongoose.Types.ObjectId.isValid(identificador);

    const tienda = await Tienda.findOneAndDelete({
      $or: [
        { slug: identificador.toLowerCase().trim() },
        ...(esObjectId ? [{ _id: identificador }] : [])
      ]
    });

    if (!tienda) {
      return res.status(404).json({ error: 'Tienda no encontrada' });
    }

    res.json({ mensaje: 'Tienda eliminada correctamente', tienda });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
