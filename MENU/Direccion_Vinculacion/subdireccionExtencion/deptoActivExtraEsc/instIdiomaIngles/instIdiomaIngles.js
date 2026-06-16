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

  // Construir encabezado principal
  const filaPrincipal = document.createElement('tr');

  const thPrograma = document.createElement('th');
  thPrograma.textContent = "PROGRAMA ACADÉMICO";
  thPrograma.rowSpan = 2;
  filaPrincipal.appendChild(thPrograma);

  const thIngles = document.createElement('th');
  thIngles.textContent = "INGLÉS";
  thIngles.colSpan = 2;
  filaPrincipal.appendChild(thIngles);

  const thConstancias = document.createElement('th');
  thConstancias.textContent = "TOTAL DE CONSTANCIAS DE ESTUDIANTES Y DOCENTES";
  thConstancias.rowSpan = 2;
  filaPrincipal.appendChild(thConstancias);

  const thCertificaciones = document.createElement('th');
  thCertificaciones.textContent = "CERTIFICACIONES";
  thCertificaciones.rowSpan = 2;
  filaPrincipal.appendChild(thCertificaciones);

  thead.appendChild(filaPrincipal);

  // Subencabezado para Inglés
  const filaSub = document.createElement('tr');
  ["MUJER", "HOMBRE"].forEach(sexo => {
    const th = document.createElement('th');
    th.textContent = sexo;
    filaSub.appendChild(th);
  });
  thead.appendChild(filaSub);

  // Generar filas por programa
  programas.forEach(programa => {
    const tr = document.createElement('tr');

    const tdPrograma = document.createElement('td');
    tdPrograma.textContent = programa;
    tdPrograma.classList.add('programa');
    tr.appendChild(tdPrograma);

    // Inglés Mujer y Hombre (2 celdas)
    for (let i = 0; i < 2; i++) {
      const td = document.createElement('td');
      td.contentEditable = "true";
      td.setAttribute('tabindex', '0');
      tr.appendChild(td);
    }

    // Total Constancias
    const tdConstancias = document.createElement('td');
    tdConstancias.contentEditable = "true";
    tdConstancias.setAttribute('tabindex', '0');
    tr.appendChild(tdConstancias);

    // Certificaciones
    const tdCertificaciones = document.createElement('td');
    tdCertificaciones.contentEditable = "true";
    tdCertificaciones.setAttribute('tabindex', '0');
    tr.appendChild(tdCertificaciones);

    tbody.appendChild(tr);
  });

  // --- Navegación por teclado (Tab, Shift+Tab y flechas) ---
  tbody.addEventListener('keydown', (e) => {
    const celdas = Array.from(tbody.querySelectorAll('td[contenteditable="true"]'));
    const index = celdas.indexOf(document.activeElement);
    if (index === -1) return; // No es una celda editable

    let nextIndex;

    switch (e.key) {
      case 'Tab':
        e.preventDefault();
        if (e.shiftKey) {
          nextIndex = (index - 1 + celdas.length) % celdas.length;
        } else {
          nextIndex = (index + 1) % celdas.length;
        }
        celdas[nextIndex].focus();
        break;

      case 'ArrowRight':
        e.preventDefault();
        // Mover a la derecha si no está en la última columna de la fila
        {
          const cell = document.activeElement;
          const currentRow = cell.parentElement;
          const cellsInRow = Array.from(currentRow.querySelectorAll('td[contenteditable="true"]'));
          const cellIndexInRow = cellsInRow.indexOf(cell);
          if (cellIndexInRow < cellsInRow.length - 1) {
            cellsInRow[cellIndexInRow + 1].focus();
          }
        }
        break;

      case 'ArrowLeft':
        e.preventDefault();
        {
          const cell = document.activeElement;
          const currentRow = cell.parentElement;
          const cellsInRow = Array.from(currentRow.querySelectorAll('td[contenteditable="true"]'));
          const cellIndexInRow = cellsInRow.indexOf(cell);
          if (cellIndexInRow > 0) {
            cellsInRow[cellIndexInRow - 1].focus();
          }
        }
        break;

      case 'ArrowDown':
        e.preventDefault();
        {
          const cell = document.activeElement;
          const currentRowIndex = Array.from(tbody.rows).indexOf(cell.parentElement);
          const cellIndexInRow = Array.from(cell.parentElement.querySelectorAll('td[contenteditable="true"]')).indexOf(cell);
          if (currentRowIndex < tbody.rows.length - 1) {
            const nextRow = tbody.rows[currentRowIndex + 1];
            const nextCells = Array.from(nextRow.querySelectorAll('td[contenteditable="true"]'));
            if (nextCells[cellIndexInRow]) nextCells[cellIndexInRow].focus();
          }
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        {
          const cell = document.activeElement;
          const currentRowIndex = Array.from(tbody.rows).indexOf(cell.parentElement);
          const cellIndexInRow = Array.from(cell.parentElement.querySelectorAll('td[contenteditable="true"]')).indexOf(cell);
          if (currentRowIndex > 0) {
            const prevRow = tbody.rows[currentRowIndex - 1];
            const prevCells = Array.from(prevRow.querySelectorAll('td[contenteditable="true"]'));
            if (prevCells[cellIndexInRow]) prevCells[cellIndexInRow].focus();
          }
        }
        break;

      default:
        break;
    }
  });

});
