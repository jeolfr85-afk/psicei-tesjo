<?php
require_once __DIR__ . '/../API/config.php';

$conn = getDBConnection();
ensureContactsSchema($conn);

$map = [
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
        'Subdirección de Servicios Profesionales',
    ],
    'Dirección de Vinculación y Extensión' => [
        'Subdirección de Extensión',
        'Unidad de Biblioteca',
        'Departamento de Servicio Social y Residencia Profesional',
        'Departamento de Actividades Extraescolares',
        'Departamento de Educación Continua y a Distancia',
    ],
    'Subdirección de Servicios Administrativos' => [
        'Departamento de Administración Personal',
        'Departamento de Recursos Financieros',
        'Departamento de Recursos Materiales y Servicios Generales',
    ],
];

$names = ['Ana','Luis','Karla','Jorge','María','José','Daniel','Sofía','Miguel','Valeria','Fernando','Paola','Diego','Andrea','Raúl','Gabriela'];
$lasts = ['García','Hernández','Martínez','López','González','Pérez','Sánchez','Ramírez','Cruz','Flores','Torres','Vargas','Reyes','Morales'];
$puestos = ['Docente','Coordinación','Control Escolar','Biblioteca','Servicios','Vinculación','Jefatura','Auxiliar','Tutoría','Laboratorio'];

$stmt = $conn->prepare('INSERT INTO contactos (nombre, puesto, correo, telefono, area, tags) VALUES (?,?,?,?,?,?)');
$inserted = 0;

foreach ($map as $area => $subs) {
    foreach ($subs as $sub) {
        for ($i = 0; $i < 10; $i++) {
            $name = $names[array_rand($names)] . ' ' . $lasts[array_rand($lasts)] . ' ' . $lasts[array_rand($lasts)];
            $correo = strtolower(str_replace(' ', '.', $name)) . random_int(10, 99) . '@tesjo.edu.mx';
            $tel = '712' . str_pad((string)random_int(1000000, 9999999), 7, '0', STR_PAD_LEFT);
            $puesto = $puestos[array_rand($puestos)];
            $tags = 'demo,activo,subarea:' . $sub;

            $stmt->bind_param('ssssss', $name, $puesto, $correo, $tel, $area, $tags);
            if ($stmt->execute()) {
                $inserted++;
            }
        }
    }
}

echo "inserted={$inserted}\n";
