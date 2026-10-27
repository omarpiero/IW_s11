# Sistema de Venta de Computadoras: Documentación Técnica y API REST

* **Estudiante:** Omar Piero Terbullino Jaime
* **Código:** 72682019
* **Asignatura:** Ingeniería Web
* **Base de Datos NoSQL:** `prueba_productos_db`
* **Base de Datos Relacional:** `prueba_productos_db` (MySQL / MariaDB)

---

## 1. Descripción Técnica General

El presente proyecto implementa un sistema integral para la gestión comercial y transaccional de un negocio de **Venta de Computadoras**. Comprende:
1. **Diseño Conceptual y Lógico (/docs):** Diagrama Entidad-Relación (DER), Modelo Relacional normalizado en 3FN y Diccionario de Datos técnico.
2. **Scripts SQL (/database):** Definición DDL (tablas, claves foráneas, restricciones de integridad) y DML (datos de prueba) para motores relacionales (MySQL / MariaDB).
3. **API REST NoSQL (Node.js + Express + Mongoose):** CRUD completo (Create, Read, Update, Delete) para 6 entidades interrelacionadas (Tiendas, Proveedores, Clientes, Productos, Ventas y Detalles de Venta).
4. **Manejo de Slugs y Códigos Únicos:**
   - **Tiendas:** Slug normalizado generado automáticamente por su nombre comercial.
   - **Productos:** Slug único generado combinando el nombre del equipo y los últimos 3 dígitos de su código de barras (ejemplo: `laptop-lenovo-thinkpad-e14-891`).
   - **Detalles de Venta:** Sin slug, gestionados por clave relacional referenciada.
5. **Panel Visual de Gestión (UI):** Interfaz web interactiva construida en HTML/CSS/JS nativo que permite ordenar tablas, filtrar datos en tiempo real, enviar formularios de creación/edición y visualizar el JSON devuelto por la API.

---

## 2. Estructura de Archivos del Proyecto

```text
prueba-productos/
├── .env                         # Configuración de puerto y conexión a MongoDB
├── package.json                 # Dependencias y scripts (dev, dev:ui, seed)
├── index.js                     # Servidor Express principal con selector de modo UI/API
├── seed.js                      # Script de inicialización de datos de prueba en MongoDB
├── docs/                        # Diseño de base de datos
│   ├── DER_MODELO_RELACIONAL.md # Diagrama ER y esquema lógico relacional
│   └── DICCIONARIO_DATOS.md     # Diccionario de datos para las 6 entidades
├── database/                    # Scripts SQL para motor relacional
│   ├── ddl_sistema_computadoras.sql # Creación de tablas, llaves y restricciones
│   └── dml_datos_prueba.sql         # Inserción inicial de datos de prueba
├── models/                      # Esquemas Mongoose
│   ├── Tienda.js                # Tiendas físicas (con slug)
│   ├── Proveedor.js             # Proveedores mayoristas
│   ├── Cliente.js               # Clientes (con DNI único)
│   ├── Producto.js              # Computadoras y componentes (con slug por código de barras)
│   ├── Venta.js                 # Cabecera de facturación
│   └── DetalleVenta.js          # Ítems de venta (sin slug, con subtotal calculado)
├── routes/                      # Controladores y rutas CRUD de Express
│   ├── tiendaRoutes.js
│   ├── productoRoutes.js
│   ├── clienteRoutes.js
│   ├── proveedorRoutes.js
│   ├── ventaRoutes.js
│   └── detalleVentaRoutes.js
└── public/                      # Interfaz visual de administración
    ├── index.html
    ├── style.css
    └── app.js
```

---

## 3. Instrucciones de Ejecución y Despliegue

### Requisitos Previos
* **Node.js:** Versión 18.x o superior instalada.
* **MongoDB Community Server:** Servicio iniciado en el puerto local estándar (`27017`).

### Pasos de Instalación
```bash
# 1. Ingresar a la carpeta del proyecto
cd c:\Users\zoomy\Downloads\iw_s11\prueba-productos

# 2. Instalar los paquetes requeridos
npm install

# 3. Ejecutar el semillado de datos (Seed)
npm run seed
```

### Modos de Ejecución del Servidor

#### A) Modo API Directa (JSON)
Levanta el servidor con Nodemon y Morgan; las peticiones a la raíz `/` devuelven el esquema JSON informativo:
```bash
npm run dev
```
Acceso: `http://localhost:3000/`

#### B) Modo con Interfaz Gráfica (UI)
Levanta el servidor y monta en la raíz `/` el panel web interactivo para gestionar el CRUD mediante formularios y tablas ordenables:
```bash
npm run dev:ui
```
Acceso: `http://localhost:3000/`

---

## 4. Mapeo de Rutas / Endpoints de la API REST

### Tiendas (`/api/tiendas`)
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/api/tiendas` | Listar todas las tiendas |
| `GET` | `/api/tiendas/:identificador` | Buscar por `_id` o por `slug` |
| `GET` | `/api/tiendas/:identificador/productos` | Listar computadoras de esa tienda |
| `POST` | `/api/tiendas` | Crear una nueva tienda |
| `PUT` | `/api/tiendas/:identificador` | Actualizar datos de tienda |
| `DELETE` | `/api/tiendas/:identificador` | Eliminar tienda |

### Productos / Computadoras (`/api/productos`)
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/api/productos` | Listar computadoras con datos de Tienda y Proveedor |
| `GET` | `/api/productos/:identificador` | Buscar por `_id`, `slug` o `codigo_barras` |
| `POST` | `/api/productos` | Registrar nuevo equipo |
| `PUT` | `/api/productos/:identificador` | Modificar datos de producto |
| `DELETE` | `/api/productos/:identificador` | Eliminar producto del inventario |

### Clientes (`/api/clientes`)
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/api/clientes` | Listar todos los clientes |
| `GET` | `/api/clientes/:identificador` | Buscar por `_id` o `dni` |
| `POST` | `/api/clientes` | Registrar nuevo cliente |
| `PUT` | `/api/clientes/:identificador` | Actualizar cliente |
| `DELETE` | `/api/clientes/:identificador` | Eliminar cliente |

### Ventas (`/api/ventas`)
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/api/ventas` | Listar ventas con datos poblados de Cliente y Tienda |
| `GET` | `/api/ventas/:identificador` | Buscar por `_id` o `numero_factura` |
| `GET` | `/api/ventas/:identificador/detalles` | Obtener la factura con todos sus ítems |
| `POST` | `/api/ventas` | Emitir nueva venta |
| `PUT` | `/api/ventas/:identificador` | Modificar venta |
| `DELETE` | `/api/ventas/:identificador` | Eliminar venta (con borrado en cascada de detalles) |

### Detalles de Venta (`/api/detalles-venta`)
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/api/detalles-venta` | Listar líneas de venta |
| `GET` | `/api/detalles-venta/:id` | Buscar detalle por `_id` |
| `POST` | `/api/detalles-venta` | Agregar línea (recalcula total de la venta) |
| `PUT` | `/api/detalles-venta/:id` | Modificar cantidad o precio |
| `DELETE` | `/api/detalles-venta/:id` | Eliminar línea (descuenta del total) |

---

## 5. Guía de Operaciones CRUD en Consola de MongoDB (`mongosh`)

Para interactuar de forma directa con la base de datos sin el servidor:

```bash
# 1. Conectarse a la base de datos
mongosh "mongodb://localhost:27017/prueba_productos_db"
```

### Operaciones CRUD en la colección `productos`:

```javascript
// C - CREATE: Insertar un nuevo producto
db.productos.insertOne({
  nombre: "Laptop MSI Katana 15",
  marca: "MSI",
  modelo: "B13VEK",
  precio: 4500.00,
  stock: 5,
  codigo_barras: "7759998881234",
  slug: "laptop-msi-katana-15-234",
  tienda_id: ObjectId("...") // ID de la tienda
});

// R - READ: Buscar productos con stock mayor a 5 y precio menor a 5000
db.productos.find({
  stock: { $gt: 5 },
  precio: { $lt: 5000 }
}).pretty();

// R - READ: Buscar producto por su slug
db.productos.findOne({ slug: "laptop-lenovo-thinkpad-e14-891" });

// U - UPDATE: Actualizar el precio y descontar stock
db.productos.updateOne(
  { slug: "laptop-lenovo-thinkpad-e14-891" },
  { 
    $set: { precio: 3399.00 },
    $inc: { stock: -1 }
  }
);

// D - DELETE: Eliminar un producto por su código de barras
db.productos.deleteOne({ codigo_barras: "7759998881234" });
```

---

## 6. Despliegue de los Scripts SQL (Opcional en MySQL)

Si dispone de un entorno MySQL (como XAMPP / MariaDB):
```bash
mysql -u root -p < database/ddl_sistema_computadoras.sql
mysql -u root -p < database/dml_datos_prueba.sql
```
El script creará automáticamente la base de datos relacional `prueba_productos_db`, sus tablas con restricciones `FOREIGN KEY` y cargará los registros iniciales de prueba.
