const express = require('express');
const Proveedor = require('../models/Proveedor');

const router = express.Router();

// 1. Obtener todos los proveedores
router.get('/proveedores', async (req, res) => {
  try {
    const proveedores = await Proveedor.find().sort({ createdAt: -1 });
    res.json(proveedores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Obtener proveedor por ID
router.get('/proveedores/:id', async (req, res) => {
  try {
    const proveedor = await Proveedor.findById(req.params.id);
    if (!proveedor) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }
    res.json(proveedor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Crear proveedor
router.post('/proveedores', async (req, res) => {
  try {
    const nuevoProveedor = new Proveedor(req.body);
    const guardado = await nuevoProveedor.save();
    res.status(201).json(guardado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 4. Actualizar proveedor
router.put('/proveedores/:id', async (req, res) => {
  try {
    const actualizado = await Proveedor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!actualizado) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 5. Eliminar proveedor
router.delete('/proveedores/:id', async (req, res) => {
  try {
    const eliminado = await Proveedor.findByIdAndDelete(req.params.id);
    if (!eliminado) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }
    res.json({ mensaje: 'Proveedor eliminado correctamente', proveedor: eliminado });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
