// app.js - Lógica interactiva del cliente para la gestión del CRUD y ordenamiento JSON

let currentTab = 'productos';
let currentData = [];
let sortKey = null;
let sortAsc = true;
let editingId = null;

const endpoints = {
  productos: '/api/productos',
  tiendas: '/api/tiendas',
  clientes: '/api/clientes',
  ventas: '/api/ventas',
  detalles: '/api/detalles-venta'
};

// Configuración de columnas por pestaña
const columnConfigs = {
  productos: [
    { key: 'nombre', label: 'Nombre' },
    { key: 'marca', label: 'Marca' },
    { key: 'modelo', label: 'Modelo' },
    { key: 'precio', label: 'Precio (S/.)', isNum: true },
    { key: 'stock', label: 'Stock', isNum: true },
    { key: 'codigo_barras', label: 'Cód. Barras', isBadge: 'barcode' },
    { key: 'slug', label: 'Slug', isBadge: 'slug' },
    { key: 'actions', label: 'Acciones' }
  ],
  tiendas: [
    { key: 'nombre', label: 'Nombre Comercial' },
    { key: 'slug', label: 'Slug', isBadge: 'slug' },
    { key: 'ruc', label: 'RUC' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'direccion', label: 'Dirección' },
    { key: 'actions', label: 'Acciones' }
  ],
  clientes: [
    { key: 'nombre', label: 'Nombre' },
    { key: 'apellido', label: 'Apellido' },
    { key: 'dni', label: 'DNI' },
    { key: 'email', label: 'Email' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'actions', label: 'Acciones' }
  ],
  ventas: [
    { key: 'numero_factura', label: 'N° Factura' },
    { key: 'fecha', label: 'Fecha' },
    { key: 'total', label: 'Total (S/.)', isNum: true },
    { key: 'metodo_pago', label: 'Método Pago' },
    { key: 'actions', label: 'Acciones' }
  ],
  detalles: [
    { key: '_id', label: 'ID Detalle' },
    { key: 'cantidad', label: 'Cantidad', isNum: true },
    { key: 'precio_unitario', label: 'Precio Unit.', isNum: true },
    { key: 'subtotal', label: 'Subtotal (S/.)', isNum: true },
    { key: 'actions', label: 'Acciones' }
  ]
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  setupTabs();
  setupEvents();
  loadData(currentTab);
});

// Configurar pestañas
function setupTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTab = btn.dataset.tab;
      editingId = null;
      hideForm();
      loadData(currentTab);
    });
  });
}

// Configurar eventos generales
function setupEvents() {
  document.getElementById('refresh-btn').addEventListener('click', () => loadData(currentTab));
  document.getElementById('toggle-form-btn').addEventListener('click', showFormForCreation);
  document.getElementById('close-form-btn').addEventListener('click', hideForm);
  document.getElementById('cancel-form-btn').addEventListener('click', hideForm);
  document.getElementById('dynamic-form').addEventListener('submit', handleFormSubmit);

  // Búsqueda en tiempo real
  document.getElementById('filter-input').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = currentData.filter(item => {
      return JSON.stringify(item).toLowerCase().includes(query);
    });
    renderTable(filtered);
  });
}

// Cargar datos de la API
async function loadData(tab) {
  const url = endpoints[tab];
  document.getElementById('json-endpoint-label').textContent = `GET ${url}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    currentData = Array.isArray(data) ? data : (data.value || []);
    
    // Actualizar visor JSON
    document.getElementById('json-viewer').textContent = JSON.stringify(currentData, null, 2);
    renderTable(currentData);
  } catch (err) {
    document.getElementById('table-body').innerHTML = `<tr><td colspan="8" class="text-center" style="color: var(--danger)">[X] Error al cargar datos: ${err.message}</td></tr>`;
  }
}

// Renderizar tabla dinámica
function renderTable(data) {
  const columns = columnConfigs[currentTab];
  const thead = document.getElementById('table-head');
  const tbody = document.getElementById('table-body');

  // Encabezados con soporte de ordenamiento
  thead.innerHTML = `<tr>${columns.map(col => {
    if (col.key === 'actions') return `<th>${col.label}</th>`;
    const icon = sortKey === col.key ? (sortAsc ? ' ▲' : ' ▼') : '';
    return `<th onclick="sortTable('${col.key}', ${col.isNum || false})">${col.label}${icon}</th>`;
  }).join('')}</tr>`;

  if (!data || data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="${columns.length}" class="text-center">No hay registros encontrados.</td></tr>`;
    return;
  }

  // Filas
  tbody.innerHTML = data.map(item => {
    return `<tr>${columns.map(col => {
      if (col.key === 'actions') {
        return `
          <td>
            <button class="btn btn-view" onclick="viewItemJson('${item._id}')">JSON</button>
            <button class="btn btn-edit" onclick="editItem('${item._id}')">Editar</button>
            <button class="btn btn-danger" onclick="deleteItem('${item._id}')">Eliminar</button>
          </td>
        `;
      }

      let val = item[col.key];
      if (col.key === 'fecha' && val) val = new Date(val).toLocaleString();
      if (col.isNum && typeof val === 'number') val = val.toFixed(2);
      if (val === undefined || val === null) val = '-';

      if (col.isBadge === 'slug') return `<td><span class="badge badge-slug">${val}</span></td>`;
      if (col.isBadge === 'barcode') return `<td><span class="badge badge-barcode">${val}</span></td>`;
      return `<td>${val}</td>`;
    }).join('')}</tr>`;
  }).join('');
}

// Ordenamiento
window.sortTable = function(key, isNum) {
  if (sortKey === key) {
    sortAsc = !sortAsc;
  } else {
    sortKey = key;
    sortAsc = true;
  }

  currentData.sort((a, b) => {
    let valA = a[key] ?? '';
    let valB = b[key] ?? '';
    if (isNum) {
      valA = Number(valA);
      valB = Number(valB);
    } else {
      valA = valA.toString().toLowerCase();
      valB = valB.toString().toLowerCase();
    }
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  renderTable(currentData);
};

// Ver JSON individual
window.viewItemJson = function(id) {
  const item = currentData.find(i => i._id === id);
  if (item) {
    document.getElementById('json-endpoint-label').textContent = `GET ${endpoints[currentTab]}/${item.slug || id}`;
    document.getElementById('json-viewer').textContent = JSON.stringify(item, null, 2);
    document.querySelector('.json-card').scrollIntoView({ behavior: 'smooth' });
  }
};

// Eliminar Registro (DELETE)
window.deleteItem = async function(id) {
  if (!confirm('¿Confirma que desea eliminar este registro de la base de datos?')) return;
  const url = `${endpoints[currentTab]}/${id}`;
  try {
    const res = await fetch(url, { method: 'DELETE' });
    const result = await res.json();
    document.getElementById('json-endpoint-label').textContent = `DELETE ${url}`;
    document.getElementById('json-viewer').textContent = JSON.stringify(result, null, 2);
    loadData(currentTab);
  } catch (err) {
    alert(`[X] Error al eliminar: ${err.message}`);
  }
};

// Formulario dinámico
function showFormForCreation() {
  editingId = null;
  document.getElementById('form-title').textContent = `Registrar en: ${currentTab.toUpperCase()}`;
  renderFormFields();
  document.getElementById('form-container').classList.remove('hidden');
}

function hideForm() {
  document.getElementById('form-container').classList.add('hidden');
  document.getElementById('dynamic-form').reset();
}

window.editItem = function(id) {
  editingId = id;
  const item = currentData.find(i => i._id === id);
  if (!item) return;

  document.getElementById('form-title').textContent = `Editar Registro en ${currentTab.toUpperCase()}`;
  renderFormFields(item);
  document.getElementById('form-container').classList.remove('hidden');
};

function renderFormFields(item = {}) {
  const container = document.getElementById('form-fields');
  let html = '';

  if (currentTab === 'productos') {
    html = `
      <div class="form-group"><label>Nombre del Producto *</label><input type="text" name="nombre" value="${item.nombre || ''}" required></div>
      <div class="form-group"><label>Marca *</label><input type="text" name="marca" value="${item.marca || ''}" required></div>
      <div class="form-group"><label>Modelo</label><input type="text" name="modelo" value="${item.modelo || ''}"></div>
      <div class="form-group"><label>Precio (S/.) *</label><input type="number" step="0.01" name="precio" value="${item.precio || ''}" required></div>
      <div class="form-group"><label>Stock *</label><input type="number" name="stock" value="${item.stock || 0}" required></div>
      <div class="form-group"><label>Código de Barras (Único) *</label><input type="text" name="codigo_barras" value="${item.codigo_barras || ''}" required></div>
      <div class="form-group"><label>Descripción</label><input type="text" name="descripcion" value="${item.descripcion || ''}"></div>
    `;
  } else if (currentTab === 'tiendas') {
    html = `
      <div class="form-group"><label>Nombre de la Tienda *</label><input type="text" name="nombre" value="${item.nombre || ''}" required></div>
      <div class="form-group"><label>RUC (11 dígitos) *</label><input type="text" name="ruc" value="${item.ruc || ''}" required></div>
      <div class="form-group"><label>Teléfono</label><input type="text" name="telefono" value="${item.telefono || ''}"></div>
      <div class="form-group"><label>Dirección</label><input type="text" name="direccion" value="${item.direccion || ''}"></div>
    `;
  } else if (currentTab === 'clientes') {
    html = `
      <div class="form-group"><label>Nombre *</label><input type="text" name="nombre" value="${item.nombre || ''}" required></div>
      <div class="form-group"><label>Apellido *</label><input type="text" name="apellido" value="${item.apellido || ''}" required></div>
      <div class="form-group"><label>DNI *</label><input type="text" name="dni" value="${item.dni || ''}" required></div>
      <div class="form-group"><label>Email</label><input type="email" name="email" value="${item.email || ''}"></div>
      <div class="form-group"><label>Teléfono</label><input type="text" name="telefono" value="${item.telefono || ''}"></div>
    `;
  } else {
    html = `<p style="grid-column: 1/-1; color: var(--text-muted)">Los formularios para ${currentTab} se gestionan directamente a través de los endpoints de la API.</p>`;
  }

  container.innerHTML = html;
}

// Guardar Formulario (POST / PUT)
async function handleFormSubmit(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const payload = Object.fromEntries(formData.entries());

  if (payload.precio) payload.precio = parseFloat(payload.precio);
  if (payload.stock) payload.stock = parseInt(payload.stock);

  // Si creamos producto y no tiene tienda_id, le asignamos la primera tienda disponible
  if (currentTab === 'productos' && !editingId) {
    try {
      const tRes = await fetch('/api/tiendas');
      const tiendas = await tRes.json();
      if (tiendas.length > 0) payload.tienda_id = tiendas[0]._id;
    } catch (_) {}
  }

  const method = editingId ? 'PUT' : 'POST';
  const url = editingId ? `${endpoints[currentTab]}/${editingId}` : endpoints[currentTab];

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Error al procesar');

    document.getElementById('json-endpoint-label').textContent = `${method} ${url}`;
    document.getElementById('json-viewer').textContent = JSON.stringify(result, null, 2);
    hideForm();
    loadData(currentTab);
  } catch (err) {
    alert(`[X] ${err.message}`);
  }
}
