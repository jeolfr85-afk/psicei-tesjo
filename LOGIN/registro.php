<?php
require_once __DIR__ . '/../API/config.php';
psiceiStartSession();

$enlace = getDBConnection();

// Asegura esquema y crea el superusuario admin si hace falta
ensureUserSchemaAndAdmin($enlace);

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $nombre = trim($_POST["Nombre"] ?? '');
    $apellidoPaterno = trim($_POST["Apellido_Paterno"] ?? '');
    $correo = strtolower(trim($_POST["Correo"] ?? ''));
    $nombreUsuario = trim($_POST["Nombre_Usuario"] ?? '');
    $contrasena = trim($_POST["Contrasena"] ?? '');
    $area = trim($_POST["Area"] ?? '');
    $recaptcha_response = $_POST['g-recaptcha-response'] ?? '';

    // Validaciones
    if ($nombre === '' || $apellidoPaterno === '' || $correo === '' || $nombreUsuario === '' || $contrasena === '' || $area === '') {
        header("Location: registro.php?mensaje=Completa todos los campos.");
        exit();
    }

    if (!preg_match('/^[a-zA-Z0-9._%+-]+@tesjo\.mx$/', $correo)) {
        header("Location: registro.php?mensaje=Correo debe ser @tesjo.mx");
        exit();
    }

    if (RECAPTCHA_ENABLED) {
        if ($recaptcha_response === '') {
            header("Location: registro.php?mensaje=Completa el CAPTCHA.");
            exit();
        }

        // Validar CAPTCHA
        $verify = @file_get_contents(
            "https://www.google.com/recaptcha/api/siteverify?secret=" .
            urlencode(RECAPTCHA_SECRET_KEY) .
            "&response=" . urlencode($recaptcha_response)
        );
        $responseData = json_decode((string)$verify);
        if (!$responseData || !isset($responseData->success) || $responseData->success !== true) {
            header("Location: registro.php?mensaje=CAPTCHA inválido.");
            exit();
        }
    }

    // Comprobar si usuario o correo ya existen
    $checkQuery = "SELECT 1 FROM registrod WHERE Nombre_Usuario=? OR Correo_Institucional=? LIMIT 1";
    $stmtCheck = mysqli_prepare($enlace, $checkQuery);
    mysqli_stmt_bind_param($stmtCheck, "ss", $nombreUsuario, $correo);
    mysqli_stmt_execute($stmtCheck);
    $resCheck = mysqli_stmt_get_result($stmtCheck);
    if (mysqli_fetch_assoc($resCheck)) {
        mysqli_stmt_close($stmtCheck);
        header("Location: registro.php?mensaje=Usuario o correo ya registrado.");
        exit();
    }
    mysqli_stmt_close($stmtCheck);

    // Hashear la contraseña
    $contrasenaSegura = password_hash($contrasena, PASSWORD_BCRYPT);

    // Insertar usuario en la BD
    $query = "INSERT INTO registrod (Nombre, Apellido_Paterno, Correo_Institucional, Nombre_Usuario, Contrasena, Area) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = mysqli_prepare($enlace, $query);
    mysqli_stmt_bind_param($stmt, "ssssss", $nombre, $apellidoPaterno, $correo, $nombreUsuario, $contrasenaSegura, $area);

    if (mysqli_stmt_execute($stmt)) {
        mysqli_stmt_close($stmt);
        mysqli_close($enlace);
        header("Location: login.php?mensaje=Registro exitoso. Inicia sesión.");
        exit();
    } else {
        mysqli_stmt_close($stmt);
        mysqli_close($enlace);
        header("Location: registro.php?mensaje=Error al registrar usuario.");
        exit();
    }
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Registro</title>
<?php if (RECAPTCHA_ENABLED): ?>
<script src="https://www.google.com/recaptcha/api.js" async defer></script>
<?php endif; ?>
</head>
<body>
<form action="registro.php" method="POST" autocomplete="off">
    <label>Nombre:</label><input type="text" name="Nombre" required>
    <label>Apellido:</label><input type="text" name="Apellido_Paterno" required>
    <label>Correo TESJo:</label><input type="email" name="Correo" required>
    <label>Usuario:</label><input type="text" name="Nombre_Usuario" required>
    <label>Contraseña:</label><input type="password" name="Contrasena" required>
    <label>Área:</label>
    <select name="Area" required>
        <option value="">Selecciona</option>
        <option value="Unidad Jurídica y de Igualdad de Género">Unidad Jurídica y de Igualdad de Género</option>
        <option value="Unidad de Planeación">Unidad de Planeación</option>
        <option value="Dirección Académica">Dirección Académica</option>
        <option value="Dirección de Vinculación y Extensión">Dirección de Vinculación y Extensión</option>
        <option value="Subdirección de Servicios Administrativos">Subdirección de Servicios Administrativos</option>
        <option value="Unidad de Biblioteca">Unidad de Biblioteca</option>
    </select>

    <?php if (RECAPTCHA_ENABLED): ?>
    <div class="g-recaptcha" data-sitekey="<?php echo htmlspecialchars(RECAPTCHA_SITE_KEY); ?>"></div>
    <?php endif; ?>

    <button type="submit">Registrar</button>

    <?php if (isset($_GET['mensaje'])): ?>
        <p style="color:green;"><?php echo htmlspecialchars($_GET['mensaje']); ?></p>
    <?php endif; ?>
</form>
<script src="/prueba/prueba/assets/js/gemini-ai.js"></script>
</body>
</html>
