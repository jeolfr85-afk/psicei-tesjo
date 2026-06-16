<?php
require_once __DIR__ . '/config.php';
psiceiStartSession();
header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['usuario'])) {
    echo json_encode(['error' => 'Sesión no válida.']);
    exit();
}

$history = $_SESSION['ai_chat_history'] ?? [];
if (!is_array($history)) {
    $history = [];
}

// Normaliza formato
$out = [];
foreach ($history as $h) {
    $role = (string)($h['role'] ?? '');
    $text = trim((string)($h['text'] ?? ''));
    if ($text === '' || ($role !== 'user' && $role !== 'assistant')) {
        continue;
    }
    $out[] = ['role' => $role, 'text' => $text];
}

echo json_encode(['history' => $out]);

