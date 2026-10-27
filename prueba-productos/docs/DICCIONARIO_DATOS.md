# Diccionario de Datos: Sistema de Venta de Computadoras

* **Estudiante:** Omar Piero Terbullino Jaime
* **Código:** 72682019
* **Asignatura:** Ingeniería Web
* **Base de Datos:** `prueba_productos_db`

---

## 1. Tabla: `tiendas` / Colección: `tiendas`
Almacena las sedes o tiendas físicas de venta de equipos.

| Campo | Tipo SQL | Tipo Mongoose | Nulo | Clave | Descripción | Ejemplo |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id_tienda` / `_id` | `INT AUTO_INCREMENT` | `ObjectId` | NO | PK | Identificador único de la tienda | `1` / `ObjectId("...")` |
| `nombre` | `VARCHAR(100)` | `String` | NO | - | Nombre comercial | `CyberCore Systems` |
| `slug` | `VARCHAR(120)` | `String` | NO | UK | URL amigable única por nombre | `cybercore-systems` |
| `direccion` | `VARCHAR(200)` | `String` | SÍ | - | Dirección física | `Av. Wilson 1234, Lima` |
| `telefono` | `VARCHAR(20)` | `String` | SÍ | - | Teléfono de atención | `01-4234567` |
| `ruc` | `VARCHAR(11)` | `String` | NO | UK | Registro Único Tributario | `20601234567` |

---

## 2. Tabla: `proveedores` / Colección: `proveedores`
Empresas mayoristas o fabricantes que suministran computadoras y componentes.

| Campo | Tipo SQL | Tipo Mongoose | Nulo | Clave | Descripción | Ejemplo |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id_proveedor` / `_id`| `INT AUTO_INCREMENT` | `ObjectId` | NO | PK | Identificador del proveedor | `1` |
| `nombre` | `VARCHAR(120)` | `String` | NO | - | Razón social del distribuidor | `Deltron Mayorista S.A.` |
| `contacto` | `VARCHAR(100)` | `String` | SÍ | - | Persona responsable de ventas | `Mariana Silva` |
| `telefono` | `VARCHAR(20)` | `String` | SÍ | - | Número de contacto | `998877665` |
| `email` | `VARCHAR(100)` | `String` | SÍ | - | Correo corporativo | `ventas@deltron.pe` |
| `direccion` | `VARCHAR(200)` | `String` | SÍ | - | Ubicación del almacén principal| `Av. Javier Prado 2040` |

---

## 3. Tabla: `clientes` / Colección: `clientes`
Compradores particulares o corporativos.

| Campo | Tipo SQL | Tipo Mongoose | Nulo | Clave | Descripción | Ejemplo |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id_cliente` / `_id` | `INT AUTO_INCREMENT` | `ObjectId` | NO | PK | Identificador del cliente | `1` |
| `nombre` | `VARCHAR(80)` | `String` | NO | - | Nombres del cliente | `Carlos` |
| `apellido` | `VARCHAR(80)` | `String` | NO | - | Apellidos del cliente | `Mendoza` |
| `dni` | `VARCHAR(12)` | `String` | NO | UK | Documento de identidad | `74859612` |
| `email` | `VARCHAR(100)` | `String` | SÍ | - | Correo electrónico | `carlos.mendoza@gmail.com` |
| `telefono` | `VARCHAR(20)` | `String` | SÍ | - | Teléfono móvil | `912345678` |
| `direccion` | `VARCHAR(200)` | `String` | SÍ | - | Domicilio para entregas | `Jr. Las Begonias 450` |

---

## 4. Tabla: `productos` / Colección: `productos`
Equipos de cómputo, laptops, computadoras de escritorio y componentes.

| Campo | Tipo SQL | Tipo Mongoose | Nulo | Clave | Descripción | Ejemplo |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id_producto` / `_id` | `INT AUTO_INCREMENT` | `ObjectId` | NO | PK | Identificador del producto | `1` |
| `nombre` | `VARCHAR(120)` | `String` | NO | - | Nombre descriptivo del equipo | `Laptop Lenovo ThinkPad E14` |
| `marca` | `VARCHAR(50)` | `String` | NO | - | Fabricante del equipo | `Lenovo` |
| `modelo` | `VARCHAR(60)` | `String` | SÍ | - | Modelo o serie de fábrica | `ThinkPad E14 Gen 4` |
| `precio` | `DECIMAL(10,2)` | `Number` | NO | - | Precio de venta unitario | `3450.00` |
| `stock` | `INT` | `Number` | NO | - | Unidades en inventario | `15` |
| `codigo_barras` | `VARCHAR(30)` | `String` | NO | UK | Código de barras estándar | `7751234567891` |
| `slug` | `VARCHAR(150)` | `String` | NO | UK | Nombre normalizado + últimos 3 de código | `laptop-lenovo-thinkpad-e14-891` |
| `descripcion` | `TEXT` | `String` | SÍ | - | Resumen de características | `Intel Core i7 12va, 16GB RAM, 512GB SSD` |
| `id_tienda` / `tienda_id` | `INT` | `ObjectId (ref: Tienda)` | NO | FK | Tienda donde está ubicado | `1` / `ObjectId("...")` |
| `id_proveedor` / `proveedor_id` | `INT` | `ObjectId (ref: Proveedor)` | SÍ | FK | Proveedor de abastecimiento | `1` / `ObjectId("...")` |

---

## 5. Tabla: `ventas` / Colección: `ventas`
Encabezado de la transacción comercial efectuada.

| Campo | Tipo SQL | Tipo Mongoose | Nulo | Clave | Descripción | Ejemplo |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id_venta` / `_id` | `INT AUTO_INCREMENT` | `ObjectId` | NO | PK | Identificador de la venta | `1` |
| `numero_factura` | `VARCHAR(20)` | `String` | NO | UK | Serie correlativa de factura | `F001-000452` |
| `fecha` | `DATETIME` | `Date` | NO | - | Fecha y hora de transacción | `2026-10-27 15:30:00` |
| `total` | `DECIMAL(10,2)` | `Number` | NO | - | Monto total a cobrar | `6900.00` |
| `metodo_pago` | `VARCHAR(30)` | `String` | NO | - | Forma de pago | `Tarjeta de Crédito` |
| `id_cliente` / `cliente_id` | `INT` | `ObjectId (ref: Cliente)` | NO | FK | Cliente comprador | `1` / `ObjectId("...")` |
| `id_tienda` / `tienda_id` | `INT` | `ObjectId (ref: Tienda)` | NO | FK | Sucursal de emisión | `1` / `ObjectId("...")` |

---

## 6. Tabla: `detalles_venta` / Colección: `detalles_venta`
Renglones o líneas de producto de cada comprobante de venta.

| Campo | Tipo SQL | Tipo Mongoose | Nulo | Clave | Descripción | Ejemplo |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id_detalle` / `_id` | `INT AUTO_INCREMENT` | `ObjectId` | NO | PK | Identificador del ítem | `1` |
| `id_venta` / `venta_id` | `INT` | `ObjectId (ref: Venta)` | NO | FK | Factura a la que pertenece | `1` / `ObjectId("...")` |
| `id_producto` / `producto_id` | `INT` | `ObjectId (ref: Producto)` | NO | FK | Computadora vendida | `1` / `ObjectId("...")` |
| `cantidad` | `INT` | `Number` | NO | - | Número de unidades adquiridas| `2` |
| `precio_unitario` | `DECIMAL(10,2)` | `Number` | NO | - | Precio congelado al vender | `3450.00` |
| `subtotal` | `DECIMAL(10,2)` | `Number` | NO | - | Subtotal (`cantidad * precio_unitario`) | `6900.00` |
