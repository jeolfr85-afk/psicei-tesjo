<?php
require_once __DIR__ . '/../../API/config.php';

$conexion = getDBConnection();

$datos = json_decode(file_get_contents("php://input"), true);

if ($datos) {
    $stmt = $conexion->prepare("INSERT INTO centro_informacion (campo, cantidad) VALUES (?, ?)");

    foreach ($datos as $dato) {
        $campo = $dato['campo'] ?? '';
        $cantidad = $dato['cantidad'] ?? '';
        $stmt->bind_param("ss", $campo, $cantidad);

        if (!$stmt->execute()) {
            echo json_encode(["estado" => "error", "mensaje" => "Error al insertar los datos"]);
            $stmt->close();
            $conexion->close();
            exit;
        }
    }

    $stmt->close();
    echo json_encode(["estado" => "ok"]);
} else {
    echo json_encode(["estado" => "error", "mensaje" => "No se recibieron datos"]);
}

$conexion->close();
