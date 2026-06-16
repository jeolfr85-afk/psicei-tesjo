window.ED_CONFIG = {
  navKey: 'capacita',
  topbar: 'SICEI — Capacitación docente',
  title: 'Capacitación personal docente',
  subtitle: 'Registro de cursos, diplomados y capacitación del personal docente.',
  breadcrumb: 'Desarrollo Académico / Capacitación docente',
  tag: 'TESJo — Desarrollo Académico',
  storagePrefix: 'sicei_capacita_doc_acad_',
  exportBase: 'Capacitacion_Docente',
  pdfTitle: 'CAPACITACIÓN PERSONAL DOCENTE',
  newButton: 'Nueva capacitación',
  listTabLabel: 'Lista de capacitaciones',
  entityName: 'capacitación',
  migrationPrefixes: ['sicei_capacita_doc_acad_'],
  tableCols: [
    { key: 'participante', label: 'Participante' },
    { key: 'nombreCurso', label: 'Curso' },
    { key: 'institucion', label: 'Institución' },
    { key: 'programa', label: 'Programa' },
    { key: 'estado', label: 'Situación', badge: true }
  ],
  formFields: [
    { key: 'nombreCurso', label: 'Nombre del curso', type: 'text', required: true, full: true },
    { key: 'nombreDiplomado', label: 'Nombre del diplomado', type: 'text' },
    { key: 'institucion', label: 'Institución que lo imparte', type: 'text', required: true },
    { key: 'instructor', label: 'Nombre del instructor', type: 'text' },
    { key: 'duracion', label: 'Duración', type: 'text' },
    { key: 'periodo', label: 'Periodo inicio y término', type: 'text' },
    { key: 'lugar', label: 'Lugar', type: 'text' },
    { key: 'beca', label: 'Beca', type: 'select', options: [{ value: 'Sí', label: 'Sí' }, { value: 'No', label: 'No' }] },
    { key: 'tipoCurso', label: 'Tipo de curso', type: 'text' },
    { key: 'participante', label: 'Nombre del participante', type: 'text', required: true, full: true },
    { key: 'sexo', label: 'Sexo', type: 'select', options: [{ value: 'Hombre', label: 'Hombre' }, { value: 'Mujer', label: 'Mujer' }] },
    { key: 'discapacidad', label: 'Con discapacidad', type: 'select', options: [{ value: 'Sí', label: 'Sí' }, { value: 'No', label: 'No' }] },
    { key: 'hablantesIndigenas', label: 'Hablantes de lenguas indígenas', type: 'select', options: [{ value: 'Sí', label: 'Sí' }, { value: 'No', label: 'No' }] },
    { key: 'programa', label: 'Programa académico', type: 'programas', full: true },
    { key: 'estado', label: 'Situación', type: 'estado' },
    { key: 'observaciones', label: 'Observaciones', type: 'textarea', full: true }
  ],
  filterFields: [
    { key: 'programa', label: 'Programa', type: 'programas' },
    { key: 'estado', label: 'Situación', type: 'estado' }
  ],
  stats(records) {
    const participantes = new Set(records.map((r) => (r.participante || '').toLowerCase()).filter(Boolean));
    const cursos = new Set(records.map((r) => (r.nombreCurso || '').toLowerCase()).filter(Boolean));
    let avanceSemestre = 'Sin iniciar';
    if (records.length > 0 && records.length < 5) avanceSemestre = 'En progreso';
    else if (records.length >= 5) avanceSemestre = 'Avance satisfactorio';
    return { kpi1: participantes.size, kpi2: cursos.size, kpi3: records.length, avanceSemestre };
  },
  chartBar: { title: 'Capacitaciones por institución', groupBy: 'institucion' },
  chartPie: { title: 'Situación de registros', groupBy: 'estado', labels: { pendiente: 'Por realizar', completada: 'Finalizada', revisada: 'Revisada' } },
  resumenRows(records) {
    return [
      ['Participantes capacitados', new Set(records.map((r) => (r.participante || '').toLowerCase()).filter(Boolean)).size],
      ['Cursos / diplomados', new Set(records.map((r) => (r.nombreCurso || '').toLowerCase()).filter(Boolean)).size],
      ['Total de registros', records.length]
    ];
  }
};
