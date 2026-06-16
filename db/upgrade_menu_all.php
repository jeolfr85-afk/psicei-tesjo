<?php
/**
 * Actualización masiva de páginas HTML en MENU:
 * - Corrige slashes en href/src
 * - Inyecta tema global y scripts UI/IA
 * - Rellena páginas placeholder con contenido funcional
 */

$root = dirname(__DIR__);
$menuDir = $root . DIRECTORY_SEPARATOR . 'MENU';

function webPath(string $root, string $fs): string {
    $rel = str_replace('\\', '/', substr($fs, strlen($root)));
    return '/prueba/prueba' . $rel;
}

function hasAny(string $html, array $needles): bool {
    foreach ($needles as $n) {
        if (str_contains($html, $n)) return true;
    }
    return false;
}

function injectBeforeTag(string $html, string $tag, string $injection): string {
    if (stripos($html, $tag) !== false) {
        return preg_replace('/' . preg_quote($tag, '/') . '/i', $injection . $tag, $html, 1) ?? $html;
    }
    return $html;
}

function ensureAssets(string $html): string {
    if (!str_contains($html, '/assets/css/global.css')) {
        $html = injectBeforeTag($html, '</head>', "  <link rel=\"stylesheet\" href=\"/prueba/prueba/assets/css/global.css\" />\n");
    }
    if (!str_contains($html, '/assets/css/psicei-theme.css')) {
        $html = injectBeforeTag($html, '</head>', "  <link rel=\"stylesheet\" href=\"/prueba/prueba/assets/css/psicei-theme.css\" />\n");
    }
    if (!str_contains($html, '/assets/js/psicei-ui.js')) {
        $html = injectBeforeTag($html, '</body>', "  <script src=\"/prueba/prueba/assets/js/psicei-ui.js\"></script>\n");
    }
    if (!str_contains($html, '/assets/js/gemini-ai.js')) {
        $html = injectBeforeTag($html, '</body>', "  <script src=\"/prueba/prueba/assets/js/gemini-ai.js\"></script>\n");
    }
    return $html;
}

function fixSlashes(string $html): string {
    return preg_replace_callback('/\b(?:href|src)\s*=\s*["\']([^"\']+)["\']/i', static function ($m) {
        $full = (string)$m[0];
        $u = (string)$m[1];
        if (!str_contains($u, '\\')) return $full;
        $u2 = str_replace('\\', '/', $u);
        return str_replace($u, $u2, $full);
    }, $html) ?? $html;
}

function makeFunctionalPage(string $title): string {
    $safeTitle = htmlspecialchars($title, ENT_QUOTES, 'UTF-8');
    return <<<HTML
<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{$safeTitle} - PSICEI</title>
  <link rel="stylesheet" href="/prueba/prueba/assets/css/global.css" />
  <link rel="stylesheet" href="/prueba/prueba/assets/css/psicei-theme.css" />
  <style>
    .page-wrap { max-width: 1100px; margin: 110px auto 40px; padding: 0 16px; }
    .hero { background: linear-gradient(135deg, #00264D, #1d47A9); color: #fff; border-radius: 14px; padding: 22px; margin-bottom: 18px; }
    .hero h1 { font-size: 1.45rem; margin-bottom: 6px; }
    .grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:14px; }
    .card { background:#fff; border-radius:12px; padding:16px; box-shadow:0 4px 18px rgba(0,0,0,.08); }
    .card h3 { margin-bottom:10px; color:#00264D; }
    .card a { display:block; margin:10px 0; }
    .hint { color:#475569; font-size:.95rem; line-height:1.5; }
  </style>
</head>
<body>
  <div class="top-bar">
    <img src="/prueba/prueba/MENU/images/enkabezado.png" alt="Encabezado" class="escudo" />
  </div>

  <div class="page-wrap">
    <div class="hero">
      <h1>{$safeTitle}</h1>
      <p>Vista actualizada y funcional dentro de PSICEI.</p>
    </div>
    <div class="grid">
      <div class="card">
        <h3>Acciones disponibles</h3>
        <a href="/prueba/prueba/MENU/inicio.php" class="btn">Inicio</a>
        <a href="/prueba/prueba/MENU/records_history.php" class="btn">Historial de registros</a>
        <a href="/prueba/prueba/MENU/estadisticas.php" class="btn">Estadísticas</a>
        <a href="/prueba/prueba/MENU/contactos.php" class="btn">Contactos</a>
        <a href="/prueba/prueba/MENU/portal.php" class="btn">Volver al portal</a>
      </div>
      <div class="card">
        <h3>Estado del módulo</h3>
        <p class="hint">
          Este módulo fue estandarizado para mantener diseño consistente, navegación funcional y soporte del asistente IA.
        </p>
      </div>
    </div>
  </div>

  <script src="/prueba/prueba/assets/js/psicei-ui.js"></script>
  <script src="/prueba/prueba/assets/js/gemini-ai.js"></script>
</body>
</html>
HTML;
}

$it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($menuDir, FilesystemIterator::SKIP_DOTS));
$changed = 0;
$modernized = 0;
$fixedAssets = 0;
$touched = [];

foreach ($it as $file) {
    /** @var SplFileInfo $file */
    if (!$file->isFile()) continue;
    $name = strtolower($file->getFilename());
    if (!str_ends_with($name, '.html') && !str_ends_with($name, '.htm')) continue;

    $fs = $file->getPathname();
    $html = (string)@file_get_contents($fs);
    if ($html === '') continue;
    $orig = $html;

    $html = fixSlashes($html);
    $html = ensureAssets($html);
    if ($html !== $orig) {
        $fixedAssets++;
    }

    $isPlaceholder = hasAny($orig, [
        'Esta vista se dejó lista para crecer',
        'Aquí agregaremos',
        '<p1>',
        '<title>',
        'gtftft',
        'TODO'
    ]);

    // Evitar sobreescribir páginas de etapa/captura.
    $pathNorm = str_replace('\\', '/', $fs);
    $isStage = str_contains($pathNorm, '/Etapa/') || str_contains($pathNorm, '/etapa/') || str_contains($pathNorm, 'PrimerEtapa') || str_contains($pathNorm, 'SegundaEtapa') || str_contains($pathNorm, 'primeraEtapa') || str_contains($pathNorm, 'segundaEtapa');

    if ($isPlaceholder && !$isStage) {
        if (preg_match('/<title>(.*?)<\/title>/is', $orig, $m)) {
            $title = trim(strip_tags((string)$m[1]));
        } else {
            $title = trim(pathinfo($fs, PATHINFO_FILENAME));
        }
        if ($title === '' || $title === 'gtftft') $title = 'Módulo institucional';
        $html = makeFunctionalPage($title);
        $modernized++;
    }

    if ($html !== $orig) {
        @file_put_contents($fs, $html);
        $changed++;
        $touched[] = webPath($root, $fs);
    }
}

echo json_encode([
    'ok' => true,
    'changed' => $changed,
    'modernized_pages' => $modernized,
    'fixed_assets' => $fixedAssets,
    'sample_touched' => array_slice($touched, 0, 40),
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

