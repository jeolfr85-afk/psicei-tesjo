<?php

/**
 * Comandos inteligentes del asistente: navegación, exportaciones y consultas.
 */

function aiSystemModuleRoutes(): array
{
    return [
        ['keys' => ['evaluacion docente', 'evaluacion del docente', 'grafica de evaluacion docente', 'grafica evaluacion', 'evaluaciond'], 'label' => 'Evaluación Docente', 'url' => '/prueba/prueba/MENU/Direccion_Academica/131DeptoDesAcad/EvaluacionD/PrimerEtapa/PrimerEtapa.html'],
        ['keys' => ['alumnos en eventos', 'eventos academicos', 'alumnoseventos'], 'label' => 'Alumnos en eventos académicos', 'url' => '/prueba/prueba/MENU/Direccion_Academica/131DeptoDesAcad/AlumnosEventos/PrimerEtapa/PrimerEtapa.html'],
        ['keys' => ['capacitacion docente', 'capacitacion del docente', 'capacitadoc'], 'label' => 'Capacitación personal docente', 'url' => '/prueba/prueba/MENU/Direccion_Academica/131DeptoDesAcad/CapacitaDoc/PrimerEtapa/primeretapa.html'],
        ['keys' => ['telecomunicaciones hardware', 'telehard'], 'label' => 'Telecomunicaciones de hardware', 'url' => '/prueba/prueba/MENU/Direccion_Academica/132DeptoCenComp/TeleHard/PrimerEtapa/primeretapa.html'],
        ['keys' => ['telecomunicaciones software', 'telesof'], 'label' => 'Telecomunicaciones de software', 'url' => '/prueba/prueba/MENU/Direccion_Academica/132DeptoCenComp/Telesof/primeretapa/primeretapa.html'],
        ['keys' => ['recursos informaticos', 'recursos informáticos'], 'label' => 'Recursos informáticos', 'url' => '/prueba/prueba/MENU/Direccion_Academica/132DeptoCenComp/Recursos/PrimerEtapa/PrimerEtapa.html'],
        ['keys' => ['proyecto de investigacion', 'proyinv'], 'label' => 'Proyecto de investigación', 'url' => '/prueba/prueba/MENU/Direccion_Academica/133DeptoInvCienTec/ProyInv/PrimerEtapa/primerEtapa.html'],
        ['keys' => ['residencia profesional', 'residencia', 'residencias'], 'label' => 'Residencia Profesional', 'url' => '/prueba/prueba/MENU/Direccion_Vinculacion/deptoServSocRecidProf/ResidenciaProfesional/residenciaprofesional.php'],
        ['keys' => ['servicio social'], 'label' => 'Servicio Social', 'url' => '/prueba/prueba/MENU/Direccion_Vinculacion/deptoServSocRecidProf/ServicioSocial/serviciosocial.php'],
        ['keys' => ['servicio a la comunidad', 'servicio comunidad', 'comunidad'], 'label' => 'Servicio a la Comunidad', 'url' => '/prueba/prueba/MENU/Direccion_Vinculacion/deptoServSocRecidProf/ServicioComunidad/ServicioComunidad.php'],
        ['keys' => ['departamento servicio social', 'depto servicio social', 'ssrp', 'servicio social y residencia'], 'label' => 'Departamento SSyRP', 'url' => '/prueba/prueba/MENU/Direccion_Vinculacion/deptoServSocRecidProf/deptoser.php'],
        ['keys' => ['biblioteca'], 'label' => 'Biblioteca', 'url' => '/prueba/prueba/MENU/Direccion_Vinculacion/135UniBiblioteca/135UniBiblioteca.html'],
        ['keys' => ['coordinacion difusion', 'difusion', 'difusión'], 'label' => 'Coordinación de Difusión', 'url' => '/prueba/prueba/MENU/Direccion_Vinculacion/CoordinacionDifucion/coordinacionDifucion.html'],
        ['keys' => ['desarrollo academico', 'desarrollo académico'], 'label' => 'Desarrollo Académico', 'url' => '/prueba/prueba/MENU/Direccion_Academica/131DeptoDesAcad/131DeptoDesAcad.html'],
        ['keys' => ['centro de computo', 'centro cómputo', 'centro computo'], 'label' => 'Centro de Cómputo', 'url' => '/prueba/prueba/MENU/Direccion_Academica/132DeptoCenComp/132DeptoCenComp.html'],
        ['keys' => ['investigacion', 'investigación', 'ciencia y tecnologia'], 'label' => 'Investigación', 'url' => '/prueba/prueba/MENU/Direccion_Academica/133DeptoInvCienTec/133DeptoInvCienTec.html'],
        ['keys' => ['menu principal', 'portal', 'modulos', 'módulos'], 'label' => 'Menú principal', 'url' => '/prueba/prueba/MENU/portal.php'],
        ['keys' => ['inicio', 'pantalla inicio', 'bienvenida', 'home'], 'label' => 'Inicio', 'url' => '/prueba/prueba/MENU/inicio.php'],
        ['keys' => ['panel administrador', 'administracion usuarios', 'gestion usuarios', 'usuarios admin'], 'label' => 'Panel administrador', 'url' => '/prueba/prueba/LOGIN/admin_home.php', 'admin' => true],
        ['keys' => ['gestion usuarios', 'administrar usuarios'], 'label' => 'Gestión de usuarios', 'url' => '/prueba/prueba/LOGIN/admin_panel.php', 'admin' => true],
    ];
}

function aiResolveSystemCommand(string $normalized, string $role, array $nav): ?array
{
    $moduleName = trim((string)($nav['module_name'] ?? ''));

    // —— Exportar usuarios (solo admin) ——
    if ($role === 'admin' && aiContainsAny($normalized, ['usuario', 'usuarios'])) {
        if (aiContainsAny($normalized, ['pdf']) && aiContainsAny($normalized, ['descarga', 'descargar', 'exporta', 'exportar', 'baja', 'genera'])) {
            $result = [
                'action' => 'open_url',
                'url' => '/prueba/prueba/LOGIN/admin_panel.php?export=pdf',
                'message' => 'Abriendo la descarga PDF de usuarios…',
            ];
            return ['intent' => 'download_users_pdf', 'result' => $result];
        }
        if (aiContainsAny($normalized, ['excel', 'xlsx']) && aiContainsAny($normalized, ['descarga', 'descargar', 'exporta', 'exportar', 'baja', 'genera'])) {
            $result = [
                'action' => 'open_url',
                'url' => '/prueba/prueba/LOGIN/admin_panel.php?export=excel',
                'message' => 'Abriendo la descarga Excel de usuarios…',
            ];
            return ['intent' => 'download_users_excel', 'result' => $result];
        }
    }

    // —— Exportar registros / reportes ——
    if (aiContainsAny($normalized, ['pdf', 'reporte pdf']) && aiContainsAny($normalized, ['descarga', 'descargar', 'exporta', 'exportar', 'baja', 'genera', 'reporte'])) {
        $mod = aiExtractModuleFromCommand($normalized, $nav);
        $result = [
            'action' => 'download_pdf',
            'module' => $mod,
            'message' => 'Generando PDF' . ($mod !== '' ? " de {$mod}" : ' de registros') . '…',
        ];
        return ['intent' => 'download_pdf', 'result' => $result];
    }
    if (aiContainsAny($normalized, ['excel', 'xlsx', 'hoja']) && aiContainsAny($normalized, ['descarga', 'descargar', 'exporta', 'exportar', 'baja', 'genera'])) {
        $mod = aiExtractModuleFromCommand($normalized, $nav);
        $result = [
            'action' => 'download_excel',
            'module' => $mod,
            'message' => 'Generando Excel' . ($mod !== '' ? " de {$mod}" : ' de registros') . '…',
        ];
        return ['intent' => 'download_excel', 'result' => $result];
    }

    // —— Ver historial / registros de un módulo ——
    $wantsGenerate = aiContainsAny($normalized, ['genera', 'generar', 'crear', 'llenar', 'arma', 'rellena']);
    if (!$wantsGenerate && aiContainsAny($normalized, ['historial', 'ver registros', 'mis registros', 'registros guardados'])) {
        if (aiContainsAny($normalized, ['historial', 'registro', 'registros', 'guardado', 'anterior', 'muestrame', 'mostrar', 'consulta'])) {
            $mod = aiExtractModuleFromCommand($normalized, $nav);
            if ($mod === '' && $moduleName !== '') {
                $mod = $moduleName;
            }
            $url = '/prueba/prueba/MENU/records_history.php';
            if ($mod !== '') {
                $url .= '?module=' . rawurlencode($mod);
            }
            $result = [
                'action' => 'open_url',
                'url' => $url,
                'message' => 'Te llevo al historial' . ($mod !== '' ? " de {$mod}" : ' de registros') . '.',
            ];
            return ['intent' => 'open_records_filtered', 'result' => $result];
        }
    }

    // —— Navegar a módulo ——
    $openVerbs = ['abre', 'abrir', 'ir a', 'ir al', 'ir a la', 'lleva', 'llevar', 'llevame', 'llevame a', 'muestrame', 'mostrar', 'entra', 'entrar', 've a', 'vamos a', 'necesito ir', 'grafica de', 'grafica del', 'tabla de', 'captura de'];
    $wantsOpen = false;
    foreach ($openVerbs as $v) {
        if (str_contains($normalized, $v)) {
            $wantsOpen = true;
            break;
        }
    }
    if (!$wantsOpen && aiContainsAny($normalized, ['modulo', 'módulo', 'apartado', 'seccion', 'sección'])) {
        $wantsOpen = aiContainsAny($normalized, ['abre', 'abrir', 'ir', 'muestra', 'entra']);
    }

    if (
        $wantsOpen
        || aiContainsAny($normalized, [
            'servicio social', 'residencia profesional', 'biblioteca', 'menu principal', 'menú principal',
            'evaluacion docente', 'evaluacion del docente', 'eventos academicos', 'capacitacion docente',
        ])
    ) {
        foreach (aiSystemModuleRoutes() as $route) {
            if (!empty($route['admin']) && $role !== 'admin') {
                continue;
            }
            foreach ($route['keys'] as $key) {
                if (str_contains($normalized, aiNormalize($key))) {
                    $result = [
                        'action' => 'open_url',
                        'url' => $route['url'],
                        'message' => 'Abriendo ' . $route['label'] . '…',
                    ];
                    return ['intent' => 'open_module', 'result' => $result];
                }
            }
        }
    }

    // Menú principal / inicio (refuerzo)
    if (aiContainsAny($normalized, ['menu principal', 'menú principal', 'portal del sistema'])) {
        $result = ['action' => 'open_url', 'url' => '/prueba/prueba/MENU/portal.php', 'message' => 'Abriendo el menú principal…'];
        return ['intent' => 'open_portal', 'result' => $result];
    }

    return null;
}

function aiExtractModuleFromCommand(string $normalized, array $nav): string
{
    foreach (aiSystemModuleRoutes() as $route) {
        foreach ($route['keys'] as $key) {
            if (str_contains($normalized, aiNormalize($key))) {
                return (string)$route['label'];
            }
        }
    }
    return trim((string)($nav['module_name'] ?? ''));
}
