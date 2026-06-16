<?php

$projectRoot = __DIR__;
while ($projectRoot !== dirname($projectRoot) && !is_file($projectRoot . '/API/config.php')) {
    $projectRoot = dirname($projectRoot);
}
require_once $projectRoot . '/API/config.php';
$conexion = getDBConnection();

if ($conexion->connect_error) {
    die("Conexión fallida: " . $conexion->connect_error);
}

// Obtener los datos recibidos
$datos = json_decode(file_get_contents("php://input"), true);

if ($datos) {
    
    foreach ($datos as $dato) {
        $campo = $conexion->real_escape_string($dato['campo']);
        $cantidad = $conexion->real_escape_string($dato['cantidad']);
        
        
        $sql = "INSERT INTO centro_informacion (campo, cantidad) VALUES ('$campo', '$cantidad')";
        
        if (!$conexion->query($sql)) {
            
            echo json_encode(["estado" => "error", "mensaje" => "Error al insertar los datos"]);
            exit;
        }
    }

    echo json_encode(["estado" => "ok"]);
} else {
   
    echo json_encode(["estado" => "error", "mensaje" => "No se recibieron datos"]);
}

$conexion->close();
?>
