<?php
require_once __DIR__ . '/../API/config.php';
psiceiStartSession();

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $nombre = trim($_POST["Nombre"] ?? '');
    $apellidoPaterno = trim($_POST["Apellido_Paterno"] ?? '');
    $apellidoMaterno = trim($_POST["Apellido_Materno"] ?? '');
    $telefono = trim($_POST["Numero_de_telefono"] ?? '');
    $correo = strtolower(trim($_POST["Correo_Institucional"] ?? ''));
    $usuario = trim($_POST["Nombre_de_Usuario"] ?? '');
    $contrasena = trim($_POST["Contrasena"] ?? '');
    $area = trim($_POST["Area"] ?? '');
    $subarea = '';

    // Validar campos requeridos
    if ($nombre === '' || $apellidoPaterno === '' || $correo === '' || $usuario === '' || $contrasena === '' || $area === '') {
        header("Location: index.php?error=Completa todos los campos obligatorios.");
        exit();
    }

    // Validar correo institucional @tesjo.edu.mx
    if (!preg_match('/^[a-zA-Z0-9._%+-]+@tesjo\.edu\.mx$/', $correo)) {
        header("Location: index.php?error=Debes usar un correo institucional @tesjo.edu.mx");
        exit();
    }

    if (!isAllowedInstitutionalArea($area)) {
        header("Location: index.php?error=Solo pueden registrarse usuarios de Dirección Académica o Dirección de Vinculación y Extensión.");
        exit();
    }

    $enlace = getDBConnection();

    try {
        ensureUserSchemaAndAdmin($enlace);
    } catch (Throwable $e) {
        mysqli_close($enlace);
        header("Location: index.php?error=Error al preparar la base de datos.");
        exit();
    }

    // Verificar si usuario o correo ya existen
    $checkQuery = "SELECT 1 FROM registrod WHERE Nombre_Usuario=? OR Correo_Institucional=? LIMIT 1";
    $stmtCheck = mysqli_prepare($enlace, $checkQuery);
    mysqli_stmt_bind_param($stmtCheck, "ss", $usuario, $correo);
    mysqli_stmt_execute($stmtCheck);
    $resCheck = mysqli_stmt_get_result($stmtCheck);
    if (mysqli_fetch_assoc($resCheck)) {
        mysqli_stmt_close($stmtCheck);
        mysqli_close($enlace);
        header("Location: index.php?error=Usuario o correo ya registrado.");
        exit();
    }
    mysqli_stmt_close($stmtCheck);

    // Hashear contraseña
    $contrasenaSegura = password_hash($contrasena, PASSWORD_BCRYPT);

    // Insertar en BD
    $query = "INSERT INTO registrod (Nombre, Apellido_Paterno, Apellido_Materno, Numero_de_telefono, Correo_Institucional, Nombre_Usuario, Contrasena, Area, Subarea)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = mysqli_prepare($enlace, $query);
    mysqli_stmt_bind_param($stmt, "sssssssss", $nombre, $apellidoPaterno, $apellidoMaterno, $telefono, $correo, $usuario, $contrasenaSegura, $area, $subarea);

    if (mysqli_stmt_execute($stmt)) {
        mysqli_stmt_close($stmt);
        mysqli_close($enlace);

        $_SESSION['registro_exitoso'] = true;
        $_SESSION['nombre_usuario'] = $usuario;
        $_SESSION['area'] = $area;

        header("Location: login.php?mensaje=Registro exitoso. Inicia sesión.");
        exit();
    } else {
        mysqli_stmt_close($stmt);
        mysqli_close($enlace);
        header("Location: index.php?error=Error al registrar usuario.");
        exit();
    }
}
?>
