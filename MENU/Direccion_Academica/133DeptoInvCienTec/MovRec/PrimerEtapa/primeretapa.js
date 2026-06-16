document.addEventListener('DOMContentLoaded', () => {
  const programas = [
    "", "", "", "", ""
  ];

  const thead = document.getElementById("thead");
  const tbody = document.getElementById("tbody");
  thead.innerHTML = '';

  // Título principal
  const trTitulo = document.createElement('tr');
  const thTitulo = document.createElement('th');
  thTitulo.setAttribute('colspan', '11'); // 8 datos estudiante + 2 movilidad
  thTitulo.textContent = 'ESTUDIANTES QUE LA INSTITUCIÓN ENVIÓ A OTRA ENTIDAD O PAÍS';
  trTitulo.appendChild(thTitulo);
  thead.appendChild(trTitulo);

  // Fila de encabezados principales
  const filaPrincipal = document.createElement("tr");

  const thDatos = document.createElement("th");
  thDatos.textContent = "";
  thDatos.colSpan = 9;
  filaPrincipal.appendChild(thDatos);

  const thMovilidad = document.createElement("th");
  thMovilidad.textContent = "TIPO DE MOVILIDAD";
  thMovilidad.colSpan = 2;
  filaPrincipal.appendChild(thMovilidad);

  thead.appendChild(filaPrincipal);

  // Fila de subencabezados
  const filaSub = document.createElement("tr");

  [
    "NUM. CONTROL",
    "NOMBRE",
    "SEXO",
    "PROGRAMA ACADÉMICO",
    "GRADO DE AVANCE",
    "DESTINO",
    "PROGRAMA/BECA",
    "CON FINANCIAMIENTO",
    "PERIODO"
  ].forEach(texto => {
    const th = document.createElement("th");
    th.textContent = texto;
    filaSub.appendChild(th);
  });

  ["CURSO CON VALOR CURRICULAR", "CURSO SIN VALOR CURRICULAR"].forEach(texto => {
    const th = document.createElement("th");
    th.textContent = texto;
    filaSub.appendChild(th);
  });

  thead.appendChild(filaSub);

  // Cuerpo de la tabla
  programas.forEach(() => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><input type="text" class="editable-text num-control"></td>
      <td><input type="text" class="editable-text nombre"></td>
      <td><input type="text" class="editable-text sexo"></td>
      <td><input type="text" class="editable-text programa"></td>
      <td><input type="text" class="editable-text programa"></td>
      <td><input type="text" class="editable-text grado"></td>
      <td><input type="text" class="editable-text destino"></td>
      <td><input type="text" class="editable-text financiamiento"></td>
      <td><input type="text" class="editable-text periodo"></td>
      <td><input type="number" class="editable-text curso-v" min="0"></td>
      <td><input type="number" class="editable-text curso-sv" min="0"></td>
    `;
    tbody.appendChild(tr);
  })

  // Mostrar periodo (texto superior)
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

// Sidebar toggle
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggleSidebar');
toggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('collapsed');
  toggleBtn.textContent = sidebar.classList.contains('collapsed') ? '⯈' : '⯇';
});
