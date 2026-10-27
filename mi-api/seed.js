// seed.js - Script de inicialización de datos de prueba con SLUG y DNI
require('dotenv').config();
const mongoose = require('mongoose');
const Empresa = require('./models/Empresa');
const Empleado = require('./models/Empleado');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[INFO] Conectado a MongoDB...');

    await Empresa.deleteMany({});
    await Empleado.deleteMany({});
    console.log('[INFO] Colecciones anteriores limpiadas.');

    // 1. Crear Empresas (el hook pre('save') generará su slug automáticamente)
    const empresa1 = new Empresa({
      nombre: 'Tech Solutions',
      direccion: 'Av. Tecnología 123',
      telefono: '124-456-7890'
    });

    const empresa2 = new Empresa({
      nombre: 'Consultoría Global',
      direccion: 'Calle Consultores 456',
      telefono: '988-654-3210'
    });

    await empresa1.save();
    await empresa2.save();

    console.log('[INFO] Empresas creadas:');
    console.log(`   - ${empresa1.nombre} -> Slug: ${empresa1.slug} (ID: ${empresa1._id})`);
    console.log(`   - ${empresa2.nombre} -> Slug: ${empresa2.slug} (ID: ${empresa2._id})`);

    // 2. Lista de empleados con DNI único
    const empleados = [
      // Empresa 1
      { nombre: 'Carlos', apellido: 'Pérez', dni: '71000001', cargo: 'Desarrollador', empresa_id: empresa1._id },
      { nombre: 'María', apellido: 'López', dni: '71000002', cargo: 'Analista', empresa_id: empresa1._id },
      { nombre: 'Javier', apellido: 'García', dni: '71000003', cargo: 'Diseñador', empresa_id: empresa1._id },
      { nombre: 'Ana', apellido: 'Martínez', dni: '71000004', cargo: 'QA Tester', empresa_id: empresa1._id },
      { nombre: 'Lucía', apellido: 'Sánchez', dni: '71000005', cargo: 'Backend Developer', empresa_id: empresa1._id },

      // Empresa 2
      { nombre: 'Pedro', apellido: 'Ramírez', dni: '72000006', cargo: 'Gerente', empresa_id: empresa2._id },
      { nombre: 'Laura', apellido: 'Fernández', cargo: 'RRHH', empresa_id: empresa2._id },
      { nombre: 'Diego', apellido: 'Torres', cargo: 'Contador', empresa_id: empresa2._id },
      { nombre: 'Valentina', apellido: 'Castro', cargo: 'Marketing', empresa_id: empresa2._id },
      { nombre: 'Sebastián', apellido: 'Ortega', cargo: 'Frontend Developer', empresa_id: empresa2._id }
    ];

    for (const empData of empleados) {
      const emp = new Empleado(empData);
      await emp.save();
    }

    console.log(`[INFO] Se insertaron ${empleados.length} empleados con DNI y Slug.`);
    console.log('[OK] Proceso de semillado finalizado con éxito.');
  } catch (error) {
    console.error('[X] Error al sembrar datos:', error);
  } finally {
    await mongoose.disconnect();
    console.log('[INFO] Desconectado de MongoDB.');
  }
};

seedData();
