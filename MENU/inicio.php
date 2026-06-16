<?php
require_once __DIR__ . '/../API/config.php';
psiceiStartSession();

if (!isset($_SESSION['usuario'])) {
    header('Location: /prueba/prueba/LOGIN/login.php?error=Inicia sesión para continuar.');
    exit();
}

$role = (string)($_SESSION['role'] ?? 'user');
if ($role === 'admin') {
    header('Location: /prueba/prueba/LOGIN/admin_home.php');
    exit();
}

header('Location: /prueba/prueba/MENU/resumen_area.php');
exit();
