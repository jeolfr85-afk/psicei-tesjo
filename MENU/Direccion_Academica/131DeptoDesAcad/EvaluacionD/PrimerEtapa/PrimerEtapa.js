/**
 * Evaluación Docente — SICEI / TESJo
 * Store · Resumen · CRUD modal · Descarga PDF/Excel
 */
(() => {
  'use strict';

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

  const STORAGE_PREFIX = 'evaluacionDocente_';
  const STORAGE_META_KEY = 'evaluacionDocente_meta';
  const PERIODO_KEY = 'evaluacionDocente_periodo';
  const LOGO_URL = '/prueba/prueba/MENU/images/enkabezado.png';

  const DATOS_INICIALES = [
    { id: 'ev1', programa: PROGRAMAS[0], docente: 'Mtro. Roberto Hernández Luna', calificacion: 9.2, estado: 'completada', comentarios: 'Excelente desempeño en aula.', fecha: '2026-02-10T14:00:00.000Z' },
    { id: 'ev2', programa: PROGRAMAS[1], docente: 'Dra. Ana María Sánchez Ruiz', calificacion: 9.5, estado: 'revisada', comentarios: 'Resultados sobresalientes.', fecha: '2026-02-14T14:00:00.000Z' },
    { id: 'ev3', programa: PROGRAMAS[2], docente: 'Ing. Carlos Eduardo Morales', calificacion: 8.8, estado: 'completada', comentarios: '', fecha: '2026-02-18T14:00:00.000Z' },
    { id: 'ev4', programa: PROGRAMAS[3], docente: 'Mtra. Laura Patricia Vega', calificacion: 9.0, estado: 'completada', comentarios: 'Buen seguimiento académico.', fecha: '2026-02-22T14:00:00.000Z' },
    { id: 'ev5', programa: PROGRAMAS[4], docente: 'Dr. Miguel Ángel Torres', calificacion: 9.7, estado: 'revisada', comentarios: 'Docente modelo.', fecha: '2026-03-01T14:00:00.000Z' },
    { id: 'ev6', programa: PROGRAMAS[5], docente: 'Ing. Gabriela Mendoza Flores', calificacion: 8.5, estado: 'completada', comentarios: '', fecha: '2026-03-05T14:00:00.000Z' },
    { id: 'ev7', programa: PROGRAMAS[6], docente: 'Mtro. Jorge Luis Ramírez', calificacion: 8.9, estado: 'completada', comentarios: 'Mejora continua observada.', fecha: '2026-03-12T14:00:00.000Z' },
    { id: 'ev8', programa: PROGRAMAS[7], docente: 'Dra. Patricia Elizabeth Cruz', calificacion: 9.3, estado: 'completada', comentarios: '', fecha: '2026-03-18T14:00:00.000Z' },
    { id: 'ev9', programa: PROGRAMAS[8], docente: 'Ing. Fernando Díaz Ortega', calificacion: 8.7, estado: 'pendiente', comentarios: 'Pendiente revisión final.', fecha: '2026-04-02T14:00:00.000Z' },
    { id: 'ev10', programa: PROGRAMAS[9], docente: 'Mtra. Silvia Guadalupe Núñez', calificacion: 9.1, estado: 'completada', comentarios: 'Alta participación estudiantil.', fecha: '2026-04-08T14:00:00.000Z' }
  ];

  const SEMESTRES = {
    A: { nombre: 'Semestre A', meses: 'Agosto – Diciembre' },
    B: { nombre: 'Semestre B', meses: 'Enero – Junio' }
  };

  const ui = {
    page: 1,
    pageSize: 10,
    search: '',
    filterCarrera: '',
    filterEstado: '',
    sortKey: 'fecha',
    sortDir: 'desc',
    editingId: null
  };

  let evaluaciones = [];
  let charts = { carreras: null, estados: null };

  /* ── PERIODO / SEMESTRE TESJo ── */
  function semestreActualPorFecha() {
    const hoy = new Date();
    const mes = hoy.getMonth() + 1;
    const anio = hoy.getFullYear();
    /* Ago–Dic = A; Ene–Jun = B; Jul = preparación → A del mismo año */
    const semestre = (mes >= 1 && mes <= 6) ? 'B' : 'A';
    return { anio, semestre };
  }

  function getPeriodoGuardado() {
    try {
      const raw = localStorage.getItem(PERIODO_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        if (p.anio && p.semestre) return p;
      }
    } catch { /* continuar */ }

    /* Compatibilidad con ciclo escolar anterior */
    const ciclo = localStorage.getItem('cicloEscolarSeleccionado');
    if (ciclo && ciclo !== 'default') {
      const partes = ciclo.split('-');
      const anio = parseInt(partes[0], 10);
      if (!isNaN(anio)) {
        const mes = new Date().getMonth() + 1;
        return { anio, semestre: (mes >= 1 && mes <= 6) ? 'B' : 'A' };
      }
    }

    return semestreActualPorFecha();
  }

  function guardarPeriodo(anio, semestre) {
    const payload = { anio: Number(anio), semestre };
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
    const sel = document.getElementById('selAnioPeriodo');
    if (!sel) return;
    const actual = new Date().getFullYear();
    const p = getPeriodoGuardado();
    sel.innerHTML = '';
    for (let y = actual + 1; y >= actual - 4; y--) {
      const opt = document.createElement('option');
      opt.value = String(y);
      opt.textContent = `Año ${y}`;
      if (y === p.anio) opt.selected = true;
      sel.appendChild(opt);
    }
  }

  function aplicarCambioPeriodo() {
    const anio = document.getElementById('selAnioPeriodo')?.value;
    const semestre = document.getElementById('selSemestrePeriodo')?.value;
    if (!anio || !semestre) return;

    guardarPeriodo(anio, semestre);
    setText('periodoValor', getPeriodoTextoCorto());
    cargarDatos();
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
    const selSem = document.getElementById('selSemestrePeriodo');
    if (selSem) selSem.value = p.semestre;
    setText('periodoValor', getPeriodoTextoCorto());

    document.getElementById('selAnioPeriodo')?.addEventListener('change', aplicarCambioPeriodo);
    document.getElementById('selSemestrePeriodo')?.addEventListener('change', aplicarCambioPeriodo);
  }

  function getStorageKey() {
    return STORAGE_PREFIX + getCicloKey();
  }

  /* ── STORE ── */

  function uid() {
    return 'ev_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function migrarFormatoAntiguo(data) {
    if (!data?.filas || data.evaluaciones) return data;
    const evals = [];
    Object.entries(data.filas).forEach(([programa, vals]) => {
      const cal = parseFloat(vals.calificacion);
      const total = parseInt(vals.totalDocentes, 10);
      if (isNaN(cal) && isNaN(total)) return;
      evals.push({
        id: uid(),
        programa,
        docente: !isNaN(total) && total > 0
          ? `Equipo docente (${total} docente${total !== 1 ? 's' : ''})`
          : 'Registro consolidado',
        calificacion: !isNaN(cal) ? cal : 0,
        comentarios: 'Registro migrado del sistema anterior.',
        estado: 'completada',
        fecha: data.savedAt || new Date().toISOString()
      });
    });
    return { evaluaciones: evals, version: 2, savedAt: data.savedAt || new Date().toISOString() };
  }

  function cargarDatos() {
    try {
      const raw = localStorage.getItem(getStorageKey());
      if (!raw) {
        evaluaciones = DATOS_INICIALES.map((e) => ({ ...e }));
        guardarDatos(true);
        return;
      }
      const data = migrarFormatoAntiguo(JSON.parse(raw));
      evaluaciones = Array.isArray(data.evaluaciones) ? data.evaluaciones : [];
      if (!evaluaciones.length) {
        evaluaciones = DATOS_INICIALES.map((e) => ({ ...e }));
        guardarDatos(true);
      }
    } catch {
      evaluaciones = DATOS_INICIALES.map((e) => ({ ...e }));
      guardarDatos(true);
    }
  }

  function guardarDatos(silent = false) {
    const payload = { evaluaciones, version: 2, savedAt: new Date().toISOString() };
    localStorage.setItem(getStorageKey(), JSON.stringify(payload));
    const meta = JSON.parse(localStorage.getItem(STORAGE_META_KEY) || '{}');
    meta[getCicloKey()] = { updatedAt: payload.savedAt };
    localStorage.setItem(STORAGE_META_KEY, JSON.stringify(meta));
    renderAll();
    if (!silent) showToast('Datos guardados correctamente', 'success');
  }

  /* ── UTILIDADES ── */
  function showToast(msg, type = 'info') {
    const el = document.getElementById('evalToast');
    if (!el) return;
    el.textContent = msg;
    el.className = 'ed-toast is-visible' + (type === 'success' ? ' is-success' : type === 'error' ? ' is-error' : '');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => el.classList.remove('is-visible'), 3200);
  }

  function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  function esc(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  function formatFecha(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  function formatFechaHora(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? '—' : d.toLocaleString('es-MX', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  function nivelDesempeno(cal) {
    const n = parseFloat(cal);
    if (isNaN(n)) return '—';
    if (n >= 9) return 'Excelente';
    if (n >= 8) return 'Muy bueno';
    if (n >= 7) return 'Bueno';
    if (n >= 6) return 'Satisfactorio';
    return 'Requiere mejora';
  }

  function scoreClass(cal) {
    const n = parseFloat(cal);
    if (n >= 8) return 'ed-score--hi';
    if (n >= 6) return 'ed-score--md';
    return 'ed-score--lo';
  }

  function estadoLabel(estado) {
    const map = { pendiente: 'Por realizar', completada: 'Finalizada', revisada: 'Revisada' };
    return map[estado] || estado;
  }

  /* ── ESTADÍSTICAS ── */
  function calcularStats() {
    const docentes = new Set(evaluaciones.map((e) => e.docente.toLowerCase()));
    const carreras = new Set(evaluaciones.map((e) => e.programa));
    const cals = evaluaciones.map((e) => parseFloat(e.calificacion)).filter((n) => !isNaN(n));
    const promedio = cals.length ? cals.reduce((a, b) => a + b, 0) / cals.length : 0;
    const pct = PROGRAMAS.length ? Math.round((carreras.size / PROGRAMAS.length) * 100) : 0;
    let avanceSemestre = 'Sin iniciar';
    if (evaluaciones.length > 0 && pct < 50) avanceSemestre = 'En progreso';
    else if (pct >= 50 && pct < 100) avanceSemestre = `Avance ${pct}%`;
    else if (pct >= 100) avanceSemestre = 'Completado';
    return { docentes: docentes.size, promedio, carreras: carreras.size, avanceSemestre };
  }

  function resumenPorPrograma() {
    const map = {};
    PROGRAMAS.forEach((p) => { map[p] = { count: 0, sum: 0, docentes: 0 }; });
    evaluaciones.forEach((e) => {
      if (!map[e.programa]) map[e.programa] = { count: 0, sum: 0, docentes: 0 };
      map[e.programa].count++;
      const cal = parseFloat(e.calificacion);
      if (!isNaN(cal)) map[e.programa].sum += cal;
      map[e.programa].docentes++;
    });
    return Object.entries(map).map(([programa, d]) => ({
      programa, count: d.count,
      promedio: d.count ? (d.sum / d.count).toFixed(2) : '—',
      docentes: d.docentes
    }));
  }

  /* ── RENDER DASHBOARD ── */
  function renderDashboard() {
    const stats = calcularStats();
    const meta = JSON.parse(localStorage.getItem(STORAGE_META_KEY) || '{}');
    setText('statTotalDocentes', stats.docentes);
    setText('statPromedioGeneral', stats.promedio.toFixed(2));
    setText('statCarrerasEvaluadas', stats.carreras);
    setText('statEstadoPeriodo', stats.avanceSemestre);
    setText('statUltimaActualizacion', `Última actualización: ${formatFechaHora(meta[getCicloKey()]?.updatedAt)}`);
    renderResumenTable();
    renderCharts();
  }

  function renderResumenTable() {
    const tbody = document.getElementById('tbodyResumen');
    const tfoot = document.getElementById('tfootResumen');
    if (!tbody) return;
    const rows = resumenPorPrograma().filter((r) => r.count > 0);
    if (!rows.length) {
      tbody.innerHTML = '<tr><td colspan="4" class="ed-empty"><i class="bi bi-inbox"></i>Sin evaluaciones registradas.</td></tr>';
      tfoot.innerHTML = '';
      return;
    }
    tbody.innerHTML = rows.map((r) => `
      <tr>
        <td>${esc(r.programa)}</td>
        <td>${r.count}</td>
        <td><span class="ed-score ${scoreClass(r.promedio)}">${r.promedio}</span></td>
        <td>${r.docentes}</td>
      </tr>`).join('');
    const totalEvals = rows.reduce((s, r) => s + r.count, 0);
    const totalDocs = rows.reduce((s, r) => s + r.docentes, 0);
    const avgAll = evaluaciones.length
      ? (evaluaciones.reduce((s, e) => s + (parseFloat(e.calificacion) || 0), 0) / evaluaciones.length).toFixed(2) : '0';
    tfoot.innerHTML = `<tr><td>TOTAL / PROMEDIO</td><td>${totalEvals}</td><td>${avgAll}</td><td>${totalDocs}</td></tr>`;
  }

  function renderCharts() {
    if (typeof Chart === 'undefined') return;
    const byCarrera = {};
    evaluaciones.forEach((e) => {
      if (!byCarrera[e.programa]) byCarrera[e.programa] = [];
      const c = parseFloat(e.calificacion);
      if (!isNaN(c)) byCarrera[e.programa].push(c);
    });
    let labels = Object.keys(byCarrera).slice(0, 8);
    let data = labels.map((k) => byCarrera[k].reduce((a, b) => a + b, 0) / byCarrera[k].length);
    if (!labels.length) { labels = ['Sin datos']; data = [0]; }

    const estados = { pendiente: 0, completada: 0, revisada: 0 };
    evaluaciones.forEach((e) => { estados[e.estado] = (estados[e.estado] || 0) + 1; });

    const ctxC = document.getElementById('chartCarreras');
    if (ctxC) {
      if (charts.carreras) charts.carreras.destroy();
      charts.carreras = new Chart(ctxC, {
        type: 'bar',
        data: {
          labels: labels.map((l) => l.length > 26 ? l.slice(0, 26) + '…' : l),
          datasets: [{ data, backgroundColor: 'rgba(29,71,169,.8)', borderRadius: 5 }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, max: 10, grid: { color: '#eef2f7' } },
            x: { grid: { display: false }, ticks: { font: { size: 10 } } }
          }
        }
      });
    }

    const ctxE = document.getElementById('chartEstados');
    if (ctxE) {
      if (charts.estados) charts.estados.destroy();
      charts.estados = new Chart(ctxE, {
        type: 'doughnut',
        data: {
          labels: ['Por realizar', 'Finalizada', 'Revisada'],
          datasets: [{ data: [estados.pendiente, estados.completada, estados.revisada], backgroundColor: ['#fbbf24', '#22c55e', '#3b82f6'], borderWidth: 0 }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { padding: 14, font: { size: 11 } } } }
        }
      });
    }
  }

  /* ── RENDER TABLA ── */
  function getFiltered() {
    let list = [...evaluaciones];
    if (ui.search) {
      const q = ui.search.toLowerCase();
      list = list.filter((e) => e.docente.toLowerCase().includes(q) || e.programa.toLowerCase().includes(q));
    }
    if (ui.filterCarrera) list = list.filter((e) => e.programa === ui.filterCarrera);
    if (ui.filterEstado) list = list.filter((e) => e.estado === ui.filterEstado);
    list.sort((a, b) => {
      let av = a[ui.sortKey], bv = b[ui.sortKey];
      if (ui.sortKey === 'calificacion') { av = parseFloat(av); bv = parseFloat(bv); }
      if (ui.sortKey === 'fecha') { av = new Date(av).getTime(); bv = new Date(bv).getTime(); }
      if (typeof av === 'string') { av = av.toLowerCase(); bv = bv.toLowerCase(); }
      if (av < bv) return ui.sortDir === 'asc' ? -1 : 1;
      if (av > bv) return ui.sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  }

  function renderTable() {
    const tbody = document.getElementById('tbody');
    if (!tbody) return;
    const filtered = getFiltered();
    const totalPages = Math.max(1, Math.ceil(filtered.length / ui.pageSize));
    if (ui.page > totalPages) ui.page = totalPages;
    const start = (ui.page - 1) * ui.pageSize;
    const page = filtered.slice(start, start + ui.pageSize);

    if (!page.length) {
      tbody.innerHTML = '<tr><td colspan="6" class="ed-empty"><i class="bi bi-inbox"></i>No se encontraron registros.</td></tr>';
    } else {
      tbody.innerHTML = page.map((e) => `
        <tr>
          <td>${esc(e.docente)}</td>
          <td>${esc(e.programa.length > 38 ? e.programa.slice(0, 38) + '…' : e.programa)}</td>
          <td><span class="ed-score ${scoreClass(e.calificacion)}">${parseFloat(e.calificacion).toFixed(1)}</span></td>
          <td><span class="ed-badge ed-badge--${e.estado}">${estadoLabel(e.estado)}</span></td>
          <td>${formatFecha(e.fecha)}</td>
          <td><div class="ed-actions">
            <button type="button" class="ed-act-btn" data-action="edit" data-id="${e.id}" title="Editar"><i class="bi bi-pencil"></i></button>
            <button type="button" class="ed-act-btn ed-act-btn--del" data-action="delete" data-id="${e.id}" title="Eliminar"><i class="bi bi-trash"></i></button>
          </div></td>
        </tr>`).join('');
    }

    setText('evalPaginationInfo', `Mostrando ${page.length} de ${filtered.length} registros`);
    setText('evalPageIndicator', `${ui.page} / ${totalPages}`);
    document.getElementById('evalPrevPage').disabled = ui.page <= 1;
    document.getElementById('evalNextPage').disabled = ui.page >= totalPages;

    document.querySelectorAll('#tablaTalleres thead th.is-sortable').forEach((th) => {
      th.classList.remove('sorted-asc', 'sorted-desc');
      const icon = th.querySelector('i');
      if (icon) icon.className = 'bi bi-arrow-down-up';
      if (th.dataset.sort === ui.sortKey) {
        th.classList.add(ui.sortDir === 'asc' ? 'sorted-asc' : 'sorted-desc');
        if (icon) icon.className = `bi bi-arrow-${ui.sortDir === 'asc' ? 'up' : 'down'}`;
      }
    });
  }

  function renderAll() {
    renderDashboard();
    renderTable();
  }

  /* ── MODAL CRUD ── */
  function poblarSelects() {
    const selProg = document.getElementById('evalPrograma');
    const selCarrera = document.getElementById('evalFilterCarrera');
    if (selProg) {
      selProg.innerHTML = '<option value="">Seleccione…</option>' +
        PROGRAMAS.map((p) => `<option value="${esc(p)}">${esc(p)}</option>`).join('');
    }
    if (selCarrera) {
      selCarrera.innerHTML = '<option value="">Todas las carreras</option>' +
        PROGRAMAS.map((p) => `<option value="${esc(p)}">${esc(p.length > 48 ? p.slice(0, 48) + '…' : p)}</option>`).join('');
    }
  }

  function abrirModal(id = null) {
    ui.editingId = id;
    const form = document.getElementById('formEvaluacion');
    const title = document.getElementById('modalTitle');
    form.reset();
    ['errPrograma', 'errDocente', 'errCalificacion'].forEach((i) => setText(i, ''));

    if (id) {
      const ev = evaluaciones.find((e) => e.id === id);
      if (!ev) return;
      title.innerHTML = '<i class="bi bi-pencil-square"></i> Editar evaluación docente';
      document.getElementById('evalId').value = id;
      document.getElementById('evalPrograma').value = ev.programa;
      document.getElementById('evalDocente').value = ev.docente;
      document.getElementById('evalCalificacion').value = ev.calificacion;
      document.getElementById('evalEstado').value = ev.estado;
      document.getElementById('evalComentarios').value = ev.comentarios || '';
    } else {
      title.innerHTML = '<i class="bi bi-plus-circle"></i> Nueva evaluación docente';
      document.getElementById('evalId').value = '';
      document.getElementById('evalEstado').value = 'completada';
    }
    setText('calificacionLabel', nivelDesempeno(document.getElementById('evalCalificacion').value));
    document.getElementById('modalOverlay').hidden = false;
    document.body.style.overflow = 'hidden';
    document.getElementById('evalDocente').focus();
  }

  function cerrarModal() {
    document.getElementById('modalOverlay').hidden = true;
    document.body.style.overflow = '';
    ui.editingId = null;
  }

  function guardarEvaluacion(e) {
    e.preventDefault();
    ['errPrograma', 'errDocente', 'errCalificacion'].forEach((i) => setText(i, ''));
    const programa = document.getElementById('evalPrograma').value;
    const docente = document.getElementById('evalDocente').value.trim();
    const cal = parseFloat(document.getElementById('evalCalificacion').value);
    let ok = true;
    if (!programa) { setText('errPrograma', 'Seleccione un programa.'); ok = false; }
    if (!docente || docente.length < 3) { setText('errDocente', 'Nombre requerido (mín. 3 caracteres).'); ok = false; }
    if (isNaN(cal) || cal < 0 || cal > 10) { setText('errCalificacion', 'Calificación entre 0.0 y 10.0.'); ok = false; }
    if (!ok) return;

    const record = {
      id: document.getElementById('evalId').value || uid(),
      programa, docente,
      calificacion: cal,
      estado: document.getElementById('evalEstado').value,
      comentarios: document.getElementById('evalComentarios').value.trim(),
      fecha: ui.editingId
        ? (evaluaciones.find((ev) => ev.id === ui.editingId)?.fecha || new Date().toISOString())
        : new Date().toISOString()
    };
    const idx = evaluaciones.findIndex((ev) => ev.id === record.id);
    if (idx >= 0) evaluaciones[idx] = record; else evaluaciones.push(record);
    cerrarModal();
    guardarDatos(true);
    showToast(ui.editingId ? 'Evaluación actualizada' : 'Evaluación registrada', 'success');
  }

  function eliminarEvaluacion(id) {
    const ev = evaluaciones.find((e) => e.id === id);
    if (!ev || !confirm(`¿Eliminar la evaluación de "${ev.docente}"?`)) return;
    evaluaciones = evaluaciones.filter((e) => e.id !== id);
    guardarDatos(true);
    showToast('Registro eliminado', 'success');
  }

  /* ── EXPORT PDF ── */
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
    if (!evaluaciones.length) { showToast('No hay evaluaciones en este semestre. Registre al menos una para descargar el PDF.', 'error'); return; }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'letter' });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 15;
    const stats = calcularStats();
    const periodo = getPeriodoTexto();
    const fechaGen = new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' });
    const logo = await loadImage(LOGO_URL);

    function drawPageHeader() {
      doc.setFillColor(0, 38, 77);
      doc.rect(0, 0, pageW, 24, 'F');
      if (logo) doc.addImage(logo, 'PNG', margin, 5, 48, 13);
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('REPORTE DE EVALUACIÓN DOCENTE', pageW / 2, 11, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text('Tecnológico de Estudios Superiores de Jocotitlán — SICEI', pageW / 2, 18, { align: 'center' });
    }

    function drawPageFooter(pageNum, totalPages) {
      doc.setDrawColor(200, 210, 220);
      doc.line(margin, pageH - 12, pageW - margin, pageH - 12);
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text(`Semestre: ${periodo}`, margin, pageH - 7);
      doc.text(`Generado: ${fechaGen}`, pageW / 2, pageH - 7, { align: 'center' });
      doc.text(`Página ${pageNum} de ${totalPages}`, pageW - margin, pageH - 7, { align: 'right' });
    }

    drawPageHeader();
    let startY = 32;
    doc.setTextColor(0, 38, 77);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Resumen ejecutivo', margin, startY);
    startY += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    [
      `Docentes evaluados: ${stats.docentes}`,
      `Promedio general: ${stats.promedio.toFixed(2)} / 10`,
      `Carreras participantes: ${stats.carreras} de ${PROGRAMAS.length}`,
      `Avance del semestre: ${stats.avanceSemestre}`,
      `Total de evaluaciones: ${evaluaciones.length}`
    ].forEach((t) => { doc.text(t, margin, startY); startY += 5; });
    startY += 3;

    const body = evaluaciones.map((e, i) => [
      i + 1,
      e.docente,
      e.programa.length > 42 ? e.programa.slice(0, 42) + '…' : e.programa,
      parseFloat(e.calificacion).toFixed(1),
      estadoLabel(e.estado),
      formatFecha(e.fecha)
    ]);

    doc.autoTable({
      startY,
      head: [['#', 'Docente', 'Programa académico', 'Calif.', 'Situación', 'Fecha']],
      body,
      margin: { left: margin, right: margin, top: 28, bottom: 16 },
      styles: { fontSize: 8, cellPadding: 3, textColor: [30, 41, 59], lineColor: [220, 225, 235], lineWidth: 0.2 },
      headStyles: { fillColor: [0, 38, 77], textColor: 255, fontStyle: 'bold', halign: 'center' },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        3: { cellWidth: 15, halign: 'center' },
        4: { cellWidth: 22, halign: 'center' },
        5: { cellWidth: 24, halign: 'center' }
      },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      didDrawPage() {
        drawPageHeader();
      },
      didParseCell(data) {
        if (data.section === 'body' && data.column.index === 2) {
          data.cell.styles.cellWidth = 'auto';
        }
      }
    });

    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      drawPageFooter(i, totalPages);
    }

    doc.save(`Evaluacion_Docente_${getCicloKey()}.pdf`);
    showToast('Reporte PDF descargado correctamente', 'success');
  }

  /* ── EXPORT EXCEL ── */
  function exportToExcel() {
    if (!evaluaciones.length) { showToast('No hay evaluaciones en este semestre. Registre al menos una para descargar el Excel.', 'error'); return; }
    const stats = calcularStats();
    const rows = [
      ['REPORTE DE EVALUACIÓN DOCENTE — TESJo / SICEI'],
      [`Semestre: ${getPeriodoTexto()}`],
      [`Generado: ${new Date().toLocaleString('es-MX')}`], [],
      ['RESUMEN'],
      ['Docentes evaluados', stats.docentes],
      ['Promedio general', stats.promedio.toFixed(2)],
      ['Carreras participantes', stats.carreras],
      ['Avance del semestre', stats.avanceSemestre], [],
      ['#', 'Docente', 'Programa académico', 'Calificación', 'Situación', 'Comentarios', 'Fecha']
    ];
    evaluaciones.forEach((e, i) => rows.push([
      i + 1, e.docente, e.programa, parseFloat(e.calificacion).toFixed(1),
      estadoLabel(e.estado), e.comentarios || '', formatFecha(e.fecha)
    ]));
    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 4 }, { wch: 28 }, { wch: 52 }, { wch: 12 }, { wch: 14 }, { wch: 36 }, { wch: 14 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Evaluación Docente');
    XLSX.writeFile(wb, `Evaluacion_Docente_${getCicloKey()}.xlsx`);
    showToast('Reporte Excel descargado correctamente', 'success');
  }

  /* ── UI: TABS & SIDEBAR ── */
  function initTabs() {
    document.querySelectorAll('.ed-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        const t = tab.dataset.tab;
        document.querySelectorAll('.ed-tab').forEach((el) => {
          el.classList.toggle('is-active', el.dataset.tab === t);
          el.setAttribute('aria-selected', el.dataset.tab === t ? 'true' : 'false');
        });
        document.querySelectorAll('.ed-section').forEach((el) => {
          const active = el.id === `panel${t.charAt(0).toUpperCase() + t.slice(1)}`;
          el.classList.toggle('is-active', active);
          el.hidden = !active;
        });
        if (t === 'dashboard') setTimeout(renderCharts, 50);
      });
    });
  }

  function initSidebar() {
    const body = document.getElementById('edBody');
    const toggle = document.getElementById('edNavToggle');
    const close = document.getElementById('edAsideClose');
    const backdrop = document.getElementById('edBackdrop');
    const mobile = () => window.innerWidth <= 768;

    function closeNav() {
      body.classList.remove('is-nav-open');
      if (backdrop) backdrop.hidden = true;
    }

    toggle?.addEventListener('click', () => {
      if (mobile()) {
        const open = !body.classList.contains('is-nav-open');
        body.classList.toggle('is-nav-open', open);
        if (backdrop) backdrop.hidden = !open;
      } else {
        body.classList.toggle('is-aside-hidden');
      }
    });

    close?.addEventListener('click', closeNav);
    backdrop?.addEventListener('click', closeNav);
    window.addEventListener('resize', () => { if (!mobile()) closeNav(); });
  }

  function initEvents() {
    document.getElementById('btnAgregarFila')?.addEventListener('click', () => abrirModal());
    document.getElementById('btnGuardar')?.addEventListener('click', () => guardarDatos());
    document.getElementById('btnCancelar')?.addEventListener('click', () => {
      if (!confirm('¿Restaurar datos guardados?')) return;
      cargarDatos(); renderAll(); showToast('Datos restaurados', 'info');
    });
    document.getElementById('btnGuardarPDF')?.addEventListener('click', exportToPDF);
    document.getElementById('btnGuardarExcel')?.addEventListener('click', exportToExcel);

    document.getElementById('formEvaluacion')?.addEventListener('submit', guardarEvaluacion);
    document.getElementById('modalClose')?.addEventListener('click', cerrarModal);
    document.getElementById('modalCancel')?.addEventListener('click', cerrarModal);
    document.getElementById('modalOverlay')?.addEventListener('click', (e) => {
      if (e.target.id === 'modalOverlay') cerrarModal();
    });
    document.getElementById('evalCalificacion')?.addEventListener('input', (e) => {
      setText('calificacionLabel', nivelDesempeno(e.target.value));
    });

    document.getElementById('evalSearch')?.addEventListener('input', (e) => {
      ui.search = e.target.value.toLowerCase().trim(); ui.page = 1; renderTable();
    });
    document.getElementById('evalFilterCarrera')?.addEventListener('change', (e) => {
      ui.filterCarrera = e.target.value; ui.page = 1; renderTable();
    });
    document.getElementById('evalFilterStatus')?.addEventListener('change', (e) => {
      ui.filterEstado = e.target.value; ui.page = 1; renderTable();
    });
    document.getElementById('evalPageSize')?.addEventListener('change', (e) => {
      ui.pageSize = Number(e.target.value); ui.page = 1; renderTable();
    });
    document.getElementById('evalPrevPage')?.addEventListener('click', () => {
      if (ui.page > 1) { ui.page--; renderTable(); }
    });
    document.getElementById('evalNextPage')?.addEventListener('click', () => {
      ui.page++; renderTable();
    });

    document.querySelector('#tablaTalleres thead')?.addEventListener('click', (e) => {
      const th = e.target.closest('th.is-sortable');
      if (!th) return;
      const key = th.dataset.sort;
      if (ui.sortKey === key) ui.sortDir = ui.sortDir === 'asc' ? 'desc' : 'asc';
      else { ui.sortKey = key; ui.sortDir = 'asc'; }
      renderTable();
    });

    document.getElementById('tbody')?.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      if (btn.dataset.action === 'edit') abrirModal(btn.dataset.id);
      if (btn.dataset.action === 'delete') eliminarEvaluacion(btn.dataset.id);
    });

    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrarModal(); });
  }

  document.addEventListener('DOMContentLoaded', () => {
    /* Fallback: recargar CSS si no se aplicó */
    const bg = getComputedStyle(document.body).backgroundColor;
    if (bg === 'rgba(0, 0, 0, 0)' || bg === 'rgb(255, 255, 255)') {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/prueba/prueba/MENU/Direccion_Academica/131DeptoDesAcad/EvaluacionD/PrimerEtapa/PrimerEtapa.css?v=6';
      document.head.appendChild(link);
    }

    cargarDatos();
    poblarSelects();
    initPeriodo();
    initSidebar();
    initTabs();
    initEvents();
    renderAll();
  });
})();
