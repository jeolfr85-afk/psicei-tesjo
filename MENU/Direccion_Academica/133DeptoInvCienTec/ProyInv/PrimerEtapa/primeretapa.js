const MODULE_NAME = 'Proyecto de investigación';
const RECORDS_API = '/prueba/prueba/API/records.php';

const COLUMNAS = [
  { key: 'nombre_proyecto', label: 'NOMBRE DEL PROYECTO', placeholder: 'Ej. Innovación en procesos industriales' },
  { key: 'investigador', label: 'INVESTIGADOR RESPONSABLE', placeholder: 'Nombre del docente investigador' },
  { key: 'programa', label: 'PROGRAMA ACADÉMICO', placeholder: 'Ej. Ingeniería Industrial' },
  { key: 'linea', label: 'LÍNEA DE INVESTIGACIÓN', placeholder: 'Línea o área temática' },
  { key: 'periodo', label: 'PERIODO / VIGENCIA', placeholder: 'Ej. 2025-2026' },
  {
    key: 'estado',
    label: 'ESTADO',
    type: 'select',
    options: ['', 'En formulación', 'En curso', 'Concluido', 'Suspendido'],
  },
  { key: 'financiamiento', label: 'FINANCIAMIENTO / FUENTE', placeholder: 'Interno, PRODEP, CONACYT, etc.' },
  { key: 'observaciones', label: 'OBSERVACIONES', placeholder: 'Notas adicionales' },
];

function setMsg(text, isError = false) {
  const el = document.getElementById('msgProy');
  if (!el) return;
  el.textContent = text;
  el.className = 'msg-proy ' + (isError ? 'err' : 'ok');
}

function construirEncabezado() {
  const thead = document.getElementById('thead');
  const tr = document.createElement('tr');
  COLUMNAS.forEach((col) => {
    const th = document.createElement('th');
    th.textContent = col.label;
    tr.appendChild(th);
  });
  const thAccion = document.createElement('th');
  thAccion.textContent = 'ACCIÓN';
  tr.appendChild(thAccion);
  thead.appendChild(tr);
}

function crearCampo(col) {
  if (col.type === 'select') {
    const select = document.createElement('select');
    select.className = 'editable-select';
    select.dataset.k = col.key;
    col.options.forEach((opt) => {
      const option = document.createElement('option');
      option.value = opt;
      option.textContent = opt || 'Selecciona estado';
      select.appendChild(option);
    });
    return select;
  }
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'editable-text';
  input.dataset.k = col.key;
  input.placeholder = col.placeholder || '';
  return input;
}

function crearFilaProyecto(data = {}) {
  const tbody = document.getElementById('tbody');
  const tr = document.createElement('tr');

  COLUMNAS.forEach((col) => {
    const td = document.createElement('td');
    const field = crearCampo(col);
    if (data[col.key]) {
      field.value = data[col.key];
    }
    td.appendChild(field);
    tr.appendChild(td);
  });

  const tdAccion = document.createElement('td');
  const btnQuitar = document.createElement('button');
  btnQuitar.type = 'button';
  btnQuitar.className = 'btn-quitar';
  btnQuitar.textContent = 'Quitar';
  btnQuitar.addEventListener('click', () => {
    if (tbody.querySelectorAll('tr').length <= 1) {
      setMsg('Debe existir al menos un proyecto en la tabla.', true);
      return;
    }
    tr.remove();
    setMsg('Proyecto eliminado de la tabla.');
  });
  tdAccion.appendChild(btnQuitar);
  tr.appendChild(tdAccion);

  tbody.appendChild(tr);
  aplicarEventosInputs();
}

function obtenerFilas() {
  const rows = [];
  document.querySelectorAll('#tbody tr').forEach((tr) => {
    const row = {};
    tr.querySelectorAll('[data-k]').forEach((field) => {
      row[field.dataset.k] = field.value.trim();
    });
    if (row.nombre_proyecto || row.investigador || row.programa) {
      rows.push(row);
    }
  });
  return rows;
}

async function guardarEnSistema() {
  const rows = obtenerFilas();
  if (!rows.length) {
    setMsg('Agrega al menos un proyecto con nombre o investigador responsable.', true);
    return;
  }

  const invalidas = rows.filter((r) => !r.nombre_proyecto || !r.investigador);
  if (invalidas.length) {
    setMsg('Cada proyecto debe tener al menos nombre e investigador responsable.', true);
    return;
  }

  try {
    const res = await fetch(`${RECORDS_API}?action=save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ module: MODULE_NAME, rows }),
    });
    const data = await res.json();
    if (data.error) {
      setMsg(data.error, true);
      return;
    }
    setMsg(`Se guardaron ${rows.length} proyecto(s) correctamente en el sistema.`);
  } catch (err) {
    setMsg('No se pudo conectar con el servidor.', true);
  }
}

function exportToExcel() {
  const table = document.getElementById('tablaTalleres');
  const wb = XLSX.utils.table_to_book(table, { sheet: 'Proyectos' });
  XLSX.writeFile(wb, 'Proyectos_de_Investigacion.xlsx');
  setMsg('Excel descargado.');
}

function exportToPDF() {
  const tabla = document.getElementById('tablaTalleres');
  const opt = {
    margin: 0.4,
    filename: 'Proyectos_de_Investigacion.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' },
  };
  html2pdf().set(opt).from(tabla).save();
  setMsg('PDF descargado.');
}

function aplicarEventosInputs() {
  const allInputs = Array.from(document.querySelectorAll('.editable-text, .editable-select'));
  allInputs.forEach((input) => {
    if (input.dataset.navBound === '1') return;
    input.dataset.navBound = '1';
    input.addEventListener('keydown', (e) => {
      const colCount = COLUMNAS.length;
      const currentIndex = allInputs.indexOf(e.target);
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = currentIndex + colCount;
        if (next < allInputs.length) allInputs[next].focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = currentIndex - colCount;
        if (prev >= 0) allInputs[prev].focus();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (allInputs[currentIndex + 1]) allInputs[currentIndex + 1].focus();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (allInputs[currentIndex - 1]) allInputs[currentIndex - 1].focus();
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  construirEncabezado();
  crearFilaProyecto();

  const periodoTexto = document.getElementById('periodoTexto');
  const ciclo = localStorage.getItem('cicloEscolarSeleccionado');
  if (ciclo) {
    const [anioInicio, anioFin] = ciclo.split('-');
    periodoTexto.textContent = `Periodo: Septiembre ${anioInicio.slice(-4)} - Febrero ${anioFin.slice(-4)}`;
  } else {
    periodoTexto.textContent = 'Periodo: Septiembre XXXX - Febrero XXXX';
  }

  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('toggleSidebar');
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      toggleBtn.textContent = sidebar.classList.contains('collapsed') ? '⯈' : '⯇';
    });
  }

  document.getElementById('btnAgregarProyecto').addEventListener('click', () => {
    crearFilaProyecto({ estado: 'En curso' });
    setMsg('Nueva fila agregada. Completa los datos del proyecto.');
  });

  document.getElementById('btnGuardarBD').addEventListener('click', guardarEnSistema);
  document.getElementById('btnGuardarExcel').addEventListener('click', exportToExcel);
  document.getElementById('btnGuardarPDF').addEventListener('click', exportToPDF);

  document.getElementById('btnCancelar').addEventListener('click', () => {
    if (!confirm('¿Deseas limpiar la tabla de proyectos?')) return;
    document.getElementById('tbody').innerHTML = '';
    crearFilaProyecto();
    setMsg('Tabla reiniciada.');
  });
});
