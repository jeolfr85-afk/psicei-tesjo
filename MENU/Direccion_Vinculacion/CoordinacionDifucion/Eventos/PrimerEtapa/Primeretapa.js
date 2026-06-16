document.addEventListener("DOMContentLoaded", () => {
  const thead = document.getElementById("thead");
  const tbody = document.getElementById("tbody");
  const btnAgregarFila = document.getElementById("btnAgregarFila");

  const encabezados = [
    "TIPO",
    "NÚMERO DE EVENTOS",
    "FECHA (DÍA/MES/AÑO)",
    "NOMBRE DEL EVENTO",
    "PROGRAMA ACADÉMICO"
  ];

  const tiposEventos = [
    "CONFERENCIAS (DE DIVULGACIÓN)",
    "EXHIBICIONES Y EXPOSICIONES",
    "TALLERES",
    "EVENTOS CULTURALES Y ARTÍSTICOS",
    "EVENTOS DEPORTIVOS"
  ];

  // Crear encabezados
  const filaHead = document.createElement("tr");
  encabezados.forEach(texto => {
    const th = document.createElement("th");
    th.textContent = texto;
    filaHead.appendChild(th);
  });
  thead.appendChild(filaHead);

  // Función para crear una fila de captura
  function crearFila(tipo) {
    const fila = document.createElement("tr");

    encabezados.forEach((encabezado, index) => {
      const celda = document.createElement("td");

      if (index === 0) {
        // Columna de tipo fija
        celda.textContent = tipo;
      } else if (index === 1) {
        // Número de eventos
        const input = document.createElement("input");
        input.type = "number";
        input.min = "0";
        input.style.width = "100%";
        input.addEventListener("input", actualizarTotales);
        celda.appendChild(input);
      } else if (index === 2) {
        // Fecha con calendario
        const input = document.createElement("input");
        input.type = "date";
        input.style.width = "100%";
        celda.appendChild(input);
      } else {
        // Texto
        const input = document.createElement("input");
        input.type = "text";
        input.style.width = "100%";
        celda.appendChild(input);
      }

      fila.appendChild(celda);
    });

    return fila;
  }

  // Generar 5 filas por cada tipo + subtotal
  tiposEventos.forEach(tipo => {
    for (let i = 0; i < 5; i++) {
      tbody.appendChild(crearFila(tipo));
    }

    // Fila de subtotal
    const filaSubtotal = document.createElement("tr");
    filaSubtotal.style.background = "#f0f0f0";
    const celdaTexto = document.createElement("td");
    celdaTexto.textContent = "Subtotal " + tipo;
    const celdaSubtotal = document.createElement("td");
    celdaSubtotal.className = "subtotal";
    celdaSubtotal.dataset.tipo = tipo;
    celdaSubtotal.textContent = "0";
    filaSubtotal.appendChild(celdaTexto);
    filaSubtotal.appendChild(celdaSubtotal);
    for (let i = 2; i < encabezados.length; i++) {
      filaSubtotal.appendChild(document.createElement("td"));
    }
    tbody.appendChild(filaSubtotal);
  });

  // Fila de total general
  const filaTotal = document.createElement("tr");
  filaTotal.style.background = "#d0e0ff";
  const celdaTotalTexto = document.createElement("td");
  celdaTotalTexto.textContent = "TOTAL GENERAL";
  const celdaTotal = document.createElement("td");
  celdaTotal.id = "totalGeneral";
  celdaTotal.textContent = "0";
  filaTotal.appendChild(celdaTotalTexto);
  filaTotal.appendChild(celdaTotal);
  for (let i = 2; i < encabezados.length; i++) {
    filaTotal.appendChild(document.createElement("td"));
  }
  tbody.appendChild(filaTotal);

  // Función para actualizar subtotales y total general
  function actualizarTotales() {
    let totalGeneral = 0;

    tiposEventos.forEach(tipo => {
      let subtotal = 0;

      // Buscar inputs de ese tipo
      [...tbody.querySelectorAll("tr")].forEach(tr => {
        if (tr.cells[0]?.textContent === tipo) {
          const input = tr.querySelector("input[type='number']");
          if (input) subtotal += parseInt(input.value) || 0;
        }
      });

      // Colocar subtotal
      const celdaSubtotal = tbody.querySelector(`.subtotal[data-tipo="${tipo}"]`);
      if (celdaSubtotal) {
        celdaSubtotal.textContent = subtotal;
      }

      totalGeneral += subtotal;
    });

    document.getElementById("totalGeneral").textContent = totalGeneral;
  }

  // Botón para agregar fila al final
  btnAgregarFila.addEventListener("click", () => {
    const nuevaFila = crearFila("NUEVO EVENTO");
    tbody.insertBefore(nuevaFila, tbody.lastElementChild); // antes del total
  });
});


    // Mostrar periodo
    const periodoTexto = document.getElementById('periodoTexto');
    const ciclo = localStorage.getItem('cicloEscolarSeleccionado');
    if (periodoTexto){
        if(ciclo){
            const [anioInicio, anioFin] = ciclo.split('-');
            periodoTexto.textContent = `Periodo: Septiembre ${anioInicio.slice(-4)} - Febrero ${anioFin.slice(-4)}`;
        } else {
            periodoTexto.textContent = 'Periodo: Septiembre XXXX - Febrero XXXX';
        }
    }

    // Sidebar toggle
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleSidebar');
    if(sidebar && toggleBtn){
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            toggleBtn.textContent = sidebar.classList.contains('collapsed') ? '⯈' : '⯇';
        });
    }


