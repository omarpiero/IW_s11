const express = require('express');
const mongoose = require('mongoose');
const Cliente = require('../models/Cliente');

const router = express.Router();

// 1. Obtener todos los clientes
router.get('/clientes', async (req, res) => {
  try {
    const clientes = await Cliente.find().sort({ createdAt: -1 });
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Obtener un cliente por DNI o ID
router.get('/clientes/:identificador', async (req, res) => {
  try {
    const { identificador } = req.params;
    const esObjectId = mongoose.Types.ObjectId.isValid(identificador);

    const cliente = await Cliente.findOne({
      $or: [
        { dni: identificador.trim() },
        ...(esObjectId ? [{ _id: identificador }] : [])
      ]
    });

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Crear nuevo cliente
router.post('/clientes', async (req, res) => {
  try {
    const nuevoCliente = new Cliente(req.body);
    const guardado = await nuevoCliente.save();
    res.status(201).json(guardado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 4. Actualizar cliente
router.put('/clientes/:identificador', async (req, res) => {
  try {
    const { identificador } = req.params;
    const esObjectId = mongoose.Types.ObjectId.isValid(identificador);

    const cliente = await Cliente.findOne({
      $or: [
        { dni: identificador.trim() },
        ...(esObjectId ? [{ _id: identificador }] : [])
      ]
    });

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    Object.assign(cliente, req.body);
    const actualizado = await cliente.save();
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 5. Eliminar cliente
router.delete('/clientes/:identificador', async (req, res) => {
  try {
    const { identificador } = req.params;
    const esObjectId = mongoose.Types.ObjectId.isValid(identificador);

    const cliente = await Cliente.findOneAndDelete({
      $or: [
        { dni: identificador.trim() },
        ...(esObjectId ? [{ _id: identificador }] : [])
      ]
    });

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.json({ mensaje: 'Cliente eliminado correctamente', cliente });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
