// seed.js - Script de inicialización para prueba_productos_db
require('dotenv').config();
const mongoose = require('mongoose');

const Tienda = require('./models/Tienda');
const Proveedor = require('./models/Proveedor');
const Cliente = require('./models/Cliente');
const Producto = require('./models/Producto');
const Venta = require('./models/Venta');
const DetalleVenta = require('./models/DetalleVenta');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[INFO] Conectado a MongoDB (prueba_productos_db)...');

    // 1. Limpieza total de colecciones anteriores
    await DetalleVenta.deleteMany({});
    await Venta.deleteMany({});
    await Producto.deleteMany({});
    await Cliente.deleteMany({});
    await Proveedor.deleteMany({});
    await Tienda.deleteMany({});
    console.log('[INFO] Colecciones anteriores limpiadas correctamente.');

    // 2. Crear 2 Tiendas (con slugs automáticos por nombre normalizado)
    const tienda1 = new Tienda({
      nombre: 'CyberCore Systems',
      direccion: 'Av. Wilson 1234, Cercado de Lima',
      telefono: '01-4234567',
      ruc: '20601122334'
    });

    const tienda2 = new Tienda({
      nombre: 'NovaTech Solutions',
      direccion: 'Av. Primavera 560, Surco',
      telefono: '01-7158900',
      ruc: '20609988776'
    });

    await tienda1.save();
    await tienda2.save();

    console.log('[INFO] Tiendas creadas:');
    console.log(`   - ${tienda1.nombre} -> Slug: ${tienda1.slug} (ID: ${tienda1._id})`);
    console.log(`   - ${tienda2.nombre} -> Slug: ${tienda2.slug} (ID: ${tienda2._id})`);

    // 3. Crear Proveedores
    const prov1 = await Proveedor.create({
      nombre: 'Deltron Mayorista S.A.',
      contacto: 'Mariana Silva',
      telefono: '998877665',
      email: 'ventas@deltron.pe',
      direccion: 'Av. Javier Prado 2040, San Isidro'
    });

    const prov2 = await Proveedor.create({
      nombre: 'Ingram Micro Perú',
      contacto: 'Rodrigo Alva',
      telefono: '987654321',
      email: 'pedidos@ingrammicro.pe',
      direccion: 'Calle Los Sauces 140, Miraflores'
    });
    console.log('[INFO] 2 Proveedores registrados.');

    // 4. Crear Clientes
    const cliente1 = await Cliente.create({
      nombre: 'Carlos',
      apellido: 'Mendoza',
      dni: '74859612',
      email: 'carlos.mendoza@gmail.com',
      telefono: '912345678',
      direccion: 'Jr. Las Begonias 450, Lince'
    });

    const cliente2 = await Cliente.create({
      nombre: 'Valeria',
      apellido: 'Rios',
      dni: '71239845',
      email: 'valeria.rios@hotmail.com',
      telefono: '987123456',
      direccion: 'Av. Brasil 1820, Jesús María'
    });

    const cliente3 = await Cliente.create({
      nombre: 'Jorge',
      apellido: 'Paredes',
      dni: '73456789',
      email: 'jorge.paredes@outlook.com',
      telefono: '999888777',
      direccion: 'Calle Manuel Bonilla 204, Miraflores'
    });

    const cliente4 = await Cliente.create({
      nombre: 'Andrea',
      apellido: 'Gutiérrez',
      dni: '76543210',
      email: 'andrea.gutierrez@yahoo.com',
      telefono: '955443322',
      direccion: 'Av. La Marina 2500, San Miguel'
    });
    console.log('[INFO] 4 Clientes registrados.');

    // 5. Crear 10 Productos (5 por cada tienda) con slugs generados por nombre + ultimos 3 digitos del codigo de barras
    const productosData = [
      // Tienda 1: CyberCore Systems
      {
        nombre: 'Laptop Lenovo ThinkPad E14',
        marca: 'Lenovo',
        modelo: 'ThinkPad E14 Gen 4',
        precio: 3450.00,
        stock: 12,
        codigo_barras: '7751000000891',
        descripcion: 'Intel Core i7 12va gen, 16GB RAM DDR4, SSD 512GB NVMe, Pantalla 14 FHD',
        tienda_id: tienda1._id,
        proveedor_id: prov1._id
      },
      {
        nombre: 'Laptop Asus ROG Strix G16',
        marca: 'Asus',
        modelo: 'G614JU',
        precio: 5890.00,
        stock: 8,
        codigo_barras: '7751000000892',
        descripcion: 'Intel Core i9 13va gen, 32GB RAM DDR5, RTX 4060 8GB, SSD 1TB, 165Hz',
        tienda_id: tienda1._id,
        proveedor_id: prov1._id
      },
      {
        nombre: 'PC Gamer Ryzen Master X',
        marca: 'CyberCore',
        modelo: 'Gaming Beast V1',
        precio: 4200.00,
        stock: 6,
        codigo_barras: '7751000000893',
        descripcion: 'AMD Ryzen 7 5700X, 32GB RAM, RTX 3060 12GB, SSD 1TB, Fuente 750W Gold',
        tienda_id: tienda1._id,
        proveedor_id: prov2._id
      },
      {
        nombre: 'Monitor LG UltraGear 27"',
        marca: 'LG',
        modelo: '27GN65R-B',
        precio: 899.00,
        stock: 20,
        codigo_barras: '7751000000894',
        descripcion: 'Panel IPS FHD 144Hz 1ms, HDR10, FreeSync Premium, Altura ajustable',
        tienda_id: tienda1._id,
        proveedor_id: prov2._id
      },
      {
        nombre: 'Laptop HP Pavilion 15',
        marca: 'HP',
        modelo: '15-eh1021la',
        precio: 2650.00,
        stock: 15,
        codigo_barras: '7751000000895',
        descripcion: 'AMD Ryzen 5 5500U, 16GB RAM, SSD 512GB, Pantalla 15.6 IPS FHD',
        tienda_id: tienda1._id,
        proveedor_id: prov1._id
      },

      // Tienda 2: NovaTech Solutions
      {
        nombre: 'Laptop Dell Latitude 3440',
        marca: 'Dell',
        modelo: 'Latitude 3440 Business',
        precio: 3190.00,
        stock: 10,
        codigo_barras: '7752000000551',
        descripcion: 'Intel Core i5 13va gen, 16GB RAM DDR4, SSD 512GB, Windows 11 Pro',
        tienda_id: tienda2._id,
        proveedor_id: prov2._id
      },
      {
        nombre: 'MacBook Air M2 13.6"',
        marca: 'Apple',
        modelo: 'MacBook Air M2 2023',
        precio: 4999.00,
        stock: 9,
        codigo_barras: '7752000000552',
        descripcion: 'Chip Apple M2 CPU 8 núcleos y GPU 10 núcleos, 8GB RAM, SSD 256GB',
        tienda_id: tienda2._id,
        proveedor_id: prov1._id
      },
      {
        nombre: 'PC Oficina Intel Core i5',
        marca: 'NovaTech',
        modelo: 'Office Pro Gen 12',
        precio: 2150.00,
        stock: 14,
        codigo_barras: '7752000000553',
        descripcion: 'Intel Core i5 12400, 16GB RAM, SSD 500GB, Gabinete Slim certificado',
        tienda_id: tienda2._id,
        proveedor_id: prov2._id
      },
      {
        nombre: 'Laptop Acer Nitro V15',
        marca: 'Acer',
        modelo: 'ANV15-51',
        precio: 3750.00,
        stock: 11,
        codigo_barras: '7752000000554',
        descripcion: 'Intel Core i5 13420H, 16GB RAM DDR5, RTX 3050 6GB, SSD 512GB, 144Hz',
        tienda_id: tienda2._id,
        proveedor_id: prov1._id
      },
      {
        nombre: 'Monitor Gamer Asus TUF 24"',
        marca: 'Asus',
        modelo: 'VG249Q1A',
        precio: 750.00,
        stock: 18,
        codigo_barras: '7752000000555',
        descripcion: 'IPS FHD 165Hz 1ms, FreeSync, Altavoces estéreo incorporados',
        tienda_id: tienda2._id,
        proveedor_id: prov2._id
      }
    ];

    const productosGuardados = [];
    for (const p of productosData) {
      const prod = new Producto(p);
      await prod.save();
      productosGuardados.push(prod);
    }
    console.log(`[INFO] Se registraron ${productosGuardados.length} productos con sus respectivos Slugs:`);
    productosGuardados.forEach(p => console.log(`   - ${p.nombre} -> Slug: ${p.slug}`));

    // 6. Crear Ventas de prueba
    const venta1 = new Venta({
      numero_factura: 'F001-000101',
      fecha: new Date('2026-10-25T11:20:00Z'),
      total: 9340.00,
      metodo_pago: 'Tarjeta de Crédito',
      cliente_id: cliente1._id,
      tienda_id: tienda1._id
    });

    const venta2 = new Venta({
      numero_factura: 'F002-000205',
      fecha: new Date('2026-10-26T16:45:00Z'),
      total: 4999.00,
      metodo_pago: 'Transferencia Bancaria',
      cliente_id: cliente2._id,
      tienda_id: tienda2._id
    });

    await venta1.save();
    await venta2.save();

    // 7. Crear Detalles de Venta (sin slug)
    // Venta 1: 1 Lenovo ThinkPad + 1 Asus ROG
    const det1 = new DetalleVenta({
      venta_id: venta1._id,
      producto_id: productosGuardados[0]._id, // ThinkPad E14
      cantidad: 1,
      precio_unitario: 3450.00,
      subtotal: 3450.00
    });

    const det2 = new DetalleVenta({
      venta_id: venta1._id,
      producto_id: productosGuardados[1]._id, // Asus ROG
      cantidad: 1,
      precio_unitario: 5890.00,
      subtotal: 5890.00
    });

    // Venta 2: 1 MacBook Air M2
    const det3 = new DetalleVenta({
      venta_id: venta2._id,
      producto_id: productosGuardados[6]._id, // MacBook Air M2
      cantidad: 1,
      precio_unitario: 4999.00,
      subtotal: 4999.00
    });

    await det1.save();
    await det2.save();
    await det3.save();

    console.log('[INFO] Detalles de venta registrados correctamente.');
    console.log('[OK] Base de datos prueba_productos_db inicializada con éxito.');
  } catch (error) {
    console.error('[X] Error en semillado:', error);
  } finally {
    await mongoose.disconnect();
    console.log('[INFO] Desconectado de MongoDB.');
  }
};

seedData();
