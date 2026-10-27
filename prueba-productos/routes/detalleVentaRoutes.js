const express = require('express');
const DetalleVenta = require('../models/DetalleVenta');
const Producto = require('../models/Producto');
const Venta = require('../models/Venta');

const router = express.Router();

// 1. Obtener todos los detalles de venta (sin slug)
router.get('/detalles-venta', async (req, res) => {
  try {
    const detalles = await DetalleVenta.find()
      .populate('venta_id', 'numero_factura fecha total metodo_pago')
      .populate('producto_id', 'nombre marca modelo precio codigo_barras slug')
      .sort({ createdAt: -1 });
    res.json(detalles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Obtener un detalle de venta por ID
router.get('/detalles-venta/:id', async (req, res) => {
  try {
    const detalle = await DetalleVenta.findById(req.params.id)
      .populate('venta_id')
      .populate('producto_id');

    if (!detalle) {
      return res.status(404).json({ error: 'Detalle de venta no encontrado' });
    }
    res.json(detalle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Crear una nueva línea de detalle de venta
router.post('/detalles-venta', async (req, res) => {
  try {
    const { venta_id, producto_id, cantidad, precio_unitario } = req.body;

    // Si no enviaron precio_unitario, lo tomamos del producto registrado
    let precio = precio_unitario;
    if (!precio) {
      const prod = await Producto.findById(producto_id);
      if (!prod) return res.status(404).json({ error: 'Producto no encontrado' });
      precio = prod.precio;
    }

    const subtotal = Number((cantidad * precio).toFixed(2));

    const nuevoDetalle = new DetalleVenta({
      venta_id,
      producto_id,
      cantidad,
      precio_unitario: precio,
      subtotal
    });

    const guardado = await nuevoDetalle.save();

    // Actualizar automáticamente el total acumulado en la venta
    const sumaDetalles = await DetalleVenta.aggregate([
      { $match: { venta_id: nuevoDetalle.venta_id } },
      { $group: { _id: '$venta_id', totalAcumulado: { $sum: '$subtotal' } } }
    ]);

    if (sumaDetalles.length > 0) {
      await Venta.findByIdAndUpdate(venta_id, { total: sumaDetalles[0].totalAcumulado });
    }

    res.status(201).json(guardado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 4. Actualizar detalle de venta
router.put('/detalles-venta/:id', async (req, res) => {
  try {
    const detalle = await DetalleVenta.findById(req.params.id);
    if (!detalle) {
      return res.status(404).json({ error: 'Detalle no encontrado' });
    }

    Object.assign(detalle, req.body);
    if (req.body.cantidad || req.body.precio_unitario) {
      detalle.subtotal = Number((detalle.cantidad * detalle.precio_unitario).toFixed(2));
    }

    const actualizado = await detalle.save();

    // Recalcular total de la venta
    const sumaDetalles = await DetalleVenta.aggregate([
      { $match: { venta_id: actualizado.venta_id } },
      { $group: { _id: '$venta_id', totalAcumulado: { $sum: '$subtotal' } } }
    ]);
    if (sumaDetalles.length > 0) {
      await Venta.findByIdAndUpdate(actualizado.venta_id, { total: sumaDetalles[0].totalAcumulado });
    }

    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 5. Eliminar detalle de venta
router.delete('/detalles-venta/:id', async (req, res) => {
  try {
    const detalle = await DetalleVenta.findByIdAndDelete(req.params.id);
    if (!detalle) {
      return res.status(404).json({ error: 'Detalle no encontrado' });
    }

    // Recalcular total de la venta tras eliminar la línea
    const sumaDetalles = await DetalleVenta.aggregate([
      { $match: { venta_id: detalle.venta_id } },
      { $group: { _id: '$venta_id', totalAcumulado: { $sum: '$subtotal' } } }
    ]);
    const nuevoTotal = sumaDetalles.length > 0 ? sumaDetalles[0].totalAcumulado : 0;
    await Venta.findByIdAndUpdate(detalle.venta_id, { total: nuevoTotal });

    res.json({ mensaje: 'Línea de detalle eliminada', detalle });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
