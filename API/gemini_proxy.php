<?php
require_once __DIR__ . '/config.php';
psiceiStartSession();
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit(0); }

require_once __DIR__ . '/ai_navigation.php';
require_once __DIR__ . '/ai_local_engine.php';
require_once __DIR__ . '/llm_client.php';

if (!isset($_SESSION['usuario'])) {
    echo json_encode(['error' => 'Sesión no válida. Inicia sesión nuevamente.']);
    exit();
}

if (!isset($_SESSION['area']) || trim((string)$_SESSION['area']) === '') {
    echo json_encode(['error' => 'No tienes un área asignada. Contacta al administrador.']);
    exit();
}

$sessionArea = trim((string)$_SESSION['area']);
$sessionSubarea = trim((string)($_SESSION['subarea'] ?? ''));
$sessionRole = trim((string)($_SESSION['role'] ?? 'user'));

if (!institutionalUserHasAccess($sessionRole, $sessionArea)) {
    http_response_code(403);
    echo json_encode(['error' => INSTITUTIONAL_ACCESS_DENIED_MSG]);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);
$prompt = trim($input['prompt'] ?? '');
$headers = $input['headers'] ?? [];
$page_context = trim($input['page_context'] ?? '');
$navigationRaw = $input['navigation_context'] ?? [];
if (!is_array($navigationRaw) && is_string($input['navigation_context'] ?? null)) {
    $decodedNav = json_decode((string)$input['navigation_context'], true);
    $navigationRaw = is_array($decodedNav) ? $decodedNav : [];
}
$navigation = aiSanitizeNavigationContext(is_array($navigationRaw) ? $navigationRaw : []);
if ($page_context !== '' && ($navigation['page_title'] ?? '') === '') {
    $navigation['page_title'] = $page_context;
}
if (($navigation['pathname'] ?? '') === '') {
    $navigation['pathname'] = (string)(parse_url($_SERVER['HTTP_REFERER'] ?? '', PHP_URL_PATH) ?: '');
}

if ($prompt === '') {
    echo json_encode(['error' => 'Prompt vacío']);
    exit();
}

if (!isset($_SESSION['ai_chat_history']) || !is_array($_SESSION['ai_chat_history'])) {
    $_SESSION['ai_chat_history'] = [];
}

// 1) Resolver primero con IA local (offline + aprendizaje)
$local = aiResolveLocal($prompt, is_array($headers) ? $headers : [], $sessionArea, $sessionSubarea, $sessionRole, $navigation);
if ($local !== null && isset($local['result'])) {
    $intent = (string)($local['intent'] ?? '');
    $actionIntents = [
        'save', 'download_pdf', 'download_excel', 'clear', 'generate_rows',
        'navigation_context', 'guide', 'open_dashboard', 'open_stats', 'open_contacts',
        'open_records_history', 'open_module', 'open_portal', 'download_users_pdf', 'download_users_excel',
        'open_records_filtered',
    ];

    // Para acciones/salidas estructuradas: responder local directo.
    $result = $local['result'];
    $hasAction = is_array($result) && (isset($result['action']) || (isset($result['url']) && isset($result['message'])));
    if (in_array($intent, $actionIntents, true) || $hasAction || (is_array($result) && array_is_list($result))) {
        echo json_encode(['result' => $local['result'], 'source' => 'local']);
        exit();
    }
}

// 2) Respuesta conversacional tipo IA (modelo local + memoria de chat)
$history = $_SESSION['ai_chat_history'];
$reply = aiConversationalReply($prompt, $sessionArea, $sessionSubarea, $sessionRole, $history, $navigation);

$_SESSION['ai_chat_history'][] = ['role' => 'user', 'text' => $prompt];
$_SESSION['ai_chat_history'][] = ['role' => 'assistant', 'text' => $reply];
// Menos historial = más rápido y suficiente para continuidad
if (count($_SESSION['ai_chat_history']) > 8) {
    $_SESSION['ai_chat_history'] = array_slice($_SESSION['ai_chat_history'], -8);
}

aiRememberPattern($prompt, 'chat_reply', ['message' => $reply]);
echo json_encode(['result' => ['message' => $reply], 'source' => 'chat']);
