<?php
require_once __DIR__ . '/../API/config.php';
psiceiStartSession();
if (!isset($_SESSION['usuario']) || (string)($_SESSION['role'] ?? 'user') !== 'admin') {
    header("Location: /prueba/prueba/LOGIN/login.php?error=Acceso denegado.");
    exit();
}
?>
<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Herramientas Admin - PSICEI</title>
  <link rel="stylesheet" href="/prueba/prueba/assets/css/global.css" />
  <link rel="stylesheet" href="/prueba/prueba/assets/css/psicei-theme.css" />
  <style>
    .wrap { max-width: 1100px; margin: 110px auto 40px; padding: 0 16px; }
    .hero { background: linear-gradient(135deg,#00264D,#1d47A9); color:#fff; border-radius:14px; padding:22px; margin-bottom:16px; }
    .grid { display:grid; grid-template-columns: repeat(auto-fit,minmax(280px,1fr)); gap:14px; }
    .card { background:#fff; border-radius:12px; padding:16px; box-shadow:0 4px 18px rgba(0,0,0,.08); }
    pre { background:#0b1220; color:#dbeafe; padding:12px; border-radius:12px; overflow:auto; max-height:420px; }
    .row { display:flex; gap:10px; flex-wrap:wrap; margin-top:10px; }
    .btn2 { background:#0b2f6a; color:#fff; border:none; padding:10px 14px; border-radius:10px; font-weight:800; cursor:pointer; }
    .btn2.secondary { background:#334155; }
    .note { color:#475569; font-size:.95rem; line-height:1.5; }
  </style>
</head>
<body>
  <div class="top-bar">
    <img src="/prueba/prueba/MENU/images/enkabezado.png" alt="Encabezado" class="escudo" />
  </div>

  <div class="wrap">
    <div class="hero">
      <h2 style="margin-bottom:6px;">Herramientas de Mantenimiento (Admin)</h2>
      <p class="note" style="color:#e8f0ff;">
        Aquí puedes auditar links rotos, detectar páginas sin asistente IA y aplicar inyección masiva.
      </p>
      <div class="row">
        <button class="btn2" id="btn-audit">Auditar</button>
        <button class="btn2 secondary" id="btn-inject">Inyectar IA + arreglar \\ en links</button>
        <button class="btn2 secondary" id="btn-audit-theme">Auditar estilo</button>
        <button class="btn2 secondary" id="btn-inject-theme">Aplicar estilo a TODO MENU/ (HTML)</button>
        <a class="btn2 secondary" href="/prueba/prueba/MENU/portal.php" style="text-decoration:none;display:inline-flex;align-items:center;">Volver al portal</a>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <h3>Resultado</h3>
        <pre id="out">{}</pre>
      </div>
      <div class="card">
        <h3>Notas</h3>
        <p class="note">
          - <strong>Auditar</strong> recorre todo <code>MENU/</code> y lista links rotos y páginas sin IA.
          <br>- <strong>Inyectar</strong> agrega automáticamente el script del asistente a todas las páginas HTML que falten y corrige links con <code>\</code>.
        </p>
        <p class="note">
          Después de inyectar, recarga una página con <strong>Ctrl+F5</strong> una vez.
        </p>
      </div>
    </div>
  </div>

  <script>
    const out = document.getElementById('out');
    async function call(action){
      out.textContent = 'Procesando...';
      const res = await fetch(`/prueba/prueba/API/maintenance.php?action=${action}`, { credentials: 'same-origin' });
      const data = await res.json();
      out.textContent = JSON.stringify(data, null, 2);
    }
    document.getElementById('btn-audit').onclick = () => call('audit');
    document.getElementById('btn-inject').onclick = () => call('inject_ai');
    document.getElementById('btn-audit-theme').onclick = () => call('audit_theme');
    document.getElementById('btn-inject-theme').onclick = () => call('inject_theme');
  </script>
  <script src="/prueba/prueba/assets/js/psicei-ui.js"></script>
  <script src="/prueba/prueba/assets/js/gemini-ai.js"></script>
</body>
</html>

