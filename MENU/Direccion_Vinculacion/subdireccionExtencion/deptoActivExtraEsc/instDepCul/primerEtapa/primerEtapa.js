document.addEventListener('DOMContentLoaded', () => {
  const campos = [
    "AULA 1E/E", "AULA 1 1/2 E/E", "AULA 2 E/E", "AULA 2 1/2 E/E",
    "AULA 3 E/E", "Laboratorio de inglés"
  ];

  const talleres = [
    "BEISBOL", "BOX", "GIMNASIO", "TAEKWONDO", "TIRO CON ARCO", "ATLETISMO",
    "FUTBOL", "VOLEIBOL", "BASQUETBALL"
  ];

  const thead = document.getElementById('thead');
  const tbody = document.getElementById('tbody');

  thead.innerHTML = `
    <tr>
      <th rowspan="2">AULAS</th>
      <th colspan="3">A</th>
      <th rowspan="2">TOTAL DE CONSTANCIAS</th>
      <th colspan="2">CERTIFICACIONES</th>
    </tr>
    <tr>
      <th>MUJER</th><th>HOMBRE</th><th>TOTAL</th>
      <th>ESTUDIANTES</th><th>DOCENTES</th>
    </tr>
  `;

  // Agrega los campos (aulas, laboratorios, etc.)
  campos.forEach(nombre => {
    const tr = document.createElement('tr');
    tr.setAttribute("data-grupo", "CAMPOS");

    tr.innerHTML = `<td>${nombre}</td>
      <td contenteditable="true" class="editable"></td>
      <td contenteditable="true" class="editable"></td>
      <td class="total-ingles">0</td>
      <td class="total-constancias">0</td>
      <td contenteditable="true" class="editable"></td>
      <td contenteditable="true" class="editable"></td>`;
    tbody.appendChild(tr);
  });

  // Título "DEPORTIVAS"
  const trTitulo = document.createElement('tr');
  trTitulo.innerHTML = `<td colspan="7" style="text-align:center; font-weight:bold;">DEPORTIVAS</td>`;
  tbody.appendChild(trTitulo);

  // Agrega talleres deportivos
  talleres.forEach(nombre => {
    const tr = document.createElement('tr');
    tr.setAttribute("data-grupo", "DEPORTIVAS");

    tr.innerHTML = `<td>${nombre}</td>
      <td contenteditable="true" class="editable"></td>
      <td contenteditable="true" class="editable"></td>
      <td class="total-ingles">0</td>
      <td class="total-constancias">0</td>
      <td contenteditable="true" class="editable"></td>
      <td contenteditable="true" class="editable"></td>`;
    tbody.appendChild(tr);
  });

  // Subtotales por grupo
  ["CAMPOS", "DEPORTIVAS"].forEach(grupo => {
    const tr = document.createElement("tr");
    tr.classList.add("subtotal");
    tr.setAttribute("data-total", grupo);
    tr.innerHTML = `<td style="font-weight:bold">${grupo}</td>
      <td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td>`;
    tbody.appendChild(tr);
  });

  // Total general
  const trTotal = document.createElement("tr");
  trTotal.classList.add("total-final");
  trTotal.innerHTML = `<td style="font-weight:bold">TOTAL GENERAL</td>
    <td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td>`;
  tbody.appendChild(trTotal);

  // Recalcular totales
  function recalcular() {
    const totales = {
      CAMPOS: [0, 0, 0, 0, 0, 0],
      DEPORTIVAS: [0, 0, 0, 0, 0, 0]
    };

    const filas = tbody.querySelectorAll('tr[data-grupo]');
    filas.forEach(fila => {
      const grupo = fila.dataset.grupo;
      const celdas = fila.querySelectorAll('td');
      const mujer = parseInt(celdas[1].textContent) || 0;
      const hombre = parseInt(celdas[2].textContent) || 0;
      const estudiantes = parseInt(celdas[5].textContent) || 0;
      const docentes = parseInt(celdas[6].textContent) || 0;

      const totalIngles = mujer + hombre;
      const totalConstancias = estudiantes + docentes;

      celdas[3].textContent = totalIngles;
      celdas[4].textContent = totalConstancias;

      const arr = [mujer, hombre, totalIngles, totalConstancias, estudiantes, docentes];
      arr.forEach((num, i) => totales[grupo][i] += num);
    });

    ["CAMPOS", "DEPORTIVAS"].forEach(grupo => {
      const fila = tbody.querySelector(`tr[data-total="${grupo}"]`);
      if (fila) {
        const tds = fila.querySelectorAll('td');
        totales[grupo].forEach((val, i) => {
          tds[i + 1].textContent = val;
        });
      }
    });

    const totalFinal = tbody.querySelector('.total-final');
    const totalTDs = totalFinal.querySelectorAll('td');
    for (let i = 0; i < 6; i++) {
      const suma = totales.CAMPOS[i] + totales.DEPORTIVAS[i];
      totalTDs[i + 1].textContent = suma;
    }
  }

  // Eventos
  tbody.addEventListener('input', e => {
    if (e.target.classList.contains('editable')) {
      e.target.textContent = e.target.textContent.replace(/\D/g, '');
      recalcular();
    }
  });

  tbody.addEventListener('keydown', e => {
    if (!e.target.classList.contains('editable')) return;
    const editable = [...tbody.querySelectorAll('.editable')];
    const index = editable.indexOf(e.target);
    if (e.key === 'ArrowRight' && editable[index + 1]) {
      e.preventDefault();
      editable[index + 1].focus();
    } else if (e.key === 'ArrowLeft' && editable[index - 1]) {
      e.preventDefault();
      editable[index - 1].focus();
    }
  });

  recalcular();
});
