<?php
require_once __DIR__ . '/../API/config.php';
psiceiStartSession();

if (!isset($_SESSION['usuario'])) {
  header("Location: /prueba/prueba/LOGIN/login.php?error=Inicia sesión para continuar.");
  exit();
}

$role = (string)($_SESSION['role'] ?? 'user');
$area = (string)($_SESSION['area'] ?? '');
if ($role !== 'admin') {
  rejectUnauthorizedInstitutionalUser();
}

$conn = getDBConnection();
ensureUserSchemaAndAdmin($conn);
ensureRecordsSchema($conn);

$subarea = (string)($_SESSION['subarea'] ?? '');
$usuario = (string)($_SESSION['usuario'] ?? '');

$targetArea = resolveInstitutionalViewArea($role, $area, $_GET['area'] ?? null);
$isAdmin = $role === 'admin';
$homeUrl = $isAdmin ? '/prueba/prueba/LOGIN/admin_home.php' : '/prueba/prueba/MENU/home.php';

$module = trim((string)($_GET['module'] ?? ''));
$msg = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete_id'])) {
  $id = (int)$_POST['delete_id'];
  $stmt = $conn->prepare("SELECT area FROM registros_area WHERE id = ?");
  $stmt->bind_param("i", $id);
  $stmt->execute();
  $row = $stmt->get_result()->fetch_assoc();
  $stmt->close();
  $rowArea = (string)($row['area'] ?? '');
  if ($rowArea !== '' && ($role === 'admin' || $rowArea === $area)) {
    $stmt2 = $conn->prepare("DELETE FROM registros_area WHERE id = ?");
    $stmt2->bind_param("i", $id);
    $stmt2->execute();
    $stmt2->close();
    $msg = "Registro eliminado.";
  } else {
    $msg = "No tienes permisos para eliminar ese registro.";
  }
}

$sql = "SELECT id, area, subarea, modulo, payload_json, created_by, created_at FROM registros_area WHERE area = ?";
$types = "s";
$params = [$targetArea];
if ($module !== '') { $sql .= " AND modulo = ?"; $types .= "s"; $params[] = $module; }
$sql .= " ORDER BY id DESC LIMIT 200";

$stmt = $conn->prepare($sql);
$stmt->bind_param($types, ...$params);
$stmt->execute();
$res = $stmt->get_result();
$rows = [];
while ($r = $res->fetch_assoc()) $rows[] = $r;
$stmt->close();

?>
<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Historial de Registros - PSICEI</title>
  <link rel="stylesheet" href="/prueba/prueba/assets/css/global.css" />
  <link rel="stylesheet" href="/prueba/prueba/assets/css/psicei-theme.css" />
  <style>
    .wrap{max-width:1200px;margin:110px auto 40px;padding:0 16px;}
    .hero{background:linear-gradient(135deg,#00264D,#1d47A9);color:#fff;border-radius:14px;padding:18px;margin-bottom:14px;display:flex;justify-content:space-between;gap:14px;flex-wrap:wrap}
    .hero h1{font-size:1.25rem;margin:0}
    .card{background:#fff;border-radius:12px;padding:16px;box-shadow:0 4px 18px rgba(0,0,0,.08)}
    .filters{display:flex;gap:10px;flex-wrap:wrap;align-items:end}
    .filters .form-group{margin-bottom:0;max-width:320px}
    .muted{color:#64748b}
    .btn-mini{padding:10px 14px;max-width:unset}
    pre{white-space:pre-wrap;max-height:160px;overflow:auto;background:#f8fafc;padding:10px;border-radius:10px;border:1px solid #e2e8f0}
    .actions{display:flex;gap:8px;flex-wrap:wrap}
  </style>
</head>
<body data-user-area="<?php echo htmlspecialchars($area); ?>" data-user-subarea="<?php echo htmlspecialchars($subarea); ?>" data-user-role="<?php echo htmlspecialchars($role); ?>" data-user-name="<?php echo htmlspecialchars($usuario); ?>">
  <div class="top-bar">
    <img src="/prueba/prueba/MENU/images/enkabezado.png" alt="Encabezado" class="escudo" />
  </div>

  <div class="wrap">
    <div class="hero">
      <div>
        <h1>Historial de Registros</h1>
        <div class="muted" style="color:#e8f0ff;">Área: <strong><?php echo htmlspecialchars($targetArea); ?></strong> | Usuario: <strong><?php echo htmlspecialchars($usuario); ?></strong></div>
      </div>
      <div class="actions">
        <a class="btn btn-mini" href="<?php echo htmlspecialchars($homeUrl); ?>">Inicio</a>
        <a class="btn btn-mini" href="/prueba/prueba/MENU/resumen_area.php<?php echo $isAdmin ? '?area=' . rawurlencode($targetArea) : ''; ?>">Resumen</a>
        <a class="btn btn-mini" href="/prueba/prueba/MENU/estadisticas.php<?php echo $isAdmin ? '?area=' . rawurlencode($targetArea) : ''; ?>">Estadísticas</a>
        <a class="btn btn-mini" href="/prueba/prueba/MENU/portal.php">Portal</a>
        <a class="btn btn-mini" href="/prueba/prueba/LOGIN/logout.php">Salir</a>
      </div>
    </div>

    <?php if ($msg !== ''): ?>
      <div class="mensaje-exito"><?php echo htmlspecialchars($msg); ?></div>
    <?php endif; ?>

    <div class="card">
      <form method="GET" class="filters">
        <?php if ($role === 'admin'): ?>
          <div class="form-group">
            <label>Área</label>
            <input name="area" value="<?php echo htmlspecialchars($targetArea); ?>" placeholder="Ej: Dirección General" />
          </div>
        <?php endif; ?>
        <div class="form-group">
          <label>Módulo (opcional)</label>
          <input name="module" value="<?php echo htmlspecialchars($module); ?>" placeholder="Ej: Vinculación y Extensión" />
        </div>
        <button class="submit-btn" type="submit" style="max-width:220px;">Filtrar</button>
        <a class="btn btn-mini" href="/prueba/prueba/API/records.php?action=export&type=excel&area=<?php echo urlencode($targetArea); ?>&module=<?php echo urlencode($module); ?>">Excel</a>
        <a class="btn btn-mini" href="/prueba/prueba/API/records.php?action=export&type=pdf&area=<?php echo urlencode($targetArea); ?>&module=<?php echo urlencode($module); ?>">PDF</a>
      </form>
    </div>

    <div class="card" style="margin-top:14px;">
      <div class="scroll-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Área</th>
              <th>Subárea</th>
              <th>Módulo</th>
              <th>Datos (JSON)</th>
              <th>Creado por</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <?php foreach ($rows as $r): ?>
              <tr>
                <td><?php echo (int)$r['id']; ?></td>
                <td><?php echo htmlspecialchars($r['area']); ?></td>
                <td><?php echo htmlspecialchars((string)$r['subarea']); ?></td>
                <td><?php echo htmlspecialchars($r['modulo']); ?></td>
                <td><pre><?php echo htmlspecialchars($r['payload_json']); ?></pre></td>
                <td><?php echo htmlspecialchars($r['created_by']); ?></td>
                <td class="muted"><?php echo htmlspecialchars($r['created_at']); ?></td>
                <td>
                  <form method="POST" onsubmit="return confirm('¿Eliminar el registro #<?php echo (int)$r['id']; ?>?');">
                    <input type="hidden" name="delete_id" value="<?php echo (int)$r['id']; ?>" />
                    <button class="btn-delete" type="submit">Eliminar</button>
                  </form>
                </td>
              </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      </div>
      <div class="muted" style="margin-top:10px;">Tip: puedes decirle al chat “abre historial”, “descarga excel”, “descarga pdf”, “guarda registros”.</div>
    </div>
  </div>

  <script src="/prueba/prueba/assets/js/psicei-ui.js"></script>
  <script src="/prueba/prueba/assets/js/gemini-ai.js"></script>
</body>
</html>

