<?php
require_once dirname(__DIR__, 3) . '/includes/module_landing_helper.php';

$session = portalRequireSession();

renderModuleLandingPage(
    $session,
    'theme-extension',
    'Departamento de Educación Continua y a Distancia',
    'Cursos de educación continua y proyectos de vinculación con sectores productivos.',
    'Subdirección de Extensión',
    'education',
    moduleCardsFromNavChildren('dept-edu-continua', [
        'Cursos de educación continua' => 'Oferta de cursos, talleres y programas de actualización.',
        'Proyecto de vinculación' => 'Proyectos de vinculación con empresas e instituciones externas.',
    ]),
    moduleStandardActions('Educación Continua y a Distancia'),
    'Educación permanente',
    'Impulsa la formación continua y la vinculación académica con el entorno social y productivo.'
);
