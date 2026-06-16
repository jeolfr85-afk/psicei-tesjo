/**
 * SICEI Module Core — motor UI compartido (Evaluación Docente pattern)
 */
window.SiceiModule = {
  boot(moduleId) {
    const cfg = window.SICEI_CONFIGS?.[moduleId];
    const root = document.getElementById('sicei-app');
    if (!cfg || !root) {
      if (root) root.innerHTML = '<p style="padding:2rem;font-family:sans-serif">Módulo no configurado.</p>';
      return;
    }
    cfg.id = moduleId;
    document.body.classList.add('ed-app');
    document.body.dataset.theme = cfg.theme || 'academico';
    root.innerHTML = '';
    const app = document.createElement('div');
    app.className = 'ed-app-root';
    app.innerHTML = SiceiModule._renderLayout(cfg);
    root.appendChild(app);
    new SiceiModuleApp(cfg).init();
  },

  _renderLayout(c) {
    const nav = (c.nav || []).map((l) =>
      `<a href="${l.href}" class="ed-aside__link${l.active ? ' is-active' : ''}"><i class="bi ${l.icon}"></i><span>${l.label}</span></a>`
    ).join('');

    const kpis = (c.kpis || []).map((k, i) => {
      const icons = { blue: 'ed-kpi__icon--blue', green: 'ed-kpi__icon--green', purple: 'ed-kpi__icon--purple', orange: 'ed-kpi__icon--orange' };
      return `<div class="ed-kpi"><div class="ed-kpi__icon ${icons[k.icon] || icons.blue}"><i class="bi ${k.bi || 'bi-graph-up'}"></i></div><div class="ed-kpi__data"><span class="ed-kpi__label">${k.label}</span><strong class="ed-kpi__num${k.isText ? ' ed-kpi__num--sm' : ''}" id="kpi_${k.id}">0</strong></div></div>`;
    }).join('');

    const charts = (c.charts || []).map((ch) =>
      `<div class="ed-card"><div class="ed-card__head"><h2><i class="bi bi-${ch.type === 'doughnut' ? 'pie-chart' : 'bar-chart'}-fill"></i> ${ch.title}</h2></div><div class="ed-card__body ed-chart-box"><canvas id="${ch.id}"></canvas></div></div>`
    ).join('');

    const tableCols = c.fields.filter((f) => f.table).slice(0, 5);
    const tableHead = tableCols.map((f) =>
      `<th data-sort="${f.key}" class="is-sortable">${f.label} <i class="bi bi-arrow-down-up"></i></th>`
    ).join('') + '<th data-sort="fecha" class="is-sortable">Fecha <i class="bi bi-arrow-down-up"></i></th><th class="ed-col-actions">Acciones</th>';

    const filters = c.fields.filter((f) => f.filter).map((f) => {
      if (f.type === 'programas') {
        return `<select id="filter_${f.key}"><option value="">Todos los programas</option></select>`;
      }
      if (f.type === 'estado') {
        return `<select id="filter_${f.key}"><option value="">Todas las situaciones</option><option value="pendiente">Por realizar</option><option value="completada">Finalizada</option><option value="revisada">Revisada</option></select>`;
      }
      if (f.options) {
        return `<select id="filter_${f.key}"><option value="">Todos</option>${f.options.map((o) => `<option value="${typeof o === 'string' ? o : o.value}">${typeof o === 'string' ? o : o.label}</option>`).join('')}</select>`;
      }
      return '';
    }).join('');

    const modalFields = c.fields.map((f) => SiceiModule._fieldHtml(f)).join('');
    const apiBtn = c.apiSave ? `<button type="button" class="ed-btn ed-btn--secondary" id="btnApiSave"><i class="bi bi-cloud-upload"></i> Guardar en sistema</button>` : '';

    return `
<header class="ed-topbar"><div class="ed-topbar__inner">
  <span class="ed-topbar__brand"><i class="bi bi-mortarboard-fill"></i> TESJo</span>
  <span class="ed-topbar__module">${c.topbar}</span>
</div></header>
<div class="ed-body" id="edBody">
  <div class="ed-backdrop" id="edBackdrop" hidden></div>
  <aside class="ed-aside" id="edAside">
    <div class="ed-aside__header">
      <span class="ed-aside__title"><i class="bi bi-mortarboard-fill"></i> SICEI</span>
      <button type="button" class="ed-aside__close" id="edAsideClose" aria-label="Cerrar menú"><i class="bi bi-x-lg"></i></button>
    </div>
    <nav class="ed-aside__nav">${nav}</nav>
    <div class="ed-aside__period">
      <i class="bi bi-calendar3"></i>
      <div class="ed-period-picker">
        <small>Semestre académico</small>
        <div class="ed-period-picker__row">
          <select id="selAnioPeriodo" aria-label="Año"></select>
          <select id="selSemestrePeriodo" aria-label="Semestre">
            <option value="A">Semestre A (Ago – Dic)</option>
            <option value="B">Semestre B (Ene – Jun)</option>
          </select>
        </div>
        <strong id="periodoValor">—</strong>
      </div>
    </div>
  </aside>
  <main class="ed-main">
    <div class="ed-main-bar">
      <button type="button" class="ed-nav-toggle" id="edNavToggle" aria-label="Menú"><i class="bi bi-list"></i></button>
      <span class="ed-breadcrumb">${c.breadcrumb}</span>
    </div>
    <div class="ed-wrap">
      <header class="ed-header">
        <div class="ed-header__info">
          <span class="ed-tag">${c.tag}</span>
          <h1>${c.title}</h1>
          <p>${c.subtitle}</p>
        </div>
        <div class="ed-header__actions">
          <button type="button" class="ed-btn ed-btn--primary" id="btnNuevo"><i class="bi bi-plus-lg"></i> ${c.newButton || 'Nuevo registro'}</button>
          <button type="button" class="ed-btn ed-btn--secondary" id="btnGuardar"><i class="bi bi-save"></i> Guardar</button>
          ${apiBtn}
          <button type="button" class="ed-btn ed-btn--outline" id="btnPDF"><i class="bi bi-file-earmark-pdf"></i> Descargar PDF</button>
          <button type="button" class="ed-btn ed-btn--outline" id="btnExcel"><i class="bi bi-file-earmark-spreadsheet"></i> Descargar Excel</button>
        </div>
      </header>
      <nav class="ed-tabs" role="tablist">
        <button type="button" class="ed-tab is-active" data-tab="resumen" role="tab"><i class="bi bi-bar-chart-line"></i> Resumen general</button>
        <button type="button" class="ed-tab" data-tab="lista" role="tab"><i class="bi bi-list-ul"></i> Lista de registros</button>
      </nav>
      <section class="ed-section is-active" id="panelResumen" role="tabpanel">
        <div class="ed-kpi-row">${kpis}</div>
        <div class="ed-grid-2">${charts}</div>
        ${c.showResumen !== false ? `<div class="ed-card"><div class="ed-card__head"><h2><i class="bi bi-grid-3x3-gap-fill"></i> Resumen del módulo</h2><span class="ed-card__meta" id="statUltimaActualizacion">Última actualización: —</span></div><div class="ed-card__body ed-table-box"><table class="ed-table" id="tablaResumen"><thead><tr><th>Indicador</th><th>Valor</th></tr></thead><tbody id="tbodyResumen"></tbody></table></div></div>` : ''}
      </section>
      <section class="ed-section" id="panelLista" role="tabpanel" hidden>
        <div class="ed-card">
          <div class="ed-card__head ed-card__head--split">
            <div><h2><i class="bi bi-list-ul"></i> Registros del semestre</h2><p class="ed-card__desc">Consulte, modifique o elimine registros. Use el formulario para capturar.</p></div>
          </div>
          <div class="ed-filters">
            <div class="ed-search"><i class="bi bi-search"></i><input type="search" id="tblSearch" placeholder="Buscar…"></div>
            <div class="ed-filters__group">${filters}<select id="tblPageSize"><option value="10" selected>10 / pág.</option><option value="25">25</option><option value="50">50</option></select></div>
          </div>
          <div class="ed-card__body ed-table-box">
            <table class="ed-table" id="tablaRegistros"><thead><tr>${tableHead}</tr></thead><tbody id="tbody"></tbody></table>
          </div>
          <div class="ed-pager">
            <span id="pagerInfo">Mostrando 0 de 0</span>
            <div class="ed-pager__btns">
              <button type="button" class="ed-pager__btn" id="pagerPrev"><i class="bi bi-chevron-left"></i></button>
              <span id="pagerPage">1 / 1</span>
              <button type="button" class="ed-pager__btn" id="pagerNext"><i class="bi bi-chevron-right"></i></button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>
</div>
<div class="ed-modal-bg" id="modalOverlay" hidden>
  <div class="ed-modal" role="dialog" aria-modal="true">
    <form id="formRegistro" class="ed-modal__form">
      <div class="ed-modal__head">
        <h2 id="modalTitle"><i class="bi bi-plus-circle"></i> Nuevo registro</h2>
        <button type="button" class="ed-modal__x" id="modalClose"><i class="bi bi-x-lg"></i></button>
      </div>
      <div class="ed-modal__body"><input type="hidden" id="field_id"><div class="ed-form-row">${modalFields}</div></div>
      <div class="ed-modal__foot">
        <button type="button" class="ed-btn ed-btn--ghost" id="modalCancel">Cancelar</button>
        <button type="submit" class="ed-btn ed-btn--primary"><i class="bi bi-check-lg"></i> Guardar registro</button>
      </div>
    </form>
  </div>
</div>
<div class="ed-toast" id="toast" role="status"></div>
<footer class="ed-site-footer"><p>© Copyright 2025 TESJo — Todos los Derechos Reservados</p><img src="/prueba/prueba/MENU/images/pagg.png" alt="Logo TESJo"></footer>`;
  },

  _fieldHtml(f) {
    const req = f.required ? ' <em>*</em>' : '';
    const cls = f.full ? 'ed-field ed-field--full' : 'ed-field';
    const id = `field_${f.key}`;
    let input = '';
    if (f.type === 'programas') {
      input = `<select id="${id}"><option value="">Seleccione…</option></select>`;
    } else if (f.type === 'estado') {
      input = `<select id="${id}"><option value="pendiente">Por realizar</option><option value="completada" selected>Finalizada</option><option value="revisada">Revisada</option></select>`;
    } else if (f.type === 'select') {
      const opts = (f.options || []).map((o) => typeof o === 'string' ? `<option value="${o}">${o}</option>` : `<option value="${o.value}">${o.label}</option>`).join('');
      input = `<select id="${id}"><option value="">Seleccione…</option>${opts}</select>`;
    } else if (f.type === 'textarea') {
      input = `<textarea id="${id}" rows="3" maxlength="500"></textarea>`;
    } else if (f.type === 'number') {
      input = `<input type="number" id="${id}" min="0" step="any">`;
    } else if (f.type === 'date') {
      input = `<input type="date" id="${id}">`;
    } else {
      input = `<input type="text" id="${id}">`;
    }
    return `<div class="${cls}"><label for="${id}">${f.label}${req}</label>${input}<span class="ed-field__err" id="err_${f.key}"></span></div>`;
  }
};

class SiceiModuleApp {
  constructor(cfg) {
    this.cfg = cfg;
    this.records = [];
    this.ui = { page: 1, pageSize: 10, search: '', sortKey: 'fecha', sortDir: 'desc', editingId: null, filters: {} };
    this.charts = {};
    this.PERIODO_KEY = 'sicei_periodo_' + cfg.id;
    this.META_KEY = 'sicei_meta_' + cfg.id;
  }

  init() {
    this.initPeriodo();
    this.populateSelects();
    this.loadData();
    this.initSidebar();
    this.initTabs();
    this.bindEvents();
    this.renderAll();
  }

  /* ── Periodo TESJo ── */
  semestreActual() {
    const mes = new Date().getMonth() + 1;
    return { anio: new Date().getFullYear(), semestre: (mes >= 1 && mes <= 6) ? 'B' : 'A' };
  }

  getPeriodo() {
    try {
      const raw = localStorage.getItem(this.PERIODO_KEY) || localStorage.getItem('evaluacionDocente_periodo');
      if (raw) { const p = JSON.parse(raw); if (p.anio && p.semestre) return p; }
    } catch { /* */ }
    return this.semestreActual();
  }

  cicloKey() {
    const p = this.getPeriodo();
    return `${p.anio}-${p.semestre}`;
  }

  periodoTexto(largo) {
    const p = this.getPeriodo();
    const info = window.SICEI_SEMESTRES[p.semestre] || window.SICEI_SEMESTRES.A;
    return largo ? `${info.nombre} ${p.anio} (${info.meses})` : `${info.nombre} · ${info.meses} ${p.anio}`;
  }

  savePeriodo(anio, semestre) {
    const payload = { anio: Number(anio), semestre };
    localStorage.setItem(this.PERIODO_KEY, JSON.stringify(payload));
    localStorage.setItem('evaluacionDocente_periodo', JSON.stringify(payload));
    localStorage.setItem('cicloEscolarSeleccionado', `${payload.anio}-${payload.semestre}`);
  }

  initPeriodo() {
    if (!localStorage.getItem(this.PERIODO_KEY) && !localStorage.getItem('evaluacionDocente_periodo')) {
      const d = this.semestreActual();
      this.savePeriodo(d.anio, d.semestre);
    }
    const p = this.getPeriodo();
    const selA = document.getElementById('selAnioPeriodo');
    const selS = document.getElementById('selSemestrePeriodo');
    if (selA) {
      selA.innerHTML = '';
      for (let y = p.anio + 1; y >= p.anio - 4; y--) {
        const o = document.createElement('option');
        o.value = y; o.textContent = `Año ${y}`;
        if (y === p.anio) o.selected = true;
        selA.appendChild(o);
      }
    }
    if (selS) selS.value = p.semestre;
    this.setText('periodoValor', this.periodoTexto(false));
    const apply = () => {
      this.savePeriodo(selA.value, selS.value);
      this.setText('periodoValor', this.periodoTexto(false));
      this.loadData();
      this.renderAll();
      this.toast(`Semestre: ${this.periodoTexto(true)}`, 'success');
    };
    selA?.addEventListener('change', apply);
    selS?.addEventListener('change', apply);
  }

  storageKey() { return this.cfg.storagePrefix + this.cicloKey(); }

  loadData() {
    try {
      const raw = localStorage.getItem(this.storageKey());
      if (raw) {
        this.records = window.SiceiAdapters.fromStorePayload(JSON.parse(raw), this.cfg);
      } else {
        const migrated = window.SiceiAdapters.tryMigrate(this.cfg, this.cicloKey());
        this.records = migrated || [];
      }
    } catch { this.records = []; }

    if (!this.records.length) {
      const seeds = this.cfg.seedRecords
        || (window.SICEI_DEFAULT_DATA && window.SICEI_DEFAULT_DATA[this.cfg.storagePrefix]);
      if (Array.isArray(seeds) && seeds.length) {
        this.records = window.SiceiAdapters.fromStorePayload({ registros: seeds }, this.cfg);
        this.saveData(true);
      }
    }
  }

  saveData(silent) {
    const payload = { registros: this.records, version: 1, savedAt: new Date().toISOString() };
    localStorage.setItem(this.storageKey(), JSON.stringify(payload));
    const meta = JSON.parse(localStorage.getItem(this.META_KEY) || '{}');
    meta[this.cicloKey()] = { updatedAt: payload.savedAt };
    localStorage.setItem(this.META_KEY, JSON.stringify(meta));
    this.renderAll();
    if (!silent) this.toast('Datos guardados correctamente', 'success');
  }

  /* ── Utilidades ── */
  esc(s) { const d = document.createElement('div'); d.textContent = s ?? ''; return d.innerHTML; }
  setText(id, v) { const el = document.getElementById(id); if (el) el.textContent = v; }
  toast(msg, type) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.className = 'ed-toast is-visible' + (type === 'success' ? ' is-success' : type === 'error' ? ' is-error' : '');
    clearTimeout(this._toastT);
    this._toastT = setTimeout(() => el.classList.remove('is-visible'), 3200);
  }
  fmtDate(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
  }
  fmtDateTime(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? '—' : d.toLocaleString('es-MX', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
  estadoLabel(e) {
    return { pendiente: 'Por realizar', completada: 'Finalizada', revisada: 'Revisada' }[e] || e;
  }
  cellVal(rec, f) {
    const v = rec[f.key];
    if (f.type === 'estado') return this.estadoLabel(v);
    if (f.type === 'date') return this.fmtDate(v);
    if (typeof v === 'string' && v.length > 42) return v.slice(0, 42) + '…';
    return v ?? '—';
  }

  avanceSemestre() {
    const progs = window.SICEI_PROGRAMAS || [];
    const used = new Set(this.records.map((r) => r.programa).filter(Boolean));
    const pct = progs.length ? Math.round((used.size / progs.length) * 100) : 0;
    if (!this.records.length) return 'Sin iniciar';
    if (pct >= 100) return 'Completado';
    if (pct >= 50) return `Avance ${pct}%`;
    return 'En progreso';
  }

  populateSelects() {
    this.cfg.fields.filter((f) => f.type === 'programas').forEach((f) => {
      [`field_${f.key}`, `filter_${f.key}`].forEach((id) => {
        const sel = document.getElementById(id);
        if (!sel) return;
        const cur = sel.value;
        const allLabel = id.startsWith('filter') ? 'Todos los programas' : 'Seleccione…';
        sel.innerHTML = `<option value="">${allLabel}</option>` +
          (window.SICEI_PROGRAMAS || []).map((p) => `<option value="${this.esc(p)}">${this.esc(p.length > 50 ? p.slice(0, 50) + '…' : p)}</option>`).join('');
        if (cur) sel.value = cur;
      });
    });
  }

  /* ── Render ── */
  renderAll() {
    this.renderResumen();
    this.renderTable();
  }

  renderResumen() {
    const ctx = { avanceSemestre: this.avanceSemestre() };
    (this.cfg.kpis || []).forEach((k) => {
      const val = k.calc(this.records, ctx);
      this.setText(`kpi_${k.id}`, k.isText ? val : String(val));
    });
    const meta = JSON.parse(localStorage.getItem(this.META_KEY) || '{}');
    this.setText('statUltimaActualizacion', `Última actualización: ${this.fmtDateTime(meta[this.cicloKey()]?.updatedAt)}`);
    const tbody = document.getElementById('tbodyResumen');
    if (tbody) {
      tbody.innerHTML = [
        ['Registros en el semestre', this.records.length],
        ['Semestre activo', this.periodoTexto(true)],
        ['Avance del semestre', ctx.avanceSemestre]
      ].map(([a, b]) => `<tr><td>${a}</td><td><strong>${b}</strong></td></tr>`).join('');
    }
    this.renderCharts();
  }

  renderCharts() {
    if (typeof Chart === 'undefined') return;
    (this.cfg.charts || []).forEach((ch) => {
      const canvas = document.getElementById(ch.id);
      if (!canvas) return;
      const grouped = {};
      this.records.forEach((r) => {
        const k = r[ch.groupBy] || 'Sin dato';
        if (!grouped[k]) grouped[k] = ch.aggregate === 'sum' ? 0 : 0;
        if (ch.aggregate === 'sum') grouped[k] += parseFloat(r[ch.field || 'cantidad']) || 0;
        else grouped[k]++;
      });
      let labels = Object.keys(grouped);
      let data = labels.map((l) => grouped[l]);
      if (ch.labels) labels = labels.map((l) => ch.labels[l] || l);
      if (ch.limit) { labels = labels.slice(0, ch.limit); data = data.slice(0, ch.limit); }
      if (!labels.length) { labels = ['Sin datos']; data = [0]; }
      if (this.charts[ch.id]) this.charts[ch.id].destroy();
      this.charts[ch.id] = new Chart(canvas, {
        type: ch.type,
        data: {
          labels: labels.map((l) => l.length > 24 ? l.slice(0, 24) + '…' : l),
          datasets: [{ data, backgroundColor: ch.type === 'doughnut' ? ['#fbbf24', '#22c55e', '#3b82f6', '#a855f7', '#f97316'] : 'rgba(29,71,169,.8)', borderRadius: ch.type === 'bar' ? 5 : 0, borderWidth: 0 }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: ch.type === 'doughnut', position: 'bottom' } },
          scales: ch.type === 'bar' ? { y: { beginAtZero: true, grid: { color: '#eef2f7' } }, x: { grid: { display: false } } } : {}
        }
      });
    });
  }

  getFiltered() {
    let list = [...this.records];
    if (this.ui.search) {
      const q = this.ui.search;
      list = list.filter((r) => Object.values(r).some((v) => String(v ?? '').toLowerCase().includes(q)));
    }
    Object.entries(this.ui.filters).forEach(([k, v]) => { if (v) list = list.filter((r) => r[k] === v); });
    list.sort((a, b) => {
      let av = a[this.ui.sortKey], bv = b[this.ui.sortKey];
      if (this.ui.sortKey === 'fecha') { av = new Date(av).getTime(); bv = new Date(bv).getTime(); }
      if (typeof av === 'string') { av = av.toLowerCase(); bv = (bv || '').toLowerCase(); }
      if (av < bv) return this.ui.sortDir === 'asc' ? -1 : 1;
      if (av > bv) return this.ui.sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  }

  renderTable() {
    const tbody = document.getElementById('tbody');
    if (!tbody) return;
    const cols = this.cfg.fields.filter((f) => f.table).slice(0, 5);
    const filtered = this.getFiltered();
    const pages = Math.max(1, Math.ceil(filtered.length / this.ui.pageSize));
    if (this.ui.page > pages) this.ui.page = pages;
    const slice = filtered.slice((this.ui.page - 1) * this.ui.pageSize, this.ui.page * this.ui.pageSize);

    if (!slice.length) {
      tbody.innerHTML = `<tr><td colspan="${cols.length + 2}" class="ed-empty"><i class="bi bi-inbox"></i>No se encontraron registros.</td></tr>`;
    } else {
      tbody.innerHTML = slice.map((r) => {
        const cells = cols.map((f) => {
          if (f.type === 'estado') return `<td><span class="ed-badge ed-badge--${r.estado}">${this.estadoLabel(r.estado)}</span></td>`;
          return `<td>${this.esc(this.cellVal(r, f))}</td>`;
        }).join('');
        return `<tr>${cells}<td>${this.fmtDate(r.fecha)}</td><td><div class="ed-actions">
          <button type="button" class="ed-act-btn" data-edit="${r.id}"><i class="bi bi-pencil"></i></button>
          <button type="button" class="ed-act-btn ed-act-btn--del" data-del="${r.id}"><i class="bi bi-trash"></i></button></div></td></tr>`;
      }).join('');
    }
    this.setText('pagerInfo', `Mostrando ${slice.length} de ${filtered.length} registros`);
    this.setText('pagerPage', `${this.ui.page} / ${pages}`);
    document.getElementById('pagerPrev').disabled = this.ui.page <= 1;
    document.getElementById('pagerNext').disabled = this.ui.page >= pages;
  }

  /* ── Modal CRUD ── */
  openModal(id) {
    this.ui.editingId = id || null;
    document.getElementById('formRegistro').reset();
    this.cfg.fields.forEach((f) => this.setText(`err_${f.key}`, ''));
    const title = document.getElementById('modalTitle');
    if (id) {
      const rec = this.records.find((r) => r.id === id);
      if (!rec) return;
      title.innerHTML = '<i class="bi bi-pencil-square"></i> Editar registro';
      document.getElementById('field_id').value = id;
      this.cfg.fields.forEach((f) => {
        const el = document.getElementById(`field_${f.key}`);
        if (el) el.value = rec[f.key] ?? '';
      });
    } else {
      title.innerHTML = `<i class="bi bi-plus-circle"></i> ${this.cfg.newButton || 'Nuevo registro'}`;
      document.getElementById('field_id').value = '';
      const est = this.cfg.fields.find((f) => f.type === 'estado');
      if (est) { const el = document.getElementById(`field_${est.key}`); if (el) el.value = 'completada'; }
    }
    document.getElementById('modalOverlay').hidden = false;
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    document.getElementById('modalOverlay').hidden = true;
    document.body.style.overflow = '';
    this.ui.editingId = null;
  }

  saveRecord(e) {
    e.preventDefault();
    let ok = true;
    const rec = { id: document.getElementById('field_id').value || window.SiceiAdapters.uid(), fecha: new Date().toISOString() };
    this.cfg.fields.forEach((f) => {
      this.setText(`err_${f.key}`, '');
      const el = document.getElementById(`field_${f.key}`);
      const val = f.type === 'number' ? (el?.value === '' ? '' : Number(el.value)) : (el?.value?.trim?.() ?? el?.value ?? '');
      if (f.required && (val === '' || val === null || val === undefined)) {
        this.setText(`err_${f.key}`, 'Campo requerido.');
        ok = false;
      }
      rec[f.key] = val;
    });
    if (!ok) return;
    const wasEdit = !!this.ui.editingId;
    if (wasEdit) {
      const prev = this.records.find((r) => r.id === rec.id);
      if (prev) rec.fecha = prev.fecha;
      const idx = this.records.findIndex((r) => r.id === rec.id);
      if (idx >= 0) this.records[idx] = rec; else this.records.push(rec);
    } else {
      this.records.push(rec);
    }
    this.closeModal();
    this.saveData(true);
    this.toast(wasEdit ? 'Registro actualizado' : 'Registro guardado', 'success');
  }

  deleteRecord(id) {
    const rec = this.records.find((r) => r.id === id);
    const name = rec ? (rec.nombre || rec.participante || rec.nombreProyecto || rec.nombreCurso || 'este registro') : 'este registro';
    if (!confirm(`¿Eliminar ${name}?`)) return;
    this.records = this.records.filter((r) => r.id !== id);
    this.saveData(true);
    this.toast('Registro eliminado', 'success');
  }

  async saveToApi() {
    if (!this.cfg.apiSave || !this.records.length) {
      this.toast('No hay registros para enviar al sistema.', 'error');
      return;
    }
    try {
      const res = await fetch(`${this.cfg.apiSave.url}?action=save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ module: this.cfg.apiSave.module, rows: this.records })
      });
      const data = await res.json();
      if (data.error) { this.toast(data.error, 'error'); return; }
      this.toast('Registros guardados en el sistema', 'success');
    } catch {
      this.toast('No se pudo conectar con el servidor.', 'error');
    }
  }

  /* ── Export PDF / Excel ── */
  async loadLogo() {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = this.cfg.logo;
    });
  }

  async exportPDF() {
    if (!this.records.length) { this.toast('Registre al menos un dato para descargar el PDF.', 'error'); return; }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'letter' });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 15;
    const logo = await this.loadLogo();
    const periodo = this.periodoTexto(true);
    const fechaGen = new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' });

    const drawHeader = () => {
      doc.setFillColor(0, 38, 77);
      doc.rect(0, 0, pageW, 24, 'F');
      if (logo) doc.addImage(logo, 'PNG', margin, 5, 48, 13);
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(this.cfg.title.toUpperCase(), pageW / 2, 11, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text('Tecnológico de Estudios Superiores de Jocotitlán — SICEI', pageW / 2, 18, { align: 'center' });
    };

    const drawFooter = (n, total) => {
      doc.setDrawColor(200, 210, 220);
      doc.line(margin, pageH - 12, pageW - margin, pageH - 12);
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text(`Semestre: ${periodo}`, margin, pageH - 7);
      doc.text(`Generado: ${fechaGen}`, pageW / 2, pageH - 7, { align: 'center' });
      doc.text(`Página ${n} de ${total}`, pageW - margin, pageH - 7, { align: 'right' });
    };

    drawHeader();
    let y = 32;
    doc.setTextColor(0, 38, 77);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Resumen ejecutivo', margin, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    [`Total de registros: ${this.records.length}`, `Avance del semestre: ${this.avanceSemestre()}`].forEach((t) => { doc.text(t, margin, y); y += 5; });
    y += 3;

    const exportFields = this.cfg.fields.filter((f) => f.table || f.required).slice(0, 8);
    const head = ['#', ...exportFields.map((f) => f.label.length > 18 ? f.label.slice(0, 18) + '.' : f.label), 'Fecha'];
    const body = this.records.map((r, i) => [i + 1, ...exportFields.map((f) => String(this.cellVal(r, f)).slice(0, 40)), this.fmtDate(r.fecha)]);

    doc.autoTable({
      startY: y, head: [head], body,
      margin: { left: margin, right: margin, top: 28, bottom: 16 },
      styles: { fontSize: 7, cellPadding: 2.5, textColor: [30, 41, 59], lineColor: [220, 225, 235], lineWidth: 0.2 },
      headStyles: { fillColor: [0, 38, 77], textColor: 255, fontStyle: 'bold', halign: 'center' },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      didDrawPage: drawHeader
    });

    const total = doc.internal.getNumberOfPages();
    for (let i = 1; i <= total; i++) { doc.setPage(i); drawFooter(i, total); }
    doc.save(`${this.cfg.exportBase}_${this.cicloKey()}.pdf`);
    this.toast('Reporte PDF descargado', 'success');
  }

  exportExcel() {
    if (!this.records.length) { this.toast('Registre al menos un dato para descargar el Excel.', 'error'); return; }
    const exportFields = this.cfg.fields;
    const rows = [
      [`REPORTE — ${this.cfg.title} — TESJo / SICEI`],
      [`Semestre: ${this.periodoTexto(true)}`],
      [`Generado: ${new Date().toLocaleString('es-MX')}`], [],
      ['#', ...exportFields.map((f) => f.label), 'Fecha registro']
    ];
    this.records.forEach((r, i) => {
      rows.push([i + 1, ...exportFields.map((f) => r[f.key] ?? ''), this.fmtDate(r.fecha)]);
    });
    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = exportFields.map(() => ({ wch: 18 }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, this.cfg.title.slice(0, 31));
    XLSX.writeFile(wb, `${this.cfg.exportBase}_${this.cicloKey()}.xlsx`);
    this.toast('Reporte Excel descargado', 'success');
  }

  /* ── Events ── */
  initTabs() {
    document.querySelectorAll('.ed-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        const t = tab.dataset.tab;
        document.querySelectorAll('.ed-tab').forEach((el) => {
          el.classList.toggle('is-active', el.dataset.tab === t);
        });
        document.getElementById('panelResumen').classList.toggle('is-active', t === 'resumen');
        document.getElementById('panelResumen').hidden = t !== 'resumen';
        document.getElementById('panelLista').classList.toggle('is-active', t === 'lista');
        document.getElementById('panelLista').hidden = t !== 'lista';
        if (t === 'resumen') setTimeout(() => this.renderCharts(), 50);
      });
    });
  }

  initSidebar() {
    const body = document.getElementById('edBody');
    const mobile = () => window.innerWidth <= 768;
    document.getElementById('edNavToggle')?.addEventListener('click', () => {
      if (mobile()) {
        const open = !body.classList.contains('is-nav-open');
        body.classList.toggle('is-nav-open', open);
        document.getElementById('edBackdrop').hidden = !open;
      } else body.classList.toggle('is-aside-hidden');
    });
    const close = () => { body.classList.remove('is-nav-open'); document.getElementById('edBackdrop').hidden = true; };
    document.getElementById('edAsideClose')?.addEventListener('click', close);
    document.getElementById('edBackdrop')?.addEventListener('click', close);
  }

  bindEvents() {
    document.getElementById('btnNuevo')?.addEventListener('click', () => this.openModal());
    document.getElementById('btnGuardar')?.addEventListener('click', () => this.saveData());
    document.getElementById('btnPDF')?.addEventListener('click', () => this.exportPDF());
    document.getElementById('btnExcel')?.addEventListener('click', () => this.exportExcel());
    document.getElementById('btnApiSave')?.addEventListener('click', () => this.saveToApi());
    document.getElementById('formRegistro')?.addEventListener('submit', (e) => this.saveRecord(e));
    document.getElementById('modalClose')?.addEventListener('click', () => this.closeModal());
    document.getElementById('modalCancel')?.addEventListener('click', () => this.closeModal());
    document.getElementById('modalOverlay')?.addEventListener('click', (e) => { if (e.target.id === 'modalOverlay') this.closeModal(); });
    document.getElementById('tblSearch')?.addEventListener('input', (e) => { this.ui.search = e.target.value.toLowerCase().trim(); this.ui.page = 1; this.renderTable(); });
    document.getElementById('tblPageSize')?.addEventListener('change', (e) => { this.ui.pageSize = Number(e.target.value); this.ui.page = 1; this.renderTable(); });
    document.getElementById('pagerPrev')?.addEventListener('click', () => { if (this.ui.page > 1) { this.ui.page--; this.renderTable(); } });
    document.getElementById('pagerNext')?.addEventListener('click', () => { this.ui.page++; this.renderTable(); });
    this.cfg.fields.filter((f) => f.filter).forEach((f) => {
      document.getElementById(`filter_${f.key}`)?.addEventListener('change', (e) => {
        this.ui.filters[f.key] = e.target.value;
        this.ui.page = 1;
        this.renderTable();
      });
    });
    document.querySelector('#tablaRegistros thead')?.addEventListener('click', (e) => {
      const th = e.target.closest('th.is-sortable');
      if (!th) return;
      const key = th.dataset.sort;
      if (this.ui.sortKey === key) this.ui.sortDir = this.ui.sortDir === 'asc' ? 'desc' : 'asc';
      else { this.ui.sortKey = key; this.ui.sortDir = 'asc'; }
      this.renderTable();
    });
    document.getElementById('tbody')?.addEventListener('click', (e) => {
      const edit = e.target.closest('[data-edit]');
      const del = e.target.closest('[data-del]');
      if (edit) this.openModal(edit.dataset.edit);
      if (del) this.deleteRecord(del.dataset.del);
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') this.closeModal(); });
  }
}
