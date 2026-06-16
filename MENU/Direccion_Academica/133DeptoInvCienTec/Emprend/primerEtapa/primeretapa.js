document.addEventListener("DOMContentLoaded", () => {
  const tabla = document.getElementById("tablaTalleres");

  // === Fila 1 encabezado principal ===
  const header1 = tabla.insertRow();
  header1.innerHTML = `
    <th rowspan="3">PROYECTO</th>
    <th rowspan="3">PROGRAMA ACADÉMICO</th>
    <th colspan="6">INNOVACIÓN TECNOLÓGICA</th>
    <th rowspan="3">ETAPA<br>(LOCAL, REGIONAL, NACIONAL)</th>
    <th rowspan="3">FECHA</th>
    <th rowspan="3">RESULTADOS</th>
    <th rowspan="3">SEXO</th>
  `;

  // === Fila 2 subencabezados ===
  const header2 = tabla.insertRow();
  header2.innerHTML = `
    <th colspan="2">NÚMERO DE ASESORES</th>
    <th colspan="2">NÚMERO DE ALUMNOS</th>
    <th colspan="2">NÚMERO DE JURADOS</th>
  `;

  // === Fila 3 hombres/mujeres ===
  const header3 = tabla.insertRow();
  header3.innerHTML = `
    <th>HOMBRES</th>
    <th>MUJERES</th>
    <th>HOMBRES</th>
    <th>MUJERES</th>
    <th>HOMBRES</th>
    <th>MUJERES</th>
  `;

  // === Filas dinámicas de ejemplo ===
  const proyectos = ["Proyecto 1", "Proyecto 2", "Proyecto 3"];
  const programas = ["Programa A", "Programa B", "Programa C"];

  proyectos.forEach((proyecto, index) => {
    // Hombres
    const filaH = tabla.insertRow();
    filaH.innerHTML = `
      <td rowspan="2">${proyecto}</td>
      <td rowspan="2">${programas[index]}</td>
      <td><input type="number" min="0"></td>
      <td></td>
      <td><input type="number" min="0"></td>
      <td></td>
      <td><input type="number" min="0"></td>
      <td></td>
      <td rowspan="2"><input type="text"></td>
      <td rowspan="2"><input type="date"></td>
      <td rowspan="2"><input type="text"></td>
      <td>HOMBRES</td>
    `;

    // Mujeres
    const filaM = tabla.insertRow();
    filaM.innerHTML = `
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td>MUJERES</td>
    `;
  });
});
