const talleresBase = [
  "BANDA DE GUERRA", "ESCOLTAS", "OTROS"
];
const talleres = [...talleresBase, "INSCRITOS TOTAL"];

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

const thead = document.getElementById("thead");
const tbody = document.getElementById("tbody");

// Encabezado principal
const filaPrincipal = document.createElement("tr");

const thPrograma = document.createElement("th");
thPrograma.classList.add("superior");
thPrograma.rowSpan = 2;
thPrograma.textContent = "PROGRAMA ACADÉMICO";
filaPrincipal.appendChild(thPrograma);

const thSexo = document.createElement("th");
thSexo.classList.add("superior");
thSexo.rowSpan = 2;
thSexo.textContent = "SEXO";
filaPrincipal.appendChild(thSexo);

talleres.forEach(taller => {
  const th = document.createElement("th");
  th.textContent = taller;
  th.classList.add("superior");
  th.colSpan = (taller === "INSCRITOS TOTAL") ? 3 : 2;
  filaPrincipal.appendChild(th);
});
thead.appendChild(filaPrincipal);

// Subencabezados
const filaSub = document.createElement("tr");
talleres.forEach(taller => {
  const subCols = (taller === "INSCRITOS TOTAL") ? ["Taller", "Selección", "Total"] : ["Taller", "Selección"];
  subCols.forEach(sub => {
    const th = document.createElement("th");
    th.textContent = sub;
    th.classList.add("subheader");
    filaSub.appendChild(th);
  });
});
thead.appendChild(filaSub);

// Crear filas por programa y sexo
programas.forEach(programa => {
  ["HOMBRE", "MUJER"].forEach((sexo, index) => {
    const tr = document.createElement("tr");

    if (index === 0) {
      const tdPrograma = document.createElement("td");
      tdPrograma.textContent = programa;
      tdPrograma.classList.add("programa", "fijo");
      tdPrograma.rowSpan = 2;
      tr.appendChild(tdPrograma);
    }

    const tdSexo = document.createElement("td");
    tdSexo.textContent = sexo;
    tdSexo.classList.add("sexo", "fijo2");
    tr.appendChild(tdSexo);

    talleres.forEach(taller => {
      const numCeldas = (taller === "INSCRITOS TOTAL") ? 3 : 2;
      for (let i = 0; i < numCeldas; i++) {
        const td = document.createElement("td");
        td.contentEditable = (taller !== "INSCRITOS TOTAL"); // Bloquear INSCRITOS TOTAL
        // Añadir tabindex para que las celdas sean enfocables
        if (taller !== "INSCRITOS TOTAL") {
          td.setAttribute('tabindex', '0');
        } else {
          // Si no es editable, podría ser -1 para que no sea enfocable por tab,
          // pero lo dejaremos como 0 para permitir la navegación con flechas
          // y simplemente el contentEditable evitará la edición.
          td.setAttribute('tabindex', '0');
        }
        tr.appendChild(td);
      }
    });

    tbody.appendChild(tr);
  });
});

// Mostrar periodo
const periodoTexto = document.getElementById('periodoTexto');
const ciclo = localStorage.getItem('cicloEscolarSeleccionado');
if (ciclo) {
  const [anioInicio, anioFin] = ciclo.split('-');
  const periodo = `Periodo: Febrero${anioInicio.slice(-4)}-Agosto${anioFin.slice(-4)}`;
  periodoTexto.textContent = periodo;
} else {
  periodoTexto.textContent = 'Periodo: FebXXXX-FebXXXX';
}

// Sidebar toggle
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggleSidebar');

toggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('collapsed');
  toggleBtn.textContent = sidebar.classList.contains('collapsed') ? '⯈' : '⯇';
});

// ===== RESUMENES =====
const resumenProgramas = [
  { nombre: "TES JOCOTITLÁN", filtro: prog => !prog.includes("EXTENSIÓN") },
  { nombre: "EXTENSIÓN ACULCO", filtro: prog => prog.includes("EXTENSIÓN") },
  { nombre: "GRAN TOTAL", filtro: () => true }
];

function crearFilaResumen(nombre) {
  const tr = document.createElement("tr");
  const tdNombre = document.createElement("td");
  tdNombre.textContent = nombre;
  tdNombre.rowSpan = 2;
  tdNombre.classList.add("programa", "resumen");
  tr.appendChild(tdNombre);

  const tdSexoH = document.createElement("td");
  tdSexoH.textContent = "HOMBRE";
  tdSexoH.classList.add("sexo", "resumen");
  tr.appendChild(tdSexoH);

  talleres.forEach(taller => {
    const cols = (taller === "INSCRITOS TOTAL") ? 3 : 2;
    for (let i = 0; i < cols; i++) {
      const td = document.createElement("td");
      td.classList.add("resumen-celda");
      td.dataset.grupo = nombre;
      td.dataset.sexo = "HOMBRE";
      td.dataset.taller = taller.trim();
      td.dataset.col = i;
      td.textContent = "0";
      // Las celdas de resumen no serán enfocables por teclado para edición directa.
      // Se actualizarán programáticamente.
      // td.setAttribute('tabindex', '-1');
      tr.appendChild(td);
    }
  });

  tbody.appendChild(tr);

  const trMujer = document.createElement("tr");
  const tdSexoM = document.createElement("td");
  tdSexoM.textContent = "MUJER";
  tdSexoM.classList.add("sexo", "resumen");
  trMujer.appendChild(tdSexoM);

  talleres.forEach(taller => {
    const cols = (taller === "INSCRITOS TOTAL") ? 3 : 2;
    for (let i = 0; i < cols; i++) {
      const td = document.createElement("td");
      td.classList.add("resumen-celda");
      td.dataset.grupo = nombre;
      td.dataset.sexo = "MUJER";
      td.dataset.taller = taller.trim();
      td.dataset.col = i;
      td.textContent = "0";
      // td.setAttribute('tabindex', '-1');
      trMujer.appendChild(td);
    }
  });

  tbody.appendChild(trMujer);
}

resumenProgramas.forEach(({ nombre }) => crearFilaResumen(nombre));

// NUEVA FUNCIÓN: Suma de inscritos por carrera
function actualizarTotalesPorCarrera() {
  const filas = [...tbody.querySelectorAll("tr")].filter(tr => !tr.querySelector(".resumen-celda"));

  for (let i = 0; i < filas.length; i += 2) {
    const trH = filas[i];
    const trM = filas[i + 1];

    [trH, trM].forEach((fila) => {
      const tds = [...fila.children];
      // El offset dependerá de si la fila tiene la celda de programa (solo la primera de cada par)
      const offset = fila === trH ? 2 : 1;
      let col = offset;

      let sumTaller = 0;
      let sumSeleccion = 0;

      talleres.forEach(taller => {
        if (taller !== "INSCRITOS TOTAL") {
          const valTaller = parseInt(tds[col]?.textContent) || 0;
          const valSeleccion = parseInt(tds[col + 1]?.textContent) || 0;
          sumTaller += valTaller;
          sumSeleccion += valSeleccion;
          col += 2;
        }
      });

      // Asegurarse de que exista la celda antes de intentar asignar el contenido
      if (tds[col]) {
        tds[col].textContent = sumTaller;
        tds[col + 1].textContent = sumSeleccion;
        tds[col + 2].textContent = sumTaller + sumSeleccion;
      }
    });
  }
}

// SUMA para RESÚMENES
function actualizarTotales() {
  const datos = {};
  const filas = [...tbody.querySelectorAll("tr")].filter(tr => !tr.querySelector(".resumen-celda"));

  for (let i = 0; i < filas.length; i += 2) {
    const trH = filas[i];
    const trM = filas[i + 1];
    const programa = trH.children[0].textContent.trim();
    const grupo = programa.includes("EXTENSIÓN") ? "EXTENSIÓN ACULCO" : "TES JOCOTITLÁN";

    [trH, trM].forEach((fila, index) => {
      const sexo = index === 0 ? "HOMBRE" : "MUJER";
      // Ajustar el slice para obtener solo las celdas de datos, excluyendo "PROGRAMA ACADÉMICO" y "SEXO"
      const tds = [...fila.children].slice(fila === trH ? 2 : 1);
      let colIndexWithinTds = 0; // Índice dentro del array 'tds'

      talleres.forEach(taller => {
        const cols = (taller === "INSCRITOS TOTAL") ? 3 : 2;
        for (let i = 0; i < cols; i++) {
          const claveGrupo = `${grupo}_${sexo}_${taller.trim()}_${i}`;
          const claveTotal = `GRAN TOTAL_${sexo}_${taller.trim()}_${i}`;
          const valor = parseInt(tds[colIndexWithinTds]?.textContent) || 0;
          datos[claveGrupo] = (datos[claveGrupo] || 0) + valor;
          datos[claveTotal] = (datos[claveTotal] || 0) + valor;
          colIndexWithinTds++;
        }
      });
    });
  }

  document.querySelectorAll(".resumen-celda").forEach(td => {
    const clave = `${td.dataset.grupo}_${td.dataset.sexo}_${td.dataset.taller}_${td.dataset.col}`;
    td.textContent = datos[clave] || "0";
  });
}

// EVENTO para recalcular totales en vivo
tbody.addEventListener("input", e => {
  if (e.target.tagName === "TD" && !e.target.classList.contains("resumen-celda")) {
    actualizarTotalesPorCarrera();
    actualizarTotales();
  }
});

// --- Nueva funcionalidad para navegación con flechas ---
let currentCell = null;

// Función para obtener todas las celdas editables y con tabindex
function getNavigableCells() {
  // Excluir celdas fijas (programa, sexo) y celdas de resumen
  return [...tbody.querySelectorAll("td[tabindex='0']")].filter(td =>
    !td.classList.contains("programa") &&
    !td.classList.contains("sexo") &&
    !td.classList.contains("resumen-celda")
  );
}

// Función para enfocar una celda
function focusCell(cell) {
  if (cell) {
    if (currentCell) {
      currentCell.classList.remove('focused-cell');
    }
    cell.focus();
    currentCell = cell;
    currentCell.classList.add('focused-cell');
    // Si la celda es editable, pon el cursor al final del texto.
    if (cell.contentEditable === "true") {
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(cell);
      range.collapse(false); // Mueve el cursor al final
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }
}

// Evento click para enfocar la celda
tbody.addEventListener('click', (e) => {
  if (e.target.tagName === 'TD' && e.target.getAttribute('tabindex') === '0') {
    focusCell(e.target);
  }
});

// Evento keydown para navegar con flechas
tbody.addEventListener('keydown', (e) => {
  if (!currentCell) return;

  const navigableCells = getNavigableCells();
  const currentIndex = navigableCells.indexOf(currentCell);
  let nextCell = null;

  const currentTR = currentCell.closest('tr');
  const allTRs = [...tbody.querySelectorAll('tr')].filter(tr => !tr.querySelector(".resumen-celda")); // Excluir filas de resumen
  const currentTRIndex = allTRs.indexOf(currentTR);

  // Determinar el offset para las celdas de datos dentro de una fila
  // Las filas impares (0, 2, 4...) tienen la columna de "PROGRAMA ACADÉMICO" y "SEXO".
  // Las filas pares (1, 3, 5...) tienen solo la columna de "SEXO".
  const rowOffset = currentTR.children[0].classList.contains("programa") ? 2 : 1;
  const currentCellIndexInRow = [...currentTR.children].indexOf(currentCell);

  switch (e.key) {
    case 'ArrowUp':
      e.preventDefault(); // Prevenir el desplazamiento de la página
      if (currentTRIndex > 0) {
        const prevTR = allTRs[currentTRIndex - 1];
        // Calcular el índice de la celda en la fila previa
        const prevRowOffset = prevTR.children[0].classList.contains("programa") ? 2 : 1;
        const targetIndex = currentCellIndexInRow - rowOffset + prevRowOffset;
        nextCell = prevTR.children[targetIndex];
        // Asegurarse de que la celda de destino sea enfocable
        if (nextCell && nextCell.getAttribute('tabindex') === '0') {
          focusCell(nextCell);
        } else {
          // Si la celda objetivo no es enfocable, buscar la siguiente enfocable en esa dirección
          let tempIndex = targetIndex;
          while (tempIndex >= prevRowOffset && !nextCell || (nextCell && nextCell.getAttribute('tabindex') !== '0')) {
            nextCell = prevTR.children[tempIndex];
            if (nextCell && nextCell.getAttribute('tabindex') === '0') {
              focusCell(nextCell);
              break;
            }
            tempIndex--;
          }
        }
      }
      break;

    case 'ArrowDown':
      e.preventDefault(); // Prevenir el desplazamiento de la página
      if (currentTRIndex < allTRs.length - 1) {
        const nextTR = allTRs[currentTRIndex + 1];
        const nextRowOffset = nextTR.children[0].classList.contains("programa") ? 2 : 1;
        const targetIndex = currentCellIndexInRow - rowOffset + nextRowOffset;
        nextCell = nextTR.children[targetIndex];

        if (nextCell && nextCell.getAttribute('tabindex') === '0') {
          focusCell(nextCell);
        } else {
          let tempIndex = targetIndex;
          while (tempIndex < nextTR.children.length && !nextCell || (nextCell && nextCell.getAttribute('tabindex') !== '0')) {
            nextCell = nextTR.children[tempIndex];
            if (nextCell && nextCell.getAttribute('tabindex') === '0') {
              focusCell(nextCell);
              break;
            }
            tempIndex++;
          }
        }
      }
      break;

    case 'ArrowLeft':
      e.preventDefault(); // Prevenir el desplazamiento de la página
      if (currentIndex > 0) {
        nextCell = navigableCells[currentIndex - 1];
        focusCell(nextCell);
      }
      break;

    case 'ArrowRight':
      e.preventDefault(); // Prevenir el desplazamiento de la página
      if (currentIndex < navigableCells.length - 1) {
        nextCell = navigableCells[currentIndex + 1];
        focusCell(nextCell);
      }
      break;

    case 'Enter':
      e.preventDefault(); // Prevenir el salto de línea en la celda
      // Podrías añadir lógica aquí para mover a la siguiente celda o salir de la edición
      // Por ejemplo, mover a la celda de abajo
      if (currentTRIndex < allTRs.length - 1) {
        const nextTR = allTRs[currentTRIndex + 1];
        const nextRowOffset = nextTR.children[0].classList.contains("programa") ? 2 : 1;
        const targetIndex = currentCellIndexInRow - rowOffset + nextRowOffset;
        nextCell = nextTR.children[targetIndex];
        if (nextCell && nextCell.getAttribute('tabindex') === '0') {
          focusCell(nextCell);
        }
      }
      break;

    case 'Tab':
      // Permitir la navegación normal con Tab, pero gestionar el foco
      e.preventDefault();
      const nextIndex = e.shiftKey ? currentIndex - 1 : currentIndex + 1;
      if (nextIndex >= 0 && nextIndex < navigableCells.length) {
        focusCell(navigableCells[nextIndex]);
      }
      break;
  }
});

// Manejar el blur para remover el estilo de enfoque
tbody.addEventListener('focusout', (e) => {
  if (currentCell && e.target === currentCell) {
    currentCell.classList.remove('focused-cell');
    // currentCell = null; // Puedes decidir si resetear la celda enfocada o mantenerla
  }
});


// Inicialización
actualizarTotalesPorCarrera();
actualizarTotales();

// Enfocar la primera celda editable al cargar la página (opcional)
document.addEventListener('DOMContentLoaded', () => {
  const firstEditableCell = tbody.querySelector('td[tabindex="0"]');
  if (firstEditableCell) {
    focusCell(firstEditableCell);
  }
});