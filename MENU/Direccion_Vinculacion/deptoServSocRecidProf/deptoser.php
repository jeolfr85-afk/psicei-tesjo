<?php

require_once dirname(__DIR__, 2) . '/includes/module_landing_helper.php';



$session = portalRequireSession();

$ssrp = getServicioSocialResidenciaNav();



renderModuleLandingPage(

    $session,

    'theme-admin-pro',

    'Departamento de Servicio Social y Residencia Profesional',

    'Coordinación de servicio a la comunidad, servicio social y residencia profesional.',

    'Dirección de Vinculación y Extensión',

    'dept',

    array_map(static fn(array $child) => [

        'title' => (string)$child['label'],

        'description' => match ((string)($child['id'] ?? '')) {

            'ssrp-comunidad' => 'Programas de servicio a la comunidad y vinculación social.',

            'ssrp-social' => 'Gestión y seguimiento del servicio social estudiantil.',

            'ssrp-residencia' => 'Residencia profesional y prácticas en sector productivo.',

            default => 'Accede al submódulo correspondiente.',

        },

        'url' => (string)$child['url'],

        'icon' => (string)($child['icon'] ?? 'module'),

    ], $ssrp['children'] ?? []),

    moduleStandardActions('Servicio Social y Residencia Profesional'),

    'Gestión profesional',

    'Administra los procesos de servicio social, residencia profesional y vinculación comunitaria con registro, consulta y reportes.'

);


