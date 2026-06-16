<?php
require_once dirname(__DIR__, 3) . '/includes/portal_layout.php';

$session = portalRequireSession();

portalLayoutHead('Servicio Social');
portalLayoutBodyOpen(
    $session,
    'Servicio Social',
    'Gestión de actividades, registros y reportes de servicio social.',
    'Servicio Social y Residencia Profesional'
);
?>
        <header class="portal-main-header">
            <h1>Servicio Social</h1>
            <p class="portal-lead">Captura y consulta la información de Servicio Social de tu área.</p>
        </header>

        <article class="portal-card">
            <h3>Módulo en preparación</h3>
            <p>
                Las capturas y formularios de este submódulo se integrarán aquí.
                Mientras tanto, usa el menú lateral para navegar o el asistente IA para orientación.
            </p>
        </article>

<?php portalLayoutBodyClose(); ?>
