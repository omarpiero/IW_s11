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
app.use(cors());          // Habilita peticiones de otros orígenes/puertos
app.use(helmet());        // Agrega cabeceras HTTP seguras
app.use(morgan('dev'));    // Muestra en consola cada petición HTTP en tiempo real con colores
app.use(express.json());   // Permite leer cuerpos de peticiones en formato JSON (req.body)

// --- RUTAS DE LA API ---
// Todo lo que esté en empresaRoutes responderá bajo el prefijo /api
app.use('/api', empresaRoutes);
// Todo lo que esté en empleadoRoutes responderá bajo el prefijo /api
app.use('/api', empleadoRoutes);

// Ruta base de bienvenida para verificar que el servidor está online
app.get('/', (req, res) => {
  res.json({
    mensaje: '🚀 API REST con Express y MongoDB está funcionando',
    rutas_disponibles: [
      'GET /api/empresas',
      'GET /api/empresas/:id',
      'GET /api/empresas/:id/empleados',
      'GET /api/empleados'
    ]
  });
});

// --- CONEXIÓN A MONGODB ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado exitosamente a MongoDB (mi_empresa_db)'))
  .catch(err => console.error('❌ Error al conectar a MongoDB:', err));

// --- INICIO DEL SERVIDOR ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Servidor corriendo en http://localhost:${PORT}`);
});
