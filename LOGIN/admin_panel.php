<?php
require_once __DIR__ . '/../API/config.php';
psiceiStartSession();

// Verificar que sea admin
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    header("Location: login.php?error=Acceso denegado.");
    exit();
}

$enlace = getDBConnection();
ensureUserSchemaAndAdmin($enlace);

// Procesar eliminación
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['eliminar_id'])) {
    $id = intval($_POST['eliminar_id']);
    $stmt = $enlace->prepare("DELETE FROM registrod WHERE id = ? AND role != 'admin'");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $stmt->close();
    header("Location: admin_panel.php?msg=Usuario eliminado.");
    exit();
}

// Procesar edición de usuario
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['editar_id'])) {
    $id = intval($_POST['editar_id']);
    $nombre = trim($_POST['nombre'] ?? '');
    $apellido = trim($_POST['apellido'] ?? '');
    $correo = strtolower(trim($_POST['correo'] ?? ''));
    $usuario = trim($_POST['usuario'] ?? '');
    $area = trim($_POST['area'] ?? '');
    $subarea = trim($_POST['subarea'] ?? '');
    $telefono = trim($_POST['telefono'] ?? '');
    $rol = trim($_POST['role'] ?? 'user');
    $nuevaPass = trim($_POST['nueva_password'] ?? '');

    if ($id > 0 && $nombre !== '' && $apellido !== '' && $usuario !== '' && $area !== '') {
        if (!preg_match('/^[a-zA-Z0-9._%+-]+@tesjo\.edu\.mx$/', $correo)) {
            header("Location: admin_panel.php?msg=Correo inválido. Usa @tesjo.edu.mx");
            exit();
        }

        $rolFinal = ($rol === 'admin') ? 'admin' : 'user';

        if ($rolFinal === 'user') {
            $subarea = '';
        }

        if ($rolFinal === 'user' && !isAllowedInstitutionalArea($area)) {
            header('Location: admin_panel.php?msg=' . urlencode('Área no permitida. Solo Dirección Académica o Dirección de Vinculación y Extensión.'));
            exit();
        }

        if ($nuevaPass !== '') {
            $passHash = password_hash($nuevaPass, PASSWORD_BCRYPT);
            $stmt = $enlace->prepare("UPDATE registrod SET Nombre=?, Apellido_Paterno=?, Correo_Institucional=?, Nombre_Usuario=?, Area=?, Subarea=?, Numero_de_telefono=?, role=?, Contrasena=? WHERE id=?");
            $stmt->bind_param("sssssssssi", $nombre, $apellido, $correo, $usuario, $area, $subarea, $telefono, $rolFinal, $passHash, $id);
            $stmt->execute();
            $stmt->close();
        } else {
            $stmt = $enlace->prepare("UPDATE registrod SET Nombre=?, Apellido_Paterno=?, Correo_Institucional=?, Nombre_Usuario=?, Area=?, Subarea=?, Numero_de_telefono=?, role=? WHERE id=?");
            $stmt->bind_param("ssssssssi", $nombre, $apellido, $correo, $usuario, $area, $subarea, $telefono, $rolFinal, $id);
            $stmt->execute();
            $stmt->close();
        }
        header("Location: admin_panel.php?msg=Usuario actualizado.&id=" . $id);
        exit();
    }
}

// Exportar usuarios
if (isset($_GET['export']) && in_array($_GET['export'], ['excel', 'pdf'], true)) {
    $rows = $enlace->query("SELECT id, Nombre, Apellido_Paterno, Correo_Institucional, Nombre_Usuario, Numero_de_telefono, Area, Subarea, role FROM registrod ORDER BY id DESC");
    $exportHeaders = '<tr><th>ID</th><th>Nombre</th><th>Apellido</th><th>Correo</th><th>Usuario</th><th>Teléfono</th><th>Área</th><th>Subárea</th><th>Rol</th></tr>';
    if ($_GET['export'] === 'excel') {
        header('Content-Type: application/vnd.ms-excel; charset=utf-8');
        header('Content-Disposition: attachment; filename=usuarios_psicei.xls');
        echo "<table border='1'>" . $exportHeaders;
        while ($r = $rows->fetch_assoc()) {
            echo '<tr>';
            echo '<td>' . (int)$r['id'] . '</td>';
            echo '<td>' . htmlspecialchars($r['Nombre']) . '</td>';
            echo '<td>' . htmlspecialchars($r['Apellido_Paterno']) . '</td>';
            echo '<td>' . htmlspecialchars($r['Correo_Institucional']) . '</td>';
            echo '<td>' . htmlspecialchars($r['Nombre_Usuario']) . '</td>';
            echo '<td>' . htmlspecialchars($r['Numero_de_telefono'] ?? '') . '</td>';
            echo '<td>' . htmlspecialchars($r['Area']) . '</td>';
            echo '<td>' . htmlspecialchars($r['Subarea'] ?? '') . '</td>';
            echo '<td>' . htmlspecialchars($r['role']) . '</td>';
            echo '</tr>';
        }
        echo '</table>';
        exit();
    }

    header('Content-Type: text/html; charset=utf-8');
    echo "<!doctype html><html><head><meta charset='utf-8'><title>Usuarios PSICEI</title>";
    echo "<style>body{font-family:Arial;padding:24px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #555;padding:8px}th{background:#eee}</style>";
    echo "</head><body><h2>Usuarios PSICEI</h2><table>" . $exportHeaders;
    while ($r = $rows->fetch_assoc()) {
        echo '<tr>';
        echo '<td>' . (int)$r['id'] . '</td>';
        echo '<td>' . htmlspecialchars($r['Nombre']) . '</td>';
        echo '<td>' . htmlspecialchars($r['Apellido_Paterno']) . '</td>';
        echo '<td>' . htmlspecialchars($r['Correo_Institucional']) . '</td>';
        echo '<td>' . htmlspecialchars($r['Nombre_Usuario']) . '</td>';
        echo '<td>' . htmlspecialchars($r['Numero_de_telefono'] ?? '') . '</td>';
        echo '<td>' . htmlspecialchars($r['Area']) . '</td>';
        echo '<td>' . htmlspecialchars($r['Subarea'] ?? '') . '</td>';
        echo '<td>' . htmlspecialchars($r['role']) . '</td>';
        echo '</tr>';
    }
    echo "</table><script>window.onload=function(){window.print();}</script></body></html>";
    exit();
}

// Obtener todos los usuarios
$resultado = $enlace->query("SELECT id, Nombre, Apellido_Paterno, Correo_Institucional, Nombre_Usuario, Numero_de_telefono, Area, Subarea, role FROM registrod ORDER BY id DESC");
$allowedAreas = getAllowedInstitutionalAreas();
$usuarios = [];
$countAdmin = 0;
$countUser = 0;
while ($fila = $resultado->fetch_assoc()) {
    $usuarios[] = $fila;
    if (($fila['role'] ?? '') === 'admin') {
        $countAdmin++;
    } else {
        $countUser++;
    }
}
$totalUsuarios = count($usuarios);

function adminUserInitials(array $fila): string
{
    $n = mb_substr(trim((string)($fila['Nombre'] ?? 'U')), 0, 1);
    $a = mb_substr(trim((string)($fila['Apellido_Paterno'] ?? '')), 0, 1);
    return mb_strtoupper($n . $a);
}

function adminAreaShortLabel(string $area): string
{
    if ($area === INSTITUTIONAL_AREA_ACADEMICA) {
        return 'Académica';
    }
    if ($area === INSTITUTIONAL_AREA_VINCULACION) {
        return 'Vinculación';
    }
    return $area;
}

$selectedId = (int)($_GET['id'] ?? 0);
if ($selectedId <= 0 && $totalUsuarios > 0) {
    $selectedId = (int)$usuarios[0]['id'];
}

$selectedUser = null;
foreach ($usuarios as $u) {
    if ((int)$u['id'] === $selectedId) {
        $selectedUser = $u;
        break;
    }
}
if ($selectedUser === null && $totalUsuarios > 0) {
    $selectedUser = $usuarios[0];
    $selectedId = (int)$selectedUser['id'];
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestión de usuarios - PSICEI</title>
    <link rel="stylesheet" href="/prueba/prueba/assets/css/global.css">
    <link rel="stylesheet" href="/prueba/prueba/assets/css/psicei-theme.css">
    <link rel="stylesheet" href="/prueba/prueba/assets/css/admin-panel.css">
</head>
<body class="admin-page">
    <div class="top-bar">
        <img src="images/enkabezado.png" alt="Encabezado" class="escudo">
    </div>

    <div class="admin-shell welcome-animate">
        <header class="admin-hero">
            <div>
                <h1>Gestión de usuarios</h1>
                <p class="admin-hero-sub">Administra cuentas de Dirección Académica y Dirección de Vinculación y Extensión. Los usuarios de área tienen acceso a todas las subáreas de su dirección.</p>
            </div>
            <div class="admin-stats">
                <div class="admin-stat-pill">
                    <strong><?php echo $totalUsuarios; ?></strong>
                    <span>Total</span>
                </div>
                <div class="admin-stat-pill">
                    <strong><?php echo $countUser; ?></strong>
                    <span>Área</span>
                </div>
                <div class="admin-stat-pill">
                    <strong><?php echo $countAdmin; ?></strong>
                    <span>Admin</span>
                </div>
            </div>
        </header>

        <nav class="admin-toolbar" aria-label="Acciones del panel">
            <div class="toolbar-group">
                <a href="admin_home.php" class="admin-btn admin-btn--back">&larr; Volver al inicio</a>
                <a href="admin_panel.php?export=excel" class="admin-btn admin-btn--export">Excel</a>
                <a href="admin_panel.php?export=pdf" class="admin-btn admin-btn--export">PDF</a>
                <a href="/prueba/prueba/MENU/portal.php" class="admin-btn admin-btn--system">Ir al sistema</a>
            </div>
            <span class="toolbar-spacer"></span>
            <a href="logout.php" class="admin-btn admin-btn--logout">Cerrar sesión</a>
        </nav>

        <?php if (isset($_GET['msg'])): ?>
            <?php
            $msgText = (string)$_GET['msg'];
            $isWarn = str_contains(mb_strtolower($msgText), 'inválid') || str_contains(mb_strtolower($msgText), 'no permitida') || str_contains(mb_strtolower($msgText), 'error');
            ?>
            <div class="admin-alert<?php echo $isWarn ? ' admin-alert--warn' : ''; ?>" role="status">
                <?php echo htmlspecialchars($msgText); ?>
            </div>
        <?php endif; ?>

        <?php if ($totalUsuarios === 0): ?>
            <p class="admin-empty">No hay usuarios registrados en el sistema.</p>
        <?php else: ?>
        <div class="admin-split">
            <aside class="user-list-panel">
                <div class="user-list-panel__head">
                    <h2>Usuarios</h2>
                    <span class="user-list-count"><?php echo $totalUsuarios; ?></span>
                </div>
                <input type="search" class="user-list-search" id="userSearch" placeholder="Buscar nombre, usuario o correo…" autocomplete="off">
                <ul class="user-list" id="userList" role="listbox" aria-label="Lista de usuarios">
                    <?php foreach ($usuarios as $fila):
                        $esAdmin = ($fila['role'] ?? '') === 'admin';
                        $uid = (int)$fila['id'];
                        $isActive = $uid === $selectedId;
                    ?>
                    <li>
                        <button type="button"
                            class="user-list-item<?php echo $isActive ? ' is-active' : ''; ?><?php echo $esAdmin ? ' user-list-item--admin' : ''; ?>"
                            role="option"
                            aria-selected="<?php echo $isActive ? 'true' : 'false'; ?>"
                            data-user-id="<?php echo $uid; ?>">
                            <span class="user-list-item__avatar" aria-hidden="true"><?php echo htmlspecialchars(adminUserInitials($fila)); ?></span>
                            <span class="user-list-item__body">
                                <span class="user-list-item__login">@<?php echo htmlspecialchars($fila['Nombre_Usuario']); ?></span>
                                <span class="user-list-item__name"><?php echo htmlspecialchars(trim($fila['Nombre'] . ' ' . $fila['Apellido_Paterno'])); ?></span>
                                <span class="user-list-item__area"><?php echo htmlspecialchars(adminAreaShortLabel((string)$fila['Area'])); ?></span>
                            </span>
                            <span class="user-list-item__badge"><?php echo $esAdmin ? 'Admin' : 'Área'; ?></span>
                        </button>
                    </li>
                    <?php endforeach; ?>
                </ul>
            </aside>

            <section class="user-edit-panel" id="userEditPanel" aria-label="Editar usuario">
                <?php
                $fila = $selectedUser;
                $esAdmin = ($fila['role'] ?? '') === 'admin';
                ?>
                <div class="user-edit-panel__head">
                    <div class="user-avatar user-avatar--lg" id="editAvatar" aria-hidden="true"><?php echo htmlspecialchars(adminUserInitials($fila)); ?></div>
                    <div>
                        <p class="user-edit-panel__title" id="editTitle">@<?php echo htmlspecialchars($fila['Nombre_Usuario']); ?></p>
                        <p class="user-edit-panel__sub" id="editSubtitle"><?php echo htmlspecialchars(trim($fila['Nombre'] . ' ' . $fila['Apellido_Paterno'])); ?></p>
                    </div>
                    <span class="user-badge user-badge--id" id="editIdBadge">ID <?php echo (int)$fila['id']; ?></span>
                </div>

                <form method="POST" class="user-edit-form" id="editUserForm">
                    <input type="hidden" name="editar_id" id="editar_id" value="<?php echo (int)$fila['id']; ?>">

                    <div class="user-fields">
                        <div class="user-field">
                            <label for="edit_nombre">Nombre</label>
                            <input id="edit_nombre" name="nombre" required>
                        </div>
                        <div class="user-field">
                            <label for="edit_apellido">Apellido paterno</label>
                            <input id="edit_apellido" name="apellido" required>
                        </div>
                        <div class="user-field user-field--wide">
                            <label for="edit_correo">Correo institucional</label>
                            <input id="edit_correo" type="email" name="correo" required>
                        </div>
                        <div class="user-field">
                            <label for="edit_usuario">Usuario de acceso</label>
                            <input id="edit_usuario" name="usuario" required>
                        </div>
                        <div class="user-field">
                            <label for="edit_telefono">Teléfono</label>
                            <input id="edit_telefono" name="telefono" placeholder="10 dígitos">
                        </div>
                        <div class="user-field user-field--wide" id="areaFieldWrap">
                            <label for="edit_area">Dirección / área</label>
                            <select id="edit_area_select" name="area" class="edit-area-select">
                                <?php foreach ($allowedAreas as $allowedArea): ?>
                                    <option value="<?php echo htmlspecialchars($allowedArea); ?>"><?php echo htmlspecialchars($allowedArea); ?></option>
                                <?php endforeach; ?>
                            </select>
                            <input id="edit_area_input" class="edit-area-input" hidden>
                            <span class="user-field__hint" id="areaHint">Acceso a todos los departamentos de la dirección.</span>
                            <input type="hidden" name="subarea" id="edit_subarea" value="">
                        </div>
                        <div class="user-field" id="subareaFieldWrap" hidden>
                            <label for="edit_subarea_notes">Notas (admin)</label>
                            <input id="edit_subarea_notes" type="text" autocomplete="off">
                        </div>
                        <div class="user-field">
                            <label for="edit_role">Rol</label>
                            <select id="edit_role" name="role">
                                <option value="user">Usuario de área</option>
                                <option value="admin">Administrador</option>
                            </select>
                        </div>
                        <div class="user-field user-field--wide">
                            <label for="edit_password">Nueva contraseña</label>
                            <input id="edit_password" type="password" name="nueva_password" placeholder="Dejar vacío para no cambiar" autocomplete="new-password">
                        </div>
                    </div>

                    <div class="user-edit-panel__actions">
                        <button type="submit" class="admin-btn admin-btn--save">Guardar cambios</button>
                        <button type="button" class="admin-btn admin-btn--delete" id="btnDeleteUser">Eliminar</button>
                    </div>
                </form>
                <form method="POST" id="deleteUserForm" hidden>
                    <input type="hidden" name="eliminar_id" id="eliminar_id" value="">
                </form>
            </section>
        </div>

        <script>
            window.PSICEI_USERS = <?php echo json_encode(array_values($usuarios), JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT); ?>;
            window.PSICEI_ALLOWED_AREAS = <?php echo json_encode($allowedAreas, JSON_UNESCAPED_UNICODE); ?>;
            window.PSICEI_SELECTED_ID = <?php echo (int)$selectedId; ?>;
        </script>
        <script src="/prueba/prueba/assets/js/admin-panel.js"></script>
        <?php endif; ?>

        <footer class="admin-footer">
            <p>&copy; <?php echo date('Y'); ?> TecNM — Todos los derechos reservados · PSICEI</p>
        </footer>
    </div>

    <script src="/prueba/prueba/assets/js/gemini-ai.js"></script>
</body>
</html>
<?php $enlace->close(); ?>
