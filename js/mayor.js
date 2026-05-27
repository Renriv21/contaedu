/* =========================================
   ContaEdu — Módulo: Libro Mayor v1
   ========================================= */

const Mayor = (() => {

  const MODULO = 'mayor';

  const EJERCICIOS = [
    {
      titulo: 'Mayorización Básica',
      subtitulo: 'Caja, Banco, Capital y Muebles',
      contexto: `
        <strong>Libro Diario (Resumen):</strong><br>
        1. Inicio: Caja $10.000 y Banco $20.000 a Capital $30.000.<br>
        2. Compra de Muebles y Útiles por $5.000 pagando en efectivo (Caja).<br>
        3. Depósito en Banco de $2.000 en efectivo (Caja).
      `,
      cuentas: [
        { nombre: 'Caja', debe: [10000], haber: [5000, 2000], totD: 10000, totH: 7000, saldoTipo: 'deudor', saldoVal: 3000 },
        { nombre: 'Banco cta. cte.', debe: [20000, 2000], haber: [], totD: 22000, totH: 0, saldoTipo: 'deudor', saldoVal: 22000 },
        { nombre: 'Capital', debe: [], haber: [30000], totD: 0, totH: 30000, saldoTipo: 'acreedor', saldoVal: 30000 },
        { nombre: 'Muebles y Útiles', debe: [5000], haber: [], totD: 5000, totH: 0, saldoTipo: 'deudor', saldoVal: 5000 }
      ],
      balSumas: 37000,
      balSaldos: 30000
    },
    {
      titulo: 'Operaciones Comerciales',
      subtitulo: 'Mercaderías, Ventas, Caja y Proveedores',
      contexto: `
        <strong>Libro Diario (Resumen):</strong><br>
        1. Compra de Mercaderías por $10.000 a crédito (Proveedores).<br>
        2. Venta de Mercaderías por $15.000 cobrando en efectivo (Caja).<br>
        3. Costo de Mercaderías Vendidas (CMV) por $6.000.
      `,
      cuentas: [
        { nombre: 'Mercaderías', debe: [10000], haber: [6000], totD: 10000, totH: 6000, saldoTipo: 'deudor', saldoVal: 4000 },
        { nombre: 'Proveedores', debe: [], haber: [10000], totD: 0, totH: 10000, saldoTipo: 'acreedor', saldoVal: 10000 },
        { nombre: 'Caja', debe: [15000], haber: [], totD: 15000, totH: 0, saldoTipo: 'deudor', saldoVal: 15000 },
        { nombre: 'Ventas', debe: [], haber: [15000], totD: 0, totH: 15000, saldoTipo: 'acreedor', saldoVal: 15000 },
        { nombre: 'C.M.V.', debe: [6000], haber: [], totD: 6000, totH: 0, saldoTipo: 'deudor', saldoVal: 6000 }
      ],
      balSumas: 31000,
      balSaldos: 25000
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
    } else if (pasoActual === 2) {
      // Paso 3: Balance de Sumas y Saldos
      let filasHtml = ej.cuentas.map((c, i) => {
        const vSD = rs.vals?.[\`b\${i}_sumD\`] ?? '';
        const vSH = rs.vals?.[\`b\${i}_sumH\`] ?? '';
        const vSalD = rs.vals?.[\`b\${i}_salD\`] ?? '';
        const vSalA = rs.vals?.[\`b\${i}_salA\`] ?? '';
        
        let salDOk = false, salAOk = false;
        if (c.saldoTipo === 'deudor') { salDOk = Utils.numEq(vSalD, c.saldoVal); salAOk = vSalA === '' || vSalA == 0; }
        else if (c.saldoTipo === 'acreedor') { salAOk = Utils.numEq(vSalA, c.saldoVal); salDOk = vSalD === '' || vSalD == 0; }
        else { salDOk = vSalD === '' || vSalD == 0; salAOk = vSalA === '' || vSalA == 0; }

        return \`
          <tr class="bal-row">
            <td>\${c.nombre}</td>
            <td><input type="number" value="\${vSD}" onchange="Mayor.inputVal('b\${i}_sumD', this.value)" class="\${rs.verificadoP3 ? (Utils.numEq(vSD, c.totD) ? 'ok' : 'err') : ''}"></td>
            <td><input type="number" value="\${vSH}" onchange="Mayor.inputVal('b\${i}_sumH', this.value)" class="\${rs.verificadoP3 ? (Utils.numEq(vSH, c.totH) ? 'ok' : 'err') : ''}"></td>
            <td><input type="number" value="\${vSalD}" onchange="Mayor.inputVal('b\${i}_salD', this.value)" class="\${rs.verificadoP3 ? (salDOk ? 'ok' : 'err') : ''}"></td>
            <td><input type="number" value="\${vSalA}" onchange="Mayor.inputVal('b\${i}_salA', this.value)" class="\${rs.verificadoP3 ? (salAOk ? 'ok' : 'err') : ''}"></td>
          </tr>
        \`;
      }).join('');

      const tSD = rs.vals?.['b_totSumD'] ?? '';
      const tSH = rs.vals?.['b_totSumH'] ?? '';
      const tSalD = rs.vals?.['b_totSalD'] ?? '';
      const tSalA = rs.vals?.['b_totSalA'] ?? '';

      pasoHtml = \`
        <div class="bal-wrap">
          <table class="bal-table">
            <thead>
              <tr>
                <th rowspan="2" style="width:30%">Cuentas</th>
                <th colspan="2">Sumas</th>
                <th colspan="2">Saldos</th>
              </tr>
              <tr>
                <th>Debe</th><th>Haber</th><th>Deudor</th><th>Acreedor</th>
              </tr>
            </thead>
            <tbody>
              \${filasHtml}
              <tr class="bal-total-row">
                <td style="text-align:right">TOTALES</td>
                <td><input type="number" value="\${tSD}" onchange="Mayor.inputVal('b_totSumD', this.value)" class="\${rs.verificadoP3 ? (Utils.numEq(tSD, ej.balSumas) ? 'ok' : 'err') : ''}"></td>
                <td><input type="number" value="\${tSH}" onchange="Mayor.inputVal('b_totSumH', this.value)" class="\${rs.verificadoP3 ? (Utils.numEq(tSH, ej.balSumas) ? 'ok' : 'err') : ''}"></td>
                <td><input type="number" value="\${tSalD}" onchange="Mayor.inputVal('b_totSalD', this.value)" class="\${rs.verificadoP3 ? (Utils.numEq(tSalD, ej.balSaldos) ? 'ok' : 'err') : ''}"></td>
                <td><input type="number" value="\${tSalA}" onchange="Mayor.inputVal('b_totSalA', this.value)" class="\${rs.verificadoP3 ? (Utils.numEq(tSalA, ej.balSaldos) ? 'ok' : 'err') : ''}"></td>
              </tr>
            </tbody>
          </table>
        </div>
        <button class="btn btn-primary btn-sm" style="margin-top:12px" onclick="Mayor.verificarPaso3()">
          <i class="ti ti-check" aria-hidden="true"></i> Verificar Balance
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

    if (rs.verificadoP3 && !rs.okP3 && pasoActual === 2) {
      msg = Utils.alert('err', 'alert-circle', 'Revisa la tabla. Recuerda que las sumas del Debe deben igualar al Haber, y los saldos Deudores a los Acreedores.');
    }

    let siguiente = '';
    if (pasoActual === 0 && rs.okP1) {
      siguiente = \`
        <div style="margin-top:10px; display:flex; align-items:center; gap:10px">
          \${Utils.alert('ok', 'check', '¡Movimientos correctos!')}
          <button class="btn btn-success btn-sm" onclick="Mayor.siguiente(1)">Calcular Saldos <i class="ti ti-arrow-right"></i></button>
        </div>\`;
    } else if (pasoActual === 1 && rs.okP2) {
      siguiente = \`
        <div style="margin-top:10px; display:flex; align-items:center; gap:10px">
          \${Utils.alert('ok', 'check', '¡Saldos correctos!')}
          <button class="btn btn-success btn-sm" onclick="Mayor.siguiente(2)">Armar Balance <i class="ti ti-arrow-right"></i></button>
        </div>\`;
    } else if (pasoActual === 2 && rs.okP3) {
      siguiente = \`<div style="margin-top:10px">\${Utils.alert('ok', 'trophy', '¡Balance perfecto! Ejercicio completado y progreso guardado.')}</div>\`;
    }

    const titulos = ['Paso 1: Mayorizar Movimientos', 'Paso 2: Calcular Sumas y Saldos', 'Paso 3: Balance de Sumas y Saldos'];

    root.innerHTML = \`
      <div class="panel-body">
        <div class="teoria">
          <strong>Libro Mayor y Balance:</strong> Mayorizá, sacá los saldos y luego arma el Balance de Comprobación verificando la partida doble.
        </div>
        <div class="ej-grid">\${tarjetas}</div>
        <div class="card">
          <div class="alert alert-info" style="margin:0 0 1rem"><i class="ti ti-info-circle"></i><span>\${ej.contexto}</span></div>
          \${Utils.buildProgress(3, pasoActual)}
          <div class="step-box">
            <div class="step-box-header">
              <span class="step-number active">\${pasoActual + 1}</span>
              <span class="step-title">\${titulos[pasoActual]}</span>
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
    render();
  }

  function verificarPaso3() {
    const ej = EJERCICIOS[ejActual];
    respuestas.verificadoP3 = true;
    let todoOk = true;

    ej.cuentas.forEach((c, i) => {
      const vSD = parseFloat(respuestas.vals[\`b\${i}_sumD\`] || 0);
      const vSH = parseFloat(respuestas.vals[\`b\${i}_sumH\`] || 0);
      const vSalD = parseFloat(respuestas.vals[\`b\${i}_salD\`] || 0);
      const vSalA = parseFloat(respuestas.vals[\`b\${i}_salA\`] || 0);
      
      let salDOk = false, salAOk = false;
      if (c.saldoTipo === 'deudor') { salDOk = Utils.numEq(vSalD, c.saldoVal); salAOk = vSalA === 0; }
      else if (c.saldoTipo === 'acreedor') { salAOk = Utils.numEq(vSalA, c.saldoVal); salDOk = vSalD === 0; }
      else { salDOk = vSalD === 0; salAOk = vSalA === 0; }

      if (!Utils.numEq(vSD, c.totD) || !Utils.numEq(vSH, c.totH) || !salDOk || !salAOk) {
        todoOk = false;
      }
    });

    const tSD = parseFloat(respuestas.vals['b_totSumD'] || 0);
    const tSH = parseFloat(respuestas.vals['b_totSumH'] || 0);
    const tSalD = parseFloat(respuestas.vals['b_totSalD'] || 0);
    const tSalA = parseFloat(respuestas.vals['b_totSalA'] || 0);

    if (!Utils.numEq(tSD, ej.balSumas) || !Utils.numEq(tSH, ej.balSumas) || 
        !Utils.numEq(tSalD, ej.balSaldos) || !Utils.numEq(tSalA, ej.balSaldos)) {
      todoOk = false;
    }

    respuestas.okP3 = todoOk;
    if (todoOk) {
      Progreso.completar(MODULO, ejActual);
      App.refrescarProgreso();
    }
    render();
  }

  function siguiente(paso) {
    pasoActual = paso;
    render();
  }

  function init() {
    respuestas = { vals: {}, errCol: [] };
    render();
  }

  return { init, selectEj, inputVal, verificarPaso1, verificarPaso2, verificarPaso3, siguiente };

})();
