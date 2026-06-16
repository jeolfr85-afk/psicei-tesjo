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

// Encabezado
thead.innerHTML = `
  <tr>
    <th>PROGRAMA</th>
    <th>PROGRAMADAS</th>
    <th>EN TRÁMITE DE GESTIÓN</th>
    <th>CONFIRMADAS POR LA EMPRESA</th>
    <th>REALIZADAS</th>
    <th>NOMBRE DE LA EMPRESA</th>
    <th>NOMBRE DEL DOCENTE</th>
    <th>NÚMERO DE ALUMNOS</th>
  </tr>
`;

// Crear filas
function crearFila(programa) {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${programa}</td>
    <td><input type="number" min="0" class="editable" /></td>
    <td><input type="number" min="0" class="editable" /></td>
    <td><input type="number" min="0" class="editable" /></td>
    <td><input type="number" min="0" class="editable" /></td>
    <td><input type="text" class="editable-text" placeholder="Empresa" /></td>
    <td><input type="text" class="editable-text" placeholder="Docente" /></td>
    <td><input type="number" min="0" class="editable" /></td>
  `;
  tbody.appendChild(tr);
}

programas.forEach(crearFila);

// Fila total
const trTotal = document.createElement('tr');
trTotal.classList.add('total-row');
trTotal.innerHTML = `
  <th>TOTAL</th>
  <td id="total-programadas">0</td>
  <td id="total-tramite">0</td>
  <td id="total-confirmadas">0</td>
  <td id="total-realizadas">0</td>
  <td></td>
  <td></td>
  <td id="total-alumnos">0</td>
`;
tbody.appendChild(trTotal);

// Actualizar totales
function actualizarTotales() {
  let totalProgramadas = 0,
      totalTramite = 0,
      totalConfirmadas = 0,
      totalRealizadas = 0,
      totalAlumnos = 0;

  const filas = Array.from(tbody.querySelectorAll('tr')).slice(0, programas.length);
  filas.forEach(row => {
    totalProgramadas += parseInt(row.children[1].querySelector('input').value) || 0;
    totalTramite     += parseInt(row.children[2].querySelector('input').value) || 0;
    totalConfirmadas += parseInt(row.children[3].querySelector('input').value) || 0;
    totalRealizadas  += parseInt(row.children[4].querySelector('input').value) || 0;
    totalAlumnos     += parseInt(row.children[7].querySelector('input').value) || 0;
  });

  document.getElementById('total-programadas').textContent = totalProgramadas;
  document.getElementById('total-tramite').textContent = totalTramite;
  document.getElementById('total-confirmadas').textContent = totalConfirmadas;
  document.getElementById('total-realizadas').textContent = totalRealizadas;
  document.getElementById('total-alumnos').textContent = totalAlumnos;
}

// Eventos en inputs
function aplicarEventosInputs() {
  const allInputs = Array.from(document.querySelectorAll('.editable, .editable-text'));
  allInputs.forEach((input) => {
    input.addEventListener('input', actualizarTotales);
    input.addEventListener('keydown', (e) => {
      const colCount = 8; // columnas con inputs
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
  // Sidebar toggle
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggleSidebar');

toggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('collapsed');
  toggleBtn.textContent = sidebar.classList.contains('collapsed') ? '⯈' : '⯇';
});
