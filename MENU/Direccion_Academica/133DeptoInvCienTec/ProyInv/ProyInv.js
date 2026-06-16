function mostrarPeriodo() {
  document.getElementById('grisScreen').style.display = 'none';
  document.getElementById('cicloEscolarWrapper').style.display = 'flex';
  document.getElementById('periodo-section').style.display = 'block';

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });

  const yearSelect = document.getElementById("yearSelect");

  if (yearSelect.options.length === 0) {
    const currentYear = new Date().getFullYear();

    for (let year = 2024; year <= 2050; year++) {
      const nextYear = year + 1;
      const option = document.createElement("option");
      option.value = `${year}-${nextYear}`;
      option.textContent = `${year}-${nextYear}`;

      if (year <= currentYear && currentYear < nextYear) {
        option.selected = true;
      }

      yearSelect.appendChild(option);
    }
  }
}

function guardarCicloYRedirigir(ruta) {
  const cicloSeleccionado = document.getElementById("yearSelect").value;
  const periodoSeleccionado = ruta.includes("segEtapa") ? "Febrero - Agosto" : "Septiembre - Febrero";

  localStorage.setItem("cicloEscolarSeleccionado", cicloSeleccionado);

  const [añoInicio, añoFin] = cicloSeleccionado.split("-").map(Number);
  let periodoFormato;

  if (periodoSeleccionado === "Septiembre - Febrero") {
    periodoFormato = `Sep${añoInicio.toString().slice(-2)}-Feb${añoFin.toString().slice(-2)}`;
  } else {
    periodoFormato = `Feb${(añoInicio + 1).toString().slice(-2)}-Ago${(añoFin + 1).toString().slice(-2)}`;
  }

  localStorage.setItem("periodoSeleccionado", periodoFormato);
  window.location.href = ruta;
}
// --- JS para toggle sidebar ---
const toggleBtn = document.querySelector('.toggle-sidebar-btn');
const sidebar = document.querySelector('.sidebar');

toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('hidden');
});