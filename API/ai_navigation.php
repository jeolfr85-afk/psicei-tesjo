<?php

/**
 * Contexto de navegación del asistente (módulo / página actual).
 */

function aiNavigationCatalog(): array
{
    return [
        [
            'match' => 'alumnoseventos',
            'module' => 'Alumnos en eventos académicos',
            'section' => 'Departamento de Desarrollo Académico',
            'description' => 'Registro de participación estudiantil en eventos académicos por programa.',
        ],
        [
            'match' => 'evaluaciond',
            'module' => 'Evaluación Docente',
            'section' => 'Departamento de Desarrollo Académico',
            'description' => 'Registro, seguimiento y reporte del desempeño docente por programa académico.',
        ],
        [
            'match' => 'capacitadoc',
            'module' => 'Capacitación personal docente',
            'section' => 'Departamento de Desarrollo Académico',
            'description' => 'Registro de cursos, diplomados y capacitación del personal docente.',
        ],
        [
            'match' => 'telehard',
            'module' => 'Telecomunicaciones de hardware',
            'section' => 'Centro de Cómputo',
            'description' => 'Inventario de equipos y hardware de telecomunicaciones.',
        ],
        [
            'match' => 'telesof',
            'module' => 'Telecomunicaciones de software',
            'section' => 'Centro de Cómputo',
            'description' => 'Licencias de software usado y desarrollado.',
        ],
        [
            'match' => 'recursos',
            'module' => 'Recursos informáticos',
            'section' => 'Centro de Cómputo',
            'description' => 'Control de recursos informáticos institucionales.',
        ],
        [
            'match' => 'proyinv',
            'module' => 'Proyecto de investigación',
            'section' => 'Investigación en Ciencias y Tecnología',
            'description' => 'Seguimiento de proyectos de investigación institucional.',
        ],
        [
            'match' => 'plantinv',
            'module' => 'Plantilla de investigadores S20-F21',
            'section' => 'Investigación en Ciencias y Tecnología',
            'description' => 'Docentes-investigadores y horas asignadas a investigación.',
        ],
        [
            'match' => 'cursoseducacioncontinua',
            'module' => 'Cursos de educación continua',
            'section' => 'Educación Continua y a Distancia',
            'description' => 'Cursos cortos, diplomados, seminarios y talleres.',
        ],
        [
            'match' => 'proyectosvinculacion',
            'module' => 'Proyecto de vinculación',
            'section' => 'Educación Continua y a Distancia',
            'description' => 'Proyectos de vinculación con sectores productivos y sociales.',
        ],
        [
            'match' => 'capacitaciondoc',
            'module' => 'Capacitación de personal docente',
            'section' => 'Coordinación de Difusión',
            'description' => 'Capacitación docente coordinada por Difusión.',
        ],
        [
            'match' => 'personaldirectivo',
            'module' => 'Capacitación personal directivo y administrativo',
            'section' => 'Coordinación de Difusión',
            'description' => 'Capacitación del personal directivo y administrativo.',
        ],
        [
            'match' => 'residenciaprofesional',
            'module' => 'Residencia Profesional',
            'section' => 'Servicio Social y Residencia Profesional',
            'description' => 'Seguimiento y captura de información relacionada con residencias profesionales.',
        ],
        [
            'match' => 'serviciosocial',
            'module' => 'Servicio Social',
            'section' => 'Servicio Social y Residencia Profesional',
            'description' => 'Gestión de actividades, registros y reportes de servicio social.',
        ],
        [
            'match' => 'serviciocomunidad',
            'module' => 'Servicio a la Comunidad',
            'section' => 'Servicio Social y Residencia Profesional',
            'description' => 'Coordinación y registro de actividades de servicio a la comunidad.',
        ],
        [
            'match' => 'deptosersocrecidprof',
            'module' => 'Departamento de Servicio Social y Residencia Profesional',
            'section' => 'Dirección de Vinculación y Extensión',
            'description' => 'Punto de acceso al departamento y sus subáreas: comunidad, servicio social y residencia.',
        ],
        [
            'match' => 'deptoser',
            'module' => 'Departamento de Servicio Social y Residencia Profesional',
            'section' => 'Dirección de Vinculación y Extensión',
            'description' => 'Punto de acceso al departamento y sus subáreas institucionales.',
        ],
        [
            'match' => '135unibiblioteca',
            'module' => 'Biblioteca',
            'section' => 'Dirección de Vinculación y Extensión',
            'description' => 'Información y capturas del área de biblioteca universitaria.',
        ],
        [
            'match' => 'coordinaciondifucion',
            'module' => 'Coordinación de Difusión',
            'section' => 'Dirección de Vinculación y Extensión',
            'description' => 'Difusión, eventos y comunicación institucional.',
        ],
        [
            'match' => 'dirvinexten',
            'module' => 'Dirección de Vinculación y Extensión',
            'section' => 'Dirección de Vinculación y Extensión',
            'description' => 'Vista general de vinculación y extensión.',
        ],
        [
            'match' => '131deptodesacad',
            'module' => 'Departamento de Desarrollo Académico',
            'section' => 'Dirección Académica',
            'description' => 'Evaluación docente, eventos académicos y capacitación docente.',
        ],
        [
            'match' => '132deptocencomp',
            'module' => 'Centro de Cómputo',
            'section' => 'Dirección Académica',
            'description' => 'Infraestructura tecnológica, telecomunicaciones y recursos informáticos.',
        ],
        [
            'match' => '133deptoinvcientec',
            'module' => 'Departamento de Investigación en Ciencias y Tecnología',
            'section' => 'Dirección Académica',
            'description' => 'Investigación, proyectos, plantilla SNII y vinculación científica.',
        ],
        [
            'match' => 'subdireccionextencion',
            'module' => 'Subdirección de Extensión',
            'section' => 'Dirección de Vinculación y Extensión',
            'description' => 'Actividades extraescolares y educación continua.',
        ],
        [
            'match' => 'activdep',
            'module' => 'Actividades deportivas',
            'section' => 'Departamento de Actividades Extraescolares',
            'description' => 'Programas y eventos deportivos institucionales.',
        ],
        [
            'match' => 'activcul',
            'module' => 'Actividades culturales',
            'section' => 'Departamento de Actividades Extraescolares',
            'description' => 'Eventos y talleres culturales.',
        ],
        [
            'match' => 'portal.php',
            'module' => 'Menú principal',
            'section' => 'Navegación del sistema',
            'description' => 'Acceso central a módulos y departamentos del portal PSICEI.',
        ],
        [
            'match' => 'home.php',
            'module' => 'Inicio',
            'section' => 'Bienvenida',
            'description' => 'Pantalla de bienvenida con accesos rápidos a tus módulos.',
        ],
        [
            'match' => 'admin_home.php',
            'module' => 'Panel administrador',
            'section' => 'Administración',
            'description' => 'Gestión de usuarios y accesos del sistema.',
        ],
        [
            'match' => 'dashboard.php',
            'module' => 'Resumen general',
            'section' => 'Consultas',
            'description' => 'Estadísticas y actividad reciente de tu área.',
        ],
        [
            'match' => 'records_history.php',
            'module' => 'Historial de registros',
            'section' => 'Consultas',
            'description' => 'Consulta de registros guardados anteriormente.',
        ],
        [
            'match' => 'contactos.php',
            'module' => 'Contactos',
            'section' => 'Consultas',
            'description' => 'Directorio y gestión de contactos del área.',
        ],
        [
            'match' => 'estadisticas.php',
            'module' => 'Estadísticas',
            'section' => 'Consultas',
            'description' => 'Gráficas e indicadores de seguimiento.',
        ],
    ];
}

function aiNormalizePathKey(string $path): string
{
    $path = mb_strtolower(rawurldecode($path), 'UTF-8');
    return preg_replace('/[^a-z0-9]+/u', '', $path) ?? '';
}

function aiPathSegments(string $pathname): array
{
    $parts = array_filter(explode('/', mb_strtolower(rawurldecode($pathname))));
    $segments = [];
    foreach ($parts as $part) {
        $seg = preg_replace('/[^a-z0-9]+/u', '', $part) ?? '';
        if ($seg !== '') {
            $segments[] = $seg;
        }
    }
    return $segments;
}

function aiResolveModuleFromPath(string $pathname): array
{
    $key = aiNormalizePathKey($pathname);
    $segments = aiPathSegments($pathname);
    $best = null;
    $bestScore = -1;

    foreach (aiNavigationCatalog() as $entry) {
        $needle = aiNormalizePathKey((string)($entry['match'] ?? ''));
        if ($needle === '') {
            continue;
        }

        $score = -1;
        foreach ($segments as $idx => $seg) {
            if ($seg === $needle) {
                $score = max($score, 100000 + ($idx * 1000) + strlen($needle));
            } elseif (str_contains($seg, $needle)) {
                $score = max($score, 50000 + ($idx * 1000) + strlen($needle));
            }
        }
        if ($score < 0 && str_contains($key, $needle)) {
            $score = strlen($needle);
        }
        if ($score > $bestScore) {
            $bestScore = $score;
            $best = $entry;
        }
    }

    if ($best === null) {
        return [
            'module_name' => '',
            'section_name' => '',
            'description' => '',
        ];
    }

    return [
        'module_name' => (string)$best['module'],
        'section_name' => (string)$best['section'],
        'description' => (string)$best['description'],
    ];
}

function aiSanitizeNavigationContext($raw): array
{
    if (!is_array($raw)) {
        $raw = [];
    }

    $pathname = trim((string)($raw['pathname'] ?? ''));
    if ($pathname === '' && isset($raw['url'])) {
        $pathname = (string)(parse_url((string)$raw['url'], PHP_URL_PATH) ?: '');
    }

    $fromPath = aiResolveModuleFromPath($pathname);
    $uiType = trim((string)($raw['ui_type'] ?? ''));
    $clientModule = trim((string)($raw['module_name'] ?? ''));
    $sidebarActive = trim((string)($raw['sidebar_active'] ?? ''));
    $activeTab = trim((string)($raw['active_tab'] ?? ''));

    $moduleName = $clientModule;
    if ($moduleName === '') {
        $moduleName = trim((string)($raw['page_title'] ?? ''));
    }
    if ($moduleName === '') {
        $moduleName = $sidebarActive;
    }
    if ($moduleName === '') {
        $moduleName = $fromPath['module_name'];
    }

    // Si solo llegó el portal del departamento, preferir submódulo detectado en la URL.
    if (
        $fromPath['module_name'] !== ''
        && str_contains(mb_strtolower($moduleName), 'departamento de')
        && !str_contains(mb_strtolower($fromPath['module_name']), 'departamento de')
    ) {
        $moduleName = $fromPath['module_name'];
    }

    $sectionName = trim((string)($raw['section_name'] ?? ''));
    if ($sectionName === '') {
        $sectionName = trim((string)($raw['department'] ?? ''));
    }
    if ($sectionName === '') {
        $sectionName = $fromPath['section_name'];
    }

    $description = trim((string)($raw['description'] ?? ''));
    if ($description === '') {
        $description = $fromPath['description'];
    }
    if ($activeTab !== '' && !str_contains($description, $activeTab)) {
        $description = trim($description . ' Pestaña activa: ' . $activeTab . '.');
    }

    $breadcrumb = $raw['breadcrumb'] ?? [];
    if (!is_array($breadcrumb)) {
        $breadcrumb = [];
    }
    $breadcrumb = array_values(array_filter(array_map('strval', $breadcrumb)));

    $screenSummary = trim((string)($raw['screen_summary'] ?? ''));
    if ($screenSummary === '') {
        $screenSummary = implode(' · ', array_values(array_filter([
            $moduleName,
            $sectionName,
            $activeTab !== '' ? 'pestaña ' . $activeTab : '',
        ])));
    }

    return [
        'pathname' => $pathname,
        'url' => trim((string)($raw['url'] ?? '')),
        'page_title' => trim((string)($raw['page_title'] ?? '')),
        'module_name' => $moduleName,
        'section_name' => $sectionName,
        'department' => trim((string)($raw['department'] ?? $sectionName)),
        'description' => $description,
        'sidebar_active' => $sidebarActive !== '' ? $sidebarActive : $moduleName,
        'active_tab' => $activeTab,
        'ui_type' => $uiType,
        'screen_summary' => $screenSummary,
        'breadcrumb' => $breadcrumb,
    ];
}

function aiBuildLocationReply(array $nav, string $sessionArea, string $sessionSubarea, string $role): string
{
    $module = trim((string)($nav['module_name'] ?? ''));
    $section = trim((string)($nav['section_name'] ?? ''));
    $description = trim((string)($nav['description'] ?? ''));
    $pathname = trim((string)($nav['pathname'] ?? ''));
    $activeTab = trim((string)($nav['active_tab'] ?? ''));
    $sidebar = trim((string)($nav['sidebar_active'] ?? ''));

    if ($module === '') {
        $module = trim((string)($nav['page_title'] ?? ''));
    }
    if ($module === '' && $sidebar !== '') {
        $module = $sidebar;
    }
    if ($module === '') {
        $module = 'el sistema PSICEI';
    }

    $msg = "Actualmente estás en **{$module}**";
    if ($section !== '' && !str_contains(mb_strtolower($module), mb_strtolower($section))) {
        $msg .= ", del área de {$section}";
    }
    $msg .= '.';

    if ($activeTab !== '') {
        $msg .= " Estás viendo la pestaña «{$activeTab}».";
    }

    $descClean = preg_replace('/\s*Pestaña activa:.*$/u', '', $description) ?? $description;
    $descClean = trim($descClean);
    if ($descClean !== '') {
        $msg .= ' ' . $descClean;
    }

    if ($sessionArea !== '' && $role !== 'admin') {
        $msg .= " Tu área de usuario asignada es: {$sessionArea}.";
        if ($sessionSubarea !== '') {
            $msg .= " Subárea: {$sessionSubarea}.";
        }
    } elseif ($role === 'admin' && $sessionArea !== '') {
        $msg .= " Accedes como administrador; tu perfil institucional indica: {$sessionArea}.";
    }

    if ($pathname !== '') {
        $msg .= ' Si necesitas ayuda con capturas o registros en esta pantalla, dímelo con gusto.';
    }

    return str_replace('**', '', $msg);
}

function aiNavigationSystemBlock(array $nav, string $sessionArea, string $sessionSubarea, string $role): string
{
    $module = trim((string)($nav['module_name'] ?? ''));
    $section = trim((string)($nav['section_name'] ?? ''));
    $description = trim((string)($nav['description'] ?? ''));
    $pathname = trim((string)($nav['pathname'] ?? ''));
    $pageTitle = trim((string)($nav['page_title'] ?? ''));
    $sidebar = trim((string)($nav['sidebar_active'] ?? ''));
    $activeTab = trim((string)($nav['active_tab'] ?? ''));
    $screenSummary = trim((string)($nav['screen_summary'] ?? ''));
    $breadcrumb = $nav['breadcrumb'] ?? [];
    $crumbText = is_array($breadcrumb) && count($breadcrumb) ? implode(' > ', $breadcrumb) : '';

    $lines = [
        'PANTALLA ACTUAL (prioridad máxima — responde según esto, no según el área de sesión genérica):',
        '- Módulo visible: ' . ($module !== '' ? $module : '(no detectado)'),
    ];
    if ($screenSummary !== '') {
        $lines[] = '- Resumen de pantalla: ' . $screenSummary;
    }
    if ($activeTab !== '') {
        $lines[] = '- Pestaña activa: ' . $activeTab;
    }
    if ($section !== '') {
        $lines[] = '- Sección: ' . $section;
    }
    if ($description !== '') {
        $lines[] = '- Descripción del módulo: ' . $description;
    }
    if ($pageTitle !== '') {
        $lines[] = '- Título de página: ' . $pageTitle;
    }
    if ($sidebar !== '') {
        $lines[] = '- Ítem activo en menú lateral: ' . $sidebar;
    }
    if ($crumbText !== '') {
        $lines[] = '- Ruta de navegación: ' . $crumbText;
    }
    if ($pathname !== '') {
        $lines[] = '- URL (ruta): ' . $pathname;
    }
    $lines[] = '- Área de sesión (perfil): ' . ($sessionArea !== '' ? $sessionArea : '(sin asignar)');
    if ($sessionSubarea !== '') {
        $lines[] = '- Subárea de sesión: ' . $sessionSubarea;
    }
    $lines[] = '- Rol: ' . $role;
    $lines[] = 'Regla: Si preguntan "¿dónde estoy?" o "¿qué apartado?", describe el MÓDULO VISIBLE, no digas "Administración General" salvo que esa sea la pantalla activa.';

    return implode("\n", $lines);
}

function aiIsLocationQuestion(string $normalized): bool
{
    return aiContainsAny($normalized, [
        'donde estamos',
        'en donde estamos',
        'donde estoy',
        'en donde estoy',
        'que apartado',
        'cual apartado',
        'en que apartado',
        'que modulo',
        'cual modulo',
        'en que modulo',
        'que ventana',
        'que pagina',
        'en que pagina',
        'en que seccion',
        'ubicacion actual',
        'contexto actual',
        'en que parte del sistema',
        'que seccion es esta',
    ]);
}
