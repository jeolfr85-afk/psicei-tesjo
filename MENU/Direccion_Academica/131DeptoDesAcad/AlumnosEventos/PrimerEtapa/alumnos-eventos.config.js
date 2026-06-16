window.ED_CONFIG = {
  navKey: 'alumnos',
  topbar: 'SICEI — Alumnos en eventos académicos',
  title: 'Alumnos en eventos académicos',
  subtitle: 'Registro de participación estudiantil en eventos académicos por programa.',
  breadcrumb: 'Desarrollo Académico / Alumnos en eventos académicos',
  tag: 'TESJo — Desarrollo Académico',
  storagePrefix: 'sicei_alumnos_eventos_',
  exportBase: 'Alumnos_Eventos',
  pdfTitle: 'ALUMNOS EN EVENTOS ACADÉMICOS',
  newButton: 'Nuevo registro',
  listTabLabel: 'Lista de registros',
  entityName: 'registro',
  migrationPrefixes: ['sicei_alumnos_eventos_'],
  tableCols: [
    { key: 'nombre', label: 'Alumno' },
    { key: 'programa', label: 'Programa académico' },
    { key: 'sexo', label: 'Sexo' },
    { key: 'etapa', label: 'Etapa' },
    { key: 'estado', label: 'Situación', badge: true }
  ],
  formFields: [
    { key: 'programa', label: 'Programa académico', type: 'programas', required: true, full: true },
    { key: 'nombre', label: 'Nombre del alumno', type: 'text', required: true, full: true },
    { key: 'sexo', label: 'Sexo', type: 'select', options: [{ value: 'Hombre', label: 'Hombre' }, { value: 'Mujer', label: 'Mujer' }] },
    { key: 'areaConocimiento', label: 'Área de conocimiento', type: 'text' },
    { key: 'etapa', label: 'Etapa', type: 'text' },
    { key: 'fecha', label: 'Fecha del evento', type: 'date' },
    { key: 'resultados', label: 'Resultados', type: 'text', full: true },
    { key: 'estado', label: 'Situación', type: 'estado' },
    { key: 'observaciones', label: 'Observaciones', type: 'textarea', full: true }
  ],
  filterFields: [
    { key: 'programa', label: 'Programa', type: 'programas' },
    { key: 'estado', label: 'Situación', type: 'estado' },
    { key: 'sexo', label: 'Sexo', type: 'select', options: [{ value: 'Hombre', label: 'Hombre' }, { value: 'Mujer', label: 'Mujer' }] }
  ],
  stats(records) {
    const programas = new Set(records.map((r) => r.programa).filter(Boolean));
    const alumnos = new Set(records.map((r) => (r.nombre || '').toLowerCase()).filter(Boolean));
    const pct = programas.size ? Math.min(100, Math.round((records.length / Math.max(programas.size, 1)) * 10)) : 0;
    let avanceSemestre = 'Sin iniciar';
    if (records.length > 0 && pct < 50) avanceSemestre = 'En progreso';
    else if (records.length >= 5) avanceSemestre = 'Avance satisfactorio';
    else if (records.length > 0) avanceSemestre = 'Iniciado';
    return { kpi1: alumnos.size, kpi2: records.length, kpi3: programas.size, avanceSemestre };
  },
  chartBar: { title: 'Registros por programa', groupBy: 'programa' },
  chartPie: { title: 'Participación por sexo', groupBy: 'sexo' },
  resumenRows(records) {
    const programas = new Set(records.map((r) => r.programa).filter(Boolean));
    return [
      ['Alumnos registrados', new Set(records.map((r) => (r.nombre || '').toLowerCase()).filter(Boolean)).size],
      ['Total de registros', records.length],
      ['Programas con participación', programas.size]
    ];
  }
};
