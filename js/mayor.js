/* =========================================
   ContaEdu — Módulo: Libro Mayor v1
   ========================================= */

const Mayor = (() => {

  const MODULO = 'mayor';

  const EJERCICIOS = [
    {
      titulo: 'Mayorización Básica',
      subtitulo: 'Caja y Banco',
      contexto: `
        <strong>Libro Diario (Resumen):</strong><br>
        1. Inicio: Caja $10.000 y Banco $20.000 a Capital $30.000.<br>
        2. Compra de un escritorio por $5.000 pagando en efectivo (Caja).<br>
        3. Depósito en Banco de $2.000 en efectivo (Caja).
      `,
      cuentas: [
        {
          nombre: 'Caja',
          debe: [10000],
          haber: [5000, 2000],
          totD: 10000,
          totH: 7000,
          saldoTipo: 'deudor',
          saldoVal: 3000
        },
        {
          nombre: 'Banco cta. cte.',
          debe: [20000, 2000],
          haber: [],
          totD: 22000,
          totH: 0,
          saldoTipo: 'deudor',
          saldoVal: 22000
        }
      ]
    },
    {
      titulo: 'Operaciones Comerciales',
      subtitulo: 'Mercaderías, Ventas y CMV',
      contexto: `
        <strong>Libro Diario (Resumen):</strong><br>
        1. Compra de Mercaderías por $10.000 a crédito (Proveedores).<br>
        2. Venta de Mercaderías por $15.000 cobrando en efectivo.<br>
        3. Costo de Mercaderías Vendidas (CMV) por $6.000.
      `,
      cuentas: [
        {
          nombre: 'Mercaderías',
          debe: [10000],
          haber: [6000],
          totD: 10000,
          totH: 6000,
          saldoTipo: 'deudor',
          saldoVal: 4000
        },
        {
          nombre: 'Ventas',
          debe: [],
          haber: [15000],
          totD: 0,
          totH: 15000,
          saldoTipo: 'acreedor',
          saldoVal: 15000
        },
        {
          nombre: 'C.M.V.',
          debe: [6000],
          haber: [],
          totD: 6000,
          totH: 0,
          saldoTipo: 'deudor',
          saldoVal: 6000
        },
        {
          nombre: 'Proveedores',
          debe: [],
          haber: [10000],
          totD: 0,
          totH: 10000,
          saldoTipo: 'acreedor',
          saldoVal: 10000
        }
      ]
    }
  ];

  let ejActual = 0;
  let pasoActual = 0; // 0: Mayorizar, 1: Saldos
  let respuestas = {};

  /* ---- RENDER PRINCIPAL ---- */
  function render() {
    const root = document.getElementById('mayor-root');
    if (!root) return;

    const tarjetas = EJERCICIOS.map((e, i) => {
      const yaCompleto = Progreso.estaCompleto(MODULO, i);
      return `
        <div class="ej-card ${ejActual === i ? 'selected' : ''}" onclick="Mayor.selectEj(${i})">
          ${yaCompleto ? \`<span class="ej-completado"><i class="ti ti-check" aria-hidden="true"></i></span>\` : ''}
          <div class="ej-card-title">\${e.titulo}</div>
          <div class="ej-card-sub">\${e.subtitulo}</div>
        </div>`;
    }).join('');

    const ej = EJERCICIOS[ejActual];
    const rs = respuestas;

    let pasoHtml = '';

    if (pasoActual === 0) {
      // Paso 1: Mayorizar
      let cuentasHtml = ej.cuentas.map((c, i) => {
        // Filas dinámicas según el máximo de movimientos esperados, con mínimo de 3
        const maxRows = Math.max(c.debe.length, c.haber.length, 3);
        
        let rowsHtml = '';
        for (let r = 0; r < maxRows; r++) {
          const vD = rs.vals?.[\`c\${i}_d\${r}\`] ?? '';
          const vH = rs.vals?.[\`c\${i}_h\${r}\`] ?? '';
          
          let clsD = '', clsH = '';
          if (rs.verificadoP1) {
            // Verificación simplificada: comprobamos si los importes ingresados coinciden en algún orden con los esperados
            // Para simplificar, la validación se hará a nivel global por columna
          }

          rowsHtml += \`
            <div class="t-row">
              <div style="flex:1; padding-right:5px">
                <input type="number" id="inp_c\${i}_d\${r}" value="\${vD}" placeholder="0" 
                  onchange="Mayor.inputVal('c\${i}_d\${r}', this.value)"
                  class="\${rs.verificadoP1 ? (rs.errCol?.[i]?.d ? 'err' : 'ok') : ''}">
              </div>
              <div style="flex:1; padding-left:5px">
                <input type="number" id="inp_c\${i}_h\${r}" value="\${vH}" placeholder="0" 
                  onchange="Mayor.inputVal('c\${i}_h\${r}', this.value)"
                  class="\${rs.verificadoP1 ? (rs.errCol?.[i]?.h ? 'err' : 'ok') : ''}">
              </div>
            </div>
          \`;
        }

        return \`
          <div class="t-cuenta-wrap">
            <div class="t-cuenta-title">\${c.nombre}</div>
            <div class="t-cuenta-grid">
              <div class="t-col-debe">
                <div class="t-col-title">DEBE</div>
                \${rowsHtml}
              </div>
              <div class="t-col-haber">
                <div class="t-col-title">HABER</div>
                <!-- El HTML de rows maneja ambas columnas, la línea separadora se da por CSS -->
              </div>
            </div>
          </div>
        \`;
      }).join('');

      pasoHtml = \`
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:16px; margin-bottom:12px;">
          \${cuentasHtml}
        </div>
        <button class="btn btn-primary btn-sm" onclick="Mayor.verificarPaso1()">
          <i class="ti ti-check" aria-hidden="true"></i> Verificar Movimientos
        </button>
      \`;

    } else if (pasoActual === 1) {
      // Paso 2: Calcular saldos
      let cuentasHtml = ej.cuentas.map((c, i) => {
        const tD = rs.vals?.[\`c\${i}_totD\`] ?? '';
        const tH = rs.vals?.[\`c\${i}_totH\`] ?? '';
        const sTipo = rs.vals?.[\`c\${i}_saldoTipo\`] ?? '';
        const sVal = rs.vals?.[\`c\${i}_saldoVal\`] ?? '';

        return \`
          <div class="t-cuenta-wrap">
            <div class="t-cuenta-title">\${c.nombre}</div>
            <div class="t-cuenta-grid">
              <div class="t-col-debe">
                <div class="t-col-title">DEBE</div>
                <div class="t-row"><span style="color:var(--text-muted);font-size:12px">Movimientos OK</span></div>
              </div>
              <div class="t-col-haber">
                <div class="t-col-title">HABER</div>
                <div class="t-row"><span style="color:var(--text-muted);font-size:12px">Movimientos OK</span></div>
              </div>
            </div>
            <div class="t-total-row">
              <input type="number" value="\${tD}" placeholder="Total Debe" style="width:48%; text-align:center"
                onchange="Mayor.inputVal('c\${i}_totD', this.value)"
                class="\${rs.verificadoP2 ? (Utils.numEq(tD, c.totD) ? 'ok' : 'err') : ''}">
              <input type="number" value="\${tH}" placeholder="Total Haber" style="width:48%; text-align:center"
                onchange="Mayor.inputVal('c\${i}_totH', this.value)"
                class="\${rs.verificadoP2 ? (Utils.numEq(tH, c.totH) ? 'ok' : 'err') : ''}">
            </div>
            <div class="t-saldo-row">
              <select onchange="Mayor.inputVal('c\${i}_saldoTipo', this.value)"
                class="\${rs.verificadoP2 ? (sTipo === c.saldoTipo ? 'ok' : 'err') : ''}">
                <option value="">Tipo de saldo...</option>
                <option value="deudor" \${sTipo === 'deudor' ? 'selected' : ''}>Saldo Deudor</option>
                <option value="acreedor" \${sTipo === 'acreedor' ? 'selected' : ''}>Saldo Acreedor</option>
                <option value="saldada" \${sTipo === 'saldada' ? 'selected' : ''}>Cuenta Saldada</option>
              </select>
              <input type="number" value="\${sVal}" placeholder="Monto Saldo" style="width:40%; text-align:right"
                onchange="Mayor.inputVal('c\${i}_saldoVal', this.value)"
                class="\${rs.verificadoP2 ? (Utils.numEq(sVal, c.saldoVal) ? 'ok' : 'err') : ''}">
            </div>
          </div>
        \`;
      }).join('');

      pasoHtml = \`
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:16px; margin-bottom:12px;">
          \${cuentasHtml}
        </div>
        <button class="btn btn-primary btn-sm" onclick="Mayor.verificarPaso2()">
          <i class="ti ti-check" aria-hidden="true"></i> Verificar Saldos
        </button>
      \`;
    }

    let msg = '';
    if (rs.verificadoP1 && !rs.okP1 && pasoActual === 0) {
      msg = Utils.alert('err', 'alert-circle', 'Hay errores en los movimientos ingresados. Revisa que no falte ni sobre ningún importe y estén en la columna correcta.');
    }
    if (rs.verificadoP2 && !rs.okP2 && pasoActual === 1) {
      msg = Utils.alert('err', 'alert-circle', 'Hay errores en las sumas o en la determinación del saldo. Revisa tus cálculos.');
    }

    let siguiente = '';
    if (pasoActual === 0 && rs.okP1) {
      siguiente = \`
        <div style="margin-top:10px; display:flex; align-items:center; gap:10px">
          \${Utils.alert('ok', 'check', '¡Movimientos correctos!')}
          <button class="btn btn-success btn-sm" onclick="Mayor.siguiente()">Calcular Saldos <i class="ti ti-arrow-right"></i></button>
        </div>\`;
    } else if (pasoActual === 1 && rs.okP2) {
      siguiente = \`<div style="margin-top:10px">\${Utils.alert('ok', 'trophy', '¡Mayorización completa! Progreso guardado.')}</div>\`;
    }

    root.innerHTML = \`
      <div class="panel-body">
        <div class="teoria">
          <strong>Libro Mayor:</strong> Trasladá los importes del Libro Diario a las cuentas "T". Luego, sumá ambas columnas y calculá la diferencia para obtener el saldo.
        </div>
        <div class="ej-grid">\${tarjetas}</div>
        <div class="card">
          <div class="alert alert-info" style="margin:0 0 1rem"><i class="ti ti-info-circle"></i><span>\${ej.contexto}</span></div>
          \${Utils.buildProgress(2, pasoActual)}
          <div class="step-box">
            <div class="step-box-header">
              <span class="step-number active">\${pasoActual + 1}</span>
              <span class="step-title">\${pasoActual === 0 ? 'Paso 1: Mayorizar Movimientos' : 'Paso 2: Calcular Sumas y Saldos'}</span>
            </div>
            <div class="step-body">
              \${pasoHtml}
              \${msg}
              \${siguiente}
            </div>
          </div>
        </div>
      </div>
    \`;
  }

  function selectEj(idx) {
    ejActual = idx;
    pasoActual = 0;
    respuestas = { vals: {}, errCol: [] };
    render();
  }

  function inputVal(campo, val) {
    if (!respuestas.vals) respuestas.vals = {};
    respuestas.vals[campo] = val;
  }

  function verificarPaso1() {
    const ej = EJERCICIOS[ejActual];
    respuestas.verificadoP1 = true;
    respuestas.errCol = [];
    let todoOk = true;

    ej.cuentas.forEach((c, i) => {
      // Agrupar los valores ingresados por columna, ignorando vacíos o ceros
      let userDebe = [];
      let userHaber = [];
      const maxRows = Math.max(c.debe.length, c.haber.length, 3);
      
      for (let r = 0; r < maxRows; r++) {
        let valD = parseFloat(respuestas.vals[\`c\${i}_d\${r}\`]);
        if (valD > 0) userDebe.push(valD);
        
        let valH = parseFloat(respuestas.vals[\`c\${i}_h\${r}\`]);
        if (valH > 0) userHaber.push(valH);
      }

      // Ordenar para comparar independientemente del orden de ingreso
      userDebe.sort((a,b)=>a-b);
      userHaber.sort((a,b)=>a-b);
      
      let expDebe = [...c.debe].sort((a,b)=>a-b);
      let expHaber = [...c.haber].sort((a,b)=>a-b);

      const dOk = JSON.stringify(userDebe) === JSON.stringify(expDebe);
      const hOk = JSON.stringify(userHaber) === JSON.stringify(expHaber);

      respuestas.errCol[i] = { d: !dOk, h: !hOk };
      
      if (!dOk || !hOk) todoOk = false;
    });

    respuestas.okP1 = todoOk;
    render();
  }

  function verificarPaso2() {
    const ej = EJERCICIOS[ejActual];
    respuestas.verificadoP2 = true;
    let todoOk = true;

    ej.cuentas.forEach((c, i) => {
      const tD = parseFloat(respuestas.vals[\`c\${i}_totD\`] || 0);
      const tH = parseFloat(respuestas.vals[\`c\${i}_totH\`] || 0);
      const sTipo = respuestas.vals[\`c\${i}_saldoTipo\`] || '';
      const sVal = parseFloat(respuestas.vals[\`c\${i}_saldoVal\`] || 0);

      if (!Utils.numEq(tD, c.totD) || 
          !Utils.numEq(tH, c.totH) || 
          sTipo !== c.saldoTipo || 
          !Utils.numEq(sVal, c.saldoVal)) {
        todoOk = false;
      }
    });

    respuestas.okP2 = todoOk;
    if (todoOk) {
      Progreso.completar(MODULO, ejActual);
      App.refrescarProgreso();
    }
    render();
  }

  function siguiente() {
    pasoActual = 1;
    render();
  }

  function init() {
    respuestas = { vals: {}, errCol: [] };
    render();
  }

  return { init, selectEj, inputVal, verificarPaso1, verificarPaso2, siguiente };

})();
