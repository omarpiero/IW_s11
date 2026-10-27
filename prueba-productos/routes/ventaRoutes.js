const express = require('express');
const mongoose = require('mongoose');
const Venta = require('../models/Venta');
const DetalleVenta = require('../models/DetalleVenta');

const router = express.Router();

// 1. Obtener todas las ventas con datos de Cliente y Tienda
router.get('/ventas', async (req, res) => {
  try {
    const ventas = await Venta.find()
      .populate('cliente_id', 'nombre apellido dni email telefono')
      .populate('tienda_id', 'nombre slug ruc direccion')
      .sort({ fecha: -1 });
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Obtener una venta por ID o por Número de Factura
router.get('/ventas/:identificador', async (req, res) => {
  try {
    const { identificador } = req.params;
    const esObjectId = mongoose.Types.ObjectId.isValid(identificador);

    const venta = await Venta.findOne({
      $or: [
        { numero_factura: identificador.trim() },
        ...(esObjectId ? [{ _id: identificador }] : [])
      ]
    })
    .populate('cliente_id')
    .populate('tienda_id');

    if (!venta) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }
    res.json(venta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Obtener los detalles (líneas de venta) de una venta específica
router.get('/ventas/:identificador/detalles', async (req, res) => {
  try {
    const { identificador } = req.params;
    const esObjectId = mongoose.Types.ObjectId.isValid(identificador);

    const venta = await Venta.findOne({
      $or: [
        { numero_factura: identificador.trim() },
        ...(esObjectId ? [{ _id: identificador }] : [])
      ]
    });

    if (!venta) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }

    const detalles = await DetalleVenta.find({ venta_id: venta._id })
      .populate('producto_id', 'nombre marca modelo precio codigo_barras slug');

    res.json({
      venta,
      detalles
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Crear una nueva venta
router.post('/ventas', async (req, res) => {
  try {
    const nuevaVenta = new Venta(req.body);
    const guardada = await nuevaVenta.save();
    res.status(201).json(guardada);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 5. Actualizar venta
router.put('/ventas/:identificador', async (req, res) => {
  try {
    const { identificador } = req.params;
    const esObjectId = mongoose.Types.ObjectId.isValid(identificador);

    const venta = await Venta.findOne({
      $or: [
        { numero_factura: identificador.trim() },
        ...(esObjectId ? [{ _id: identificador }] : [])
      ]
    });

    if (!venta) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }

    Object.assign(venta, req.body);
    const actualizada = await venta.save();
    res.json(actualizada);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 6. Eliminar venta (con borrado en cascada de sus detalles)
router.delete('/ventas/:identificador', async (req, res) => {
  try {
    const { identificador } = req.params;
    const esObjectId = mongoose.Types.ObjectId.isValid(identificador);

    const venta = await Venta.findOneAndDelete({
      $or: [
        { numero_factura: identificador.trim() },
        ...(esObjectId ? [{ _id: identificador }] : [])
      ]
    });

    if (!venta) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }

    // Borrado en cascada de las líneas de detalle asociadas
    await DetalleVenta.deleteMany({ venta_id: venta._id });

    res.json({ 
      mensaje: 'Venta y sus detalles asociados eliminados correctamente',
      venta 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
