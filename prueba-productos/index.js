// index.js - Servidor principal de prueba-productos (Sistema de Venta de Computadoras)
require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

// Rutas de las 6 entidades
const tiendaRoutes = require('./routes/tiendaRoutes');
const productoRoutes = require('./routes/productoRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const proveedorRoutes = require('./routes/proveedorRoutes');
const ventaRoutes = require('./routes/ventaRoutes');
const detalleVentaRoutes = require('./routes/detalleVentaRoutes');

const app = express();

// --- DETECCIÓN DE MODO UI ---
// Se activa mediante la bandera '--ui' en package.json (npm run dev:ui) o variable de entorno
const isUiMode = process.argv.includes('--ui') || process.env.SERVE_UI === 'true';

// --- MIDDLEWARES GLOBALES ---
app.use(cors());
// Permitir recursos externos (Google Fonts) en modo UI
app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan('dev'));
app.use(express.json());

// --- ENRUTAMIENTO DE LA API ---
app.use('/api', tiendaRoutes);
app.use('/api', productoRoutes);
app.use('/api', clienteRoutes);
app.use('/api', proveedorRoutes);
app.use('/api', ventaRoutes);
app.use('/api', detalleVentaRoutes);

// --- COMPORTAMIENTO CONDICIONAL DE LA RAÍZ (/) ---
if (isUiMode) {
  // Modo UI: sirve los archivos estáticos de la interfaz web
  app.use(express.static(path.join(__dirname, 'public')));
} else {
  // Modo API pura: responde con la documentación JSON de endpoints
  app.get('/', (req, res) => {
    res.json({
      status: '[OK]',
      modo: 'API Directa (JSON)',
      mensaje: 'Para levantar el servidor junto a la interfaz gráfica interactiva, ejecute: npm run dev:ui',
      estudiante: {
        nombre: 'Omar Piero Terbullino Jaime',
        codigo: '72682019',
        asignatura: 'Ingeniería Web'
      },
      base_datos: 'prueba_productos_db',
      endpoints_principales: {
        tiendas: '/api/tiendas',
        productos: '/api/productos',
        clientes: '/api/clientes',
        proveedores: '/api/proveedores',
        ventas: '/api/ventas',
        detalles_venta: '/api/detalles-venta'
      }
    });
  });
}

// --- CONEXIÓN A MONGODB ---
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/prueba_productos_db';
mongoose.connect(MONGO_URI)
  .then(() => console.log('[OK] Conectado exitosamente a MongoDB (prueba_productos_db)'))
  .catch(err => console.error('[X] Error al conectar a MongoDB:', err));

// --- INICIO DEL SERVIDOR ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[INFO] Servidor corriendo en http://localhost:${PORT}`);
  if (isUiMode) {
    console.log('[INFO] Modo UI ACTIVO: Ingrese a http://localhost:' + PORT + ' para gestionar el CRUD gráficamente.');
  } else {
    console.log('[INFO] Modo API JSON ACTIVO: La raíz "/" responde con el esquema de endpoints.');
  }
});
