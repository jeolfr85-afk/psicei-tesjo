<?php
require_once dirname(__DIR__, 2) . '/includes/module_landing_helper.php';

$session = portalRequireSession();

renderModuleLandingPage(
    $session,
    'theme-library',
    'Biblioteca',
    'Centro de consulta, recursos bibliográficos y servicios de información académica del TESJo.',
    'Dirección de Vinculación y Extensión',
    'library',
    [
        [
            'title' => 'Catálogo y consulta',
            'description' => 'Consulta el acervo bibliográfico y recursos de información disponibles.',
            'url' => '/prueba/prueba/MENU/Direccion_Vinculacion/135UniBiblioteca/primeraEtapa/primEtapa.html',
            'icon' => 'library',
        ],
        [
            'title' => 'Préstamos y servicios',
            'description' => 'Gestión de préstamos, devoluciones y servicios al usuario.',
            'url' => '/prueba/prueba/MENU/Direccion_Vinculacion/135UniBiblioteca/segundaEtapa/segEtapa.html',
            'icon' => 'course',
        ],
        [
            'title' => 'Recursos digitales',
            'description' => 'Acceso a bases de datos, revistas electrónicas y material digital.',
            'url' => '/prueba/prueba/MENU/modulo_estadistico.php?module=Biblioteca',
            'icon' => 'resources',
        ],
    ],
    [
        ['label' => 'Capturar indicadores', 'url' => '/prueba/prueba/MENU/modulo_estadistico.php?module=Biblioteca'],
        ['label' => 'Descargar Excel', 'url' => '/prueba/prueba/API/records.php?action=export&type=excel&module=Biblioteca'],
        ['label' => 'Descargar PDF', 'url' => '/prueba/prueba/API/records.php?action=export&type=pdf&module=Biblioteca'],
        ['label' => 'Historial de registros', 'url' => '/prueba/prueba/MENU/records_history.php'],
    ],
    'Servicios bibliotecarios',
    'La biblioteca institucional ofrece espacios de lectura, consulta académica y acceso a recursos impresos y digitales para la comunidad TESJo.'
);
