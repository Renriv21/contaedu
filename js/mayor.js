/* =========================================
   ContaEdu — Módulo: Libro Mayor v2
   ========================================= */

const Mayor = (() => {

  const MODULO = 'mayor';

  const EJERCICIOS = [
    {
      titulo: 'Mayorización Básica',
      subtitulo: '⭐ Básico — Caja, Banco, Capital y Muebles',
      contexto: `
        <strong>Libro Diario (Resumen):</strong><br>
        1. Inicio: Caja $10.000 y Banco $20.000 a Capital $30.000.<br>
        2. Compra de Muebles y Útiles por $5.000 pagando en efectivo (Caja).<br>
        3. Depósito en Banco de $2.000 en efectivo (Caja).
      `,
      cuentas: [
        { nombre: 'Caja',            debe: [10000],       haber: [5000, 2000], totD: 10000, totH: 7000,  saldoTipo: 'deudor',   saldoVal: 3000  },
        { nombre: 'Banco cta. cte.', debe: [20000, 2000], haber: [],           totD: 22000, totH: 0,     saldoTipo: 'deudor',   saldoVal: 22000 },
        { nombre: 'Capital',         debe: [],             haber: [30000],      totD: 0,     totH: 30000, saldoTipo: 'acreedor', saldoVal: 30000 },
        { nombre: 'Muebles y Útiles',debe: [5000],        haber: [],           totD: 5000,  totH: 0,     saldoTipo: 'deudor',   saldoVal: 5000  }
      ],
      balSumas: 37000,
      balSaldos: 30000
    },
    {
      titulo: 'Operaciones Comerciales',
      subtitulo: '⭐⭐ Intermedio — Mercaderías, Ventas, Caja y Proveedores',
      contexto: `
        <strong>Libro Diario (Resumen):</strong><br>
        1. Compra de Mercaderías por $10.000 a crédito (Proveedores).<br>
        2. Venta de Mercaderías por $15.000 cobrando en efectivo (Caja).<br>
        3. Costo de Mercaderías Vendidas (CMV) por $6.000.
      `,
      cuentas: [
        { nombre: 'Mercaderías', debe: [10000],  haber: [6000],  totD: 10000, totH: 6000,  saldoTipo: 'deudor',   saldoVal: 4000  },
        { nombre: 'Proveedores', debe: [],        haber: [10000], totD: 0,     totH: 10000, saldoTipo: 'acreedor', saldoVal: 10000 },
        { nombre: 'Caja',        debe: [15000],   haber: [],      totD: 15000, totH: 0,     saldoTipo: 'deudor',   saldoVal: 15000 },
        { nombre: 'Ventas',      debe: [],        haber: [15000], totD: 0,     totH: 15000, saldoTipo: 'acreedor', saldoVal: 15000 },
        { nombre: 'C.M.V.',      debe: [6000],    haber: [],      totD: 6000,  totH: 0,     saldoTipo: 'deudor',   saldoVal: 6000  }
      ],
      balSumas: 31000,
      balSaldos: 25000
    },
    {
      titulo: 'Empresa de servicios',
      subtitulo: '⭐⭐ Intermedio — Honorarios y gastos',
      contexto: `
        <strong>Libro Diario (Resumen):</strong><br>
        1. Apertura: Banco $50.000 a Capital $50.000.<br>
        2. Prestación de servicio a cliente por $20.000 a crédito (Clientes).<br>
        3. Pago de alquiler de oficina por $8.000 en efectivo (Caja).<br>
        4. Cobro del cliente por Banco $20.000.
      `,
      cuentas: [
        { nombre: 'Banco cta. cte.', debe: [50000, 20000], haber: [],       totD: 70000, totH: 0,     saldoTipo: 'deudor',   saldoVal: 70000 },
        { nombre: 'Capital',         debe: [],              haber: [50000],  totD: 0,     totH: 50000, saldoTipo: 'acreedor', saldoVal: 50000 },
        { nombre: 'Clientes',        debe: [20000],         haber: [20000],  totD: 20000, totH: 20000, saldoTipo: 'saldada',  saldoVal: 0     },
        { nombre: 'Honorarios gan.', debe: [],              haber: [20000],  totD: 0,     totH: 20000, saldoTipo: 'acreedor', saldoVal: 20000 },
        { nombre: 'Alquileres',      debe: [8000],          haber: [],       totD: 8000,  totH: 0,     saldoTipo: 'deudor',   saldoVal: 8000  },
        { nombre: 'Caja',            debe: [],              haber: [8000],   totD: 0,     totH: 8000,  saldoTipo: 'acreedor', saldoVal: 8000  }
      ],
      balSumas: 98000,
      balSaldos: 78000
    },
    {
      titulo: 'Ciclo completo',
      subtitulo: '⭐⭐⭐ Avanzado — 6 cuentas con sueldo',
      contexto: `
        <strong>Libro Diario (Resumen):</strong><br>
        1. Inicio: Banco $100.000 a Capital $100.000.<br>
        2. Compra mercadería $40.000 a crédito (Proveedores).<br>
        3. Venta de mercadería $60.000 al contado (Caja). CMV $30.000.<br>
        4. Pago sueldos $15.000 por Banco.
      `,
      cuentas: [
        { nombre: 'Banco cta. cte.', debe: [100000],      haber: [15000],  totD: 100000, totH: 15000, saldoTipo: 'deudor',   saldoVal: 85000  },
        { nombre: 'Capital',         debe: [],             haber: [100000], totD: 0,      totH: 100000,saldoTipo: 'acreedor', saldoVal: 100000 },
        { nombre: 'Mercaderías',     debe: [40000],        haber: [30000],  totD: 40000,  totH: 30000, saldoTipo: 'deudor',   saldoVal: 10000  },
        { nombre: 'Proveedores',     debe: [],             haber: [40000],  totD: 0,      totH: 40000, saldoTipo: 'acreedor', saldoVal: 40000  },
        { nombre: 'Caja',            debe: [60000],        haber: [],       totD: 60000,  totH: 0,     saldoTipo: 'deudor',   saldoVal: 60000  },
        { nombre: 'Ventas',          debe: [],             haber: [60000],  totD: 0,      totH: 60000, saldoTipo: 'acreedor', saldoVal: 60000  },
        { nombre: 'C.M.V.',          debe: [30000],        haber: [],       totD: 30000,  totH: 0,     saldoTipo: 'deudor',   saldoVal: 30000  },
        { nombre: 'Sueldos',         debe: [15000],        haber: [],       totD: 15000,  totH: 0,     saldoTipo: 'deudor',   saldoVal: 15000  }
      ],
      balSumas: 200000,
      balSaldos: 160000
    },
    {
      titulo: 'Empresa con préstamo',
      subtitulo: '⭐⭐⭐ Avanzado — Financiamiento bancario',
      contexto: `
        <strong>Libro Diario (Resumen):</strong><br>
        1. Capital inicial en Caja $30.000.<br>
        2. Préstamo bancario acreditado en Banco $80.000.<br>
        3. Compra de maquinaria $90.000 pagando $30.000 efectivo y el resto con Banco.<br>
        4. Ingreso por servicios prestados $25.000 cobrado en Banco.<br>
        5. Pago de cuota préstamo: $5.000 capital + $2.000 intereses por Banco.
      `,
      cuentas: [
        { nombre: 'Caja',            debe: [30000],        haber: [30000],  totD: 30000,  totH: 30000, saldoTipo: 'saldada',  saldoVal: 0      },
        { nombre: 'Banco cta. cte.', debe: [80000, 25000], haber: [60000, 7000], totD: 105000, totH: 67000, saldoTipo: 'deudor', saldoVal: 38000 },
        { nombre: 'Préstamo banc.',  debe: [5000],         haber: [80000],  totD: 5000,   totH: 80000, saldoTipo: 'acreedor', saldoVal: 75000  },
        { nombre: 'Maquinaria',      debe: [90000],        haber: [],       totD: 90000,  totH: 0,     saldoTipo: 'deudor',   saldoVal: 90000  },
        { nombre: 'Capital',         debe: [],             haber: [30000],  totD: 0,      totH: 30000, saldoTipo: 'acreedor', saldoVal: 30000  },
        { nombre: 'Honorarios gan.', debe: [],             haber: [25000],  totD: 0,      totH: 25000, saldoTipo: 'acreedor', saldoVal: 25000  },
        { nombre: 'Intereses pag.',  debe: [2000],         haber: [],       totD: 2000,   totH: 0,     saldoTipo: 'deudor',   saldoVal: 2000   }
      ],
      balSumas: 162000,
      balSaldos: 132000
    }
  ];

  let ejActual  = 0;
  let pasoActual = 0;   // 0: Mayorizar | 1: Saldos | 2: Balance
  let respuestas = {};
  let evaluada = false;

  /* -------------------------------------------------- */
  /*  RENDER PRINCIPAL                                   */
  /* -------------------------------------------------- */
  function render() {
    const root = document.getElementById('mayor-root');
    if (!root) return;

    /* --- tarjetas de ejercicios --- */
    const tarjetas = EJERCICIOS.map((e, i) => {
      const completo = Progreso.estaCompleto(MODULO, i);
      return `
        <div class="ej-card ${ejActual === i ? 'selected' : ''}" onclick="Mayor.selectEj(${i})">
          ${completo ? '<span class="ej-completado"><i class="ti ti-check" aria-hidden="true"></i></span>' : ''}
          <div class="ej-card-title">${e.titulo}</div>
          <div class="ej-card-sub">${e.subtitulo}</div>
        </div>`;
    }).join('');

    const ej = EJERCICIOS[ejActual];
    const rs  = respuestas;

    /* ---- PASO 1: Mayorizar ---- */
    let pasoHtml = '';

    if (pasoActual === 0) {
      const cuentasHtml = ej.cuentas.map((c, ci) => {
        const maxRows = Math.max(c.debe.length, c.haber.length, 3);
        let debeFilas = '';
        let haberFilas = '';

        for (let r = 0; r < maxRows; r++) {
          const vD  = rs.vals[`c${ci}_d${r}`] ?? '';
          const vH  = rs.vals[`c${ci}_h${r}`] ?? '';
          const clsD = rs.verificadoP1 ? (rs.errCol?.[ci]?.d ? 'err' : 'ok') : '';
          const clsH = rs.verificadoP1 ? (rs.errCol?.[ci]?.h ? 'err' : 'ok') : '';

          debeFilas  += `<input type="number" value="${vD}"  placeholder="0" class="${clsD}" onchange="Mayor.inputVal('c${ci}_d${r}', this.value)">`;
          haberFilas += `<input type="number" value="${vH}"  placeholder="0" class="${clsH}" onchange="Mayor.inputVal('c${ci}_h${r}', this.value)">`;
        }

        return `
          <div class="t-cuenta-wrap">
            <div class="t-cuenta-title">${c.nombre}</div>
            <div class="t-cuenta-grid">
              <div class="t-col-debe">
                <div class="t-col-title">DEBE</div>
                ${debeFilas}
              </div>
              <div class="t-col-haber">
                <div class="t-col-title">HABER</div>
                ${haberFilas}
              </div>
            </div>
          </div>`;
      }).join('');

      pasoHtml = `
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;margin-bottom:14px;">
          ${cuentasHtml}
        </div>
        ${(Progreso.isEvaluacion() && !evaluada) 
          ? `<button class="btn btn-primary btn-sm" onclick="Mayor.siguiente(1)">Siguiente <i class="ti ti-arrow-right"></i></button>` 
          : (!Progreso.isEvaluacion() ? `<button class="btn btn-primary btn-sm" onclick="Mayor.verificarPaso1()"><i class="ti ti-check" aria-hidden="true"></i> Verificar Movimientos</button>` : '')}`;

    /* ---- PASO 2: Sumas y Saldos ---- */
    } else if (pasoActual === 1) {
      const cuentasHtml = ej.cuentas.map((c, ci) => {
        const maxRows = Math.max(c.debe.length, c.haber.length, 3);
        let debeFilas  = '';
        let haberFilas = '';

        for (let r = 0; r < maxRows; r++) {
          const vD = rs.vals[`c${ci}_d${r}`] ?? '';
          const vH = rs.vals[`c${ci}_h${r}`] ?? '';
          // Mostrar los valores del Paso 1 como texto (solo lectura)
          debeFilas  += `<div class="t-val-readonly">${vD !== '' ? vD : '—'}</div>`;
          haberFilas += `<div class="t-val-readonly">${vH !== '' ? vH : '—'}</div>`;
        }

        const tD    = rs.vals[`c${ci}_totD`]     ?? '';
        const tH    = rs.vals[`c${ci}_totH`]     ?? '';
        const sTipo = rs.vals[`c${ci}_saldoTipo`] ?? '';
        const sVal  = rs.vals[`c${ci}_saldoVal`]  ?? '';

        const clsTD   = rs.verificadoP2 ? (Utils.numEq(tD, c.totD)       ? 'ok' : 'err') : '';
        const clsTH   = rs.verificadoP2 ? (Utils.numEq(tH, c.totH)       ? 'ok' : 'err') : '';
        const clsST   = rs.verificadoP2 ? (sTipo === c.saldoTipo           ? 'ok' : 'err') : '';
        const clsSV   = rs.verificadoP2 ? (Utils.numEq(sVal, c.saldoVal)  ? 'ok' : 'err') : '';

        return `
          <div class="t-cuenta-wrap">
            <div class="t-cuenta-title">${c.nombre}</div>
            <div class="t-cuenta-grid">
              <div class="t-col-debe">
                <div class="t-col-title">DEBE</div>
                ${debeFilas}
              </div>
              <div class="t-col-haber">
                <div class="t-col-title">HABER</div>
                ${haberFilas}
              </div>
            </div>
            <div class="t-total-row">
              <input type="number" value="${tD}" placeholder="Tot. Debe"  class="${clsTD}" style="width:48%;text-align:center" onchange="Mayor.inputVal('c${ci}_totD', this.value)">
              <input type="number" value="${tH}" placeholder="Tot. Haber" class="${clsTH}" style="width:48%;text-align:center" onchange="Mayor.inputVal('c${ci}_totH', this.value)">
            </div>
            <div class="t-saldo-row">
              <select class="${clsST}" onchange="Mayor.inputVal('c${ci}_saldoTipo', this.value)">
                <option value="">Tipo...</option>
                <option value="deudor"   ${sTipo === 'deudor'   ? 'selected' : ''}>Saldo Deudor</option>
                <option value="acreedor" ${sTipo === 'acreedor' ? 'selected' : ''}>Saldo Acreedor</option>
                <option value="saldada"  ${sTipo === 'saldada'  ? 'selected' : ''}>Cuenta Saldada</option>
              </select>
              <input type="number" value="${sVal}" placeholder="Saldo" class="${clsSV}" style="width:42%;text-align:right" onchange="Mayor.inputVal('c${ci}_saldoVal', this.value)">
            </div>
          </div>`;
      }).join('');

      pasoHtml = `
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;margin-bottom:14px;">
          ${cuentasHtml}
        </div>
        ${(Progreso.isEvaluacion() && !evaluada)
          ? `<button class="btn btn-primary btn-sm" onclick="Mayor.siguiente(2)">Siguiente <i class="ti ti-arrow-right"></i></button>`
          : (!Progreso.isEvaluacion() ? `<button class="btn btn-primary btn-sm" onclick="Mayor.verificarPaso2()"><i class="ti ti-check" aria-hidden="true"></i> Verificar Saldos</button>` : '')}`;

    /* ---- PASO 3: Balance de Comprobación ---- */
    } else if (pasoActual === 2) {
      const filasHtml = ej.cuentas.map((c, ci) => {
        const vSD  = rs.vals[`b${ci}_sumD`] ?? '';
        const vSH  = rs.vals[`b${ci}_sumH`] ?? '';
        const vSalD = rs.vals[`b${ci}_salD`] ?? '';
        const vSalA = rs.vals[`b${ci}_salA`] ?? '';

        // Para cuentas deudoras: el saldo va en Deudor y Acreedor queda en 0 (vacío)
        // Para cuentas acreedoras: el saldo va en Acreedor y Deudor queda en 0 (vacío)
        let salDOk = false, salAOk = false;
        const numSalD = parseFloat(vSalD || 0);
        const numSalA = parseFloat(vSalA || 0);
        if (c.saldoTipo === 'deudor') {
          salDOk = Utils.numEq(vSalD, c.saldoVal);
          salAOk = numSalA === 0;
        } else if (c.saldoTipo === 'acreedor') {
          salAOk = Utils.numEq(vSalA, c.saldoVal);
          salDOk = numSalD === 0;
        } else if (c.saldoTipo === 'saldada') {
          salDOk = numSalD === 0;
          salAOk = numSalA === 0;
        }

        const clsSD  = rs.verificadoP3 ? (Utils.numEq(vSD,  c.totD)  ? 'ok' : 'err') : '';
        const clsSH  = rs.verificadoP3 ? (Utils.numEq(vSH,  c.totH)  ? 'ok' : 'err') : '';
        const clsSalD = rs.verificadoP3 ? (salDOk ? 'ok' : 'err') : '';
        const clsSalA = rs.verificadoP3 ? (salAOk ? 'ok' : 'err') : '';

        return `
          <tr>
            <td>${c.nombre}</td>
            <td><input type="number" value="${vSD}"  class="${clsSD}"  onchange="Mayor.inputVal('b${ci}_sumD', this.value)"></td>
            <td><input type="number" value="${vSH}"  class="${clsSH}"  onchange="Mayor.inputVal('b${ci}_sumH', this.value)"></td>
            <td><input type="number" value="${vSalD}" class="${clsSalD}" onchange="Mayor.inputVal('b${ci}_salD', this.value)"></td>
            <td><input type="number" value="${vSalA}" class="${clsSalA}" onchange="Mayor.inputVal('b${ci}_salA', this.value)"></td>
          </tr>`;
      }).join('');

      const tSD  = rs.vals['b_totSumD']  ?? '';
      const tSH  = rs.vals['b_totSumH']  ?? '';
      const tSalD = rs.vals['b_totSalD'] ?? '';
      const tSalA = rs.vals['b_totSalA'] ?? '';

      const clsTSD  = rs.verificadoP3 ? (Utils.numEq(tSD,  ej.balSumas)  ? 'ok' : 'err') : '';
      const clsTSH  = rs.verificadoP3 ? (Utils.numEq(tSH,  ej.balSumas)  ? 'ok' : 'err') : '';
      const clsTSalD = rs.verificadoP3 ? (Utils.numEq(tSalD, ej.balSaldos) ? 'ok' : 'err') : '';
      const clsTSalA = rs.verificadoP3 ? (Utils.numEq(tSalA, ej.balSaldos) ? 'ok' : 'err') : '';

      pasoHtml = `
        <p style="font-size:13px;color:var(--text-secondary);margin-bottom:10px;">
          Trasladá las sumas y saldos de cada cuenta. Luego sumá las 4 columnas y verificá que <strong>Sumas Debe = Sumas Haber</strong> y <strong>Saldos Deudores = Saldos Acreedores</strong>.
        </p>
        <div class="bal-wrap">
          <table class="bal-table">
            <thead>
              <tr>
                <th rowspan="2" style="width:28%;text-align:left;padding-left:12px">Cuenta</th>
                <th colspan="2">Sumas</th>
                <th colspan="2">Saldos</th>
              </tr>
              <tr>
                <th>Debe</th>
                <th>Haber</th>
                <th>Deudor</th>
                <th>Acreedor</th>
              </tr>
            </thead>
            <tbody>
              ${filasHtml}
              <tr class="bal-total-row">
                <td style="text-align:right;padding-right:12px">TOTALES</td>
                <td><input type="number" value="${tSD}"  class="${clsTSD}"   onchange="Mayor.inputVal('b_totSumD', this.value)"></td>
                <td><input type="number" value="${tSH}"  class="${clsTSH}"   onchange="Mayor.inputVal('b_totSumH', this.value)"></td>
                <td><input type="number" value="${tSalD}" class="${clsTSalD}" onchange="Mayor.inputVal('b_totSalD', this.value)"></td>
                <td><input type="number" value="${tSalA}" class="${clsTSalA}" onchange="Mayor.inputVal('b_totSalA', this.value)"></td>
              </tr>
            </tbody>
          </table>
        </div>
        ${(Progreso.isEvaluacion() && !evaluada)
          ? `<button class="btn btn-primary btn-sm" style="margin-top:12px" onclick="Mayor.calificar()"><i class="ti ti-checklist" aria-hidden="true"></i> Finalizar y Calificar</button>`
          : (!Progreso.isEvaluacion() ? `<button class="btn btn-primary btn-sm" style="margin-top:12px" onclick="Mayor.verificarPaso3()"><i class="ti ti-check" aria-hidden="true"></i> Verificar Balance</button>` : '')}`;
    }

    /* --- mensajes de feedback --- */
    let msg = '';
    const isEval = Progreso.isEvaluacion();
    if (!isEval || evaluada) {
      if (rs.verificadoP1 && !rs.okP1 && pasoActual === 0) {
        msg = Utils.alert('err', 'alert-circle', 'Hay errores en los movimientos. Revisá que todos los importes estén en la columna correcta y no falte ninguno.');
      }
      if (rs.verificadoP2 && !rs.okP2 && pasoActual === 1) {
        msg = Utils.alert('err', 'alert-circle', 'Hay errores en las sumas o en la determinación del saldo. Revisá tus cálculos.');
      }
      if (rs.verificadoP3 && !rs.okP3 && pasoActual === 2) {
        msg = Utils.alert('err', 'alert-circle', 'Revisá la tabla. Sumas Debe = Sumas Haber, y Saldos Deudores = Saldos Acreedores.');
      }
    }

    /* --- botón de siguiente paso --- */
    let siguiente = '';
    if (!isEval) {
      if (pasoActual === 0 && rs.okP1) {
        siguiente = `
          <div style="margin-top:12px;display:flex;align-items:center;gap:10px">
            ${Utils.alert('ok', 'check', '¡Movimientos correctos!')}
            <button class="btn btn-success btn-sm" onclick="Mayor.siguiente(1)">Calcular Saldos <i class="ti ti-arrow-right"></i></button>
          </div>`;
      } else if (pasoActual === 1 && rs.okP2) {
        siguiente = `
          <div style="margin-top:12px;display:flex;align-items:center;gap:10px">
            ${Utils.alert('ok', 'check', '¡Saldos correctos!')}
            <button class="btn btn-success btn-sm" onclick="Mayor.siguiente(2)">Armar Balance <i class="ti ti-arrow-right"></i></button>
          </div>`;
      } else if (pasoActual === 2 && rs.okP3) {
        siguiente = `<div style="margin-top:12px">${Utils.alert('ok', 'trophy', '¡Balance perfecto! Ejercicio completado y progreso guardado.')}</div>`;
      }
    } else if (isEval && evaluada && pasoActual === 2) {
      let pct = 0;
      if (rs.okP1) pct += 33.3;
      if (rs.okP2) pct += 33.3;
      if (rs.okP3) pct += 33.4;
      pct = Math.round(pct);
      const aprobado = pct >= 70;
      
      if (aprobado) {
        Progreso.completar(MODULO, ejActual);
        App.refrescarProgreso();
      }

      siguiente = `
        <div class="score-card ${aprobado ? 'aprobado' : 'desaprobado'}" style="margin-top:1rem">
          <div class="score-card-title">Resultado de la Evaluación</div>
          <div class="score-card-value">${pct}%</div>
          <div class="score-card-badge">${aprobado ? 'Aprobado ✓' : 'Reprobado ✗'}</div>
          <div class="score-card-desc">
            ${aprobado 
              ? '¡Excelente! Has demostrado un buen dominio. Tu progreso ha sido registrado.' 
              : 'No alcanzaste el 70% requerido para aprobar. ¡Inténtalo de nuevo!'}
          </div>
          <button class="btn btn-primary btn-sm" style="margin-top:14px" onclick="Mayor.selectEj(${ejActual})">
            <i class="ti ti-rotate" aria-hidden="true"></i> Reintentar
          </button>
        </div>`;
    }

    const titulos = [
      'Paso 1 — Trasladá los movimientos a las cuentas T',
      'Paso 2 — Calculá sumas y determiná el saldo',
      'Paso 3 — Balance de Comprobación de Sumas y Saldos'
    ];

    root.innerHTML = `
      <div class="panel-body">
        <div class="teoria">
          <strong>Libro Mayor y Balance:</strong> Mayorizá en las cuentas T, calculá los saldos y luego completá el Balance de Comprobación para verificar la partida doble.
        </div>
        <div class="ej-grid">${tarjetas}</div>
        <div class="card">
          <div class="alert alert-info" style="margin:0 0 1rem"><i class="ti ti-info-circle"></i><span>${ej.contexto}</span></div>
          ${Utils.buildProgress(3, pasoActual)}
          <div class="step-box">
            <div class="step-box-header">
              <span class="step-number active">${pasoActual + 1}</span>
              <span class="step-title">${titulos[pasoActual]}</span>
            </div>
            <div class="step-body">
              ${pasoHtml}
              ${msg}
              ${siguiente}
            </div>
          </div>
        </div>
      </div>`;
  }

  /* -------------------------------------------------- */
  /*  FUNCIONES DE CONTROL                               */
  /* -------------------------------------------------- */
  function selectEj(idx) {
    ejActual   = idx;
    pasoActual = 0;
    evaluada = false;
    respuestas = { vals: {}, errCol: [] };
    render();
  }

  function inputVal(campo, val) {
    if (evaluada) return;
    if (!respuestas.vals) respuestas.vals = {};
    respuestas.vals[campo] = val;
  }

  function verificarPaso1() {
    const ej = EJERCICIOS[ejActual];
    respuestas.verificadoP1 = true;
    respuestas.errCol = [];
    let todoOk = true;

    ej.cuentas.forEach((c, ci) => {
      const maxRows = Math.max(c.debe.length, c.haber.length, 3);
      let userDebe = [], userHaber = [];

      for (let r = 0; r < maxRows; r++) {
        const d = parseFloat(respuestas.vals[`c${ci}_d${r}`]);
        if (d > 0) userDebe.push(d);
        const h = parseFloat(respuestas.vals[`c${ci}_h${r}`]);
        if (h > 0) userHaber.push(h);
      }

      userDebe.sort((a,b) => a-b);
      userHaber.sort((a,b) => a-b);
      const expDebe  = [...c.debe].sort((a,b) => a-b);
      const expHaber = [...c.haber].sort((a,b) => a-b);

      const dOk = JSON.stringify(userDebe)  === JSON.stringify(expDebe);
      const hOk = JSON.stringify(userHaber) === JSON.stringify(expHaber);

      respuestas.errCol[ci] = { d: !dOk, h: !hOk };
      if (!dOk || !hOk) todoOk = false;
    });

    respuestas.okP1 = todoOk;
    if (!arguments[0]) render();
  }

  function verificarPaso2() {
    const ej = EJERCICIOS[ejActual];
    respuestas.verificadoP2 = true;
    let todoOk = true;

    ej.cuentas.forEach((c, ci) => {
      const tD    = parseFloat(respuestas.vals[`c${ci}_totD`]      || 0);
      const tH    = parseFloat(respuestas.vals[`c${ci}_totH`]      || 0);
      const sTipo = respuestas.vals[`c${ci}_saldoTipo`]             || '';
      const sVal  = parseFloat(respuestas.vals[`c${ci}_saldoVal`]  || 0);

      if (!Utils.numEq(tD, c.totD) || !Utils.numEq(tH, c.totH) ||
          sTipo !== c.saldoTipo     || !Utils.numEq(sVal, c.saldoVal)) {
        todoOk = false;
      }
    });

    respuestas.okP2 = todoOk;
    if (!arguments[0]) render();
  }

  function verificarPaso3() {
    const ej = EJERCICIOS[ejActual];
    respuestas.verificadoP3 = true;
    let todoOk = true;

    ej.cuentas.forEach((c, ci) => {
      const vSD  = parseFloat(respuestas.vals[`b${ci}_sumD`]  || 0);
      const vSH  = parseFloat(respuestas.vals[`b${ci}_sumH`]  || 0);
      const vSalD = parseFloat(respuestas.vals[`b${ci}_salD`] || 0);
      const vSalA = parseFloat(respuestas.vals[`b${ci}_salA`] || 0);

      let salDOk = false, salAOk = false;
      if (c.saldoTipo === 'deudor') {
        salDOk = Utils.numEq(vSalD, c.saldoVal);
        salAOk = vSalA === 0;
      } else if (c.saldoTipo === 'acreedor') {
        salAOk = Utils.numEq(vSalA, c.saldoVal);
        salDOk = vSalD === 0;
      } else if (c.saldoTipo === 'saldada') {
        salDOk = vSalD === 0;
        salAOk = vSalA === 0;
      }

      if (!Utils.numEq(vSD, c.totD) || !Utils.numEq(vSH, c.totH) || !salDOk || !salAOk) {
        todoOk = false;
      }
    });

    const tSD   = parseFloat(respuestas.vals['b_totSumD']  || 0);
    const tSH   = parseFloat(respuestas.vals['b_totSumH']  || 0);
    const tSalD = parseFloat(respuestas.vals['b_totSalD']  || 0);
    const tSalA = parseFloat(respuestas.vals['b_totSalA']  || 0);

    if (!Utils.numEq(tSD, ej.balSumas)  || !Utils.numEq(tSH,  ej.balSumas)  ||
        !Utils.numEq(tSalD, ej.balSaldos) || !Utils.numEq(tSalA, ej.balSaldos)) {
      todoOk = false;
    }

    respuestas.okP3 = todoOk;
    if (todoOk && !Progreso.isEvaluacion()) {
      Progreso.completar(MODULO, ejActual);
      App.refrescarProgreso();
    }
    if (!arguments[0]) render();
  }

  function calificar() {
    evaluada = true;
    verificarPaso1(true);
    verificarPaso2(true);
    verificarPaso3(true);
    render();
  }

  function siguiente(paso) {
    pasoActual = paso;
    render();
  }

  function init() {
    evaluada = false;
    respuestas = { vals: {}, errCol: [] };
    render();
  }

  return { init, selectEj, inputVal, verificarPaso1, verificarPaso2, verificarPaso3, calificar, siguiente, EJERCICIOS };

})();
