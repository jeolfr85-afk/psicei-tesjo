document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("contenedorTablas");

  // 🔹 Función para crear tablas con encabezado y cuerpo
  function crearTabla(titulo, encabezados, filas) {
    const div = document.createElement("div");
    div.classList.add("tabla-wrapper");

    const h3 = document.createElement("h3");
    h3.textContent = titulo;

    const tabla = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    // Encabezados
    const trHead = document.createElement("tr");
    encabezados.forEach(thText => {
      const th = document.createElement("th");
      th.textContent = thText;
      trHead.appendChild(th);
    });
    thead.appendChild(trHead);

    // Filas base
    filas.forEach(fila => {
      const tr = document.createElement("tr");
      fila.forEach((celda, index) => {
        const td = document.createElement("td");
        td.textContent = celda;

        // 🔹 Hacer editables las celdas (excepto la primera columna)
        if (index > 0) {
          td.contentEditable = "true";
          td.setAttribute("inputmode", "numeric");
          td.addEventListener("input", () => {
            // Permitir solo números y punto decimal
            td.textContent = td.textContent.replace(/[^0-9.]/g, "");
          });
        }

        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });

    tabla.appendChild(thead);
    tabla.appendChild(tbody);
    div.appendChild(h3);
    div.appendChild(tabla);

    contenedor.appendChild(div);
  }

  // 🔸 Tabla 1: CUENTA CON COMPUTADORAS
  crearTabla("CUENTA CON COMPUTADORAS", ["Opción", "Respuesta"], [
    ["SI", ""],
    ["NO", ""]
  ]);

  // 🔸 Tabla 2: TOTAL DE COMPUTADORAS
  crearTabla("TOTAL DE COMPUTADORAS", ["Opción", "Respuesta"], [
    ["TES JOCOTITLÁN", ""],
    ["EXTENSIÓN ACULCO", ""]
  ]);

  // 🔸 Tabla 3: TOTAL DE COMPUTADORAS SEGÚN SU ESTATUS
  crearTabla("TOTAL DE COMPUTADORAS SEGÚN SU ESTATUS", ["Estatus", "TES JOCOTITLÁN", "EXTENSIÓN ACULCO", "TOTAL"], [
    ["EN OPERACIÓN", "", "", ""],
    ["EN REPARACIÓN", "", "", ""],
    ["GUARDADAS O EN RESERVA", "", "", ""],
    ["TOTAL", "0", "0", "0"]
  ]);

  // 🔸 Tabla 4: TOTAL DE COMPUTADORAS EN OPERACIÓN SEGÚN SU USO
  crearTabla("TOTAL DE COMPUTADORAS EN OPERACIÓN SEGÚN SU USO", ["Uso", "TES JOCOTITLÁN", "EXTENSIÓN ACULCO", "TOTAL"], [
    ["EDUCATIVO", "", "", ""],
    ["DOCENTE", "", "", ""],
    ["ADMINISTRATIVO", "", "", ""],
    ["TOTAL", "0", "0", "0"]
  ]);

  // 🔸 Tabla 5: COMPUTADORAS GUARDADAS O EN RESERVA
  crearTabla("COMPUTADORAS GUARDADAS O EN RESERVA", ["Motivo", "TES JOCOTITLÁN", "EXTENSIÓN ACULCO", "TOTAL"], [
    ["INSTALACIONES ELÉCTRICAS INADECUADAS", "", "", ""],
    ["FALTA DE ESPACIO", "", "", ""],
    ["FALTA DE MOBILIARIO", "", "", ""],
    ["FALTA DE ACCESORIOS EXTERNOS", "", "", ""],
    ["INDICACIONES SUPERIORES", "", "", ""]
  ]);

  // 🔸 Tabla 6: COMPUTADORAS EN OPERACIÓN CON ACCESO A INTERNET
  crearTabla("TOTAL DE COMPUTADORAS EN OPERACIÓN CON ACCESO A INTERNET", ["Uso", "TES JOCOTITLÁN", "EXTENSIÓN ACULCO", "TOTAL"], [
    ["EDUCATIVO", "", "", ""],
    ["DOCENTE", "", "", ""],
    ["ADMINISTRATIVO", "", "", ""],
    ["TOTAL", "0", "0", "0"]
  ]);

  // 🔸 Tabla 7: COMPUTADORAS USO EDUCATIVO - CARACTERÍSTICAS
  crearTabla("TOTAL DE COMPUTADORAS ASIGNADAS PARA USO EDUCATIVO EN OPERACIÓN - SEGÚN SUS CARACTERÍSTICAS", ["CARACTERÍSTICA", "TES JOCOTITLÁN", "EXTENSIÓN ACULCO", "TOTAL"], [
    ["DE 1GB A MENOS DE 4GB RAM", "", "", ""],
    ["DE 4 A 16GB RAM", "", "", ""],
    ["16GB O MÁS RAM", "", "", ""],
    ["WINDOWS", "", "", ""],
    ["MAC OS", "", "", ""],
    ["LINUX U OTRO", "", "", ""],
    ["128GB O MENOS DISCO DURO", "", "", ""],
    ["DE 129 A 500GB", "", "", ""],
    ["DE MÁS DE 500GB", "", "", ""],
  ]);

  // 🔹 Función de navegación con el teclado
  function aplicarEventosInputs() {
    const allInputs = Array.from(document.querySelectorAll('td[contenteditable="true"]'));
    allInputs.forEach((input) => {
      input.addEventListener('keydown', (e) => {
        const colCount = input.parentElement.children.length - 1; // columnas editables
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

  // 🔹 Activar navegación
  aplicarEventosInputs();

  // 🔹 Botones PDF / Excel
  document.getElementById("btnGuardarPDF").addEventListener("click", () => {
    const opt = {
      margin: 0.5,
      filename: "inventario_computadoras.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "landscape" }
    };
    html2pdf().set(opt).from(document.body).save();
  });

  document.getElementById("btnGuardarExcel").addEventListener("click", () => {
    const wb = XLSX.utils.book_new();
    const tablas = document.querySelectorAll("table");

    tablas.forEach((tabla, i) => {
      const ws = XLSX.utils.table_to_sheet(tabla);
      XLSX.utils.book_append_sheet(wb, ws, `Tabla_${i + 1}`);
    });

    XLSX.writeFile(wb, "inventario_computadoras.xlsx");
  });

  document.getElementById("btnCancelar").addEventListener("click", () => {
    window.location.href = "http://localhost/prueba/prueba/MENU/Direccion_General/pprincipal.html";
  });

   // Mostrar periodo guardado
  const periodoTexto = document.getElementById("periodoTexto");
  const ciclo = localStorage.getItem("cicloEscolarSeleccionado");
  if (ciclo) {
    const [anioInicio, anioFin] = ciclo.split("-");
    periodoTexto.textContent = `Periodo: Septiembre ${anioInicio.slice(-4)} - Febrero ${anioFin.slice(-4)}`;
  } else {
    periodoTexto.textContent = "Periodo: Septiembre XXXX - Febrero XXXX";
  }

  // Sidebar toggle
  const sidebar = document.getElementById("sidebar");
  const toggleBtn = document.getElementById("toggleSidebar");
  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
    toggleBtn.textContent = sidebar.classList.contains("collapsed") ? "⯈" : "⯇";
  });

  // Botones
  document.getElementById("btnAgregarFila").addEventListener("click", () => agregarFila("EXTENSIÓN ACULCO"));
  document.getElementById("btnGuardarExcel").addEventListener("click", exportToExcel);
  document.getElementById("btnGuardarPDF").addEventListener("click", exportToPDF);
});
