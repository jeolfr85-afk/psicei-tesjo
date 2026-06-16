/**
 * TESJo / SICEI — Runtime configurable para Desarrollo Académico
 * Basado en el patrón Evaluación Docente (PrimerEtapa.js).
 *
 * Requiere:
 * - window.ED_CONFIG (configuración del módulo)
 * - Chart.js, jsPDF+autoTable, XLSX (opcionales para exportación/gráficas)
 */
(() => {
  'use strict';

  /* --------------------------------------------------------------------------
   * Constantes globales
   * ------------------------------------------------------------------------ */
  const LOGO_URL = '/prueba/prueba/MENU/images/enkabezado.png';
  const PERIODO_KEY = 'evaluacionDocente_periodo';
  const STORAGE_VERSION = 1;
  const DEFAULT_PAGE_SIZE = 10;

  const SEMESTRES = {
    A: { nombre: 'Semestre A', meses: 'Agosto – Diciembre' },
    B: { nombre: 'Semestre B', meses: 'Enero – Junio' }
  };

  const ESTADO_LABELS = {
    pendiente: 'Por realizar',
    completada: 'Finalizada',
    revisada: 'Revisada'
  };

  const PROGRAMAS = [
    'INGENIERÍA ELECTROMECÁNICA IEME-2010-210',
    'INGENIERÍA INDUSTRIAL IIND-2010-227',
    'INGENIERÍA INDUSTRIAL IIND-2010-227. EXTENSIÓN ACULCO',
    'INGENIERÍA EN SISTEMAS COMPUTACIONALES ISIC-2010-224',
    'INGENIERÍA EN SISTEMAS COMPUTACIONALES ISIC-2010-224. EXTENSIÓN ACULCO',
    'INGENIERÍA MECATRÓNICA IMCT-2010-229',
    'ARQUITECTURA ARQU-2010-204',
    'CONTADOR PÚBLICO COPU-2010-205',
    'CONTADOR PÚBLICO COPU-2010-205. EXTENSIÓN ACULCO',
    'INGENIERÍA EN GESTIÓN EMPRESARIAL IGEM-2009-201',
    'INGENIERÍA QUÍMICA IQUI-2010-232',
    'INGENIERÍA EN MATERIALES IMAT-2010-222',
    'INGENIERÍA EN ANIMACIÓN DIGITAL Y EFECTOS VISUALES IAEV-2012-238',
    'LICENCIATURA EN TURISMO LTUR-2012-237',
    'LICENCIATURA EN TURISMO LTUR-2012-237. EXTENSIÓN ACULCO'
  ];

  const LEGACY_PREFIXES_BY_NAV = {
    alumnos: ['sicei_alumnos_eventos_'],
    capacita: ['sicei_capacita_doc_acad_', 'sicei_cap_doc_difusion_'],
    evaluacion: ['sicei_evaluacion_docente_', 'evaluacionDocente_']
  };

  /* --------------------------------------------------------------------------
   * Estado runtime
   * ------------------------------------------------------------------------ */
  let cfg = null;
  let records = [];
  let charts = { bar: null, pie: null };
  let migratedFromLegacy = null;

  const ui = {
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    search: '',
    filters: {},
    sortKey: 'fecha',
    sortDir: 'desc',
    editingId: null
  };

  /* --------------------------------------------------------------------------
   * Helpers DOM / formato
   * ------------------------------------------------------------------------ */
  function byId(id) {
    return document.getElementById(id);
  }

  function qs(selector, root = document) {
    return root.querySelector(selector);
  }

  function qsa(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
  }

  function esc(value) {
    const div = document.createElement('div');
    div.textContent = value == null ? '' : String(value);
    return div.innerHTML;
  }

  function setText(id, value) {
    const node = byId(id);
    if (node) node.textContent = value == null ? '' : String(value);
  }

  function toLower(value) {
    return String(value == null ? '' : value).toLowerCase();
  }

  function uid() {
    return 'rec_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function estadoLabel(value) {
    return ESTADO_LABELS[value] || value || '—';
  }

  function formatDate(isoValue) {
    if (!isoValue) return '—';
    const d = new Date(isoValue);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  function formatDateTime(isoValue) {
    if (!isoValue) return '—';
    const d = new Date(isoValue);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function safeNumber(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function showToast(message, type = 'info') {
    const toast = byId('evalToast') || byId('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = 'ed-toast is-visible' +
      (type === 'success' ? ' is-success' : type === 'error' ? ' is-error' : '');
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => toast.classList.remove('is-visible'), 3200);
  }

  function getFieldDef(key) {
    return cfg.formFields.find((f) => f.key === key) || null;
  }

  function getInputId(fieldKey) {
    return 'evalField_' + fieldKey;
  }

  function getErrorId(fieldKey) {
    return 'err_' + fieldKey;
  }

  /* --------------------------------------------------------------------------
   * Configuración
   * ------------------------------------------------------------------------ */
  function normalizeOption(option) {
    if (typeof option === 'string') return { value: option, label: option };
    if (option && typeof option === 'object') {
      return {
        value: option.value == null ? '' : option.value,
        label: option.label == null ? String(option.value ?? '') : option.label
      };
    }
    return { value: '', label: '' };
  }

  function normalizeField(field) {
    const f = Object.assign({}, field || {});
    f.key = String(f.key || '').trim();
    f.label = String(f.label || f.key || 'Campo');
    f.type = f.type || 'text';
    f.required = !!f.required;
    f.full = !!f.full;
    f.options = Array.isArray(f.options) ? f.options.map(normalizeOption) : [];
    return f;
  }

  function normalizeTableCol(col) {
    const c = Object.assign({}, col || {});
    c.key = String(c.key || '').trim();
    c.label = String(c.label || c.key || 'Columna');
    c.badge = !!c.badge;
    return c;
  }

  function normalizeFilterField(field) {
    const f = normalizeField(field);
    if (!f.type) f.type = 'text';
    return f;
  }

  function buildFallbackStats(inputRecords) {
    const uniquePrograms = new Set(
      inputRecords.map((r) => r.programa || r.carrera || '').filter(Boolean)
    );
    const numericCandidates = inputRecords
      .map((r) => Number(r.calificacion))
      .filter((n) => Number.isFinite(n));
    const avg = numericCandidates.length
      ? numericCandidates.reduce((a, b) => a + b, 0) / numericCandidates.length
      : 0;
    const progressPct = PROGRAMAS.length
      ? Math.round((uniquePrograms.size / PROGRAMAS.length) * 100)
      : 0;
    let avanceSemestre = 'Sin iniciar';
    if (inputRecords.length > 0 && progressPct < 50) avanceSemestre = 'En progreso';
    else if (progressPct >= 50 && progressPct < 100) avanceSemestre = `Avance ${progressPct}%`;
    else if (progressPct >= 100) avanceSemestre = 'Completado';
    return {
      kpi1: inputRecords.length,
      kpi2: avg.toFixed(2),
      kpi3: uniquePrograms.size,
      avanceSemestre
    };
  }

  function normalizeConfig(raw) {
    const base = Object.assign({}, raw || {});
    const formFields = Array.isArray(base.formFields) ? base.formFields.map(normalizeField) : [];

    const tableCols = Array.isArray(base.tableCols) && base.tableCols.length
      ? base.tableCols.map(normalizeTableCol)
      : formFields
        .filter((f) => ['programa', 'docente', 'nombre', 'participante', 'estado'].includes(f.key))
        .map((f) => ({ key: f.key, label: f.label, badge: f.type === 'estado' }));

    const filterFields = Array.isArray(base.filterFields)
      ? base.filterFields.map(normalizeFilterField)
      : [];

    const config = {
      navKey: base.navKey || 'evaluacion',
      topbar: base.topbar || 'SICEI — Módulo académico',
      title: base.title || 'Módulo académico',
      subtitle: base.subtitle || 'Registro y seguimiento de información del módulo.',
      breadcrumb: base.breadcrumb || 'Desarrollo Académico / Módulo',
      tag: base.tag || 'TESJo — Desarrollo Académico',
      storagePrefix: base.storagePrefix || 'desacad_modulo_',
      exportBase: base.exportBase || 'Reporte_Modulo',
      pdfTitle: base.pdfTitle || String(base.title || 'Reporte módulo').toUpperCase(),
      newButton: base.newButton || 'Nuevo registro',
      listTabLabel: base.listTabLabel || 'Lista de registros',
      entityName: base.entityName || 'registro',
      tableCols,
      formFields,
      filterFields,
      stats: typeof base.stats === 'function' ? base.stats : buildFallbackStats,
      chartBar: base.chartBar || { title: 'Registros por grupo', groupBy: 'programa' },
      chartPie: base.chartPie || { title: 'Situación de registros', groupBy: 'estado' },
      resumenRows: typeof base.resumenRows === 'function'
        ? base.resumenRows
        : (rows) => [
          ['Registros del semestre', rows.length],
          ['Semestre activo', getPeriodoTexto()],
          ['Estado de avance', buildFallbackStats(rows).avanceSemestre]
        ],
      migrationPrefixes: Array.isArray(base.migrationPrefixes) ? base.migrationPrefixes : []
    };

    if (!config.formFields.length) {
      config.formFields = [
        { key: 'programa', label: 'Programa académico', type: 'programas', required: true, full: true },
        { key: 'docente', label: 'Nombre del docente', type: 'text', required: true, full: true },
        { key: 'estado', label: 'Situación', type: 'estado' },
        { key: 'observaciones', label: 'Observaciones', type: 'textarea', full: true }
      ];
    }

    if (!config.tableCols.length) {
      config.tableCols = [
        { key: 'docente', label: 'Docente' },
        { key: 'programa', label: 'Programa' },
        { key: 'estado', label: 'Situación', badge: true },
        { key: 'fecha', label: 'Fecha' }
      ];
    }

    return config;
  }

  /* --------------------------------------------------------------------------
   * Periodo/semestre TESJo (compartido)
   * ------------------------------------------------------------------------ */
  function semestreActualPorFecha() {
    const now = new Date();
    const mes = now.getMonth() + 1;
    const anio = now.getFullYear();
    const semestre = (mes >= 1 && mes <= 6) ? 'B' : 'A';
    return { anio, semestre };
  }

  function getPeriodoGuardado() {
    try {
      const raw = localStorage.getItem(PERIODO_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.anio && parsed.semestre) return parsed;
      }
    } catch (_err) {
      /* no-op */
    }

    const ciclo = localStorage.getItem('cicloEscolarSeleccionado');
    if (ciclo && ciclo !== 'default') {
      const first = parseInt(String(ciclo).split('-')[0], 10);
      if (!Number.isNaN(first)) {
        const current = semestreActualPorFecha();
        return { anio: first, semestre: current.semestre };
      }
    }

    return semestreActualPorFecha();
  }

  function guardarPeriodo(anio, semestre) {
    const payload = { anio: Number(anio), semestre: semestre === 'B' ? 'B' : 'A' };
    localStorage.setItem(PERIODO_KEY, JSON.stringify(payload));
    localStorage.setItem('cicloEscolarSeleccionado', `${payload.anio}-${payload.semestre}`);
  }

  function getCicloKey() {
    const p = getPeriodoGuardado();
    return `${p.anio}-${p.semestre}`;
  }

  function getPeriodoTexto() {
    const p = getPeriodoGuardado();
    const info = SEMESTRES[p.semestre] || SEMESTRES.A;
    return `${info.nombre} ${p.anio} (${info.meses})`;
  }

  function getPeriodoTextoCorto() {
    const p = getPeriodoGuardado();
    const info = SEMESTRES[p.semestre] || SEMESTRES.A;
    return `${info.nombre} · ${info.meses} ${p.anio}`;
  }

  function poblarAniosPeriodo() {
    const sel = byId('selAnioPeriodo');
    if (!sel) return;
    const currentYear = new Date().getFullYear();
    const periodo = getPeriodoGuardado();
    sel.innerHTML = '';
    for (let year = currentYear + 1; year >= currentYear - 4; year -= 1) {
      const opt = document.createElement('option');
      opt.value = String(year);
      opt.textContent = `Año ${year}`;
      if (year === Number(periodo.anio)) opt.selected = true;
      sel.appendChild(opt);
    }
  }

  function aplicarCambioPeriodo() {
    const year = byId('selAnioPeriodo')?.value;
    const semester = byId('selSemestrePeriodo')?.value;
    if (!year || !semester) return;
    guardarPeriodo(year, semester);
    setText('periodoValor', getPeriodoTextoCorto());
    loadData();
    renderAll();
    showToast(`Semestre actualizado: ${getPeriodoTexto()}`, 'success');
  }

  function initPeriodo() {
    if (!localStorage.getItem(PERIODO_KEY)) {
      const def = semestreActualPorFecha();
      guardarPeriodo(def.anio, def.semestre);
    }

    poblarAniosPeriodo();
    const p = getPeriodoGuardado();
    const selSem = byId('selSemestrePeriodo');
    if (selSem) selSem.value = p.semestre;
    setText('periodoValor', getPeriodoTextoCorto());

    byId('selAnioPeriodo')?.addEventListener('change', aplicarCambioPeriodo);
    byId('selSemestrePeriodo')?.addEventListener('change', aplicarCambioPeriodo);
  }

  /* --------------------------------------------------------------------------
   * Storage y migración
   * ------------------------------------------------------------------------ */
  function storageKey() {
    return cfg.storagePrefix + getCicloKey();
  }

  function storageMetaKey() {
    return cfg.storagePrefix + 'meta';
  }

  function parseStorePayload(rawPayload) {
    if (!rawPayload) return [];
    if (Array.isArray(rawPayload)) return rawPayload;
    if (Array.isArray(rawPayload.registros)) return rawPayload.registros;
    if (Array.isArray(rawPayload.records)) return rawPayload.records;
    if (Array.isArray(rawPayload.evaluaciones)) return rawPayload.evaluaciones;
    if (Array.isArray(rawPayload.rows)) return rawPayload.rows;
    return [];
  }

  function mapLegacyRecord(input) {
    const out = Object.assign({}, input || {});

    if (!out.id) out.id = uid();
    if (!out.fecha) out.fecha = new Date().toISOString();

    if (!out.programa && (out.carrera || out.programaAcademico)) {
      out.programa = out.carrera || out.programaAcademico;
    }
    if (!out.estado) out.estado = 'completada';

    if (!out.docente) {
      out.docente = out.nombre || out.participante || out.investigador || out.nombreDocente || '';
    }

    cfg.formFields.forEach((field) => {
      if (out[field.key] == null) out[field.key] = '';
      if (field.type === 'number' && out[field.key] !== '') {
        out[field.key] = safeNumber(out[field.key], '');
      }
    });

    return out;
  }

  function maybeMigrateFromLegacy() {
    const cycle = getCicloKey();
    const candidates = []
      .concat(LEGACY_PREFIXES_BY_NAV[cfg.navKey] || [])
      .concat(cfg.migrationPrefixes || [])
      .filter(Boolean);

    const uniquePrefixes = [...new Set(candidates)];

    for (const prefix of uniquePrefixes) {
      if (prefix === cfg.storagePrefix) continue;
      const key = prefix + cycle;
      const raw = localStorage.getItem(key);
      if (!raw) continue;

      try {
        const payload = JSON.parse(raw);
        const legacyRows = parseStorePayload(payload).map(mapLegacyRecord);
        if (!legacyRows.length) continue;
        records = legacyRows;
        migratedFromLegacy = key;
        persistData(true);
        return;
      } catch (_err) {
        /* intenta siguiente key */
      }
    }
  }

  function applySeedIfEmpty() {
    if (records.length) return;
    const seeds = cfg.seedRecords
      || (window.SICEI_DEFAULT_DATA && window.SICEI_DEFAULT_DATA[cfg.storagePrefix]);
    if (!Array.isArray(seeds) || !seeds.length) return;
    records = seeds.map((row) => mapLegacyRecord(Object.assign({}, row)));
    persistData(true);
  }

  function loadData() {
    records = [];
    migratedFromLegacy = null;
    try {
      const raw = localStorage.getItem(storageKey());
      if (raw) {
        const payload = JSON.parse(raw);
        records = parseStorePayload(payload).map(mapLegacyRecord);
      } else {
        maybeMigrateFromLegacy();
      }
    } catch (_err) {
      records = [];
    }
    applySeedIfEmpty();
  }

  function persistData(silent = false) {
    const payload = {
      registros: records,
      version: STORAGE_VERSION,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem(storageKey(), JSON.stringify(payload));

    const metaKey = storageMetaKey();
    let meta = {};
    try {
      meta = JSON.parse(localStorage.getItem(metaKey) || '{}');
    } catch (_err) {
      meta = {};
    }
    meta[getCicloKey()] = { updatedAt: payload.savedAt };
    localStorage.setItem(metaKey, JSON.stringify(meta));

    renderAll();
    if (!silent) showToast('Datos guardados correctamente', 'success');
  }

  function getLastUpdatedAt() {
    const metaKey = storageMetaKey();
    try {
      const meta = JSON.parse(localStorage.getItem(metaKey) || '{}');
      return meta[getCicloKey()]?.updatedAt || null;
    } catch (_err) {
      return null;
    }
  }

  /* --------------------------------------------------------------------------
   * Layout adaptable al HTML estándar
   * ------------------------------------------------------------------------ */
  function applyConfigToShell() {
    const titleNode = qs('.ed-header__info h1');
    const subtitleNode = qs('.ed-header__info p');
    const tagNode = qs('.ed-tag');
    const breadcrumbNode = qs('.ed-breadcrumb');
    const moduleNode = qs('.ed-topbar__module');
    const newButton = byId('btnAgregarFila');
    const listTab = qs('.ed-tab[data-tab="registros"]');

    if (titleNode) titleNode.textContent = cfg.title;
    if (subtitleNode) subtitleNode.textContent = cfg.subtitle;
    if (tagNode) tagNode.textContent = cfg.tag;
    if (breadcrumbNode) breadcrumbNode.textContent = cfg.breadcrumb;
    if (moduleNode) moduleNode.textContent = cfg.topbar;
    if (newButton) newButton.innerHTML = `<i class="bi bi-plus-lg"></i> ${esc(cfg.newButton)}`;
    if (listTab) listTab.innerHTML = `<i class="bi bi-list-ul"></i> ${esc(cfg.listTabLabel)}`;

    if (cfg.chartBar?.title) {
      const titleBar = byId('chartCarreras')?.closest('.ed-card')?.querySelector('.ed-card__head h2');
      if (titleBar) titleBar.innerHTML = `<i class="bi bi-bar-chart-fill"></i> ${esc(cfg.chartBar.title)}`;
    }

    if (cfg.chartPie?.title) {
      const titlePie = byId('chartEstados')?.closest('.ed-card')?.querySelector('.ed-card__head h2');
      if (titlePie) titlePie.innerHTML = `<i class="bi bi-pie-chart-fill"></i> ${esc(cfg.chartPie.title)}`;
    }
  }

  function initSidebarNav() {
    const navContainer = qs('.ed-aside__nav');
    if (!navContainer) return;
    if (window.DESACAD_NAV && typeof window.DESACAD_NAV.render === 'function') {
      navContainer.innerHTML = window.DESACAD_NAV.render(cfg.navKey);
    }
  }

  function createFormFieldHtml(field) {
    const requiredMark = field.required ? ' <em>*</em>' : '';
    const cssClass = field.full ? 'ed-field ed-field--full' : 'ed-field';
    const inputId = getInputId(field.key);
    const errId = getErrorId(field.key);

    let input = '';
    if (field.type === 'textarea') {
      input = `<textarea id="${inputId}" rows="3" maxlength="500"></textarea>`;
    } else if (field.type === 'number') {
      input = `<input type="number" id="${inputId}" min="0" step="any">`;
    } else if (field.type === 'date') {
      input = `<input type="date" id="${inputId}">`;
    } else if (field.type === 'programas') {
      input = `<select id="${inputId}"><option value="">Seleccione…</option></select>`;
    } else if (field.type === 'estado') {
      input = [
        `<select id="${inputId}">`,
        '<option value="pendiente">Por realizar</option>',
        '<option value="completada" selected>Finalizada</option>',
        '<option value="revisada">Revisada</option>',
        '</select>'
      ].join('');
    } else if (field.type === 'select') {
      const options = field.options
        .map((opt) => `<option value="${esc(opt.value)}">${esc(opt.label)}</option>`)
        .join('');
      input = `<select id="${inputId}"><option value="">Seleccione…</option>${options}</select>`;
    } else {
      input = `<input type="text" id="${inputId}" maxlength="250">`;
    }

    return `<div class="${cssClass}"><label for="${inputId}">${esc(field.label)}${requiredMark}</label>${input}<span class="ed-field__err" id="${errId}"></span></div>`;
  }

  function buildDynamicForm() {
    const form = byId('formEvaluacion');
    const body = form?.querySelector('.ed-modal__body');
    if (!body) return;

    const oldRow = body.querySelector('.ed-form-row');
    if (!oldRow) return;

    const html = cfg.formFields.map(createFormFieldHtml).join('');
    oldRow.innerHTML = html;

    let idInput = byId('evalId');
    if (!idInput) {
      idInput = document.createElement('input');
      idInput.type = 'hidden';
      idInput.id = 'evalId';
      form.prepend(idInput);
    }
  }

  function replaceTableHeaders() {
    const table = byId('tablaTalleres');
    if (!table) return;
    const headRow = table.querySelector('thead tr');
    if (!headRow) return;

    const cols = cfg.tableCols.concat([{ key: 'fecha', label: 'Fecha' }]);
    const headHtml = cols.map((col) =>
      `<th data-sort="${esc(col.key)}" class="is-sortable">${esc(col.label)} <i class="bi bi-arrow-down-up"></i></th>`
    ).join('') + '<th class="ed-col-actions">Acciones</th>';
    headRow.innerHTML = headHtml;

    if (!cfg.tableCols.some((c) => c.key === ui.sortKey)) ui.sortKey = 'fecha';
  }

  function buildFiltersUi() {
    const group = qs('.ed-filters__group');
    if (!group) return;

    const baseCarrera = byId('evalFilterCarrera');
    const baseStatus = byId('evalFilterStatus');
    if (baseCarrera) baseCarrera.innerHTML = '<option value="">Todos los programas</option>';
    if (baseStatus) {
      baseStatus.innerHTML = [
        '<option value="">Todas las situaciones</option>',
        '<option value="pendiente">Por realizar</option>',
        '<option value="completada">Finalizada</option>',
        '<option value="revisada">Revisada</option>'
      ].join('');
    }

    qsa('[data-dynamic-filter="1"]', group).forEach((node) => node.remove());

    const extraFilters = cfg.filterFields.filter((f) => f.key !== 'programa' && f.key !== 'estado');
    extraFilters.forEach((filterField) => {
      const wrapper = document.createElement('div');
      wrapper.dataset.dynamicFilter = '1';
      wrapper.className = 'ed-dyn-filter';
      const controlId = 'evalFilter_' + filterField.key;

      if (filterField.type === 'select' || filterField.type === 'programas' || filterField.type === 'estado') {
        const sel = document.createElement('select');
        sel.id = controlId;
        sel.innerHTML = '<option value="">Todos</option>';
        if (filterField.type === 'programas') {
          PROGRAMAS.forEach((programa) => {
            const opt = document.createElement('option');
            opt.value = programa;
            opt.textContent = programa.length > 46 ? programa.slice(0, 46) + '…' : programa;
            sel.appendChild(opt);
          });
        } else if (filterField.type === 'estado') {
          Object.entries(ESTADO_LABELS).forEach(([val, label]) => {
            const opt = document.createElement('option');
            opt.value = val;
            opt.textContent = label;
            sel.appendChild(opt);
          });
        } else {
          (filterField.options || []).forEach((optDef) => {
            const opt = document.createElement('option');
            opt.value = optDef.value;
            opt.textContent = optDef.label;
            sel.appendChild(opt);
          });
        }
        wrapper.appendChild(sel);
      } else {
        const input = document.createElement('input');
        input.type = 'search';
        input.id = controlId;
        input.placeholder = filterField.label || 'Filtrar…';
        wrapper.appendChild(input);
      }

      const pageSize = byId('evalPageSize');
      if (pageSize && pageSize.parentElement === group) {
        group.insertBefore(wrapper, pageSize);
      } else {
        group.appendChild(wrapper);
      }
    });
  }

  function populateSelectSources() {
    cfg.formFields.forEach((field) => {
      const input = byId(getInputId(field.key));
      if (!input || input.tagName !== 'SELECT') return;
      if (field.type === 'programas') {
        const current = input.value;
        input.innerHTML = '<option value="">Seleccione…</option>' + PROGRAMAS
          .map((p) => `<option value="${esc(p)}">${esc(p)}</option>`)
          .join('');
        if (current) input.value = current;
      }
    });

    const hasProgramaFilter = cfg.filterFields.some((f) => f.key === 'programa') ||
      cfg.tableCols.some((c) => c.key === 'programa');
    if (hasProgramaFilter && byId('evalFilterCarrera')) {
      byId('evalFilterCarrera').innerHTML = '<option value="">Todos los programas</option>' + PROGRAMAS
        .map((p) => `<option value="${esc(p)}">${esc(p.length > 48 ? p.slice(0, 48) + '…' : p)}</option>`)
        .join('');
    }
  }

  /* --------------------------------------------------------------------------
   * Cálculos y transformaciones de vista
   * ------------------------------------------------------------------------ */
  function formatCellValue(record, colDef) {
    const raw = record[colDef.key];
    if (colDef.format && typeof colDef.format === 'function') {
      try {
        return colDef.format(raw, record);
      } catch (_err) {
        return raw == null ? '—' : raw;
      }
    }
    const field = getFieldDef(colDef.key);
    if (field?.type === 'estado' || colDef.key === 'estado') return estadoLabel(raw);
    if (field?.type === 'date' || colDef.key === 'fecha') return formatDate(raw);
    if (raw === null || raw === undefined || raw === '') return '—';
    if (typeof raw === 'number') return String(raw);
    return String(raw);
  }

  function searchableValue(record) {
    const all = [];
    cfg.formFields.forEach((field) => {
      all.push(record[field.key]);
    });
    all.push(record.fecha, record.id);
    return toLower(all.join(' | '));
  }

  function recordMatchesFilters(record) {
    for (const [key, filterValue] of Object.entries(ui.filters)) {
      if (!filterValue) continue;
      if (key === 'programa') {
        if (record.programa !== filterValue) return false;
        continue;
      }
      if (key === 'estado') {
        if (record.estado !== filterValue) return false;
        continue;
      }

      const ownValue = record[key];
      if (ownValue == null) return false;
      if (typeof ownValue === 'string') {
        if (!toLower(ownValue).includes(toLower(filterValue))) return false;
      } else if (String(ownValue) !== String(filterValue)) {
        return false;
      }
    }
    return true;
  }

  function compareValues(a, b, key) {
    let av = a[key];
    let bv = b[key];

    if (key === 'fecha') {
      av = new Date(av).getTime();
      bv = new Date(bv).getTime();
    } else {
      const field = getFieldDef(key);
      if (field?.type === 'number') {
        av = safeNumber(av, 0);
        bv = safeNumber(bv, 0);
      } else {
        av = toLower(av);
        bv = toLower(bv);
      }
    }

    if (av < bv) return ui.sortDir === 'asc' ? -1 : 1;
    if (av > bv) return ui.sortDir === 'asc' ? 1 : -1;
    return 0;
  }

  function getFilteredRecords() {
    let list = records.slice();

    if (ui.search) {
      list = list.filter((row) => searchableValue(row).includes(ui.search));
    }

    list = list.filter(recordMatchesFilters);
    list.sort((a, b) => compareValues(a, b, ui.sortKey));
    return list;
  }

  function computeStats() {
    try {
      const values = cfg.stats(records);
      if (values && typeof values === 'object') return values;
    } catch (_err) {
      /* fallback abajo */
    }
    return buildFallbackStats(records);
  }

  function getResumenRows() {
    try {
      const rows = cfg.resumenRows(records);
      if (Array.isArray(rows)) return rows;
    } catch (_err) {
      /* fallback abajo */
    }
    return [
      ['Registros del semestre', records.length],
      ['Semestre activo', getPeriodoTexto()],
      ['Estado de avance', computeStats().avanceSemestre || 'Sin iniciar']
    ];
  }

  /* --------------------------------------------------------------------------
   * Render dashboard / tabla / modal
   * ------------------------------------------------------------------------ */
  function renderStats() {
    const stats = computeStats();
    setText('statTotalDocentes', stats.kpi1 ?? 0);
    setText('statPromedioGeneral', stats.kpi2 ?? '0.00');
    setText('statCarrerasEvaluadas', stats.kpi3 ?? 0);
    setText('statEstadoPeriodo', stats.avanceSemestre ?? 'Sin iniciar');
    setText('statUltimaActualizacion', `Última actualización: ${formatDateTime(getLastUpdatedAt())}`);
  }

  function renderResumenTable() {
    const tbody = byId('tbodyResumen');
    const tfoot = byId('tfootResumen');
    if (!tbody) return;

    const rows = getResumenRows();
    if (!rows.length) {
      tbody.innerHTML = '<tr><td colspan="4" class="ed-empty"><i class="bi bi-inbox"></i>Sin datos para mostrar.</td></tr>';
      if (tfoot) tfoot.innerHTML = '';
      return;
    }

    const headerCells = byId('tablaResumen')?.querySelectorAll('thead th')?.length || 2;
    const firstColSpan = Math.max(1, headerCells - 1);

    tbody.innerHTML = rows.map((row) => {
      const label = row?.[0] == null ? '—' : String(row[0]);
      const value = row?.[1] == null ? '—' : String(row[1]);
      if (headerCells <= 2) {
        return `<tr><td>${esc(label)}</td><td><strong>${esc(value)}</strong></td></tr>`;
      }
      return `<tr><td colspan="${firstColSpan}">${esc(label)}</td><td><strong>${esc(value)}</strong></td></tr>`;
    }).join('');

    if (tfoot) tfoot.innerHTML = '';
  }

  function renderTable() {
    const tbody = byId('tbody');
    if (!tbody) return;

    const list = getFilteredRecords();
    const totalPages = Math.max(1, Math.ceil(list.length / ui.pageSize));
    if (ui.page > totalPages) ui.page = totalPages;
    const start = (ui.page - 1) * ui.pageSize;
    const page = list.slice(start, start + ui.pageSize);

    if (!page.length) {
      const colspan = cfg.tableCols.length + 2;
      tbody.innerHTML = `<tr><td colspan="${colspan}" class="ed-empty"><i class="bi bi-inbox"></i>No se encontraron registros.</td></tr>`;
    } else {
      tbody.innerHTML = page.map((record) => {
        const cells = cfg.tableCols.concat([{ key: 'fecha', label: 'Fecha' }]).map((colDef) => {
          const value = formatCellValue(record, colDef);
          if (colDef.key === 'estado' || colDef.badge) {
            return `<td><span class="ed-badge ed-badge--${esc(record.estado || 'pendiente')}">${esc(value)}</span></td>`;
          }
          const text = String(value);
          const cut = text.length > 52 ? text.slice(0, 52) + '…' : text;
          return `<td>${esc(cut)}</td>`;
        }).join('');
        return [
          '<tr>',
          cells,
          '<td><div class="ed-actions">',
          `<button type="button" class="ed-act-btn" data-action="edit" data-id="${esc(record.id)}" title="Editar"><i class="bi bi-pencil"></i></button>`,
          `<button type="button" class="ed-act-btn ed-act-btn--del" data-action="delete" data-id="${esc(record.id)}" title="Eliminar"><i class="bi bi-trash"></i></button>`,
          '</div></td>',
          '</tr>'
        ].join('');
      }).join('');
    }

    setText('evalPaginationInfo', `Mostrando ${page.length} de ${list.length} registros`);
    setText('evalPageIndicator', `${ui.page} / ${totalPages}`);
    if (byId('evalPrevPage')) byId('evalPrevPage').disabled = ui.page <= 1;
    if (byId('evalNextPage')) byId('evalNextPage').disabled = ui.page >= totalPages;

    qsa('#tablaTalleres thead th.is-sortable').forEach((th) => {
      const icon = th.querySelector('i');
      th.classList.remove('sorted-asc', 'sorted-desc');
      if (icon) icon.className = 'bi bi-arrow-down-up';
      if (th.dataset.sort === ui.sortKey) {
        th.classList.add(ui.sortDir === 'asc' ? 'sorted-asc' : 'sorted-desc');
        if (icon) icon.className = `bi bi-arrow-${ui.sortDir === 'asc' ? 'up' : 'down'}`;
      }
    });
  }

  function resetFormErrors() {
    cfg.formFields.forEach((field) => setText(getErrorId(field.key), ''));
  }

  function readFormRecord() {
    const model = {
      id: byId('evalId')?.value || uid(),
      fecha: new Date().toISOString()
    };
    cfg.formFields.forEach((field) => {
      const node = byId(getInputId(field.key));
      let value = node ? node.value : '';
      if (field.type === 'number') value = value === '' ? '' : safeNumber(value, '');
      model[field.key] = typeof value === 'string' ? value.trim() : value;
    });
    return model;
  }

  function validateRecord(record) {
    let valid = true;
    cfg.formFields.forEach((field) => {
      const value = record[field.key];
      if (!field.required) return;
      const empty = value === '' || value == null || (typeof value === 'number' && Number.isNaN(value));
      if (empty) {
        setText(getErrorId(field.key), 'Campo requerido.');
        valid = false;
      }
    });
    return valid;
  }

  function openModal(recordId = null) {
    ui.editingId = recordId;
    resetFormErrors();

    const title = byId('modalTitle');
    const idNode = byId('evalId');
    const label = cfg.entityName.toLowerCase();

    if (title) {
      title.innerHTML = recordId
        ? `<i class="bi bi-pencil-square"></i> Editar ${esc(label)}`
        : `<i class="bi bi-plus-circle"></i> Nuevo ${esc(label)}`;
    }

    if (recordId) {
      const record = records.find((r) => r.id === recordId);
      if (!record) return;
      if (idNode) idNode.value = record.id;
      cfg.formFields.forEach((field) => {
        const node = byId(getInputId(field.key));
        if (!node) return;
        node.value = record[field.key] == null ? '' : record[field.key];
      });
    } else {
      if (idNode) idNode.value = '';
      const form = byId('formEvaluacion');
      form?.reset();
      const estadoField = cfg.formFields.find((f) => f.type === 'estado');
      if (estadoField) {
        const estadoNode = byId(getInputId(estadoField.key));
        if (estadoNode) estadoNode.value = 'completada';
      }
    }

    const overlay = byId('modalOverlay');
    if (overlay) overlay.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    const overlay = byId('modalOverlay');
    if (overlay) overlay.hidden = true;
    document.body.style.overflow = '';
    ui.editingId = null;
  }

  function saveFromModal(event) {
    event.preventDefault();
    resetFormErrors();

    const model = readFormRecord();
    const valid = validateRecord(model);
    if (!valid) return;

    const index = records.findIndex((r) => r.id === model.id);
    const isEdit = index >= 0;
    if (isEdit) {
      model.fecha = records[index].fecha || model.fecha;
      records[index] = model;
    } else {
      records.push(model);
    }

    closeModal();
    persistData(true);
    showToast(isEdit ? `${cfg.entityName} actualizado(a)` : `${cfg.entityName} guardado(a)`, 'success');
  }

  function deleteRecord(recordId) {
    const item = records.find((r) => r.id === recordId);
    if (!item) return;
    const nameKey = ['docente', 'nombre', 'participante', 'investigador', 'nombreProyecto']
      .find((k) => item[k]);
    const ref = nameKey ? String(item[nameKey]) : cfg.entityName;
    const sure = window.confirm(`¿Eliminar "${ref}"?`);
    if (!sure) return;
    records = records.filter((r) => r.id !== recordId);
    persistData(true);
    showToast('Registro eliminado', 'success');
  }

  /* --------------------------------------------------------------------------
   * Gráficas
   * ------------------------------------------------------------------------ */
  function buildGroupedCounts(rows, groupBy) {
    const map = {};
    rows.forEach((row) => {
      const key = String(row[groupBy] || 'Sin dato');
      map[key] = (map[key] || 0) + 1;
    });
    return map;
  }

  function buildGroupedAverage(rows, groupBy, numericKey) {
    const map = {};
    rows.forEach((row) => {
      const key = String(row[groupBy] || 'Sin dato');
      if (!map[key]) map[key] = { sum: 0, count: 0 };
      const n = Number(row[numericKey]);
      if (Number.isFinite(n)) {
        map[key].sum += n;
        map[key].count += 1;
      }
    });
    const out = {};
    Object.keys(map).forEach((k) => {
      out[k] = map[k].count ? map[k].sum / map[k].count : 0;
    });
    return out;
  }

  function destroyCharts() {
    if (charts.bar) charts.bar.destroy();
    if (charts.pie) charts.pie.destroy();
    charts.bar = null;
    charts.pie = null;
  }

  function renderCharts() {
    if (typeof Chart === 'undefined') return;

    const barCanvas = byId('chartCarreras');
    const pieCanvas = byId('chartEstados');
    if (!barCanvas && !pieCanvas) return;

    destroyCharts();

    const barCfg = cfg.chartBar || {};
    const pieCfg = cfg.chartPie || {};

    const hasCalificacion = records.some((r) => Number.isFinite(Number(r.calificacion)));
    const barDataRaw = hasCalificacion
      ? buildGroupedAverage(records, barCfg.groupBy || 'programa', 'calificacion')
      : buildGroupedCounts(records, barCfg.groupBy || 'programa');

    let barLabels = Object.keys(barDataRaw);
    let barData = barLabels.map((label) => barDataRaw[label]);
    if (!barLabels.length) {
      barLabels = ['Sin datos'];
      barData = [0];
    }

    if (barCanvas) {
      charts.bar = new Chart(barCanvas, {
        type: 'bar',
        data: {
          labels: barLabels.map((l) => l.length > 26 ? l.slice(0, 26) + '…' : l),
          datasets: [{ data: barData, backgroundColor: 'rgba(29,71,169,.82)', borderRadius: 5 }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: {
              beginAtZero: true,
              max: hasCalificacion ? 10 : undefined,
              grid: { color: '#eef2f7' }
            },
            x: { grid: { display: false }, ticks: { font: { size: 10 } } }
          }
        }
      });
    }

    const pieDataRaw = buildGroupedCounts(records, pieCfg.groupBy || 'estado');
    let pieLabels = Object.keys(pieDataRaw);
    let pieData = pieLabels.map((key) => pieDataRaw[key]);
    if (pieCfg.labels && typeof pieCfg.labels === 'object') {
      pieLabels = pieLabels.map((key) => pieCfg.labels[key] || key);
    } else {
      pieLabels = pieLabels.map((key) => estadoLabel(key));
    }
    if (!pieLabels.length) {
      pieLabels = ['Sin datos'];
      pieData = [1];
    }

    if (pieCanvas) {
      charts.pie = new Chart(pieCanvas, {
        type: 'doughnut',
        data: {
          labels: pieLabels,
          datasets: [{
            data: pieData,
            backgroundColor: ['#fbbf24', '#22c55e', '#3b82f6', '#a855f7', '#f97316', '#14b8a6'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { padding: 12, font: { size: 11 } } } }
        }
      });
    }
  }

  /* --------------------------------------------------------------------------
   * Exportación PDF / Excel
   * ------------------------------------------------------------------------ */
  function loadImage(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = url;
    });
  }

  async function exportToPDF() {
    if (!records.length) {
      showToast(`No hay ${cfg.entityName}s en este semestre para generar el PDF.`, 'error');
      return;
    }
    if (!window.jspdf || typeof window.jspdf.jsPDF !== 'function') {
      showToast('jsPDF no está disponible en esta página.', 'error');
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'letter' });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 15;
    const generated = new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' });
    const logo = await loadImage(LOGO_URL);

    function drawHeader() {
      doc.setFillColor(0, 38, 77);
      doc.rect(0, 0, pageW, 24, 'F');
      if (logo) doc.addImage(logo, 'PNG', margin, 5, 48, 13);
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(cfg.pdfTitle, pageW / 2, 11, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text('Tecnológico de Estudios Superiores de Jocotitlán — SICEI', pageW / 2, 18, { align: 'center' });
    }

    function drawFooter(pageNum, totalPages) {
      doc.setDrawColor(200, 210, 220);
      doc.line(margin, pageH - 12, pageW - margin, pageH - 12);
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text(`Semestre: ${getPeriodoTexto()}`, margin, pageH - 7);
      doc.text(`Generado: ${generated}`, pageW / 2, pageH - 7, { align: 'center' });
      doc.text(`Página ${pageNum} de ${totalPages}`, pageW - margin, pageH - 7, { align: 'right' });
    }

    drawHeader();
    let startY = 31;

    doc.setTextColor(0, 38, 77);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Resumen ejecutivo', margin, startY);
    startY += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    getResumenRows().slice(0, 6).forEach((row) => {
      doc.text(`${row[0]}: ${row[1]}`, margin, startY);
      startY += 4.8;
    });
    startY += 2.5;

    const head = [['#'].concat(cfg.tableCols.map((c) => c.label), ['Fecha'])];
    const body = records.map((record, idx) => {
      const cells = cfg.tableCols.map((colDef) => String(formatCellValue(record, colDef)).slice(0, 52));
      return [idx + 1].concat(cells, [formatDate(record.fecha)]);
    });

    doc.autoTable({
      startY,
      head,
      body,
      margin: { left: margin, right: margin, top: 28, bottom: 16 },
      styles: {
        fontSize: 8,
        cellPadding: 2.8,
        textColor: [30, 41, 59],
        lineColor: [220, 225, 235],
        lineWidth: 0.2
      },
      headStyles: {
        fillColor: [0, 38, 77],
        textColor: 255,
        fontStyle: 'bold',
        halign: 'center'
      },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      didDrawPage: drawHeader
    });

    const totalPages = doc.internal.getNumberOfPages();
    for (let p = 1; p <= totalPages; p += 1) {
      doc.setPage(p);
      drawFooter(p, totalPages);
    }

    doc.save(`${cfg.exportBase}_${getCicloKey()}.pdf`);
    showToast('Reporte PDF descargado correctamente', 'success');
  }

  function exportToExcel() {
    if (!records.length) {
      showToast(`No hay ${cfg.entityName}s en este semestre para generar el Excel.`, 'error');
      return;
    }
    if (typeof XLSX === 'undefined') {
      showToast('La librería XLSX no está disponible en esta página.', 'error');
      return;
    }

    const rows = [];
    rows.push([cfg.pdfTitle + ' — TESJo / SICEI']);
    rows.push([`Semestre: ${getPeriodoTexto()}`]);
    rows.push([`Generado: ${new Date().toLocaleString('es-MX')}`]);
    rows.push([]);
    rows.push(['RESUMEN']);
    getResumenRows().forEach((row) => rows.push([row[0], row[1]]));
    rows.push([]);
    rows.push(['#'].concat(cfg.tableCols.map((c) => c.label), ['Fecha']));

    records.forEach((record, idx) => {
      const line = [idx + 1];
      cfg.tableCols.forEach((colDef) => line.push(formatCellValue(record, colDef)));
      line.push(formatDate(record.fecha));
      rows.push(line);
    });

    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 4 }]
      .concat(cfg.tableCols.map(() => ({ wch: 28 })))
      .concat([{ wch: 16 }]);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
    XLSX.writeFile(wb, `${cfg.exportBase}_${getCicloKey()}.xlsx`);
    showToast('Reporte Excel descargado correctamente', 'success');
  }

  /* --------------------------------------------------------------------------
   * Navegación, eventos y ciclo de render
   * ------------------------------------------------------------------------ */
  function renderAll() {
    renderStats();
    renderResumenTable();
    renderCharts();
    renderTable();
  }

  function initTabs() {
    qsa('.ed-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        qsa('.ed-tab').forEach((btn) => {
          const active = btn.dataset.tab === target;
          btn.classList.toggle('is-active', active);
          btn.setAttribute('aria-selected', active ? 'true' : 'false');
        });

        qsa('.ed-section').forEach((section) => {
          const expectedId = `panel${target.charAt(0).toUpperCase() + target.slice(1)}`;
          const active = section.id === expectedId;
          section.hidden = !active;
          section.classList.toggle('is-active', active);
        });

        if (target === 'dashboard') setTimeout(renderCharts, 50);
      });
    });
  }

  function initSidebar() {
    const body = byId('edBody');
    const toggle = byId('edNavToggle');
    const close = byId('edAsideClose');
    const backdrop = byId('edBackdrop');

    const isMobile = () => window.innerWidth <= 768;

    function closeNav() {
      if (!body) return;
      body.classList.remove('is-nav-open');
      if (backdrop) backdrop.hidden = true;
    }

    toggle?.addEventListener('click', () => {
      if (!body) return;
      if (isMobile()) {
        const willOpen = !body.classList.contains('is-nav-open');
        body.classList.toggle('is-nav-open', willOpen);
        if (backdrop) backdrop.hidden = !willOpen;
      } else {
        body.classList.toggle('is-aside-hidden');
      }
    });

    close?.addEventListener('click', closeNav);
    backdrop?.addEventListener('click', closeNav);
    window.addEventListener('resize', () => {
      if (!isMobile()) closeNav();
    });
  }

  function bindFilters() {
    byId('evalSearch')?.addEventListener('input', (event) => {
      ui.search = toLower(event.target.value).trim();
      ui.page = 1;
      renderTable();
    });

    byId('evalFilterCarrera')?.addEventListener('change', (event) => {
      ui.filters.programa = event.target.value;
      ui.page = 1;
      renderTable();
    });

    byId('evalFilterStatus')?.addEventListener('change', (event) => {
      ui.filters.estado = event.target.value;
      ui.page = 1;
      renderTable();
    });

    cfg.filterFields
      .filter((f) => f.key !== 'programa' && f.key !== 'estado')
      .forEach((field) => {
        const node = byId('evalFilter_' + field.key);
        if (!node) return;
        const eventName = node.tagName === 'SELECT' ? 'change' : 'input';
        node.addEventListener(eventName, (event) => {
          ui.filters[field.key] = event.target.value;
          ui.page = 1;
          renderTable();
        });
      });
  }

  function bindEvents() {
    byId('btnAgregarFila')?.addEventListener('click', () => openModal());
    byId('btnGuardar')?.addEventListener('click', () => persistData(false));
    byId('btnGuardarPDF')?.addEventListener('click', exportToPDF);
    byId('btnGuardarExcel')?.addEventListener('click', exportToExcel);
    byId('btnCancelar')?.addEventListener('click', () => {
      const sure = window.confirm('¿Restaurar datos guardados desde almacenamiento local?');
      if (!sure) return;
      loadData();
      renderAll();
      showToast('Datos restaurados', 'info');
    });

    byId('formEvaluacion')?.addEventListener('submit', saveFromModal);
    byId('modalClose')?.addEventListener('click', closeModal);
    byId('modalCancel')?.addEventListener('click', closeModal);
    byId('modalOverlay')?.addEventListener('click', (event) => {
      if (event.target?.id === 'modalOverlay') closeModal();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeModal();
    });

    byId('evalPageSize')?.addEventListener('change', (event) => {
      ui.pageSize = safeNumber(event.target.value, DEFAULT_PAGE_SIZE);
      ui.page = 1;
      renderTable();
    });
    byId('evalPrevPage')?.addEventListener('click', () => {
      if (ui.page > 1) {
        ui.page -= 1;
        renderTable();
      }
    });
    byId('evalNextPage')?.addEventListener('click', () => {
      ui.page += 1;
      renderTable();
    });

    qs('#tablaTalleres thead')?.addEventListener('click', (event) => {
      const th = event.target.closest('th.is-sortable');
      if (!th) return;
      const key = th.dataset.sort;
      if (!key) return;
      if (ui.sortKey === key) ui.sortDir = ui.sortDir === 'asc' ? 'desc' : 'asc';
      else {
        ui.sortKey = key;
        ui.sortDir = 'asc';
      }
      renderTable();
    });

    byId('tbody')?.addEventListener('click', (event) => {
      const button = event.target.closest('[data-action]');
      if (!button) return;
      const action = button.dataset.action;
      const id = button.dataset.id;
      if (!id) return;
      if (action === 'edit') openModal(id);
      if (action === 'delete') deleteRecord(id);
    });

    bindFilters();
  }

  function initializeRuntime() {
    cfg = normalizeConfig(window.ED_CONFIG || {});
    ui.pageSize = safeNumber(byId('evalPageSize')?.value, DEFAULT_PAGE_SIZE);
    ui.sortKey = cfg.tableCols.some((c) => c.key === 'fecha')
      ? cfg.tableCols[0]?.key || 'fecha'
      : (cfg.tableCols[0]?.key || 'fecha');

    document.body.classList.add('ed-app');
    applyConfigToShell();
    initSidebarNav();
    buildDynamicForm();
    replaceTableHeaders();
    buildFiltersUi();
    populateSelectSources();
    initPeriodo();
    loadData();
    initSidebar();
    initTabs();
    bindEvents();
    renderAll();

    if (migratedFromLegacy) {
      showToast(`Datos migrados desde ${migratedFromLegacy}`, 'success');
    }
  }

  document.addEventListener('DOMContentLoaded', initializeRuntime);
})();
