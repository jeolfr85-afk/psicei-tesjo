document.addEventListener('DOMContentLoaded', () => {
  const programas = [
    "INGENIERÍA ELECTROMECÁNICA IEME-2010-210",
    "INGENIERÍA INDUSTRIAL IIND-2010-227",
    "INGENIERÍA INDUSTRIAL IIND-2010-227. EXTENSIÓN ACULCO",
    "INGENIERÍA EN SISTEMAS COMPUTACIONALES ISIC-2010-224",
    "INGENIERÍA EN SISTEMAS COMPUTACIONALES ISIC-2010-224. EXTENSIÓN ACULCO",
    "INGENIERÍA MECATRÓNICA IMCT-2010-229",
    "ARQUITECTURA ARQU-2010-204",
    "CONTADOR PÚBLICO COPU-2010-205",
    "CONTADOR PÚBLICO COPU-2010-205. EXTENSIÓN ACULCO",
    "INGENIERÍA EN GESTIÓN EMPRESARIAL IGEM-2009-201",
    "INGENIERÍA QUÍMICA IQUI-2010-232",
    "INGENIERÍA EN MATERIALES IMAT-2010-222",
    "INGENIERÍA EN ANIMACIÓN DIGITAL Y EFECTOS VISUALES IAEV-2012-238",
    "LICENCIATURA EN TURISMO LTUR-2012-237",
    "LICENCIATURA EN TURISMO LTUR-2012-237. EXTENSIÓN ACULCO",
    "INGENIERÍA EN LOGÍSTICA ILOG-2009-202"
  ];

  const thead = document.getElementById('thead');
  const tbody = document.getElementById('tbody');

  // Variables para manejo de datos originales (para cancelar cambios)
  let datosOriginales = [];

  // Crear encabezado
  thead.innerHTML = `
    <tr>
      <th rowspan="2">PROGRAMA ACADÉMICO</th>
      <th colspan="3">INGLÉS</th>
      <th colspan="1">TOTAL DE CONSTANCIAS</th>
      <th colspan="2">CERTIFICACIONES</th>
    </tr>
    <tr>
      <th>MUJER</th><th>HOMBRE</th><th>TOTAL</th>
      <th>TOTAL CONSTANCIAS</th>
      <th>ESTUDIANTES</th><th>DOCENTES</th>
    </tr>
  `;

  function crearFilas() {
    tbody.innerHTML = ''; // Limpiar tbody

    programas.forEach(nombre => {
      const tr = document.createElement('tr');
      const grupo = nombre.includes("EXTENSIÓN ACULCO") ? "ACULCO" : "JOCOTITLAN";
      tr.setAttribute("data-grupo", grupo);

      tr.innerHTML = `<td>${nombre}</td>
        <td contenteditable="true" class="editable"></td>
        <td contenteditable="true" class="editable"></td>
        <td class="total-ingles">0</td>
        <td class="total-constancias">0</td>
        <td contenteditable="true" class="editable"></td>
        <td contenteditable="true" class="editable"></td>`;
      tbody.appendChild(tr);
    });

    // Subtotales por grupo
    ["TES JOCOTITLÁN", "EXTENSIÓN ACULCO"].forEach(grupo => {
      const tr = document.createElement("tr");
      tr.classList.add("subtotal");
      tr.setAttribute("data-total", grupo.includes("ACULCO") ? "ACULCO" : "JOCOTITLAN");
      tr.innerHTML = `<td style="font-weight:bold">${grupo}</td>
        <td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td>`;
      tbody.appendChild(tr);
    });

    // Total general
    const trTotal = document.createElement("tr");
    trTotal.classList.add("total-final");
    trTotal.innerHTML = `<td style="font-weight:bold">TOTAL</td>
      <td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td>`;
    tbody.appendChild(trTotal);
  }

  // Recalcular sumas
  function recalcular() {
    const totales = {
      JOCOTITLAN: [0, 0, 0, 0, 0, 0],
      ACULCO: [0, 0, 0, 0, 0, 0]
    };

    const filas = tbody.querySelectorAll('tr[data-grupo]');
    filas.forEach(fila => {
      const grupo = fila.dataset.grupo;
      const celdas = fila.querySelectorAll('td');
      const mujer = parseInt(celdas[1].textContent) || 0;
      const hombre = parseInt(celdas[2].textContent) || 0;
      const estudiantes = parseInt(celdas[5].textContent) || 0;
      const docentes = parseInt(celdas[6].textContent) || 0;

      const totalIngles = mujer + hombre;
      const totalConstancias = estudiantes + docentes;

      celdas[3].textContent = totalIngles;
      celdas[4].textContent = totalConstancias;

      const arr = [mujer, hombre, totalIngles, totalConstancias, estudiantes, docentes];
      arr.forEach((num, i) => totales[grupo][i] += num);
    });

    // Actualizar subtotales
    ["JOCOTITLAN", "ACULCO"].forEach(grupo => {
      const fila = tbody.querySelector(`tr[data-total="${grupo}"]`);
      if (fila) {
        const tds = fila.querySelectorAll('td');
        totales[grupo].forEach((val, i) => {
          tds[i + 1].textContent = val;
        });
      }
    });

    // Total general
    const totalFinal = tbody.querySelector('.total-final');
    const totalTDs = totalFinal.querySelectorAll('td');
    for (let i = 0; i < 6; i++) {
      const suma = totales.JOCOTITLAN[i] + totales.ACULCO[i];
      totalTDs[i + 1].textContent = suma;
    }
  }

  // Solo números válidos
  tbody.addEventListener('input', e => {
    if (e.target.classList.contains('editable')) {
      e.target.textContent = e.target.textContent.replace(/\D/g, '');
      recalcular();
    }
  });

  // Navegación con teclado (opcional)
  tbody.addEventListener('keydown', e => {
    if (!e.target.classList.contains('editable')) return;
    const editable = [...tbody.querySelectorAll('.editable')];
    const index = editable.indexOf(e.target);
    if (e.key === 'ArrowRight' && editable[index + 1]) {
      e.preventDefault();
      editable[index + 1].focus();
    } else if (e.key === 'ArrowLeft' && editable[index - 1]) {
      e.preventDefault();
      editable[index - 1].focus();
    }
  });

  // Guardar estado actual para cancelar
  function guardarDatosOriginales() {
    datosOriginales = [];
    tbody.querySelectorAll('tr[data-grupo]').forEach(fila => {
      const celdas = fila.querySelectorAll('td');
      datosOriginales.push({
        programa: celdas[0].textContent,
        mujer: celdas[1].textContent,
        hombre: celdas[2].textContent,
        totalIngles: celdas[3].textContent,
        totalConstancias: celdas[4].textContent,
        estudiantes: celdas[5].textContent,
        docentes: celdas[6].textContent,
      });
    });
  }

  // Restaurar datos originales
  function restaurarDatosOriginales() {
    const filas = tbody.querySelectorAll('tr[data-grupo]');
    filas.forEach((fila, i) => {
      const d = datosOriginales[i];
      if (!d) return;
      const celdas = fila.querySelectorAll('td');
      celdas[1].textContent = d.mujer;
      celdas[2].textContent = d.hombre;
      celdas[3].textContent = d.totalIngles;
      celdas[4].textContent = d.totalConstancias;
      celdas[5].textContent = d.estudiantes;
      celdas[6].textContent = d.docentes;
    });
    recalcular();
  }

  // Botones (asume que existen en tu HTML con estos ids)
  const btnGuardar = document.getElementById('btnGuardar');
  const btnCancelar = document.getElementById('btnCancelar');
  const btnExportExcel = document.getElementById('btnExportExcel');
  const btnExportPDF = document.getElementById('btnExportPDF');

  // Evento guardar cambios
  btnGuardar.addEventListener('click', () => {
    if (confirm("¿Deseas guardar los cambios?")) {
      guardarDatosOriginales();
      alert("Cambios guardados.");
    }
  });

  // Evento cancelar cambios
  btnCancelar.addEventListener('click', () => {
    if (confirm("¿Deseas cancelar los cambios y restaurar los datos?")) {
      restaurarDatosOriginales();
    }
  });

  // Exportar a Excel usando SheetJS
  btnExportExcel.addEventListener('click', () => {
    // Crear workbook y worksheet
    const wb = XLSX.utils.book_new();

    // Crear array de arrays para exportar
    const data = [];

    // Agregar encabezados
    const headers1 = [
      "PROGRAMA ACADÉMICO",
      "INGLÉS MUJER",
      "INGLÉS HOMBRE",
      "INGLÉS TOTAL",
      "TOTAL DE CONSTANCIAS",
      "CERTIFICACIONES ESTUDIANTES",
      "CERTIFICACIONES DOCENTES"
    ];
    data.push(headers1);

    // Agregar filas de datos (incluye subtotal y total)
    tbody.querySelectorAll('tr').forEach(tr => {
      const tds = tr.querySelectorAll('td');
      const row = [];
      tds.forEach(td => row.push(td.textContent.trim()));
      data.push(row);
    });

    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, "Datos");

    XLSX.writeFile(wb, "datos_programas_academicos.xlsx");
  });

  // Exportar a PDF usando jsPDF y autotable
  btnExportPDF.addEventListener('click', () => {
    const doc = new jsPDF();

    // Título
    doc.setFontSize(14);
    doc.text("Datos Programas Académicos", 14, 15);

    // Construir columnas y filas para autotable
    const columns = [
      { header: "Programa Académico", dataKey: "programa" },
      { header: "Inglés Mujer", dataKey: "mujer" },
      { header: "Inglés Hombre", dataKey: "hombre" },
      { header: "Inglés Total", dataKey: "inglesTotal" },
      { header: "Total Constancias", dataKey: "totalConstancias" },
      { header: "Certificaciones Estudiantes", dataKey: "certEstudiantes" },
      { header: "Certificaciones Docentes", dataKey: "certDocentes" },
    ];

    const rows = [];
    tbody.querySelectorAll('tr').forEach(tr => {
      const tds = tr.querySelectorAll('td');
      const row = {
        programa: tds[0]?.textContent.trim() || '',
        mujer: tds[1]?.textContent.trim() || '',
        hombre: tds[2]?.textContent.trim() || '',
        inglesTotal: tds[3]?.textContent.trim() || '',
        totalConstancias: tds[4]?.textContent.trim() || '',
        certEstudiantes: tds[5]?.textContent.trim() || '',
        certDocentes: tds[6]?.textContent.trim() || '',
      };
      rows.push(row);
    });

    doc.autoTable({
      startY: 20,
      head: [columns.map(c => c.header)],
      body: rows.map(r => columns.map(c => r[c.dataKey])),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [52, 73, 94] },
      alternateRowStyles: { fillColor: [224, 224, 224] },
      margin: { top: 20 }
    });

    doc.save("Idioma Ingles.pdf");
  });

  // Inicial
  crearFilas();
  recalcular();
  guardarDatosOriginales();
});
