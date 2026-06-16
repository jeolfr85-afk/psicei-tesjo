// =================== COLUMNAS Y VARIABLES ===================
const columnasBase = [
  "MARCA", "MODELO", "PLATAFORMA (LINUX, UNIX, MACINTOSH, WINDOWS)", 
  "ARQUITECTURA (32x, SPARC, RISC)", "PROCESADOR", 
  "CAPACIDAD MEMORIA", "CAPACIDAD DISCO DURO", "MONITOR", 
  "CAPACIDAD CACHE", 
  "TIPO SERVIDOR (WEB, DNS, APLICACIONES, IMPRESIÓN, ALMACENAMIENTO, FTP, PROXY, FIREWALL, BASE DE DATOS)",
  "TARJETA DE RED", "TARJETA DE SONIDO", 
  "TARJETA DE VIDEO", "CUENTA CON RATÓN", "CUENTA CON TECLADO"
];

const secciones = [
  "TES JOCOTITLÁN",
  "EXTENSIÓN ACULCO"
];

// =================== REFERENCIAS DOM ===================
const thead = document.getElementById("thead");
const tbody = document.getElementById("tbody");

// =================== CONSTRUCCIÓN DE TABLA ===================
function construirEncabezado() {
  const fila = document.createElement("tr");
  columnasBase.forEach(col => {
    const th = document.createElement("th");
    th.textContent = col;
    fila.appendChild(th);
  });
  thead.appendChild(fila);
}

function construirCuerpo() {
  secciones.forEach(seccion => {
    // Fila de sección
    const trTitulo = document.createElement("tr");
    trTitulo.classList.add("section-title");
    const tdTitulo = document.createElement("td");
    tdTitulo.textContent = seccion;
    tdTitulo.colSpan = columnasBase.length;
    trTitulo.appendChild(tdTitulo);
    tbody.appendChild(trTitulo);

    // Filas vacías iniciales (por ejemplo, 3 filas por sección)
    for (let i = 0; i < 3; i++) agregarFila(seccion, false);
  });
}

// =================== AGREGAR FILA ===================
function agregarFila(seccion, scroll = true) {
  const tr = document.createElement("tr");

  columnasBase.forEach(() => {
    const td = document.createElement("td");
    td.contentEditable = "true";
    td.classList.add("editable-cell");
    tr.appendChild(td);
  });

  // Inserta antes de la siguiente sección o al final
  const siguienteSeccion = [...tbody.querySelectorAll(".section-title")]
    .find(el => el.textContent.trim() === "EXTENSIÓN ACULCO");
  if (seccion === "TES JOCOTITLÁN" && siguienteSeccion) {
    tbody.insertBefore(tr, siguienteSeccion);
  } else {
    tbody.appendChild(tr);
  }

  if (scroll) tr.scrollIntoView({ behavior: "smooth", block: "center" });
  habilitarNavegacionTeclado();
}

// =================== NAVEGACIÓN CON TECLADO ===================
function habilitarNavegacionTeclado() {
  const celdas = [...document.querySelectorAll(".editable-cell")];
  const colCount = columnasBase.length;

  celdas.forEach((celda, index) => {
    celda.addEventListener("keydown", e => {
      let nextIndex = null;
      if (e.key === "ArrowDown") nextIndex = index + colCount;
      else if (e.key === "ArrowUp") nextIndex = index - colCount;
      else if (e.key === "ArrowRight") nextIndex = index + 1;
      else if (e.key === "ArrowLeft") nextIndex = index - 1;

      if (nextIndex !== null && celdas[nextIndex]) {
        e.preventDefault();
        celdas[nextIndex].focus();
      }
    });
  });
}

// =================== EXPORTAR A EXCEL ===================
function exportToExcel() {
  const table = document.getElementById("tablaTalleres");
  const wb = XLSX.utils.table_to_book(table, { sheet: "Listado Servidores" });
  XLSX.writeFile(wb, "Listado_Servidores.xlsx");
}

// =================== EXPORTAR A PDF ===================
function exportToPDF() {
  const tabla = document.getElementById("tablaTalleres");
  const opt = {
    margin: 0.5,
    filename: "Listado_Servidores.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "letter", orientation: "landscape" }
  };
  html2pdf().set(opt).from(tabla).save();
}

// =================== INICIALIZAR ===================
document.addEventListener("DOMContentLoaded", () => {
  construirEncabezado();
  construirCuerpo();
  habilitarNavegacionTeclado();

  // Mostrar periodo guardado
  const periodoTexto = document.getElementById("periodoTexto");
  const ciclo = localStorage.getItem("cicloEscolarSeleccionado");
  if (ciclo) {
    const [anioInicio, anioFin] = ciclo.split("-");
    periodoTexto.textContent = `Periodo: Septiembre ${anioInicio.slice(-4)} - Febrero ${anioFin.slice(-4)}`;
  } else {
    periodoTexto.textContent = "Periodo: Septiembre XXXX - Febrero XXXX";
  }

  // Sidebar toggle
  const sidebar = document.getElementById("sidebar");
  const toggleBtn = document.getElementById("toggleSidebar");
  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
    toggleBtn.textContent = sidebar.classList.contains("collapsed") ? "⯈" : "⯇";
  });

  // Botones
  document.getElementById("btnAgregarFila").addEventListener("click", () => agregarFila("EXTENSIÓN ACULCO"));
  document.getElementById("btnGuardarExcel").addEventListener("click", exportToExcel);
  document.getElementById("btnGuardarPDF").addEventListener("click", exportToPDF);
});
