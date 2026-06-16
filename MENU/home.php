<?php
require_once __DIR__ . '/../API/config.php';
psiceiStartSession();

if (!isset($_SESSION['usuario'])) {
    header('Location: /prueba/prueba/LOGIN/login.php?error=Inicia sesión para continuar.');
    exit();
}

$usuario = (string)($_SESSION['usuario'] ?? 'Usuario');
$area = (string)($_SESSION['area'] ?? '');
$subarea = (string)($_SESSION['subarea'] ?? '');
$role = (string)($_SESSION['role'] ?? 'user');

if ($role === 'admin') {
    header('Location: /prueba/prueba/LOGIN/admin_home.php');
    exit();
}

rejectUnauthorizedInstitutionalUser();
?>
<!doctype html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inicio - PSICEI</title>
    <link rel="stylesheet" href="/prueba/prueba/assets/css/global.css">
    <link rel="stylesheet" href="/prueba/prueba/assets/css/psicei-theme.css">
    <link rel="stylesheet" href="/prueba/prueba/assets/css/welcome-dashboard.css">
</head>
<body data-user-area="<?php echo htmlspecialchars($area); ?>" data-user-subarea="<?php echo htmlspecialchars($subarea); ?>" data-user-role="<?php echo htmlspecialchars($role); ?>" data-user-name="<?php echo htmlspecialchars($usuario); ?>">
    <div class="top-bar">
        <img src="/prueba/prueba/MENU/images/enkabezado.png" alt="Encabezado" class="escudo">
    </div>

    <div class="ps-wrap">
        <div class="ps-hero welcome-hero welcome-animate">
            <div>
                <h1>Bienvenido</h1>
                <p class="welcome-lead ps-sub">
                    Hola, <strong><?php echo htmlspecialchars($usuario); ?></strong>.
                    PSICEI te ayuda a capturar reportes e indicadores de tu área en tabletas,
                    guardar registros y descargarlos en PDF o Excel. Usa el asistente IA cuando necesites apoyo.
                </p>
                <div class="ps-actions" style="margin-top:16px;">
                    <a class="ps-btn ps-danger" href="/prueba/prueba/LOGIN/logout.php">Cerrar sesión</a>
                </div>
            </div>
        </div>

        <div class="nav-grid">
            <a href="/prueba/prueba/MENU/portal.php" class="nav-card welcome-animate welcome-animate-delay-1">
                <div class="nav-card-icon nav-card-icon--primary">
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 6h16v2H4V6zm0 5h10v2H4v-2zm0 5h16v2H4v-2z"/></svg>
                </div>
                <h3>Mis módulos</h3>
                <p>Accede a los departamentos y capturas de tu área.</p>
            </a>

            <a href="/prueba/prueba/MENU/resumen_area.php" class="nav-card welcome-animate welcome-animate-delay-2">
                <div class="nav-card-icon nav-card-icon--slate">
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>
                </div>
                <h3>Resumen de mi área</h3>
                <p>Consulta estadísticas y actividad reciente.</p>
            </a>

            <a href="/prueba/prueba/MENU/records_history.php" class="nav-card welcome-animate welcome-animate-delay-2">
                <div class="nav-card-icon nav-card-icon--green">
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
                </div>
                <h3>Historial</h3>
                <p>Revisa registros guardados anteriormente.</p>
            </a>

            <a href="/prueba/prueba/MENU/contactos.php" class="nav-card welcome-animate welcome-animate-delay-3">
                <div class="nav-card-icon nav-card-icon--amber">
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                </div>
                <h3>Contactos</h3>
                <p>Directorio y comunicación de tu área.</p>
            </a>

            <a href="/prueba/prueba/MENU/estadisticas.php" class="nav-card welcome-animate welcome-animate-delay-3">
                <div class="nav-card-icon nav-card-icon--primary">
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>
                </div>
                <h3>Estadísticas</h3>
                <p>Gráficas e indicadores de seguimiento.</p>
            </a>
        </div>

        <?php if ($area !== ''): ?>
        <p class="welcome-footer-note ps-muted">
            Tu área: <?php echo htmlspecialchars($area); ?><?php if ($subarea !== ''): ?> · <?php echo htmlspecialchars($subarea); ?><?php endif; ?>
        </p>
        <?php endif; ?>
    </div>

    <script src="/prueba/prueba/assets/js/gemini-ai.js"></script>
    <script src="/prueba/prueba/assets/js/psicei-ui.js"></script>
</body>
</html>
