// =================== VARIABLES GLOBALES ===================
const columnasBase = [
    "NÚMERO DE REGISTROS", "NOMBRE"
];

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
    "LICENCIATURA EN TURISMO LTUR-2012-237. EXTENSIÓN ACULCO"
];

// =================== REFERENCIAS DOM ===================
const thead = document.getElementById("thead");
const tbody = document.getElementById("tbody");
const periodoTexto = document.getElementById("periodoTexto");

// =================== TABLA ===================
function construirEncabezado() {
    const fila = document.createElement("tr");

    const thPrograma = document.createElement("th");
    thPrograma.textContent = "PROGRAMA ACADÉMICO";
    fila.appendChild(thPrograma);

    columnasBase.forEach(col => {
        const th = document.createElement("th");
        th.textContent = col;
        fila.appendChild(th);
    });

    thead.appendChild(fila);
}

function construirCuerpo() {
    programas.forEach(programa => {
        const tr = document.createElement("tr");

        const tdPrograma = document.createElement("td");
        tdPrograma.textContent = programa;
        tr.appendChild(tdPrograma);

        columnasBase.forEach(() => {
            const td = document.createElement("td");
            td.contentEditable = "true";
            td.setAttribute("tabindex", "0");
            td.classList.add("editable-cell");
            td.addEventListener("input", actualizarTotales); // recalcular al escribir
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });

    // Fila de totales
    const trTotal = document.createElement("tr");
    trTotal.id = "filaTotal";

    const tdLabel = document.createElement("td");
    tdLabel.textContent = "TOTAL";
    trTotal.appendChild(tdLabel);

    columnasBase.forEach(() => {
        const td = document.createElement("td");
        td.textContent = "0";
        td.classList.add("celda-total");
        trTotal.appendChild(td);
    });

    tbody.appendChild(trTotal);
}

// =================== CALCULAR TOTALES ===================
function actualizarTotales() {
    const filas = [...tbody.querySelectorAll("tr")];
    const filaTotal = document.getElementById("filaTotal");
    const totales = new Array(columnasBase.length).fill(0);

    // recorrer filas excepto la de totales
    filas.forEach((fila, idx) => {
        if (fila.id === "filaTotal") return;

        const celdas = fila.querySelectorAll("td");
        columnasBase.forEach((_, colIdx) => {
            const valor = parseFloat(celdas[colIdx + 1].textContent.trim());
            if (!isNaN(valor)) {
                totales[colIdx] += valor;
            }
        });
    });

    // actualizar fila de totales
    const celdasTotales = filaTotal.querySelectorAll("td");
    totales.forEach((suma, i) => {
        celdasTotales[i + 1].textContent = suma;
    });
}

// =================== PERIODO ===================
function mostrarPeriodo() {
    const ciclo = localStorage.getItem("cicloEscolarSeleccionado");
    if (ciclo) {
        periodoTexto.textContent = `Periodo: ${ciclo}`;
    } else {
        periodoTexto.textContent = "Periodo: SEPTIEMBRE 2022 - FEBRERO 2023";
    }
}

// =================== FUNCIONES DE DATOS ===================
function obtenerDatosTabla() {
    const filas = [...tbody.querySelectorAll("tr")];
    const datos = [];

    filas.forEach((fila) => {
        if (fila.id === "filaTotal") return; // omitir fila total
        const celdas = fila.querySelectorAll("td");
        const programa = celdas[0].textContent.trim();

        columnasBase.forEach((col, idx) => {
            datos.push({
                programa,
                columna: col,
                valor: celdas[idx + 1].textContent.trim()
            });
        });
    });

    return datos;
}

// =================== SIDEBAR ===================
function inicializarSidebar() {
    const sidebar = document.getElementById("sidebar");
    const toggleBtn = document.getElementById("toggleSidebar");

    toggleBtn.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");
        toggleBtn.textContent = sidebar.classList.contains("collapsed") ? "⯈" : "⯇";
    });
}

// =================== EVENTOS ===================
document.addEventListener("DOMContentLoaded", () => {
    construirEncabezado();
    construirCuerpo();
    mostrarPeriodo();
    inicializarSidebar();

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
  // Sidebar toggle
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('toggleSidebar');
  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    toggleBtn.textContent = sidebar.classList.contains('collapsed') ? '⯈' : '⯇';
  });