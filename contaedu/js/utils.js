/* =========================================
   ContaEdu — Utilidades compartidas
   ========================================= */

const Utils = {

  /* Formatea número como moneda argentina */
  formatARS(num) {
    return '$' + Number(num).toLocaleString('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  },

  /* Genera HTML de badge por rubro */
  badgeRubro(rubro) {
    const map = {
      activo:  { cls: 'badge-activo',  label: 'Activo'  },
      pasivo:  { cls: 'badge-pasivo',  label: 'Pasivo'  },
      pn:      { cls: 'badge-pn',      label: 'Pat. Neto' },
      ingreso: { cls: 'badge-ingreso', label: 'Ingreso' },
      egreso:  { cls: 'badge-egreso',  label: 'Egreso'  },
    };
    const r = map[rubro] || { cls: '', label: rubro };
    return `<span class="badge ${r.cls}">${r.label}</span>`;
  },

  /* HTML de alert */
  alert(tipo, icono, texto) {
    return `<div class="alert alert-${tipo}"><i class="ti ti-${icono}" aria-hidden="true"></i><span>${texto}</span></div>`;
  },

  /* Renderiza selector de ejercicios */
  renderEjSelector(containerId, ejercicios, onSelect) {
    const wrap = document.getElementById(containerId);
    if (!wrap) return;
    wrap.innerHTML = `<div class="ej-grid">` +
      ejercicios.map((ej, i) =>
        `<div class="ej-card" id="${containerId}-ej-${i}" onclick="${onSelect}(${i})">
          <div class="ej-card-title">${ej.titulo}</div>
          <div class="ej-card-sub">${ej.subtitulo}</div>
        </div>`
      ).join('') +
      `</div>`;
  },

  /* Marca ejercicio seleccionado */
  selectEj(containerId, idx) {
    document.querySelectorAll(`#${containerId} .ej-card`).forEach((c, i) => {
      c.classList.toggle('selected', i === idx);
    });
  },

  /* Construye barra de progreso de pasos */
  buildProgress(total, actual) {
    const dots = Array.from({ length: total }, (_, i) => {
      const cls = i < actual ? 'done' : i === actual ? 'active' : '';
      return `<div class="progress-dot ${cls}"></div>`;
    }).join('');
    return `<div class="progress-steps">${dots}<span class="progress-label">Paso ${actual + 1} de ${total}</span></div>`;
  },

  /* IVA 21% */
  calcIVA(neto) {
    return Math.round(neto * 21) / 100;
  },

  /* Comparación numérica con tolerancia */
  numEq(a, b, tol = 0.05) {
    return Math.abs(parseFloat(a || 0) - b) <= tol;
  },
};
