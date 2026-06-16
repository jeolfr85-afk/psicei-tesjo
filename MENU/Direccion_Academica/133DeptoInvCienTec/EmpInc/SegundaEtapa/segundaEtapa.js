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

  // Encabezado con título
 
  thead.innerHTML = '';

  const trTitulo = document.createElement('tr');
  const thTitulo = document.createElement('th');
  thTitulo.setAttribute('colspan', '4');
  thTitulo.textContent = 'MODELO INSTITUCIONAL DE INCUBACIÓN DE EMPRESAS';
  trTitulo.appendChild(thTitulo);
  thead.appendChild(trTitulo);

  const trEncabezado = document.createElement('tr');
  trEncabezado.innerHTML = `
    <th>PROGRAMA ACADÉMICO</th>
    <th>CANTIDAD DE EMPRESAS INCUBADAS</th>
    <th>CUENTA CON CENTRO DE INCUBACIÓN E INNOVACIÓN EMPRESARIAL DEL TecNM</th>
    <th>EMPRESAS CREADAS EN LA INCUBACIÓN</th>
  `;
  thead.appendChild(trEncabezado);

  
  // Crear filas por programa
 
  function crearFila(programa) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${programa}</td>
      <td><input type="number" class="editable-text" min="0"></td>
      <td><input type="number" class="editable-text" min="0"></td>
      <td><input type="number" class="editable-text" min="0"></td>
    `;
    tbody.appendChild(tr);
  }

  programas.forEach(crearFila);

  // Fila de totales

  const trTotal = document.createElement('tr');
  trTotal.classList.add('total-row');
  trTotal.innerHTML = `
    <th>TOTAL</th>
    <td id="total-cantidad">0</td>
    <td id="total-cuenta">0</td>
    <td id="total-empresas">0</td>
  `;
  tbody.appendChild(trTotal);

  // Función para actualizar totales
  
  function actualizarTotales() {
    let totalcantidad = 0;
    let totalcuenta = 0;
    let totalempresas = 0;

    const filas = Array.from(tbody.querySelectorAll('tr')).slice(0, programas.length);
    filas.forEach(row => {
      const cantidad = parseInt(row.children[1].querySelector('input').value) || 0;
      const cuenta = parseInt(row.children[2].querySelector('input').value) || 0;
      const empresas = parseInt(row.children[3].querySelector('input').value) || 0;
      totalcantidad += cantidad;
      totalcuenta += cuenta;
      totalempresas += empresas;
    });

    document.getElementById('total-cantidad').textContent = totalcantidad;
    document.getElementById('total-cuenta').textContent = totalcuenta;
    document.getElementById('total-empresas').textContent = totalempresas;
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
        const colCount = 4; // total columnas
        const currentIndex = allInputs.indexOf(e.target);

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const next = currentIndex + colCount - 1;
          if (next < allInputs.length) allInputs[next].focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prev = currentIndex - (colCount - 1);
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
    periodoTexto.textContent = 'Periodo: Febrero XXXX - Agosto XXXX';
  }


  // Sidebar toggle

  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('toggleSidebar');
  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    toggleBtn.textContent = sidebar.classList.contains('collapsed') ? '⯈' : '⯇';
  });
});
