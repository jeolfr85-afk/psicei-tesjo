<?php
require_once __DIR__ . '/../API/config.php';
psiceiStartSession();

if (isset($_SESSION['registro_exitoso']) && $_SESSION['registro_exitoso'] === true):
    $nombre_usuario = $_SESSION['nombre_usuario'] ?? '';
    $area = $_SESSION['area'] ?? '';


    unset($_SESSION['registro_exitoso']);
?>
    <div id="bienvenida">
        <h2>¡Tu registro ha sido exitoso! Bienvenido, <?php echo htmlspecialchars($nombre_usuario); ?>!</h2>
        <p>Tu área es <?php echo htmlspecialchars($area); ?></p>
    </div>
    <script>
        setTimeout(function() {
            document.getElementById('bienvenida').style.display = 'none';
            window.location.href = <?php echo json_encode(SITE_URL . '/MENU/inicio.php'); ?>;
        }, 5000);
    </script>
<?php endif; ?>


<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro</title>
    <link rel="stylesheet" href="/prueba/prueba/assets/css/global.css">
    <link rel="stylesheet" href="registro.css">
    <style>
        /* Pantalla completa para el mensaje de bienvenida */
        #bienvenida {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            background-color: #00264D;
            font-family: 'Poppins', sans-serif;
            text-align: center;
            flex-direction: column;
            padding: 20px;
        }

        #bienvenida h2 {
            color: white;
            font-size: 2em;
        }

        #bienvenida p {
            color: white;
            font-size: 1.2em;
        }

        .mensaje-error {
            color: red;
            background-color: #ffe6e6;
            border: 1px solid red;
            padding: 10px;
            margin-bottom: 15px;
            border-radius: 8px;
            font-weight: bold;
            text-align: center;
            width: 100%;
        }
    </style>
</head>

<body>

    <div class="top-bar">
        <img src="../MENU/images/enkabezado.png" alt="Logo de encabezado" class="escudo">
    </div>

    <!-- PANEL IZQUIERDO DAR LA BIENVENIDA-->
    <div class="left-panel">
        <h1>REGISTRAR NUEVO USUARIO</h1>
        <ion-icon name="exit-outline"></ion-icon>
    </div>

    <!-- Panel principal -->
    <div class="container">
        <div class="right-panel">

          
            <?php if (isset($_GET['error'])): ?>
                <div class="mensaje-error">
                    <?php echo htmlspecialchars($_GET['error']); ?>
                </div>
            <?php endif; ?>

            <form action="procesar.php" method="post">
                <div class="form-group">
                    <label for="nombre">Nombre(s):</label>
                    <input type="text" id="nombre" name="Nombre" required>
                </div>

                <div class="form-group">
                    <label for="apellidoPaterno">Apellido Paterno:</label>
                    <input type="text" id="apellidoPaterno" name="Apellido_Paterno" required>
                </div>

                <div class="form-group">
                    <label for="apellidoMaterno">Apellido Materno:</label>
                    <input type="text" id="apellidoMaterno" name="Apellido_Materno" required>
                </div>

                <div class="form-group">
                    <label for="telefono">Número de Teléfono:</label>
                    <input type="tel" id="telefono" name="Numero_de_telefono" required>
                </div>

                <p class="ps-muted" style="margin-bottom:12px;font-size:0.9em;">
                    Solo personal de <strong>Dirección Académica</strong> o <strong>Dirección de Vinculación y Extensión</strong> puede registrarse.
                    Al elegir tu dirección tendrás acceso a todos sus departamentos y módulos.
                </p>

                <div class="form-group">
                    <label for="area">Dirección:</label>
                    <select id="area" name="Area" required>
                        <option value="">Selecciona tu dirección</option>
                        <option value="Dirección Académica">Dirección Académica</option>
                        <option value="Dirección de Vinculación y Extensión">Dirección de Vinculación y Extensión</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="correo">Correo institucional:</label>
                    <input type="email" id="correo" name="Correo_Institucional" placeholder="usuario@tesjo.edu.mx" pattern="^[a-zA-Z0-9._%+-]+@tesjo\.edu\.mx$" required>
                </div>

                <div class="form-group">
                    <label for="nombreUsuario">Nombre de Usuario:</label>
                    <input type="text" id="nombreUsuario" name="Nombre_de_Usuario" required>
                </div>

                <div class="form-group">
                    <label for="contraseña">Contraseña:</label>
                    <input type="password" id="contraseña" name="Contrasena" required>
                </div>

                <div class="form-group-buttons">
                    <button type="submit" name="registro" class="submit-btn">Registrar</button>
                    <a href="login.php" class="return-btn">Volver al inicio</a>
                </div>
            </form>
        </div>
    </div>

    <!-- Desaparece el mensaje rojo después de 5 segundos -->
    <script>
        setTimeout(() => {
            const errorMsg = document.querySelector('.mensaje-error');
            if (errorMsg) {
                errorMsg.style.transition = 'opacity 1s';
                errorMsg.style.opacity = '0';
                setTimeout(() => errorMsg.remove(), 1000);
            }
        }, 5000);
    </script>
    <script src="/prueba/prueba/assets/js/gemini-ai.js"></script>
</body>

</html>
