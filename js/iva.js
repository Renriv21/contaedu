/* =========================================
   ContaEdu — Módulo: IVA v2
   ========================================= */

const IVA = (() => {

  const MODULO = 'iva';
  const TASA   = 0.21;

  const EJERCICIOS = [
    {
      titulo: 'Mes de Marzo',
      subtitulo: 'Ventas y compras mixtas',
      contexto: 'Calculá el IVA de cada operación de marzo y determiná la posición fiscal mensual.',
      ops: [
        { tipo: 'venta',  desc: 'Venta de mercadería a López',      neto: 50000 },
        { tipo: 'venta',  desc: 'Venta de servicio técnico',         neto: 15000 },
        { tipo: 'compra', desc: 'Compra de mercadería al proveedor', neto: 30000 },
        { tipo: 'compra', desc: 'Compra de insumos de oficina',      neto: 8000  },
      ],
    },
    {
      titulo: 'Mes de Abril',
      subtitulo: 'Posición a pagar',
      contexto: 'Calculá el IVA de las operaciones de abril. ¿Habrá saldo a pagar o a favor?',
      ops: [
        { tipo: 'venta',  desc: 'Venta al contado — Cliente A',      neto: 80000 },
        { tipo: 'venta',  desc: 'Venta a crédito — Cliente B',       neto: 20000 },
        { tipo: 'compra', desc: 'Compra principal de mercadería',    neto: 40000 },
        { tipo: 'compra', desc: 'Compra de muebles de oficina',      neto: 5000  },
      ],
    },
    {
      titulo: 'Mes de Mayo',
      subtitulo: 'Saldo a favor',
      contexto: 'En mayo las compras superan las ventas. Calculá la posición y verificá si queda saldo a favor.',
      ops: [
        { tipo: 'venta',  desc: 'Venta única del mes',               neto: 10000 },
        { tipo: 'compra', desc: 'Compra de maquinaria',              neto: 60000 },
        { tipo: 'compra', desc: 'Compra de mercadería para reventa', neto: 25000 },
      ],
    },
  ];

  let innerTab = 'ejercicio';
  let ejActual = 0;
  let ejState  = [];
  let movimientos = [];

  /* ---- RENDER PRINCIPAL ---- */
  function render() {
    const root = document.getElementById('iva-root');
    if (!root) return;
    root.innerHTML = `
      <div class="panel-body">
        <div class="inner-tabs">
          <button class="inner-tab ${innerTab === 'ejercicio' ? 'active' : ''}" onclick="IVA.switchTab('ejercicio')">
            <i class="ti ti-school" aria-hidden="true"></i> Ejercicios guiados
          </button>
          <button class="inner-tab ${innerTab === 'libre' ? 'active' : ''}" onclick="IVA.switchTab('libre')">
            <i class="ti ti-calculator" aria-hidden="true"></i> Calculadora libre
          </button>
        </div>
        <div id="iva-inner"></div>
      </div>`;
    renderInner();
  }

  function renderInner() {
    const el = document.getElementById('iva-inner');
    if (!el) return;
    if (innerTab === 'ejercicio') el.innerHTML = renderEjercicio();
    if (innerTab === 'libre')     el.innerHTML = renderLibre();
  }

  /* ---- EJERCICIOS ---- */
  function renderEjercicio() {
    const ej    = EJERCICIOS[ejActual];
    const state = ejState;

    const tarjetas = EJERCICIOS.map((e, i) => {
      const yaCompleto = Progreso.estaCompleto(MODULO, i);
      return `
        <div class="ej-card ${ejActual === i ? 'selected' : ''}" onclick="IVA.selectEj(${i})">
          ${yaCompleto ? `<span class="ej-completado"><i class="ti ti-check" aria-hidden="true"></i></span>` : ''}
          <div class="ej-card-title">${e.titulo}</div>
          <div class="ej-card-sub">${e.subtitulo}</div>
        </div>`;
    }).join('');

    let debF = 0, crF = 0;
    ej.ops.forEach((op, i) => {
      if (state[i]?.ok) {
        if (op.tipo === 'venta') debF += op.neto * TASA;
        else                     crF  += op.neto * TASA;
      }
    });
    const saldo = debF - crF;
    const completados = state.filter(s => s?.ok).length;

    /* Guardar progreso si todos completos */
    if (completados === ej.ops.length) {
      Progreso.completar(MODULO, ejActual);
      App.refrescarProgreso();
    }

    const filas = ej.ops.map((op, i) => {
      const s = state[i] || {};
      const correcto = op.neto * TASA;
      let estadoHtml = '';
      if (s.ok)
        estadoHtml = `<span style="color:var(--success);font-size:12px"><i class="ti ti-check" aria-hidden="true"></i> ${Utils.formatARS(correcto)}</span>`;
      else if (s.verificado)
        estadoHtml = `<span style="color:var(--danger);font-size:12px"><i class="ti ti-x" aria-hidden="true"></i> Revisá</span>`;

      const pistaHtml = s.mostradaPista
        ? `<div class="alert alert-warning" style="margin-top:4px;font-size:12px"><i class="ti ti-bulb" aria-hidden="true"></i> ${Utils.formatARS(op.neto)} × 0,21 = ${Utils.formatARS(correcto)}</div>`
        : `<button class="btn btn-warning btn-sm" onclick="IVA.pista(${i})"><i class="ti ti-bulb" aria-hidden="true"></i> Pista</button>`;

      return `
        <tr>
          <td>
            <span class="badge ${op.tipo==='venta'?'badge-venta':'badge-compra'}">${op.tipo}</span>
            <span style="margin-left:6px;font-size:13px">${op.desc}</span>
          </td>
          <td class="td-num">${Utils.formatARS(op.neto)}</td>
          <td>
            <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">
              <input type="number" placeholder="?" value="${s.val ?? ''}"
                style="width:100px;padding:5px 8px;border:1px solid var(--border-strong);border-radius:var(--radius-sm);font-size:12px;background:var(--bg-surface);color:var(--text-primary)"
                onchange="IVA.inputVal(${i}, this.value)">
              <button class="btn btn-sm" onclick="IVA.verificar(${i})">Verificar</button>
              ${!s.ok && !s.mostradaPista ? pistaHtml : ''}
            </div>
          </td>
          <td>${estadoHtml}</td>
        </tr>`;
    }).join('');

    let posicionHtml = '';
    if (completados > 0) {
      const saldoColor = saldo > 0 ? 'var(--danger)' : 'var(--success)';
      const saldoLabel = saldo > 0 ? 'A pagar' : 'Saldo a favor';
      posicionHtml = `
        <hr class="divider">
        <div class="stat-grid">
          <div class="stat-card"><div class="stat-label">Débito Fiscal</div><div class="stat-value">${Utils.formatARS(debF)}</div></div>
          <div class="stat-card"><div class="stat-label">Crédito Fiscal</div><div class="stat-value">${Utils.formatARS(crF)}</div></div>
          <div class="stat-card"><div class="stat-label">Posición IVA</div><div class="stat-value" style="color:${saldoColor}">${saldoLabel}: ${Utils.formatARS(Math.abs(saldo))}</div></div>
        </div>`;
    }

    const finalMsg = completados === ej.ops.length
      ? Utils.alert('ok', 'trophy', '¡Posición fiscal completa! Progreso guardado.')
      : '';

    return `
      <div class="teoria">
        <strong>IVA 21%:</strong>
        <strong>Débito fiscal</strong> = IVA que cobrás en tus ventas (deuda con AFIP).
        <strong>Crédito fiscal</strong> = IVA que pagás en tus compras (a tu favor).
        Posición mensual = Débito − Crédito.
      </div>
      <div class="ej-grid">${tarjetas}</div>
      <div class="card">
        <div class="alert alert-info" style="margin:0 0 1rem"><i class="ti ti-info-circle" aria-hidden="true"></i><span>${ej.contexto}</span></div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Operación</th><th class="td-num">Neto</th><th>IVA 21% (calculá)</th><th>Estado</th></tr></thead>
            <tbody>${filas}</tbody>
          </table>
        </div>
        ${posicionHtml}
        ${finalMsg}
      </div>`;
  }

  /* ---- CALCULADORA LIBRE ---- */
  function renderLibre() {
    let totDeb = 0, totCred = 0;
    movimientos.forEach(m => {
      if (m.tipo === 'venta') totDeb  += m.iva;
      else                    totCred += m.iva;
    });
    const saldo = totDeb - totCred;

    const filas = movimientos.length
      ? movimientos.map(m => `
          <tr>
            <td><span class="badge ${m.tipo==='venta'?'badge-venta':'badge-compra'}">${m.tipo}</span></td>
            <td>${m.desc}</td>
            <td class="td-num">${Utils.formatARS(m.neto)}</td>
            <td class="td-num">${m.tipo==='venta'  ? Utils.formatARS(m.iva) : ''}</td>
            <td class="td-num">${m.tipo==='compra' ? Utils.formatARS(m.iva) : ''}</td>
          </tr>`).join('')
      : `<tr><td colspan="5" style="color:var(--text-muted);text-align:center;padding:1rem">Sin operaciones.</td></tr>`;

    return `
      <div class="card">
        <div class="card-title">Registrar operación</div>
        <div class="form-row">
          <div class="form-group">
            <label>Tipo</label>
            <select id="iv-tipo" style="width:110px"><option value="venta">Venta</option><option value="compra">Compra</option></select>
          </div>
          <div class="form-group" style="flex:1;min-width:160px">
            <label>Descripción</label>
            <input type="text" id="iv-desc" placeholder="Ej: Venta de mercadería">
          </div>
          <div class="form-group">
            <label>Neto (sin IVA) $</label>
            <input type="number" id="iv-neto" placeholder="0.00" min="0" style="width:130px" oninput="IVA.preview()">
          </div>
          <div class="form-group">
            <label>&nbsp;</label>
            <button class="btn btn-primary" onclick="IVA.registrarLibre()"><i class="ti ti-plus" aria-hidden="true"></i> Agregar</button>
          </div>
        </div>
        <div id="iv-preview" style="font-size:12px;color:var(--text-secondary);margin-bottom:6px"></div>
        <div id="iv-msg"></div>
      </div>
      <div class="card" style="padding:0">
        <div class="table-wrap">
          <table>
            <thead><tr><th>Tipo</th><th>Descripción</th><th class="td-num">Neto</th><th class="td-num">Déb. Fiscal</th><th class="td-num">Créd. Fiscal</th></tr></thead>
            <tbody>${filas}</tbody>
            ${movimientos.length ? `
            <tfoot>
              <tr class="td-total"><td colspan="3">Totales</td><td class="td-num">${Utils.formatARS(totDeb)}</td><td class="td-num">${Utils.formatARS(totCred)}</td></tr>
              <tr><td colspan="4" style="font-weight:500">Posición IVA</td>
                <td class="td-num" style="font-weight:600;color:${saldo>=0?'var(--danger)':'var(--success)'}">
                  ${saldo>=0?'A pagar':'A favor'}: ${Utils.formatARS(Math.abs(saldo))}
                </td></tr>
            </tfoot>` : ''}
          </table>
        </div>
      </div>
      ${movimientos.length ? `<button class="btn btn-sm" onclick="IVA.limpiarLibre()"><i class="ti ti-trash" aria-hidden="true"></i> Limpiar</button>` : ''}`;
  }

  /* ---- ACCIONES ---- */
  function selectEj(idx) {
    ejActual = idx;
    ejState  = EJERCICIOS[idx].ops.map(() => ({}));
    renderInner();
  }

  function inputVal(i, val) {
    ejState[i] = ejState[i] || {};
    ejState[i].val = val;
  }

  function verificar(i) {
    const op = EJERCICIOS[ejActual].ops[i];
    const s  = ejState[i] || {};
    s.verificado = true;
    s.ok = Utils.numEq(s.val, op.neto * TASA, 1);
    ejState[i] = s;
    renderInner();
  }

  function pista(i) {
    ejState[i] = ejState[i] || {};
    ejState[i].mostradaPista = true;
    renderInner();
  }

  function preview() {
    const neto = parseFloat(document.getElementById('iv-neto')?.value) || 0;
    const el   = document.getElementById('iv-preview');
    if (!el) return;
    if (!neto) { el.textContent = ''; return; }
    const iva = Utils.calcIVA(neto);
    el.innerHTML = `IVA (21%) = <strong>${Utils.formatARS(iva)}</strong> — Total factura = <strong>${Utils.formatARS(neto + iva)}</strong>`;
  }

  function registrarLibre() {
    const tipo = document.getElementById('iv-tipo')?.value;
    const desc = document.getElementById('iv-desc')?.value.trim();
    const neto = parseFloat(document.getElementById('iv-neto')?.value) || 0;
    const msg  = document.getElementById('iv-msg');
    if (!desc || !neto) {
      if (msg) msg.innerHTML = Utils.alert('err','alert-circle','Completá descripción y neto.');
      return;
    }
    movimientos.push({ tipo, desc, neto, iva: Utils.calcIVA(neto) });
    document.getElementById('iv-desc').value = '';
    document.getElementById('iv-neto').value = '';
    document.getElementById('iv-preview').textContent = '';
    renderInner();
  }

  function limpiarLibre() {
    if (confirm('¿Limpiar todas las operaciones?')) { movimientos = []; renderInner(); }
  }

  function switchTab(tab) { innerTab = tab; render(); }

  function init() {
    ejState = EJERCICIOS[0].ops.map(() => ({}));
    render();
  }

  return {
    init, render, switchTab,
    selectEj, inputVal, verificar, pista,
    preview, registrarLibre, limpiarLibre,
  };

})();
