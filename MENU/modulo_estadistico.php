<?php
require_once __DIR__ . '/../API/config.php';
psiceiStartSession();

if (!isset($_SESSION['usuario'])) {
  header("Location: /prueba/prueba/LOGIN/login.php?error=Inicia sesión para continuar.");
  exit();
}

$area = (string)($_SESSION['area'] ?? '');
$subarea = (string)($_SESSION['subarea'] ?? '');
$usuario = (string)($_SESSION['usuario'] ?? '');
$module = trim((string)($_GET['module'] ?? 'Módulo Estadístico'));
if ($module === '') $module = 'Módulo Estadístico';
?>
<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title><?php echo htmlspecialchars($module); ?> - PSICEI</title>
  <link rel="stylesheet" href="/prueba/prueba/assets/css/global.css" />
  <link rel="stylesheet" href="/prueba/prueba/assets/css/psicei-theme.css" />
  <style>
    .wrap { max-width: 1200px; margin: 110px auto 40px; padding: 0 16px; }
    .hero { background: linear-gradient(135deg,#00264D,#1d47A9); color:#fff; border-radius:14px; padding:22px; margin-bottom:16px; }
    .hero h1 { font-size:1.45rem; margin-bottom:6px; }
    .rowx { display:flex; gap:10px; flex-wrap:wrap; margin-top:10px; }
    .card { background:#fff; border-radius:12px; padding:16px; box-shadow:0 4px 18px rgba(0,0,0,.08); margin-top:14px; }
    .btn2 { background:#0b2f6a; color:#fff; border:none; padding:10px 14px; border-radius:10px; font-weight:800; cursor:pointer; text-decoration:none; display:inline-flex; align-items:center; }
    .btn2.secondary { background:#334155; }
    .btn2.warn { background:#b45309; }
    .btn2.danger { background:#7f1d1d; }
    .tbl-wrap { overflow:auto; border:1px solid #dbe2ea; border-radius:12px; }
    table { width:100%; border-collapse:collapse; min-width:900px; }
    th,td { border-bottom:1px solid #eef2f7; padding:8px; text-align:left; }
    th { background:#f8fafc; font-weight:800; color:#0b2f6a; }
    td input, td textarea { width:100%; border:1px solid #d6dbe6; border-radius:8px; padding:8px; font-family:inherit; }
    td textarea { min-height:44px; resize:vertical; }
    .muted { color:#64748b; }
    .pill { background:#0b2f6a; color:#fff; border-radius:999px; padding:6px 10px; font-weight:800; font-size:.85rem; }
    .kpi { display:flex; gap:8px; align-items:center; margin-top:10px; }
    pre { background:#0b1220; color:#dbeafe; padding:12px; border-radius:10px; max-height:280px; overflow:auto; }
  </style>
</head>
<body data-user-area="<?php echo htmlspecialchars($area); ?>" data-user-subarea="<?php echo htmlspecialchars($subarea); ?>" data-user-name="<?php echo htmlspecialchars($usuario); ?>">
  <div class="top-bar">
    <img src="/prueba/prueba/MENU/images/enkabezado.png" alt="Encabezado" class="escudo" />
  </div>

  <div class="wrap">
    <div class="hero">
      <h1><?php echo htmlspecialchars($module); ?></h1>
      <p>Captura, organiza y descarga datos estadísticos de forma rápida y sencilla.</p>
      <p><strong>Área:</strong> <?php echo htmlspecialchars($area ?: 'Sin área'); ?><?php if ($subarea !== ''): ?> | <strong>Subárea:</strong> <?php echo htmlspecialchars($subarea); ?><?php endif; ?></p>
      <div class="rowx">
        <a class="btn2 secondary" href="/prueba/prueba/MENU/portal.php">Inicio</a>
        <a class="btn2 secondary" href="/prueba/prueba/MENU/records_history.php">Historial de registros</a>
        <a class="btn2 secondary" href="/prueba/prueba/MENU/estadisticas.php">Estadísticas</a>
      </div>
    </div>

    <div class="card">
      <h3 style="margin-bottom:8px;color:#00264D;">Tabla de captura</h3>
      <p class="muted">Puedes agregar filas, editar valores, guardar en el sistema y descargar en Excel o PDF.</p>
      <div class="rowx">
        <button class="btn2" id="btnAdd">Agregar fila</button>
        <button class="btn2 warn" id="btnSave">Guardar en sistema</button>
        <button class="btn2 secondary" id="btnExcel">Descargar Excel</button>
        <button class="btn2 secondary" id="btnPDF">Descargar PDF</button>
        <button class="btn2 danger" id="btnClear">Limpiar tabla</button>
      </div>
      <div class="kpi">
        <span class="pill" id="kpiRows">0 filas</span>
        <span class="muted" id="msg"></span>
      </div>
      <div class="tbl-wrap" style="margin-top:12px;">
        <table id="tbl">
          <thead>
            <tr>
              <th>Indicador</th>
              <th>Periodo</th>
              <th>Meta</th>
              <th>Avance</th>
              <th>Responsable</th>
              <th>Observaciones</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody id="tb"></tbody>
        </table>
      </div>
    </div>

    <div class="card">
      <h3 style="margin-bottom:8px;color:#00264D;">Últimos registros guardados de este módulo</h3>
      <pre id="recent">Cargando...</pre>
    </div>
  </div>

  <script>
    const RECORDS_API = '/prueba/prueba/API/records.php';
    const MODULE = <?php echo json_encode($module, JSON_UNESCAPED_UNICODE); ?>;
    const AREA = document.body.dataset.userArea || '';
    const USER = document.body.dataset.userName || '';

    function esc(v) { return String(v ?? '').replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c])); }

    function updateCount() {
      const c = document.querySelectorAll('#tb tr').length;
      document.getElementById('kpiRows').textContent = `${c} fila${c === 1 ? '' : 's'}`;
    }

    function addRow(data = {}) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><input data-k="indicador" value="${esc(data.indicador || '')}" placeholder="Ej. Cobertura de atención" /></td>
        <td><input data-k="periodo" value="${esc(data.periodo || '')}" placeholder="Ej. 2026-A" /></td>
        <td><input data-k="meta" type="number" value="${esc(data.meta || '')}" placeholder="0" /></td>
        <td><input data-k="avance" type="number" value="${esc(data.avance || '')}" placeholder="0" /></td>
        <td><input data-k="responsable" value="${esc(data.responsable || USER)}" placeholder="Nombre responsable" /></td>
        <td><textarea data-k="observaciones" placeholder="Comentarios">${esc(data.observaciones || '')}</textarea></td>
        <td><button class="btn2 danger btnDel" type="button">Quitar</button></td>
      `;
      document.getElementById('tb').appendChild(tr);
      updateCount();
    }

    function rowsData() {
      const rows = [];
      document.querySelectorAll('#tb tr').forEach((tr) => {
        const row = {};
        tr.querySelectorAll('[data-k]').forEach((i) => row[i.dataset.k] = i.value.trim());
        if (Object.values(row).some(v => v !== '')) rows.push(row);
      });
      return rows;
    }

    async function saveRows() {
      const rows = rowsData();
      if (!rows.length) return setMsg('Agrega al menos una fila con datos.', true);
      const res = await fetch(`${RECORDS_API}?action=save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ module: MODULE, rows })
      });
      const data = await res.json();
      if (data.error) return setMsg(data.error, true);
      setMsg('Datos guardados correctamente.');
      await loadRecent();
    }

    function setMsg(msg, isErr = false) {
      const el = document.getElementById('msg');
      el.style.color = isErr ? '#b91c1c' : '#166534';
      el.textContent = msg;
    }

    function download(type) {
      const url = `${RECORDS_API}?action=export&type=${encodeURIComponent(type)}&area=${encodeURIComponent(AREA)}&module=${encodeURIComponent(MODULE)}`;
      window.open(url, '_blank');
    }

    async function loadRecent() {
      const res = await fetch(`${RECORDS_API}?action=list&area=${encodeURIComponent(AREA)}&module=${encodeURIComponent(MODULE)}&limit=5`);
      const data = await res.json();
      if (data.error) {
        document.getElementById('recent').textContent = data.error;
        return;
      }
      const out = (data.rows || []).map((r, idx) => `${idx + 1}) ${r.modulo} | ${r.created_at}\n${r.payload_json}\n`).join('\n');
      document.getElementById('recent').textContent = out || 'Aún no hay registros guardados para este módulo.';
    }

    document.getElementById('btnAdd').onclick = () => addRow({ periodo: '2026-A', responsable: USER });
    document.getElementById('btnSave').onclick = saveRows;
    document.getElementById('btnExcel').onclick = () => download('excel');
    document.getElementById('btnPDF').onclick = () => download('pdf');
    document.getElementById('btnClear').onclick = () => {
      if (!confirm('¿Seguro que deseas limpiar la tabla?')) return;
      document.getElementById('tb').innerHTML = '';
      updateCount();
      setMsg('Tabla limpia.');
    };
    document.getElementById('tb').addEventListener('click', (e) => {
      const b = e.target.closest('.btnDel');
      if (!b) return;
      const tr = b.closest('tr');
      tr?.remove();
      updateCount();
    });

    // Filas iniciales
    addRow({ indicador: 'Cobertura de servicio', periodo: '2026-A', meta: '100', avance: '75', responsable: USER, observaciones: '' });
    addRow({ indicador: 'Atenciones registradas', periodo: '2026-A', meta: '250', avance: '160', responsable: USER, observaciones: '' });
    loadRecent();
  </script>
  <script src="/prueba/prueba/assets/js/psicei-ui.js"></script>
  <script src="/prueba/prueba/assets/js/gemini-ai.js"></script>
</body>
</html>

