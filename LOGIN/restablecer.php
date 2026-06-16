<?php
require_once __DIR__ . '/../API/config.php';
psiceiStartSession();

$mensaje = '';
$token_valido = false;
$token = $_GET['token'] ?? $_POST['token'] ?? '';

if ($token === '') {
    $mensaje = '<p class="msg-error">Token inválido o faltante.</p>';
} else {
    $enlace = getDBConnection();

    // Verificar token
    $stmt = $enlace->prepare("SELECT id, Nombre_Usuario FROM registrod WHERE reset_token = ? AND reset_expiry > NOW()");
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($fila = $result->fetch_assoc()) {
        $token_valido = true;
        $user_id = $fila['id'];

        // Procesar cambio de contraseña
        if ($_SERVER["REQUEST_METHOD"] === "POST") {
            $nueva = trim($_POST["nueva_contrasena"] ?? '');
            $confirmar = trim($_POST["confirmar_contrasena"] ?? '');

            if ($nueva === '' || strlen($nueva) < 6) {
                $mensaje = '<p class="msg-error">La contraseña debe tener al menos 6 caracteres.</p>';
            } elseif ($nueva !== $confirmar) {
                $mensaje = '<p class="msg-error">Las contraseñas no coinciden.</p>';
            } else {
                $hash = password_hash($nueva, PASSWORD_BCRYPT);
                $update = $enlace->prepare("UPDATE registrod SET Contrasena=?, reset_token=NULL, reset_expiry=NULL WHERE id=?");
                $update->bind_param("si", $hash, $user_id);

                if ($update->execute()) {
                    $update->close();
                    $stmt->close();
                    $enlace->close();
                    header("Location: login.php?mensaje=Contraseña restablecida. Inicia sesión.");
                    exit();
                } else {
                    $mensaje = '<p class="msg-error">Error al actualizar la contraseña.</p>';
                }
                $update->close();
            }
        }
    } else {
        $mensaje = '<p class="msg-error">El enlace ha expirado o es inválido. Solicita uno nuevo.</p>';
    }

    $stmt->close();
    $enlace->close();
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Restablecer Contraseña</title>
    <style>
        body { background: linear-gradient(135deg, #0a1628 0%, #1a3a5c 100%); min-height: 100vh; display: flex; flex-direction: column; align-items: center; font-family: 'Poppins', sans-serif; margin: 0; }
        .recovery-card { background: white; border-radius: 16px; padding: 40px; max-width: 450px; width: 90%; margin-top: 160px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
        .recovery-card h2 { color: #00264D; margin-bottom: 10px; }
        .recovery-card label { display: block; margin-bottom: 6px; font-weight: 600; color: #333; margin-top: 15px; }
        .recovery-card input[type="password"] { width: 100%; padding: 12px 16px; border: 2px solid #ddd; border-radius: 10px; font-size: 15px; box-sizing: border-box; }
        .recovery-card input[type="password"]:focus { border-color: #1d47A9; outline: none; }
        .recovery-card button { width: 100%; padding: 12px; background: #00264D; color: white; border: none; border-radius: 10px; font-size: 16px; font-weight: 600; cursor: pointer; margin-top: 20px; transition: background 0.3s; }
        .recovery-card button:hover { background: #1d47A9; }
        .recovery-card a { display: block; text-align: center; margin-top: 15px; color: #1d47A9; text-decoration: none; }
        .msg-error { color: #dc3545; background: #ffe6e6; padding: 10px; border-radius: 8px; text-align: center; }
        .msg-success { color: #155724; background: #d4edda; padding: 10px; border-radius: 8px; text-align: center; }
        .top-bar { width: 100%; background-color: #00264D; padding: 10px; display: flex; justify-content: center; align-items: center; height: 100px; position: fixed; top: 0; left: 0; z-index: 1000; }
        .escudo { width: 100%; height: auto; max-width: 1200px; }
    </style>
</head>
<body>
    <div class="top-bar">
        <img src="images/enkabezado.png" alt="Encabezado" class="escudo">
    </div>

    <div class="recovery-card">
        <h2>Restablecer Contraseña</h2>

        <?php echo $mensaje; ?>

        <?php if ($token_valido): ?>
            <form method="POST">
                <input type="hidden" name="token" value="<?php echo htmlspecialchars($token); ?>">
                <label for="nueva">Nueva contraseña:</label>
                <input type="password" id="nueva" name="nueva_contrasena" minlength="6" required>
                <label for="confirmar">Confirmar contraseña:</label>
                <input type="password" id="confirmar" name="confirmar_contrasena" minlength="6" required>
                <button type="submit">Restablecer</button>
            </form>
        <?php else: ?>
            <a href="contrasena.php">Solicitar nuevo enlace</a>
        <?php endif; ?>

        <a href="login.php">Volver al inicio de sesión</a>
    </div>
    <script src="/prueba/prueba/assets/js/gemini-ai.js"></script>
</body>
</html>
