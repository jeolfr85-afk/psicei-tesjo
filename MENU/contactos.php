<?php
require_once __DIR__ . '/../API/config.php';
psiceiStartSession();
if (!isset($_SESSION['usuario'])) {
  header("Location: /prueba/prueba/LOGIN/login.php?error=Inicia sesión para continuar.");
  exit();
}
rejectUnauthorizedInstitutionalUser();
$role = (string)($_SESSION['role'] ?? 'user');
$area = (string)($_SESSION['area'] ?? '');
$usuario = (string)($_SESSION['usuario'] ?? '');
?>
<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Contactos - PSICEI</title>
  <link rel="stylesheet" href="/prueba/prueba/assets/css/global.css" />
  <link rel="stylesheet" href="/prueba/prueba/assets/css/psicei-theme.css" />
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
  <style>
    .toolbar{display:flex;gap:10px;flex-wrap:wrap;align-items:end}
    .toolbar .ps-field{min-width:220px}
    .pill{background:#0b2f6a;color:#fff;padding:6px 10px;border-radius:999px;font-weight:900;font-size:.85rem}
    .btnx2{border:1px solid var(--ps-border);background:#fff;color:var(--ps-primary);padding:10px 12px;border-radius:12px;font-weight:900;cursor:pointer}
    .btnx2:hover{background:#f8fbff}
    .btnx2.primary{background:linear-gradient(135deg,#0b2f6a,#1d47A9);border-color:#0b2f6a;color:#fff}
    .btnx2.primary:hover{background:#1d47A9;color:#fff}
    .danger{background:#fee2e2;border-color:#fecaca;color:#7f1d1d}
    .row-actions{display:flex;gap:8px;flex-wrap:wrap}
    td input{width:100%;padding:8px 10px;border-radius:10px;border:1px solid var(--ps-border)}
    #modalNuevoContacto .modal-content{border:none;border-radius:14px;overflow:hidden;box-shadow:0 10px 30px rgba(2,6,23,.18)}
    #modalNuevoContacto .modal-header{background:linear-gradient(135deg,#0b2f6a,#1d47A9);color:#fff;border:none;padding:18px 22px}
    #modalNuevoContacto .modal-title{font-weight:900;letter-spacing:.2px}
    #modalNuevoContacto .btn-close{filter:invert(1) grayscale(1) brightness(2)}
    #modalNuevoContacto .modal-body{background:#fff;padding:22px}
    #modalNuevoContacto .modal-footer{background:#f8fbff;border-top:1px solid var(--ps-border);padding:14px 22px}
    #modalNuevoContacto .form-label{font-weight:800;color:#0b2f6a;margin-bottom:6px}
    #modalNuevoContacto .form-control,#modalNuevoContacto .form-select{
      border-radius:10px;border:1px solid var(--ps-border);padding:10px 12px;
    }
    #modalNuevoContacto .form-control:focus,#modalNuevoContacto .form-select:focus{
      border-color:#1d47A9;box-shadow:0 0 0 .2rem rgba(29,71,169,.15);
    }
    #modalNuevoContacto .invalid-feedback{font-size:.82rem}
    #modalNuevoContacto .form-text{color:var(--ps-muted);font-size:.82rem}
    #modalNuevoContacto .btn-primary{background:#0b2f6a;border-color:#0b2f6a;font-weight:900;border-radius:10px;padding:10px 18px}
    #modalNuevoContacto .btn-primary:hover{background:#1d47A9;border-color:#1d47A9}
    #modalNuevoContacto .btn-outline-secondary{border-radius:10px;font-weight:800;color:#0b2f6a;border-color:var(--ps-border)}
  </style>
</head>
<body data-user-area="<?php echo htmlspecialchars($area); ?>" data-user-role="<?php echo htmlspecialchars($role); ?>" data-user-name="<?php echo htmlspecialchars($usuario); ?>">
  <div class="top-bar">
    <img src="/prueba/prueba/MENU/images/enkabezado.png" alt="Encabezado" class="escudo" />
  </div>

  <div class="ps-wrap">
    <div class="ps-hero">
      <div>
        <h2>Contactos</h2>
        <div class="ps-sub">Gestión de contactos institucionales con registro, búsqueda y edición por área.</div>
      </div>
      <div class="ps-actions">
        <a class="ps-btn ps-solid" href="/prueba/prueba/MENU/home.php">Inicio</a>
        <a class="ps-btn ps-solid" href="/prueba/prueba/MENU/resumen_area.php">Resumen</a>
        <a class="ps-btn ps-solid" href="/prueba/prueba/MENU/contactos_stats.php">Gráficas</a>
        <a class="ps-btn ps-solid" href="/prueba/prueba/MENU/portal.php">Menú principal</a>
      </div>
    </div>

    <div class="ps-grid">
      <div class="ps-card">
        <h3>Acciones</h3>
        <div class="toolbar">
          <div class="ps-field">
            <label>Buscar</label>
            <input id="q" placeholder="Nombre, correo, tags…" />
          </div>
          <div class="ps-field">
            <label>Área</label>
            <input id="areaFilter" placeholder="Ej: Dirección General" value="<?php echo htmlspecialchars($area); ?>" />
          </div>
          <button class="btnx2" id="btnReload">Buscar</button>
          <button class="btnx2 primary" id="btnNew" type="button">Nuevo</button>
          <span class="pill" id="kpi">0</span>
        </div>
        <div class="ps-muted" style="margin-top:10px;">
          Usa <strong>Nuevo</strong> para abrir el formulario de registro. También puedes editar directo en la tabla y presionar <strong>Guardar</strong>.
        </div>
      </div>
    </div>

    <div class="ps-card" style="margin-top:14px;">
      <div class="ps-scroll">
        <table class="ps-table" id="tbl">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Puesto</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Área</th>
              <th>Tags</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>
  </div>

  <div class="modal fade" id="modalNuevoContacto" tabindex="-1" aria-labelledby="modalNuevoContactoLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modalNuevoContactoLabel">Registrar nuevo contacto</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
        </div>
        <form id="frmNuevoContacto" novalidate>
          <div class="modal-body">
            <p class="text-muted mb-1" style="font-size:.9rem;">Los campos marcados con <span class="text-danger">*</span> son obligatorios.</p>
            <div class="row g-3">
              <div class="col-md-6">
                <label for="ncNombre" class="form-label">Nombre completo <span class="text-danger">*</span></label>
                <input type="text" class="form-control" id="ncNombre" name="nombre" required minlength="3" maxlength="120" placeholder="Ej. María López García" autocomplete="name">
                <div class="invalid-feedback">Ingresa un nombre completo válido.</div>
              </div>
              <div class="col-md-6">
                <label for="ncPuesto" class="form-label">Puesto <span class="text-danger">*</span></label>
                <input type="text" class="form-control" id="ncPuesto" name="puesto" required minlength="2" maxlength="80" placeholder="Ej. Coordinación académica">
                <div class="invalid-feedback">El puesto es obligatorio.</div>
              </div>
              <div class="col-md-6">
                <label for="ncCorreo" class="form-label">Correo electrónico <span class="text-danger">*</span></label>
                <input type="email" class="form-control" id="ncCorreo" name="correo" required maxlength="120" placeholder="correo@tesjo.edu.mx" autocomplete="email">
                <div class="invalid-feedback">Ingresa un correo electrónico válido.</div>
              </div>
              <div class="col-md-6">
                <label for="ncTelefono" class="form-label">Teléfono <span class="text-danger">*</span></label>
                <input type="tel" class="form-control" id="ncTelefono" name="telefono" required inputmode="numeric" pattern="[0-9]{10}" maxlength="10" placeholder="10 dígitos, solo números">
                <div class="form-text">Solo números, 10 dígitos.</div>
                <div class="invalid-feedback">Ingresa un teléfono de 10 dígitos numéricos.</div>
              </div>
              <div class="col-md-6">
                <label for="ncArea" class="form-label">Área <span class="text-danger">*</span></label>
                <select class="form-select" id="ncArea" name="area" required>
                  <option value="">Selecciona un área</option>
                  <option value="Superusuario">Superusuario</option>
                  <option value="Control Escolar">Control Escolar</option>
                  <option value="Jefatura">Jefatura</option>
                  <option value="Dirección General">Dirección General</option>
                  <option value="Dirección Académica">Dirección Académica</option>
                  <option value="Dirección de Vinculación y Extensión">Dirección de Vinculación y Extensión</option>
                  <option value="Subdirección de Servicios Administrativos">Subdirección de Servicios Administrativos</option>
                  <option value="Unidad Jurídica y de Igualdad de Género">Unidad Jurídica y de Igualdad de Género</option>
                  <option value="Unidad de Planeación">Unidad de Planeación</option>
                  <option value="Servicio Social">Servicio Social</option>
                  <option value="Residencia Profesional">Residencia Profesional</option>
                  <option value="Biblioteca">Biblioteca</option>
                </select>
                <div class="invalid-feedback">Selecciona el área del contacto.</div>
              </div>
              <div class="col-12">
                <label for="ncTags" class="form-label">Tags</label>
                <input type="text" class="form-control" id="ncTags" name="tags" maxlength="200" placeholder="urgente, seguimiento, docente">
                <div class="form-text">Separa las etiquetas con comas. Ejemplo: <em>urgente, seguimiento, docente</em></div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="submit" class="btn btn-primary" id="btnGuardarContacto">Guardar contacto</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <script>
    const API = '/prueba/prueba/API/contacts.php';
    const role = document.body.dataset.userRole || 'user';

    function esc(s){ return String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

    async function list(){
      const q = document.getElementById('q').value.trim();
      const area = document.getElementById('areaFilter').value.trim();
      const res = await fetch(`${API}?action=list&q=${encodeURIComponent(q)}&area=${encodeURIComponent(area)}`, { credentials:'same-origin' });
      const data = await res.json();
      if (!data || data.error) return alert(data?.error || 'Error');
      render(data.rows || []);
    }

    function render(rows){
      const tb = document.querySelector('#tbl tbody');
      tb.innerHTML = '';
      rows.forEach(r => {
        const tr = document.createElement('tr');
        tr.dataset.id = r.id;
        tr.innerHTML = `
          <td>${r.id}</td>
          <td><input value="${esc(r.nombre)}" data-k="nombre"></td>
          <td><input value="${esc(r.puesto)}" data-k="puesto"></td>
          <td><input value="${esc(r.correo)}" data-k="correo"></td>
          <td><input value="${esc(r.telefono)}" data-k="telefono"></td>
          <td><input value="${esc(r.area)}" data-k="area"></td>
          <td><input value="${esc(r.tags)}" data-k="tags"></td>
          <td>
            <div class="row-actions">
              <button class="btnx2" data-act="save">Guardar</button>
              <button class="btnx2 danger" data-act="del">Eliminar</button>
            </div>
          </td>
        `;
        tb.appendChild(tr);
      });
      document.getElementById('kpi').textContent = String(rows.length);
    }

    const modalEl = document.getElementById('modalNuevoContacto');
    const modalNuevo = new bootstrap.Modal(modalEl);
    const frmNuevo = document.getElementById('frmNuevoContacto');

    function resetNuevoForm(){
      frmNuevo.reset();
      frmNuevo.classList.remove('was-validated');
      frmNuevo.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
      const defaultArea = document.getElementById('areaFilter').value.trim();
      if (defaultArea) {
        const areaSelect = document.getElementById('ncArea');
        const match = Array.from(areaSelect.options).some(opt => opt.value === defaultArea);
        areaSelect.value = match ? defaultArea : '';
      }
    }

    function openNuevoModal(){
      resetNuevoForm();
      modalNuevo.show();
    }

    modalEl.addEventListener('shown.bs.modal', () => {
      document.getElementById('ncNombre').focus();
    });

    function sanitizeTelefono(value){
      return String(value || '').replace(/\D/g, '').slice(0, 10);
    }

    async function createContact(payload){
      const res = await fetch(`${API}?action=create`, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data?.error) {
        alert(data.error);
        return false;
      }
      return true;
    }

    async function saveRow(tr){
      const id = Number(tr.dataset.id || 0);
      const payload = { id };
      tr.querySelectorAll('input[data-k]').forEach(inp => payload[inp.dataset.k] = inp.value);
      const res = await fetch(`${API}?action=update`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
      const data = await res.json();
      if (data?.error) return alert(data.error);
    }

    async function deleteRow(tr){
      const id = Number(tr.dataset.id || 0);
      if (!confirm(`¿Eliminar contacto #${id}?`)) return;
      const res = await fetch(`${API}?action=delete`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id }) });
      const data = await res.json();
      if (data?.error) return alert(data.error);
      await list();
    }

    document.getElementById('ncTelefono').addEventListener('input', (e) => {
      e.target.value = sanitizeTelefono(e.target.value);
    });

    document.getElementById('ncTelefono').addEventListener('keypress', (e) => {
      if (!/[0-9]/.test(e.key)) e.preventDefault();
    });

    document.getElementById('ncCorreo').addEventListener('blur', (e) => {
      const val = e.target.value.trim();
      e.target.setCustomValidity(val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? 'Correo inválido' : '');
    });

    frmNuevo.addEventListener('submit', async (e) => {
      e.preventDefault();
      frmNuevo.classList.add('was-validated');
      if (!frmNuevo.checkValidity()) return;

      const payload = {
        nombre: document.getElementById('ncNombre').value.trim(),
        puesto: document.getElementById('ncPuesto').value.trim(),
        correo: document.getElementById('ncCorreo').value.trim(),
        telefono: sanitizeTelefono(document.getElementById('ncTelefono').value),
        area: document.getElementById('ncArea').value.trim(),
        tags: document.getElementById('ncTags').value
          .split(',')
          .map(t => t.trim())
          .filter(Boolean)
          .join(', '),
      };

      const btn = document.getElementById('btnGuardarContacto');
      btn.disabled = true;
      btn.textContent = 'Guardando…';

      const ok = await createContact(payload);
      btn.disabled = false;
      btn.textContent = 'Guardar contacto';

      if (!ok) return;
      modalNuevo.hide();
      await list();
    });

    modalEl.addEventListener('hidden.bs.modal', resetNuevoForm);

    document.getElementById('btnReload').onclick = list;
    document.getElementById('btnNew').onclick = openNuevoModal;

    document.querySelector('#tbl tbody').addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-act]');
      if (!btn) return;
      const tr = e.target.closest('tr');
      if (!tr) return;
      if (btn.dataset.act === 'save') saveRow(tr);
      if (btn.dataset.act === 'del') deleteRow(tr);
    });

    list();
  </script>

  <script src="/prueba/prueba/assets/js/psicei-ui.js"></script>
  <script src="/prueba/prueba/assets/js/gemini-ai.js"></script>
</body>
</html>

