<?php
require_once __DIR__ . '/../API/config.php';
psiceiStartSession();

if (!isset($_SESSION['usuario'])) {
    header('Location: ' . psiceiLoginUrlPath() . '?error=Inicia sesión para continuar.');
    exit();
}

rejectUnauthorizedInstitutionalUser();

$requestPath = rawurldecode((string)(parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH) ?: ''));
$basePath = rtrim(psiceiBasePath(), '/');

if ($requestPath === '') {
    http_response_code(400);
    exit('Solicitud no válida.');
}

// Convierte /prueba/prueba/MENU/... a MENU/... para resolver en disco.
if ($basePath !== '' && str_starts_with($requestPath, $basePath . '/')) {
    $relativePath = substr($requestPath, strlen($basePath . '/'));
} else {
    $relativePath = ltrim($requestPath, '/');
}

$normalizedRelativePath = ltrim(str_replace('\\', '/', $relativePath), '/');
if (
    !str_starts_with($normalizedRelativePath, 'MENU/')
    && !str_starts_with($normalizedRelativePath, "MENÚ/")
    && !str_starts_with($normalizedRelativePath, "MEN%C3%9A/")
) {
    http_response_code(403);
    exit('Ruta no permitida.');
}

$projectRoot = realpath(dirname(__DIR__));

$menuRoot = false;
foreach (['MENU', 'MENÚ', 'MEN%C3%9A'] as $dir) {
    $try = realpath($projectRoot . DIRECTORY_SEPARATOR . $dir);
    if ($try !== false && is_dir($try)) {
        $menuRoot = $try;
        break;
    }
}

// Quita prefijo de módulo en URL para resolver dentro del folder real.
$insideMenuPath = preg_replace('#^(MENU|MENÚ|MEN%C3%9A)/#u', '', $normalizedRelativePath, 1);
$candidate = $menuRoot !== false
    ? $menuRoot . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, (string)$insideMenuPath)
    : '';
$resolved = $candidate !== '' ? realpath($candidate) : false;

if ($projectRoot === false || $menuRoot === false || $resolved === false || !is_file($resolved)) {
    http_response_code(404);
    exit('Archivo no encontrado.');
}

$resolvedNorm = str_replace('\\', '/', $resolved);
$menuRootNorm = rtrim(str_replace('\\', '/', $menuRoot), '/') . '/';
if (!str_starts_with($resolvedNorm, $menuRootNorm)) {
    http_response_code(403);
    exit('Acceso denegado.');
}

$ext = strtolower((string)pathinfo($resolved, PATHINFO_EXTENSION));
if ($ext !== 'html' && $ext !== 'htm') {
    http_response_code(403);
    exit('Tipo de archivo no permitido.');
}

header('Content-Type: text/html; charset=utf-8');
readfile($resolved);
exit();
