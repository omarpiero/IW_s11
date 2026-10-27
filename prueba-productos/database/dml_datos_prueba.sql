-- =============================================================================
-- SISTEMA DE VENTA DE COMPUTADORAS - SCRIPT DML (DATOS DE PRUEBA)
-- Estudiante: Omar Piero Terbullino Jaime | Código: 72682019
-- Asignatura: Ingeniería Web
-- =============================================================================

USE prueba_productos_db;

-- 1. INSERTAR TIENDAS (2 TIENDAS CON SLUGS NORMALIZADOS)
INSERT INTO tiendas (id_tienda, nombre, slug, direccion, telefono, ruc) VALUES
(1, 'CyberCore Systems', 'cybercore-systems', 'Av. Wilson 1234, Cercado de Lima', '01-4234567', '20601122334'),
(2, 'NovaTech Solutions', 'novatech-solutions', 'Av. Primavera 560, Surco', '01-7158900', '20609988776')
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre);

-- 2. INSERTAR PROVEEDORES
INSERT INTO proveedores (id_proveedor, nombre, contacto, telefono, email, direccion) VALUES
(1, 'Deltron Mayorista S.A.', 'Mariana Silva', '998877665', 'ventas@deltron.pe', 'Av. Javier Prado 2040, San Isidro'),
(2, 'Ingram Micro Perú', 'Rodrigo Alva', '987654321', 'pedidos@ingrammicro.pe', 'Calle Los Sauces 140, Miraflores')
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre);

-- 3. INSERTAR CLIENTES
INSERT INTO clientes (id_cliente, nombre, apellido, dni, email, telefono, direccion) VALUES
(1, 'Carlos', 'Mendoza', '74859612', 'carlos.mendoza@gmail.com', '912345678', 'Jr. Las Begonias 450, Lince'),
(2, 'Valeria', 'Rios', '71239845', 'valeria.rios@hotmail.com', '987123456', 'Av. Brasil 1820, Jesús María'),
(3, 'Jorge', 'Paredes', '73456789', 'jorge.paredes@outlook.com', '999888777', 'Calle Manuel Bonilla 204, Miraflores'),
(4, 'Andrea', 'Gutiérrez', '76543210', 'andrea.gutierrez@yahoo.com', '955443322', 'Av. La Marina 2500, San Miguel')
ON DUPLICATE KEY UPDATE dni=VALUES(dni);

-- 4. INSERTAR PRODUCTOS (5 POR TIENDA = 10 PRODUCTOS CON SLUG DE NOMBRE + 3 ÚLTIMOS DÍGITOS DE CÓDIGO DE BARRAS)
-- Tienda 1: CyberCore Systems (id_tienda = 1)
INSERT INTO productos (id_producto, nombre, marca, modelo, precio, stock, codigo_barras, slug, descripcion, id_tienda, id_proveedor) VALUES
(1, 'Laptop Lenovo ThinkPad E14', 'Lenovo', 'ThinkPad E14 Gen 4', 3450.00, 12, '7751000000891', 'laptop-lenovo-thinkpad-e14-891', 'Intel Core i7 12va gen, 16GB RAM DDR4, SSD 512GB NVMe, Pantalla 14 FHD', 1, 1),
(2, 'Laptop Asus ROG Strix G16', 'Asus', 'G614JU', 5890.00, 8, '7751000000892', 'laptop-asus-rog-strix-g16-892', 'Intel Core i9 13va gen, 32GB RAM DDR5, RTX 4060 8GB, SSD 1TB, 165Hz', 1, 1),
(3, 'PC Gamer Ryzen Master X', 'CyberCore', 'Gaming Beast V1', 4200.00, 6, '7751000000893', 'pc-gamer-ryzen-master-x-893', 'AMD Ryzen 7 5700X, 32GB RAM, RTX 3060 12GB, SSD 1TB, Fuente 750W Gold', 1, 2),
(4, 'Monitor LG UltraGear 27"', 'LG', '27GN65R-B', 899.00, 20, '7751000000894', 'monitor-lg-ultragear-27-894', 'Panel IPS FHD 144Hz 1ms, HDR10, FreeSync Premium, Ajuste de altura', 1, 2),
(5, 'Laptop HP Pavilion 15', 'HP', '15-eh1021la', 2650.00, 15, '7751000000895', 'laptop-hp-pavilion-15-895', 'AMD Ryzen 5 5500U, 16GB RAM, SSD 512GB, Pantalla 15.6 IPS FHD', 1, 1),

-- Tienda 2: NovaTech Solutions (id_tienda = 2)
(6, 'Laptop Dell Latitude 3440', 'Dell', 'Latitude 3440 Business', 3190.00, 10, '7752000000551', 'laptop-dell-latitude-3440-551', 'Intel Core i5 13va gen, 16GB RAM DDR4, SSD 512GB, Windows 11 Pro', 2, 2),
(7, 'MacBook Air M2 13.6"', 'Apple', 'MacBook Air M2 2023', 4999.00, 9, '7752000000552', 'macbook-air-m2-13-6-552', 'Chip Apple M2 con CPU 8 núcleos y GPU 10 núcleos, 8GB RAM, SSD 256GB', 2, 1),
(8, 'PC Oficina Intel Core i5', 'NovaTech', 'Office Pro Gen 12', 2150.00, 14, '7752000000553', 'pc-oficina-intel-core-i5-553', 'Intel Core i5 12400, 16GB RAM, SSD 500GB, Gabinete Slim con fuente certificada', 2, 2),
(9, 'Laptop Acer Nitro V15', 'Acer', 'ANV15-51', 3750.00, 11, '7752000000554', 'laptop-acer-nitro-v15-554', 'Intel Core i5 13420H, 16GB RAM DDR5, RTX 3050 6GB, SSD 512GB, 144Hz', 2, 1),
(10, 'Monitor Gamer Asus TUF 24"', 'Asus', 'VG249Q1A', 750.00, 18, '7752000000555', 'monitor-gamer-asus-tuf-24-555', 'IPS FHD 165Hz 1ms, FreeSync, Altavoces estéreo incorporados', 2, 2)
ON DUPLICATE KEY UPDATE stock=VALUES(stock);

-- 5. INSERTAR VENTAS
INSERT INTO ventas (id_venta, numero_factura, fecha, total, metodo_pago, id_cliente, id_tienda) VALUES
(1, 'F001-000101', '2026-10-25 11:20:00', 9340.00, 'Tarjeta de Crédito', 1, 1),
(2, 'F002-000205', '2026-10-26 16:45:00', 4999.00, 'Transferencia Bancaria', 2, 2)
ON DUPLICATE KEY UPDATE total=VALUES(total);

-- 6. INSERTAR DETALLES DE VENTA (SIN SLUG)
-- Venta 1: 1 Laptop Lenovo ThinkPad (3450.00) + 1 Laptop Asus ROG (5890.00) = 9340.00
INSERT INTO detalles_venta (id_detalle, id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(1, 1, 1, 1, 3450.00, 3450.00),
(2, 1, 2, 1, 5890.00, 5890.00),

-- Venta 2: 1 MacBook Air M2 (4999.00) = 4999.00
(3, 2, 7, 1, 4999.00, 4999.00)
ON DUPLICATE KEY UPDATE subtotal=VALUES(subtotal);
