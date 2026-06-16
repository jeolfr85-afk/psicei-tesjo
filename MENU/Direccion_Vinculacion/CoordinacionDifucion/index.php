<?php
require_once dirname(__DIR__, 2) . '/includes/module_landing_helper.php';

$session = portalRequireSession();

renderModuleLandingPage(
    $session,
    'theme-comms',
    'Coordinación de Difusión',
    'Comunicación institucional, difusión de eventos y capacitación del personal docente y administrativo.',
    'Dirección de Vinculación y Extensión',
    'comms',
    moduleCardsFromNavChildren('coordinacion-difusion', [
        'Capacitación de personal docente' => 'Programas de capacitación y comunicación para docentes.',
        'Capacitación personal directivo y administrativa' => 'Formación para personal directivo y administrativo.',
    ]),
    moduleStandardActions('Coordinación de Difusión'),
    'Comunicación y difusión',
    'Coordina la difusión de acciones institucionales, eventos y programas de capacitación del personal.'
);
