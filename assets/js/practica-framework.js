(function () {
  'use strict';

  const API = '/prueba/prueba/API/contacts.php';
  const area = (document.body?.dataset?.userArea || '').trim();

  // Objeto de reglas para validación en vivo (objetos + arreglos + control flow)
  const validators = {
    nombre: [
      { test: (v) => v.length >= 5, message: 'Mínimo 5 caracteres.' },
      { test: (v) => /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s.]+$/.test(v), message: 'Solo letras y espacios.' }
    ],
    correo: [
      { test: (v) => v.length > 0, message: 'El correo es obligatorio.' },
      { test: (v) => /^[a-zA-Z0-9._%+-]+@tesjo\.edu\.mx$/.test(v), message: 'Debe terminar en @tesjo.edu.mx.' }
    ],
    telefono: [
      { test: (v) => /^\d{10}$/.test(v), message: 'Debe tener 10 dígitos.' }
    ],
    puesto: [
      { test: (v) => v.length > 0, message: 'Selecciona un puesto.' }
    ]
  };

  function showMessage(type, text) {
    const box = $('#msgBox');
    box.removeClass('d-none alert-success alert-danger').addClass(type === 'ok' ? 'alert-success' : 'alert-danger');
    box.text(text);
  }

  function clearFieldError(field) {
    $(`[data-error="${field}"]`).text('');
    $(`#${field}`).removeClass('is-invalid');
  }

  function setFieldError(field, text) {
    $(`[data-error="${field}"]`).text(text);
    $(`#${field}`).addClass('is-invalid');
  }

  function validateField(field, value) {
    clearFieldError(field);
    const rules = validators[field] || [];
    for (let i = 0; i < rules.length; i++) {
      if (!rules[i].test(value)) {
        setFieldError(field, rules[i].message);
        return false;
      }
    }
    return true;
  }

  function getFormData() {
    return {
      nombre: $('#nombre').val().trim(),
      correo: $('#correo').val().trim().toLowerCase(),
      telefono: $('#telefono').val().trim(),
      puesto: $('#puesto').val().trim(),
      tags: $('#tags').val().trim(),
      area: area
    };
  }

  function validateForm(data) {
    let valid = true;
    const fields = ['nombre', 'correo', 'telefono', 'puesto'];
    fields.forEach((field) => {
      if (!validateField(field, data[field] || '')) valid = false;
    });
    return valid;
  }

  function renderRows(rows) {
    const body = $('#tbContactos');
    body.empty();

    if (!rows.length) {
      body.append('<tr><td colspan="6" class="text-muted">Sin resultados.</td></tr>');
      return;
    }

    rows.forEach((r) => {
      const tr = $(`
        <tr data-id="${r.id}">
          <td>${r.id}</td>
          <td>${(r.nombre || '').replace(/</g, '&lt;')}</td>
          <td>${(r.correo || '').replace(/</g, '&lt;')}</td>
          <td>${(r.telefono || '').replace(/</g, '&lt;')}</td>
          <td>${(r.puesto || '').replace(/</g, '&lt;')}</td>
          <td class="row-actions">
            <button class="btn btn-sm btn-outline-danger btn-del">Eliminar</button>
          </td>
        </tr>
      `);
      body.append(tr);
    });
  }

  async function loadStats() {
    const res = await fetch(`${API}?action=stats&area=${encodeURIComponent(area)}`);
    const data = await res.json();
    if (data.ok) {
      const inArea = Array.isArray(data.by_area)
        ? data.by_area.reduce((acc, item) => acc + (item.label === area ? Number(item.count || 0) : 0), 0)
        : 0;
      $('#kpiTotal').text(Number(data.total || 0));
      $('#kpiArea').text(inArea);
    }
  }

  async function loadRows() {
    const q = $('#txtBuscar').val().trim();
    const url = `${API}?action=list&area=${encodeURIComponent(area)}&q=${encodeURIComponent(q)}&limit=120`;
    const res = await fetch(url);
    const data = await res.json();
    const rows = Array.isArray(data.rows) ? data.rows : [];
    renderRows(rows);
    $('#kpiFiltro').text(rows.length);
  }

  async function createContact(payload) {
    const res = await fetch(`${API}?action=create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  }

  async function deleteContact(id) {
    const res = await fetch(`${API}?action=delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    return res.json();
  }

  function bindEvents() {
    // Validación en tiempo real
    ['nombre', 'correo', 'telefono', 'puesto'].forEach((field) => {
      $(`#${field}`).on('input change blur', function () {
        validateField(field, $(this).val().trim());
      });
    });

    $('#frmContacto').on('submit', async function (e) {
      e.preventDefault();
      const payload = getFormData();
      if (!validateForm(payload)) {
        showMessage('error', 'Corrige los campos marcados.');
        return;
      }

      const data = await createContact(payload);
      if (data.ok) {
        showMessage('ok', 'Contacto guardado sin recargar la página.');
        $('#frmContacto')[0].reset();
        ['nombre', 'correo', 'telefono', 'puesto'].forEach(clearFieldError);
        await loadRows();
        await loadStats();
      } else {
        showMessage('error', data.error || 'No se pudo guardar.');
      }
    });

    $('#btnLimpiar').on('click', function () {
      $('#frmContacto')[0].reset();
      ['nombre', 'correo', 'telefono', 'puesto'].forEach(clearFieldError);
      $('#msgBox').addClass('d-none');
    });

    $('#btnRefrescar').on('click', async function () {
      await loadRows();
      await loadStats();
    });

    $('#txtBuscar').on('input', function () {
      // actualización dinámica sin recarga
      loadRows();
    });

    $('#tbContactos').on('click', '.btn-del', async function () {
      const id = Number($(this).closest('tr').data('id'));
      if (!id) return;
      if (!window.confirm(`¿Eliminar contacto #${id}?`)) return;
      const data = await deleteContact(id);
      if (data.ok) {
        showMessage('ok', 'Contacto eliminado.');
        await loadRows();
        await loadStats();
      } else {
        showMessage('error', data.error || 'No se pudo eliminar.');
      }
    });
  }

  async function init() {
    bindEvents();
    await loadRows();
    await loadStats();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
