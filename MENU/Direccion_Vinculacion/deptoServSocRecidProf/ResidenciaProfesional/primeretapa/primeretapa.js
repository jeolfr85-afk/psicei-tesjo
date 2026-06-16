// Variables globales
const CATEGORIAS = [
  "EDUCATIVO (PROPIA INSTITUCIÓN)",
  "PÚBLICO",
  "PRIVADO",
  "SOCIAL"
];

const SUBCATEGORIAS = [
  "HOMBRES",
  "MUJERES",
  "CON DISCAPACIDAD",
  "HABLANTES DE LENGUAS INDÍGENAS"
];

const PROGRAMAS = [
  "INGENIERÍA ELECTROMECÁNICA — IEME-2010-210",
  "INGENIERÍA INDUSTRIAL — IIND-2010-227",
  "INGENIERÍA INDUSTRIAL (EXTENSIÓN ACULCO) — IIND-2010-227",
  "INGENIERÍA EN SISTEMAS COMPUTACIONALES — ISIC-2010-224",
  "INGENIERÍA EN SISTEMAS COMPUTACIONALES (EXTENSIÓN ACULCO) — ISIC-2010-224",
  "INGENIERÍA MECATRÓNICA — IMCT-2010-229",
  "ARQUITECTURA — ARQU-2010-204",
  "CONTADOR PÚBLICO — COPU-2010-205",
  "CONTADOR PÚBLICO (EXTENSIÓN ACULCO) — COPU-2010-205",
  "INGENIERÍA EN GESTIÓN EMPRESARIAL — IGEM-2009-201",
  "INGENIERÍA QUÍMICA — IQUI-2010-232",
  "INGENIERÍA EN MATERIALES — IMAT-2010-222",
  "INGENIERÍA EN ANIMACIÓN DIGITAL Y EFECTOS VISUALES — IAEV-2012-238",
  "LICENCIATURA EN TURISMO — LTUR-2012-237",
  "LICENCIATURA EN TURISMO (EXTENSIÓN ACULCO) — LTUR-2012-237"
];

// Referencias DOM globales
const thead = document.getElementById('thead');
const tbody = document.getElementById('tbody');
const periodoTexto = document.getElementById('periodoTexto');

// Construir encabezado de 3 niveles sin innerHTML
function construirEncabezado() {
  thead.innerHTML = ''; // limpia si hay algo

  const header0 = document.createElement('tr');
  // Columnas con rowspan 3
  const colsConRowSpan3 = [
    "PROGRAMAS ACADÉMICOS",
    "ALUMNOS QUE CUENTAN CON 85% DE CREDITOS PARA REALIZAR RESIDENCIA PROFESIONAL",
    "ALUMNOS CON OFICIO DE ACEPTACIÓN",
    "LUMNOS DADOS DE ALTA EN SERVICIOS ESCOLARES (SISTEMA)",
    "ALUMNOS QUE NO HAN INICIADO EL TRÁMITE"
  ];
  colsConRowSpan3.forEach(text => {
    const th = document.createElement('th');
    th.textContent = text;
    th.rowSpan = 3;
    header0.appendChild(th);
  });

  const thCategorias = document.createElement('th');
  thCategorias.colSpan = CATEGORIAS.length * SUBCATEGORIAS.length;
  thCategorias.textContent = "ALUMNOS QUE REALIZARON RESIDENCIA PROFESIONAL POR SECTOR";
  header0.appendChild(thCategorias);

  thead.appendChild(header0);

  // Segunda fila con categorías (colspan subcategorías)
  const header1 = document.createElement('tr');
  CATEGORIAS.forEach(cat => {
    const th = document.createElement('th');
    th.colSpan = SUBCATEGORIAS.length;
    th.textContent = cat;
    header1.appendChild(th);
  });
  thead.appendChild(header1);

  // Tercer fila con subcategorías
  const header2 = document.createElement('tr');
  CATEGORIAS.forEach(() => {
    SUBCATEGORIAS.forEach(sub => {
      const th = document.createElement('th');
      th.textContent = sub;
      header2.appendChild(th);
    });
  });
  thead.appendChild(header2);
}

// Construir cuerpo de la tabla sin innerHTML
function construirCuerpo() {
  tbody.innerHTML = ''; // limpiar

  PROGRAMAS.forEach(programa => {
    const tr = document.createElement('tr');

    const tdPrograma = document.createElement('td');
    tdPrograma.textContent = programa;
    tr.appendChild(tdPrograma);

    // 4 columnas con inputs numéricos
    for (let i = 0; i < 4; i++) {
      const td = document.createElement('td');
      const input = document.createElement('input');
      input.type = 'number';
      input.classList.add('editable');
      td.appendChild(input);
      tr.appendChild(td);
    }

    // Celdas para categorias * subcategorias con input
    CATEGORIAS.forEach(() => {
      SUBCATEGORIAS.forEach(() => {
        const td = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'number';
        input.classList.add('editable');
        td.appendChild(input);
        tr.appendChild(td);
      });
    });

    tbody.appendChild(tr);
  });

  // Fila total
  const totalRow = document.createElement('tr');
  totalRow.classList.add('total-row');

  const thTotal = document.createElement('th');
  thTotal.textContent = "TOTAL";
  totalRow.appendChild(thTotal);

  const totalCols = 4 + (CATEGORIAS.length * SUBCATEGORIAS.length);
  for (let i = 0; i < totalCols; i++) {
    const td = document.createElement('td');
    td.classList.add('total');
    td.textContent = "0";
    totalRow.appendChild(td);
  }

  tbody.appendChild(totalRow);
}

// Actualizar totales
function actualizarTotales() {
  const filas = Array.from(tbody.querySelectorAll('tr')).slice(0, -1); // sin total
  const numCols = 4 + CATEGORIAS.length * SUBCATEGORIAS.length;
  const totales = new Array(numCols).fill(0);

  filas.forEach(fila => {
    const inputs = fila.querySelectorAll('input');
    inputs.forEach((input, i) => {
      totales[i] += parseInt(input.value) || 0;
    });
  });

  const totalCells = tbody.querySelector('.total-row').querySelectorAll('.total');
  totalCells.forEach((celda, i) => {
    celda.textContent = totales[i];
  });
}

// Mostrar periodo (de localStorage o por defecto)
function mostrarPeriodo() {
  if (!periodoTexto) return;
  const ciclo = localStorage.getItem('cicloEscolarSeleccionado');
  if (ciclo) {
    const [anioInicio, anioFin] = ciclo.split('-');
    periodoTexto.textContent = `Periodo: Febrero ${anioInicio.slice( -4)}-Agosto ${anioFin.slice( -4)}`;
  } else {
    periodoTexto.textContent = "Periodo: FebXXXX - FebXXXX";
  }
}

// Obtener datos tabla para enviar
function obtenerDatosTabla() {
  const filas = Array.from(tbody.querySelectorAll('tr')).slice(0, -1); // sin fila total
  const datos = [];

  filas.forEach(fila => {
    const celdas = fila.querySelectorAll('td');
    if (!celdas.length) return;

    const programa = celdas[0].textContent.trim();
    for (let i = 1; i < celdas.length; i++) {
      const valor = celdas[i].querySelector('input')?.value.trim() || "0";
      datos.push({
        programa,
        campo: i,
        valor
      });
    }
  });

  return datos;
}

// Guardar datos con fetch POST
function guardarDatos() {
  const datos = obtenerDatosTabla();

  fetch("guardarA.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos)
  })
  .then(res => res.text())
  .then(resp => alert(resp))
  .catch(err => alert("Error al guardar datos: " + err));
}

// Descargar PDF con jsPDF y autotable
function descargarPDF() {
  import('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js').then(({ jsPDF }) => {
    import('https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js').then(() => {
      const doc = new jsPDF();
      doc.text("Estadísticas Actividades Complementarias", 14, 16);
      doc.autoTable({ html: '#tablaTalleres', startY: 20 });
      doc.save('estadisticas_actividades.pdf');
    });
  });
}

// Descargar Excel con SheetJS
function descargarExcel() {
  if (typeof XLSX === "undefined") {
    alert("Error: Librería XLSX no cargada");
    return;
  }
  const tabla = document.getElementById("tablaTalleres");
  const wb = XLSX.utils.table_to_book(tabla);
  XLSX.writeFile(wb, "estadisticas_actividades.xlsx");
}

// Cancelar (recarga página)
function cancelar() {
  if(confirm("¿Seguro que desea cancelar? Se perderán los cambios no guardados.")){
    location.reload();
  }
}

// Navegación con teclado en inputs
function manejarTeclas(e) {
  const inputs = Array.from(document.querySelectorAll('.editable'));
  const index = inputs.indexOf(e.target);
  if (index === -1) return;

  const colsPorFila = 4 + (CATEGORIAS.length * SUBCATEGORIAS.length);

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      const downIndex = index + colsPorFila;
      if (inputs[downIndex]) inputs[downIndex].focus();
      break;
    case 'ArrowUp':
      e.preventDefault();
      const upIndex = index - colsPorFila;
      if (inputs[upIndex]) inputs[upIndex].focus();
      break;
    case 'ArrowRight':
      e.preventDefault();
      if (inputs[index + 1]) inputs[index + 1].focus();
      break;
    case 'ArrowLeft':
      e.preventDefault();
      if (inputs[index - 1]) inputs[index - 1].focus();
      break;
    case 'Tab':
      // Por defecto puede quedar igual, o puedes personalizar
      break;
  }
}

// Eventos al cargar página
document.addEventListener('DOMContentLoaded', () => {
  construirEncabezado();
  construirCuerpo();
  mostrarPeriodo();

  document.getElementById("btnGuardarBD").addEventListener("click", guardarDatos);
  document.getElementById("btnGuardarPDF").addEventListener("click", descargarPDF);
  document.getElementById("btnGuardarExcel").addEventListener("click", descargarExcel);
  document.getElementById("btnCancelar").addEventListener("click", cancelar);

  document.addEventListener('input', actualizarTotales);
  tbody.addEventListener('keydown', manejarTeclas);
  
});
 // Sidebar toggle
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggleSidebar');

toggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('collapsed');
  toggleBtn.textContent = sidebar.classList.contains('collapsed') ? '⯈' : '⯇';
});
