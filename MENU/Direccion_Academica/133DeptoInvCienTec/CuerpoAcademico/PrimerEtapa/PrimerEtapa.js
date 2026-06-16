document.addEventListener('DOMContentLoaded', () => {
  // --- Encabezados de la tabla principal ---
  const encabezados = [
    "Nombre Completo",
    "Sexo",
    "Modalidad",
    "Programa Académico",
    "Categoría",
    "País",
    "Institución",
    "Tipo de participación"
  ];

  const tabla = document.getElementById('tablaTalleres');
  const thead = document.getElementById('thead');
  const tbody = document.getElementById('tbody');

  // --- Crear encabezados ---
  function crearEncabezados() {
    const fila = document.createElement('tr');
    encabezados.forEach(texto => {
      const th = document.createElement('th');
      th.textContent = texto;
      fila.appendChild(th);
    });
    thead.appendChild(fila);
  }
  crearEncabezados();

  // --- Crear fila ---
  function agregarFila() {
    const fila = tbody.insertRow();
    encabezados.forEach(enc => {
      const celda = fila.insertCell();

      if (enc === "Sexo") {
        const select = document.createElement('select');
        select.innerHTML = `
          <option value=""></option>
          <option value="Hombre">Hombre</option>
          <option value="Mujer">Mujer</option>`;
        select.className = "editable-select";
        select.addEventListener('change', actualizarTotales);
        celda.appendChild(select);
      }
      else if (enc === "Modalidad") {
        const select = document.createElement('select');
        select.innerHTML = `
          <option value=""></option>
          <option value="Presencial">Presencial</option>
          <option value="Virtual">Virtual</option>`;
        select.className = "editable-select";
        select.addEventListener('change', actualizarTotales);
        celda.appendChild(select);
      }
      else {
        const input = document.createElement('input');
        input.type = "text";
        input.className = "editable-text";
        input.addEventListener('input', actualizarTotales);
        celda.appendChild(input);
      }
    });
    aplicarEventosInputs();
  }

  // --- Inicializar con 3 filas ---
  for (let i = 0; i < 3; i++) agregarFila();
  document.getElementById('btnAgregarFila').addEventListener('click', agregarFila);

  // --- Función para actualizar totales ---
  function actualizarTotales() {
    let resumenSexo = { Hombre: 0, Mujer: 0 };
    let resumenModalidad = { Presencial: { hombres: 0, mujeres: 0 }, Virtual: { hombres: 0, mujeres: 0 } };
    let resumenLugar = { Nacional: { hombres: 0, mujeres: 0 }, Internacional: { hombres: 0, mujeres: 0 } };
    let resumenInstitucion = { Nacional: { hombres: 0, mujeres: 0 }, Internacional: { hombres: 0, mujeres: 0 } };

    Array.from(tbody.rows).forEach(fila => {
      const nombre = fila.cells[0].firstChild?.value || "";
      const sexo = fila.cells[1].firstChild?.value || "";
      const modalidad = fila.cells[2].firstChild?.value || "";
      const pais = (fila.cells[5].firstChild?.value || "").toLowerCase();

      if (sexo === "Hombre") resumenSexo.Hombre++;
      if (sexo === "Mujer") resumenSexo.Mujer++;

      if (modalidad && sexo) {
        if (sexo === "Hombre") resumenModalidad[modalidad].hombres++;
        if (sexo === "Mujer") resumenModalidad[modalidad].mujeres++;
      }

      if (sexo) {
        if (pais && pais !== "méxico" && pais !== "mexico") {
          if (sexo === "Hombre") {
            resumenLugar.Internacional.hombres++;
            resumenInstitucion.Internacional.hombres++;
          }
          if (sexo === "Mujer") {
            resumenLugar.Internacional.mujeres++;
            resumenInstitucion.Internacional.mujeres++;
          }
        } else {
          if (sexo === "Hombre") {
            resumenLugar.Nacional.hombres++;
            resumenInstitucion.Nacional.hombres++;
          }
          if (sexo === "Mujer") {
            resumenLugar.Nacional.mujeres++;
            resumenInstitucion.Nacional.mujeres++;
          }
        }
      }
    });

    // --- Tabla Modalidad ---
    const tbodyModalidad = document.querySelector('#tablaModalidad tbody');
    Array.from(tbodyModalidad.rows).forEach(row => {
      const tipo = row.cells[0].textContent;
      if (tipo in resumenModalidad) {
        row.cells[1].textContent = resumenModalidad[tipo].hombres;
        row.cells[2].textContent = resumenModalidad[tipo].mujeres;
        row.cells[3].textContent = resumenModalidad[tipo].hombres + resumenModalidad[tipo].mujeres;
      }
    });

    // --- Tabla Institución ---
    const tbodyInstitucion = document.querySelector('#tablaInstitucion tbody');
    Array.from(tbodyInstitucion.rows).forEach(row => {
      const tipo = row.cells[0].textContent;
      if (tipo in resumenInstitucion) {
        row.cells[1].textContent = resumenInstitucion[tipo].hombres;
        row.cells[2].textContent = resumenInstitucion[tipo].mujeres;
        row.cells[3].textContent = resumenInstitucion[tipo].hombres + resumenInstitucion[tipo].mujeres;
      }
    });

    // --- Tabla Lugar ---
    const tbodyLugar = document.querySelector('#tablaLugar tbody');
    Array.from(tbodyLugar.rows).forEach(row => {
      const tipo = row.cells[0].textContent;
      if (tipo in resumenLugar) {
        row.cells[1].textContent = resumenLugar[tipo].hombres;
        row.cells[2].textContent = resumenLugar[tipo].mujeres;
        row.cells[3].textContent = resumenLugar[tipo].hombres + resumenLugar[tipo].mujeres;
      }
    });

    // --- Detalle ---
    const tbodyDetalle = document.querySelector('#tablaDetalle tbody');
    tbodyDetalle.innerHTML = "";
    const totalNac = resumenLugar.Nacional.hombres + resumenLugar.Nacional.mujeres;
    const totalInt = resumenLugar.Internacional.hombres + resumenLugar.Internacional.mujeres;
    const total = totalNac + totalInt;
    const filaDetalle = document.createElement('tr');
    filaDetalle.innerHTML = `
      <td>Nacional</td>
      <td>${totalNac}</td>
      <td>${total ? ((totalNac / total) * 100).toFixed(1) + "%" : "0%"}</td>
      <td>Internacional</td>
      <td>${totalInt}</td>
      <td>${total ? ((totalInt / total) * 100).toFixed(1) + "%" : "0%"}</td>
    `;
    tbodyDetalle.appendChild(filaDetalle);
  }

  // --- Navegación con teclado ---
  function aplicarEventosInputs() {
    const allInputs = Array.from(document.querySelectorAll('.editable-text, .editable-select'));
    const colCount = encabezados.length;
    allInputs.forEach((input, idx) => {
      input.addEventListener('keydown', (e) => {
        let nextIndex;
        if (e.key === 'ArrowDown') nextIndex = idx + colCount;
        else if (e.key === 'ArrowUp') nextIndex = idx - colCount;
        else if (e.key === 'ArrowRight') nextIndex = idx + 1;
        else if (e.key === 'ArrowLeft') nextIndex = idx - 1;
        if (nextIndex >= 0 && nextIndex < allInputs.length) allInputs[nextIndex].focus();
      });
    });
  }
  aplicarEventosInputs();

  // --- Exportar a Excel ---
  function exportToExcel() {
    const wb = XLSX.utils.table_to_book(tabla, { sheet: "Estadísticas" });
    XLSX.writeFile(wb, "Plantilla_Estudiantes.xlsx");
  }

  // --- Exportar a PDF ---
  function exportToPDF() {
    const opt = {
      margin: 0.5,
      filename: "Plantilla_Estudiantes.pdf",
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
    };
    html2pdf().set(opt).from(tabla).save();
  }

  // --- Botones ---
  document.getElementById('btnGuardarExcel').addEventListener('click', exportToExcel);
  document.getElementById('btnGuardarPDF').addEventListener('click', exportToPDF);

  // --- Inicializar ---
  actualizarTotales();
});

  // --- Mostrar periodo ---
  const periodoTexto = document.getElementById('periodoTexto');
  const ciclo = localStorage.getItem('cicloEscolarSeleccionado');
  if (ciclo) {
    const [anioInicio, anioFin] = ciclo.split('-');
    periodoTexto.textContent = `Periodo: Septiembre ${anioInicio.slice(-4)} - Febrero ${anioFin.slice(-4)}`;
  } else {
    periodoTexto.textContent = 'Periodo: Septiembre XXXX - Febrero XXXX';
  }

  // --- Sidebar toggle ---
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('toggleSidebar');
  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    toggleBtn.textContent = sidebar.classList.contains('collapsed') ? '⯈' : '⯇';
  });