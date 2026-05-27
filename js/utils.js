/* =========================================
   ContaEdu — Utilidades compartidas v2
   ========================================= */

const Utils = {

  formatARS(num) {
    return '$' + Number(num).toLocaleString('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  },

  badgeRubro(rubro) {
    const map = {
      activo:  { cls: 'badge-activo',  label: 'Activo'    },
      pasivo:  { cls: 'badge-pasivo',  label: 'Pasivo'    },
      pn:      { cls: 'badge-pn',      label: 'Pat. Neto' },
      ingreso: { cls: 'badge-ingreso', label: 'Ingreso'   },
      egreso:  { cls: 'badge-egreso',  label: 'Egreso'    },
    };
    const r = map[rubro] || { cls: '', label: rubro };
    return `<span class="badge ${r.cls}">${r.label}</span>`;
  },

  alert(tipo, icono, texto) {
    return `<div class="alert alert-${tipo}"><i class="ti ti-${icono}" aria-hidden="true"></i><span>${texto}</span></div>`;
  },

  buildProgress(total, actual) {
    const dots = Array.from({ length: total }, (_, i) => {
      const cls = i < actual ? 'done' : i === actual ? 'active' : '';
      return `<div class="progress-dot ${cls}"></div>`;
    }).join('');
    return `<div class="progress-steps">${dots}<span class="progress-label">Paso ${actual + 1} de ${total}</span></div>`;
  },

  calcIVA(neto) {
    return Math.round(neto * 21) / 100;
  },

  numEq(a, b, tol = 0.05) {
    return Math.abs(parseFloat(a || 0) - b) <= tol;
  },
};

/* =========================================
   PROGRESO DEL ALUMNO — localStorage
   ========================================= */
const Progreso = {

  CLAVE: 'contaedu-progreso',

  /* Totales de ejercicios por módulo */
  TOTALES: {
    plan:     2,
    asientos: 3,
    iva:      3,
    concil:   2,
    mayor:    2,
  },

  /* Carga todo el progreso guardado */
  cargar() {
    try {
      return JSON.parse(localStorage.getItem(this.CLAVE)) || {};
    } catch {
      return {};
    }
  },

  /* Guarda todo el progreso */
  guardar(data) {
    try {
      localStorage.setItem(this.CLAVE, JSON.stringify(data));
    } catch (e) {
      console.warn('[Progreso] No se pudo guardar:', e);
    }
  },

  /* Marca un ejercicio como completado */
  completar(modulo, ejIdx) {
    const data = this.cargar();
    if (!data[modulo]) data[modulo] = {};
    // Solo registra si no estaba ya marcado
    if (!data[modulo][ejIdx]?.completado) {
      data[modulo][ejIdx] = {
        completado: true,
        fecha: new Date().toLocaleDateString('es-AR'),
        hora:  new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
      };
      this.guardar(data);
    }
  },

  /* Verifica si un ejercicio está completado */
  estaCompleto(modulo, ejIdx) {
    const data = this.cargar();
    return data[modulo]?.[ejIdx]?.completado === true;
  },

  /* Cuántos ejercicios completó en un módulo */
  contarModulo(modulo) {
    const data  = this.cargar();
    const mod   = data[modulo] || {};
    return Object.values(mod).filter(e => e.completado).length;
  },

  /* Porcentaje global (0-100) */
  porcentajeGlobal() {
    const totalEjs = Object.values(this.TOTALES).reduce((s, n) => s + n, 0);
    let completados = 0;
    Object.keys(this.TOTALES).forEach(m => {
      completados += this.contarModulo(m);
    });
    return totalEjs > 0 ? Math.round((completados / totalEjs) * 100) : 0;
  },

  /* Borra todo el progreso */
  resetear() {
    localStorage.removeItem(this.CLAVE);
  },
};
