/** Navegación compartida — Departamento de Desarrollo Académico */
window.DESACAD_NAV = {
  base: '/prueba/prueba/MENU/Direccion_Academica/131DeptoDesAcad',
  inicio: '/prueba/prueba/MENU/inicio.php',
  items: [
    { key: 'evaluacion', href: '/prueba/prueba/MENU/Direccion_Academica/131DeptoDesAcad/EvaluacionD/PrimerEtapa/PrimerEtapa.html', icon: 'bi-clipboard-data', label: 'Evaluación Docente' },
    { key: 'alumnos', href: '/prueba/prueba/MENU/Direccion_Academica/131DeptoDesAcad/AlumnosEventos/PrimerEtapa/PrimerEtapa.html', icon: 'bi-calendar-event', label: 'Alumnos en eventos académicos' },
    { key: 'capacita', href: '/prueba/prueba/MENU/Direccion_Academica/131DeptoDesAcad/CapacitaDoc/PrimerEtapa/PrimerEtapa.html', icon: 'bi-mortarboard', label: 'Capacitación personal docente' }
  ],
  render(activeKey) {
    const dept = `${this.base}/index.php`;
    let html = `<a href="${this.inicio}" class="ed-aside__link"><i class="bi bi-house-door"></i><span>Inicio</span></a>`;
    html += `<a href="${dept}" class="ed-aside__link"><i class="bi bi-building"></i><span>Desarrollo Académico</span></a>`;
    this.items.forEach((it) => {
      html += `<a href="${it.href}" class="ed-aside__link${it.key === activeKey ? ' is-active' : ''}"><i class="bi ${it.icon}"></i><span>${it.label}</span></a>`;
    });
    return html;
  }
};
