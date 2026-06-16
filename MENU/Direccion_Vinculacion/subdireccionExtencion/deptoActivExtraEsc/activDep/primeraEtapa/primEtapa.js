// Variables globales con los talleres y programas
const talleresBase = [
  "DEPORTES", "BOX", "GIMNASIO", "TEAKWONDO", "TIRO CON ARCO", "ATLETISMO",
  "FUTBOL", "VOLEIBOL", "BASQUETBALL", "FUTBOL BARDAS", "TENIS DE MESA", "OTROS"
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

// Referencias a DOM
const thead = document.getElementById("thead");
const tbody = document.getElementById("tbody");
const periodoTexto = document.getElementById('periodoTexto');

// Construir encabezados de la tabla
function construirEncabezado() {
  const filaPrincipal = document.createElement("tr");

  const thPrograma = document.createElement("th");
  thPrograma.textContent = "PROGRAMA ACADÉMICO";
  thPrograma.rowSpan = 2;
  filaPrincipal.appendChild(thPrograma);

  const thSexo = document.createElement("th");
  thSexo.textContent = "SEXO";
  thSexo.rowSpan = 2;
  filaPrincipal.appendChild(thSexo);

  talleres.forEach(taller => {
    const th = document.createElement("th");
    th.textContent = taller;
    th.colSpan = (taller === "INSCRITOS TOTAL") ? 3 : 2;
    filaPrincipal.appendChild(th);
  });

  thead.appendChild(filaPrincipal);

  // Sub-encabezados
  const filaSub = document.createElement("tr");
  talleres.forEach(taller => {
    const cols = (taller === "INSCRITOS TOTAL") ? ["Taller", "Selección", "Total"] : ["Taller", "Selección"];
    cols.forEach(texto => {
      const th = document.createElement("th");
      th.textContent = texto;
      filaSub.appendChild(th);
    });
  });
  thead.appendChild(filaSub);
}

// Construir cuerpo con filas para cada programa y sexo
function construirCuerpo() {
  programas.forEach(programa => {
    ["HOMBRE", "MUJER"].forEach((sexo, idx) => {
      const tr = document.createElement("tr");

      if (idx === 0) {
        const tdPrograma = document.createElement("td");
        tdPrograma.textContent = programa;
        tdPrograma.rowSpan = 2;
        tr.appendChild(tdPrograma);
      }

      const tdSexo = document.createElement("td");
      tdSexo.textContent = sexo;
      tr.appendChild(tdSexo);

      talleres.forEach(taller => {
        const numCols = (taller === "INSCRITOS TOTAL") ? 3 : 2;
        for (let i = 0; i < numCols; i++) {
          const td = document.createElement("td");
          if (taller !== "INSCRITOS TOTAL") {
            td.contentEditable = "true"; // Editable
            td.setAttribute("tabindex", "0"); // Navegable
            td.classList.add("editable-cell");
          } else {
            td.textContent = "0"; // No editable, con cero
          }
          tr.appendChild(td);
        }
      });

      tbody.appendChild(tr);
    });
  });
}

// Mostrar periodo desde localStorage o un valor por defecto
function mostrarPeriodo() {
  const ciclo = localStorage.getItem('cicloEscolarSeleccionado');
  if (ciclo) {
    const [anioInicio, anioFin] = ciclo.split('-');
    periodoTexto.textContent = `Periodo: Febrero${anioInicio.slice(-2)}-Agosto${anioFin.slice(-2)}`;
  } else {
    periodoTexto.textContent = "Periodo: FebXX - FebXX";
  }
}

// Función para obtener datos de la tabla en formato JSON para enviar a PHP
function obtenerDatosTabla() {
  const filas = [...tbody.querySelectorAll("tr")];
  const datos = [];

  filas.forEach(fila => {
    const celdas = fila.querySelectorAll("td");
    let programa = "";
    let sexo = "";

    if (celdas.length > 0) {
      if (celdas[0].rowSpan === 2) {
        programa = celdas[0].textContent.trim();
        sexo = celdas[1].textContent.trim();
      } else {
        // Si la fila no tiene la columna programa (segunda fila del programa)
        sexo = celdas[0].textContent.trim();
      }
    }

    for (let i = (programa ? 2 : 1); i < celdas.length; i++) {
      datos.push({
        programa,
        sexo,
        columna: i,
        valor: celdas[i].textContent.trim()
      });
    }
  });

  return datos;
}

// Guardar datos con fetch a PHP
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

// Descargar PDF (usa jsPDF + autotable)
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

// Descargar Excel (usa SheetJS)
function descargarExcel() {
  const tabla = document.getElementById("tablaTalleres");
  const wb = XLSX.utils.table_to_book(tabla);
  XLSX.writeFile(wb, "estadisticas_actividades.xlsx");
}

// Cancelar recarga la página
function cancelar() {
  if(confirm("¿Seguro que desea cancelar? Se perderán los cambios no guardados.")){
    location.reload();
  }
}

// FUNCIONALIDAD PARA NAVEGAR CON TECLAS EN CELDAS EDITABLES
function manejarTeclas(event) {
  const tecla = event.key;
  const celda = event.target;

  if (!celda.classList.contains("editable-cell")) return;

  const celdas = Array.from(document.querySelectorAll(".editable-cell"));
  const index = celdas.indexOf(celda);
  let siguienteIndex;

  switch (tecla) {
    case "Tab":
      event.preventDefault();
      siguienteIndex = event.shiftKey ? index - 1 : index + 1;
      if (siguienteIndex >= celdas.length) siguienteIndex = 0;
      if (siguienteIndex < 0) siguienteIndex = celdas.length - 1;
      celdas[siguienteIndex].focus();
      break;

    case "ArrowRight":
      event.preventDefault();
      siguienteIndex = index + 1;
      if (siguienteIndex >= celdas.length) siguienteIndex = 0;
      celdas[siguienteIndex].focus();
      break;

    case "ArrowLeft":
      event.preventDefault();
      siguienteIndex = index - 1;
      if (siguienteIndex < 0) siguienteIndex = celdas.length - 1;
      celdas[siguienteIndex].focus();
      break;

    case "ArrowDown":
      event.preventDefault();
      {
        const currentRow = celda.parentElement;
        let rowIndex = Array.from(tbody.children).indexOf(currentRow);
        const colIndex = Array.from(currentRow.children).indexOf(celda);
        rowIndex++;
        if (rowIndex >= tbody.children.length) rowIndex = 0;
        const siguienteFila = tbody.children[rowIndex];
        const siguienteCelda = siguienteFila.children[colIndex];
        if (siguienteCelda && siguienteCelda.classList.contains("editable-cell")) {
          siguienteCelda.focus();
        }
      }
      break;

    case "ArrowUp":
      event.preventDefault();
      {
        const currentRow = celda.parentElement;
        let rowIndex = Array.from(tbody.children).indexOf(currentRow);
        const colIndex = Array.from(currentRow.children).indexOf(celda);
        rowIndex--;
        if (rowIndex < 0) rowIndex = tbody.children.length - 1;
        const siguienteFila = tbody.children[rowIndex];
        const siguienteCelda = siguienteFila.children[colIndex];
        if (siguienteCelda && siguienteCelda.classList.contains("editable-cell")) {
          siguienteCelda.focus();
        }
      }
      break;

    case "Enter":
      event.preventDefault();
      // Aquí podemos decidir si bajar fila o hacer tab
      siguienteIndex = index + 2; // ejemplo: saltar 2 celdas
      if (siguienteIndex >= celdas.length) siguienteIndex = 0;
      celdas[siguienteIndex].focus();
      break;
  }
}

// Eventos al cargar página
document.addEventListener("DOMContentLoaded", () => {
  construirEncabezado();
  construirCuerpo();
  mostrarPeriodo();

  // Botones
  document.getElementById("btnGuardarBD").addEventListener("click", guardarDatos);
  document.getElementById("btnGuardarPDF").addEventListener("click", descargarPDF);
  document.getElementById("btnGuardarExcel").addEventListener("click", descargarExcel);
  document.getElementById("btnCancelar").addEventListener("click", cancelar);

  // Navegación con teclado
  tbody.addEventListener("keydown", manejarTeclas);
});
