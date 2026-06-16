<?php
require_once dirname(__DIR__, 2) . '/includes/module_landing_helper.php';

$session = portalRequireSession();

renderModuleLandingPage(
    $session,
    'theme-extension',
    'Subdirección de Extensión',
    'Actividades extraescolares, educación continua y proyectos de vinculación con la comunidad.',
    'Dirección de Vinculación y Extensión',
    'extension',
    [
        [
            'title' => 'Departamento de Actividades Extraescolares',
            'description' => 'Deportes, cultura y actividades de formación integral.',
            'url' => '/prueba/prueba/MENU/Direccion_Vinculacion/subdireccionExtencion/deptoActivExtraEsc/index.php',
            'icon' => 'activities',
        ],
        [
            'title' => 'Departamento de Educación Continua y a Distancia',
            'description' => 'Cursos, educación continua y proyectos de vinculación.',
            'url' => '/prueba/prueba/MENU/Direccion_Vinculacion/subdireccionExtencion/deptoEduContDist/index.php',
            'icon' => 'education',
        ],
    ],
    moduleStandardActions('Subdirección de Extensión'),
    'Extensión universitaria',
    'Vincula al instituto con la sociedad mediante programas de extensión, cultura, deporte y educación continua.'
);
