/* =========================================
   ContaEdu — Módulo: Conciliación v2
   ========================================= */

const Conciliacion = (() => {

  const MODULO = 'concil';

  const EJERCICIOS = [
    {
      titulo: 'Ejercicio estándar',
      subtitulo: '⭐ Básico — 3 partidas, diferencia simple',
      saldoExt: 120000,
      saldoLib: 113500,
      contexto: 'Al 31/03 el extracto bancario muestra $120.000 y el libro de la empresa $113.500. Identificá a qué saldo afecta cada partida.',
      partidas: [
        {
          desc: 'Cheque n° 0045 emitido, aún no cobrado por el beneficiario',
          afecta: 'ext', val: -4500,
          explicacion: 'El banco ya lo descontó pero el beneficiario no lo presentó. <strong>Resta del extracto</strong>.',
        },
        {
          desc: 'Depósito del 28/03 en tránsito (no acreditado por el banco)',
          afecta: 'ext', val: 2000,
          explicacion: 'La empresa lo depositó pero el banco no lo procesó. <strong>Suma al extracto</strong>.',
        },
        {
          desc: 'Nota de débito bancaria por comisiones ($4.000) — no registrada',
          afecta: 'lib', val: -4000,
          explicacion: 'La empresa no la había registrado. <strong>Resta del libro</strong>.',
        },
      ],
    },
    {
      titulo: 'Ejercicio con 4 partidas',
      subtitulo: '⭐⭐ Intermedio — Saldo a confirmar',
      saldoExt: 250000,
      saldoLib: 242000,
      contexto: 'Al 30/04 el extracto muestra $250.000 y el libro $242.000. Clasificá las cuatro partidas y verificá si los saldos ajustados coinciden.',
      partidas: [
        {
          desc: 'Cheque emitido n° 0112 — $6.000, no cobrado',
          afecta: 'ext', val: -6000,
          explicacion: 'El banco lo registró; el beneficiario todavía no lo cobró. <strong>Resta del extracto</strong>.',
        },
        {
          desc: 'Depósito en tránsito — $4.500',
          afecta: 'ext', val: 4500,
          explicacion: 'La empresa depositó pero el banco no procesó todavía. <strong>Suma al extracto</strong>.',
        },
        {
          desc: 'Nota de débito por comisiones bancarias — $1.200',
          afecta: 'lib', val: -1200,
          explicacion: 'Cargo bancario no registrado en libros. <strong>Resta del libro</strong>.',
        },
        {
          desc: 'Nota de crédito por intereses acreditados — $700',
          afecta: 'lib', val: 700,
          explicacion: 'Acreditación bancaria no registrada en libros. <strong>Suma al libro</strong>.',
        },
      ],
    },
    {
      titulo: 'Cierre de mes',
      subtitulo: '⭐⭐ Intermedio — 5 partidas',
      saldoExt: 380000,
      saldoLib: 367300,
      contexto: 'Al 31/05 el extracto muestra $380.000 y el libro $367.300. Identificá y clasificá las cinco partidas conciliatorias.',
      partidas: [
        {
          desc: 'Cheque n° 0201 emitido el 28/05, aún no cobrado — $8.000',
          afecta: 'ext', val: -8000,
          explicacion: 'Cheque emitido pero no presentado al cobro. <strong>Resta del extracto</strong>.',
        },
        {
          desc: 'Depósito en tránsito del 30/05 — $5.500',
          afecta: 'ext', val: 5500,
          explicacion: 'Depósito enviado pero no acreditado aún. <strong>Suma al extracto</strong>.',
        },
        {
          desc: 'Débito automático de seguro no registrado — $2.400',
          afecta: 'lib', val: -2400,
          explicacion: 'El banco debitó el seguro pero la empresa no lo registró. <strong>Resta del libro</strong>.',
        },
        {
          desc: 'Intereses creditados por plazo fijo — $1.200',
          afecta: 'lib', val: 1200,
          explicacion: 'El banco acreditó intereses que la empresa no había registrado. <strong>Suma al libro</strong>.',
        },
        {
          desc: 'Error en libro: cheque registrado por $9.500 en lugar de $6.000 — diferencia $3.500',
          afecta: 'lib', val: 3500,
          explicacion: 'El cheque se registró por más de lo correcto. Hay que <strong>sumar la diferencia al libro</strong> para corregir el error.',
        },
      ],
    },
    {
      titulo: 'Empresa mediana',
      subtitulo: '⭐⭐⭐ Avanzado — 5 partidas complejas',
      saldoExt: 1250000,
      saldoLib: 1228600,
      contexto: 'Importadora Sur SA al 30/06. Extracto $1.250.000 vs libro $1.228.600. Varias partidas con montos grandes y mixtos.',
      partidas: [
        {
          desc: 'Cheques emitidos en cartera de proveedores, pendientes de cobro — $32.000',
          afecta: 'ext', val: -32000,
          explicacion: 'Cheques entregados a proveedores que aún no se presentaron al banco. <strong>Resta del extracto</strong>.',
        },
        {
          desc: 'Transferencia de cliente en tránsito — $18.000',
          afecta: 'ext', val: 18000,
          explicacion: 'Cliente transfirió pero el banco aún no la procesó. <strong>Suma al extracto</strong>.',
        },
        {
          desc: 'Comisión por mantenimiento de cuenta corriente — $800',
          afecta: 'lib', val: -800,
          explicacion: 'Cargo bancario mensual no registrado en libros. <strong>Resta del libro</strong>.',
        },
        {
          desc: 'Cobro por débito automático de cliente recurrente — $6.400',
          afecta: 'lib', val: 6400,
          explicacion: 'El banco cobró automáticamente un servicio que la empresa no había registrado. <strong>Suma al libro</strong>.',
        },
        {
          desc: 'Rechazo de cheque de cliente por fondos insuficientes — $3.000',
          afecta: 'lib', val: -3000,
          explicacion: 'El banco devolvió el cheque rechazado, que la empresa tenía registrado como cobrado. <strong>Resta del libro</strong>.',
        },
      ],
    },
    {
      titulo: 'Error contable + partidas',
      subtitulo: '⭐⭐⭐ Avanzado — Corrección de errores',
      saldoExt: 540000,
      saldoLib: 521500,
      contexto: 'Al 31/07 el extracto muestra $540.000 y el libro $521.500. Hay un error en los libros y cuatro partidas conciliatorias. Identificalas correctamente.',
      partidas: [
        {
          desc: 'Cheque n° 0388 por $15.000 emitido, beneficiario no lo cobró',
          afecta: 'ext', val: -15000,
          explicacion: 'Cheque emitido y descontado por el banco, pero el beneficiario aún no cobró. <strong>Resta del extracto</strong>.',
        },
        {
          desc: 'Depósito en tránsito de cobranza — $9.500',
          afecta: 'ext', val: 9500,
          explicacion: 'Cobranza depositada que el banco aún no procesó. <strong>Suma al extracto</strong>.',
        },
        {
          desc: 'Nota de débito por impuesto al crédito/débito — $2.200',
          afecta: 'lib', val: -2200,
          explicacion: 'Impuesto bancario no registrado en libros. <strong>Resta del libro</strong>.',
        },
        {
          desc: 'Acreditación de reintegro por devolución de compra — $4.700',
          afecta: 'lib', val: 4700,
          explicacion: 'El banco acreditó la devolución de una compra. La empresa no registró el ingreso. <strong>Suma al libro</strong>.',
        },
      ],
    },
  ];

  let innerTab = 'ejercicio';
  let ejActual = 0;
  let ejState  = [];
  let evaluada = false;

  let libreExt = 0, libreLib = 0;
  let librePartidas = [];

  /* ---- RENDER PRINCIPAL ---- */
  function render() {
    const root = document.getElementById('concil-root');
    if (!root) return;
    root.innerHTML = `
      <div class="panel-body">
        <div class="inner-tabs">
          <button class="inner-tab ${innerTab === 'ejercicio' ? 'active' : ''}" onclick="Conciliacion.switchTab('ejercicio')">
            <i class="ti ti-school" aria-hidden="true"></i> Ejercicios guiados
          </button>
          <button class="inner-tab ${innerTab === 'libre' ? 'active' : ''}" onclick="Conciliacion.switchTab('libre')">
            <i class="ti ti-adjustments" aria-hidden="true"></i> Conciliación libre
          </button>
        </div>
        <div id="concil-inner"></div>
      </div>`;
    renderInner();
  }

  function renderInner() {
    const el = document.getElementById('concil-inner');
    if (!el) return;
    if (innerTab === 'ejercicio') el.innerHTML = renderEjercicio();
    if (innerTab === 'libre')     el.innerHTML = renderLibre();
  }

  /* ---- EJERCICIOS ---- */
  function renderEjercicio() {
    const ej = EJERCICIOS[ejActual];
    const isEval = Progreso.isEvaluacion();
    
    let ajExt = 0, ajLib = 0;
    let correctos = 0;

    ej.partidas.forEach((p, i) => {
      const s = ejState[i] || {};
      const isOk = s.val === p.afecta;
      if (isOk) correctos++;
      
      if ((isEval && isOk) || (!isEval && s.ok)) {
        if (p.afecta === 'ext') ajExt += p.val;
        else                    ajLib += p.val;
      }
    });

    const sExtAj = ej.saldoExt + ajExt;
    const sLibAj = ej.saldoLib + ajLib;
    const dif    = Math.abs(sExtAj - sLibAj);
    const completados = isEval ? ej.partidas.length : ejState.filter(s => s?.ok).length;

    const tarjetas = EJERCICIOS.map((e, i) => {
      const yaCompleto = Progreso.estaCompleto(MODULO, i);
      return `
        <div class="ej-card ${ejActual === i ? 'selected' : ''}" onclick="Conciliacion.selectEj(${i})">
          ${yaCompleto ? `<span class="ej-completado"><i class="ti ti-check" aria-hidden="true"></i></span>` : ''}
          <div class="ej-card-title">${e.titulo}</div>
          <div class="ej-card-sub">${e.subtitulo}</div>
        </div>`;
    }).join('');

    const partidas = ej.partidas.map((p, i) => {
      const s = ejState[i] || {};
      const signo = p.val >= 0 ? '+' : '';
      const valColor = p.val >= 0 ? 'var(--success)' : 'var(--danger)';
      const isOk = s.val === p.afecta;
      
      let estadoHtml = '';
      if (!isEval) {
        if (s.ok) estadoHtml = `<span style="color:var(--success);font-size:12px"><i class="ti ti-check" aria-hidden="true"></i> Correcto</span>`;
        else if (s.val && !s.ok) estadoHtml = `<span style="color:var(--danger);font-size:12px"><i class="ti ti-x" aria-hidden="true"></i> Revisá</span>`;
      } else if (evaluada) {
        if (isOk) estadoHtml = `<span style="color:var(--success);font-size:12px"><i class="ti ti-check" aria-hidden="true"></i> Correcto</span>`;
        else estadoHtml = `<span style="color:var(--danger);font-size:12px"><i class="ti ti-x" aria-hidden="true"></i> Incorrecto</span>`;
      }

      let pistaHtml = '';
      if (!isEval) {
        pistaHtml = s.mostradaPista
          ? `<div class="alert alert-warning" style="margin-top:6px;font-size:12px"><i class="ti ti-bulb" aria-hidden="true"></i><span>${p.explicacion}</span></div>`
          : `<button class="btn btn-warning btn-sm" onclick="Conciliacion.pista(${i})"><i class="ti ti-bulb" aria-hidden="true"></i> Pista</button>`;
      }

      return `
        <div class="check-row ${(!isEval && s.ok) || (isEval && evaluada && isOk) ? 'resolved' : ''}">
          <div style="flex:1">
            <div style="font-size:13px;margin-bottom:8px">
              ${p.desc}
              <span style="font-weight:500;color:${valColor};margin-left:4px">(${signo}${Utils.formatARS(p.val)})</span>
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
              <select style="font-size:12px;padding:4px 8px;border:1px solid var(--border-strong);border-radius:var(--radius-sm);background:var(--bg-surface);color:var(--text-primary)"
                onchange="Conciliacion.seleccionarAfecta(${i}, this.value)" ${evaluada ? 'disabled' : ''}>
                <option value="">¿Afecta...?</option>
                <option value="ext" ${s.val==='ext'?'selected':''}>Extracto bancario</option>
                <option value="lib" ${s.val==='lib'?'selected':''}>Libro empresa</option>
              </select>
              ${!isEval ? `<button class="btn btn-sm" onclick="Conciliacion.verificarPartida(${i})">Verificar</button>` : ''}
              ${(!isEval && !s.ok) ? pistaHtml : ''}
              ${estadoHtml}
            </div>
            ${(!isEval && s.ok && s.mostradaPista) ? `<div class="alert alert-info" style="margin-top:6px;font-size:12px"><i class="ti ti-bulb" aria-hidden="true"></i><span>${p.explicacion}</span></div>` : ''}
          </div>
        </div>`;
    }).join('');

    let resumenHtml = '';
    let finalMsg = '';

    if (!isEval) {
      if (completados > 0) {
        resumenHtml = `
          <hr class="divider">
          <div class="stat-grid">
            <div class="stat-card"><div class="stat-label">Extracto ajustado</div><div class="stat-value">${Utils.formatARS(sExtAj)}</div></div>
            <div class="stat-card"><div class="stat-label">Libro ajustado</div><div class="stat-value">${Utils.formatARS(sLibAj)}</div></div>
            <div class="stat-card"><div class="stat-label">Diferencia</div>
              <div class="stat-value" style="color:${dif<1?'var(--success)':'var(--danger)'}">${dif<1?'Conciliado':Utils.formatARS(dif)}</div>
            </div>
          </div>`;
        if (completados === ej.partidas.length) {
          if (dif < 1) {
            Progreso.completar(MODULO, ejActual);
            App.refrescarProgreso();
            resumenHtml += Utils.alert('ok', 'trophy', `¡Conciliación correcta! Saldos ajustados = ${Utils.formatARS(sExtAj)}. Progreso guardado.`);
          } else {
            resumenHtml += Utils.alert('err', 'alert-circle', `Diferencia de ${Utils.formatARS(dif)}. Revisá la clasificación.`);
          }
        }
      }
    } else {
      if (evaluada) {
        resumenHtml = `
          <hr class="divider">
          <div class="stat-grid">
            <div class="stat-card"><div class="stat-label">Extracto ajustado</div><div class="stat-value">${Utils.formatARS(sExtAj)}</div></div>
            <div class="stat-card"><div class="stat-label">Libro ajustado</div><div class="stat-value">${Utils.formatARS(sLibAj)}</div></div>
            <div class="stat-card"><div class="stat-label">Diferencia</div>
              <div class="stat-value" style="color:${dif<1?'var(--success)':'var(--danger)'}">${dif<1?'Conciliado':Utils.formatARS(dif)}</div>
            </div>
          </div>`;
        const pct = Math.round((correctos / ej.partidas.length) * 100);
        const aprobado = pct >= 70 && dif < 1;
        if (aprobado) {
          Progreso.completar(MODULO, ejActual);
          App.refrescarProgreso();
        }
        finalMsg = `
          <div class="score-card ${aprobado ? 'aprobado' : 'desaprobado'}" style="margin-top:1rem">
            <div class="score-card-title">Resultado de la Evaluación</div>
            <div class="score-card-value">${pct}%</div>
            <div class="score-card-badge">${aprobado ? 'Aprobado ✓' : 'Reprobado ✗'}</div>
            <div class="score-card-desc">
              Respondiste correctamente <strong>${correctos}</strong> de <strong>${ej.partidas.length}</strong> partidas.<br>
              ${aprobado 
                ? '¡Excelente! Conciliación perfecta. Tu progreso ha sido registrado.' 
                : 'No alcanzaste el 70% requerido o hay diferencias de saldo. ¡Inténtalo de nuevo!'}
            </div>
            <button class="btn btn-primary btn-sm" style="margin-top:14px" onclick="Conciliacion.selectEj(${ejActual})">
              <i class="ti ti-rotate" aria-hidden="true"></i> Reintentar
            </button>
          </div>`;
      } else {
        finalMsg = `
          <button class="btn btn-primary" style="margin-top:14px" onclick="Conciliacion.calificar()">
            <i class="ti ti-checklist" aria-hidden="true"></i> Finalizar y Calificar
          </button>`;
      }
    }

    return `
      <div class="teoria">
        <strong>Conciliación bancaria:</strong> El saldo del libro puede diferir del extracto por:
        cheques emitidos no cobrados, depósitos en tránsito, notas de débito/crédito no registradas.
        Se ajustan ambos saldos hasta que coincidan.
      </div>
      <div class="ej-grid">${tarjetas}</div>
      <div class="card">
        <div class="alert alert-info" style="margin:0 0 1rem"><i class="ti ti-info-circle" aria-hidden="true"></i><span>${ej.contexto}</span></div>
        <div class="stat-grid" style="margin-bottom:1rem">
          <div class="stat-card"><div class="stat-label">Saldo extracto bancario</div><div class="stat-value">${Utils.formatARS(ej.saldoExt)}</div></div>
          <div class="stat-card"><div class="stat-label">Saldo libro empresa</div><div class="stat-value">${Utils.formatARS(ej.saldoLib)}</div></div>
        </div>
        <div class="card-title">Partidas conciliatorias</div>
        ${partidas}
        ${resumenHtml}
        ${finalMsg}
      </div>`;
  }

  /* ---- LIBRE ---- */
  function renderLibre() {
    let ajExt = 0, ajLib = 0;
    librePartidas.forEach(p => {
      if (p.afecta === 'ext') ajExt += p.val;
      else                    ajLib += p.val;
    });
    const sExtAj = (libreExt||0) + ajExt;
    const sLibAj = (libreLib||0) + ajLib;
    const dif = Math.abs(sExtAj - sLibAj);

    const filas = librePartidas.length
      ? librePartidas.map(p=>`
          <tr>
            <td>${p.desc}</td>
            <td><span class="badge ${p.afecta==='ext'?'badge-activo':'badge-egreso'}">${p.afecta==='ext'?'Extracto':'Libro'}</span></td>
            <td class="td-num" style="color:${p.val>=0?'var(--success)':'var(--danger)'}">${p.val>=0?'+':''}${Utils.formatARS(p.val)}</td>
          </tr>`).join('')
      : `<tr><td colspan="3" style="color:var(--text-muted);text-align:center;padding:1rem">Sin partidas.</td></tr>`;

    return `
      <div class="card">
        <div class="card-title">Saldos iniciales</div>
        <div class="form-row">
          <div class="form-group">
            <label>Saldo extracto bancario $</label>
            <input type="number" id="con-ext" value="${libreExt||''}" placeholder="0.00" style="width:170px" oninput="Conciliacion.setSaldo('ext',this.value)">
          </div>
          <div class="form-group">
            <label>Saldo libro empresa $</label>
            <input type="number" id="con-lib" value="${libreLib||''}" placeholder="0.00" style="width:170px" oninput="Conciliacion.setSaldo('lib',this.value)">
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-title">Agregar partida conciliatoria</div>
        <div class="form-row">
          <div class="form-group" style="flex:1;min-width:180px">
            <label>Descripción</label>
            <input type="text" id="con-desc" placeholder="Ej: Cheque n° 001 no cobrado">
          </div>
          <div class="form-group">
            <label>Afecta</label>
            <select id="con-afecta" style="width:150px">
              <option value="ext">Extracto bancario</option>
              <option value="lib">Libro empresa</option>
            </select>
          </div>
          <div class="form-group">
            <label>Valor $ (negativo si resta)</label>
            <input type="number" id="con-val" placeholder="-3000" style="width:140px">
          </div>
          <div class="form-group">
            <label>&nbsp;</label>
            <button class="btn btn-primary" onclick="Conciliacion.agregarPartida()"><i class="ti ti-plus" aria-hidden="true"></i> Agregar</button>
          </div>
        </div>
        <div id="con-msg"></div>
      </div>
      <div class="card" style="padding:0">
        <div class="table-wrap">
          <table>
            <thead><tr><th>Partida</th><th>Afecta</th><th class="td-num">Valor</th></tr></thead>
            <tbody>${filas}</tbody>
          </table>
        </div>
      </div>
      ${(libreExt||libreLib) ? `
      <div class="card">
        <div class="card-title">Resultado</div>
        <div class="stat-grid">
          <div class="stat-card"><div class="stat-label">Extracto ajustado</div><div class="stat-value">${Utils.formatARS(sExtAj)}</div></div>
          <div class="stat-card"><div class="stat-label">Libro ajustado</div><div class="stat-value">${Utils.formatARS(sLibAj)}</div></div>
        </div>
        ${dif<1
          ? Utils.alert('ok','check','Conciliación correcta.')
          : Utils.alert('err','alert-circle',`Diferencia de ${Utils.formatARS(dif)}. Revisá las partidas.`)}
      </div>` : ''}`;
  }

  /* ---- ACCIONES ---- */
  function selectEj(idx) {
    ejActual = idx;
    evaluada = false;
    ejState  = EJERCICIOS[idx].partidas.map(() => ({}));
    renderInner();
  }

  function seleccionarAfecta(i, val) {
    if (evaluada) return;
    ejState[i] = ejState[i] || {};
    ejState[i].val = val;
  }

  function verificarPartida(i) {
    if (Progreso.isEvaluacion()) return;
    const s = ejState[i] || {};
    s.ok = s.val === EJERCICIOS[ejActual].partidas[i].afecta;
    if (s.ok) s.mostradaPista = true;
    ejState[i] = s;
    renderInner();
  }

  function pista(i) {
    if (Progreso.isEvaluacion()) return;
    ejState[i] = ejState[i] || {};
    ejState[i].mostradaPista = true;
    renderInner();
  }

  function calificar() {
    evaluada = true;
    renderInner();
  }

  function setSaldo(tipo, val) {
    if (tipo === 'ext') libreExt = parseFloat(val) || 0;
    else                libreLib = parseFloat(val) || 0;
  }

  function agregarPartida() {
    const desc   = document.getElementById('con-desc')?.value.trim();
    const afecta = document.getElementById('con-afecta')?.value;
    const val    = parseFloat(document.getElementById('con-val')?.value);
    const msg    = document.getElementById('con-msg');
    if (!desc || isNaN(val)) {
      if (msg) msg.innerHTML = Utils.alert('err','alert-circle','Completá descripción y valor.');
      return;
    }
    librePartidas.push({ desc, afecta, val });
    document.getElementById('con-desc').value = '';
    document.getElementById('con-val').value  = '';
    renderInner();
  }

  function switchTab(tab) { innerTab = tab; render(); }

  function init() {
    evaluada = false;
    ejState = EJERCICIOS[0].partidas.map(() => ({}));
    render();
  }

  return {
    init, render, switchTab,
    selectEj, seleccionarAfecta, verificarPartida, pista, calificar,
    setSaldo, agregarPartida,
    EJERCICIOS,
  };

})();
