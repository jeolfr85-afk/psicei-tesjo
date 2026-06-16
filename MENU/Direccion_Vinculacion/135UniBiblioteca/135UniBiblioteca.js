document.addEventListener('DOMContentLoaded', () => {
    const campos = [
      "TIPO DE CLASIFICACIÓN LC",
      "TÍTULOS",
      "TÍTULOS CLASIFICADOS",
      "VOLUMENES",
      "VOLUMENES CLASIFICADOS",
      "LIBROS PRESTADOS EN SALA",
      "LIBROS PRESTADOS A DOMICILIO",
      "PUBLICACIONES PERIODICAS, NÚMERO DE TÍTULOS",
      "TOTAL DE USUARIOS EN EL PERIODO",
      "CAPACIDAD DE USUARIOS EN SALA",
      "PC'S CON INTERNET",
      "PC'C SIN INTERNET",
      "CONSULTAS ALUMNOS",
      "CONSULTAS DOCENTES",
      "CENTRO DE INFORMACIÓN"
    ];
  
    const cuerpo = document.getElementById("tablaCuerpo");
    const inputsCantidad = [];
  
    // Generar filas de la tabla
    campos.forEach((texto, index) => {
      const fila = document.createElement("tr");
  
      // Nombre del campo
      const celdaDato = document.createElement("td");
      celdaDato.textContent = texto;
  
      // Input de cantidad
      const celdaCantidad = document.createElement("td");
      const inputCantidad = document.createElement("input");
      inputCantidad.type = "number";
      inputCantidad.placeholder = "Ingrese cantidad";
      inputsCantidad.push(inputCantidad);
      celdaCantidad.appendChild(inputCantidad);
  
      // Enlace "Actualizar"
      const celdaActualizar = document.createElement("td");
      const enlaceActualizar = document.createElement("a");
      enlaceActualizar.href = "#";
      enlaceActualizar.textContent = "Actualizar";
      enlaceActualizar.style.textDecoration = "underline";
      enlaceActualizar.style.color = "#00264D";
      enlaceActualizar.style.cursor = "pointer";
      enlaceActualizar.style.fontWeight = "bold";
  
      enlaceActualizar.addEventListener("click", e => {
        e.preventDefault();
        const cantidad = inputCantidad.value;
        console.log(`Actualizando "${texto}":`);
        console.log(`Cantidad ingresada: ${cantidad}`);
        alert(`${texto}\nCantidad: ${cantidad}`);
      });
  
      // Navegación con flechas
      inputCantidad.addEventListener("keydown", e => {
        if (e.key === "ArrowDown" && index + 1 < inputsCantidad.length) {
          e.preventDefault();
          inputsCantidad[index + 1].focus();
        }
        if (e.key === "ArrowUp" && index - 1 >= 0) {
          e.preventDefault();
          inputsCantidad[index - 1].focus();
        }
      });
  
      celdaActualizar.appendChild(enlaceActualizar);
      fila.append(celdaDato, celdaCantidad, celdaActualizar);
      cuerpo.appendChild(fila);
    });
  
    // Sidebar hover
    const sidebar = document.getElementById("sidebar");
    document.addEventListener("mousemove", e => {
      const mouseX = e.clientX;
      if (mouseX <= 20) sidebar.classList.add("mostrar");
      else if (mouseX > 250) sidebar.classList.remove("mostrar");
    });
  
    // PDF
    document.getElementById("btnGuardarPDF").addEventListener("click", () => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      doc.text("Datos del Centro de Información", 14, 15);
  
      const filas = document.querySelectorAll("#tablaCuerpo tr");
      const pdfBody = [];
      filas.forEach(fila => {
        const cols = fila.querySelectorAll("td");
        if (cols.length >= 2) {
          const dato = cols[0].innerText.trim();
          const cantidad = cols[1].querySelector("input")
            ? cols[1].querySelector("input").value.trim()
            : cols[1].innerText.trim();
          pdfBody.push([dato, cantidad]);
        }
      });
  
      doc.autoTable({
        head: [["Datos", "Cantidad"]],
        body: pdfBody,
        startY: 25,
        headStyles: { fillColor: [0, 57, 107] },
        styles: { fontSize: 10 }
      });
      doc.save("CentroInformacion.pdf");
    });
  
    // EXCEL
    document.getElementById("btnGuardarExcel").addEventListener("click", () => {
      const filas = document.querySelectorAll("#tablaCuerpo tr");
      const data = [["Datos", "Cantidad"]];
      filas.forEach(fila => {
        const cols = fila.querySelectorAll("td");
        if (cols.length >= 2) {
          const dato = cols[0].innerText.trim();
          const cantidad = cols[1].querySelector("input")
            ? cols[1].querySelector("input").value.trim()
            : cols[1].innerText.trim();
          data.push([dato, cantidad]);
        }
      });
  
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(data);
      ws['!cols'] = [{ wch: 40 }, { wch: 20 }];
      XLSX.utils.book_append_sheet(wb, ws, "CentroInformacion");
      XLSX.writeFile(wb, "CentroInformacion.xlsx");
    });
  
  //
  });
  function mostrarPeriodo() {
    // OCULTAR LA PANTALLA GTIS
    document.getElementById('grisScreen').style.display = 'none';

    // MOSTRAR EL CONTENEDOR DE PERIODO
    document.getElementById('periodo-section').style.display = 'block';

    // MOSTRAR EL CONTENEDOR DE CICLO ESCOLAR
    document.getElementById('cicloEscolar').style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
    const yearSelect = document.getElementById("yearSelect");
    const currentYear = new Date().getFullYear();

    // Generar las opciones de años
    for (let year = 2024; year <= 2050; year++) {
        const option = document.createElement("option");

        // Añadir opciones dependiendo del ciclo (pares y no pares)
        if (year % 2 === 0) {
            option.value = `${year}-${year + 1}`;
            option.textContent = `${year}-${year + 1}`;
        } else {
            option.value = `${year}-${year}`;
            option.textContent = `${year}-${year}`;
        }

        // Marcar el año actual como seleccionado
        if (year <= currentYear && currentYear <= year + 1) {
            option.selected = true;
        }

        yearSelect.appendChild(option);
    }
});
