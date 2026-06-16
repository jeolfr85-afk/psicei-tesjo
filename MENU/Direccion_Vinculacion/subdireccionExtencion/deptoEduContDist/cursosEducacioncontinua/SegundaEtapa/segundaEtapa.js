document.addEventListener('DOMContentLoaded', () => {
  const AREAS = ["CURSOS CORTOS", "DIPLOMADOS", "SEMINARIOS", "TALLERES", "OTROS", "TOTAL"];
  const thead = document.getElementById('thead');
  const tbody = document.getElementById('tbody');
  const periodoTexto = document.getElementById('periodoTexto');

  // Encabezado de la tabla
  thead.innerHTML = `
    <tr>
      <th>NÚMERO</th>
      <th>HOMBRES</th>
      <th>MUJERES</th>
      <th>TOTAL</th>
      <th>CON DISCAPACIDAD</th>
      <th>HABLANTES DE LENGUAS INDÍGENAS</th>
      <th>NOMBRE DEL CURSO</th>
    </tr>
  `;

  // Generar filas
  AREAS.forEach(area => {
    const tr = document.createElement('tr');

    // Columna de área
    const tdArea = document.createElement('td');
    tdArea.textContent = area;
    tdArea.classList.add('area-label');
    tr.appendChild(tdArea);

    // Columnas numéricas
    const inputCols = ["HOMBRES", "MUJERES", "TOTAL", "CON DISCAPACIDAD", "HABLANTES DE LENGUAS INDÍGENAS"];
    inputCols.forEach(col => {
      const td = document.createElement('td');
      const input = document.createElement('input');
      input.type = 'number';
      input.min = 0;
      if (col === "TOTAL") {
        input.readOnly = true;
        input.classList.add('input-total');
      }
      td.appendChild(input);
      tr.appendChild(td);
    });

    // Columna de nombre de curso
    const tdNombre = document.createElement('td');
    if (area !== "TOTAL") {
      const inputNombre = document.createElement('input');
      inputNombre.type = 'text';
      inputNombre.placeholder = " Escribe el nombre del curso";
      inputNombre.style.width = "200px";
      inputNombre.style.boxSizing = "border-box";
      tdNombre.appendChild(inputNombre);
    }
    tr.appendChild(tdNombre);

    // Evento para calcular total de la fila
    const inputs = tr.querySelectorAll('input[type="number"]');
    const actualizarTotal = () => {
      const hombres = parseInt(inputs[0].value) || 0;
      const mujeres = parseInt(inputs[1].value) || 0;
      inputs[2].value = hombres + mujeres;
      actualizarFilaTotal();
    };

    inputs[0].addEventListener('input', actualizarTotal);
    inputs[1].addEventListener('input', actualizarTotal);

    tbody.appendChild(tr);
  });

  // Mostrar periodo
  mostrarPeriodo(periodoTexto);

  // Eventos generales
  tbody.addEventListener('input', actualizarFilaTotal);
  tbody.addEventListener('keydown', manejarTeclas);
});

// Mostrar periodo desde localStorage
function mostrarPeriodo(periodoTexto) {
  if (!periodoTexto) return;
  const ciclo = localStorage.getItem('cicloEscolarSeleccionado');
  if (ciclo) {
    const [anioInicio, anioFin] = ciclo.split('-');
    periodoTexto.textContent = `Periodo: Febrero ${anioInicio.slice(-4)} - Agosto ${anioFin.slice(-4)}`;
  } else {
    periodoTexto.textContent = "Periodo: FebXXXX - AgoXXXX";
  }
}

// Calcular totales en la fila TOTAL
function actualizarFilaTotal() {
  const filas = Array.from(document.querySelectorAll('#tbody tr'));
  const totalIndex = filas.length - 1;
  const suma = [0, 0, 0, 0, 0]; // Hombres, Mujeres, Total, Discapacidad, Lenguas

  filas.forEach((fila, idx) => {
    if (idx === totalIndex) return;
    const inputs = fila.querySelectorAll('input[type="number"]');
    suma.forEach((_, i) => {
      suma[i] += parseInt(inputs[i].value) || 0;
    });
  });

  const filaTotal = filas[totalIndex];
  const inputsTotal = filaTotal.querySelectorAll('input[type="number"]');
  suma.forEach((val, i) => {
    inputsTotal[i].value = val;
  });
}

// Navegación con flechas y Tab
function manejarTeclas(e) {
  const inputs = Array.from(document.querySelectorAll('#tbody input[type="number"], #tbody input[type="text"]'));
  const idx = inputs.indexOf(document.activeElement);
  if (idx === -1) return;

  let nextIdx = null;
  const cols = 6 + 1; // 6 numéricas + 1 texto
  if (e.key === 'ArrowRight' || e.key === 'Tab') {
    nextIdx = idx + 1;
    if (nextIdx >= inputs.length) nextIdx = 0;
    e.preventDefault();
    inputs[nextIdx].focus();
  } else if (e.key === 'ArrowLeft') {
    nextIdx = idx - 1;
    if (nextIdx < 0) nextIdx = inputs.length - 1;
    e.preventDefault();
    inputs[nextIdx].focus();
  } else if (e.key === 'ArrowDown') {
    nextIdx = idx + cols;
    if (nextIdx >= inputs.length) nextIdx = idx % cols;
    e.preventDefault();
    inputs[nextIdx].focus();
  } else if (e.key === 'ArrowUp') {
    nextIdx = idx - cols;
    if (nextIdx < 0) nextIdx = inputs.length - (cols - (idx % cols));
    e.preventDefault();
    inputs[nextIdx].focus();
  }
}

// Sidebar toggle
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggleSidebar');
toggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('collapsed');
  toggleBtn.textContent = sidebar.classList.contains('collapsed') ? '⯈' : '⯇';
});

// === Funciones de Exportación Mejoradas ===

// Generar una copia limpia de la tabla para exportar
function getCleanTableHTML() {
  const originalTable = document.getElementById("tablaTalleres");
  const clone = originalTable.cloneNode(true);

  // Reemplazar todos los inputs por su valor
  clone.querySelectorAll('input').forEach(input => {
    const td = input.parentElement;
    td.textContent = input.value || "";
  });

  return clone;
}

// Exportar tabla a Excel
function exportToExcel() {
  const cleanTable = getCleanTableHTML();
  const wb = XLSX.utils.table_to_book(cleanTable, { sheet: "Estadísticas" });
  XLSX.writeFile(wb, "Estadisticas_por_area.xlsx");
}

// Exportar tabla a PDF con estilo tipo imagen
function exportToPDF() {
  const cleanTable = getCleanTableHTML();

  // Estilos para PDF
  cleanTable.style.borderCollapse = "collapse";
  cleanTable.style.width = "100%";
  cleanTable.querySelectorAll("th, td").forEach(cell => {
    cell.style.border = "1px solid #ddd";
    cell.style.padding = "8px";
    cell.style.textAlign = "left";
    cell.style.fontFamily = "Arial, sans-serif";
    cell.style.fontSize = "12px";
  });

  // Encabezado azul
  cleanTable.querySelectorAll("th").forEach(th => {
    th.style.backgroundColor = "#003366";
    th.style.color = "white";
    th.style.fontWeight = "bold";
  });

  // Filas alternadas
  cleanTable.querySelectorAll("tr:nth-child(even)").forEach(row => {
    row.style.backgroundColor = "#f9f9f9";
  });

  if (typeof html2pdf !== 'undefined') {
    const opt = {
      margin: 10,
      filename: 'Estadisticas_por_area.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };
    html2pdf().set(opt).from(cleanTable).save();
  } else {
    alert('No se encontró la librería html2pdf.js para exportar a PDF.');
  }
}

// Vincular botones
document.getElementById('btnGuardarExcel').addEventListener('click', exportToExcel);
document.getElementById('btnGuardarPDF').addEventListener('click', exportToPDF);

// === Totales de beneficiarios ===
document.addEventListener('DOMContentLoaded', () => {
  const totalBeneficiarios = document.getElementById('total-beneficiarios');

  function actualizarTotales() {
    const inputs = document.querySelectorAll('.editable');
    let total = 0;
    inputs.forEach(input => {
      if (input.value) {
        total += parseInt(input.value) || 0;
      }
    });
    if (totalBeneficiarios) {
      totalBeneficiarios.textContent = total;
    }
  }

  if (totalBeneficiarios) {
    actualizarTotales();
  }
});
