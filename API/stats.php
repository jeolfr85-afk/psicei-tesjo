<?php
require_once __DIR__ . '/config.php';
psiceiStartSession();
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/area_stats.php';

if (!isset($_SESSION['usuario'])) {
  echo json_encode(['error' => 'Sesión no válida.']);
  exit();
}

$conn = getDBConnection();
ensureUserSchemaAndAdmin($conn);
ensureRecordsSchema($conn);

$role = (string)($_SESSION['role'] ?? 'user');
$area = (string)($_SESSION['area'] ?? '');
$usuario = (string)($_SESSION['usuario'] ?? '');

if (!institutionalUserHasAccess($role, $area)) {
  http_response_code(403);
  echo json_encode(['error' => INSTITUTIONAL_ACCESS_DENIED_MSG]);
  exit();
}

$targetArea = trim((string)($_GET['area'] ?? $area));
if ($role !== 'admin') {
  $targetArea = $area;
}

if ($targetArea === '' || !isAllowedInstitutionalArea($targetArea)) {
  echo json_encode(['error' => 'Área no válida para consultar estadísticas.']);
  exit();
}

echo json_encode(fetchAreaStats($conn, $targetArea, $role, $usuario));
