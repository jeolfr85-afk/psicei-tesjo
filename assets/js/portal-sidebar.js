(function () {

  'use strict';



  var sidebar = document.getElementById('portal-sidebar');

  var toggle = document.getElementById('sidebar-mobile-toggle');

  var overlay = document.getElementById('sidebar-overlay');



  function setOpen(open) {

    document.body.classList.toggle('sidebar-open', open);

  }



  if (toggle) {

    toggle.addEventListener('click', function () {

      setOpen(!document.body.classList.contains('sidebar-open'));

    });

  }



  if (overlay) {

    overlay.addEventListener('click', function () {

      setOpen(false);

    });

  }



  function toggleGroup(group, btn) {

    if (!group) return;

    var isOpen = group.classList.toggle('is-open');

    if (btn) {

      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

    }

  }



  document.querySelectorAll('.sidebar-toggle-group').forEach(function (btn) {

    btn.addEventListener('click', function () {

      toggleGroup(btn.closest('.sidebar-group'), btn);

    });

  });



  document.querySelectorAll('.sidebar-chevron-link').forEach(function (chevron) {

    chevron.addEventListener('click', function (e) {

      e.preventDefault();

      e.stopPropagation();

      var group = chevron.closest('.sidebar-group');

      var link = chevron.closest('.sidebar-link');

      toggleGroup(group, link);

    });

  });



  document.querySelectorAll('.sidebar-nav a.sidebar-link').forEach(function (link) {

    link.addEventListener('click', function (e) {

      if (e.target.classList.contains('sidebar-chevron-link')) {

        return;

      }

      if (window.innerWidth <= 960) {

        setOpen(false);

      }

    });

  });



  window.addEventListener('resize', function () {

    if (window.innerWidth > 960) {

      setOpen(false);

    }

  });

})();


