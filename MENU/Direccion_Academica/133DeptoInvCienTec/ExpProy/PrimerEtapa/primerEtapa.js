document.addEventListener('DOMContentLoaded', () => {
  const EVENTOS = [
    "",
    "",
    "",
    "",
    ""
  ];

  const thead = document.getElementById('thead');
  const tbody = document.getElementById('tbody');

  // Encabezados de la tabla
  thead.innerHTML = `
    <tr>
      <th>NOMBRE DEL EVENTO</th>
      <th>FECHA</th>
      <th>TOTAL DE BENEFICIARIOS</th>
      <th>INSTITUCIÓN</th> 
      <th>NOMBRE DEL PROYECTO</th>
      <th>ALUMNOS PARTICIPANTES</th>
      <th>DOCENTES PARTICIPANTES</th>
      <th>TIPO DE PROYECTO</th>
      <th>PROGRAMA ACADÉMICO</th>
    </tr>
  `;

  // Función para crear una fila editable
  function crearFila(evento) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="text" class="editable" value="${evento}" /></td>
      <td><input type="date" class="editable" /></td>
      <td><input type="number" min="0" value="" class="editable" /></td>
      <td><input type="text" class="editable" /></td>
      <td><input type="text" class="editable" /></td>
      <td><input type="number" min="0" value="" class="editable" /></td>
      <td><input type="number" min="0" value="" class="editable" /></td>
      <td>
        <select class="editable">
          <option value="">Selecciona</option>
          <option value="CREATIVIDAD">CREATIVIDAD</option>
          <option value="EMPRENDEDORES">EMPRENDEDORES</option>
          <option value="INNOVACIÓN TECNOLÓGICA">INNOVACIÓN TECNOLÓGICA</option>
          <option value="INVESTIGACIÓN APLICADA">INVESTIGACIÓN APLICADA</option>
        </select>
      </td>
      <td><input type="text" class="editable" /></td>
    `;
    tbody.appendChild(tr);
  }

  // Crear filas iniciales
  EVENTOS.forEach(evento => crearFila(evento));

  // Fila de totales
  const trTotal = document.createElement('tr');
  trTotal.classList.add('total-row');
  trTotal.innerHTML = `
    <th>TOTAL</th>
    <td></td>
    <td id="total-beneficiarios">0</td>
    <td colspan="6"></td>
  `;
  tbody.appendChild(trTotal);

  // Función para actualizar totales
  function actualizarTotales() {
    let totalBenef = 0;
    document.querySelectorAll('#tbody tr').forEach((row, i) => {
      if (i < EVENTOS.length) {
        const beneficiarios = parseInt(row.children[2].querySelector('input').value) || 0;
        totalBenef += beneficiarios;
      }
    });
    document.getElementById('total-beneficiarios').textContent = totalBenef;
  }

  // Evento input para actualizar totales
  document.addEventListener('input', (e) => {
    if (e.target.classList.contains('editable')) {
      actualizarTotales();
    }
  });

  // Navegación con flechas
  function aplicarNavegacion() {
    const allInputs = Array.from(document.querySelectorAll('.editable'));
    const colCount = 9; // número de columnas de la tabla

    allInputs.forEach((input, index) => {
      input.addEventListener('keydown', (e) => {
        let targetIndex;
        if (e.key === 'ArrowDown') {
          targetIndex = index + colCount;
        } else if (e.key === 'ArrowUp') {
          targetIndex = index - colCount;
        } else if (e.key === 'ArrowRight') {
          targetIndex = index + 1;
        } else if (e.key === 'ArrowLeft') {
          targetIndex = index - 1;
        }

        if (targetIndex >= 0 && targetIndex < allInputs.length) {
          e.preventDefault();
          allInputs[targetIndex].focus();
        }
      });
    });
  }

  aplicarNavegacion();

  // Sidebar toggle
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('toggleSidebar');
  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    toggleBtn.textContent = sidebar.classList.contains('collapsed') ? '⯈' : '⯇';
  });

  // Mostrar periodo
  const periodoTexto = document.getElementById('periodoTexto');
  const ciclo = localStorage.getItem('cicloEscolarSeleccionado');
  if (ciclo) {
    const [anioInicio, anioFin] = ciclo.split('-');
    periodoTexto.textContent = `Periodo: Septiembre ${anioInicio.slice(-4)} - Febrero ${anioFin.slice(-4)}`;
  } else {
    periodoTexto.textContent = 'Periodo: Septiembre XXXX - Febrero XXXX';
  }

  // Exportar a Excel
  window.exportToExcel = function () {
    const table = document.getElementById("tablaTalleres");
    const wb = XLSX.utils.table_to_book(table, { sheet: "Estadísticas" });
    XLSX.writeFile(wb, "Plantilla_Investigadores.xlsx");
  };

  // Exportar a PDF
  window.exportToPDF = function () {
    const tabla = document.getElementById("tablaTalleres");
    const opt = {
      margin: 0.5,
      filename: "Plantilla_Investigadores.pdf",
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
    };
    html2pdf().set(opt).from(tabla).save();
  };

  // Botones
  document.getElementById('btnGuardarExcel').addEventListener('click', exportToExcel);
  document.getElementById('btnGuardarPDF').addEventListener('click', exportToPDF);
});
