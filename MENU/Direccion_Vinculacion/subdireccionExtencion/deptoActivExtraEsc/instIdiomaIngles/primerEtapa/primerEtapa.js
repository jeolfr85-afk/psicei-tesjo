ocument.addEventListener('DOMContentLoaded', () => {
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

  const thead = document.getElementById('thead');
  const tbody = document.getElementById('tbody');

  thead.innerHTML = `
    <tr>
      <th rowspan="2">PROGRAMA ACADÉMICO</th>
      <th colspan="3">INGLÉS</th>
      <th rowspan="2">TOTAL DE CONSTANCIAS</th>
      <th colspan="2">CERTIFICACIONES</th>
    </tr>
    <tr>
      <th>MUJER</th><th>HOMBRE</th><th>TOTAL</th>
      <th>ESTUDIANTES</th><th>DOCENTES</th>
    </tr>
  `;

  programas.forEach(nombre => {
    const tr = document.createElement('tr');
    const grupo = nombre.includes("EXTENSIÓN ACULCO") ? "ACULCO" : "JOCOTITLAN";
    tr.setAttribute("data-grupo", grupo);

    tr.innerHTML = `<td>${nombre}</td>
      <td contenteditable="true" class="editable"></td>
      <td contenteditable="true" class="editable"></td>
      <td class="total-ingles">0</td>
      <td class="total-constancias">0</td>
      <td contenteditable="true" class="editable"></td>
      <td contenteditable="true" class="editable"></td>`;
    tbody.appendChild(tr);
  });

  ["TES JOCOTITLÁN", "EXTENSIÓN ACULCO"].forEach(grupo => {
    const tr = document.createElement("tr");
    tr.classList.add("subtotal");
    tr.setAttribute("data-total", grupo.includes("ACULCO") ? "ACULCO" : "JOCOTITLAN");
    tr.innerHTML = `<td style="font-weight:bold">${grupo}</td>
      <td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td>`;
    tbody.appendChild(tr);
  });

  const trTotal = document.createElement("tr");
  trTotal.classList.add("total-final");
  trTotal.innerHTML = `<td style="font-weight:bold">TOTAL</td>
    <td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td>`;
  tbody.appendChild(trTotal);

  function recalcular() {
    const totales = {
      JOCOTITLAN: [0, 0, 0, 0, 0, 0],
      ACULCO: [0, 0, 0, 0, 0, 0]
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

    ["JOCOTITLAN", "ACULCO"].forEach(grupo => {
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
      const suma = totales.JOCOTITLAN[i] + totales.ACULCO[i];
      totalTDs[i + 1].textContent = suma;
    }
  }

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
