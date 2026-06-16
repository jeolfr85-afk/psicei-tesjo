<?php
require_once dirname(__DIR__, 2) . '/includes/module_landing_helper.php';

$session = portalRequireSession();

renderModuleLandingPage(
    $session,
    'theme-tech',
    'Centro de Cómputo',
    'Infraestructura tecnológica, telecomunicaciones, redes y recursos informáticos del instituto.',
    'Dirección Académica',
    'tech',
    moduleCardsFromNavChildren('centro-computo', [
        'Telecomunicaciones de hardware' => 'Equipamiento, cableado e infraestructura de red física.',
        'Telecomunicaciones de software' => 'Sistemas, plataformas y aplicaciones de telecomunicación.',
        'Recursos informáticos' => 'Inventario y gestión de equipos y recursos tecnológicos.',
    ]),
    moduleStandardActions('Centro de Cómputo'),
    'Dashboard tecnológico',
    'Monitorea y administra los servicios de cómputo, conectividad y soporte tecnológico institucional.'
);
