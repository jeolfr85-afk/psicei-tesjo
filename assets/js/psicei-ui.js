(() => {
  'use strict';

  // Tiny progressive enhancements (safe on any page)
  // - Make tables scrollable on mobile
  // - Provide quick filter if a #ps-table-filter exists

  function enhanceTables() {
    document.querySelectorAll('table').forEach((t) => {
      if (t.closest('.ps-scroll')) return;
      const wrap = document.createElement('div');
      wrap.className = 'ps-scroll';
      t.parentNode?.insertBefore(wrap, t);
      wrap.appendChild(t);
    });
  }

  function attachFilter() {
    const input = document.getElementById('ps-table-filter');
    const table = document.querySelector('table');
    if (!input || !table) return;

    input.addEventListener('input', () => {
      const q = (input.value || '').toLowerCase().trim();
      table.querySelectorAll('tbody tr').forEach((tr) => {
        const text = (tr.textContent || '').toLowerCase();
        tr.style.display = q === '' || text.includes(q) ? '' : 'none';
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    enhanceTables();
    attachFilter();
  });
})();

