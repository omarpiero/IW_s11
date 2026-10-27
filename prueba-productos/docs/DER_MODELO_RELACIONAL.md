# Diseño Conceptual y Lógico: Sistema de Venta de Computadoras

* **Estudiante:** Omar Piero Terbullino Jaime
* **Código:** 72682019
* **Asignatura:** Ingeniería Web
* **Base de Datos:** `prueba_productos_db`

---

## 1. Diagrama Entidad-Relación (DER)

A continuación se representa el modelo conceptual de datos para el negocio de venta y distribución de computadoras y equipos tecnológicos:

```mermaid
erDiagram
    TIENDAS ||--o{ PRODUCTOS : "ofrece en inventario"
    PROVEEDORES ||--o{ PRODUCTOS : "abastece"
    CLIENTES ||--o{ VENTAS : "realiza"
    TIENDAS ||--o{ VENTAS : "factura en sucursal"
    VENTAS ||--|{ DETALLES_VENTA : "contiene lineas de venta"
    PRODUCTOS ||--o{ DETALLES_VENTA : "se incluye como item"

    TIENDAS {
        INT id_tienda PK
        VARCHAR nombre "Nombre comercial"
        VARCHAR slug UK "Identificador amigable"
        VARCHAR direccion
        VARCHAR telefono
        VARCHAR ruc UK "Registro único tributario"
    }

    PROVEEDORES {
        INT id_proveedor PK
        VARCHAR nombre "Razón social"
        VARCHAR contacto "Persona de contacto"
        VARCHAR telefono
        VARCHAR email
        VARCHAR direccion
    }

    CLIENTES {
        INT id_cliente PK
        VARCHAR nombre
        VARCHAR apellido
        VARCHAR dni UK "Documento nacional de identidad"
        VARCHAR email
        VARCHAR telefono
        VARCHAR direccion
    }

    PRODUCTOS {
        INT id_producto PK
        VARCHAR nombre "Nombre comercial del equipo"
        VARCHAR marca "HP, Lenovo, Asus, etc."
        VARCHAR modelo "Serie o modelo específico"
        DECIMAL precio "Precio unitario de venta"
        INT stock "Cantidad disponible"
        VARCHAR codigo_barras UK "Código EAN/UPC de barras"
        VARCHAR slug UK "nombre-ultimos3digitos"
        TEXT descripcion "Especificaciones generales"
        INT id_tienda FK "Tienda que posee el stock"
        INT id_proveedor FK "Proveedor que suministra"
    }

    VENTAS {
        INT id_venta PK
        VARCHAR numero_factura UK "Serie correlativa de venta"
        DATETIME fecha "Fecha y hora de emisión"
        DECIMAL total "Monto total acumulado"
        VARCHAR metodo_pago "Efectivo, Tarjeta, Transferencia"
        INT id_cliente FK "Cliente comprador"
        INT id_tienda FK "Tienda donde se despacha"
    }

    DETALLES_VENTA {
        INT id_detalle PK
        INT id_venta FK "Comprobante de venta asociado"
        INT id_producto FK "Computadora/Producto vendido"
        INT cantidad "Unidades despachadas"
        DECIMAL precio_unitario "Precio de venta al momento"
        DECIMAL subtotal "cantidad * precio_unitario"
    }
```

---

## 2. Modelo Relacional (Esquema Lógico)

A partir del DER conceptual, se deriva el esquema relacional normalizado en Tercera Forma Normal (3FN):

1. **TIENDAS** (<u>id_tienda</u>, nombre, slug, direccion, telefono, ruc)
   * PK: `id_tienda`
   * Unique: `slug`, `ruc`

2. **PROVEEDORES** (<u>id_proveedor</u>, nombre, contacto, telefono, email, direccion)
   * PK: `id_proveedor`

3. **CLIENTES** (<u>id_cliente</u>, nombre, apellido, dni, email, telefono, direccion)
   * PK: `id_cliente`
   * Unique: `dni`

4. **PRODUCTOS** (<u>id_producto</u>, nombre, marca, modelo, precio, stock, codigo_barras, slug, descripcion, *id_tienda*, *id_proveedor*)
   * PK: `id_producto`
   * FK: `id_tienda` $\rightarrow$ TIENDAS(id_tienda)
   * FK: `id_proveedor` $\rightarrow$ PROVEEDORES(id_proveedor)
   * Unique: `codigo_barras`, `slug`

5. **VENTAS** (<u>id_venta</u>, numero_factura, fecha, total, metodo_pago, *id_cliente*, *id_tienda*)
   * PK: `id_venta`
   * FK: `id_cliente` $\rightarrow$ CLIENTES(id_cliente)
   * FK: `id_tienda` $\rightarrow$ TIENDAS(id_tienda)
   * Unique: `numero_factura`

6. **DETALLES_VENTA** (<u>id_detalle</u>, *id_venta*, *id_producto*, cantidad, precio_unitario, subtotal)
   * PK: `id_detalle`
   * FK: `id_venta` $\rightarrow$ VENTAS(id_venta) [ON DELETE CASCADE]
   * FK: `id_producto` $\rightarrow$ PRODUCTOS(id_producto) [ON DELETE RESTRICT]
