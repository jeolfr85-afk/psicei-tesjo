<?php
require_once dirname(__DIR__, 3) . '/includes/portal_layout.php';

$session = portalRequireSession();

portalLayoutHead('Residencia Profesional');
portalLayoutBodyOpen(
    $session,
    'Residencia Profesional',
    'Seguimiento y captura de información relacionada con residencias profesionales.',
    'Servicio Social y Residencia Profesional'
);
?>
        <header class="portal-main-header">
            <h1>Residencia Profesional</h1>
            <p class="portal-lead">Seguimiento y captura de información de residencia profesional.</p>
        </header>

        <article class="portal-card">
            <h3>Módulo en preparación</h3>
            <p>Las capturas de este submódulo estarán disponibles próximamente desde esta vista.</p>
        </article>

<?php portalLayoutBodyClose(); ?>
