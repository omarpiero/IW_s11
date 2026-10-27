const express = require('express');
const mongoose = require('mongoose');
const Producto = require('../models/Producto');

const router = express.Router();

// 1. Obtener todos los productos con datos de Tienda y Proveedor
router.get('/productos', async (req, res) => {
  try {
    const productos = await Producto.find()
      .populate('tienda_id', 'nombre slug ruc direccion')
      .populate('proveedor_id', 'nombre contacto telefono')
      .sort({ createdAt: -1 });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Obtener un producto por ID, por Slug o por Código de Barras
router.get('/productos/:identificador', async (req, res) => {
  try {
    const { identificador } = req.params;
    const esObjectId = mongoose.Types.ObjectId.isValid(identificador);

    const producto = await Producto.findOne({
      $or: [
        { slug: identificador.toLowerCase().trim() },
        { codigo_barras: identificador.trim() },
        ...(esObjectId ? [{ _id: identificador }] : [])
      ]
    })
    .populate('tienda_id')
    .populate('proveedor_id');

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Crear un nuevo producto (POST)
router.post('/productos', async (req, res) => {
  try {
    const nuevoProducto = new Producto(req.body);
    const guardado = await nuevoProducto.save();
    res.status(201).json(guardado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 4. Actualizar producto por ID o Slug (PUT)
router.put('/productos/:identificador', async (req, res) => {
  try {
    const { identificador } = req.params;
    const esObjectId = mongoose.Types.ObjectId.isValid(identificador);

    const producto = await Producto.findOne({
      $or: [
        { slug: identificador.toLowerCase().trim() },
        { codigo_barras: identificador.trim() },
        ...(esObjectId ? [{ _id: identificador }] : [])
      ]
    });

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    Object.assign(producto, req.body);
    const actualizado = await producto.save();
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 5. Eliminar producto por ID o Slug (DELETE)
router.delete('/productos/:identificador', async (req, res) => {
  try {
    const { identificador } = req.params;
    const esObjectId = mongoose.Types.ObjectId.isValid(identificador);

    const producto = await Producto.findOneAndDelete({
      $or: [
        { slug: identificador.toLowerCase().trim() },
        { codigo_barras: identificador.trim() },
        ...(esObjectId ? [{ _id: identificador }] : [])
      ]
    });

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ mensaje: 'Producto eliminado correctamente', producto });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
