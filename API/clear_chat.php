<?php
require_once __DIR__ . '/config.php';
psiceiStartSession();
header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['usuario'])) {
    echo json_encode(['error' => 'Sesión no válida.']);
    exit();
}

$_SESSION['ai_chat_history'] = [];
echo json_encode(['ok' => true]);

