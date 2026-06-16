<?php
// ============================================
// PSICEI - Configuración centralizada
// ============================================

function psiceiLoadDotEnv(): void
{
    static $loaded = false;
    if ($loaded) {
        return;
    }
    $loaded = true;

    $envPath = dirname(__DIR__) . DIRECTORY_SEPARATOR . '.env';
    if (!is_file($envPath)) {
        return;
    }

    $lines = @file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if (!is_array($lines)) {
        return;
    }

    foreach ($lines as $line) {
        $line = trim((string)$line);
        if ($line === '' || str_starts_with($line, '#')) {
            continue;
        }
        $parts = explode('=', $line, 2);
        if (count($parts) !== 2) {
            continue;
        }
        $key = trim((string)$parts[0]);
        $val = trim((string)$parts[1]);
        $len = strlen($val);
        if ($len >= 2 && (($val[0] === '"' && $val[$len - 1] === '"') || ($val[0] === "'" && $val[$len - 1] === "'"))) {
            $val = substr($val, 1, -1);
        }
        if ($key === '') {
            continue;
        }
        putenv($key . '=' . $val);
        $_ENV[$key] = $val;
        $_SERVER[$key] = $val;
    }
}

psiceiLoadDotEnv();

function envString(string $name, string $default = ''): string
{
    $value = getenv($name);
    if ($value === false || $value === '') {
        return $default;
    }
    return (string)$value;
}

function envBool(string $name, bool $default = false): bool
{
    $value = getenv($name);
    if ($value === false || $value === '') {
        return $default;
    }
    $normalized = strtolower(trim((string)$value));
    return in_array($normalized, ['1', 'true', 'yes', 'on'], true);
}

function envInt(string $name, int $default): int
{
    $value = getenv($name);
    if ($value === false || $value === '') {
        return $default;
    }
    $n = (int)$value;
    return $n > 0 ? $n : $default;
}

define('APP_ENV', strtolower(envString('PSICEI_APP_ENV', 'development')));
define('APP_DEBUG', envBool('PSICEI_DEBUG', APP_ENV !== 'production'));
define('PSICEI_FORCE_HTTPS', envBool('PSICEI_FORCE_HTTPS', false));

define('DB_HOST', envString('PSICEI_DB_HOST', 'localhost'));
define('DB_USER', envString('PSICEI_DB_USER', 'root'));
define('DB_PASS', envString('PSICEI_DB_PASS', ''));
define('DB_NAME', envString('PSICEI_DB_NAME', 'ejemplo1'));

// URL base del sistema
define('SITE_URL', rtrim(envString('PSICEI_SITE_URL', 'http://localhost/prueba/prueba'), '/'));

/*
 |---------------------------------------------------------------
 | Seguridad y servicios
 |---------------------------------------------------------------
 */
define('RECAPTCHA_SITE_KEY', envString(
    'RECAPTCHA_SITE_KEY',
    APP_ENV === 'production' ? '' : '6Ld3XvgrAAAAAOoQbqjtjfhhAtiJBxq8eKdcTl5y'
));
define('RECAPTCHA_SECRET_KEY', envString(
    'RECAPTCHA_SECRET_KEY',
    APP_ENV === 'production' ? '' : '6Ld3XvgrAAAAABLpsvp0jGaYuv8A-tVE88vACgkK'
));

// En local se mantiene activo por defecto; en producción se controla por variables de entorno.
define(
    'RECAPTCHA_ENABLED',
    envBool('RECAPTCHA_ENABLED', RECAPTCHA_SITE_KEY !== '' && RECAPTCHA_SECRET_KEY !== '')
);

// IA conversacional local (opcional, recomendada con Ollama)
define('AI_CHAT_PROVIDER', envString('AI_CHAT_PROVIDER', 'ollama'));
define('OLLAMA_URL', envString('OLLAMA_URL', 'http://127.0.0.1:11434'));
define('OLLAMA_MODEL', envString('OLLAMA_MODEL', 'llama3.2'));
define('GEMINI_API_KEY', envString('GEMINI_API_KEY', ''));
define('GEMINI_MODEL', envString('GEMINI_MODEL', 'gemini-2.0-flash'));
define('AI_HTTP_TIMEOUT_SECONDS', envInt('AI_HTTP_TIMEOUT_SECONDS', 45));

define('LOGIN_RATE_LIMIT_WINDOW_MINUTES', envInt('PSICEI_LOGIN_RATE_WINDOW_MIN', 15));
define('LOGIN_RATE_LIMIT_MAX_ATTEMPTS', envInt('PSICEI_LOGIN_RATE_MAX_ATTEMPTS', 6));
define('SESSION_IDLE_TIMEOUT_MINUTES', envInt('PSICEI_SESSION_IDLE_TIMEOUT_MIN', 120));

define('DEFAULT_ADMIN_USER', envString('PSICEI_ADMIN_USER', 'admin'));
define('DEFAULT_ADMIN_EMAIL', envString('PSICEI_ADMIN_EMAIL', 'admin@tesjo.edu.mx'));
define('DEFAULT_ADMIN_AREA', envString('PSICEI_ADMIN_AREA', 'Superusuario'));

// Áreas institucionales con acceso al sistema (usuarios role=user)
define('INSTITUTIONAL_AREA_ACADEMICA', 'Dirección Académica');
define('INSTITUTIONAL_AREA_VINCULACION', 'Dirección de Vinculación y Extensión');
define('INSTITUTIONAL_ACCESS_DENIED_MSG', 'Tu área no tiene acceso al sistema. Contacta a la Unidad de Planeación.');

function isProductionEnvironment(): bool
{
    return APP_ENV === 'production';
}

function psiceiBasePath(): string
{
    $path = parse_url(SITE_URL, PHP_URL_PATH);
    if (!is_string($path) || $path === '') {
        return '';
    }
    return rtrim($path, '/');
}

function psiceiLoginUrlPath(): string
{
    return (psiceiBasePath() !== '' ? psiceiBasePath() : '') . '/LOGIN/login.php';
}

function psiceiIsHttpsRequest(): bool
{
    if (!empty($_SERVER['HTTPS']) && strtolower((string)$_SERVER['HTTPS']) !== 'off') {
        return true;
    }
    if ((string)($_SERVER['SERVER_PORT'] ?? '') === '443') {
        return true;
    }
    if (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && strtolower((string)$_SERVER['HTTP_X_FORWARDED_PROTO']) === 'https') {
        return true;
    }
    return false;
}

function psiceiConfigurePhpRuntime(): void
{
    ini_set('display_errors', APP_DEBUG ? '1' : '0');
    ini_set('display_startup_errors', APP_DEBUG ? '1' : '0');
    ini_set('log_errors', '1');
    error_reporting(APP_DEBUG ? E_ALL : E_ALL & ~E_NOTICE & ~E_DEPRECATED & ~E_STRICT);
}

function psiceiApplySecurityHeaders(): void
{
    if (headers_sent()) {
        return;
    }

    header('X-Frame-Options: SAMEORIGIN');
    header('X-Content-Type-Options: nosniff');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    header('Permissions-Policy: geolocation=(), microphone=(), camera=()');

    if (psiceiIsHttpsRequest()) {
        header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
    }
}

function psiceiForceHttpsIfNeeded(): void
{
    if (!PSICEI_FORCE_HTTPS || php_sapi_name() === 'cli') {
        return;
    }
    if (psiceiIsHttpsRequest()) {
        return;
    }
    $host = trim((string)($_SERVER['HTTP_HOST'] ?? ''));
    if ($host === '') {
        return;
    }
    $uri = (string)($_SERVER['REQUEST_URI'] ?? '/');
    header('Location: https://' . $host . $uri, true, 301);
    exit();
}

function psiceiBootSecurity(): void
{
    static $booted = false;
    if ($booted) {
        return;
    }
    $booted = true;

    psiceiConfigurePhpRuntime();
    psiceiForceHttpsIfNeeded();
    psiceiApplySecurityHeaders();
}

function psiceiStartSession(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        $_SESSION['last_activity'] = time();
        return;
    }

    $cookiePath = psiceiBasePath();
    if ($cookiePath === '') {
        $cookiePath = '/';
    } else {
        $cookiePath = $cookiePath . '/';
    }

    session_name('PSICEISESSID');
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => $cookiePath,
        'secure' => psiceiIsHttpsRequest() || PSICEI_FORCE_HTTPS,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    ini_set('session.use_strict_mode', '1');
    ini_set('session.cookie_httponly', '1');
    session_start();

    $timeout = max(5, SESSION_IDLE_TIMEOUT_MINUTES) * 60;
    if (isset($_SESSION['last_activity']) && (time() - (int)$_SESSION['last_activity']) > $timeout) {
        psiceiDestroySession();
        return;
    }
    $_SESSION['last_activity'] = time();
}

function psiceiDestroySession(): void
{
    if (session_status() !== PHP_SESSION_ACTIVE) {
        return;
    }
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(
            session_name(),
            '',
            time() - 42000,
            $params['path'],
            $params['domain'],
            $params['secure'],
            $params['httponly']
        );
    }
    session_destroy();
}

function psiceiMarkSessionAuthenticated(string $username): void
{
    if (session_status() !== PHP_SESSION_ACTIVE) {
        return;
    }
    $_SESSION['auth_user'] = $username;
    $_SESSION['auth_time'] = time();
    $_SESSION['last_activity'] = time();
}

function psiceiClientIp(): string
{
    $forwarded = (string)($_SERVER['HTTP_X_FORWARDED_FOR'] ?? '');
    if ($forwarded !== '') {
        $parts = explode(',', $forwarded);
        $candidate = trim((string)$parts[0]);
        if (filter_var($candidate, FILTER_VALIDATE_IP)) {
            return $candidate;
        }
    }
    $remote = trim((string)($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0'));
    return filter_var($remote, FILTER_VALIDATE_IP) ? $remote : '0.0.0.0';
}

/**
 * @return list<string>
 */
function getAllowedInstitutionalAreas(): array
{
    return [
        INSTITUTIONAL_AREA_ACADEMICA,
        INSTITUTIONAL_AREA_VINCULACION,
    ];
}

function isAllowedInstitutionalArea(string $area): bool
{
    return in_array(trim($area), getAllowedInstitutionalAreas(), true);
}

function institutionalUserHasAccess(string $role, string $area): bool
{
    return $role === 'admin' || isAllowedInstitutionalArea($area);
}

/**
 * Área a mostrar en resumen/estadísticas (admin puede elegir dirección vía ?area=).
 */
function resolveInstitutionalViewArea(string $role, string $sessionArea, ?string $requested = null): string
{
    $requested = trim((string)$requested);

    if ($role === 'admin') {
        if ($requested !== '' && isAllowedInstitutionalArea($requested)) {
            return $requested;
        }
        return INSTITUTIONAL_AREA_ACADEMICA;
    }

    return trim($sessionArea);
}

function purgeUnauthorizedUsers(mysqli $conn): void
{
    $allowed = getAllowedInstitutionalAreas();
    $placeholders = implode(',', array_fill(0, count($allowed), '?'));
    $types = str_repeat('s', count($allowed));
    $sql = "DELETE FROM registrod WHERE role = 'user' AND Area NOT IN ({$placeholders})";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        return;
    }
    $stmt->bind_param($types, ...$allowed);
    $stmt->execute();
    $stmt->close();

    // Usuarios de dirección tienen acceso a todas las subáreas; no se asigna subárea individual.
    $conn->query("UPDATE registrod SET Subarea = '' WHERE role = 'user'");
}

/**
 * Redirige a login si el usuario de sesión no es admin ni área permitida.
 */
function rejectUnauthorizedInstitutionalUser(bool $destroySession = true): void
{
    psiceiStartSession();

    $role = (string)($_SESSION['role'] ?? 'user');
    $area = (string)($_SESSION['area'] ?? '');

    if (institutionalUserHasAccess($role, $area)) {
        return;
    }

    if ($destroySession) {
        psiceiDestroySession();
    }

    header('Location: ' . psiceiLoginUrlPath() . '?error=' . urlencode(INSTITUTIONAL_ACCESS_DENIED_MSG));
    exit();
}

// Función helper para conexión robusta:
// 1) conecta al servidor MySQL
// 2) crea la BD si no existe
// 3) selecciona la BD objetivo
function getDBConnection(): mysqli
{
    mysqli_report(MYSQLI_REPORT_OFF);

    $conn = @new mysqli(DB_HOST, DB_USER, DB_PASS);
    if ($conn->connect_error) {
        die("Error de conexión al servidor MySQL: " . $conn->connect_error);
    }

    $dbNameEscaped = str_replace('`', '``', DB_NAME);
    if (!$conn->query("CREATE DATABASE IF NOT EXISTS `{$dbNameEscaped}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")) {
        die("Error al crear/verificar la base de datos: " . $conn->error);
    }

    if (!$conn->select_db(DB_NAME)) {
        die("Error al seleccionar la base de datos: " . $conn->error);
    }

    $conn->set_charset("utf8mb4");
    return $conn;
}

function ensureLoginAttemptsSchema(mysqli $conn): void
{
    $sql = "CREATE TABLE IF NOT EXISTS login_attempts (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        ip_address VARCHAR(45) NOT NULL,
        success TINYINT(1) NOT NULL DEFAULT 0,
        attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_username_time (username, attempted_at),
        INDEX idx_ip_time (ip_address, attempted_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    $conn->query($sql);
}

function recordLoginAttempt(mysqli $conn, string $username, string $ipAddress, bool $success): void
{
    $stmt = $conn->prepare("INSERT INTO login_attempts (username, ip_address, success) VALUES (?, ?, ?)");
    if (!$stmt) {
        return;
    }
    $ok = $success ? 1 : 0;
    $stmt->bind_param("ssi", $username, $ipAddress, $ok);
    $stmt->execute();
    $stmt->close();
}

/**
 * @return array{blocked: bool, failures: int, retry_after: int}
 */
function getLoginRateLimitStatus(mysqli $conn, string $username, string $ipAddress): array
{
    $windowMin = max(1, LOGIN_RATE_LIMIT_WINDOW_MINUTES);
    $maxAttempts = max(1, LOGIN_RATE_LIMIT_MAX_ATTEMPTS);

    $sql = "SELECT COUNT(*) AS failures, UNIX_TIMESTAMP(MAX(attempted_at)) AS last_fail
            FROM login_attempts
            WHERE success = 0
              AND attempted_at >= (NOW() - INTERVAL {$windowMin} MINUTE)
              AND (username = ? OR ip_address = ?)";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        return ['blocked' => false, 'failures' => 0, 'retry_after' => 0];
    }
    $stmt->bind_param("ss", $username, $ipAddress);
    $stmt->execute();
    $row = $stmt->get_result()->fetch_assoc() ?: [];
    $stmt->close();

    $failures = (int)($row['failures'] ?? 0);
    $lastFail = (int)($row['last_fail'] ?? 0);
    $windowSec = $windowMin * 60;
    $retryAfter = 0;
    $blocked = false;

    if ($failures >= $maxAttempts && $lastFail > 0) {
        $elapsed = time() - $lastFail;
        if ($elapsed < $windowSec) {
            $blocked = true;
            $retryAfter = $windowSec - $elapsed;
        }
    }

    return [
        'blocked' => $blocked,
        'failures' => $failures,
        'retry_after' => max(0, $retryAfter),
    ];
}

function clearFailedLoginAttempts(mysqli $conn, string $username, string $ipAddress): void
{
    $stmt = $conn->prepare("DELETE FROM login_attempts WHERE success = 0 AND (username = ? OR ip_address = ?)");
    if (!$stmt) {
        return;
    }
    $stmt->bind_param("ss", $username, $ipAddress);
    $stmt->execute();
    $stmt->close();
}

/**
 * Asegura tabla de usuarios y crea superusuario.
 */
function ensureUserSchemaAndAdmin(mysqli $conn): void
{
    $createTableSql = "CREATE TABLE IF NOT EXISTS registrod (
        id INT AUTO_INCREMENT PRIMARY KEY,
        Nombre VARCHAR(100) NOT NULL,
        Apellido_Paterno VARCHAR(100) NOT NULL,
        Apellido_Materno VARCHAR(100) DEFAULT NULL,
        Numero_de_telefono VARCHAR(20) DEFAULT NULL,
        Correo_Institucional VARCHAR(191) NOT NULL,
        Nombre_Usuario VARCHAR(100) NOT NULL,
        Contrasena VARCHAR(255) NOT NULL,
        Area VARCHAR(200) NOT NULL,
        Subarea VARCHAR(200) DEFAULT NULL,
        role ENUM('user','admin') NOT NULL DEFAULT 'user',
        reset_token VARCHAR(64) DEFAULT NULL,
        reset_expiry DATETIME DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uq_registrod_correo (Correo_Institucional),
        UNIQUE KEY uq_registrod_usuario (Nombre_Usuario)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

    if (!$conn->query($createTableSql)) {
        throw new RuntimeException('No se pudo crear/verificar tabla registrod.');
    }

    $adminUser = DEFAULT_ADMIN_USER;
    $adminEmail = DEFAULT_ADMIN_EMAIL;
    $adminArea = DEFAULT_ADMIN_AREA;
    $adminPassPlain = envString('PSICEI_ADMIN_PASSWORD', '');

    $stmt = $conn->prepare("SELECT id FROM registrod WHERE Nombre_Usuario = ? LIMIT 1");
    if (!$stmt) {
        throw new RuntimeException('No se pudo verificar superusuario.');
    }
    $stmt->bind_param("s", $adminUser);
    $stmt->execute();
    $res = $stmt->get_result();
    $exists = $res && $res->fetch_assoc();
    $stmt->close();

    if (!$exists) {
        if ($adminPassPlain === '') {
            if (isProductionEnvironment()) {
                throw new RuntimeException('Define PSICEI_ADMIN_PASSWORD antes de publicar en producción.');
            }
            $adminPassPlain = 'admin';
        }
        $adminPassHash = password_hash($adminPassPlain, PASSWORD_BCRYPT);
        $insert = $conn->prepare("INSERT INTO registrod
            (Nombre, Apellido_Paterno, Apellido_Materno, Numero_de_telefono, Correo_Institucional, Nombre_Usuario, Contrasena, Area, Subarea, role)
            VALUES ('Super', 'Admin', 'PSICEI', '', ?, ?, ?, ?, 'Administrador general', 'admin')");
        if (!$insert) {
            throw new RuntimeException('No se pudo crear superusuario.');
        }
        $insert->bind_param("ssss", $adminEmail, $adminUser, $adminPassHash, $adminArea);
        $insert->execute();
        $insert->close();
    } else {
        // Mantiene el usuario admin pero no sobreescribe su contraseña en cada request.
        $upd = $conn->prepare("UPDATE registrod SET role='admin', Correo_Institucional=?, Area=?, Subarea='Administrador general' WHERE Nombre_Usuario=?");
        if ($upd) {
            $upd->bind_param("sss", $adminEmail, $adminArea, $adminUser);
            $upd->execute();
            $upd->close();
        }
    }

    ensureLoginAttemptsSchema($conn);
    purgeUnauthorizedUsers($conn);
}

/**
 * Tabla unificada de registros de módulos por área.
 */
function ensureRecordsSchema(mysqli $conn): void
{
    $sql = "CREATE TABLE IF NOT EXISTS registros_area (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        area VARCHAR(200) NOT NULL,
        subarea VARCHAR(200) DEFAULT NULL,
        modulo VARCHAR(255) NOT NULL,
        payload_json LONGTEXT NOT NULL,
        created_by VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_area (area),
        INDEX idx_modulo (modulo),
        INDEX idx_created_by (created_by)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

    if (!$conn->query($sql)) {
        throw new RuntimeException('No se pudo crear/verificar tabla registros_area.');
    }
}

/**
 * Tabla de contactos (para pruebas funcionales del sistema).
 */
function ensureContactsSchema(mysqli $conn): void
{
    $sql = "CREATE TABLE IF NOT EXISTS contactos (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(120) NOT NULL,
        puesto VARCHAR(120) DEFAULT NULL,
        correo VARCHAR(191) DEFAULT NULL,
        telefono VARCHAR(30) DEFAULT NULL,
        area VARCHAR(200) DEFAULT NULL,
        tags VARCHAR(255) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NULL DEFAULT NULL,
        INDEX idx_area (area),
        INDEX idx_nombre (nombre)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

    if (!$conn->query($sql)) {
        throw new RuntimeException('No se pudo crear/verificar tabla contactos.');
    }
}

psiceiBootSecurity();
