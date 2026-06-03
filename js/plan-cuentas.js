/* =========================================
   ContaEdu — Módulo: Plan de Cuentas v2
   ========================================= */

const PlanCuentas = (() => {

  const MODULO = 'plan';

  const CUENTAS_BASE = [
    { cod: '1.1.01', nombre: 'Caja',                       rubro: 'activo'  },
    { cod: '1.1.02', nombre: 'Banco cuenta corriente',     rubro: 'activo'  },
    { cod: '1.1.03', nombre: 'Clientes',                   rubro: 'activo'  },
    { cod: '1.1.04', nombre: 'Mercaderías',                rubro: 'activo'  },
    { cod: '1.2.01', nombre: 'Rodados',                    rubro: 'activo'  },
    { cod: '1.2.02', nombre: 'Muebles y útiles',           rubro: 'activo'  },
    { cod: '2.1.01', nombre: 'Proveedores',                rubro: 'pasivo'  },
    { cod: '2.1.02', nombre: 'Sueldos a pagar',            rubro: 'pasivo'  },
    { cod: '2.2.01', nombre: 'Préstamo bancario LP',       rubro: 'pasivo'  },
    { cod: '3.1.01', nombre: 'Capital',                    rubro: 'pn'      },
    { cod: '3.1.02', nombre: 'Resultados acumulados',      rubro: 'pn'      },
    { cod: '4.1.01', nombre: 'Ventas',                     rubro: 'ingreso' },
    { cod: '4.1.02', nombre: 'Intereses ganados',          rubro: 'ingreso' },
    { cod: '5.1.01', nombre: 'Costo mercaderías vendidas', rubro: 'egreso'  },
    { cod: '5.1.02', nombre: 'Sueldos y jornales',         rubro: 'egreso'  },
    { cod: '5.1.03', nombre: 'Alquileres pagados',         rubro: 'egreso'  },
  ];

  let cuentas = [...CUENTAS_BASE];

  const EJERCICIOS = [
    {
      titulo: 'Clasificar 8 cuentas',
      subtitulo: '⭐ Básico — Identificá el rubro correcto',
      items: [
        { cod: '1.1.01', nombre: 'Caja',               rubro: 'activo',  pista: 'Los billetes y monedas son bienes de la empresa.' },
        { cod: '2.1.01', nombre: 'Proveedores',         rubro: 'pasivo',  pista: 'Deuda comercial = obligación = Pasivo.' },
        { cod: '1.2.01', nombre: 'Rodados',             rubro: 'activo',  pista: 'Un vehículo es un bien de uso (activo no corriente).' },
        { cod: '3.1.01', nombre: 'Capital',             rubro: 'pn',      pista: 'Aporte del dueño = Patrimonio Neto.' },
        { cod: '4.1.01', nombre: 'Ventas',              rubro: 'ingreso', pista: 'Ingresos por la actividad principal.' },
        { cod: '5.1.02', nombre: 'Sueldos y jornales',  rubro: 'egreso',  pista: 'Costo laboral = Egreso.' },
        { cod: '1.1.02', nombre: 'Banco cta. cte.',     rubro: 'activo',  pista: 'El saldo bancario es un derecho de la empresa.' },
        { cod: '2.2.01', nombre: 'Préstamo bancario LP', rubro: 'pasivo', pista: 'Deuda a largo plazo con el banco.' },
      ],
    },
    {
      titulo: 'Asignar códigos',
      subtitulo: '⭐ Básico — Elegí el rubro de cada cuenta',
      items: [
        { cod: '1.1.03', nombre: 'Clientes',              rubro: 'activo',  pista: 'Derechos a cobrar: Activo corriente → 1.1.xx' },
        { cod: '1.2.02', nombre: 'Muebles y útiles',      rubro: 'activo',  pista: 'Bien de uso: Activo no corriente → 1.2.xx' },
        { cod: '2.1.02', nombre: 'Sueldos a pagar',       rubro: 'pasivo',  pista: 'Deuda laboral corriente → 2.1.xx' },
        { cod: '3.1.02', nombre: 'Resultados acumulados', rubro: 'pn',      pista: 'Ganancias no distribuidas → 3.1.xx' },
        { cod: '4.1.02', nombre: 'Intereses ganados',     rubro: 'ingreso', pista: 'Ingreso financiero → 4.1.xx' },
        { cod: '5.1.03', nombre: 'Alquileres pagados',    rubro: 'egreso',  pista: 'Gasto operativo → 5.1.xx' },
      ],
    },
    {
      titulo: 'Corrientes vs No corrientes',
      subtitulo: '⭐⭐ Intermedio — Activos y Pasivos por plazo',
      items: [
        { cod: '1.1.04', nombre: 'Mercaderías',             rubro: 'activo',  pista: 'Bienes para vender: Activo corriente.' },
        { cod: '1.1.05', nombre: 'Deudores por ventas',     rubro: 'activo',  pista: 'Crédito comercial a corto plazo: Activo corriente.' },
        { cod: '1.2.03', nombre: 'Inmuebles',               rubro: 'activo',  pista: 'Bienes de uso de larga vida: Activo no corriente.' },
        { cod: '2.1.03', nombre: 'Anticipos de clientes',   rubro: 'pasivo',  pista: 'Cobro adelantado a devolver/entregar: Pasivo corriente.' },
        { cod: '2.2.02', nombre: 'Hipoteca bancaria',       rubro: 'pasivo',  pista: 'Deuda garantizada con inmueble a largo plazo.' },
        { cod: '5.1.04', nombre: 'Amortizaciones',          rubro: 'egreso',  pista: 'Desgaste de bienes de uso: Egreso.' },
        { cod: '4.1.03', nombre: 'Alquileres cobrados',     rubro: 'ingreso', pista: 'Ingreso por ceder el uso de un bien.' },
        { cod: '3.1.03', nombre: 'Reserva legal',           rubro: 'pn',      pista: 'Ganancia retenida por ley: Patrimonio Neto.' },
      ],
    },
    {
      titulo: 'Empresa de servicios',
      subtitulo: '⭐⭐ Intermedio — Cuentas de consultora',
      items: [
        { cod: '1.1.06', nombre: 'Honorarios a cobrar',     rubro: 'activo',  pista: 'Servicio prestado y aún no cobrado: Activo corriente.' },
        { cod: '1.1.07', nombre: 'Gastos pagados por anticipado', rubro: 'activo', pista: 'Gasto que beneficia períodos futuros: Activo corriente.' },
        { cod: '2.1.04', nombre: 'Honorarios a pagar',      rubro: 'pasivo',  pista: 'Servicio recibido y aún no pagado: Pasivo corriente.' },
        { cod: '4.1.04', nombre: 'Honorarios ganados',      rubro: 'ingreso', pista: 'Ingreso por prestación de servicios profesionales.' },
        { cod: '5.1.05', nombre: 'Viáticos',                rubro: 'egreso',  pista: 'Gastos de viaje del personal: Egreso operativo.' },
        { cod: '5.1.06', nombre: 'Servicios públicos',      rubro: 'egreso',  pista: 'Luz, gas, internet: Egreso operativo.' },
        { cod: '3.1.01', nombre: 'Capital social',          rubro: 'pn',      pista: 'Aportes de los socios.' },
        { cod: '5.1.07', nombre: 'Impuestos y tasas',       rubro: 'egreso',  pista: 'Cargas fiscales de la empresa: Egreso.' },
      ],
    },
    {
      titulo: 'Empresa industrial',
      subtitulo: '⭐⭐⭐ Avanzado — Manufactura',
      items: [
        { cod: '1.1.08', nombre: 'Materias primas',         rubro: 'activo',  pista: 'Materiales para producir: Activo corriente.' },
        { cod: '1.1.09', nombre: 'Productos en proceso',    rubro: 'activo',  pista: 'Producción comenzada, no terminada: Activo corriente.' },
        { cod: '1.1.10', nombre: 'Productos terminados',    rubro: 'activo',  pista: 'Bienes listos para vender: Activo corriente.' },
        { cod: '1.2.04', nombre: 'Maquinaria y equipo',     rubro: 'activo',  pista: 'Bien de uso productivo: Activo no corriente.' },
        { cod: '5.1.08', nombre: 'Costo de producción',     rubro: 'egreso',  pista: 'Materiales + mano de obra + gastos fab.' },
        { cod: '2.1.05', nombre: 'Proveedores de MP',       rubro: 'pasivo',  pista: 'Deuda por compra de materias primas.' },
        { cod: '4.1.05', nombre: 'Ventas de productos',     rubro: 'ingreso', pista: 'Ingresos por ventas de fabricación propia.' },
        { cod: '1.2.05', nombre: 'Amort. acum. maquinaria', rubro: 'activo',  pista: 'Cuenta regularizadora (resta del activo): va dentro de Activo como valor negativo.' },
      ],
    },
    {
      titulo: 'Casos difíciles',
      subtitulo: '⭐⭐⭐ Avanzado — Cuentas que confunden',
      items: [
        { cod: '1.1.11', nombre: 'Documentos a cobrar',     rubro: 'activo',  pista: 'Pagaré recibido de un cliente: Activo corriente.' },
        { cod: '2.1.06', nombre: 'Documentos a pagar',      rubro: 'pasivo',  pista: 'Pagaré firmado a favor de un proveedor: Pasivo corriente.' },
        { cod: '1.2.06', nombre: 'Llave de negocio',        rubro: 'activo',  pista: 'Bien intangible (activo no corriente intangible).' },
        { cod: '3.1.04', nombre: 'Resultado del ejercicio', rubro: 'pn',      pista: 'Ganancia/pérdida del período: Patrimonio Neto.' },
        { cod: '4.1.06', nombre: 'Diferencia de cambio (+)',rubro: 'ingreso', pista: 'Ganancia por tipo de cambio: Ingreso financiero.' },
        { cod: '5.1.09', nombre: 'Diferencia de cambio (-)',rubro: 'egreso',  pista: 'Pérdida por tipo de cambio: Egreso financiero.' },
        { cod: '2.2.03', nombre: 'Debentures emitidos',     rubro: 'pasivo',  pista: 'Títulos de deuda emitidos por la empresa: Pasivo no corriente.' },
        { cod: '1.1.12', nombre: 'IVA Crédito Fiscal',      rubro: 'activo',  pista: 'IVA de compras: Activo (crédito contra AFIP).' },
      ],
    },
  ];

  let innerTab  = 'plan';
  let ejActual  = 0;
  let ejState   = [];
  let evaluada  = false;

  /* ---- RENDER PRINCIPAL ---- */
  function render() {
    const root = document.getElementById('plan-root');
    if (!root) return;
    root.innerHTML = `
      <div class="panel-body">
        <div class="inner-tabs">
          <button class="inner-tab ${innerTab === 'plan'      ? 'active' : ''}" onclick="PlanCuentas.switchTab('plan')">
            <i class="ti ti-list" aria-hidden="true"></i> Ver plan
          </button>
          <button class="inner-tab ${innerTab === 'agregar'   ? 'active' : ''}" onclick="PlanCuentas.switchTab('agregar')">
            <i class="ti ti-plus" aria-hidden="true"></i> Agregar cuenta
          </button>
          <button class="inner-tab ${innerTab === 'ejercicio' ? 'active' : ''}" onclick="PlanCuentas.switchTab('ejercicio')">
            <i class="ti ti-school" aria-hidden="true"></i> Ejercicios guiados
          </button>
        </div>
        <div id="plan-inner"></div>
      </div>`;
    renderInner();
  }

  function renderInner() {
    const el = document.getElementById('plan-inner');
    if (!el) return;
    if (innerTab === 'plan')      el.innerHTML = renderVerPlan();
    if (innerTab === 'agregar')   el.innerHTML = renderAgregar();
    if (innerTab === 'ejercicio') el.innerHTML = renderEjercicio();
  }

  /* ---- VER PLAN ---- */
  function renderVerPlan() {
    const filas = cuentas.map(c => `
      <tr>
        <td><code>${c.cod}</code></td>
        <td style="font-weight:500">${c.nombre}</td>
        <td>${Utils.badgeRubro(c.rubro)}</td>
      </tr>`).join('');
    return `
      <div class="card" style="padding:0">
        <div class="table-wrap">
          <table>
            <thead><tr><th>Código</th><th>Nombre de la cuenta</th><th>Rubro</th></tr></thead>
            <tbody>${filas}</tbody>
          </table>
        </div>
      </div>`;
  }

  /* ---- AGREGAR CUENTA ---- */
  function renderAgregar() {
    return `
      <div class="card">
        <div class="card-title">Nueva Cuenta</div>
        <div class="form-row">
          <div class="form-group" style="width:120px">
            <label>Código</label>
            <input type="text" id="pc-cod" placeholder="Ej: 1.1.05" style="width:120px">
          </div>
          <div class="form-group" style="flex:1;min-width:160px">
            <label>Nombre de la cuenta</label>
            <input type="text" id="pc-nombre" placeholder="Ej: Deudores varios">
          </div>
          <div class="form-group">
            <label>Rubro</label>
            <select id="pc-rubro" style="width:140px">
              <option value="activo">Activo</option>
              <option value="pasivo">Pasivo</option>
              <option value="pn">Patrimonio Neto</option>
              <option value="ingreso">Ingreso</option>
              <option value="egreso">Egreso</option>
            </select>
          </div>
          <div class="form-group">
            <label>&nbsp;</label>
            <button class="btn btn-primary" onclick="PlanCuentas.agregar()">
              <i class="ti ti-plus" aria-hidden="true"></i> Agregar
            </button>
          </div>
        </div>
        <div id="pc-msg"></div>
      </div>`;
  }

  /* ---- EJERCICIOS ---- */
  function renderEjercicio() {
    const ej = EJERCICIOS[ejActual];
    const isEval = Progreso.isEvaluacion();

    const tarjetas = EJERCICIOS.map((e, i) => {
      const yaCompleto = Progreso.estaCompleto(MODULO, i);
      return `
        <div class="ej-card ${ejActual === i ? 'selected' : ''}" onclick="PlanCuentas.selectEj(${i})">
          ${yaCompleto ? `<span class="ej-completado"><i class="ti ti-check" aria-hidden="true"></i></span>` : ''}
          <div class="ej-card-title">${e.titulo}</div>
          <div class="ej-card-sub">${e.subtitulo}</div>
        </div>`;
    }).join('');

    let correctos = 0;
    const filas = ej.items.map((item, i) => {
      const s = ejState[i] || { val: '', mostradaPista: false };
      const isOk = s.val === item.rubro;
      if (isOk) correctos++;

      let iconoEstado = '';
      if (!isEval) {
        iconoEstado = s.val
          ? (isOk
              ? `<span style="color:var(--success)"><i class="ti ti-check" aria-hidden="true"></i> Correcto</span>`
              : `<span style="color:var(--danger)"><i class="ti ti-x" aria-hidden="true"></i> Revisá</span>`)
          : '';
      } else if (evaluada) {
        iconoEstado = s.val
          ? (isOk
              ? `<span style="color:var(--success)"><i class="ti ti-check" aria-hidden="true"></i> Correcto</span>`
              : `<span style="color:var(--danger)"><i class="ti ti-x" aria-hidden="true"></i> Incorrecto</span>`)
          : `<span style="color:var(--danger)"><i class="ti ti-x" aria-hidden="true"></i> Sin responder</span>`;
      }

      let pistaHtml = '';
      if (!isEval) {
        pistaHtml = s.mostradaPista
          ? `<div class="alert alert-warning" style="margin-top:6px;font-size:12px"><i class="ti ti-bulb" aria-hidden="true"></i> ${item.pista}</div>`
          : `<button class="btn btn-warning btn-sm" onclick="PlanCuentas.pista(${i})"><i class="ti ti-bulb" aria-hidden="true"></i> Pista</button>`;
      }

      return `
        <tr>
          <td><code>${item.cod}</code></td>
          <td style="font-weight:500">${item.nombre}</td>
          <td>
            <select ${evaluada ? 'disabled' : ''} style="font-size:12px;padding:4px 8px;border:1px solid var(--border-strong);border-radius:var(--radius-sm);background:var(--bg-surface);color:var(--text-primary)"
              onchange="PlanCuentas.responder(${i}, this.value)">
              <option value="">-- elegir --</option>
              <option value="activo"  ${s.val === 'activo'  ? 'selected' : ''}>Activo</option>
              <option value="pasivo"  ${s.val === 'pasivo'  ? 'selected' : ''}>Pasivo</option>
              <option value="pn"      ${s.val === 'pn'      ? 'selected' : ''}>Patrimonio Neto</option>
              <option value="ingreso" ${s.val === 'ingreso' ? 'selected' : ''}>Ingreso</option>
              <option value="egreso"  ${s.val === 'egreso'  ? 'selected' : ''}>Egreso</option>
            </select>
          </td>
          ${!isEval ? `<td>${pistaHtml}</td>` : ''}
          <td>${iconoEstado}</td>
        </tr>`;
    }).join('');

    let finalMsg = '';
    if (!isEval) {
      if (correctos === ej.items.length) {
        Progreso.completar(MODULO, ejActual);
        App.refrescarProgreso();
      }
      finalMsg = correctos === ej.items.length
        ? Utils.alert('ok', 'trophy', '¡Ejercicio completo! Excelente trabajo. El progreso fue guardado.')
        : `<p style="font-size:12px;color:var(--text-muted);margin-top:8px">Correctas: ${correctos} / ${ej.items.length}</p>`;
    } else {
      if (evaluada) {
        const pct = Math.round((correctos / ej.items.length) * 100);
        const aprobado = pct >= 70;
        if (aprobado) {
          Progreso.completar(MODULO, ejActual);
          App.refrescarProgreso();
        }

        finalMsg = `
          <div class="score-card ${aprobado ? 'aprobado' : 'desaprobado'}">
            <div class="score-card-title">Resultado de la Evaluación</div>
            <div class="score-card-value">${pct}%</div>
            <div class="score-card-badge">${aprobado ? 'Aprobado ✓' : 'Reprobado ✗'}</div>
            <div class="score-card-desc">
              Respondiste correctamente <strong>${correctos}</strong> de <strong>${ej.items.length}</strong> cuentas.<br>
              ${aprobado 
                ? '¡Excelente! Has demostrado un buen dominio del plan de cuentas. Tu progreso ha sido registrado.' 
                : 'No alcanzaste el 70% requerido para aprobar. ¡Inténtalo de nuevo!'}
            </div>
            <button class="btn btn-primary btn-sm" style="margin-top:14px" onclick="PlanCuentas.selectEj(${ejActual})">
              <i class="ti ti-rotate" aria-hidden="true"></i> Reintentar
            </button>
          </div>`;
      } else {
        finalMsg = `
          <button class="btn btn-primary" style="margin-top:14px" onclick="PlanCuentas.calificar()">
            <i class="ti ti-checklist" aria-hidden="true"></i> Finalizar y Calificar
          </button>`;
      }
    }

    return `
      <div class="ej-grid">${tarjetas}</div>
      <div class="card" style="padding:0">
        <div class="table-wrap">
          <table>
            <thead><tr><th>Código</th><th>Cuenta</th><th>Rubro</th>${!isEval ? '<th>Pista</th>' : ''}<th>Estado</th></tr></thead>
            <tbody>${filas}</tbody>
          </table>
        </div>
      </div>
      <div>${finalMsg}</div>`;
  }

  /* ---- ACCIONES ---- */
  function switchTab(tab) { innerTab = tab; render(); }

  function agregar() {
    const cod    = document.getElementById('pc-cod')?.value.trim();
    const nombre = document.getElementById('pc-nombre')?.value.trim();
    const rubro  = document.getElementById('pc-rubro')?.value;
    const msg    = document.getElementById('pc-msg');
    if (!cod || !nombre) {
      if (msg) msg.innerHTML = Utils.alert('err', 'alert-circle', 'Completá el código y el nombre.');
      return;
    }
    cuentas.push({ cod, nombre, rubro });
    cuentas.sort((a, b) => a.cod.localeCompare(b.cod));
    if (msg) msg.innerHTML = Utils.alert('ok', 'check', `Cuenta "${nombre}" agregada correctamente.`);
    setTimeout(() => { innerTab = 'plan'; render(); }, 1200);
  }

  function selectEj(idx) {
    ejActual = idx;
    ejState  = EJERCICIOS[idx].items.map(() => ({ val: '', mostradaPista: false }));
    evaluada = false;
    renderInner();
  }

  function responder(i, val) {
    if (evaluada) return;
    ejState[i] = ejState[i] || {};
    ejState[i].val = val;
    renderInner();
  }

  function pista(i) {
    ejState[i] = ejState[i] || {};
    ejState[i].mostradaPista = true;
    renderInner();
  }

  function calificar() {
    evaluada = true;
    renderInner();
  }

  function init() {
    ejState = EJERCICIOS[0].items.map(() => ({ val: '', mostradaPista: false }));
    evaluada = false;
    render();
  }

  return { init, render, switchTab, agregar, selectEj, responder, pista, calificar, EJERCICIOS };

})();
