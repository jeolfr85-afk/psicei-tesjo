document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.getElementById('tbody');

  // 🔹 Crear 5 filas vacías que el usuario pueda llenar
  for (let i = 0; i < 5; i++) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="text" class="editable-text"></td>
      <td><input type="text" class="editable-text"></td>
      <td><input type="text" class="editable-text"></td>
      <td><input type="text" class="editable-text"></td>
      <td><input type="text" class="editable-text"></td>
      <td><input type="date" class="editable-text"></td>
      <td><input type="text" class="editable-text"></td>
      <td><input type="text" class="editable-text"></td>
    `;
    tbody.appendChild(tr);
  }

  // 🔹 Navegación con el teclado (flechas)
  function aplicarEventosInputs() {
    const allInputs = Array.from(document.querySelectorAll('.editable-text'));
    const colCount = 8; // número de columnas

    allInputs.forEach((input) => {
      input.addEventListener('keydown', (e) => {
        const currentIndex = allInputs.indexOf(e.target);

        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            if (currentIndex + colCount < allInputs.length)
              allInputs[currentIndex + colCount].focus();
            break;

          case 'ArrowUp':
            e.preventDefault();
            if (currentIndex - colCount >= 0)
              allInputs[currentIndex - colCount].focus();
            break;

          case 'ArrowRight':
            e.preventDefault();
            if (currentIndex + 1 < allInputs.length)
              allInputs[currentIndex + 1].focus();
            break;

          case 'ArrowLeft':
            e.preventDefault();
            if (currentIndex - 1 >= 0)
              allInputs[currentIndex - 1].focus();
            break;
        }
      });
    });
  }

  aplicarEventosInputs();

  // 🔹 Mostrar periodo almacenado (desde localStorage)
  const periodoTexto = document.getElementById('periodoTexto');
  const ciclo = localStorage.getItem('cicloEscolarSeleccionado');

  if (ciclo) {
    const [anioInicio, anioFin] = ciclo.split('-');
    periodoTexto.textContent = `Periodo: Septiembre ${anioInicio.slice(-4)} - Febrero ${anioFin.slice(-4)}`;
  } else {
    periodoTexto.textContent = 'Periodo: Septiembre XXXX - Febrero XXXX';
  }

  // 🔹 Sidebar toggle
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('toggleSidebar');

  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    toggleBtn.textContent = sidebar.classList.contains('collapsed') ? '⯈' : '⯇';
  });

  // 🔹 Botón de “Guardar Cambios” (ejemplo de acción)
  document.getElementById('btnGuardarBD').addEventListener('click', () => {
    const datos = [];
    const filas = tbody.querySelectorAll('tr');

    filas.forEach(fila => {
      const valores = Array.from(fila.querySelectorAll('input')).map(i => i.value.trim());
      datos.push(valores);
    });

    console.log('Datos capturados:', datos);
    alert('Datos guardados temporalmente en consola (ver F12).');
  });

  // 🔹 Botón “Descargar Excel”
  document.getElementById('btnGuardarExcel').addEventListener('click', () => {
    const datos = [];
    const headers = ['PROGRAMA ACADÉMICO', 'NOMBRE', 'SEXO', 'ÁREA DE CONOCIMIENTO', 'ETAPA', 'FECHA', 'RESULTADOS', 'OBSERVACIONES'];

    datos.push(headers);
    const filas = tbody.querySelectorAll('tr');
    filas.forEach(fila => {
      const filaData = Array.from(fila.querySelectorAll('input')).map(i => i.value);
      datos.push(filaData);
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(datos);
    XLSX.utils.book_append_sheet(wb, ws, 'AlumnosEventos');
    XLSX.writeFile(wb, 'Alumnos_Eventos.xlsx');
  });

  // 🔹 Botón “Descargar PDF”
  document.getElementById('btnGuardarPDF').addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const datos = [];
    const filas = tbody.querySelectorAll('tr');
    filas.forEach(fila => {
      const filaData = Array.from(fila.querySelectorAll('input')).map(i => i.value || '');
      datos.push(filaData);
    });

    doc.text('Alumnos en Eventos Académicos', 14, 15);
    doc.autoTable({
      head: [['PROGRAMA ACADÉMICO', 'NOMBRE', 'SEXO', 'ÁREA', 'ETAPA', 'FECHA', 'RESULTADOS', 'OBSERVACIONES']],
      body: datos,
      startY: 20,
    });

    doc.save('Alumnos_Eventos.pdf');
  });

  // 🔹 Botón “Cancelar” → limpia las celdas
  document.getElementById('btnCancelar').addEventListener('click', () => {
    const inputs = document.querySelectorAll('.editable-text');
    inputs.forEach(i => (i.value = ''));
  });
});
