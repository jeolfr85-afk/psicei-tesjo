<?php
header('Content-Type: application/json');

$projectRoot = __DIR__;
while ($projectRoot !== dirname($projectRoot) && !is_file($projectRoot . '/API/config.php')) {
    $projectRoot = dirname($projectRoot);
}
require_once $projectRoot . '/API/config.php';
$conexion = getDBConnection();
if ($conexion->connect_error) {
  echo json_encode(["estado" => "error", "mensaje" => "Error de conexión"]);
  exit;
}

$sql = "SELECT campo, cantidad FROM centro_informacion";
$resultado = $conexion->query($sql);

$datos = [];
while ($fila = $resultado->fetch_assoc()) {
  $datos[] = $fila;
}

echo json_encode($datos); 