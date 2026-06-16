document.addEventListener('DOMContentLoaded', () => {
  const AREAS = ["", "", "", "", "", "", "", "", "", ""]; // 10 filas

  const thead = document.getElementById('thead');
  const tbody = document.getElementById('tbody');

  // Encabezados
  thead.innerHTML = `
    <tr>
      <th>NOMBRE DEL DOCENTE</th>
      <th>SEXO</th>
      <th>NIVEL DE ESTUDIOS (LICENCIATURA, ESPECIALIDAD, MAESTRÍA, DOCTORADO)</th>
      <th>ESCOLARIDAD GRADO ACADÉMICO</th>
      <th>ESPECIFICAR[LICENCIATURA (TITULADO O NO), ESPECIALIDAD (TERMINADA O EN PROCESO), MAESTRIA (CON GRADO O SIN GRADO) Y DOCTORADO (CON GRADO O SIN GRADO)]</th>
      <th>PROGRAMA ACADÉMICO</th>
      <th>TIEMPO DE DEDICACIÓN (TIEMPO COMPLETO, TRES CUARTOS DE TIEMPO, MEDIO TIEMPO, POR HORAS O ASIGNATURA)</th>
      <th>SISTEMAS DE INVESTIGACIÓN (INVESTIGADOR NACIONAL EMÉRITO, SNI NIVEL 3 NACIONAL, SNI NIVEL 2 NACIONAL, SNI NIVEL 1 NACIONAL, CANDIDATO SNI INVESTIGADOR NACIONAL INVESTIGADOR POR INSTITUCIÓN,  INVESTIGADOR POR EL SISTEMA ESTATAL, INVESTIGADOR VISITANTE ASOCIADOS O TEMPORALES)</th>
    </tr>
  `;

  // Crear filas con Select en la columna SEXO
  function crearFila() {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="text" class="editable-text" placeholder=""></td>
      <td>
        <select class="editable-select">
          <option value="">Selecciona</option>
          <option value="Femenino">Femenino</option>
          <option value="Masculino">Masculino</option>
        </select>
      </td>
      <td><input type="text" class="editable-text" placeholder=""></td>
      <td><input type="text" class="editable-text" placeholder=""></td>
      <td><input type="text" class="editable-text" placeholder=""></td>
      <td><input type="text" class="editable-text" placeholder=""></td>
      <td><input type="text" class="editable-text" placeholder=""></td>
      <td><input type="text" class="editable-text" placeholder=""></td>
    `;
    tbody.appendChild(tr);
  }

  AREAS.forEach(crearFila);

  // Sidebar toggle
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('toggleSidebar');
  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    toggleBtn.textContent = sidebar.classList.contains('collapsed') ? '⯈' : '⯇';
  });

  // Navegación con teclado
  function aplicarEventosInputs() {
    const allInputs = Array.from(document.querySelectorAll('.editable-text, .editable-select'));
    allInputs.forEach((input) => {
      input.addEventListener('keydown', (e) => {
        const colCount = 8; // número de columnas
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
