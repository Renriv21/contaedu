/* =========================================
   ContaEdu — Módulo: Asientos Contables
   ========================================= */

const Asientos = (() => {

  /* ---- EJERCICIOS GUIADOS ---- */
  const EJERCICIOS = [
    {
      titulo: 'Venta al contado',
      subtitulo: 'Factura B — $12.100 c/IVA',
      contexto: '"El Sauce SRL" vende mercaderías por $10.000 neto + IVA 21%. El cliente paga en efectivo.',
      pasos: [
        {
          titulo: 'Identificá la operación',
          tipo: 'opcion',
          consigna: '¿Qué tipo de operación es?',
          opciones: ['Compra al contado', 'Venta al contado', 'Pago de deuda', 'Cobro de factura'],
          correcta: 1,
          explicacion: 'Es una <strong>venta</strong>: la empresa entrega mercaderías y recibe dinero en efectivo.',
        },
        {
          titulo: 'Calculá los importes',
          tipo: 'calculo',
          consigna: 'Neto $10.000 — completá los valores:',
          campos: [
            { id: 'neto',  label: 'Neto $',           respuesta: 10000 },
            { id: 'iva',   label: 'IVA 21% $',        respuesta: 2100  },
            { id: 'total', label: 'Total a cobrar $',  respuesta: 12100 },
          ],
          explicacion: 'IVA = 10.000 × 0,21 = <strong>$2.100</strong> / Total = 10.000 + 2.100 = <strong>$12.100</strong>',
        },
        {
          titulo: 'Registrá el asiento',
          tipo: 'asiento',
          consigna: 'Completá los importes en Debe y Haber:',
          debe:  [{ cuenta: 'Caja', monto: 12100 }],
          haber: [{ cuenta: 'Ventas', monto: 10000 }, { cuenta: 'IVA Ventas (Déb. Fiscal)', monto: 2100 }],
          explicacion: '<strong>Caja</strong> aumenta → Debe. <strong>Ventas</strong> e <strong>IVA Ventas</strong> aumentan → Haber (ingresos y pasivo fiscal).',
        },
      ],
    },
    {
      titulo: 'Compra a crédito',
      subtitulo: 'Mercadería $24.200 — 30 días',
      contexto: '"El Sauce SRL" compra mercaderías al proveedor "López e Hijos" por $20.000 neto + IVA. Pago a 30 días.',
      pasos: [
        {
          titulo: 'Identificá las cuentas',
          tipo: 'opcion',
          consigna: '¿Qué cuentas intervienen?',
          opciones: [
            'Caja y Ventas',
            'Mercaderías, IVA Compras y Proveedores',
            'Banco y Capital',
            'Clientes y Mercaderías',
          ],
          correcta: 1,
          explicacion: 'Entra <strong>Mercaderías</strong> (activo), pagamos IVA al proveedor (<strong>Crédito Fiscal</strong>) y queda la deuda con <strong>Proveedores</strong> (pasivo).',
        },
        {
          titulo: 'Calculá los importes',
          tipo: 'calculo',
          consigna: 'Neto $20.000 — completá:',
          campos: [
            { id: 'neto2',  label: 'Neto $',           respuesta: 20000 },
            { id: 'iva2',   label: 'IVA 21% $',        respuesta: 4200  },
            { id: 'total2', label: 'Total a pagar $',   respuesta: 24200 },
          ],
          explicacion: 'IVA = 20.000 × 0,21 = <strong>$4.200</strong> / Total = <strong>$24.200</strong>',
        },
        {
          titulo: 'Registrá el asiento',
          tipo: 'asiento',
          consigna: 'Completá los importes:',
          debe:  [{ cuenta: 'Mercaderías', monto: 20000 }, { cuenta: 'IVA Compras (Créd. Fiscal)', monto: 4200 }],
          haber: [{ cuenta: 'Proveedores', monto: 24200 }],
          explicacion: '<strong>Mercaderías</strong> e <strong>IVA Compras</strong> al Debe (aumentan activos). <strong>Proveedores</strong> al Haber (aumenta el pasivo).',
        },
      ],
    },
    {
      titulo: 'Pago de sueldo',
      subtitulo: 'Remuneración mensual',
      contexto: 'Se paga el sueldo mensual: $85.000 brutos. Aportes del trabajador 17% ($14.450). Se paga el neto por banco.',
      pasos: [
        {
          titulo: 'Calculá el neto a pagar',
          tipo: 'calculo',
          consigna: 'Sueldo bruto $85.000 — descuentos 17%:',
          campos: [
            { id: 'bruto3',   label: 'Bruto $',         respuesta: 85000 },
            { id: 'aportes3', label: 'Aportes (17%) $',  respuesta: 14450 },
            { id: 'neto3',    label: 'Neto a pagar $',   respuesta: 70550 },
          ],
          explicacion: 'Aportes = 85.000 × 0,17 = <strong>$14.450</strong> / Neto = 85.000 − 14.450 = <strong>$70.550</strong>',
        },
        {
          titulo: 'Registrá el asiento',
          tipo: 'asiento',
          consigna: 'Asiento de devengamiento y pago:',
          debe:  [{ cuenta: 'Sueldos y jornales', monto: 85000 }],
          haber: [{ cuenta: 'Banco cta. cte.', monto: 70550 }, { cuenta: 'Aportes a depositar', monto: 14450 }],
          explicacion: 'El <strong>gasto</strong> va al Debe. La <strong>salida de banco</strong> y la <strong>deuda por aportes</strong> van al Haber.',
        },
      ],
    },
  ];

  /* ---- ESTADO ---- */
  let innerTab  = 'libre';
  let ejActual  = 0;
  let pasoActual = 0;
  let respuestas = [];

  /* Libro Diario */
  let libroDiario = [];

  /* ---- RENDER PRINCIPAL ---- */
  function render() {
    const root = document.getElementById('asientos-root');
    if (!root) return;
    root.innerHTML = `
      <div class="panel-body">
        <div class="inner-tabs">
          <button class="inner-tab ${innerTab === 'libre' ? 'active' : ''}" onclick="Asientos.switchTab('libre')">
            <i class="ti ti-pencil" aria-hidden="true"></i> Registro libre
          </button>
          <button class="inner-tab ${innerTab === 'ejercicio' ? 'active' : ''}" onclick="Asientos.switchTab('ejercicio')">
            <i class="ti ti-school" aria-hidden="true"></i> Ejercicios guiados
          </button>
          <button class="inner-tab ${innerTab === 'diario' ? 'active' : ''}" onclick="Asientos.switchTab('diario')">
            <i class="ti ti-book" aria-hidden="true"></i> Libro Diario
            ${libroDiario.length ? `<span style="background:var(--accent);color:#fff;font-size:10px;padding:1px 6px;border-radius:10px;margin-left:4px">${libroDiario.length}</span>` : ''}
          </button>
        </div>
        <div id="asientos-inner"></div>
      </div>`;
    renderInner();
  }

  function renderInner() {
    const el = document.getElementById('asientos-inner');
    if (!el) return;
    if (innerTab === 'libre')     el.innerHTML = renderLibre();
    if (innerTab === 'ejercicio') el.innerHTML = renderEjercicio();
    if (innerTab === 'diario')    el.innerHTML = renderDiario();
  }

  /* ---- TAB: REGISTRO LIBRE ---- */
  function renderLibre() {
    return `
      <div class="teoria">
        <strong>Partida doble:</strong> Cada operación afecta al menos dos cuentas.
        La suma del <strong>Debe</strong> siempre debe igualar la suma del <strong>Haber</strong>.
        Regla: en cuentas de Activo, lo que entra va al Debe; lo que sale al Haber. En Pasivo/PN es a la inversa.
      </div>
      <div class="card">
        <div class="card-title">Nuevo asiento</div>
        <div class="form-row">
          <div class="form-group">
            <label>Fecha</label>
            <input type="date" id="as-fecha" style="width:150px">
          </div>
          <div class="form-group" style="flex:1;min-width:200px">
            <label>Descripción</label>
            <input type="text" id="as-desc" placeholder="Ej: Venta de mercadería">
          </div>
        </div>
        <div class="dh-grid">
          <div class="dh-box dh-box-debe">
            <div class="dh-label-debe">DEBE</div>
            ${[1,2].map(n => `
              <div class="dh-row">
                <label>Cuenta ${n}</label>
                <input type="text" id="d-c${n}" placeholder="Nombre de cuenta" style="width:100%;margin-bottom:4px">
                <label>Importe $</label>
                <input type="number" id="d-m${n}" placeholder="0.00" min="0" style="width:100%">
              </div>`).join('')}
          </div>
          <div class="dh-box dh-box-haber">
            <div class="dh-label-haber">HABER</div>
            ${[1,2].map(n => `
              <div class="dh-row">
                <label>Cuenta ${n}</label>
                <input type="text" id="h-c${n}" placeholder="Nombre de cuenta" style="width:100%;margin-bottom:4px">
                <label>Importe $</label>
                <input type="number" id="h-m${n}" placeholder="0.00" min="0" style="width:100%">
              </div>`).join('')}
          </div>
        </div>
        <div style="margin-top:12px;display:flex;align-items:center;gap:10px">
          <button class="btn btn-primary" onclick="Asientos.registrar()">
            <i class="ti ti-device-floppy" aria-hidden="true"></i> Registrar asiento
          </button>
          <button class="btn" onclick="Asientos.limpiar()">
            <i class="ti ti-trash" aria-hidden="true"></i> Limpiar
          </button>
        </div>
        <div id="as-msg"></div>
      </div>`;
  }

  /* ---- TAB: EJERCICIOS ---- */
  function renderEjercicio() {
    const ej = EJERCICIOS[ejActual];
    const paso = ej.pasos[pasoActual];
    const rs = respuestas[pasoActual] || {};

    const tarjetas = EJERCICIOS.map((e, i) => `
      <div class="ej-card ${ejActual === i ? 'selected' : ''}" onclick="Asientos.selectEj(${i})">
        <div class="ej-card-title">${e.titulo}</div>
        <div class="ej-card-sub">${e.subtitulo}</div>
      </div>`).join('');

    let pasoHtml = '';

    /* OPCION */
    if (paso.tipo === 'opcion') {
      const opts = paso.opciones.map((op, i) => {
        let cls = '';
        if (rs.opcion === i) cls = rs.ok ? 'correct' : 'wrong';
        const icono = rs.opcion === i ? (rs.ok ? 'check' : 'x') : 'circle';
        return `<div class="option-item ${cls}" onclick="Asientos.responderOpcion(${i})">
          <i class="ti ti-${icono}" aria-hidden="true"></i><span>${op}</span></div>`;
      }).join('');
      pasoHtml = `<div class="option-list">${opts}</div>`;
    }

    /* CALCULO */
    if (paso.tipo === 'calculo') {
      const campos = paso.campos.map(c => {
        const v = rs.vals?.[c.id] ?? '';
        let cls = '';
        if (rs.verificado) cls = Utils.numEq(v, c.respuesta) ? 'ok' : 'err';
        return `<div class="form-group" style="min-width:150px">
          <label>${c.label}</label>
          <input type="number" class="${cls}" value="${v}" placeholder="?"
            onchange="Asientos.inputCalc('${c.id}', this.value)">
        </div>`;
      }).join('');
      pasoHtml = `
        <div class="form-row">${campos}</div>
        <button class="btn btn-primary btn-sm" onclick="Asientos.verificarCalc()">
          <i class="ti ti-check" aria-hidden="true"></i> Verificar
        </button>`;
    }

    /* ASIENTO */
    if (paso.tipo === 'asiento') {
      const debeInputs = paso.debe.map((d, i) => `
        <div class="dh-row">
          <label>${d.cuenta}</label>
          <input type="number" placeholder="Importe" value="${rs.vals?.['d'+i] ?? ''}"
            class="${rs.verificado ? (Utils.numEq(rs.vals?.['d'+i], d.monto) ? 'ok' : 'err') : ''}"
            onchange="Asientos.inputAsiento('d${i}', this.value)">
        </div>`).join('');
      const haberInputs = paso.haber.map((h, i) => `
        <div class="dh-row">
          <label>${h.cuenta}</label>
          <input type="number" placeholder="Importe" value="${rs.vals?.['h'+i] ?? ''}"
            class="${rs.verificado ? (Utils.numEq(rs.vals?.['h'+i], h.monto) ? 'ok' : 'err') : ''}"
            onchange="Asientos.inputAsiento('h${i}', this.value)">
        </div>`).join('');
      pasoHtml = `
        <div class="dh-grid">
          <div class="dh-box dh-box-debe"><div class="dh-label-debe">DEBE</div>${debeInputs}</div>
          <div class="dh-box dh-box-haber"><div class="dh-label-haber">HABER</div>${haberInputs}</div>
        </div>
        <button class="btn btn-primary btn-sm" style="margin-top:10px" onclick="Asientos.verificarAsiento()">
          <i class="ti ti-check" aria-hidden="true"></i> Verificar asiento
        </button>`;
    }

    /* BOTONES PISTA/SIGUIENTE */
    const pista = rs.mostradaExpl
      ? `<div class="alert alert-info" style="margin-top:10px"><i class="ti ti-bulb" aria-hidden="true"></i><span>${paso.explicacion}</span></div>`
      : (Object.keys(rs).length > 0
          ? `<button class="btn btn-warning btn-sm" style="margin-top:10px" onclick="Asientos.verExpl()"><i class="ti ti-bulb" aria-hidden="true"></i> Ver explicación</button>`
          : '');

    const siguiente = rs.ok
      ? (pasoActual < ej.pasos.length - 1
          ? `<button class="btn btn-success btn-sm" style="margin-top:10px;margin-left:6px" onclick="Asientos.siguiente()">Siguiente <i class="ti ti-arrow-right" aria-hidden="true"></i></button>`
          : Utils.alert('ok', 'trophy', '¡Ejercicio completo! Muy bien.'))
      : '';

    return `
      <div class="ej-grid">${tarjetas}</div>
      <div class="card">
        <div class="alert alert-info" style="margin:0 0 1rem"><i class="ti ti-info-circle" aria-hidden="true"></i><span>${ej.contexto}</span></div>
        ${Utils.buildProgress(ej.pasos.length, pasoActual)}
        <div class="step-box">
          <div class="step-box-header">
            <span class="step-number active">${pasoActual + 1}</span>
            <span class="step-title">${paso.titulo}</span>
          </div>
          <div class="step-body">
            <p style="font-size:13px;margin-bottom:12px">${paso.consigna}</p>
            ${pasoHtml}
            ${pista}
            ${siguiente}
          </div>
        </div>
      </div>`;
  }

  /* ---- TAB: LIBRO DIARIO ---- */
  function renderDiario() {
    if (!libroDiario.length) {
      return `<div class="card"><p style="color:var(--text-muted);font-size:13px">No hay asientos registrados. Usá el <strong>Registro libre</strong> para agregar.</p></div>`;
    }
    const asientos = libroDiario.map((a, idx) => {
      const debeRows = a.debe.map(d => `<tr><td style="padding-left:16px">${d.cuenta}</td><td class="td-num">${Utils.formatARS(d.monto)}</td><td></td></tr>`).join('');
      const haberRows = a.haber.map(h => `<tr><td style="padding-left:32px">${h.cuenta}</td><td></td><td class="td-num">${Utils.formatARS(h.monto)}</td></tr>`).join('');
      return `
        <div class="card" style="margin-bottom:10px">
          <div style="display:flex;justify-content:space-between;margin-bottom:8px">
            <span style="font-size:13px;font-weight:500">${a.desc}</span>
            <span style="font-size:12px;color:var(--text-muted)">${a.fecha}</span>
          </div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Cuenta</th><th class="td-num">Debe</th><th class="td-num">Haber</th></tr></thead>
              <tbody>
                ${debeRows}
                ${haberRows}
                <tr class="td-total">
                  <td>Total</td>
                  <td class="td-num">${Utils.formatARS(a.total)}</td>
                  <td class="td-num">${Utils.formatARS(a.total)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>`;
    }).join('');

    return `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
        <span style="font-size:13px;color:var(--text-secondary)">${libroDiario.length} asiento(s) registrado(s)</span>
        <button class="btn btn-sm" onclick="Asientos.limpiarDiario()"><i class="ti ti-trash" aria-hidden="true"></i> Limpiar diario</button>
      </div>
      ${asientos}`;
  }

  /* ---- ACCIONES REGISTRO LIBRE ---- */
  function registrar() {
    const g  = id => document.getElementById(id);
    const nv = id => parseFloat(g(id)?.value) || 0;
    const sv = id => g(id)?.value?.trim() || '';

    const fecha = g('as-fecha')?.value || new Date().toISOString().split('T')[0];
    const desc  = sv('as-desc') || 'Sin descripción';
    const debe  = [{ cuenta: sv('d-c1'), monto: nv('d-m1') }, { cuenta: sv('d-c2'), monto: nv('d-m2') }].filter(x => x.cuenta && x.monto);
    const haber = [{ cuenta: sv('h-c1'), monto: nv('h-m1') }, { cuenta: sv('h-c2'), monto: nv('h-m2') }].filter(x => x.cuenta && x.monto);
    const totD  = debe.reduce((s, x) => s + x.monto, 0);
    const totH  = haber.reduce((s, x) => s + x.monto, 0);
    const msg   = document.getElementById('as-msg');

    if (!debe.length || !haber.length) {
      if (msg) msg.innerHTML = Utils.alert('err', 'alert-circle', 'Ingresá al menos una cuenta en Debe y una en Haber.');
      return;
    }
    if (Math.abs(totD - totH) > 0.01) {
      if (msg) msg.innerHTML = Utils.alert('err', 'alert-circle', `Debe (${Utils.formatARS(totD)}) ≠ Haber (${Utils.formatARS(totH)}). Los totales deben coincidir.`);
      return;
    }

    libroDiario.push({ fecha, desc, debe, haber, total: totD });
    if (msg) msg.innerHTML = Utils.alert('ok', 'check', 'Asiento registrado correctamente.');
    setTimeout(limpiar, 1200);
  }

  function limpiar() {
    ['as-fecha','as-desc','d-c1','d-m1','d-c2','d-m2','h-c1','h-m1','h-c2','h-m2'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    const msg = document.getElementById('as-msg');
    if (msg) msg.innerHTML = '';
  }

  function limpiarDiario() {
    if (confirm('¿Borrar todos los asientos del Libro Diario?')) {
      libroDiario = [];
      renderInner();
    }
  }

  /* ---- ACCIONES EJERCICIOS ---- */
  function selectEj(idx) {
    ejActual   = idx;
    pasoActual = 0;
    respuestas = EJERCICIOS[idx].pasos.map(() => ({}));
    renderInner();
  }

  function responderOpcion(op) {
    if (respuestas[pasoActual].ok) return;
    const paso = EJERCICIOS[ejActual].pasos[pasoActual];
    respuestas[pasoActual] = { opcion: op, ok: op === paso.correcta, mostradaExpl: op === paso.correcta };
    renderInner();
  }

  function inputCalc(campo, val) {
    respuestas[pasoActual].vals = respuestas[pasoActual].vals || {};
    respuestas[pasoActual].vals[campo] = val;
  }

  function verificarCalc() {
    const paso = EJERCICIOS[ejActual].pasos[pasoActual];
    const rs = respuestas[pasoActual];
    rs.verificado = true;
    rs.ok = paso.campos.every(c => Utils.numEq(rs.vals?.[c.id], c.respuesta));
    if (rs.ok) rs.mostradaExpl = true;
    renderInner();
  }

  function inputAsiento(campo, val) {
    respuestas[pasoActual].vals = respuestas[pasoActual].vals || {};
    respuestas[pasoActual].vals[campo] = val;
  }

  function verificarAsiento() {
    const paso = EJERCICIOS[ejActual].pasos[pasoActual];
    const rs = respuestas[pasoActual];
    rs.verificado = true;
    const dOk = paso.debe.every((d, i)  => Utils.numEq(rs.vals?.['d'+i], d.monto));
    const hOk = paso.haber.every((h, i) => Utils.numEq(rs.vals?.['h'+i], h.monto));
    rs.ok = dOk && hOk;
    if (rs.ok) rs.mostradaExpl = true;
    renderInner();
  }

  function verExpl() {
    respuestas[pasoActual].mostradaExpl = true;
    renderInner();
  }

  function siguiente() {
    pasoActual++;
    renderInner();
  }

  /* ---- TABS ---- */
  function switchTab(tab) {
    innerTab = tab;
    render();
  }

  /* ---- INIT ---- */
  function init() {
    respuestas = EJERCICIOS[0].pasos.map(() => ({}));
    render();
  }

  return {
    init, render, switchTab,
    registrar, limpiar, limpiarDiario,
    selectEj, responderOpcion, inputCalc, verificarCalc,
    inputAsiento, verificarAsiento, verExpl, siguiente,
  };

})();
