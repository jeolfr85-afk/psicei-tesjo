document.addEventListener('DOMContentLoaded', () => {
  const AREAS = ["JURÍDICA", "SALUD", "EDUCACIÓN", "VIVIENDA", "ECOLOGÍA"];
  const thead = document.getElementById('thead');
  const tbody = document.getElementById('tbody');

  // Encabezados
  thead.innerHTML = `
    <tr>
      <th>ÁREA</th>
      <th>TOTAL DE CONSULTAS Y ASESORÍAS</th>
      <th>TOTAL DE BENEFICIARIOS</th>
    </tr>
  `;

  function crearFila(area) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${area}</td>
      <td><input type="number" min="0" value="" class="editable" /></td>
      <td><input type="number" min="0" value="" class="editable" /></td>
    `;
    tbody.appendChild(tr);
  }

  AREAS.forEach(area => crearFila(area));

  // Fila de totales
  const trTotal = document.createElement('tr');
  trTotal.classList.add('total-row');
  trTotal.innerHTML = `
    <th>TOTAL</th>
    <td id="total-consultas">0</td>
    <td id="total-beneficiarios">0</td>
  `;
  tbody.appendChild(trTotal);

  function actualizarTotales() {
    let totalConsultas = 0;
    let totalBenef = 0;

    document.querySelectorAll('#tbody tr').forEach((row, i) => {
      if (i < AREAS.length) {
        const consultas = parseInt(row.children[1].querySelector('input').value) || 0;
        const beneficiarios = parseInt(row.children[2].querySelector('input').value) || 0;
        totalConsultas += consultas;
        totalBenef += beneficiarios;
      }
    });

    document.getElementById('total-consultas').textContent = totalConsultas;
    document.getElementById('total-beneficiarios').textContent = totalBenef;
  }

  // Actualizar totales sólo cuando cambie el valor, no en cada tecla
  document.querySelectorAll('.editable').forEach(input => {
    input.addEventListener('change', actualizarTotales);
    input.addEventListener('keydown', (e) => {
      const inputs = Array.from(document.querySelectorAll('.editable'));
      const index = inputs.indexOf(e.target);
      if (e.key === 'ArrowDown' && index + 2 < inputs.length) {
        e.preventDefault();
        inputs[index + 2].focus();
      } else if (e.key === 'ArrowUp' && index - 2 >= 0) {
        e.preventDefault();
        inputs[index - 2].focus();
      } else if (e.key === 'ArrowRight' && index + 1 < inputs.length) {
        e.preventDefault();
        inputs[index + 1].focus();
      } else if (e.key === 'ArrowLeft' && index - 1 >= 0) {
        e.preventDefault();
        inputs[index - 1].focus();
      }
    });
  });
// Sidebar toggle
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggleSidebar');

toggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('collapsed');
  toggleBtn.textContent = sidebar.classList.contains('collapsed') ? '⯈' : '⯇';
});
  // Mostrar el periodo según el ciclo escolar seleccionado
  const periodoTexto = document.getElementById('periodoTexto');
  const ciclo = localStorage.getItem('cicloEscolarSeleccionado');
  if (ciclo) {
    const [anioInicio, anioFin] = ciclo.split('-');
    const periodo = `Periodo: Septiembre ${anioInicio.slice(-4)} - Febrero ${anioFin.slice(-4)}`;
    periodoTexto.textContent = periodo;
  } else {
    periodoTexto.textContent = 'Periodo: Septiembre XXXX - Febrero XXXX';
  }

  // Exportar a Excel
  document.getElementById('btnGuardarExcel').addEventListener('click', () => {
    const table = document.getElementById("tablaTalleres");
    const wb = XLSX.utils.table_to_book(table, { sheet: "Estadísticas" });
    XLSX.writeFile(wb, "Estadisticas_por_area.xlsx");
  });

  // Exportar a PDF
  document.getElementById('btnGuardarPDF').addEventListener('click', () => {
    const element = document.getElementById("tablaTalleres");
    html2pdf().from(element).save("Estadisticas_por_area.pdf");
  });

});
