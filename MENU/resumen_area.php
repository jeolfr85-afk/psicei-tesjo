<?php
require_once __DIR__ . '/../API/config.php';
psiceiStartSession();
require_once __DIR__ . '/../API/area_stats.php';

if (!isset($_SESSION['usuario'])) {
    header('Location: /prueba/prueba/LOGIN/login.php?error=Inicia sesión para continuar.');
    exit();
}

$usuario = (string)($_SESSION['usuario'] ?? 'Usuario');
$sessionArea = (string)($_SESSION['area'] ?? '');
$role = (string)($_SESSION['role'] ?? 'user');

if ($role !== 'admin') {
    rejectUnauthorizedInstitutionalUser();
}

$area = resolveInstitutionalViewArea($role, $sessionArea, $_GET['area'] ?? null);
$isAdmin = $role === 'admin';
$homeUrl = $isAdmin ? '/prueba/prueba/LOGIN/admin_home.php' : '/prueba/prueba/MENU/home.php';
$statsUrl = '/prueba/prueba/MENU/estadisticas.php' . ($isAdmin ? '?area=' . rawurlencode($area) : '');
$historyUrl = '/prueba/prueba/MENU/records_history.php' . ($isAdmin ? '?area=' . rawurlencode($area) : '');

$conn = getDBConnection();
ensureUserSchemaAndAdmin($conn);
ensureRecordsSchema($conn);

$stats = fetchAreaStats($conn, $area, $role, $usuario);
$counts = $stats['counts'] ?? [];
$byModule = $stats['by_module'] ?? [];
$recent = $stats['recent'] ?? [];
$activity = $stats['activity'] ?? ['labels' => [], 'counts' => []];
?>
<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title><?php echo $isAdmin ? 'Resumen por dirección' : 'Resumen de mi área'; ?> - PSICEI</title>
  <link rel="stylesheet" href="/prueba/prueba/assets/css/global.css" />
  <link rel="stylesheet" href="/prueba/prueba/assets/css/psicei-theme.css" />
  <link rel="stylesheet" href="/prueba/prueba/assets/css/welcome-dashboard.css" />
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
</head>
<body data-user-area="<?php echo htmlspecialchars($area); ?>" data-user-role="<?php echo htmlspecialchars($role); ?>" data-user-name="<?php echo htmlspecialchars($usuario); ?>">
  <div class="top-bar">
    <img src="/prueba/prueba/MENU/images/enkabezado.png" alt="Encabezado" class="escudo" />
  </div>

  <div class="ps-wrap">
    <?php if ($isAdmin): ?>
      <?php
        $currentArea = $area;
        $basePath = '/prueba/prueba/MENU/resumen_area.php';
        require __DIR__ . '/includes/area_tabs.php';
      ?>
    <?php endif; ?>

    <div class="ps-hero welcome-hero">
      <div>
        <h1><?php echo $isAdmin ? 'Resumen por dirección' : 'Resumen de mi área'; ?></h1>
        <p class="ps-sub welcome-lead">
          <strong><?php echo htmlspecialchars($area); ?></strong> —
          <?php if ($isAdmin): ?>
            Vista de administrador: actividad, registros y módulos de esta dirección.
          <?php else: ?>
            Hola, <?php echo htmlspecialchars($usuario); ?>.
            Aquí ves la actividad reciente, registros guardados y accesos de tu dirección.
          <?php endif; ?>
        </p>
      </div>
      <div class="ps-actions">
        <a class="ps-btn ps-solid" href="<?php echo htmlspecialchars($homeUrl); ?>">Inicio</a>
        <a class="ps-btn ps-solid" href="<?php echo htmlspecialchars($statsUrl); ?>">Estadísticas</a>
        <a class="ps-btn ps-solid" href="/prueba/prueba/MENU/portal.php">Mis módulos</a>
      </div>
    </div>

    <div class="ps-grid">
      <div class="ps-card">
        <div class="ps-kpi">
          <div class="ps-num"><?php echo (int)($counts['records'] ?? 0); ?></div>
          <div>
            <div class="ps-lbl">Registros guardados</div>
            <div class="ps-muted">en tu dirección</div>
          </div>
        </div>
      </div>
      <div class="ps-card">
        <div class="ps-kpi">
          <div class="ps-num"><?php echo (int)($isAdmin ? ($counts['users'] ?? 0) : ($counts['my_records'] ?? 0)); ?></div>
          <div>
            <div class="ps-lbl"><?php echo $isAdmin ? 'Usuarios' : 'Tus capturas'; ?></div>
            <div class="ps-muted"><?php echo $isAdmin ? 'en esta dirección' : 'registradas por ti'; ?></div>
          </div>
        </div>
      </div>
      <div class="ps-card">
        <div class="ps-kpi">
          <div class="ps-num"><?php echo (int)($counts['contacts'] ?? 0); ?></div>
          <div>
            <div class="ps-lbl">Contactos</div>
            <div class="ps-muted">en el directorio del área</div>
          </div>
        </div>
      </div>
      <div class="ps-card">
        <div class="ps-kpi">
          <div class="ps-num"><?php echo (int)($counts['modules'] ?? 0); ?></div>
          <div>
            <div class="ps-lbl">Módulos disponibles</div>
            <div class="ps-muted">departamentos y capturas</div>
          </div>
        </div>
      </div>
    </div>

    <div class="ps-grid" style="margin-top:14px;">
      <div class="ps-card">
        <h3>Actividad (últimos 7 días)</h3>
        <?php if ((int)($counts['records'] ?? 0) === 0): ?>
          <p class="ps-muted">Aún no hay registros guardados en tu dirección. Entra a <a href="/prueba/prueba/MENU/portal.php">Mis módulos</a> para capturar datos.</p>
        <?php else: ?>
          <canvas id="chartActivity" height="120"></canvas>
        <?php endif; ?>
      </div>
      <div class="ps-card">
        <h3>Módulos con más actividad</h3>
        <?php if ($byModule === []): ?>
          <p class="ps-muted">Sin registros por módulo todavía.</p>
        <?php else: ?>
          <div class="ps-scroll">
            <table class="ps-table">
              <thead><tr><th>Módulo</th><th>Registros</th></tr></thead>
              <tbody>
                <?php foreach (array_slice($byModule, 0, 6) as $m): ?>
                <tr>
                  <td><?php echo htmlspecialchars((string)$m['label']); ?></td>
                  <td><?php echo (int)$m['count']; ?></td>
                </tr>
                <?php endforeach; ?>
              </tbody>
            </table>
          </div>
        <?php endif; ?>
      </div>
    </div>

    <div class="ps-card" style="margin-top:14px;">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:10px;">
        <h3 style="margin:0;">Últimos registros</h3>
        <a class="ps-btn ps-solid" href="<?php echo htmlspecialchars($historyUrl); ?>">Ver historial completo</a>
      </div>
      <?php if ($recent === []): ?>
        <p class="ps-muted">No hay capturas recientes en la base de datos.</p>
      <?php else: ?>
        <div class="ps-scroll">
          <table class="ps-table">
            <thead>
              <tr><th>ID</th><th>Módulo</th><th>Creado por</th><th>Fecha</th></tr>
            </thead>
            <tbody>
              <?php foreach ($recent as $r): ?>
              <tr>
                <td><?php echo (int)$r['id']; ?></td>
                <td><?php echo htmlspecialchars((string)$r['modulo']); ?></td>
                <td><?php echo htmlspecialchars((string)$r['created_by']); ?></td>
                <td class="ps-muted"><?php echo htmlspecialchars((string)$r['created_at']); ?></td>
              </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
        </div>
      <?php endif; ?>
    </div>

    <div class="ps-grid" style="margin-top:14px;">
      <a href="/prueba/prueba/MENU/portal.php" class="nav-card" style="text-decoration:none;">
        <h3>Mis módulos</h3>
        <p class="ps-muted">Capturar reportes e indicadores</p>
      </a>
      <a href="/prueba/prueba/MENU/contactos.php" class="nav-card" style="text-decoration:none;">
        <h3>Contactos</h3>
        <p class="ps-muted">Directorio de tu dirección</p>
      </a>
      <a href="<?php echo htmlspecialchars($statsUrl); ?>" class="nav-card" style="text-decoration:none;">
        <h3>Estadísticas</h3>
        <p class="ps-muted">Gráficas e indicadores</p>
      </a>
    </div>
  </div>

  <?php if ((int)($counts['records'] ?? 0) > 0): ?>
  <script>
    const activity = <?php echo json_encode($activity, JSON_UNESCAPED_UNICODE); ?>;
    new Chart(document.getElementById('chartActivity'), {
      type: 'line',
      data: {
        labels: activity.labels || [],
        datasets: [{
          label: 'Registros',
          data: activity.counts || [],
          borderColor: '#1d47A9',
          backgroundColor: 'rgba(29,71,169,.15)',
          tension: 0.35,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { maxTicksLimit: 7 } },
          y: { beginAtZero: true, ticks: { stepSize: 1 } }
        }
      }
    });
  </script>
  <?php endif; ?>

  <script src="/prueba/prueba/assets/js/psicei-ui.js"></script>
  <script src="/prueba/prueba/assets/js/gemini-ai.js"></script>
</body>
</html>
