/**
 * Configuraciones por módulo SICEI
 * Cada módulo define campos, navegación, KPIs, gráficas y almacenamiento.
 */
(function () {
  'use strict';

  const BASE = '/prueba/prueba/MENU';
  const INICIO = `${BASE}/inicio.php`;
  const LOGO = '/prueba/prueba/MENU/images/enkabezado.png';

  const ESTADO_OPTS = [
    { value: 'pendiente', label: 'Por realizar' },
    { value: 'completada', label: 'Finalizada' },
    { value: 'revisada', label: 'Revisada' }
  ];

  const SEXO_OPTS = [
    { value: 'Hombre', label: 'Hombre' },
    { value: 'Mujer', label: 'Mujer' }
  ];

  const SI_NO = [
    { value: 'Sí', label: 'Sí' },
    { value: 'No', label: 'No' }
  ];

  function nav(deptoHref, deptoLabel, moduleLabel, moduleIcon) {
    return [
      { href: INICIO, icon: 'bi-house-door', label: 'Inicio' },
      { href: deptoHref, icon: 'bi-building', label: deptoLabel },
      { href: '#', icon: moduleIcon, label: moduleLabel, active: true }
    ];
  }

  const CAMPOS_CAPACITACION = [
    { key: 'nombreCurso', label: 'Nombre del curso', type: 'text', required: true, table: true, search: true },
    { key: 'nombreDiplomado', label: 'Nombre del diplomado', type: 'text', table: true },
    { key: 'institucion', label: 'Institución que lo imparte', type: 'text', table: true, search: true },
    { key: 'instructor', label: 'Nombre del instructor', type: 'text', table: true, search: true },
    { key: 'duracion', label: 'Duración', type: 'text' },
    { key: 'periodo', label: 'Periodo inicio y término', type: 'text' },
    { key: 'lugar', label: 'Lugar', type: 'text' },
    { key: 'beca', label: 'Beca', type: 'select', options: SI_NO },
    { key: 'tipoCurso', label: 'Tipo de curso', type: 'text', filter: true },
    { key: 'participante', label: 'Nombre del participante', type: 'text', required: true, table: true, search: true },
    { key: 'sexo', label: 'Sexo', type: 'select', options: SEXO_OPTS, table: true, filter: true },
    { key: 'discapacidad', label: 'Con discapacidad', type: 'select', options: SI_NO },
    { key: 'hablantesIndigenas', label: 'Hablantes de lenguas indígenas', type: 'select', options: SI_NO },
    { key: 'programa', label: 'Programa académico', type: 'programas', table: true, filter: true, full: true },
    { key: 'estado', label: 'Situación', type: 'estado', table: true, filter: true },
    { key: 'observaciones', label: 'Observaciones', type: 'textarea', full: true }
  ];

  const KPI_DEFAULT = [
    { id: 'total', label: 'Registros totales', icon: 'blue', bi: 'bi-journal-text', calc: (r) => r.length },
    { id: 'participantes', label: 'Participantes', icon: 'green', bi: 'bi-people-fill', calc: (r) => new Set(r.map((x) => (x.participante || x.nombre || x.docente || x.nombreDocente || x.investigador || x.nombreProyecto || '').toLowerCase()).filter(Boolean)).size },
    { id: 'programas', label: 'Programas', icon: 'purple', bi: 'bi-journal-bookmark-fill', calc: (r) => new Set(r.map((x) => x.programa).filter(Boolean)).size },
    { id: 'avance', label: 'Avance del semestre', icon: 'orange', bi: 'bi-activity', calc: (r, ctx) => ctx.avanceSemestre, isText: true }
  ];

  const CHARTS_DEFAULT = [
    { id: 'chartBar', type: 'bar', title: 'Registros por programa', groupBy: 'programa', limit: 8 },
    { id: 'chartPie', type: 'doughnut', title: 'Situación de los registros', groupBy: 'estado', labels: { pendiente: 'Por realizar', completada: 'Finalizada', revisada: 'Revisada' } }
  ];

  function cfg(o) {
    return Object.assign({
      logo: LOGO,
      recordLabel: 'registro',
      recordLabelPlural: 'registros',
      newButton: 'Nuevo registro',
      kpis: KPI_DEFAULT,
      charts: CHARTS_DEFAULT,
      showResumen: true,
      apiSave: null
    }, o);
  }

  window.SICEI_CONFIGS = {
    'alumnos-eventos': cfg({
      theme: 'academico',
      title: 'Alumnos en eventos académicos',
      subtitle: 'Registro de participación estudiantil en eventos académicos por programa.',
      topbar: 'SICEI — Alumnos en eventos académicos',
      tag: 'TESJo — Desarrollo Académico',
      breadcrumb: 'Desarrollo Académico / Alumnos en eventos académicos',
      storagePrefix: 'sicei_alumnos_eventos_',
      exportBase: 'Alumnos_Eventos',
      nav: nav(`${BASE}/Direccion_Academica/131DeptoDesAcad/131DeptoDesAcad.html`, 'Desarrollo Académico', 'Alumnos en eventos', 'bi-calendar-event'),
      fields: [
        { key: 'programa', label: 'Programa académico', type: 'programas', required: true, table: true, filter: true, full: true },
        { key: 'nombre', label: 'Nombre del alumno', type: 'text', required: true, table: true, search: true },
        { key: 'sexo', label: 'Sexo', type: 'select', options: SEXO_OPTS, table: true, filter: true },
        { key: 'areaConocimiento', label: 'Área de conocimiento', type: 'text', table: true, search: true },
        { key: 'etapa', label: 'Etapa', type: 'text', table: true },
        { key: 'fecha', label: 'Fecha del evento', type: 'date', table: true },
        { key: 'resultados', label: 'Resultados', type: 'text', table: true },
        { key: 'observaciones', label: 'Observaciones', type: 'textarea', full: true },
        { key: 'estado', label: 'Situación', type: 'estado', table: true, filter: true }
      ],
      charts: [
        { id: 'chartBar', type: 'bar', title: 'Participantes por programa', groupBy: 'programa', limit: 8 },
        { id: 'chartPie', type: 'doughnut', title: 'Participación por sexo', groupBy: 'sexo' }
      ]
    }),

    'capacita-doc-acad': cfg({
      theme: 'academico',
      title: 'Capacitación personal docente',
      subtitle: 'Registro de cursos, diplomados y capacitación del personal docente.',
      topbar: 'SICEI — Capacitación docente',
      tag: 'TESJo — Desarrollo Académico',
      breadcrumb: 'Desarrollo Académico / Capacitación docente',
      storagePrefix: 'sicei_capacita_doc_acad_',
      exportBase: 'Capacitacion_Docente_Acad',
      nav: nav(`${BASE}/Direccion_Academica/131DeptoDesAcad/131DeptoDesAcad.html`, 'Desarrollo Académico', 'Capacitación docente', 'bi-mortarboard'),
      fields: CAMPOS_CAPACITACION,
      newButton: 'Nueva capacitación'
    }),

    'tele-hardware': cfg({
      theme: 'computo',
      title: 'Telecomunicaciones de hardware',
      subtitle: 'Inventario de equipos, servidores y hardware de telecomunicaciones.',
      topbar: 'SICEI — Telecomunicaciones hardware',
      tag: 'TESJo — Centro de Cómputo',
      breadcrumb: 'Centro de Cómputo / Telecomunicaciones hardware',
      storagePrefix: 'sicei_tele_hardware_',
      exportBase: 'Tele_Hardware',
      nav: nav(`${BASE}/Direccion_Academica/132DeptoCenComp/132DeptoCenComp.html`, 'Centro de Cómputo', 'Telecom. hardware', 'bi-hdd-network'),
      fields: [
        { key: 'sede', label: 'Sede', type: 'select', options: [{ value: 'TES Jocotitlán', label: 'TES Jocotitlán' }, { value: 'Extensión Aculco', label: 'Extensión Aculco' }], required: true, table: true, filter: true },
        { key: 'marca', label: 'Marca', type: 'text', required: true, table: true, search: true },
        { key: 'modelo', label: 'Modelo', type: 'text', table: true, search: true },
        { key: 'plataforma', label: 'Plataforma', type: 'text', table: true },
        { key: 'arquitectura', label: 'Arquitectura', type: 'text' },
        { key: 'procesador', label: 'Procesador', type: 'text' },
        { key: 'memoria', label: 'Capacidad memoria', type: 'text', table: true },
        { key: 'disco', label: 'Capacidad disco duro', type: 'text' },
        { key: 'monitor', label: 'Monitor', type: 'text' },
        { key: 'cache', label: 'Capacidad caché', type: 'text' },
        { key: 'tipoServidor', label: 'Tipo de servidor', type: 'text', table: true, filter: true },
        { key: 'tarjetaRed', label: 'Tarjeta de red', type: 'text' },
        { key: 'tarjetaSonido', label: 'Tarjeta de sonido', type: 'text' },
        { key: 'tarjetaVideo', label: 'Tarjeta de video', type: 'text' },
        { key: 'raton', label: 'Cuenta con ratón', type: 'select', options: SI_NO },
        { key: 'teclado', label: 'Cuenta con teclado', type: 'select', options: SI_NO },
        { key: 'estado', label: 'Situación', type: 'estado', table: true, filter: true },
        { key: 'observaciones', label: 'Observaciones', type: 'textarea', full: true }
      ],
      charts: [
        { id: 'chartBar', type: 'bar', title: 'Equipos por sede', groupBy: 'sede' },
        { id: 'chartPie', type: 'doughnut', title: 'Por tipo de servidor', groupBy: 'tipoServidor' }
      ],
      kpis: [
        { id: 'total', label: 'Equipos registrados', icon: 'blue', bi: 'bi-hdd-stack', calc: (r) => r.length },
        { id: 'sedes', label: 'Sedes', icon: 'green', bi: 'bi-geo-alt', calc: (r) => new Set(r.map((x) => x.sede).filter(Boolean)).size },
        { id: 'servidores', label: 'Tipos de servidor', icon: 'purple', bi: 'bi-server', calc: (r) => new Set(r.map((x) => x.tipoServidor).filter(Boolean)).size },
        { id: 'avance', label: 'Avance del semestre', icon: 'orange', bi: 'bi-activity', calc: (r, ctx) => ctx.avanceSemestre, isText: true }
      ]
    }),

    'tele-software': cfg({
      theme: 'computo',
      title: 'Telecomunicaciones de software',
      subtitle: 'Licencias de software usado y desarrollado por la institución.',
      topbar: 'SICEI — Telecomunicaciones software',
      tag: 'TESJo — Centro de Cómputo',
      breadcrumb: 'Centro de Cómputo / Telecomunicaciones software',
      storagePrefix: 'sicei_tele_software_',
      exportBase: 'Tele_Software',
      nav: nav(`${BASE}/Direccion_Academica/132DeptoCenComp/132DeptoCenComp.html`, 'Centro de Cómputo', 'Telecom. software', 'bi-window-stack'),
      fields: [
        { key: 'sede', label: 'Sede', type: 'select', options: [{ value: 'TES Jocotitlán', label: 'TES Jocotitlán' }, { value: 'Extensión Aculco', label: 'Extensión Aculco' }], required: true, table: true, filter: true },
        { key: 'tipoSoftware', label: 'Tipo', type: 'select', options: [{ value: 'Usado', label: 'Software usado' }, { value: 'Desarrollado', label: 'Software desarrollado' }], table: true, filter: true },
        { key: 'nombre', label: 'Nombre del software', type: 'text', required: true, table: true, search: true },
        { key: 'categoria', label: 'Categoría', type: 'text', table: true, filter: true },
        { key: 'licencias', label: 'Número de licencias', type: 'number', table: true },
        { key: 'estado', label: 'Situación', type: 'estado', table: true, filter: true },
        { key: 'observaciones', label: 'Observaciones', type: 'textarea', full: true }
      ],
      charts: [
        { id: 'chartBar', type: 'bar', title: 'Licencias por categoría', groupBy: 'categoria', aggregate: 'sum', field: 'licencias' },
        { id: 'chartPie', type: 'doughnut', title: 'Usado vs desarrollado', groupBy: 'tipoSoftware' }
      ]
    }),

    'recursos-info': cfg({
      theme: 'computo',
      title: 'Recursos informáticos',
      subtitle: 'Control de recursos informáticos institucionales por área y ubicación.',
      topbar: 'SICEI — Recursos informáticos',
      tag: 'TESJo — Centro de Cómputo',
      breadcrumb: 'Centro de Cómputo / Recursos informáticos',
      storagePrefix: 'sicei_recursos_info_',
      exportBase: 'Recursos_Informaticos',
      nav: nav(`${BASE}/Direccion_Academica/132DeptoCenComp/132DeptoCenComp.html`, 'Centro de Cómputo', 'Recursos informáticos', 'bi-pc-display'),
      fields: [
        { key: 'recurso', label: 'Recurso / equipo', type: 'text', required: true, table: true, search: true },
        { key: 'tipo', label: 'Tipo de recurso', type: 'select', options: [{ value: 'Hardware', label: 'Hardware' }, { value: 'Software', label: 'Software' }, { value: 'Red', label: 'Red' }, { value: 'Otro', label: 'Otro' }], table: true, filter: true },
        { key: 'cantidad', label: 'Cantidad', type: 'number', table: true },
        { key: 'ubicacion', label: 'Ubicación', type: 'text', table: true, filter: true },
        { key: 'area', label: 'Área responsable', type: 'text', table: true },
        { key: 'estado', label: 'Situación', type: 'estado', table: true, filter: true },
        { key: 'observaciones', label: 'Observaciones', type: 'textarea', full: true }
      ]
    }),

    'proy-investigacion': cfg({
      theme: 'investigacion',
      title: 'Proyecto de investigación',
      subtitle: 'Seguimiento de proyectos de investigación institucional.',
      topbar: 'SICEI — Proyectos de investigación',
      tag: 'TESJo — Investigación',
      breadcrumb: 'Investigación / Proyectos de investigación',
      storagePrefix: 'sicei_proy_investigacion_',
      exportBase: 'Proyectos_Investigacion',
      nav: nav(`${BASE}/Direccion_Academica/133DeptoInvCienTec/133DeptoInvCienTec.html`, 'Investigación', 'Proyectos', 'bi-lightbulb'),
      apiSave: { module: 'Proyecto de investigación', url: '/prueba/prueba/API/records.php' },
      fields: [
        { key: 'nombreProyecto', label: 'Nombre del proyecto', type: 'text', required: true, table: true, search: true, full: true },
        { key: 'investigador', label: 'Investigador responsable', type: 'text', required: true, table: true, search: true },
        { key: 'programa', label: 'Programa académico', type: 'programas', table: true, filter: true, full: true },
        { key: 'linea', label: 'Línea de investigación', type: 'text', table: true },
        { key: 'periodo', label: 'Periodo / vigencia', type: 'text', table: true },
        { key: 'estadoProyecto', label: 'Estado del proyecto', type: 'select', options: [{ value: 'En formulación', label: 'En formulación' }, { value: 'En curso', label: 'En curso' }, { value: 'Concluido', label: 'Concluido' }, { value: 'Suspendido', label: 'Suspendido' }], table: true, filter: true },
        { key: 'financiamiento', label: 'Financiamiento / fuente', type: 'text', table: true },
        { key: 'estado', label: 'Situación del registro', type: 'estado', table: true, filter: true },
        { key: 'observaciones', label: 'Observaciones', type: 'textarea', full: true }
      ],
      charts: [
        { id: 'chartBar', type: 'bar', title: 'Proyectos por programa', groupBy: 'programa', limit: 8 },
        { id: 'chartPie', type: 'doughnut', title: 'Estado de proyectos', groupBy: 'estadoProyecto' }
      ]
    }),

    'plantilla-inv': cfg({
      theme: 'investigacion',
      title: 'Plantilla de investigadores S20-F21',
      subtitle: 'Registro de docentes-investigadores y horas asignadas a la investigación.',
      topbar: 'SICEI — Plantilla investigadores',
      tag: 'TESJo — Investigación',
      breadcrumb: 'Investigación / Plantilla de investigadores',
      storagePrefix: 'sicei_plantilla_inv_',
      exportBase: 'Plantilla_Investigadores',
      nav: nav(`${BASE}/Direccion_Academica/133DeptoInvCienTec/133DeptoInvCienTec.html`, 'Investigación', 'Plantilla S20-F21', 'bi-person-badge'),
      fields: [
        { key: 'nombre', label: 'Nombre del docente-investigador', type: 'text', required: true, table: true, search: true, full: true },
        { key: 'sistemaInvestigacion', label: 'Sistema de investigación (SNI, etc.)', type: 'text', table: true, filter: true },
        { key: 'programa', label: 'Programa académico', type: 'programas', table: true, filter: true, full: true },
        { key: 'horasInvestigacion', label: 'Horas asignadas a investigación', type: 'number', table: true },
        { key: 'estado', label: 'Situación', type: 'estado', table: true, filter: true },
        { key: 'observaciones', label: 'Observaciones', type: 'textarea', full: true }
      ]
    }),

    'snii': cfg({
      theme: 'investigacion',
      title: 'S20-F21 SNII',
      subtitle: 'Información de docentes e investigadores del Sistema Nacional de Investigadores.',
      topbar: 'SICEI — SNII',
      tag: 'TESJo — Investigación',
      breadcrumb: 'Investigación / SNII',
      storagePrefix: 'sicei_snii_',
      exportBase: 'SNII',
      nav: nav(`${BASE}/Direccion_Academica/133DeptoInvCienTec/133DeptoInvCienTec.html`, 'Investigación', 'SNII', 'bi-award'),
      fields: [
        { key: 'nombreDocente', label: 'Nombre del docente', type: 'text', required: true, table: true, search: true },
        { key: 'sexo', label: 'Sexo', type: 'select', options: [{ value: 'Femenino', label: 'Femenino' }, { value: 'Masculino', label: 'Masculino' }], table: true, filter: true },
        { key: 'nivelEstudios', label: 'Nivel de estudios', type: 'text', table: true },
        { key: 'escolaridad', label: 'Escolaridad / grado académico', type: 'text', table: true },
        { key: 'especificar', label: 'Especificar grado', type: 'text' },
        { key: 'programa', label: 'Programa académico', type: 'programas', table: true, filter: true, full: true },
        { key: 'dedicacion', label: 'Tiempo de dedicación', type: 'text', table: true, filter: true },
        { key: 'sistemaInvestigacion', label: 'Sistema de investigación', type: 'text', table: true },
        { key: 'estado', label: 'Situación', type: 'estado', table: true, filter: true },
        { key: 'observaciones', label: 'Observaciones', type: 'textarea', full: true }
      ]
    }),

    'act-deportivas': cfg({
      theme: 'deportes',
      title: 'Actividades deportivas',
      subtitle: 'Inscripción y participación en talleres y selecciones deportivas.',
      topbar: 'SICEI — Actividades deportivas',
      tag: 'TESJo — Actividades extraescolares',
      breadcrumb: 'Actividades extraescolares / Deportivas',
      storagePrefix: 'sicei_act_deportivas_',
      exportBase: 'Actividades_Deportivas',
      nav: nav(`${BASE}/Direccion_Vinculacion/subdireccionExtencion/deptoActivExtraEsc/actExtraescolares.html`, 'Actividades extraescolares', 'Deportivas', 'bi-trophy'),
      fields: [
        { key: 'programa', label: 'Programa académico', type: 'programas', required: true, table: true, filter: true, full: true },
        { key: 'sexo', label: 'Sexo', type: 'select', options: [{ value: 'HOMBRE', label: 'Hombre' }, { value: 'MUJER', label: 'Mujer' }], table: true, filter: true },
        { key: 'disciplina', label: 'Disciplina / taller', type: 'select', options: ['DEPORTES', 'BOX', 'GIMNASIO', 'TEAKWONDO', 'TIRO CON ARCO', 'ATLETISMO', 'FUTBOL', 'VOLEIBOL', 'BASQUETBALL', 'FUTBOL BARDAS', 'TENIS DE MESA', 'OTROS'].map((d) => ({ value: d, label: d })), table: true, filter: true },
        { key: 'tipoInscripcion', label: 'Tipo', type: 'select', options: [{ value: 'Taller', label: 'Taller' }, { value: 'Selección', label: 'Selección' }], table: true, filter: true },
        { key: 'cantidad', label: 'Cantidad de alumnos', type: 'number', required: true, table: true },
        { key: 'estado', label: 'Situación', type: 'estado', table: true, filter: true },
        { key: 'observaciones', label: 'Observaciones', type: 'textarea', full: true }
      ],
      charts: [
        { id: 'chartBar', type: 'bar', title: 'Alumnos por disciplina', groupBy: 'disciplina', aggregate: 'sum', field: 'cantidad' },
        { id: 'chartPie', type: 'doughnut', title: 'Taller vs selección', groupBy: 'tipoInscripcion' }
      ],
      kpis: [
        { id: 'total', label: 'Registros', icon: 'blue', bi: 'bi-journal-text', calc: (r) => r.length },
        { id: 'alumnos', label: 'Alumnos inscritos', icon: 'green', bi: 'bi-people-fill', calc: (r) => r.reduce((s, x) => s + (parseInt(x.cantidad, 10) || 0), 0) },
        { id: 'disciplinas', label: 'Disciplinas', icon: 'purple', bi: 'bi-trophy', calc: (r) => new Set(r.map((x) => x.disciplina).filter(Boolean)).size },
        { id: 'avance', label: 'Avance del semestre', icon: 'orange', bi: 'bi-activity', calc: (r, ctx) => ctx.avanceSemestre, isText: true }
      ]
    }),

    'act-culturales': cfg({
      theme: 'cultura',
      title: 'Actividades culturales',
      subtitle: 'Talleres culturales, artísticos y expresión creativa estudiantil.',
      topbar: 'SICEI — Actividades culturales',
      tag: 'TESJo — Actividades extraescolares',
      breadcrumb: 'Actividades extraescolares / Culturales',
      storagePrefix: 'sicei_act_culturales_',
      exportBase: 'Actividades_Culturales',
      nav: nav(`${BASE}/Direccion_Vinculacion/subdireccionExtencion/deptoActivExtraEsc/actExtraescolares.html`, 'Actividades extraescolares', 'Culturales', 'bi-palette'),
      fields: [
        { key: 'programa', label: 'Programa académico', type: 'programas', required: true, table: true, filter: true, full: true },
        { key: 'sexo', label: 'Sexo', type: 'select', options: [{ value: 'HOMBRE', label: 'Hombre' }, { value: 'MUJER', label: 'Mujer' }], table: true, filter: true },
        { key: 'taller', label: 'Taller cultural', type: 'select', options: ['AJEDREZ', 'ESCULTURA', 'PINTURA', 'RITMOS LATINOS', 'TEATRO MUSICAL', 'DANZA FOLCLORICA', 'BANDA DE ROCK', 'SHOW DANCE', 'CORO', 'LECTURA', 'OTROS'].map((t) => ({ value: t, label: t })), table: true, filter: true },
        { key: 'tipoInscripcion', label: 'Tipo', type: 'select', options: [{ value: 'Taller', label: 'Taller' }, { value: 'Selección', label: 'Selección' }], table: true, filter: true },
        { key: 'cantidad', label: 'Cantidad de alumnos', type: 'number', required: true, table: true },
        { key: 'estado', label: 'Situación', type: 'estado', table: true, filter: true },
        { key: 'observaciones', label: 'Observaciones', type: 'textarea', full: true }
      ],
      charts: [
        { id: 'chartBar', type: 'bar', title: 'Alumnos por taller', groupBy: 'taller', aggregate: 'sum', field: 'cantidad' },
        { id: 'chartPie', type: 'doughnut', title: 'Por sexo', groupBy: 'sexo' }
      ]
    }),

    'cursos-continua': cfg({
      theme: 'educacion',
      title: 'Cursos de educación continua',
      subtitle: 'Registro de cursos cortos, diplomados, seminarios y talleres de educación continua.',
      topbar: 'SICEI — Educación continua',
      tag: 'TESJo — Educación continua',
      breadcrumb: 'Educación continua / Cursos',
      storagePrefix: 'sicei_cursos_continua_',
      exportBase: 'Cursos_Educacion_Continua',
      nav: nav(`${BASE}/Direccion_Vinculacion/subdireccionExtencion/deptoEduContDist/educacionConDis.html`, 'Educación continua', 'Cursos', 'bi-book'),
      fields: [
        { key: 'tipoCurso', label: 'Tipo de curso', type: 'select', options: ['CURSOS CORTOS', 'DIPLOMADOS', 'SEMINARIOS', 'TALLERES', 'OTROS'].map((t) => ({ value: t, label: t })), table: true, filter: true },
        { key: 'nombreCurso', label: 'Nombre del curso', type: 'text', required: true, table: true, search: true, full: true },
        { key: 'hombres', label: 'Hombres', type: 'number', table: true },
        { key: 'mujeres', label: 'Mujeres', type: 'number', table: true },
        { key: 'total', label: 'Total participantes', type: 'number', table: true },
        { key: 'discapacidad', label: 'Con discapacidad', type: 'number', table: true },
        { key: 'hablantesIndigenas', label: 'Hablantes de lenguas indígenas', type: 'number' },
        { key: 'estado', label: 'Situación', type: 'estado', table: true, filter: true },
        { key: 'observaciones', label: 'Observaciones', type: 'textarea', full: true }
      ],
      kpis: [
        { id: 'total', label: 'Cursos registrados', icon: 'blue', bi: 'bi-journal-text', calc: (r) => r.length },
        { id: 'participantes', label: 'Total participantes', icon: 'green', bi: 'bi-people-fill', calc: (r) => r.reduce((s, x) => s + (parseInt(x.total, 10) || parseInt(x.hombres, 10) + parseInt(x.mujeres, 10) || 0), 0) },
        { id: 'tipos', label: 'Tipos de curso', icon: 'purple', bi: 'bi-collection', calc: (r) => new Set(r.map((x) => x.tipoCurso).filter(Boolean)).size },
        { id: 'avance', label: 'Avance del semestre', icon: 'orange', bi: 'bi-activity', calc: (r, ctx) => ctx.avanceSemestre, isText: true }
      ]
    }),

    'proy-vinculacion': cfg({
      theme: 'educacion',
      title: 'Proyecto de vinculación',
      subtitle: 'Proyectos de vinculación con sectores productivos y sociales.',
      topbar: 'SICEI — Proyectos de vinculación',
      tag: 'TESJo — Educación continua',
      breadcrumb: 'Educación continua / Proyectos de vinculación',
      storagePrefix: 'sicei_proy_vinculacion_',
      exportBase: 'Proyectos_Vinculacion',
      nav: nav(`${BASE}/Direccion_Vinculacion/subdireccionExtencion/deptoEduContDist/educacionConDis.html`, 'Educación continua', 'Vinculación', 'bi-link-45deg'),
      fields: [
        { key: 'area', label: 'Área del proyecto', type: 'select', options: ['INVESTIGACIÓN Y DESARROLLO', 'ASESORÍAS TÉCNICAS', 'PRÁCTICAS PROFESIONALES', 'EDUCACIÓN CONTINUA', 'SERVICIO SOCIAL', 'OTROS'].map((a) => ({ value: a, label: a })), table: true, filter: true },
        { key: 'sector', label: 'Sector', type: 'text', table: true, filter: true },
        { key: 'numeroAlumnos', label: 'Número de alumnos', type: 'number', table: true },
        { key: 'nombreProyecto', label: 'Nombre del proyecto', type: 'text', required: true, table: true, search: true, full: true },
        { key: 'estado', label: 'Situación', type: 'estado', table: true, filter: true },
        { key: 'observaciones', label: 'Observaciones', type: 'textarea', full: true }
      ]
    }),

    'servicio-comunidad': cfg({
      theme: 'servicio',
      title: 'Servicio a la comunidad',
      subtitle: 'Consultas, asesorías y beneficiarios por área de servicio comunitario.',
      topbar: 'SICEI — Servicio a la comunidad',
      tag: 'TESJo — Servicio social',
      breadcrumb: 'Servicio social / Servicio a la comunidad',
      storagePrefix: 'sicei_servicio_comunidad_',
      exportBase: 'Servicio_Comunidad',
      nav: nav(`${BASE}/Direccion_Vinculacion/deptoServSocRecidProf/deptoser.html`, 'Servicio social', 'Servicio comunidad', 'bi-heart'),
      fields: [
        { key: 'area', label: 'Área', type: 'select', options: ['JURÍDICA', 'SALUD', 'EDUCACIÓN', 'VIVIENDA', 'ECOLOGÍA'].map((a) => ({ value: a, label: a })), required: true, table: true, filter: true },
        { key: 'consultas', label: 'Total consultas y asesorías', type: 'number', required: true, table: true },
        { key: 'beneficiarios', label: 'Total beneficiarios', type: 'number', required: true, table: true },
        { key: 'estado', label: 'Situación', type: 'estado', table: true, filter: true },
        { key: 'observaciones', label: 'Observaciones', type: 'textarea', full: true }
      ],
      charts: [
        { id: 'chartBar', type: 'bar', title: 'Consultas por área', groupBy: 'area', aggregate: 'sum', field: 'consultas' },
        { id: 'chartPie', type: 'doughnut', title: 'Beneficiarios por área', groupBy: 'area', aggregate: 'sum', field: 'beneficiarios' }
      ]
    }),

    'servicio-social': cfg({
      theme: 'servicio',
      title: 'Servicio social',
      subtitle: 'Seguimiento del servicio social estudiantil por programa y sector.',
      topbar: 'SICEI — Servicio social',
      tag: 'TESJo — Servicio social',
      breadcrumb: 'Servicio social / Servicio social',
      storagePrefix: 'sicei_servicio_social_',
      exportBase: 'Servicio_Social',
      nav: nav(`${BASE}/Direccion_Vinculacion/deptoServSocRecidProf/deptoser.html`, 'Servicio social', 'Servicio social', 'bi-hand-thumbs-up'),
      fields: [
        { key: 'programa', label: 'Programa académico', type: 'programas', required: true, table: true, filter: true, full: true },
        { key: 'tipoRegistro', label: 'Tipo de registro', type: 'select', options: [{ value: 'Deben realizar', label: 'Alumnos que deben realizar' }, { value: 'En proceso', label: 'En proceso' }, { value: 'Concluyeron', label: 'Concluyeron' }, { value: 'No iniciaron', label: 'No han iniciado' }, { value: 'Por sector', label: 'Realizado por sector' }], table: true, filter: true },
        { key: 'categoria', label: 'Categoría / sector', type: 'text', table: true, filter: true },
        { key: 'subcategoria', label: 'Subcategoría', type: 'select', options: ['HOMBRES', 'MUJERES', 'CON DISCAPACIDAD', 'HABLANTES DE LENGUAS INDÍGENAS'].map((s) => ({ value: s, label: s })), table: true },
        { key: 'cantidad', label: 'Cantidad de alumnos', type: 'number', required: true, table: true },
        { key: 'estado', label: 'Situación', type: 'estado', table: true, filter: true },
        { key: 'observaciones', label: 'Observaciones', type: 'textarea', full: true }
      ]
    }),

    'residencia-prof': cfg({
      theme: 'servicio',
      title: 'Residencia profesional',
      subtitle: 'Control de residencias profesionales por programa académico.',
      topbar: 'SICEI — Residencia profesional',
      tag: 'TESJo — Servicio social',
      breadcrumb: 'Servicio social / Residencia profesional',
      storagePrefix: 'sicei_residencia_prof_',
      exportBase: 'Residencia_Profesional',
      nav: nav(`${BASE}/Direccion_Vinculacion/deptoServSocRecidProf/deptoser.html`, 'Servicio social', 'Residencia profesional', 'bi-briefcase'),
      fields: [
        { key: 'programa', label: 'Programa académico', type: 'programas', required: true, table: true, filter: true, full: true },
        { key: 'tipoRegistro', label: 'Tipo de registro', type: 'select', options: [{ value: 'Con 85% créditos', label: 'Con 85% de créditos' }, { value: 'Oficio aceptación', label: 'Con oficio de aceptación' }, { value: 'Alta sistema', label: 'Alta en servicios escolares' }, { value: 'No iniciaron', label: 'No han iniciado trámite' }, { value: 'Por sector', label: 'Por sector empresarial' }], table: true, filter: true },
        { key: 'categoria', label: 'Categoría / sector', type: 'text', table: true, filter: true },
        { key: 'subcategoria', label: 'Subcategoría', type: 'select', options: ['HOMBRES', 'MUJERES', 'CON DISCAPACIDAD', 'HABLANTES DE LENGUAS INDÍGENAS'].map((s) => ({ value: s, label: s })), table: true },
        { key: 'cantidad', label: 'Cantidad de alumnos', type: 'number', required: true, table: true },
        { key: 'estado', label: 'Situación', type: 'estado', table: true, filter: true },
        { key: 'observaciones', label: 'Observaciones', type: 'textarea', full: true }
      ]
    }),

    'cap-doc-difusion': cfg({
      theme: 'difusion',
      title: 'Capacitación de personal docente',
      subtitle: 'Capacitación docente coordinada por Difusión y Vinculación.',
      topbar: 'SICEI — Capacitación docente (Difusión)',
      tag: 'TESJo — Coordinación de Difusión',
      breadcrumb: 'Coordinación de Difusión / Capacitación docente',
      storagePrefix: 'sicei_cap_doc_difusion_',
      exportBase: 'Capacitacion_Docente_Difusion',
      nav: nav(`${BASE}/Direccion_Vinculacion/CoordinacionDifucion/coordinacionDifucion.html`, 'Coordinación Difusión', 'Capacitación docente', 'bi-megaphone'),
      fields: CAMPOS_CAPACITACION,
      newButton: 'Nueva capacitación'
    }),

    'cap-directivo': cfg({
      theme: 'difusion',
      title: 'Capacitación personal directivo y administrativo',
      subtitle: 'Registro de capacitación del personal directivo y administrativo.',
      topbar: 'SICEI — Capacitación directiva',
      tag: 'TESJo — Coordinación de Difusión',
      breadcrumb: 'Coordinación de Difusión / Capacitación directiva',
      storagePrefix: 'sicei_cap_directivo_',
      exportBase: 'Capacitacion_Directivo',
      nav: nav(`${BASE}/Direccion_Vinculacion/CoordinacionDifucion/coordinacionDifucion.html`, 'Coordinación Difusión', 'Capacitación directiva', 'bi-person-workspace'),
      fields: CAMPOS_CAPACITACION.map((f) => f.key === 'participante' ? Object.assign({}, f, { label: 'Nombre del servidor público' }) : f),
      newButton: 'Nueva capacitación'
    })
  };
})();
