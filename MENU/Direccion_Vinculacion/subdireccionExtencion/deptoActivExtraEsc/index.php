<?php
require_once dirname(__DIR__, 3) . '/includes/module_landing_helper.php';

$session = portalRequireSession();

renderModuleLandingPage(
    $session,
    'theme-sports',
    'Departamento de Actividades Extraescolares',
    'Programas deportivos y culturales para la formación integral de la comunidad estudiantil.',
    'Subdirección de Extensión',
    'activities',
    [
        [
            'title' => 'Actividades deportivas',
            'description' => 'Eventos, equipos representativos y programas de activación física.',
            'url' => '/prueba/prueba/MENU/Direccion_Vinculacion/subdireccionExtencion/deptoActivExtraEsc/activDep/primeraEtapa/primEtapa.html',
            'icon' => 'sports',
        ],
        [
            'title' => 'Actividades culturales',
            'description' => 'Talleres, expresión artística y eventos culturales institucionales.',
            'url' => '/prueba/prueba/MENU/Direccion_Vinculacion/subdireccionExtencion/deptoActivExtraEsc/activCul/primeraEtapa/primEtapa.html',
            'icon' => 'culture',
        ],
    ],
    moduleStandardActions('Actividades Extraescolares'),
    'Formación integral',
    'Promueve el desarrollo deportivo y cultural de los estudiantes mediante actividades extraescolares.'
);
