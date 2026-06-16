<?php
require_once dirname(__DIR__, 2) . '/includes/module_landing_helper.php';

$session = portalRequireSession();

renderModuleLandingPage(
    $session,
    'theme-science',
    'Departamento de Investigación en Ciencias y Tecnología',
    'Proyectos de investigación, plantillas de investigadores, SNII e innovación científica.',
    'Dirección Académica',
    'science',
    moduleCardsFromNavChildren('investigacion', [
        'Proyecto de investigación' => 'Registro y seguimiento de proyectos de investigación activos.',
        'Plantilla de investigadores S20-F21' => 'Plantilla oficial de investigadores del periodo S20-F21.',
        'SNII' => 'Sistema Nacional de Investigadores e indicadores de desempeño.',
    ]),
    moduleStandardActions('Investigación en Ciencias y Tecnología'),
    'Laboratorio de innovación',
    'Gestiona la producción científica, proyectos de vinculación tecnológica y el desarrollo de investigadores institucionales.'
);
