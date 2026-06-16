<?php
require_once __DIR__ . '/../API/config.php';
psiceiStartSession();
if (!isset($_SESSION['usuario'])) {
  header("Location: /prueba/prueba/LOGIN/login.php?error=Inicia sesión para continuar.");
  exit();
}
rejectUnauthorizedInstitutionalUser();
$role = (string)($_SESSION['role'] ?? 'user');
$area = (string)($_SESSION['area'] ?? '');
$usuario = (string)($_SESSION['usuario'] ?? '');
?>
<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Gráficas de Contactos - PSICEI</title>
  <link rel="stylesheet" href="/prueba/prueba/assets/css/global.css" />
  <link rel="stylesheet" href="/prueba/prueba/assets/css/psicei-theme.css" />
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
</head>
<body data-user-area="<?php echo htmlspecialchars($area); ?>" data-user-role="<?php echo htmlspecialchars($role); ?>" data-user-name="<?php echo htmlspecialchars($usuario); ?>">
  <div class="top-bar">
    <img src="/prueba/prueba/MENU/images/enkabezado.png" alt="Encabezado" class="escudo" />
  </div>

  <div class="ps-wrap">
    <div class="ps-hero">
      <div>
        <h2>Gráficas de Contactos</h2>
        <div class="ps-sub">KPIs y visualizaciones para pruebas del sistema.</div>
      </div>
      <div class="ps-actions">
        <a class="ps-btn ps-solid" href="/prueba/prueba/MENU/contactos.php">Contactos</a>
        <a class="ps-btn ps-solid" href="/prueba/prueba/MENU/home.php">Inicio</a>
        <a class="ps-btn ps-solid" href="/prueba/prueba/MENU/portal.php">Portal</a>
      </div>
    </div>

    <div class="ps-grid">
      <div class="ps-card">
        <div class="ps-kpi">
          <div class="ps-num" id="kpiTotal">0</div>
          <div>
            <div class="ps-lbl">Contactos</div>
            <div class="ps-muted">totales</div>
          </div>
        </div>
      </div>
      <div class="ps-card">
        <div class="ps-kpi">
          <div class="ps-num" id="kpiAreas">0</div>
          <div>
            <div class="ps-lbl">Áreas</div>
            <div class="ps-muted">con contactos</div>
          </div>
        </div>
      </div>
      <div class="ps-card">
        <div class="ps-field">
          <label>Área (opcional)</label>
          <input id="area" value="<?php echo htmlspecialchars($area); ?>" />
        </div>
        <div style="margin-top:10px;display:flex;gap:10px;flex-wrap:wrap">
          <button class="ps-btn ps-solid" id="btn">Actualizar</button>
          <?php if ($role === 'admin'): ?>
            <a class="ps-btn ps-solid" href="/prueba/prueba/API/contacts.php?action=seed&count=100&area=<?php echo urlencode($area ?: 'Dirección General'); ?>" target="_blank">Seed 100</a>
          <?php endif; ?>
        </div>
      </div>
    </div>

    <div class="ps-grid">
      <div class="ps-card">
        <h3>Contactos por área</h3>
        <canvas id="c1" height="120"></canvas>
      </div>
      <div class="ps-card">
        <h3>Tabla por área</h3>
        <div class="ps-scroll">
          <table class="ps-table" id="t">
            <thead><tr><th>Área</th><th>Total</th></tr></thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <script>
    const API = '/prueba/prueba/API/contacts.php';
    let chart;
    function esc(s){ return String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

    async function load(){
      const area = document.getElementById('area').value.trim();
      const res = await fetch(`${API}?action=stats&area=${encodeURIComponent(area)}`, { credentials:'same-origin' });
      const data = await res.json();
      if (!data || data.error) return alert(data?.error || 'Error');
      document.getElementById('kpiTotal').textContent = String(data.total ?? 0);
      const by = Array.isArray(data.by_area) ? data.by_area : [];
      document.getElementById('kpiAreas').textContent = String(by.length);

      // table
      const tb = document.querySelector('#t tbody');
      tb.innerHTML = '';
      by.forEach(x => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${esc(x.label)}</td><td>${x.count}</td>`;
        tb.appendChild(tr);
      });

      // chart
      const labels = by.map(x => x.label);
      const counts = by.map(x => x.count);
      if (chart) chart.destroy();
      chart = new Chart(document.getElementById('c1'), {
        type: 'doughnut',
        data: { labels, datasets: [{ data: counts, backgroundColor: ['#1d47A9','#0b2f6a','#22c55e','#f59e0b','#ef4444','#64748b','#9333ea','#06b6d4'] }] },
        options: { plugins:{ legend:{ position:'bottom' } } }
      });
    }

    document.getElementById('btn').onclick = load;
    load();
  </script>

  <script src="/prueba/prueba/assets/js/psicei-ui.js"></script>
  <script src="/prueba/prueba/assets/js/gemini-ai.js"></script>
</body>
</html>

