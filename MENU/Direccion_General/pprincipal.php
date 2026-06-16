<?php
require_once __DIR__ . '/../../API/config.php';
psiceiStartSession();
if (!isset($_SESSION['usuario'])) {
    header("Location: /prueba/prueba/LOGIN/login.php");
    exit();
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DIRECCION GENERAL</title>
    <link rel="stylesheet" href="/prueba/prueba/assets/css/global.css">
    <link rel="stylesheet" href="pprincipal.css">
</head>
<body>
    <div class="top-bar">
        <img src="../images/enkabezado.png" alt="Encabezado" class="escudo">
    </div>

    <div class="container">
        <div class="left-panel">
            <h1>TECNOLÓGICO DE ESTUDIOS SUPERIORES DE JOCOTITLÁN</h1>
        </div>

        <div class="logo">
            <img src="../images/tesjo.png" alt="Logo TESJo" class="escudo">
        </div>

        <a href="UJIGenero .html">
            <button class="btn">Dirección y Vinculación</button>
        </a>
        <a href="UJIGenero .html">
            <button class="btn">Unidad Jurídica y de Igualdad de Género</button>
        </a>
        <a href="uPlaneacion.HTML">
            <button class="btn">Unidad de Planeación</button>
        </a>
        <a href="/prueba/prueba/MENU/Direccion_Academica/dirAcademica.html">
            <button class="btn">Dirección Académica</button>
        </a>
        <a href="../Direccion_Vinculacion/dirVinExten.html">
            <button class="btn">Dirección de Vinculación y Extensión</button>
        </a>
        <a href="/MENU/Direccion_Vinculacion/dirVinExten.html">
            <button class="btn">Subdirección de Servicios Administrativos</button>
        </a>
        <a href="/prueba/prueba/MENU/ExtensionAculco/extensionAculco.html">
            <button class="btn">Extensión Aculco</button>
        </a>

        <div style="margin-top: 20px;">
            <a href="/prueba/prueba/LOGIN/logout.php">
                <button class="btn" style="background: linear-gradient(135deg, #dc3545, #c82333); max-width: 300px;">Cerrar Sesión</button>
            </a>
        </div>
    </div>

    <div class="footer">
        <p>&copy; Copyright 2025 TesJo - Todos los Derechos Reservados</p>
        <img src="../images/pagg.png" alt="Logo de pie de página">
    </div>
</body>
</html>
