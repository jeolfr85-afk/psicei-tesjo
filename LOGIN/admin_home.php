<?php
require_once __DIR__ . '/../API/config.php';
psiceiStartSession();
require_once __DIR__ . '/../API/area_stats.php';

if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    header('Location: login.php?error=Acceso denegado.');
    exit();
}

$usuario = (string)($_SESSION['usuario'] ?? 'Administrador');
$allowedAreas = getAllowedInstitutionalAreas();

$conn = getDBConnection();
ensureUserSchemaAndAdmin($conn);
ensureRecordsSchema($conn);

$resTotal = $conn->query("SELECT COUNT(*) AS c FROM registrod WHERE role = 'user'");
$countAreaUsers = (int)($resTotal->fetch_assoc()['c'] ?? 0);

$areaSummaries = [];
foreach ($allowedAreas as $dirArea) {
    $stats = fetchAreaStats($conn, $dirArea, 'admin', $usuario);
    $areaSummaries[$dirArea] = $stats['counts'] ?? [];
}
$conn->close();

$enc = static fn(string $s): string => htmlspecialchars($s, ENT_QUOTES, 'UTF-8');

$areaMeta = [
    INSTITUTIONAL_AREA_ACADEMICA => ['class' => 'admin-area-card--academic', 'short' => 'Académica'],
    INSTITUTIONAL_AREA_VINCULACION => ['class' => 'admin-area-card--vinculacion', 'short' => 'Vinculación'],
];
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inicio - Administrador - PSICEI</title>
    <link rel="stylesheet" href="/prueba/prueba/assets/css/global.css">
    <link rel="stylesheet" href="/prueba/prueba/assets/css/psicei-theme.css">
    <link rel="stylesheet" href="/prueba/prueba/assets/css/admin-home.css">
</head>
<body class="admin-home">
    <div class="top-bar">
        <img src="images/enkabezado.png" alt="Encabezado" class="escudo">
    </div>

    <div class="admin-home__shell welcome-animate">
        <header class="admin-home__hero">
            <div>
                <h1>Bienvenido, administrador</h1>
                <p>Hola, <strong><?php echo $enc($usuario); ?></strong>. Panel de supervisión del PSICEI para las dos direcciones operativas.</p>
                <div class="admin-home__hero-actions">
                    <a class="ps-btn ps-danger" href="logout.php">Cerrar sesión</a>
                </div>
            </div>
            <div class="admin-home__kpi">
                <strong><?php echo $countAreaUsers; ?></strong>
                <span>Usuarios de área</span>
            </div>
        </header>

        <section class="admin-home__quick" aria-label="Accesos principales">
            <a href="admin_panel.php">
                <span class="admin-home__quick-icon admin-home__quick-icon--users" aria-hidden="true">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                </span>
                <div>
                    <h3>Gestión de usuarios</h3>
                    <p>Crear, editar y exportar cuentas</p>
                </div>
            </a>
            <a href="/prueba/prueba/MENU/portal.php">
                <span class="admin-home__quick-icon admin-home__quick-icon--portal" aria-hidden="true">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6h16v2H4V6zm0 5h10v2H4v-2zm0 5h16v2H4v-2z"/></svg>
                </span>
                <div>
                    <h3>Módulos y tabletas</h3>
                    <p>Entrar al sistema de captura</p>
                </div>
            </a>
        </section>

        <p class="admin-home__areas-title">Supervisión por dirección</p>
        <div class="admin-home__grid">
            <?php foreach ($allowedAreas as $dirArea):
                $c = $areaSummaries[$dirArea] ?? [];
                $qArea = rawurlencode($dirArea);
                $meta = $areaMeta[$dirArea] ?? ['class' => '', 'short' => ''];
            ?>
            <article class="admin-area-card <?php echo $enc($meta['class']); ?>">
                <div class="admin-area-card__head">
                    <h2><?php echo $enc($dirArea); ?></h2>
                </div>
                <div class="admin-area-card__metrics">
                    <div class="admin-area-card__metric">
                        <strong><?php echo (int)($c['records'] ?? 0); ?></strong>
                        <span>Registros</span>
                    </div>
                    <div class="admin-area-card__metric">
                        <strong><?php echo (int)($c['contacts'] ?? 0); ?></strong>
                        <span>Contactos</span>
                    </div>
                    <div class="admin-area-card__metric">
                        <strong><?php echo (int)($c['users'] ?? 0); ?></strong>
                        <span>Usuarios</span>
                    </div>
                </div>
                <nav class="admin-area-card__links" aria-label="Enlaces <?php echo $enc($meta['short']); ?>">
                    <a href="/prueba/prueba/MENU/resumen_area.php?area=<?php echo $qArea; ?>">Resumen</a>
                    <a href="/prueba/prueba/MENU/estadisticas.php?area=<?php echo $qArea; ?>">Estadísticas</a>
                    <a href="/prueba/prueba/MENU/records_history.php?area=<?php echo $qArea; ?>">Historial</a>
                </nav>
            </article>
            <?php endforeach; ?>
        </div>

        <p class="admin-home__footer">&copy; <?php echo date('Y'); ?> TecNM TESJo · PSICEI</p>
    </div>

    <script src="/prueba/prueba/assets/js/gemini-ai.js"></script>
</body>
</html>
