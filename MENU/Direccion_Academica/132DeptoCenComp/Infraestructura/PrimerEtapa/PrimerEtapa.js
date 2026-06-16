// Datos base
const secciones = [
  { titulo: "TES JOCOTITLÁN", categorias: ["EQUIPO Y MOVILIDAD", "EN OPERACIÓN", "EN REPARACIÓN", "GUARDADAD O EN REVERSA", "TOTAL"] },
  { titulo: "EXTENSIÓN ACULCO", categorias: ["EQUIPO Y MOVILIDAD", "EN OPERACIÓN", "EN REPARACIÓN", "GUARDADAD O EN REVERSA", "TOTAL"] },
];

const subgrupos = ["Impresoras Braile","Pantallas de toque","Atriles","Telefonos para personas sordas","Computadoras con pantalla tactil", "Teclados Alternativos","Ratones (Mouse) Alternativos", "Magnificadores o pulas","Comunicadores", "Otros (Especificar)", "Total"];

// Generar tabla
function generarTabla() {
  const thead = document.getElementById("thead");
  const tbody = document.getElementById("tbody");

  // Cabecera
  const headerRow = document.createElement("tr");
  secciones.forEach(sec => {
    const th = document.createElement("th");
    th.colSpan = sec.categorias.length;
    th.textContent = sec.titulo;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  // Subcabecera
  const subHeaderRow = document.createElement("tr");
  secciones.forEach(sec => {
    sec.categorias.forEach(cat => {
      const th = document.createElement("th");
      th.textContent = cat;
      subHeaderRow.appendChild(th);
    });
  });
  thead.appendChild(subHeaderRow);

  // Filas base
  subgrupos.forEach(grupo => {
    const fila = document.createElement("tr");

    secciones.forEach(sec => {
      sec.categorias.forEach(() => {
        const td = document.createElement("td");
        td.contentEditable = true;
        fila.appendChild(td);
      });
    });

    const celdas = fila.querySelectorAll("td");
    celdas[0].textContent = grupo;
    celdas[secciones[0].categorias.length].textContent = grupo;

    tbody.appendChild(fila);
  });
}
  // Mostrar periodo guardado
  const periodoTexto = document.getElementById("periodoTexto");
  const ciclo = localStorage.getItem("cicloEscolarSeleccionado");
  if (ciclo) {
    const [anioInicio, anioFin] = ciclo.split("-");
    periodoTexto.textContent = `Periodo: Septiembre ${anioInicio.slice(-4)} - Febrero ${anioFin.slice(-4)}`;
  } else {
    periodoTexto.textContent = "Periodo: Septiembre XXXX - Febrero XXXX";
  }
document.addEventListener("DOMContentLoaded", generarTabla);
  // Sidebar toggle
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggleSidebar');

toggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('collapsed');
  toggleBtn.textContent = sidebar.classList.contains('collapsed') ? '⯈' : '⯇';
});
