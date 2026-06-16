/**
 * Adaptadores de datos — migración desde formatos legacy sin perder información
 */
window.SiceiAdapters = {
  uid() {
    return 'rec_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  },

  normalizeRecord(raw, cfg) {
    const rec = Object.assign({ id: raw.id || this.uid(), estado: raw.estado || 'completada', fecha: raw.fecha || new Date().toISOString() }, raw);
    cfg.fields.forEach((f) => {
      if (rec[f.key] === undefined) rec[f.key] = '';
    });
    return rec;
  },

  fromStorePayload(data, cfg) {
    if (!data) return [];
    if (Array.isArray(data.registros)) return data.registros.map((r) => this.normalizeRecord(r, cfg));
    if (Array.isArray(data.evaluaciones)) return data.evaluaciones.map((r) => this.normalizeRecord(r, cfg));
    if (Array.isArray(data.rows)) return data.rows.map((r) => this.normalizeRecord(r, cfg));
    return [];
  },

  legacyKeys(cfg) {
    const id = cfg.id || '';
    const map = {
      'alumnos-eventos': ['alumnosEventos', 'AlumnosEventos'],
      'capacita-doc-acad': ['capacitaDoc', 'CapacitaDoc'],
      'tele-hardware': ['teleHardware', 'telehard'],
      'tele-software': ['teleSoftware', 'telesof'],
      'recursos-info': ['recursosInfo', 'recursos'],
      'proy-investigacion': ['proyInv', 'ProyInv'],
      'plantilla-inv': ['plantInv', 'PlantInv'],
      'snii': ['snii', 'SNI'],
      'act-deportivas': ['actDep', 'activDep'],
      'act-culturales': ['actCul', 'activCul'],
      'cursos-continua': ['cursosContinua', 'cursos'],
      'proy-vinculacion': ['proyVinculacion'],
      'servicio-comunidad': ['servicioComunidad'],
      'servicio-social': ['servicioSocial'],
      'residencia-prof': ['residenciaProf'],
      'cap-doc-difusion': ['capDocDifusion'],
      'cap-directivo': ['capDirectivo']
    };
    return map[id] || [];
  },

  tryMigrate(cfg, cicloKey) {
    const found = [];
    const prefixes = [cfg.storagePrefix, ...this.legacyKeys(cfg).map((k) => k + '_'), ...this.legacyKeys(cfg)];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      const match = prefixes.some((p) => key.startsWith(p) || key === p);
      if (!match) continue;
      try {
        const raw = JSON.parse(localStorage.getItem(key));
        const rows = this.fromStorePayload(raw, cfg);
        if (rows.length) found.push(...rows);
      } catch { /* ignorar */ }
    }

    if (!found.length) return null;
    const byId = {};
    found.forEach((r) => { byId[r.id] = r; });
    return Object.values(byId);
  }
};
