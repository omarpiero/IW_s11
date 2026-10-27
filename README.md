# Repositorio de Prácticas y Proyectos: Ingeniería Web

Repositorio central para el desarrollo y documentación de prácticas de arquitectura de software web, persistencia NoSQL con **MongoDB**, modelado relacional **SQL** y diseño de APIs REST con **Node.js** y **Express**.

---

## Datos de Identificación

* **Estudiante:** Omar Piero Terbullino Jaime
* **Código:** 72682019
* **Asignatura:** Ingeniería Web

---

## Estructura General del Repositorio

El espacio de trabajo se organiza en dos proyectos principales:

```text
iw_s11/
├── mi-api/               # Práctica 1: API REST con MongoDB y Mongoose (Relación 1:N Empresa-Empleado)
├── prueba-productos/     # Práctica 2: Sistema de Venta de Computadoras (SQL + MongoDB + CRUD + UI)
├── GUIA_GIT.md           # Guía técnica de ramas y flujos de trabajo con Git
├── GUIA_MONGODB.md       # Guía de comandos mongosh, operadores y modelado ODM
├── README.md             # Documentación general del repositorio
└── .gitignore            # Exclusión de entornos, dependencias y archivos binarios
```

---

## Proyectos Disponibles

### 1. `mi-api` - Gestión de Empresas y Empleados
* **Descripción:** Implementación de la guía de introducción a MongoDB y Mongoose. Desarrolla la relación 1 a N entre empresas y empleados con búsqueda dual (por `_id` y por `slug`), consultas relacionales vía `.populate()`, seguridad con Helmet y logging con Morgan.
* **Base de datos:** `mi_empresa_db`
* **Documentación específica:** Consulte [mi-api/README.md](mi-api/README.md).

### 2. `prueba-productos` - Sistema de Venta de Computadoras
* **Descripción:** Solución integral para la venta de equipos informáticos. Integra:
  - **Diseño Relacional (/docs):** Diagrama Entidad-Relación (DER), Modelo Relacional y Diccionario de Datos exhaustivo para Tiendas, Proveedores, Clientes, Productos, Ventas y Detalles de Venta.
  - **Scripts SQL (/database):** Scripts DDL (creación de tablas y restricciones) y DML (datos de prueba para MySQL/MariaDB).
  - **API REST NoSQL (MongoDB):** CRUD completo (GET, POST, PUT, DELETE) para las 6 entidades bajo la base de datos `prueba_productos_db`.
  - **Manejo de Slugs:** Slugs automáticos para Tiendas (por nombre) y Productos (por nombre + últimos 3 dígitos de código de barras).
  - **Interfaz Visual (UI):** Panel web interactivo para gestionar y visualizar el CRUD en tiempo real con ordenamiento de datos JSON.
* **Base de datos:** `prueba_productos_db`
* **Documentación específica:** Consulte [prueba-productos/README.md](prueba-productos/README.md).

---

## Requisitos y Puesta en Marcha

### Prerrequisitos
1. **Node.js:** Versión 18.0.0 o superior instalada.
2. **MongoDB Community Server:** En ejecución en el puerto local por defecto (`27017`).
3. **MySQL / MariaDB (Opcional para scripts SQL):** Servidor local activo si se desea desplegar el script relacional.

### Instrucciones de Inicio Rápido

Para ejecutar cualquiera de los dos proyectos:

```bash
# 1. Ingresar al directorio del proyecto deseado
cd mi-api
# o bien: cd prueba-productos

# 2. Instalar las dependencias
npm install

# 3. Poblar la base de datos con los datos de prueba
npm run seed

# 4. Iniciar el servidor
npm run dev
# Para prueba-productos con panel web interactivo:
# npm run dev:ui
```
