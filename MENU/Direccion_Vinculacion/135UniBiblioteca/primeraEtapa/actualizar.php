<?php
header("Content-Type: application/json");

$projectRoot = __DIR__;
while ($projectRoot !== dirname($projectRoot) && !is_file($projectRoot . '/API/config.php')) {
    $projectRoot = dirname($projectRoot);
}
require_once $projectRoot . '/API/config.php';
$mysqli = getDBConnection();
if ($mysqli->connect_error) {
    echo json_encode(["estado" => "error", "mensaje" => "Error de conexión"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$campo = $mysqli->real_escape_string($data['campo'] ?? '');
$cantidad = intval($data['cantidad'] ?? 0);

if ($campo === '') {
    echo json_encode(["estado" => "error", "mensaje" => "Campo vacío"]);
    exit;
}

$sql = "UPDATE centro_informacion SET cantidad = $cantidad, fecha_registro = NOW() WHERE campo = '$campo'";

if ($mysqli->query($sql)) {
    echo json_encode(["estado" => "ok"]);
} else {
    echo json_encode(["estado" => "error", "mensaje" => $mysqli->error]);
}

$mysqli->close();
