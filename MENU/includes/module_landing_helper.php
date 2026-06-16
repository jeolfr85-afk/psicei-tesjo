<?php

require_once __DIR__ . '/portal_layout.php';

/**
 * @param array<int, array{title: string, description: string, url: string, icon?: string}> $cards
 * @param array<int, array{label: string, url: string}> $actions
 */
function renderModuleLandingPage(
    array $session,
    string $themeClass,
    string $title,
    string $description,
    string $sectionName,
    string $heroIcon,
    array $cards = [],
    array $actions = [],
    string $infoTitle = '',
    string $infoText = ''
): void {
    portalLayoutHead($title, ['/prueba/prueba/assets/css/module-themes.css']);
    echo '<body class="portal-layout module-theme ' . htmlspecialchars($themeClass) . '"';
    echo ' data-user-area="' . htmlspecialchars($session['area']) . '"';
    echo ' data-user-role="' . htmlspecialchars($session['role']) . '"';
    echo ' data-user-name="' . htmlspecialchars($session['usuario']) . '"';
    echo ' data-current-module="' . htmlspecialchars($title) . '">';

    echo '<div class="top-bar">';
    echo '<img src="/prueba/prueba/MENU/images/enkabezado.png" alt="Encabezado institucional" class="escudo">';
    echo '</div>';

    echo portalRenderSidebar($session['role'], $session['usuario'], $session['area']);
    echo '<main class="portal-main" role="main">';

    echo '<header class="module-hero">';
    echo '<div class="module-hero-inner">';
    echo '<div class="module-hero-icon">' . portalNavIconSvg($heroIcon) . '</div>';
    echo '<div><h1>' . htmlspecialchars($title) . '</h1>';
    echo '<p class="module-lead">' . htmlspecialchars($description) . '</p></div>';
    echo '</div></header>';

    if ($cards !== []) {
        echo '<div class="module-grid">';
        foreach ($cards as $card) {
            $icon = (string)($card['icon'] ?? 'module');
            echo '<a class="module-card" href="' . htmlspecialchars((string)$card['url']) . '">';
            echo '<div class="module-card-icon">' . portalNavIconSvg($icon) . '</div>';
            echo '<h3>' . htmlspecialchars((string)$card['title']) . '</h3>';
            echo '<p>' . htmlspecialchars((string)$card['description']) . '</p>';
            echo '<span class="module-card-arrow">Acceder →</span>';
            echo '</a>';
        }
        echo '</div>';
    }

    if ($actions !== []) {
        echo '<div class="module-actions">';
        foreach ($actions as $action) {
            echo '<a class="module-action-btn" href="' . htmlspecialchars((string)$action['url']) . '">';
            echo htmlspecialchars((string)$action['label']);
            echo '</a>';
        }
        echo '</div>';
    }

    if ($infoTitle !== '' || $infoText !== '') {
        echo '<article class="module-info-panel">';
        if ($infoTitle !== '') {
            echo '<h3>' . htmlspecialchars($infoTitle) . '</h3>';
        }
        if ($infoText !== '') {
            echo '<p>' . htmlspecialchars($infoText) . '</p>';
        }
        echo '</article>';
    }

    echo '</main>';
    echo '<script src="/prueba/prueba/assets/js/portal-sidebar.js"></script>';
    echo '<script src="/prueba/prueba/assets/js/psicei-ui.js"></script>';
    echo '<script src="/prueba/prueba/assets/js/gemini-ai.js"></script>';
    echo '</body></html>';
}

/**
 * @return array<int, array{title: string, description: string, url: string, icon?: string}>
 */
function moduleCardsFromNavChildren(string $parentId, array $descriptions = []): array
{
    $cards = [];
    foreach (portalFindNavChildren($parentId) as $child) {
        $label = (string)($child['label'] ?? '');
        $cards[] = [
            'title' => $label,
            'description' => $descriptions[$label] ?? 'Accede al módulo de ' . mb_strtolower($label) . '.',
            'url' => (string)($child['url'] ?? '#'),
            'icon' => (string)($child['icon'] ?? 'module'),
        ];
    }
    return $cards;
}

function moduleStandardActions(string $moduleName): array
{
    return [
        [
            'label' => 'Capturar datos',
            'url' => '/prueba/prueba/MENU/modulo_estadistico.php?module=' . rawurlencode($moduleName),
        ],
        [
            'label' => 'Historial',
            'url' => '/prueba/prueba/MENU/records_history.php',
        ],
        [
            'label' => 'Exportar Excel',
            'url' => '/prueba/prueba/API/records.php?action=export&type=excel&module=' . rawurlencode($moduleName),
        ],
    ];
}

