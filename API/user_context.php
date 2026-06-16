<?php
require_once __DIR__ . '/config.php';
psiceiStartSession();
header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['usuario'])) {
    echo json_encode(['error' => 'Sesión no válida.']);
    exit();
}

$role = (string)($_SESSION['role'] ?? 'user');
$area = (string)($_SESSION['area'] ?? '');

if (!institutionalUserHasAccess($role, $area)) {
    http_response_code(403);
    echo json_encode(['error' => INSTITUTIONAL_ACCESS_DENIED_MSG]);
    exit();
}

echo json_encode([
    'usuario' => $_SESSION['usuario'] ?? '',
    'area' => $_SESSION['area'] ?? '',
    'subarea' => $_SESSION['subarea'] ?? '',
    'role' => $_SESSION['role'] ?? 'user'
]);

