<?php
require_once __DIR__ . '/../API/config.php';

$conn = getDBConnection();
ensureRecordsSchema($conn);

$rowsByArea = [
    'Unidad de Planeación' => [
        'Indicadores Institucionales',
        'Seguimiento de Calidad',
        'Planeación Estratégica',
    ],
    'Dirección Académica' => [
        'Desarrollo Académico',
        'Centro de Cómputo',
        'Investigación y Tecnología',
        'Servicios Escolares',
    ],
    'Dirección de Vinculación y Extensión' => [
        'Subdirección de Extensión',
        'Servicio Social y Residencias',
        'Biblioteca',
        'Coordinación de Difusión',
    ],
    'Subdirección de Servicios Administrativos' => [
        'Administración de Personal',
        'Recursos Financieros',
        'Recursos Materiales y Servicios Generales',
    ],
    'Unidad Jurídica y de Igualdad de Género' => [
        'Seguimiento Jurídico',
        'Acciones de Igualdad',
    ],
];

$users = ['admin', 'coordinador', 'analista', 'capturista'];
$stmt = $conn->prepare('INSERT INTO registros_area (area, subarea, modulo, payload_json, created_by) VALUES (?,?,?,?,?)');
$inserted = 0;

foreach ($rowsByArea as $area => $modules) {
    foreach ($modules as $mod) {
        for ($i = 1; $i <= 10; $i++) {
            $payload = [
                'periodo' => '2026-' . (($i % 2) ? 'A' : 'B'),
                'indicador' => $mod,
                'meta' => random_int(40, 120),
                'avance' => random_int(20, 120),
                'estatus' => (random_int(0, 10) > 2) ? 'En seguimiento' : 'Con riesgo',
                'observaciones' => 'Registro demo generado automáticamente para pruebas funcionales.'
            ];
            $json = json_encode($payload, JSON_UNESCAPED_UNICODE);
            $subarea = $mod;
            $createdBy = $users[array_rand($users)];
            $stmt->bind_param('sssss', $area, $subarea, $mod, $json, $createdBy);
            if ($stmt->execute()) {
                $inserted++;
            }
        }
    }
}

echo "inserted={$inserted}\n";

