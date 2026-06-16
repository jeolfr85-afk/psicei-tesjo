<?php



require_once __DIR__ . '/area_modules.php';



function portalHomeUrl(string $role): string

{

    return $role === 'admin'

        ? '/prueba/prueba/LOGIN/admin_home.php'

        : '/prueba/prueba/MENU/home.php';

}



function getPortalSidebarNavigation(string $role, string $area = ''): array

{

    $nav = [

        [

            'id' => 'inicio',

            'label' => 'Inicio',

            'url' => portalHomeUrl($role),

            'icon' => 'home',

        ],

        [

            'id' => 'menu-principal',

            'label' => 'Menú principal',

            'url' => '/prueba/prueba/MENU/portal.php',

            'icon' => 'menu',

        ],

    ];



    $institutional = filterInstitutionalNavForUser(getInstitutionalNavigationTree(), $role, $area);

    foreach ($institutional as $section) {

        $nav[] = $section;

    }



    if ($role === 'admin') {

        $nav[] = [

            'id' => 'admin-section',

            'label' => 'Administración',

            'url' => '',

            'icon' => 'admin',

            'type' => 'section',

            'children' => [

                [

                    'id' => 'admin-home',

                    'label' => 'Panel administrador',

                    'url' => '/prueba/prueba/LOGIN/admin_home.php',

                    'icon' => 'admin',

                ],

            ],

        ];

    }



    $nav[] = [

        'id' => 'util-section',

        'label' => 'Consultas',

        'url' => '',

        'icon' => 'folder',

        'type' => 'section',

        'children' => [

            [

                'id' => 'historial',

                'label' => 'Historial de registros',

                'url' => '/prueba/prueba/MENU/records_history.php',

                'icon' => 'history',

            ],

            [

                'id' => 'contactos',

                'label' => 'Contactos',

                'url' => '/prueba/prueba/MENU/contactos.php',

                'icon' => 'mail',

            ],

        ],

    ];



    return $nav;

}



function portalNavIconSvg(string $icon): string

{

    $paths = [

        'home' => 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',

        'menu' => 'M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z',

        'dept' => 'M12 7V3H2v18h20V7H12zm-2 12H4v-2h6v2zm0-4H4v-2h6v2zm0-4H4V9h6v2zm10 8h-8v-2h8v2zm0-4h-8v-2h8v2zm0-4h-8V9h8v2z',

        'community' => 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',

        'social' => 'M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z',

        'residence' => 'M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3 1 9l11 6 9-4.91V17h2V9L12 3z',

        'module' => 'M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z',

        'division' => 'M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z',

        'admin' => 'M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z',

        'history' => 'M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0 3.87 3.13 7 7 7s7-3.13 7-7-3.13-7-7-7z',

        'mail' => 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z',

        'folder' => 'M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z',

        'academic' => 'M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3 1 9l11 6 9-4.91V17h2V9L12 3z',

        'tech' => 'M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z',

        'science' => 'M19.8 18.4 14 10.67V6.5l1.35-1.69A1 1 0 0 0 14.48 4H9.52a1 1 0 0 0-.87 1.5L10 6.5v4.17L4.2 18.4A1 1 0 0 0 5 20h14a1 1 0 0 0 .8-1.6z',

        'hardware' => 'M22 9V7h-2V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-2h2v-2h-2v-2h2V9h-2zm-4 10H4V5h14v14z',

        'software' => 'M9.4 16.6 4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0 4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z',

        'resources' => 'M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z',

        'project' => 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z',

        'template' => 'M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z',

        'snii' => 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',

        'eval' => 'M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z',

        'events' => 'M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2z',

        'training' => 'M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3 1 9l11 6 9-4.91V17h2V9L12 3z',

        'extension' => 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',

        'activities' => 'M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9 7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7',

        'sports' => 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z',

        'culture' => 'M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z',

        'education' => 'M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3 1 9l11 6 9-4.91V17h2V9L12 3z',

        'course' => 'M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z',

        'library' => 'M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z',

        'comms' => 'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z',

        'admin-cap' => 'M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z',

    ];

    $d = $paths[$icon] ?? $paths['module'];

    return '<svg class="sidebar-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="' . $d . '"/></svg>';

}



function portalCurrentPath(): string

{

    return parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH) ?: '';

}



function portalPathMatches(string $url, string $currentPath): bool

{

    if ($url === '' || $url === '#') {

        return false;

    }

    $path = parse_url($url, PHP_URL_PATH) ?: '';

    if ($path === $currentPath) {

        return true;

    }

    return basename($path) !== '' && basename($path) === basename($currentPath);

}



function portalNavItemActive(array $item, string $currentPath): bool

{

    if (portalPathMatches((string)($item['url'] ?? ''), $currentPath)) {

        return true;

    }

    foreach ($item['children'] ?? [] as $child) {

        if (portalNavItemActive($child, $currentPath)) {

            return true;

        }

    }

    return false;

}



function portalRenderNavItems(array $items, string $currentPath, int $depth = 0): string

{

    $html = '';

    foreach ($items as $item) {

        $type = (string)($item['type'] ?? '');

        $label = htmlspecialchars((string)($item['label'] ?? ''));

        $url = (string)($item['url'] ?? '');

        $icon = portalNavIconSvg((string)($item['icon'] ?? 'module'));

        $children = $item['children'] ?? [];

        $hasChildren = is_array($children) && count($children) > 0;

        $active = portalNavItemActive($item, $currentPath);

        $linkActive = portalPathMatches($url, $currentPath);



        if ($type === 'section' && $url === '') {

            $html .= '<div class="sidebar-section-title">' . $label . '</div>';

            if ($hasChildren) {

                $html .= portalRenderNavItems($children, $currentPath, $depth);

            }

            continue;

        }



        if ($hasChildren) {

            $open = $active ? ' is-open' : '';

            $html .= '<div class="sidebar-group depth-' . $depth . $open . '">';

            if ($url !== '' && $url !== '#') {

                $cls = 'sidebar-link depth-' . $depth . ($linkActive ? ' is-active' : '');

                $html .= '<a class="' . $cls . '" href="' . htmlspecialchars($url) . '">'

                    . $icon . '<span>' . $label . '</span>'

                    . '<span class="sidebar-chevron sidebar-chevron-link" aria-hidden="true"></span></a>';

            } else {

                $html .= '<button type="button" class="sidebar-link sidebar-toggle-group depth-' . $depth . '" aria-expanded="' . ($active ? 'true' : 'false') . '">'

                    . $icon . '<span>' . $label . '</span><span class="sidebar-chevron" aria-hidden="true"></span></button>';

            }

            $html .= '<div class="sidebar-children">' . portalRenderNavItems($children, $currentPath, $depth + 1) . '</div>';

            $html .= '</div>';

            continue;

        }



        if ($url === '' || $url === '#') {

            continue;

        }



        $cls = 'sidebar-link depth-' . $depth . ($linkActive ? ' is-active' : '');

        $html .= '<a class="' . $cls . '" href="' . htmlspecialchars($url) . '">' . $icon . '<span>' . $label . '</span></a>';

    }

    return $html;

}



function portalRenderSidebar(string $role, string $usuario, string $area = ''): string

{

    $nav = getPortalSidebarNavigation($role, $area);

    $currentPath = portalCurrentPath();

    $itemsHtml = portalRenderNavItems($nav, $currentPath);



    $user = htmlspecialchars($usuario);

    $logout = '/prueba/prueba/LOGIN/logout.php';



    return '<aside class="portal-sidebar" id="portal-sidebar">'

        . '<div class="sidebar-inner">'

        . '<div class="sidebar-brand"><span class="sidebar-brand-title">PSICEI</span><span class="sidebar-brand-sub">TESJo · Portal institucional</span></div>'

        . '<nav class="sidebar-nav" aria-label="Menú del sistema">' . $itemsHtml . '</nav>'

        . '<div class="sidebar-footer"><span class="sidebar-user">' . $user . '</span>'

        . '<a href="' . $logout . '" class="sidebar-logout">Cerrar sesión</a></div>'

        . '</div></aside>'

        . '<button type="button" class="sidebar-mobile-toggle" id="sidebar-mobile-toggle" aria-label="Menú">☰</button>'

        . '<div class="sidebar-overlay" id="sidebar-overlay"></div>';

}



function portalFindNavChildren(string $parentId): array

{

    $find = static function (array $items) use (&$find, $parentId): array {

        foreach ($items as $item) {

            if (($item['id'] ?? '') === $parentId) {

                return $item['children'] ?? [];

            }

            $nested = $find($item['children'] ?? []);

            if ($nested !== []) {

                return $nested;

            }

        }

        return [];

    };



    return $find(getInstitutionalNavigationTree());

}


