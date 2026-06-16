document.addEventListener('DOMContentLoaded', () => {
  const programas = [
    "Proyecto 1",
    "Proyecto 2",
    "Proyecto 3"
  ];

  const thead = document.getElementById("thead");
  const tbody = document.getElementById("tbody");

  // === ENCABEZADO ===
  thead.innerHTML = "";

  // Título
  const trTitulo = document.createElement("tr");
  const thTitulo = document.createElement("th");
  thTitulo.setAttribute("colspan", "12");
  thTitulo.textContent = "INNOVACIÓN TECNOLÓGICA";
  trTitulo.appendChild(thTitulo);
  thead.appendChild(trTitulo);

  // Encabezados
  const trEncabezado = document.createElement("tr");
  [
    "PROYECTO",
    "SEXO",
    "PROGRAMA ACADÉMICO",
    "NÚMERO DE ASESORES",
    "SEXO",
    "NÚMERO DE ALUMNOS",
    "SEXO",
    "NÚMERO DE JURADOS",
    "ETAPA LOCAL, REGIONAL, NACIONAL",
    "FECHA",
    "RESULTADOS",
    "PROYECTO QUE PARTICIPA EN EL ENIT"
  ].forEach(text => {
    const th = document.createElement("th");
    th.textContent = text;
    trEncabezado.appendChild(th);
  });
  thead.appendChild(trEncabezado);

  // === FILAS POR PROGRAMA ===
  programas.forEach(programa => {
    ["HOMBRES", "MUJERES"].forEach((sexo, index) => {
      const tr = document.createElement("tr");

      // PROYECTO (solo en primera fila, rowspan=2)
      if (index === 0) {
        const tdProyecto = document.createElement("td");
        tdProyecto.textContent = programa;
        tdProyecto.rowSpan = 2;
        tr.appendChild(tdProyecto);
      }

      // SEXO (fijo: HOMBRES o MUJERES)
      const tdSexo = document.createElement("td");
      tdSexo.textContent = sexo;
      tr.appendChild(tdSexo);

      // PROGRAMA ACADÉMICO (solo en primera fila, rowspan=2)
      if (index === 0) {
        const tdPrograma = document.createElement("td");
        tdPrograma.rowSpan = 2;
        const input = document.createElement("input");
        input.type = "text";
        tdPrograma.appendChild(input);
        tr.appendChild(tdPrograma);
      }

      // NÚMERO DE ASESORES (solo en primera fila, rowspan=2)
      if (index === 0) {
        const tdAsesores = document.createElement("td");
        tdAsesores.rowSpan = 2;
        const input = document.createElement("input");
        input.type = "number";
        input.min = "0";
        tdAsesores.appendChild(input);
        tr.appendChild(tdAsesores);
      }

      // SEXO ASESORES (HOMBRES/MUJERES con input)
      const tdSexoAsesores = document.createElement("td");
      const inputAsesor = document.createElement("input");
      inputAsesor.type = "number";
      inputAsesor.min = "0";
      tdSexoAsesores.appendChild(inputAsesor);
      tr.appendChild(tdSexoAsesores);

      // NÚMERO DE ALUMNOS (solo en primera fila, rowspan=2)
      if (index === 0) {
        const tdAlumnos = document.createElement("td");
        tdAlumnos.rowSpan = 2;
        const input = document.createElement("input");
        input.type = "number";
        input.min = "0";
        tdAlumnos.appendChild(input);
        tr.appendChild(tdAlumnos);
      }

      // SEXO ALUMNOS (HOMBRES/MUJERES con input)
      const tdSexoAlumnos = document.createElement("td");
      const inputAlumno = document.createElement("input");
      inputAlumno.type = "number";
      inputAlumno.min = "0";
      tdSexoAlumnos.appendChild(inputAlumno);
      tr.appendChild(tdSexoAlumnos);

      // NÚMERO DE JURADOS (solo en primera fila, rowspan=2)
      if (index === 0) {
        const tdJurados = document.createElement("td");
        tdJurados.rowSpan = 2;
        const input = document.createElement("input");
        input.type = "number";
        input.min = "0";
        tdJurados.appendChild(input);
        tr.appendChild(tdJurados);
      }

      // SEXO JURADOS (HOMBRES/MUJERES con input)
      const tdSexoJurados = document.createElement("td");
      const inputJurado = document.createElement("input");
      inputJurado.type = "number";
      inputJurado.min = "0";
      tdSexoJurados.appendChild(inputJurado);
      tr.appendChild(tdSexoJurados);

      // ETAPA (solo en primera fila, rowspan=2)
      if (index === 0) {
        const tdEtapa = document.createElement("td");
        tdEtapa.rowSpan = 2;
        const select = document.createElement("select");
        ["Local", "Regional", "Nacional"].forEach(op => {
          const option = document.createElement("option");
          option.value = op;
          option.textContent = op;
          select.appendChild(option);
        });
        tdEtapa.appendChild(select);
        tr.appendChild(tdEtapa);
      }

      // FECHA (solo en primera fila, rowspan=2)
      if (index === 0) {
        const tdFecha = document.createElement("td");
        tdFecha.rowSpan = 2;
        const input = document.createElement("input");
        input.type = "date";
        tdFecha.appendChild(input);
        tr.appendChild(tdFecha);
      }

      // RESULTADOS (solo en primera fila, rowspan=2)
      if (index === 0) {
        const tdResultados = document.createElement("td");
        tdResultados.rowSpan = 2;
        const input = document.createElement("input");
        input.type = "text";
        tdResultados.appendChild(input);
        tr.appendChild(tdResultados);
      }

      // ENIT (solo en primera fila, rowspan=2)
      if (index === 0) {
        const tdENIT = document.createElement("td");
        tdENIT.rowSpan = 2;
        const select = document.createElement("select");
        ["SI", "NO"].forEach(op => {
          const option = document.createElement("option");
          option.value = op;
          option.textContent = op;
          select.appendChild(option);
        });
        tdENIT.appendChild(select);
        tr.appendChild(tdENIT);
      }

      tbody.appendChild(tr);
    });
  });
});
