<?php

require_once dirname(__DIR__, 2) . '/API/config.php';
require_once dirname(__DIR__) . '/portal_nav.php';

/**
 * @return array{usuario: string, area: string, subarea: string, role: string}
 */
function portalRequireSession(): array
{
    psiceiStartSession();

    if (!isset($_SESSION['usuario'])) {
        header('Location: ' . psiceiLoginUrlPath() . '?error=Inicia sesión para continuar.');
        exit();
    }

    rejectUnauthorizedInstitutionalUser();

    return [
        'usuario' => (string)($_SESSION['usuario'] ?? ''),
        'area' => (string)($_SESSION['area'] ?? ''),
        'subarea' => (string)($_SESSION['subarea'] ?? ''),
        'role' => (string)($_SESSION['role'] ?? 'user'),
    ];
}

function portalLayoutHead(string $title, array $extraStylesheets = []): void
{
    $safeTitle = htmlspecialchars($title);
    echo '<!doctype html><html lang="es"><head>';
    echo '<meta charset="UTF-8">';
    echo '<meta name="viewport" content="width=device-width, initial-scale=1.0">';
    echo '<title>' . $safeTitle . ' - PSICEI</title>';
    echo '<link rel="stylesheet" href="/prueba/prueba/assets/css/global.css">';
    echo '<link rel="stylesheet" href="/prueba/prueba/assets/css/psicei-theme.css">';
    echo '<link rel="stylesheet" href="/prueba/prueba/assets/css/portal-sidebar.css">';
    foreach ($extraStylesheets as $href) {
        echo '<link rel="stylesheet" href="' . htmlspecialchars($href) . '">';
    }
    echo '</head>';
}

function portalLayoutBodyOpen(array $session, string $moduleName = '', string $moduleDescription = '', string $sectionName = ''): void
{
    $area = $session['area'];
    $subarea = $session['subarea'];
    $role = $session['role'];
    $usuario = $session['usuario'];

    echo '<body class="portal-layout" data-user-area="' . htmlspecialchars($area) . '"';
    echo ' data-user-subarea="' . htmlspecialchars($subarea) . '"';
    echo ' data-user-role="' . htmlspecialchars($role) . '"';
    echo ' data-user-name="' . htmlspecialchars($usuario) . '"';
    if ($moduleName !== '') {
        echo ' data-current-module="' . htmlspecialchars($moduleName) . '"';
    }
    if ($sectionName !== '') {
        echo ' data-current-section="' . htmlspecialchars($sectionName) . '"';
    }
    if ($moduleDescription !== '') {
        echo ' data-current-module-description="' . htmlspecialchars($moduleDescription) . '"';
    }
    echo '>';

    echo '<div class="top-bar">';
    echo '<img src="/prueba/prueba/MENU/images/enkabezado.png" alt="Encabezado institucional" class="escudo">';
    echo '</div>';

    echo portalRenderSidebar($role, $usuario, $area);
    echo '<main class="portal-main" role="main">';
}

function portalLayoutBodyClose(bool $includeAi = true): void
{
    echo '</main>';
    echo '<script src="/prueba/prueba/assets/js/portal-sidebar.js"></script>';
    echo '<script src="/prueba/prueba/assets/js/psicei-ui.js"></script>';
    if ($includeAi) {
        echo '<script src="/prueba/prueba/assets/js/gemini-ai.js"></script>';
    }
    echo '</body></html>';
}
