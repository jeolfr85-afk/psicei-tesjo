<?php
require_once __DIR__ . '/../API/config.php';
psiceiStartSession();

$mensaje = '';
$link_reset = '';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $correo = strtolower(trim($_POST["correo"] ?? ''));

    if ($correo === '') {
        $mensaje = '<p class="msg-error">Ingresa tu correo institucional.</p>';
    } else {
        $enlace = getDBConnection();

        // Buscar usuario por correo
        $stmt = $enlace->prepare("SELECT id, Nombre_Usuario FROM registrod WHERE Correo_Institucional = ?");
        $stmt->bind_param("s", $correo);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($fila = $result->fetch_assoc()) {
            // Generar token
            $token = bin2hex(random_bytes(32));
            $expiry = date('Y-m-d H:i:s', strtotime('+1 hour'));

            $update = $enlace->prepare("UPDATE registrod SET reset_token=?, reset_expiry=? WHERE id=?");
            $update->bind_param("ssi", $token, $expiry, $fila['id']);
            $update->execute();
            $update->close();

            $reset_url = SITE_URL . "/LOGIN/restablecer.php?token=" . $token;

            // En localhost mostramos el link directamente
            $link_reset = $reset_url;
            $mensaje = '<p class="msg-success">Se ha generado un enlace de recuperación.</p>';
        } else {
            // Mensaje genérico por seguridad
            $mensaje = '<p class="msg-success">Si tu correo está registrado, recibirás instrucciones.</p>';
        }

        $stmt->close();
        $enlace->close();
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recuperar Contraseña</title>
    <link rel="stylesheet" href="../assets/css/global.css">
    <style>
        body { background: linear-gradient(135deg, #0a1628 0%, #1a3a5c 100%); min-height: 100vh; display: flex; flex-direction: column; align-items: center; font-family: 'Poppins', sans-serif; margin: 0; }
        .recovery-card { background: white; border-radius: 16px; padding: 40px; max-width: 450px; width: 90%; margin-top: 160px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
        .recovery-card h2 { color: #00264D; margin-bottom: 10px; font-size: 1.5em; }
        .recovery-card p.desc { color: #666; font-size: 0.9em; margin-bottom: 25px; }
        .recovery-card label { display: block; margin-bottom: 6px; font-weight: 600; color: #333; }
        .recovery-card input[type="email"] { width: 100%; padding: 12px 16px; border: 2px solid #ddd; border-radius: 10px; font-size: 15px; transition: border-color 0.3s; box-sizing: border-box; }
        .recovery-card input[type="email"]:focus { border-color: #1d47A9; outline: none; }
        .recovery-card button { width: 100%; padding: 12px; background: #00264D; color: white; border: none; border-radius: 10px; font-size: 16px; font-weight: 600; cursor: pointer; margin-top: 15px; transition: background 0.3s; }
        .recovery-card button:hover { background: #1d47A9; }
        .recovery-card a { display: block; text-align: center; margin-top: 15px; color: #1d47A9; text-decoration: none; font-size: 0.9em; }
        .msg-error { color: #dc3545; background: #ffe6e6; padding: 10px; border-radius: 8px; text-align: center; margin-bottom: 15px; }
        .msg-success { color: #155724; background: #d4edda; padding: 10px; border-radius: 8px; text-align: center; margin-bottom: 15px; }
        .reset-link { background: #f0f4ff; border: 2px dashed #1d47A9; padding: 15px; border-radius: 10px; margin-top: 15px; word-break: break-all; font-size: 0.85em; }
        .reset-link strong { display: block; margin-bottom: 5px; color: #00264D; }
        .reset-link a { color: #1d47A9; }
        .top-bar { width: 100%; background-color: #00264D; padding: 10px; display: flex; justify-content: center; align-items: center; height: 100px; position: fixed; top: 0; left: 0; z-index: 1000; }
        .escudo { width: 100%; height: auto; max-width: 1200px; }
    </style>
</head>
<body>
    <div class="top-bar">
        <img src="images/enkabezado.png" alt="Encabezado" class="escudo">
    </div>

    <div class="recovery-card">
        <h2>Recuperar Contraseña</h2>
        <p class="desc">Ingresa tu correo institucional (@tesjo.mx) y te generaremos un enlace para restablecer tu contraseña.</p>

        <?php echo $mensaje; ?>

        <?php if ($link_reset): ?>
            <div class="reset-link">
                <strong>Enlace de recuperación (localhost):</strong>
                <a href="<?php echo htmlspecialchars($link_reset); ?>"><?php echo htmlspecialchars($link_reset); ?></a>
            </div>
        <?php endif; ?>

        <form method="POST">
            <label for="correo">Correo institucional:</label>
            <input type="email" id="correo" name="correo" placeholder="tucorreo@tesjo.mx" required>
            <button type="submit">Enviar enlace</button>
        </form>

        <a href="login.php">Volver al inicio de sesión</a>
    </div>
    <script src="/prueba/prueba/assets/js/gemini-ai.js"></script>
</body>
</html>
