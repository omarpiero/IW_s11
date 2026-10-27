// index.js - Servidor principal de la API REST
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

// Importamos las rutas modulares
const empresaRoutes = require('./routes/empresaRoutes');
const empleadoRoutes = require('./routes/empleadoRoutes');

const app = express();

// --- MIDDLEWARES GLOBALES ---
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// --- RUTAS DE LA API ---
app.use('/api', empresaRoutes);
app.use('/api', empleadoRoutes);

// Ruta base para verificar estado
app.get('/', (req, res) => {
  res.json({
    status: '[OK]',
    mensaje: 'API REST con Express y MongoDB operativa',
    rutas_disponibles: [
      'GET /api/empresas',
      'GET /api/empresas/:identificador',
      'GET /api/empresas/:identificador/empleados',
      'GET /api/empleados',
      'GET /api/empleados/:identificador'
    ]
  });
});

// --- CONEXIÓN A MONGODB ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('[OK] Conectado exitosamente a MongoDB (mi_empresa_db)'))
  .catch(err => console.error('[X] Error al conectar a MongoDB:', err));

// --- INICIO DEL SERVIDOR ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[INFO] Servidor corriendo en http://localhost:${PORT}`);
});
