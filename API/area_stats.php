<?php

require_once __DIR__ . '/config.php';
require_once dirname(__DIR__) . '/MENU/area_modules.php';

/**
 * Cuenta módulos/departamentos visibles en el portal para el área del usuario.
 */
function countNavModulesForArea(string $role, string $area): int
{
    $tree = filterInstitutionalNavForUser(getInstitutionalNavigationTree(), $role, $area);
    $count = 0;

    $walk = static function (array $nodes) use (&$walk, &$count): void {
        foreach ($nodes as $node) {
            $url = (string)($node['url'] ?? '');
            if ($url !== '' && $url !== '#') {
                $count++;
            }
            if (!empty($node['children']) && is_array($node['children'])) {
                $walk($node['children']);
            }
        }
    };

    foreach ($tree as $section) {
        if (!empty($section['children']) && is_array($section['children'])) {
            $walk($section['children']);
        }
    }

    return $count;
}

/**
 * @return list<array{label: string, count: int}>
 */
function fetchRecordsByModule(mysqli $conn, string $area, int $limit = 12): array
{
    $byModule = [];
    $stmt = $conn->prepare(
        'SELECT modulo, COUNT(*) c FROM registros_area WHERE area = ? GROUP BY modulo ORDER BY c DESC LIMIT ?'
    );
    $stmt->bind_param('si', $area, $limit);
    $stmt->execute();
    $rs = $stmt->get_result();
    while ($r = $rs->fetch_assoc()) {
        $byModule[] = [
            'label' => (string)$r['modulo'],
            'count' => (int)$r['c'],
        ];
    }
    $stmt->close();

    return $byModule;
}

/**
 * Actividad por día (últimos 7 días, incluye días sin registros).
 *
 * @return array{labels: list<string>, counts: list<int>}
 */
function fetchActivityByDay(mysqli $conn, string $area, int $days = 7): array
{
    $labels = [];
    $counts = [];
    $map = [];

    for ($i = $days - 1; $i >= 0; $i--) {
        $d = date('Y-m-d', strtotime("-{$i} days"));
        $labels[] = date('d/m', strtotime($d));
        $map[$d] = 0;
    }

    $from = date('Y-m-d', strtotime('-' . ($days - 1) . ' days'));
    $stmt = $conn->prepare(
        'SELECT DATE(created_at) d, COUNT(*) c
         FROM registros_area
         WHERE area = ? AND DATE(created_at) >= ?
         GROUP BY DATE(created_at)'
    );
    $stmt->bind_param('ss', $area, $from);
    $stmt->execute();
    $rs = $stmt->get_result();
    while ($r = $rs->fetch_assoc()) {
        $map[(string)$r['d']] = (int)$r['c'];
    }
    $stmt->close();

    foreach (array_keys($map) as $d) {
        $counts[] = $map[$d];
    }

    return ['labels' => $labels, 'counts' => $counts];
}

/**
 * @return list<array<string, mixed>>
 */
function fetchRecentRecords(mysqli $conn, string $area, int $limit = 10): array
{
    $recent = [];
    $stmt = $conn->prepare(
        'SELECT id, modulo, created_by, created_at
         FROM registros_area
         WHERE area = ?
         ORDER BY id DESC
         LIMIT ?'
    );
    $stmt->bind_param('si', $area, $limit);
    $stmt->execute();
    $rs = $stmt->get_result();
    while ($r = $rs->fetch_assoc()) {
        $recent[] = $r;
    }
    $stmt->close();

    return $recent;
}

/**
 * Estadísticas consolidadas de un área institucional.
 *
 * @return array<string, mixed>
 */
function fetchAreaStats(mysqli $conn, string $area, string $role, string $usuario): array
{
    $area = trim($area);

    $countRecords = 0;
    $stmt = $conn->prepare('SELECT COUNT(*) c FROM registros_area WHERE area = ?');
    $stmt->bind_param('s', $area);
    $stmt->execute();
    $countRecords = (int)($stmt->get_result()->fetch_assoc()['c'] ?? 0);
    $stmt->close();

    $countContacts = 0;
    ensureContactsSchema($conn);
    $stmtC = $conn->prepare('SELECT COUNT(*) c FROM contactos WHERE area = ?');
    $stmtC->bind_param('s', $area);
    $stmtC->execute();
    $countContacts = (int)($stmtC->get_result()->fetch_assoc()['c'] ?? 0);
    $stmtC->close();

    $myRecords = 0;
    if ($usuario !== '') {
        $stmtM = $conn->prepare(
            'SELECT COUNT(*) c FROM registros_area WHERE area = ? AND created_by = ?'
        );
        $stmtM->bind_param('ss', $area, $usuario);
        $stmtM->execute();
        $myRecords = (int)($stmtM->get_result()->fetch_assoc()['c'] ?? 0);
        $stmtM->close();
    }

    $countUsers = 0;
    $stmtU = $conn->prepare("SELECT COUNT(*) c FROM registrod WHERE role = 'user' AND Area = ?");
    $stmtU->bind_param('s', $area);
    $stmtU->execute();
    $countUsers = (int)($stmtU->get_result()->fetch_assoc()['c'] ?? 0);
    $stmtU->close();

    $byModule = fetchRecordsByModule($conn, $area);
    $activity = fetchActivityByDay($conn, $area);
    $recent = fetchRecentRecords($conn, $area);

    return [
        'ok' => true,
        'area' => $area,
        'counts' => [
            'records' => $countRecords,
            'contacts' => $countContacts,
            'users' => $countUsers,
            'my_records' => $myRecords,
            'modules' => countNavModulesForArea($role, $area),
        ],
        'by_module' => $byModule,
        'activity' => $activity,
        'recent' => $recent,
    ];
}
