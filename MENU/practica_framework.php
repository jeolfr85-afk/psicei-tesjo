<?php
require_once __DIR__ . '/../API/config.php';
psiceiStartSession();

if (!isset($_SESSION['usuario'])) {
    header("Location: /prueba/prueba/LOGIN/login.php?error=Inicia sesión para continuar.");
    exit();
}

$area = (string)($_SESSION['area'] ?? '');
$role = (string)($_SESSION['role'] ?? 'user');
$usuario = (string)($_SESSION['usuario'] ?? '');
?>
<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Práctica Framework - PSICEI</title>
  <link rel="stylesheet" href="/prueba/prueba/assets/css/global.css">
  <link rel="stylesheet" href="/prueba/prueba/assets/css/psicei-theme.css">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <style>
    body { background: #f1f5f9; }
    .page-wrap { max-width: 1180px; margin: 112px auto 28px; padding: 0 16px; }
    .hero { background: linear-gradient(135deg, #00264D, #1d47A9); color: #fff; border-radius: 14px; padding: 18px; margin-bottom: 14px; }
    .hero h1 { font-size: 1.35rem; margin-bottom: 4px; }
    .kpi { border-radius: 12px; background: #fff; box-shadow: 0 4px 18px rgba(15,23,42,.06); }
    .kpi .n { font-size: 1.65rem; font-weight: 800; color: #0b2f6a; }
    .cardx { background: #fff; border-radius: 12px; box-shadow: 0 4px 18px rgba(15,23,42,.08); padding: 16px; }
    .is-invalid-msg { color: #dc2626; font-size: .82rem; min-height: 18px; }
    .row-actions button { margin-right: 6px; }
  </style>
</head>
<body data-user-area="<?php echo htmlspecialchars($area); ?>" data-user-role="<?php echo htmlspecialchars($role); ?>" data-user-name="<?php echo htmlspecialchars($usuario); ?>">
  <div class="top-bar">
    <img src="/prueba/prueba/MENU/images/enkabezado.png" alt="Encabezado" class="escudo">
  </div>

  <div class="page-wrap">
    <div class="hero">
      <h1>Práctica: Uso de Framework y programación cliente</h1>
      <div>Usuario: <strong><?php echo htmlspecialchars($usuario); ?></strong> | Área: <strong><?php echo htmlspecialchars($area ?: 'Sin área'); ?></strong></div>
      <div class="mt-2 d-flex gap-2 flex-wrap">
        <a class="btn btn-light btn-sm" href="/prueba/prueba/MENU/portal.php">Portal</a>
        <a class="btn btn-light btn-sm" href="/prueba/prueba/MENU/inicio.php">Inicio</a>
      </div>
    </div>

    <div class="row g-3 mb-3">
      <div class="col-md-4">
        <div class="kpi p-3">
          <div class="text-muted">Total contactos</div>
          <div class="n" id="kpiTotal">0</div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="kpi p-3">
          <div class="text-muted">Contactos en tu área</div>
          <div class="n" id="kpiArea">0</div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="kpi p-3">
          <div class="text-muted">Resultados del filtro</div>
          <div class="n" id="kpiFiltro">0</div>
        </div>
      </div>
    </div>

    <div class="row g-3">
      <div class="col-lg-5">
        <div class="cardx">
          <h5 class="mb-3">Formulario dinámico (jQuery + Bootstrap)</h5>
          <form id="frmContacto" novalidate>
            <div class="mb-2">
              <label for="nombre" class="form-label">Nombre completo</label>
              <input id="nombre" name="nombre" type="text" class="form-control" placeholder="Nombre Apellido">
              <div class="is-invalid-msg" data-error="nombre"></div>
            </div>
            <div class="mb-2">
              <label for="correo" class="form-label">Correo institucional</label>
              <input id="correo" name="correo" type="email" class="form-control" placeholder="usuario@tesjo.edu.mx">
              <div class="is-invalid-msg" data-error="correo"></div>
            </div>
            <div class="mb-2">
              <label for="telefono" class="form-label">Teléfono</label>
              <input id="telefono" name="telefono" type="text" class="form-control" placeholder="7121234567">
              <div class="is-invalid-msg" data-error="telefono"></div>
            </div>
            <div class="mb-2">
              <label for="puesto" class="form-label">Puesto</label>
              <select id="puesto" name="puesto" class="form-select">
                <option value="">Selecciona...</option>
                <option>Docente</option>
                <option>Coordinación</option>
                <option>Administrativo</option>
                <option>Jefatura</option>
                <option>Servicios</option>
              </select>
              <div class="is-invalid-msg" data-error="puesto"></div>
            </div>
            <div class="mb-3">
              <label for="tags" class="form-label">Etiquetas (coma separadas)</label>
              <input id="tags" name="tags" type="text" class="form-control" placeholder="activo,seguimiento">
            </div>
            <div class="d-flex gap-2">
              <button type="submit" class="btn btn-primary">Guardar contacto</button>
              <button type="button" id="btnLimpiar" class="btn btn-outline-secondary">Limpiar</button>
            </div>
            <div class="mt-2 small text-muted">Validación en tiempo real, DOM dinámico y envío AJAX sin recarga.</div>
          </form>
          <div id="msgBox" class="alert mt-3 d-none" role="alert"></div>
        </div>
      </div>

      <div class="col-lg-7">
        <div class="cardx">
          <div class="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
            <h5 class="mb-0">Listado dinámico</h5>
            <div class="d-flex gap-2">
              <input id="txtBuscar" class="form-control form-control-sm" placeholder="Buscar por nombre/correo/tags">
              <button id="btnRefrescar" class="btn btn-sm btn-outline-primary">Actualizar</button>
            </div>
          </div>
          <div class="table-responsive">
            <table class="table table-sm align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Teléfono</th>
                  <th>Puesto</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody id="tbContactos"></tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <script src="/prueba/prueba/assets/js/practica-framework.js"></script>
  <script src="/prueba/prueba/assets/js/gemini-ai.js"></script>
</body>
</html>
