<?php
require_once dirname(__DIR__, 2) . '/includes/module_landing_helper.php';

$session = portalRequireSession();

renderModuleLandingPage(
    $session,
    'theme-academic',
    'Departamento de Desarrollo Académico',
    'Evaluación docente, participación estudiantil en eventos académicos y capacitación del personal docente.',
    'Dirección Académica',
    'academic',
    moduleCardsFromNavChildren('desarrollo-academico', [
        'Evaluación docente' => 'Procesos de evaluación y seguimiento del desempeño docente.',
        'Alumnos en eventos académicos' => 'Registro de participación estudiantil en eventos académicos.',
        'Capacitación personal docente' => 'Programas de formación y actualización para docentes.',
    ]),
    moduleStandardActions('Desarrollo Académico'),
    'Desarrollo y calidad académica',
    'Coordina acciones orientadas a fortalecer la calidad educativa y el desarrollo profesional del personal docente.'
);
