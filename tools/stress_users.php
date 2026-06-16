<?php
/**
 * Prueba de estrés: capacidad de usuarios por área (tabla registrod).
 * Uso: php tools/stress_users.php [--keep] [--max=N]
 * Por defecto inserta lotes, mide tiempos y borra usuarios de prueba (prefijo stress_).
 */
declare(strict_types=1);

require_once __DIR__ . '/../API/config.php';

$keep = in_array('--keep', $argv, true);
$maxPerArea = 5000;
foreach ($argv as $arg) {
    if (str_starts_with($arg, '--max=')) {
        $maxPerArea = max(100, (int)substr($arg, 6));
    }
}

$areas = getAllowedInstitutionalAreas();
$passHash = password_hash('stress123', PASSWORD_BCRYPT);
$batches = [50, 100, 250, 500, 1000, 2000, 3000, 5000];
$batches = array_values(array_filter($batches, static fn(int $n) => $n <= $maxPerArea));

$conn = getDBConnection();
ensureUserSchemaAndAdmin($conn);

function countByArea(mysqli $conn, string $area): int
{
    $stmt = $conn->prepare("SELECT COUNT(*) c FROM registrod WHERE role = 'user' AND Area = ?");
    $stmt->bind_param('s', $area);
    $stmt->execute();
    $row = $stmt->get_result()->fetch_assoc();
    $stmt->close();
    return (int)($row['c'] ?? 0);
}

function benchSelectAll(mysqli $conn): array
{
    $t0 = microtime(true);
    $res = $conn->query(
        "SELECT id, Nombre, Apellido_Paterno, Correo_Institucional, Nombre_Usuario, Numero_de_telefono, Area, Subarea, role FROM registrod ORDER BY id DESC"
    );
    $rows = [];
    while ($r = $res->fetch_assoc()) {
        $rows[] = $r;
    }
    $ms = (microtime(true) - $t0) * 1000;
    $json = json_encode($rows, JSON_UNESCAPED_UNICODE);
    return [
        'total' => count($rows),
        'query_ms' => round($ms, 2),
        'json_kb' => round(strlen($json) / 1024, 1),
        'mem_mb' => round(memory_get_usage(true) / 1024 / 1024, 2),
    ];
}

function insertBatch(mysqli $conn, string $area, int $count, string $passHash): float
{
    $stmt = $conn->prepare(
        "INSERT INTO registrod (Nombre, Apellido_Paterno, Correo_Institucional, Nombre_Usuario, Contrasena, Area, Subarea, role)
         VALUES (?,?,?,?,?,?,?,'user')"
    );
    $t0 = microtime(true);
    $suffix = bin2hex(random_bytes(4));
    for ($i = 0; $i < $count; $i++) {
        $uid = 'stress_' . $suffix . '_' . $i;
        $nombre = 'Stress';
        $apellido = 'Test' . $i;
        $correo = $uid . '@tesjo.edu.mx';
        $usuario = $uid;
        $tel = '551234' . str_pad((string)($i % 10000), 4, '0', STR_PAD_LEFT);
        $sub = '';
        $stmt->bind_param('sssssss', $nombre, $apellido, $correo, $usuario, $passHash, $area, $sub);
        if (!$stmt->execute()) {
            throw new RuntimeException('INSERT falló: ' . $stmt->error);
        }
    }
    $stmt->close();
    return (microtime(true) - $t0) * 1000;
}

function deleteStressUsers(mysqli $conn): int
{
    $conn->query("DELETE FROM registrod WHERE Nombre_Usuario LIKE 'stress_%'");
    return $conn->affected_rows;
}

echo "=== PSICEI stress test (usuarios por área) ===\n";
echo 'PHP ' . PHP_VERSION . ' | memory_limit=' . ini_get('memory_limit') . "\n\n";

$deleted = deleteStressUsers($conn);
if ($deleted > 0) {
    echo "Limpieza previa: {$deleted} usuarios stress_ eliminados.\n\n";
}

$baseline = benchSelectAll($conn);
echo "Baseline: {$baseline['total']} usuarios | SELECT {$baseline['query_ms']} ms | JSON ~{$baseline['json_kb']} KB | RAM {$baseline['mem_mb']} MB\n\n";

$results = [];
$targetPerArea = 0;

foreach ($batches as $batchSize) {
    foreach ($areas as $area) {
        try {
            $insMs = insertBatch($conn, $area, $batchSize, $passHash);
        } catch (Throwable $e) {
            echo "FALLO insert {$batchSize} en [{$area}]: {$e->getMessage()}\n";
            break 2;
        }
        $targetPerArea += $batchSize;
    }

    $bench = benchSelectAll($conn);
    $perArea = [];
    foreach ($areas as $area) {
        $perArea[$area] = countByArea($conn, $area);
    }

    $results[] = [
        'per_area' => $targetPerArea,
        'total' => $bench['total'],
        'insert_ms' => round($insMs ?? 0, 0),
        'select_ms' => $bench['query_ms'],
        'json_kb' => $bench['json_kb'],
        'mem_mb' => $bench['mem_mb'],
    ];

    $ok = $bench['query_ms'] < 2000 && $bench['json_kb'] < 8192 && $bench['mem_mb'] < 120;
    $status = $ok ? 'OK' : 'LENTO/RIESGO';
    echo sprintf(
        "[%s] ~%d/área (%d total) | INSERT %.0f ms | SELECT %.2f ms | JSON %.1f KB | RAM %.1f MB\n",
        $status,
        $targetPerArea,
        $bench['total'],
        $insMs ?? 0,
        $bench['query_ms'],
        $bench['json_kb'],
        $bench['mem_mb']
    );

    if (!$ok) {
        echo "\nUmbral práctico alcanzado (SELECT >2s, JSON >8MB o RAM >120MB).\n";
        break;
    }
}

if (!$keep) {
    $n = deleteStressUsers($conn);
    echo "\nLimpieza: {$n} usuarios de prueba eliminados.\n";
} else {
    echo "\n--keep: usuarios stress_* conservados en BD.\n";
}

echo "\n--- Resumen recomendado ---\n";
$lastOk = null;
foreach ($results as $r) {
    if (($r['select_ms'] ?? 9999) < 500 && ($r['json_kb'] ?? 99999) < 2048) {
        $lastOk = $r;
    }
}
if ($lastOk) {
    echo sprintf(
        "Uso cómodo admin_panel: hasta ~%d usuarios por área (~%d total).\n",
        $lastOk['per_area'],
        $lastOk['total']
    );
} else {
    echo "Con pocos usuarios reales; sube el lote para medir más.\n";
}

$conn->close();
