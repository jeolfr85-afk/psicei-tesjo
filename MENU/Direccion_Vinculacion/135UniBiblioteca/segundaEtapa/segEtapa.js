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
  ];

  const cuerpo = document.getElementById("tablaCuerpo");
  const inputsCantidad = [];

  // Generar filas
  campos.forEach((texto, index) => {
    const fila = document.createElement("tr");

    const celdaDato = document.createElement("td");
    celdaDato.textContent = texto;

    const celdaCantidad = document.createElement("td");
    const inputCantidad = document.createElement("input");
    inputCantidad.type = "number";
    inputCantidad.placeholder = "Ingrese cantidad";
    inputsCantidad.push(inputCantidad);
    celdaCantidad.appendChild(inputCantidad);

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
      alert(`${texto}\nCantidad: ${cantidad}`);
    });

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

  // Mostrar el periodo según el ciclo escolar seleccionado
  const periodoTexto = document.getElementById('periodoTexto');
  const ciclo = localStorage.getItem('cicloEscolarSeleccionado');
  if (ciclo) {
    const [anioInicio, anioFin] = ciclo.split('-');
    const periodo = `Periodo: Febrero${anioInicio.slice(-2)}-Agosto${anioFin.slice(-2)}`;
    periodoTexto.textContent = periodo;
  } else {
    periodoTexto.textContent = 'Periodo: FebXX-FebXX';
  }

  // GUARDAR 
  document.getElementById("btnGuardarBD").addEventListener("click", () => {
    const filas = document.querySelectorAll("#tablaCuerpo tr");
    const datos = [];

    filas.forEach(fila => {
      const celdas = fila.querySelectorAll("td");
      const campo = celdas[0].innerText.trim();
      const input = celdas[1].querySelector("input");
      const cantidad = input ? input.value.trim() : "0";
      datos.push({ campo, cantidad });
    });

    console.log("Enviando datos:", datos); // Verifica si se activa

    fetch("/prueba/prueba/MENU/Direccion_Vinculacion/135UniBiblioteca/segundaEtapa/guardarDS.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(datos)
    })
    .then(res => res.json())
    .then(respuesta => {
      console.log("Respuesta del servidor:", respuesta);
      if (respuesta.estado === "ok") {
        alert("Datos guardados correctamente.");
      } else {
        alert("Error al guardar los datos: " + respuesta.mensaje);
      }
    })
    .catch(err => {
      console.error("Error al enviar datos:", err);
      alert("No se pudo conectar con el servidor.");
    });
  });
document.getElementById("btnCancelar").addEventListener("click", () => {
  const inputs = document.querySelectorAll("#tablaCuerpo input");
  inputs.forEach(input => input.value = "");
});

});
