/* =========================================
   ContaEdu — Controlador principal (SPA)
   ========================================= */

const App = (() => {

  /* ---- ESTADO ---- */
  let tabActual = 'plan';
  let sidebarOpen = false;
  let darkMode = false;

  /* ---- INIT ---- */
  function init() {
    // Cargar preferencia de tema
    darkMode = localStorage.getItem('contaedu-theme') === 'dark';
    applyTheme();

    // Registrar Service Worker (PWA)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(reg => console.log('[ContaEdu] SW registrado:', reg.scope))
        .catch(err => console.warn('[ContaEdu] SW error:', err));
    }

    // Inicializar todos los módulos
    PlanCuentas.init();
    Asientos.init();
    IVA.init();
    Conciliacion.init();

    // Restaurar tab desde URL hash
    const hash = window.location.hash.replace('#', '');
    if (['plan','asientos','iva','concil'].includes(hash)) {
      const btn = document.querySelector(`[data-tab="${hash}"]`);
      showTab(hash, btn);
    }

    // Escuchar cambios de hash (back/forward del browser)
    window.addEventListener('hashchange', () => {
      const h = window.location.hash.replace('#', '');
      const b = document.querySelector(`[data-tab="${h}"]`);
      if (b) showTab(h, b, false);
    });

    console.log('[ContaEdu] App iniciada ✓');
  }

  /* ---- NAVEGACIÓN SPA ---- */
  function showTab(id, btn, pushState = true) {
    // Ocultar panel actual
    document.getElementById(`tab-${tabActual}`)?.classList.remove('active');
    document.querySelector('.nav-item.active')?.classList.remove('active');

    // Mostrar nuevo panel
    tabActual = id;
    document.getElementById(`tab-${id}`)?.classList.add('active');
    if (btn) btn.classList.add('active');

    // Actualizar URL (sin recargar)
    if (pushState) {
      history.pushState(null, '', `#${id}`);
    }

    // Cerrar sidebar en mobile
    if (window.innerWidth <= 768) closeSidebar();
  }

  /* ---- SIDEBAR (mobile) ---- */
  function toggleSidebar() {
    sidebarOpen ? closeSidebar() : openSidebar();
  }

  function openSidebar() {
    sidebarOpen = true;
    document.getElementById('sidebar')?.classList.add('open');
    document.getElementById('overlay')?.classList.add('active');
  }

  function closeSidebar() {
    sidebarOpen = false;
    document.getElementById('sidebar')?.classList.remove('open');
    document.getElementById('overlay')?.classList.remove('active');
  }

  /* ---- TEMA ---- */
  function toggleTheme() {
    darkMode = !darkMode;
    applyTheme();
    localStorage.setItem('contaedu-theme', darkMode ? 'dark' : 'light');
  }

  function applyTheme() {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    // Actualizar ícono y label del botón
    const iconos = document.querySelectorAll('.mode-toggle .ti, .mode-toggle-mobile');
    iconos.forEach(el => {
      el.className = el.className.replace(/ti-[a-z-]+/, darkMode ? 'ti-sun' : 'ti-moon');
    });
    const labels = document.querySelectorAll('.mode-toggle span');
    labels.forEach(el => { el.textContent = darkMode ? 'Modo claro' : 'Modo oscuro'; });
  }

  /* ---- API PÚBLICA ---- */
  return { init, showTab, toggleSidebar, toggleTheme };

})();

/* ---- ARRANCAR cuando el DOM esté listo ---- */
document.addEventListener('DOMContentLoaded', App.init);
