<?php

/**
 * Jerarquía institucional del portal PSICEI.
 * Dirección Académica y Dirección de Vinculación y Extensión.
 */
function portalBasePath(): string
{
    return '/prueba/prueba/MENU';
}

function getInstitutionalNavigationTree(): array
{
    $b = portalBasePath();
    $acad = $b . '/Direccion_Academica';
    $vin = $b . '/Direccion_Vinculacion';

    return [
        [
            'id' => 'dir-academica',
            'label' => 'Dirección Académica',
            'type' => 'section',
            'icon' => 'division',
            'children' => [
                [
                    'id' => 'desarrollo-academico',
                    'label' => 'Departamento de Desarrollo Académico',
                    'url' => $acad . '/131DeptoDesAcad/index.php',
                    'icon' => 'academic',
                    'children' => [
                        [
                            'id' => 'eval-docente',
                            'label' => 'Evaluación docente',
                            'url' => $acad . '/131DeptoDesAcad/EvaluacionD/PrimerEtapa/PrimerEtapa.html',
                            'icon' => 'eval',
                        ],
                        [
                            'id' => 'alumnos-eventos',
                            'label' => 'Alumnos en eventos académicos',
                            'url' => $acad . '/131DeptoDesAcad/AlumnosEventos/PrimerEtapa/PrimerEtapa.html',
                            'icon' => 'events',
                        ],
                        [
                            'id' => 'cap-docente',
                            'label' => 'Capacitación personal docente',
                            'url' => $acad . '/131DeptoDesAcad/CapacitaDoc/PrimerEtapa/primeretapa.html',
                            'icon' => 'training',
                        ],
                    ],
                ],
                [
                    'id' => 'centro-computo',
                    'label' => 'Centro de Cómputo',
                    'url' => $acad . '/132DeptoCenComp/index.php',
                    'icon' => 'tech',
                    'children' => [
                        [
                            'id' => 'tele-hardware',
                            'label' => 'Telecomunicaciones de hardware',
                            'url' => $acad . '/132DeptoCenComp/TeleHard/PrimerEtapa/primeretapa.html',
                            'icon' => 'hardware',
                        ],
                        [
                            'id' => 'tele-software',
                            'label' => 'Telecomunicaciones de software',
                            'url' => $acad . '/132DeptoCenComp/Telesof/primeretapa/primeretapa.html',
                            'icon' => 'software',
                        ],
                        [
                            'id' => 'recursos-info',
                            'label' => 'Recursos informáticos',
                            'url' => $acad . '/132DeptoCenComp/Recursos/PrimerEtapa/PrimerEtapa.html',
                            'icon' => 'resources',
                        ],
                    ],
                ],
                [
                    'id' => 'investigacion',
                    'label' => 'Departamento de Investigación en Ciencias y Tecnología',
                    'url' => $acad . '/133DeptoInvCienTec/index.php',
                    'icon' => 'science',
                    'children' => [
                        [
                            'id' => 'proy-inv',
                            'label' => 'Proyecto de investigación',
                            'url' => $acad . '/133DeptoInvCienTec/ProyInv/PrimerEtapa/primerEtapa.html',
                            'icon' => 'project',
                        ],
                        [
                            'id' => 'plantilla-inv',
                            'label' => 'Plantilla de investigadores S20-F21',
                            'url' => $acad . '/133DeptoInvCienTec/PlantInv/PrimerEtapa/primerEtapa.html',
                            'icon' => 'template',
                        ],
                        [
                            'id' => 'snii',
                            'label' => 'SNII',
                            'url' => $acad . '/133DeptoInvCienTec/SNI/PrimerEtapa/PrimerEtapa.html',
                            'icon' => 'snii',
                        ],
                    ],
                ],
            ],
        ],
        [
            'id' => 'dir-vinculacion',
            'label' => 'Dirección de Vinculación y Extensión',
            'type' => 'section',
            'icon' => 'division',
            'children' => [
                [
                    'id' => 'subdireccion-extension',
                    'label' => 'Subdirección de Extensión',
                    'url' => $vin . '/subdireccionExtencion/index.php',
                    'icon' => 'extension',
                    'children' => [
                        [
                            'id' => 'dept-extraescolares',
                            'label' => 'Departamento de Actividades Extraescolares',
                            'url' => $vin . '/subdireccionExtencion/deptoActivExtraEsc/index.php',
                            'icon' => 'activities',
                            'children' => [
                                [
                                    'id' => 'act-deportivas',
                                    'label' => 'Actividades deportivas',
                                    'url' => $vin . '/subdireccionExtencion/deptoActivExtraEsc/activDep/primeraEtapa/primEtapa.html',
                                    'icon' => 'sports',
                                ],
                                [
                                    'id' => 'act-culturales',
                                    'label' => 'Actividades culturales',
                                    'url' => $vin . '/subdireccionExtencion/deptoActivExtraEsc/activCul/primeraEtapa/primEtapa.html',
                                    'icon' => 'culture',
                                ],
                            ],
                        ],
                        [
                            'id' => 'dept-edu-continua',
                            'label' => 'Departamento de Educación Continua y a Distancia',
                            'url' => $vin . '/subdireccionExtencion/deptoEduContDist/index.php',
                            'icon' => 'education',
                            'children' => [
                                [
                                    'id' => 'cursos-continua',
                                    'label' => 'Cursos de educación continua',
                                    'url' => $vin . '/subdireccionExtencion/deptoEduContDist/cursosEducacioncontinua/primerEtapa/primeretapa.html',
                                    'icon' => 'course',
                                ],
                                [
                                    'id' => 'proy-vinculacion',
                                    'label' => 'Proyecto de vinculación',
                                    'url' => $vin . '/subdireccionExtencion/deptoEduContDist/ProyectosVinculacion/PrimeraEtapa/primeraEtapa.html',
                                    'icon' => 'project',
                                ],
                            ],
                        ],
                    ],
                ],
                getServicioSocialResidenciaNav(),
                [
                    'id' => 'biblioteca',
                    'label' => 'Biblioteca',
                    'url' => $vin . '/135UniBiblioteca/index.php',
                    'icon' => 'library',
                ],
                [
                    'id' => 'coordinacion-difusion',
                    'label' => 'Coordinación de Difusión',
                    'url' => $vin . '/CoordinacionDifucion/index.php',
                    'icon' => 'comms',
                    'children' => [
                        [
                            'id' => 'cap-docente-dif',
                            'label' => 'Capacitación de personal docente',
                            'url' => $vin . '/CoordinacionDifucion/capacitacionDoc/PrimerEtapa/PrimerEtapa.html',
                            'icon' => 'training',
                        ],
                        [
                            'id' => 'cap-directivo',
                            'label' => 'Capacitación personal directivo y administrativa',
                            'url' => $vin . '/CoordinacionDifucion/PersonalDirectivo/PrimerEtapa/PrimerEtapa.html',
                            'icon' => 'admin-cap',
                        ],
                    ],
                ],
            ],
        ],
    ];
}

/**
 * SSRP — grupo reutilizable en árbol y landings.
 */
function getServicioSocialResidenciaNav(): array
{
    $base = portalBasePath() . '/Direccion_Vinculacion/deptoServSocRecidProf';
    return [
        'id' => 'ssrp',
        'label' => 'Departamento de Servicio Social y Residencia Profesional',
        'url' => $base . '/deptoser.php',
        'icon' => 'dept',
        'children' => [
            [
                'id' => 'ssrp-comunidad',
                'label' => 'Servicio a la comunidad',
                'url' => $base . '/ServicioComunidad/PrimerEtapa/primerEtapa.html',
                'icon' => 'community',
            ],
            [
                'id' => 'ssrp-social',
                'label' => 'Servicio social',
                'url' => $base . '/ServicioSocial/primerEtapa/primeretapa.html',
                'icon' => 'social',
            ],
            [
                'id' => 'ssrp-residencia',
                'label' => 'Residencia profesional',
                'url' => $base . '/ResidenciaProfesional/primeretapa/primeretapa.html',
                'icon' => 'residence',
            ],
        ],
    ];
}

/**
 * Mapa plano legacy (formularios, IA).
 */
function getAreaModulesMap(): array
{
    $tree = getInstitutionalNavigationTree();
    $map = [];

    foreach ($tree as $section) {
        if (($section['type'] ?? '') !== 'section') {
            continue;
        }
        $label = (string)($section['label'] ?? '');
        $map[$label] = [];
        foreach ($section['children'] ?? [] as $child) {
            $map[$label][] = [
                'label' => (string)($child['label'] ?? ''),
                'url' => (string)($child['url'] ?? '#'),
            ];
        }
    }

    return $map;
}

function getPortalDivisionNames(): array
{
    return array_map(
        static fn(array $s) => (string)($s['label'] ?? ''),
        array_filter(getInstitutionalNavigationTree(), static fn(array $s) => ($s['type'] ?? '') === 'section')
    );
}

function filterInstitutionalNavForUser(array $tree, string $role, string $area): array
{
    if ($role === 'admin') {
        return $tree;
    }

    $areaNorm = mb_strtolower(trim($area));
    $filtered = [];

    foreach ($tree as $section) {
        $sectionLabel = mb_strtolower((string)($section['label'] ?? ''));
        $isAcademic = str_contains($areaNorm, 'académ') || str_contains($areaNorm, 'academ');
        $isVinculacion = str_contains($areaNorm, 'vincul') || str_contains($areaNorm, 'extens');

        if ($isAcademic && str_contains($sectionLabel, 'académ')) {
            $filtered[] = $section;
        } elseif ($isVinculacion && str_contains($sectionLabel, 'vincul')) {
            $filtered[] = $section;
        } elseif ($area === '' && str_contains($sectionLabel, 'vincul')) {
            $filtered[] = $section;
        }
    }

    if ($filtered === [] && $area !== '') {
        foreach ($tree as $section) {
            if (str_contains(mb_strtolower((string)($section['label'] ?? '')), mb_strtolower($area))) {
                $filtered[] = $section;
            }
        }
    }

    return $filtered;
}
