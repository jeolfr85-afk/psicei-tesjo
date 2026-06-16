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
ensureRecordsSchema($conn);

$role = (string)($_SESSION['role'] ?? 'user');
$area = (string)($_SESSION['area'] ?? '');
$subarea = (string)($_SESSION['subarea'] ?? '');
$usuario = (string)($_SESSION['usuario'] ?? '');

if (!institutionalUserHasAccess($role, $area)) {
    http_response_code(403);
    echo json_encode(['error' => INSTITUTIONAL_ACCESS_DENIED_MSG]);
    exit();
}

$action = $_GET['action'] ?? ($_POST['action'] ?? '');

function recordsCanAccessArea(string $role, string $sessionArea, string $targetArea): bool
{
    return $role === 'admin' || $sessionArea === $targetArea;
}

if ($action === 'save') {
    $input = json_decode(file_get_contents('php://input'), true);
    $rows = $input['rows'] ?? [];
    $module = trim((string)($input['module'] ?? 'Módulo sin nombre'));

    if (!is_array($rows) || count($rows) === 0) {
        echo json_encode(['error' => 'No hay registros para guardar.']);
        exit();
    }

    $payload = json_encode($rows, JSON_UNESCAPED_UNICODE);
    $stmt = $conn->prepare("INSERT INTO registros_area (area, subarea, modulo, payload_json, created_by) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $area, $subarea, $module, $payload, $usuario);
    $ok = $stmt->execute();
    $stmt->close();

    if (!$ok) {
        echo json_encode(['error' => 'No se pudo guardar en base de datos.']);
        exit();
    }

    echo json_encode(['ok' => true, 'message' => 'Registros guardados correctamente.']);
    exit();
}

if ($action === 'export') {
    $type = $_GET['type'] ?? 'excel';
    $targetArea = trim((string)($_GET['area'] ?? $area));
    $module = trim((string)($_GET['module'] ?? ''));

    if (!recordsCanAccessArea($role, $area, $targetArea)) {
        echo json_encode(['error' => 'No tienes permisos para descargar registros de otra área.']);
        exit();
    }

    $sql = "SELECT id, area, subarea, modulo, payload_json, created_by, created_at FROM registros_area WHERE area = ?";
    $types = "s";
    $params = [$targetArea];
    if ($module !== '') {
        $sql .= " AND modulo = ?";
        $types .= "s";
        $params[] = $module;
    }
    $sql .= " ORDER BY id DESC";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param($types, ...$params);
    $stmt->execute();
    $res = $stmt->get_result();

    $rows = [];
    while ($r = $res->fetch_assoc()) {
        $rows[] = $r;
    }
    $stmt->close();

    if ($type === 'pdf') {
        header('Content-Type: text/html; charset=utf-8');
        echo "<!doctype html><html><head><meta charset='utf-8'><title>Registros {$targetArea}</title>";
        echo "<style>body{font-family:Arial;padding:24px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #444;padding:8px;vertical-align:top}th{background:#f1f5f9}</style>";
        echo "</head><body><h2>Registros del área: " . htmlspecialchars($targetArea) . "</h2>";
        echo "<table><tr><th>ID</th><th>Área</th><th>Subárea</th><th>Módulo</th><th>Datos</th><th>Creado por</th><th>Fecha</th></tr>";
        foreach ($rows as $r) {
            echo "<tr>";
            echo "<td>" . (int)$r['id'] . "</td>";
            echo "<td>" . htmlspecialchars($r['area']) . "</td>";
            echo "<td>" . htmlspecialchars((string)$r['subarea']) . "</td>";
            echo "<td>" . htmlspecialchars($r['modulo']) . "</td>";
            echo "<td><pre style='white-space:pre-wrap'>" . htmlspecialchars($r['payload_json']) . "</pre></td>";
            echo "<td>" . htmlspecialchars($r['created_by']) . "</td>";
            echo "<td>" . htmlspecialchars($r['created_at']) . "</td>";
            echo "</tr>";
        }
        echo "</table><script>window.onload=function(){window.print();}</script></body></html>";
        exit();
    }

    // Excel
    header('Content-Type: application/vnd.ms-excel; charset=utf-8');
    header('Content-Disposition: attachment; filename=registros_area.xls');
    echo "<table border='1'><tr><th>ID</th><th>Área</th><th>Subárea</th><th>Módulo</th><th>Datos</th><th>Creado por</th><th>Fecha</th></tr>";
    foreach ($rows as $r) {
        echo "<tr>";
        echo "<td>" . (int)$r['id'] . "</td>";
        echo "<td>" . htmlspecialchars($r['area']) . "</td>";
        echo "<td>" . htmlspecialchars((string)$r['subarea']) . "</td>";
        echo "<td>" . htmlspecialchars($r['modulo']) . "</td>";
        echo "<td>" . htmlspecialchars($r['payload_json']) . "</td>";
        echo "<td>" . htmlspecialchars($r['created_by']) . "</td>";
        echo "<td>" . htmlspecialchars($r['created_at']) . "</td>";
        echo "</tr>";
    }
    echo "</table>";
    exit();
}

if ($action === 'list') {
    $targetArea = trim((string)($_GET['area'] ?? $area));
    $limit = (int)($_GET['limit'] ?? 50);
    $limit = max(1, min(200, $limit));
    $module = trim((string)($_GET['module'] ?? ''));

    if (!recordsCanAccessArea($role, $area, $targetArea)) {
        echo json_encode(['error' => 'No tienes permisos para ver registros de otra área.']);
        exit();
    }

    $sql = "SELECT id, area, subarea, modulo, payload_json, created_by, created_at FROM registros_area WHERE area = ?";
    $types = "s";
    $params = [$targetArea];
    if ($module !== '') {
        $sql .= " AND modulo = ?";
        $types .= "s";
        $params[] = $module;
    }
    $sql .= " ORDER BY id DESC LIMIT {$limit}";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param($types, ...$params);
    $stmt->execute();
    $res = $stmt->get_result();
    $rows = [];
    while ($r = $res->fetch_assoc()) {
        $rows[] = $r;
    }
    $stmt->close();

    echo json_encode(['ok' => true, 'rows' => $rows]);
    exit();
}

echo json_encode(['error' => 'Acción no válida.']);
