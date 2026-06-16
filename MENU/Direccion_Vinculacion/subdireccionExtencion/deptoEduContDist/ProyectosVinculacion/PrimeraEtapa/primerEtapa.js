document.addEventListener('DOMContentLoaded', () => {
  const AREAS = [
    "INVESTIGACIÓN Y DESARROLLO",
    "ASESORÍAS TÉCNICAS",
    "PRÁCTICAS PROFESIONALES",
    "EDUCACIÓN CONTINUA",
    "SERVICIO SOCIAL",
    "OTROS"

  ];

  const thead = document.getElementById('thead');
  const tbody = document.getElementById('tbody');

  // Encabezados
  thead.innerHTML = `
    <tr>
      <th style="text-align: center; vertical-align: middle;">PROYECTOS<br>DE INVESTIGACIÓN</th>
      <th style="text-align: center; vertical-align: middle;">
        SECTOR<br>
        <span style="font-size: 11px;">
          (sector público, microempresa,<br>
          pequeñas empresas,medianas empresas,<br>
          grandes empresas, sector social)
        </span>
      </th>
      <th style="text-align: center; vertical-align: middle;">Número<br>de Alumnos</th>
      <th style="text-align: center; vertical-align: middle;">Nombre<br>del Proyecto</th>
    </tr>
  `;
 // Crear filas por área
  function crearFila(area) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${area}</td>
      <td><input type="number" min="0" class="editable" /></td>
      <td><input type="number" min="0" class="editable" /></td>
      <td><input type="text" class="editable-text" placeholder="Escribe el nombre" /></td>
    `;
    tbody.appendChild(tr);
  }

  AREAS.forEach(crearFila);

  // Fila de totales
  const trTotal = document.createElement('tr');
  trTotal.classList.add('total-row');
  trTotal.innerHTML = `
    <th>TOTAL</th>
    <td id="total-consultas">0</td>
    <td id="total-beneficiarios">0</td>
    <td></td>
  `;
  tbody.appendChild(trTotal);

  // Función para actualizar totales
  function actualizarTotales() {
    let totalConsultas = 0;
    let totalBeneficiarios = 0;

    const filas = Array.from(tbody.querySelectorAll('tr')).slice(0, AREAS.length);
    filas.forEach(row => {
      const sector = parseInt(row.children[1].querySelector('input').value) || 0;
      const alumnos = parseInt(row.children[2].querySelector('input').value) || 0;
      totalConsultas += sector;
      totalBeneficiarios += alumnos;
    });

    document.getElementById('total-consultas').textContent = totalConsultas;
    document.getElementById('total-beneficiarios').textContent = totalBeneficiarios;
  }
  // Sidebar toggle
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggleSidebar');

toggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('collapsed');
  toggleBtn.textContent = sidebar.classList.contains('collapsed') ? '⯈' : '⯇';
});


  // Aplicar eventos a todos los inputs
  function aplicarEventosInputs() {
    const allInputs = Array.from(document.querySelectorAll('.editable, .editable-text'));
    allInputs.forEach((input, index) => {
      input.addEventListener('input', actualizarTotales);

      input.addEventListener('keydown', (e) => {
        const colCount = 4;
        const currentIndex = allInputs.indexOf(e.target);

        if (e.key === 'ArrowDown') {
          const next = currentIndex + colCount;
          if (next < allInputs.length) allInputs[next].focus();
        } else if (e.key === 'ArrowUp') {
          const prev = currentIndex - colCount;
          if (prev >= 0) allInputs[prev].focus();
        } else if (e.key === 'ArrowRight') {
          const next = currentIndex + 1;
          if (next < allInputs.length) allInputs[next].focus();
        } else if (e.key === 'ArrowLeft') {
          const prev = currentIndex - 1;
          if (prev >= 0) allInputs[prev].focus();
        }
      });
    });
  }

  aplicarEventosInputs();

  // Mostrar periodo
  const periodoTexto = document.getElementById('periodoTexto');
  const ciclo = localStorage.getItem('cicloEscolarSeleccionado');
  if (ciclo) {
    const [anioInicio, anioFin] = ciclo.split('-');
    const periodo = `Periodo: Septiembre ${anioInicio.slice(-4)} - Febrero ${anioFin.slice(-4)}`;
    periodoTexto.textContent = periodo;
  } else {
    periodoTexto.textContent = 'Periodo: Septiembre XXXX - Febrero XXXX';
  }

  // Exportar a Excel
  window.exportToExcel = function () {
    const table = document.getElementById("tabla");
    const wb = XLSX.utils.table_to_book(table, { sheet: "Estadísticas" });
    XLSX.writeFile(wb, "Estadisticas_por_area.xlsx");
  };

  // Exportar a PDF
  window.exportToPDF = function () {
    const tabla = document.getElementById("tabla");
    const opt = {
      margin: 0.5,
      filename: "Estadisticas_por_area.pdf",
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
    };
    html2pdf().set(opt).from(tabla).save();
  };

  // Eventos para los botones
  document.getElementById('btnGuardarExcel').addEventListener('click', exportToExcel);
  document.getElementById('btnGuardarPDF').addEventListener('click', exportToPDF);
});
