<?php
header('Content-Type: application/json');

$projectRoot = __DIR__;
while ($projectRoot !== dirname($projectRoot) && !is_file($projectRoot . '/API/config.php')) {
    $projectRoot = dirname($projectRoot);
}
require_once $projectRoot . '/API/config.php';
$conexion = getDBConnection();
if ($conexion->connect_error) {
    die(json_encode(["error" => "Error de conexión: " . $conexion->connect_error]));
}

$ciclo = isset($_GET['ciclo']) ? $conexion->real_escape_string($_GET['ciclo']) : '';

$sql = "SELECT campo, cantidad FROM centro_informacion_p WHERE ciclo = '$ciclo' ORDER BY fecha_registro DESC";
$result = $conexion->query($sql);

$datos = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $datos[] = $row;
    }
}

// Cerramos conexión y devolvemos datos en JSON
$conexion->close();
echo json_encode($datos);
?>
