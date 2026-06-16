
    document.addEventListener('DOMContentLoaded', () => {
      const programas = [
        "INGENIERÍA ELECTROMECÁNICA IEME-2010-210",
        "INGENIERÍA INDUSTRIAL IIND-2010-227",
        "INGENIERÍA EN SISTEMAS COMPUTACIONALES ISIC-2010-224",
        "INGENIERÍA MECATRÓNICA IMCT-2010-229",
        "ARQUITECTURA ARQU-2010-204",
        "CONTADOR PÚBLICO COPU-2010-205",
        "INGENIERÍA EN GESTIÓN EMPRESARIAL IGEM-2009-201",
        "INGENIERÍA QUÍMICA IQUI-2010-232",
        "INGENIERÍA EN MATERIALES IMAT-2010-222",
        "INGENIERÍA EN ANIMACIÓN DIGITAL Y EFECTOS VISUALES IAEV-2012-238",
        "LICENCIATURA EN TURISMO LTUR-2012-237",
      ];

      const thead = document.getElementById("thead");
      const tbody = document.getElementById("tbody");
      thead.innerHTML = '';

      // Título principal
      const trTitulo = document.createElement('tr');
      const thTitulo = document.createElement('th');
      thTitulo.setAttribute('colspan', '8');
      thTitulo.textContent = 'PARTICIPANTES EN ACTIVIDADES DE EMPRENDIMIENTO';
      trTitulo.appendChild(thTitulo);
      thead.appendChild(trTitulo);

      // Fila principal
      const filaPrincipal = document.createElement("tr");
      const thPrograma = document.createElement("th");
      thPrograma.textContent = "PROGRAMA ACADÉMICO";
      thPrograma.rowSpan = 2;
      filaPrincipal.appendChild(thPrograma);

      const thEstudiantes = document.createElement("th");
      thEstudiantes.textContent = "CANTIDAD DE ESTUDIANTES QUE PARTICIPAN";
      thEstudiantes.colSpan = 3;
      filaPrincipal.appendChild(thEstudiantes);

      const thDocentes = document.createElement("th");
      thDocentes.textContent = "CANTIDAD DE DOCENTES QUE PARTICIPAN";
      thDocentes.colSpan = 3;
      filaPrincipal.appendChild(thDocentes);

      thead.appendChild(filaPrincipal);

      // Fila de sub-encabezados
      const filaSub = document.createElement("tr");
      ["HOMBRES", "MUJERES", "TOTAL", "HOMBRES", "MUJERES", "TOTAL"].forEach(texto => {
        const th = document.createElement("th");
        th.textContent = texto;
        filaSub.appendChild(th);
      });
      thead.appendChild(filaSub);

      // Cuerpo de la tabla
      programas.forEach(programa => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${programa}</td>
          <td><input type="number" class="editable-text estudiantes-h" min="0"></td>
          <td><input type="number" class="editable-text estudiantes-m" min="0"></td>
          <td><input type="number" class="editable-text estudiantes-t" min="0" readonly></td>
          <td><input type="number" class="editable-text docentes-h" min="0"></td>
          <td><input type="number" class="editable-text docentes-m" min="0"></td>
          <td><input type="number" class="editable-text docentes-t" min="0" readonly></td>
        `;
        tbody.appendChild(tr);
      });

      // Fila de totales
      const trTotales = document.createElement("tr");
      trTotales.innerHTML = `
        <td><strong>TOTALES</strong></td>
        <td id="total-est-h">0</td>
        <td id="total-est-m">0</td>
        <td id="total-est-t">0</td>
        <td id="total-doc-h">0</td>
        <td id="total-doc-m">0</td>
        <td id="total-doc-t">0</td>
      `;
      tbody.appendChild(trTotales);

      // Función para actualizar totales
      function actualizarTotales() {
        let estH = 0, estM = 0, estT = 0;
        let docH = 0, docM = 0, docT = 0;

        const filas = Array.from(tbody.querySelectorAll('tr')).slice(0, programas.length);
        filas.forEach(row => {
          const hEst = parseInt(row.querySelector('.estudiantes-h').value) || 0;
          const mEst = parseInt(row.querySelector('.estudiantes-m').value) || 0;
          const hDoc = parseInt(row.querySelector('.docentes-h').value) || 0;
          const mDoc = parseInt(row.querySelector('.docentes-m').value) || 0;

          row.querySelector('.estudiantes-t').value = hEst + mEst;
          row.querySelector('.docentes-t').value = hDoc + mDoc;

          estH += hEst;
          estM += mEst;
          estT += hEst + mEst;
          docH += hDoc;
          docM += mDoc;
          docT += hDoc + mDoc;
        });

        document.getElementById('total-est-h').textContent = estH;
        document.getElementById('total-est-m').textContent = estM;
        document.getElementById('total-est-t').textContent = estT;
        document.getElementById('total-doc-h').textContent = docH;
        document.getElementById('total-doc-m').textContent = docM;
        document.getElementById('total-doc-t').textContent = docT;
      }

      // Actualizar totales al cambiar inputs
      document.addEventListener('input', (e) => {
        if (e.target.classList.contains('editable-text')) {
          actualizarTotales();
        }
      });

      // Navegación con teclado
      function aplicarEventosInputs() {
        const allInputs = Array.from(document.querySelectorAll('.editable-text'));
        allInputs.forEach((input) => {
          input.addEventListener('keydown', (e) => {
            const colCount = 3;
            const currentIndex = allInputs.indexOf(e.target);

            if (e.key === 'ArrowDown') {
              e.preventDefault();
              const next = currentIndex + colCount;
              if (next < allInputs.length) allInputs[next].focus();
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              const prev = currentIndex - colCount;
              if (prev >= 0) allInputs[prev].focus();
            } else if (e.key === 'ArrowRight') {
              e.preventDefault();
              const next = currentIndex + 1;
              if (next < allInputs.length) allInputs[next].focus();
            } else if (e.key === 'ArrowLeft') {
              e.preventDefault();
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
    });
 