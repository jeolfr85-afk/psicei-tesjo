<?php
require_once dirname(__DIR__, 3) . '/includes/portal_layout.php';

$session = portalRequireSession();

portalLayoutHead('Servicio a la Comunidad');
portalLayoutBodyOpen(
    $session,
    'Servicio a la Comunidad',
    'Coordinación y registro de actividades de servicio a la comunidad.',
    'Servicio Social y Residencia Profesional'
);
?>
        <header class="portal-main-header">
            <h1>Servicio a la Comunidad</h1>
            <p class="portal-lead">Gestión de actividades y registros de servicio a la comunidad.</p>
        </header>

        <article class="portal-card">
            <h3>Módulo en preparación</h3>
            <p>Las capturas de este submódulo estarán disponibles próximamente desde esta vista.</p>
        </article>

<?php portalLayoutBodyClose(); ?>
