document.addEventListener("DOMContentLoaded", () => {
  const periodoTexto = document.getElementById('periodoTexto');
  const ciclo = localStorage.getItem('cicloEscolarSeleccionado');
  if (ciclo) {
    const [anioInicio, anioFin] = ciclo.split('-');
    const periodo = `Periodo: Septiembre${anioInicio.slice(-2)}-Febrero${anioFin.slice(-2)}`;
    periodoTexto.textContent = periodo;
  } else {
    periodoTexto.textContent = 'Periodo: SepXX-FebXX';
  }

  const camposFijos = [
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
    "CONSULTAS DOCENTES"
  ];

  const cuerpo = document.getElementById("tablaCuerpo");
  if (!cuerpo) {
    console.error("No se encontró el tbody con id 'tablaCuerpo'");
    return;
  }


  if (!ciclo) {
    cuerpo.innerHTML = `<tr><td colspan="2">Seleccione un ciclo escolar válido.</td></tr>`;
    return;
  }

  fetch(`consultasS.php?ciclo=${ciclo}`)
    .then(res => res.json())
    .then(datos => {
      cuerpo.innerHTML = "";

      if (!Array.isArray(datos) || datos.length === 0) {
        cuerpo.innerHTML = `<tr><td colspan="2">No hay datos para el ciclo escolar seleccionado.</td></tr>`;
        return;
      }

      const cantidadesMap = {};
      datos.forEach(dato => {
        cantidadesMap[dato.campo] = dato.cantidad;
      });

      camposFijos.forEach(campo => {
        const fila = document.createElement("tr");

        const celdaNombre = document.createElement("td");
        celdaNombre.textContent = campo;

        const celdaCantidad = document.createElement("td");
        celdaCantidad.textContent = cantidadesMap[campo] || "0";

        fila.appendChild(celdaNombre);
        fila.appendChild(celdaCantidad);
        cuerpo.appendChild(fila);
      });
    })
    .catch(err => {
      console.error("Error al obtener datos:", err);
      cuerpo.innerHTML = `<tr><td colspan="2">Error al cargar los datos.</td></tr>`;
    });
});
