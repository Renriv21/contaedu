/* =========================================
   ContaEdu — Controlador principal v2
   SPA routing + tema + PWA + progreso
   ========================================= */

const App = (() => {

  let tabActual   = 'plan';
  let sidebarOpen = false;
  let darkMode    = false;

  /* ---- INIT ---- */
  function init() {
    darkMode = localStorage.getItem('contaedu-theme') === 'dark';
    applyTheme();

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(reg => console.log('[ContaEdu] SW registrado:', reg.scope))
        .catch(err => console.warn('[ContaEdu] SW error:', err));
    }

    PlanCuentas.init();
    Asientos.init();
    IVA.init();
    Conciliacion.init();
    Mayor.init();

    // Sincronizar botones de modo de estudio
    syncStudyModeButtons(Progreso.getModoEstudio());

    // Mostrar progreso guardado en sidebar
    refrescarProgreso();

    // Restaurar tab desde URL hash
    const hash = window.location.hash.replace('#', '');
    if (['plan','asientos','iva','concil','mayor'].includes(hash)) {
      const btn = document.querySelector(`[data-tab="${hash}"]`);
      showTab(hash, btn, false);
    }

    window.addEventListener('hashchange', () => {
      const h = window.location.hash.replace('#', '');
      const b = document.querySelector(`[data-tab="${h}"]`);
      if (b) showTab(h, b, false);
    });

    console.log('[ContaEdu] App iniciada ✓');
  }

  /* ---- NAVEGACIÓN SPA ---- */
  function showTab(id, btn, pushState = true) {
    document.getElementById(`tab-${tabActual}`)?.classList.remove('active');
    document.querySelector('.nav-item.active')?.classList.remove('active');

    tabActual = id;
    document.getElementById(`tab-${id}`)?.classList.add('active');
    if (btn) btn.classList.add('active');

    if (pushState) history.pushState(null, '', `#${id}`);
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
    document.querySelectorAll('.mode-toggle .ti, .mode-toggle-mobile').forEach(el => {
      el.className = el.className.replace(/ti-[a-z-]+/, darkMode ? 'ti-sun' : 'ti-moon');
    });
    document.querySelectorAll('.mode-toggle span').forEach(el => {
      el.textContent = darkMode ? 'Modo claro' : 'Modo oscuro';
    });
  }

  /* ---- PROGRESO ---- */
  function refrescarProgreso() {
    const modulos = [
      { id: 'plan',     label: 'Plan de Cuentas' },
      { id: 'asientos', label: 'Asientos'         },
      { id: 'iva',      label: 'IVA'              },
      { id: 'concil',   label: 'Conciliación'     },
      { id: 'mayor',    label: 'Libro Mayor'      },
    ];

    modulos.forEach(m => {
      const total       = Progreso.TOTALES[m.id];
      const completados = Progreso.contarModulo(m.id);

      /* 1. Badge en nav-item */
      const btn = document.querySelector(`[data-tab="${m.id}"]`);
      if (btn) {
        btn.querySelector('.progreso-badge')?.remove();
        if (completados > 0) {
          const badge = document.createElement('span');
          badge.className = 'progreso-badge';
          if (completados === total) {
            badge.innerHTML = `<i class="ti ti-check" aria-hidden="true"></i>`;
            badge.style.cssText = 'font-size:14px;color:#4ADE80';
          } else {
            badge.textContent = `${completados}/${total}`;
            badge.style.cssText = 'font-size:10px;background:rgba(255,255,255,0.15);color:#fff;padding:2px 7px;border-radius:10px;font-family:var(--font-mono)';
          }
          btn.appendChild(badge);
        }
      }

      /* 2. Panel de progreso */
      const spanEl = document.getElementById(`sp-${m.id}`);
      if (spanEl) {
        const fila = spanEl.closest('.sp-fila');
        if (completados === 0) {
          spanEl.textContent = '—';
          fila?.classList.remove('completo');
        } else if (completados === total) {
          spanEl.innerHTML = `<i class="ti ti-check" aria-hidden="true"></i> Completo`;
          fila?.classList.add('completo');
        } else {
          spanEl.textContent = `${completados}/${total}`;
          fila?.classList.remove('completo');
        }
      }
    });

    /* 3. Barra de progreso global */
    const pct = Progreso.porcentajeGlobal();
    let barraWrap = document.getElementById('sp-barra-wrap');
    if (!barraWrap) {
      // Crear barra si no existe aún
      const panel = document.getElementById('sidebar-progreso');
      if (panel) {
        barraWrap = document.createElement('div');
        barraWrap.id = 'sp-barra-wrap';
        barraWrap.className = 'sp-barra-wrap';
        barraWrap.innerHTML = `<div class="sp-barra" id="sp-barra" style="width:0%"></div>`;
        // Insertar antes del botón reset
        const resetBtn = panel.querySelector('.sp-reset');
        if (resetBtn) panel.insertBefore(barraWrap, resetBtn);
        else panel.appendChild(barraWrap);
      }
    }
    const barra = document.getElementById('sp-barra');
    if (barra) barra.style.width = `${pct}%`;
  }

  function switchStudyMode(modo) {
    const modoActual = Progreso.getModoEstudio();
    if (modo === modoActual) return;

    Progreso.setModoEstudio(modo);
    syncStudyModeButtons(modo);

    // Reiniciar módulos para limpiar estado
    PlanCuentas.init();
    Asientos.init();
    IVA.init();
    Conciliacion.init();
    Mayor.init();

    refrescarProgreso();
  }

  function syncStudyModeButtons(modo) {
    const btnP = document.getElementById('sms-practica');
    const btnE = document.getElementById('sms-evaluacion');
    if (modo === 'evaluacion') {
      btnP?.classList.remove('active');
      btnE?.classList.add('active');
    } else {
      btnE?.classList.remove('active');
      btnP?.classList.add('active');
    }
  }

  return { init, showTab, toggleSidebar, toggleTheme, refrescarProgreso, switchStudyMode };

})();

document.addEventListener('DOMContentLoaded', App.init);
