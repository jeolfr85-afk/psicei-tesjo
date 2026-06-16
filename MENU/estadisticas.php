<?php

require_once __DIR__ . '/../API/config.php';
psiceiStartSession();

if (!isset($_SESSION['usuario'])) {

  header("Location: /prueba/prueba/LOGIN/login.php?error=Inicia sesión para continuar.");

  exit();

}

$role = (string)($_SESSION['role'] ?? 'user');

$sessionArea = (string)($_SESSION['area'] ?? '');

if ($role !== 'admin') {
  rejectUnauthorizedInstitutionalUser();
}

$area = resolveInstitutionalViewArea($role, $sessionArea, $_GET['area'] ?? null);

$isAdmin = $role === 'admin';

$homeUrl = $isAdmin ? '/prueba/prueba/LOGIN/admin_home.php' : '/prueba/prueba/MENU/home.php';

$resumenUrl = '/prueba/prueba/MENU/resumen_area.php' . ($isAdmin ? '?area=' . rawurlencode($area) : '');

$usuario = (string)($_SESSION['usuario'] ?? '');

?>

<!doctype html>

<html lang="es">

<head>

  <meta charset="UTF-8" />

  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <title>Estadísticas - PSICEI</title>

  <link rel="stylesheet" href="/prueba/prueba/assets/css/global.css" />

  <link rel="stylesheet" href="/prueba/prueba/assets/css/psicei-theme.css" />

  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>

</head>

<body data-user-area="<?php echo htmlspecialchars($area); ?>" data-user-role="<?php echo htmlspecialchars($role); ?>" data-user-name="<?php echo htmlspecialchars($usuario); ?>" data-view-area="<?php echo htmlspecialchars($area); ?>">

  <div class="top-bar">

    <img src="/prueba/prueba/MENU/images/enkabezado.png" alt="Encabezado" class="escudo" />

  </div>



  <div class="ps-wrap">

    <?php if ($isAdmin): ?>
      <?php
        $currentArea = $area;
        $basePath = '/prueba/prueba/MENU/estadisticas.php';
        require __DIR__ . '/includes/area_tabs.php';
      ?>
    <?php endif; ?>

    <div class="ps-hero">

      <div>

        <h2><?php echo $isAdmin ? 'Estadísticas por dirección' : 'Estadísticas de tu área'; ?></h2>

        <div class="ps-sub">Dirección: <strong id="areaLbl"><?php echo htmlspecialchars($area); ?></strong> · Usuario: <strong><?php echo htmlspecialchars($usuario); ?></strong></div>

      </div>

      <div class="ps-actions">

        <a class="ps-btn ps-solid" href="<?php echo htmlspecialchars($homeUrl); ?>">Inicio</a>

        <a class="ps-btn ps-solid" href="<?php echo htmlspecialchars($resumenUrl); ?>">Resumen</a>

        <a class="ps-btn ps-solid" href="/prueba/prueba/MENU/records_history.php<?php echo $isAdmin ? '?area=' . rawurlencode($area) : ''; ?>">Historial</a>

        <a class="ps-btn ps-solid" href="/prueba/prueba/MENU/portal.php">Mis módulos</a>

      </div>

    </div>



    <div id="emptyState" class="ps-card" style="display:none;margin-bottom:14px;">

      <h3>Sin datos aún</h3>

      <p class="ps-muted">No hay registros guardados para <strong><?php echo htmlspecialchars($area); ?></strong>.

        Captura información desde <a href="/prueba/prueba/MENU/portal.php">Mis módulos</a> y vuelve aquí para ver las gráficas.</p>

    </div>



    <div class="ps-grid" id="kpiGrid">

      <div class="ps-card">

        <div class="ps-kpi">

          <div class="ps-num" id="kpiRecords">0</div>

          <div>

            <div class="ps-lbl">Registros</div>

            <div class="ps-muted">guardados en el área</div>

          </div>

        </div>

      </div>

      <div class="ps-card">

        <div class="ps-kpi">

          <div class="ps-num" id="kpiContacts">0</div>

          <div>

            <div class="ps-lbl">Contactos</div>

            <div class="ps-muted">en el directorio</div>

          </div>

        </div>

      </div>

      <div class="ps-card">

        <div class="ps-kpi">

          <div class="ps-num" id="kpiMyRecords">0</div>

          <div>

            <div class="ps-lbl">Tus capturas</div>

            <div class="ps-muted">registradas por ti</div>

          </div>

        </div>

      </div>

      <div class="ps-card">

        <div class="ps-kpi">

          <div class="ps-num" id="kpiTopModule">—</div>

          <div>

            <div class="ps-lbl">Módulo más activo</div>

            <div class="ps-muted" id="kpiTopModuleCount">—</div>

          </div>

        </div>

      </div>

    </div>



    <div class="ps-grid" id="chartsGrid" style="margin-top:14px;">

      <div class="ps-card">

        <h3>Actividad (últimos 7 días)</h3>

        <canvas id="cActivity" height="120"></canvas>

      </div>

      <div class="ps-card">

        <h3>Registros por módulo</h3>

        <canvas id="cModules" height="120"></canvas>

      </div>

    </div>



    <div class="ps-card" style="margin-top:14px;">

      <h3>Detalle por módulo</h3>

      <div class="ps-muted">Conteos de registros guardados en <strong><?php echo htmlspecialchars($area); ?></strong>.</div>

      <div class="ps-scroll" style="margin-top:12px;">

        <table class="ps-table" id="tModules">

          <thead><tr><th>Módulo</th><th>Total</th></tr></thead>

          <tbody></tbody>

        </table>

      </div>

    </div>

  </div>



  <script>

    const area = document.body.dataset.viewArea || document.body.dataset.userArea || '';

    let chartActivity = null;

    let chartModules = null;



    async function loadStats(){

      const res = await fetch(`/prueba/prueba/API/stats.php?area=${encodeURIComponent(area)}`, { credentials: 'same-origin' });

      const data = await res.json();

      if (!data || data.error) {

        alert(data?.error || 'No se pudieron cargar las estadísticas.');

        return;

      }



      const counts = data.counts || {};

      const totalRecords = Number(counts.records || 0);



      document.getElementById('kpiRecords').textContent = String(totalRecords);

      document.getElementById('kpiContacts').textContent = String(counts.contacts || 0);

      document.getElementById('kpiMyRecords').textContent = String(counts.my_records || 0);



      document.getElementById('emptyState').style.display = totalRecords === 0 ? 'block' : 'none';

      document.getElementById('chartsGrid').style.opacity = totalRecords === 0 ? '0.45' : '1';



      const byModule = Array.isArray(data.by_module) ? data.by_module : [];

      if (byModule.length) {

        document.getElementById('kpiTopModule').textContent = byModule[0].label.length > 18

          ? byModule[0].label.slice(0, 18) + '…'

          : byModule[0].label;

        document.getElementById('kpiTopModuleCount').textContent = `${byModule[0].count} registros`;

      }



      const tbody = document.querySelector('#tModules tbody');

      tbody.innerHTML = '';

      byModule.forEach(m => {

        const tr = document.createElement('tr');

        tr.innerHTML = `<td>${escapeHtml(m.label)}</td><td>${m.count}</td>`;

        tbody.appendChild(tr);

      });



      if (chartModules) chartModules.destroy();

      if (byModule.length) {

        chartModules = new Chart(document.getElementById('cModules'), {

          type: 'bar',

          data: {

            labels: byModule.map(x => x.label),

            datasets: [{

              data: byModule.map(x => x.count),

              backgroundColor: 'rgba(29,71,169,.55)',

              borderColor: '#1d47A9'

            }]

          },

          options: {

            plugins: { legend: { display: false } },

            scales: {

              x: { ticks: { maxRotation: 45, autoSkip: true, maxTicksLimit: 8 } },

              y: { beginAtZero: true, ticks: { stepSize: 1 } }

            }

          }

        });

      }



      const act = data.activity || { labels: [], counts: [] };

      if (chartActivity) chartActivity.destroy();

      chartActivity = new Chart(document.getElementById('cActivity'), {

        type: 'line',

        data: {

          labels: act.labels || [],

          datasets: [{

            label: 'Registros por día',

            data: act.counts || [],

            borderColor: '#0b2f6a',

            backgroundColor: 'rgba(11,47,106,.12)',

            tension: 0.35,

            fill: true

          }]

        },

        options: {

          plugins: { legend: { display: false } },

          scales: {

            x: { ticks: { maxTicksLimit: 7 } },

            y: { beginAtZero: true, ticks: { stepSize: 1 } }

          }

        }

      });

    }



    function escapeHtml(s){

      return String(s).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

    }



    loadStats();

  </script>



  <script src="/prueba/prueba/assets/js/psicei-ui.js"></script>

  <script src="/prueba/prueba/assets/js/gemini-ai.js"></script>

</body>

</html>

