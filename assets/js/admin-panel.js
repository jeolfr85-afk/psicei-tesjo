(function () {
  'use strict';

  const users = Array.isArray(window.PSICEI_USERS) ? window.PSICEI_USERS : [];
  const allowedAreas = Array.isArray(window.PSICEI_ALLOWED_AREAS) ? window.PSICEI_ALLOWED_AREAS : [];
  const selectedId = Number(window.PSICEI_SELECTED_ID || 0);

  if (!users.length) return;

  const list = document.getElementById('userList');
  const search = document.getElementById('userSearch');
  const form = document.getElementById('editUserForm');
  const deleteForm = document.getElementById('deleteUserForm');
  const btnDelete = document.getElementById('btnDeleteUser');

  const fields = {
    id: document.getElementById('editar_id'),
    nombre: document.getElementById('edit_nombre'),
    apellido: document.getElementById('edit_apellido'),
    correo: document.getElementById('edit_correo'),
    usuario: document.getElementById('edit_usuario'),
    telefono: document.getElementById('edit_telefono'),
    role: document.getElementById('edit_role'),
    password: document.getElementById('edit_password'),
    subarea: document.getElementById('edit_subarea'),
    subareaNotes: document.getElementById('edit_subarea_notes'),
    areaSelect: document.getElementById('edit_area_select'),
    areaInput: document.getElementById('edit_area_input'),
    areaHint: document.getElementById('areaHint'),
    subareaWrap: document.getElementById('subareaFieldWrap'),
  };

  const head = {
    avatar: document.getElementById('editAvatar'),
    title: document.getElementById('editTitle'),
    subtitle: document.getElementById('editSubtitle'),
    idBadge: document.getElementById('editIdBadge'),
  };

  function initials(user) {
    const n = (user.Nombre || 'U').trim().charAt(0);
    const a = (user.Apellido_Paterno || '').trim().charAt(0);
    return (n + a).toUpperCase();
  }

  function areaShort(area) {
    if (area === 'Dirección Académica') return 'Académica';
    if (area === 'Dirección de Vinculación y Extensión') return 'Vinculación';
    return area || '—';
  }

  function findUser(id) {
    return users.find((u) => Number(u.id) === Number(id));
  }

  function setActiveListItem(id) {
    document.querySelectorAll('.user-list-item').forEach((btn) => {
      const active = Number(btn.dataset.userId) === Number(id);
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  }

  function toggleAreaFields(isAdmin) {
    if (isAdmin) {
      fields.areaSelect.hidden = true;
      fields.areaSelect.removeAttribute('name');
      fields.areaInput.hidden = false;
      fields.areaInput.setAttribute('name', 'area');
      fields.areaHint.hidden = true;
      fields.subareaWrap.hidden = false;
    } else {
      fields.areaSelect.hidden = false;
      fields.areaSelect.setAttribute('name', 'area');
      fields.areaInput.hidden = true;
      fields.areaInput.removeAttribute('name');
      fields.areaHint.hidden = false;
      fields.subareaWrap.hidden = true;
      fields.subarea.value = '';
    }
  }

  function loadUser(id) {
    const user = findUser(id);
    if (!user || !form) return;

    const isAdmin = user.role === 'admin';

    fields.id.value = user.id;
    fields.nombre.value = user.Nombre || '';
    fields.apellido.value = user.Apellido_Paterno || '';
    fields.correo.value = user.Correo_Institucional || '';
    fields.usuario.value = user.Nombre_Usuario || '';
    fields.telefono.value = user.Numero_de_telefono || '';
    fields.role.value = user.role || 'user';
    fields.password.value = '';

    fields.areaSelect.value = user.Area || allowedAreas[0] || '';
    fields.areaInput.value = user.Area || '';
    fields.subarea.value = '';
    if (fields.subareaNotes) {
      fields.subareaNotes.value = user.Subarea || '';
    }

    toggleAreaFields(isAdmin);

    if (head.avatar) head.avatar.textContent = initials(user);
    if (head.title) head.title.textContent = '@' + (user.Nombre_Usuario || '');
    if (head.subtitle) {
      head.subtitle.textContent = ((user.Nombre || '') + ' ' + (user.Apellido_Paterno || '')).trim();
    }
    if (head.idBadge) head.idBadge.textContent = 'ID ' + user.id;

    if (btnDelete) {
      if (isAdmin) {
        btnDelete.disabled = true;
        btnDelete.textContent = 'Protegido';
        btnDelete.title = 'No se puede eliminar al administrador';
      } else {
        btnDelete.disabled = false;
        btnDelete.textContent = 'Eliminar';
        btnDelete.title = '';
      }
    }

    setActiveListItem(id);

    const url = new URL(window.location.href);
    url.searchParams.set('id', String(id));
    history.replaceState(null, '', url.pathname + url.search);
  }

  function filterList(query) {
    const q = query.trim().toLowerCase();
    document.querySelectorAll('.user-list-item').forEach((btn) => {
      const id = btn.dataset.userId;
      const user = findUser(id);
      if (!user) return;
      const haystack = [
        user.Nombre,
        user.Apellido_Paterno,
        user.Nombre_Usuario,
        user.Correo_Institucional,
        user.Area,
      ].join(' ').toLowerCase();
      const row = btn.closest('li');
      if (row) row.hidden = q !== '' && !haystack.includes(q);
    });
  }

  if (list) {
    list.addEventListener('click', (e) => {
      const btn = e.target.closest('.user-list-item');
      if (!btn) return;
      loadUser(btn.dataset.userId);
    });
  }

  if (search) {
    search.addEventListener('input', () => filterList(search.value));
  }

  if (fields.role) {
    fields.role.addEventListener('change', () => {
      toggleAreaFields(fields.role.value === 'admin');
    });
  }

  if (form) {
    form.addEventListener('submit', () => {
      if (fields.role.value === 'admin' && fields.subareaNotes) {
        fields.subarea.value = fields.subareaNotes.value;
      }
    });
  }

  if (btnDelete && deleteForm) {
    btnDelete.addEventListener('click', () => {
      const id = fields.id.value;
      const user = findUser(id);
      if (!user || user.role === 'admin') return;
      if (!confirm('¿Eliminar al usuario @' + user.Nombre_Usuario + '?')) return;
      document.getElementById('eliminar_id').value = id;
      deleteForm.submit();
    });
  }

  loadUser(selectedId || users[0].id);
})();
