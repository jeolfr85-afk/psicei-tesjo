<?php
require_once __DIR__ . '/config.php';
psiceiStartSession();
header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['usuario']) || (string)($_SESSION['role'] ?? 'user') !== 'admin') {
    echo json_encode(['error' => 'Acceso denegado.']);
    exit();
}

$action = $_GET['action'] ?? '';

function repoRoot(): string
{
    // .../prueba/prueba/API -> .../prueba/prueba
    return dirname(__DIR__);
}

function listHtmlFiles(string $baseDir): array
{
    $files = [];
    $it = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($baseDir, FilesystemIterator::SKIP_DOTS)
    );
    foreach ($it as $file) {
        /** @var SplFileInfo $file */
        if (!$file->isFile()) continue;
        $name = $file->getFilename();
        if (str_ends_with(strtolower($name), '.html') || str_ends_with(strtolower($name), '.htm')) {
            $files[] = $file->getPathname();
        }
    }
    return $files;
}

function webPathFromFs(string $fsPath): string
{
    $root = repoRoot();
    $rel = str_replace('\\', '/', substr($fsPath, strlen($root)));
    return '/prueba/prueba' . $rel;
}

function fsPathFromWeb(string $webPath): ?string
{
    $path = parse_url($webPath, PHP_URL_PATH);
    if (!is_string($path) || $path === '') return null;
    $path = str_replace('\\', '/', $path);
    $prefix = '/prueba/prueba/';
    if (str_starts_with($path, $prefix)) {
        $rel = substr($path, strlen($prefix));
    } else {
        // rutas absolutas tipo /MENU/... o relativas no se intentan resolver aquí
        $rel = ltrim($path, '/');
        if (!str_starts_with($rel, 'MENU/') && !str_starts_with($rel, 'assets/') && !str_starts_with($rel, 'LOGIN/') && !str_starts_with($rel, 'API/')) {
            return null;
        }
    }
    $rel = rawurldecode($rel);
    return repoRoot() . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $rel);
}

function extractLinks(string $html): array
{
    $links = [];
    // href/src simples
    if (preg_match_all('/\b(?:href|src)\s*=\s*["\']([^"\']+)["\']/i', $html, $m)) {
        foreach ($m[1] as $u) {
            $u = trim((string)$u);
            if ($u === '' || str_starts_with($u, '#')) continue;
            if (preg_match('/^(https?:|mailto:|tel:|javascript:)/i', $u)) continue;
            $links[] = $u;
        }
    }
    return array_values(array_unique($links));
}

function hasAiScript(string $html): bool
{
    return str_contains($html, '/assets/js/gemini-ai.js');
}

function hasTheme(string $html): bool
{
    return str_contains($html, '/assets/css/psicei-theme.css');
}

function injectTheme(string $html): string
{
    if (hasTheme($html)) return $html;
    $tag = "<link rel=\"stylesheet\" href=\"/prueba/prueba/assets/css/psicei-theme.css\">\n";
    // Insert before </head> if possible
    if (stripos($html, '</head>') !== false) {
        return preg_replace('/<\/head>/i', $tag . '</head>', $html, 1) ?? $html;
    }
    return $tag . $html;
}

function hasUiScript(string $html): bool
{
    return str_contains($html, '/assets/js/psicei-ui.js');
}

function injectUiScript(string $html): string
{
    if (hasUiScript($html)) return $html;
    $tag = "<script src=\"/prueba/prueba/assets/js/psicei-ui.js\"></script>\n";
    if (stripos($html, '</body>') !== false) {
        return preg_replace('/<\/body>/i', $tag . '</body>', $html, 1) ?? $html;
    }
    if (stripos($html, '</html>') !== false) {
        return preg_replace('/<\/html>/i', $tag . '</html>', $html, 1) ?? $html;
    }
    return $html . "\n" . $tag;
}

function injectAiScript(string $html): string
{
    if (hasAiScript($html)) return $html;
    $tag = "<script src=\"/prueba/prueba/assets/js/gemini-ai.js\"></script>\n";
    if (stripos($html, '</body>') !== false) {
        return preg_replace('/<\/body>/i', $tag . '</body>', $html, 1) ?? $html;
    }
    if (stripos($html, '</html>') !== false) {
        return preg_replace('/<\/html>/i', $tag . '</html>', $html, 1) ?? $html;
    }
    return $html . "\n" . $tag;
}

function fixWindowsSlashes(string $html): string
{
    // solo dentro de href/src con \prueba\prueba\...
    return preg_replace_callback('/\b(?:href|src)\s*=\s*["\']([^"\']+)["\']/i', function ($matches) {
        $u = (string)$matches[1];
        if (str_contains($u, '\\')) {
            $u2 = str_replace('\\', '/', $u);
            return str_replace($u, $u2, $matches[0]);
        }
        return $matches[0];
    }, $html) ?? $html;
}

if ($action === 'audit') {
    $menuDir = repoRoot() . DIRECTORY_SEPARATOR . 'MENU';
    $files = listHtmlFiles($menuDir);
    $missingAi = [];
    $brokenLinks = [];

    foreach ($files as $fs) {
        $html = (string)@file_get_contents($fs);
        if ($html === '') continue;

        if (!hasAiScript($html)) {
            $missingAi[] = webPathFromFs($fs);
        }

        $links = extractLinks($html);
        foreach ($links as $u) {
            // resolvemos solo webpaths del proyecto
            $fsTarget = fsPathFromWeb($u);
            if ($fsTarget === null) continue;
            if (!is_file($fsTarget)) {
                $brokenLinks[] = [
                    'page' => webPathFromFs($fs),
                    'url' => $u
                ];
            }
        }
    }

    echo json_encode([
        'ok' => true,
        'stats' => [
            'html_files' => count($files),
            'missing_ai' => count($missingAi),
            'broken_links' => count($brokenLinks),
        ],
        'missing_ai' => $missingAi,
        'broken_links' => $brokenLinks,
    ]);
    exit();
}

if ($action === 'inject_ai') {
    $menuDir = repoRoot() . DIRECTORY_SEPARATOR . 'MENU';
    $files = listHtmlFiles($menuDir);
    $changed = 0;
    $touched = [];

    foreach ($files as $fs) {
        $html = (string)@file_get_contents($fs);
        if ($html === '') continue;
        $fixed = fixWindowsSlashes($html);
        $fixed = injectAiScript($fixed);
        if ($fixed !== $html) {
            @file_put_contents($fs, $fixed);
            $changed++;
            $touched[] = webPathFromFs($fs);
        }
    }

    echo json_encode(['ok' => true, 'changed' => $changed, 'touched' => $touched]);
    exit();
}

if ($action === 'audit_theme') {
    $menuDir = repoRoot() . DIRECTORY_SEPARATOR . 'MENU';
    $files = listHtmlFiles($menuDir);
    $missingTheme = [];
    $missingUi = [];

    foreach ($files as $fs) {
        $html = (string)@file_get_contents($fs);
        if ($html === '') continue;
        if (!hasTheme($html)) $missingTheme[] = webPathFromFs($fs);
        if (!hasUiScript($html)) $missingUi[] = webPathFromFs($fs);
    }

    echo json_encode([
        'ok' => true,
        'stats' => [
            'html_files' => count($files),
            'missing_theme' => count($missingTheme),
            'missing_ui' => count($missingUi),
        ],
        'missing_theme' => $missingTheme,
        'missing_ui' => $missingUi,
    ]);
    exit();
}

if ($action === 'inject_theme') {
    $menuDir = repoRoot() . DIRECTORY_SEPARATOR . 'MENU';
    $files = listHtmlFiles($menuDir);
    $changed = 0;
    $touched = [];

    foreach ($files as $fs) {
        $html = (string)@file_get_contents($fs);
        if ($html === '') continue;
        $fixed = $html;
        $fixed = fixWindowsSlashes($fixed);
        $fixed = injectTheme($fixed);
        $fixed = injectUiScript($fixed);
        if ($fixed !== $html) {
            @file_put_contents($fs, $fixed);
            $changed++;
            $touched[] = webPathFromFs($fs);
        }
    }

    echo json_encode(['ok' => true, 'changed' => $changed, 'touched' => $touched]);
    exit();
}

echo json_encode(['error' => 'Acción no válida. Usa action=audit, action=inject_ai, action=audit_theme o action=inject_theme']);

