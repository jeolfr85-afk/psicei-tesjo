<?php
require_once __DIR__ . '/../API/config.php';
psiceiStartSession();

$enlace = getDBConnection();

try {
    ensureUserSchemaAndAdmin($enlace);
} catch (Throwable $e) {
    die("Error de inicialización del sistema de usuarios.");
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Normalizar nombres de campo
    $Nombre_Usuario = trim($_POST["Nombre_Usuario"] ?? '');
    $Contrasena = trim($_POST["Contrasena"] ?? '');
    $recaptcha_response = $_POST['g-recaptcha-response'] ?? '';
    $clientIp = psiceiClientIp();

    $rate = getLoginRateLimitStatus($enlace, $Nombre_Usuario, $clientIp);
    if ($rate['blocked']) {
        $mins = (int)ceil(((int)$rate['retry_after']) / 60);
        mysqli_close($enlace);
        header("Location: login.php?error=Demasiados intentos fallidos. Intenta de nuevo en {$mins} minuto(s).");
        exit();
    }

    // Validación
    if ($Nombre_Usuario === '' || $Contrasena === '') {
        recordLoginAttempt($enlace, $Nombre_Usuario, $clientIp, false);
        mysqli_close($enlace);
        header("Location: login.php?error=Completa todos los campos.");
        exit();
    }

    if (RECAPTCHA_ENABLED && $recaptcha_response === '') {
        recordLoginAttempt($enlace, $Nombre_Usuario, $clientIp, false);
        mysqli_close($enlace);
        header("Location: login.php?error=Por favor completa el CAPTCHA.");
        exit();
    }

    if (RECAPTCHA_ENABLED) {
        $verify = @file_get_contents(
            "https://www.google.com/recaptcha/api/siteverify?secret=" .
            urlencode(RECAPTCHA_SECRET_KEY) .
            "&response=" . urlencode($recaptcha_response)
        );

        if ($verify === false) {
            recordLoginAttempt($enlace, $Nombre_Usuario, $clientIp, false);
            mysqli_close($enlace);
            header("Location: login.php?error=No se pudo validar CAPTCHA. Revisa tu conexión.");
            exit();
        }

        $responseData = json_decode($verify);
        if (!isset($responseData->success) || $responseData->success !== true) {
            recordLoginAttempt($enlace, $Nombre_Usuario, $clientIp, false);
            mysqli_close($enlace);
            header("Location: login.php?error=Verificación CAPTCHA fallida.");
            exit();
        }
    }

    // Buscar usuario en BD usando sentencia preparada
    $query = "SELECT Nombre_Usuario, Contrasena, Area, Subarea, role FROM registrod WHERE Nombre_Usuario = ?";
    $stmt = mysqli_prepare($enlace, $query);
    if (!$stmt) {
        mysqli_close($enlace);
        header("Location: login.php?error=Error en la consulta.");
        exit();
    }
    mysqli_stmt_bind_param($stmt, "s", $Nombre_Usuario);
    mysqli_stmt_execute($stmt);
    $resultado = mysqli_stmt_get_result($stmt);

    if ($fila = mysqli_fetch_assoc($resultado)) {
        // Verificar contraseña hashed
        if (password_verify($Contrasena, $fila['Contrasena'])) {
            $userRole = $fila['role'] ?? 'user';
            $userArea = (string)($fila['Area'] ?? '');

            if ($userRole !== 'admin' && !isAllowedInstitutionalArea($userArea)) {
                recordLoginAttempt($enlace, $Nombre_Usuario, $clientIp, false);
                mysqli_stmt_close($stmt);
                mysqli_close($enlace);
                header('Location: login.php?error=' . urlencode(INSTITUTIONAL_ACCESS_DENIED_MSG));
                exit();
            }

            // Regenerar id de sesión por seguridad
            session_regenerate_id(true);

            $_SESSION['usuario'] = $fila['Nombre_Usuario'];
            $_SESSION['area'] = $userArea;
            $_SESSION['subarea'] = $userRole === 'admin' ? ($fila['Subarea'] ?? '') : '';
            $_SESSION['role'] = $userRole;
            psiceiMarkSessionAuthenticated($fila['Nombre_Usuario']);
            clearFailedLoginAttempts($enlace, $Nombre_Usuario, $clientIp);
            recordLoginAttempt($enlace, $Nombre_Usuario, $clientIp, true);

            // Redirigir según el rol
            if ($_SESSION['role'] === 'admin') {
                mysqli_stmt_close($stmt);
                mysqli_close($enlace);
                header("Location: admin_home.php");
                exit();
            } else {
                mysqli_stmt_close($stmt);
                mysqli_close($enlace);
                header("Location: /prueba/prueba/MENU/home.php");
                exit();
            }
        } else {
            recordLoginAttempt($enlace, $Nombre_Usuario, $clientIp, false);
            mysqli_stmt_close($stmt);
            mysqli_close($enlace);
            header("Location: login.php?error=Credenciales inválidas.");
            exit();
        }
    } else {
        recordLoginAttempt($enlace, $Nombre_Usuario, $clientIp, false);
        mysqli_stmt_close($stmt);
        mysqli_close($enlace);
        header("Location: login.php?error=Credenciales inválidas.");
        exit();
    }
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Iniciar Sesión</title>
    <link rel="stylesheet" href="login.css?v=<?php echo urlencode((string) filemtime(__DIR__ . '/login.css')); ?>">
    <?php if (RECAPTCHA_ENABLED): ?>
        <script src="https://www.google.com/recaptcha/api.js" async defer></script>
    <?php endif; ?>
</head>
<body>
    <div class="top-bar">
        <img src="images/enkabezado.png" alt="Encabezado" class="escudo">
    </div>

    <div class="container">
        <div class="left-panel">
            <h1>BIENVENIDO</h1>
            <p>Programa para la Sistematización y consolidación de la Estadística Institucional (PSICEI)</p>
            <p class="sicei">Sistema de Consulta de Estadísticas Institucionales</p>
            <img src="TESJo_ Blanco.png" alt="Logo TESJo" class="logo">
        </div>

        <div class="right-panel">
            <form action="login.php" method="POST" autocomplete="off">
                <div class="input-group">
                    <label for="username">Usuario:</label>
                    <!-- NOMBRE UNIFICADO: Nombre_Usuario -->
                    <input type="text" name="Nombre_Usuario" id="username" placeholder="Nombre de Usuario" required>
                </div>

                <div class="input-group">
                    <label for="contra">Contraseña:</label>
                    <input type="password" name="Contrasena" id="contra" placeholder="Contraseña" required>
                </div>

                <!-- RECAPTCHA (site key) -->
                <?php if (RECAPTCHA_ENABLED): ?>
                    <div class="g-recaptcha" data-sitekey="<?php echo htmlspecialchars(RECAPTCHA_SITE_KEY); ?>"></div>
                <?php endif; ?>

                <button type="submit" id="btnlogin">Iniciar Sesión</button>

                <p>¿Aún no tienes cuenta? <a href="index.php">Regístrate</a></p>
                <p><a href="contrasena.php">¿Olvidaste tu contraseña?</a></p>


                <?php if (isset($_GET['error'])): ?>
                    <p style="color: red;"><?php echo htmlspecialchars($_GET['error']); ?></p>
                <?php endif; ?>
                <?php if (isset($_GET['mensaje'])): ?>
                    <p style="color: green;"><?php echo htmlspecialchars($_GET['mensaje']); ?></p>
                <?php endif; ?>
            </form>
        </div>
    </div>

    <div class="footer">
        <p>© Copyright 2025 TecNM - Todos los Derechos Reservados</p>
        <img src="images/pagg.png" alt="Logo de pie de página">
    </div>
    <script src="/prueba/prueba/assets/js/gemini-ai.js"></script>
</body>
</html>
