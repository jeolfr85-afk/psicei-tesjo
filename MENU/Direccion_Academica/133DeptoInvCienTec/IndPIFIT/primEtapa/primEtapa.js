// Variables globales con los indicadores y programas
const indicadoresBase = [
    "NÚMERO DE ARTÍCULOS ARBITRADOS (EXCEPTO JCR)",
    "NÚMERO DE ARTÍCULOS ARBITRADOS CON ÍNDICE JCR",
    "NÚMERO DE LIBROS PUBLICADOS",
    "NÚMERO DE LÍNEAS DE INVESTIGACIÓN REGISTRADAS EN TecNM",
    "NÚMERO DE PROFESORES EN REDES DE INVESTIGACIÓN INTERINSTITUCIONAL",
    "NÚMERO DE ESTUDIANTES EN PROYECTO DE FORMACIÓN DE JÓVENES INVESTIGADORES",
    "NÚMERO DE REDES DE INVESTIGACIÓN QUE APORTA EL PROGRAMA EDUCATIVO"
];
const indicadores = [...indicadoresBase, "TOTAL"];

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
    "LICENCIATURA EN TURISMO LTUR-2012-237. EXTENSIÓN ACULCO"
];

// Inicializar tabla cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
    const thead = document.getElementById("thead");
    const tbody = document.getElementById("tbody");

    construirEncabezado(thead);
    construirCuerpo(tbody);
});

function construirEncabezado(thead) {
    const filaPrincipal = document.createElement("tr");

    const thPrograma = document.createElement("th");
    thPrograma.textContent = "PROGRAMA ACADÉMICO";
    filaPrincipal.appendChild(thPrograma);

    indicadores.forEach(indicador => {
        const th = document.createElement("th");
        th.textContent = indicador;
        filaPrincipal.appendChild(th);
    });

    thead.appendChild(filaPrincipal);
}

function construirCuerpo(tbody) {
    programas.forEach(programa => {
        const tr = document.createElement("tr");

        const tdPrograma = document.createElement("td");
        tdPrograma.textContent = programa;
        tr.appendChild(tdPrograma);

        indicadores.forEach(indicador => {
            const td = document.createElement("td");
            if (indicador !== "TOTAL") {
                td.contentEditable = "true"; // Editable
                td.setAttribute("tabindex", "0");
                td.classList.add("editable-cell");
            } else {
                td.textContent = "0"; // Total inicial en cero
            }
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });
}


// Sidebar toggle
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('toggleSidebar');
  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    toggleBtn.textContent = sidebar.classList.contains('collapsed') ? '⯈' : '⯇';
  });


  function construirCuerpo(tbody) {
    programas.forEach(programa => {
        const tr = document.createElement("tr");

        const tdPrograma = document.createElement("td");
        tdPrograma.textContent = programa;
        tr.appendChild(tdPrograma);

        indicadores.forEach(indicador => {
            const td = document.createElement("td");
            if (indicador !== "TOTAL") {
                td.contentEditable = "true"; // Editable
                td.setAttribute("tabindex", "0");
                td.classList.add("editable-cell");

                // Listener para actualizar total cuando cambia el valor
                td.addEventListener("input", () => {
                    actualizarTotal(tr);
                });
            } else {
                td.textContent = "0"; // Total inicial en cero
                td.classList.add("total-cell");
            }
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });
}

// Función para sumar los valores de la fila y actualizar TOTAL
function actualizarTotal(tr) {
    let suma = 0;
    const celdas = tr.querySelectorAll("td");
    // Empezamos en 1 para saltar la celda de nombre del programa
    for (let i = 1; i < celdas.length - 1; i++) {
        const valor = parseFloat(celdas[i].textContent) || 0;
        suma += valor;
    }
    // La última celda es TOTAL
    celdas[celdas.length - 1].textContent = suma;
}

 // Mostrar periodo
  const periodoTexto = document.getElementById('periodoTexto');
  const ciclo = localStorage.getItem('cicloEscolarSeleccionado');
  if (ciclo) {
    const [anioInicio, anioFin] = ciclo.split('-');
    periodoTexto.textContent = `Periodo: Septiembre ${anioInicio.slice(-4)} - Febrero ${anioFin.slice(-4)}`;
  } else {
    periodoTexto.textContent = 'Periodo: Septiembre XXXX - Febrero XXXX';
  }
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
