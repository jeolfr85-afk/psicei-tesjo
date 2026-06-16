<?php
require_once __DIR__ . '/config.php';
psiceiStartSession();
header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['usuario'])) {
  echo json_encode(['error' => 'Sesión no válida.']);
  exit();
}

$conn = getDBConnection();
ensureUserSchemaAndAdmin($conn);
ensureContactsSchema($conn);

$role = (string)($_SESSION['role'] ?? 'user');
$sessionArea = (string)($_SESSION['area'] ?? '');

if (!institutionalUserHasAccess($role, $sessionArea)) {
  http_response_code(403);
  echo json_encode(['error' => INSTITUTIONAL_ACCESS_DENIED_MSG]);
  exit();
}

$action = (string)($_GET['action'] ?? ($_POST['action'] ?? ''));

function canManageContacts(string $role): bool {
  // Por ahora: cualquier usuario logueado puede crear/editar contactos de prueba.
  // Si quieres restringir solo admin, cambia a: return $role === 'admin';
  return $role === 'admin' || $role === 'user';
}

function randFrom(array $items): string { return $items[random_int(0, max(0, count($items)-1))] ?? ''; }

function buildFakeContact(string $area): array {
  $names = ['Ana','Luis','Karla','Jorge','María','José','Daniel','Sofía','Miguel','Valeria','Fernando','Paola','Diego','Andrea','Raúl','Gabriela'];
  $lasts = ['García','Hernández','Martínez','López','González','Pérez','Sánchez','Ramírez','Cruz','Flores','Torres','Vargas','Reyes','Morales'];
  $puestos = ['Docente','Coordinación','Control Escolar','Biblioteca','Servicios','Vinculación','Jefatura','Auxiliar','Tutoría','Laboratorio'];
  $n = randFrom($names) . ' ' . randFrom($lasts) . ' ' . randFrom($lasts);
  $correo = strtolower(preg_replace('/\s+/', '.', $n)) . '@tesjo.edu.mx';
  $tel = '712' . str_pad((string)random_int(1000000, 9999999), 7, '0', STR_PAD_LEFT);
  $tags = randFrom(['alumno','docente','administrativo','proveedor','externo']) . ',' . randFrom(['urgente','seguimiento','nuevo','activo']);
  return [
    'nombre' => $n,
    'puesto' => randFrom($puestos),
    'correo' => $correo,
    'telefono' => $tel,
    'area' => $area,
    'tags' => $tags,
  ];
}

function subareasMap(): array {
  return [
    'Unidad Jurídica y de Igualdad de Género' => [
      'Unidad Jurídica y de Igualdad de Género'
    ],
    'Unidad de Planeación' => [
      'Departamento de Evaluación y Calidad Institucional'
    ],
    'Dirección Académica' => [
      'Departamento de Desarrollo Académico',
      'Departamento de Centro de Cómputo',
      'Departamento de Investigación en Ciencia y Tecnología',
      'Subdirección de Servicios Escolares',
      'Unidad de Biblioteca',
      'Subdirección de Servicios Profesionales'
    ],
    'Dirección de Vinculación y Extensión' => [
      'Subdirección de Extensión',
      'Unidad de Biblioteca',
      'Departamento de Servicio Social y Residencia Profesional',
      'Departamento de Actividades Extraescolares',
      'Departamento de Educación Continua y a Distancia'
    ],
    'Subdirección de Servicios Administrativos' => [
      'Departamento de Administración Personal',
      'Departamento de Recursos Financieros',
      'Departamento de Recursos Materiales y Servicios Generales'
    ],
  ];
}

if ($action === 'list') {
  $q = trim((string)($_GET['q'] ?? ''));
  $area = trim((string)($_GET['area'] ?? ''));
  if ($role !== 'admin') {
    $area = $sessionArea;
  }
  $limit = (int)($_GET['limit'] ?? 200);
  $limit = max(1, min(500, $limit));

  $sql = "SELECT id, nombre, puesto, correo, telefono, area, tags, created_at, updated_at FROM contactos WHERE 1=1";
  $types = "";
  $params = [];
  if ($area !== '') { $sql .= " AND area = ?"; $types .= "s"; $params[] = $area; }
  if ($q !== '') {
    $sql .= " AND (nombre LIKE ? OR correo LIKE ? OR telefono LIKE ? OR tags LIKE ? OR puesto LIKE ?)";
    $like = '%' . $q . '%';
    $types .= "sssss";
    array_push($params, $like, $like, $like, $like, $like);
  }
  $sql .= " ORDER BY id DESC LIMIT {$limit}";

  $stmt = $conn->prepare($sql);
  if ($types !== '') $stmt->bind_param($types, ...$params);
  $stmt->execute();
  $res = $stmt->get_result();
  $rows = [];
  while ($r = $res->fetch_assoc()) $rows[] = $r;
  $stmt->close();

  echo json_encode(['ok' => true, 'rows' => $rows]);
  exit();
}

if (!canManageContacts($role)) {
  echo json_encode(['error' => 'No tienes permisos.']);
  exit();
}

if ($action === 'create') {
  $input = json_decode(file_get_contents('php://input'), true);
  $nombre = trim((string)($input['nombre'] ?? ''));
  $puesto = trim((string)($input['puesto'] ?? ''));
  $correo = trim((string)($input['correo'] ?? ''));
  $telefono = preg_replace('/\D+/', '', (string)($input['telefono'] ?? ''));
  $area = trim((string)($input['area'] ?? $sessionArea));
  if ($role !== 'admin') {
    $area = $sessionArea;
  }
  $tags = trim((string)($input['tags'] ?? ''));

  if ($nombre === '' || mb_strlen($nombre) < 3) {
    echo json_encode(['error' => 'Nombre completo es obligatorio (mínimo 3 caracteres).']);
    exit();
  }
  if ($puesto === '') {
    echo json_encode(['error' => 'El puesto es obligatorio.']);
    exit();
  }
  if ($correo === '' || !filter_var($correo, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['error' => 'Correo electrónico inválido.']);
    exit();
  }
  if (!preg_match('/^\d{10}$/', $telefono)) {
    echo json_encode(['error' => 'El teléfono debe tener exactamente 10 dígitos numéricos.']);
    exit();
  }
  if ($area === '') {
    echo json_encode(['error' => 'Selecciona un área válida.']);
    exit();
  }

  $stmt = $conn->prepare("INSERT INTO contactos (nombre, puesto, correo, telefono, area, tags) VALUES (?,?,?,?,?,?)");
  $stmt->bind_param("ssssss", $nombre, $puesto, $correo, $telefono, $area, $tags);
  $ok = $stmt->execute();
  $id = $stmt->insert_id;
  $stmt->close();
  echo json_encode($ok ? ['ok' => true, 'id' => $id] : ['error' => 'No se pudo crear.']);
  exit();
}

if ($action === 'update') {
  $input = json_decode(file_get_contents('php://input'), true);
  $id = (int)($input['id'] ?? 0);
  $nombre = trim((string)($input['nombre'] ?? ''));
  $puesto = trim((string)($input['puesto'] ?? ''));
  $correo = trim((string)($input['correo'] ?? ''));
  $telefono = trim((string)($input['telefono'] ?? ''));
  $area = trim((string)($input['area'] ?? $sessionArea));
  $tags = trim((string)($input['tags'] ?? ''));

  if ($id <= 0 || $nombre === '') {
    echo json_encode(['error' => 'Datos inválidos.']);
    exit();
  }

  $stmt = $conn->prepare("UPDATE contactos SET nombre=?, puesto=?, correo=?, telefono=?, area=?, tags=?, updated_at=NOW() WHERE id=?");
  $stmt->bind_param("ssssssi", $nombre, $puesto, $correo, $telefono, $area, $tags, $id);
  $ok = $stmt->execute();
  $stmt->close();
  echo json_encode($ok ? ['ok' => true] : ['error' => 'No se pudo actualizar.']);
  exit();
}

if ($action === 'delete') {
  $input = json_decode(file_get_contents('php://input'), true);
  $id = (int)($input['id'] ?? 0);
  if ($id <= 0) { echo json_encode(['error' => 'ID inválido.']); exit(); }
  $stmt = $conn->prepare("DELETE FROM contactos WHERE id=?");
  $stmt->bind_param("i", $id);
  $ok = $stmt->execute();
  $stmt->close();
  echo json_encode($ok ? ['ok' => true] : ['error' => 'No se pudo eliminar.']);
  exit();
}

if ($action === 'seed') {
  if ($role !== 'admin') {
    echo json_encode(['error' => 'Solo admin puede generar datos masivos.']);
    exit();
  }
  $count = (int)($_GET['count'] ?? 50);
  $count = max(1, min(500, $count));
  $area = trim((string)($_GET['area'] ?? $sessionArea));
  if ($area === '') $area = 'Dirección General';

  $stmt = $conn->prepare("INSERT INTO contactos (nombre, puesto, correo, telefono, area, tags) VALUES (?,?,?,?,?,?)");
  $inserted = 0;
  for ($i=0; $i<$count; $i++) {
    $c = buildFakeContact($area);
    $stmt->bind_param("ssssss", $c['nombre'], $c['puesto'], $c['correo'], $c['telefono'], $c['area'], $c['tags']);
    if ($stmt->execute()) $inserted++;
  }
  $stmt->close();
  echo json_encode(['ok' => true, 'inserted' => $inserted]);
  exit();
}

if ($action === 'seed_subareas') {
  if ($role !== 'admin') {
    echo json_encode(['error' => 'Solo admin puede generar datos masivos por subárea.']);
    exit();
  }

  $count = (int)($_GET['count'] ?? 10);
  $count = max(1, min(100, $count));
  $maps = subareasMap();

  $stmt = $conn->prepare("INSERT INTO contactos (nombre, puesto, correo, telefono, area, tags) VALUES (?,?,?,?,?,?)");
  $inserted = 0;
  $subareasProcessed = 0;

  foreach ($maps as $areaName => $subareas) {
    foreach ($subareas as $subareaName) {
      $subareasProcessed++;
      for ($i = 0; $i < $count; $i++) {
        $c = buildFakeContact($areaName);
        // Guardamos la subárea en tags para búsquedas/filtros rápidos sin cambiar esquema.
        $c['tags'] = trim($c['tags'] . ',subarea:' . $subareaName, ',');
        $stmt->bind_param("ssssss", $c['nombre'], $c['puesto'], $c['correo'], $c['telefono'], $c['area'], $c['tags']);
        if ($stmt->execute()) $inserted++;
      }
    }
  }

  $stmt->close();
  echo json_encode([
    'ok' => true,
    'inserted' => $inserted,
    'per_subarea' => $count,
    'subareas' => $subareasProcessed
  ]);
  exit();
}

if ($action === 'stats') {
  $area = trim((string)($_GET['area'] ?? ''));
  if ($role !== 'admin') {
    $area = $sessionArea;
  }

  $byArea = [];
  $total = 0;

  if ($area !== '') {
    $stmt = $conn->prepare('SELECT COUNT(*) c FROM contactos WHERE area = ?');
    $stmt->bind_param('s', $area);
    $stmt->execute();
    $total = (int)($stmt->get_result()->fetch_assoc()['c'] ?? 0);
    $stmt->close();
    $byArea[] = ['label' => $area, 'count' => $total];
  } else {
    $sql = 'SELECT area, COUNT(*) c FROM contactos GROUP BY area ORDER BY c DESC LIMIT 12';
    $res = $conn->query($sql);
    while ($r = $res->fetch_assoc()) {
      $byArea[] = ['label' => (string)$r['area'], 'count' => (int)$r['c']];
    }
    $res2 = $conn->query('SELECT COUNT(*) c FROM contactos');
    $total = (int)($res2->fetch_assoc()['c'] ?? 0);
  }

  echo json_encode(['ok' => true, 'total' => $total, 'by_area' => $byArea]);
  exit();
}

echo json_encode(['error' => 'Acción no válida.']);

