/* =========================================
   ContaEdu — Módulo: Exportar a PDF v1
   Genera un reporte HTML en nueva ventana
   y activa el diálogo de impresión/PDF
   ========================================= */

const PDFExport = (() => {

  /* ---- DATOS DE CADA MÓDULO ---- */

  function getDatosPlan() {
    const data = Progreso.cargar();
    const modData = data['plan'] || {};
    const ejs = PlanCuentas.EJERCICIOS || [];
    return ejs.map((ej, i) => ({
      titulo:     ej.titulo,
      completado: modData[i]?.completado || false,
      fecha:      modData[i]?.fecha || '—',
      total:      ej.items ? ej.items.length : 0,
    }));
  }

  function getDatosAsientos() {
    const data = Progreso.cargar();
    const modData = data['asientos'] || {};
    const ejs = Asientos.EJERCICIOS || [];
    return ejs.map((ej, i) => ({
      titulo:     ej.titulo,
      completado: modData[i]?.completado || false,
      fecha:      modData[i]?.fecha || '—',
      pasos:      ej.pasos ? ej.pasos.length : 0,
    }));
  }

  function getDatosIVA() {
    const data = Progreso.cargar();
    const modData = data['iva'] || {};
    const ejs = IVA.EJERCICIOS || [];
    return ejs.map((ej, i) => ({
      titulo:     ej.titulo,
      completado: modData[i]?.completado || false,
      fecha:      modData[i]?.fecha || '—',
      ops:        ej.ops ? ej.ops.length : 0,
    }));
  }

  function getDatosConcil() {
    const data = Progreso.cargar();
    const modData = data['concil'] || {};
    const ejs = Conciliacion.EJERCICIOS || [];
    return ejs.map((ej, i) => ({
      titulo:     ej.titulo,
      completado: modData[i]?.completado || false,
      fecha:      modData[i]?.fecha || '—',
      partidas:   ej.partidas ? ej.partidas.length : 0,
    }));
  }

  function getDatosMayor() {
    const data = Progreso.cargar();
    const modData = data['mayor'] || {};
    const ejs = Mayor.EJERCICIOS || [];
    return ejs.map((ej, i) => ({
      titulo:     ej.titulo,
      completado: modData[i]?.completado || false,
      fecha:      modData[i]?.fecha || '—',
      cuentas:    ej.cuentas ? ej.cuentas.length : 0,
    }));
  }

  /* ---- HTML DEL REPORTE ---- */

  function buildHTML(nombreAlumno) {
    const ahora     = new Date();
    const fechaStr  = ahora.toLocaleDateString('es-AR', { day:'2-digit', month:'long', year:'numeric' });
    const horaStr   = ahora.toLocaleTimeString('es-AR', { hour:'2-digit', minute:'2-digit' });
    const pct       = Progreso.porcentajeGlobal();

    const plan     = getDatosPlan();
    const asientos = getDatosAsientos();
    const iva      = getDatosIVA();
    const concil   = getDatosConcil();
    const mayor    = getDatosMayor();

    function filaEj(ej, detalle) {
      const estado = ej.completado
        ? `<span class="ok">✓ Completo</span>`
        : `<span class="pend">Pendiente</span>`;
      return `
        <tr>
          <td>${ej.titulo}</td>
          <td>${detalle}</td>
          <td>${estado}</td>
          <td>${ej.completado ? ej.fecha : '—'}</td>
        </tr>`;
    }

    function seccion(titulo, icono, filas, completados, total) {
      const pctSec = total > 0 ? Math.round((completados / total) * 100) : 0;
      return `
        <div class="seccion">
          <div class="seccion-header">
            <span class="seccion-icono">${icono}</span>
            <span class="seccion-titulo">${titulo}</span>
            <span class="seccion-pct">${completados}/${total} ejercicios — ${pctSec}%</span>
          </div>
          <table>
            <thead>
              <tr><th>Ejercicio</th><th>Detalle</th><th>Estado</th><th>Fecha</th></tr>
            </thead>
            <tbody>${filas}</tbody>
          </table>
        </div>`;
    }

    const planCompletados    = plan.filter(e=>e.completado).length;
    const asientosCompletados = asientos.filter(e=>e.completado).length;
    const ivaCompletados     = iva.filter(e=>e.completado).length;
    const concilCompletados  = concil.filter(e=>e.completado).length;
    const mayorCompletados   = mayor.filter(e=>e.completado).length;
    const totalCompletados   = planCompletados + asientosCompletados + ivaCompletados + concilCompletados + mayorCompletados;
    const totalEjs           = plan.length + asientos.length + iva.length + concil.length + mayor.length;

    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ContaEdu — Reporte de Progreso</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'DM Sans', sans-serif;
      background: #F4F2EC;
      color: #1B2020;
      padding: 0;
    }

    /* ---- PORTADA ---- */
    .portada {
      background: #1B2B3A;
      color: white;
      padding: 48px 56px 40px;
      position: relative;
      overflow: hidden;
    }
    .portada::before {
      content: '';
      position: absolute;
      top: -60px; right: -60px;
      width: 300px; height: 300px;
      border-radius: 50%;
      background: rgba(96,165,250,0.08);
    }
    .portada::after {
      content: '';
      position: absolute;
      bottom: -40px; left: 40px;
      width: 180px; height: 180px;
      border-radius: 50%;
      background: rgba(74,222,128,0.06);
    }
    .portada-logo {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 32px;
    }
    .portada-logo-icon {
      width: 40px; height: 40px;
      background: #60A5FA;
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      font-size: 20px;
    }
    .portada-logo-text {
      font-size: 18px;
      font-weight: 600;
      letter-spacing: -0.3px;
    }
    .portada-logo-sub {
      font-size: 12px;
      color: rgba(255,255,255,0.5);
      font-weight: 400;
    }
    .portada-titulo {
      font-size: 28px;
      font-weight: 700;
      letter-spacing: -0.5px;
      margin-bottom: 6px;
      position: relative;
    }
    .portada-subtitulo {
      font-size: 14px;
      color: rgba(255,255,255,0.6);
      margin-bottom: 32px;
    }
    .portada-alumno {
      font-size: 22px;
      font-weight: 600;
      color: #60A5FA;
      margin-bottom: 6px;
      position: relative;
    }
    .portada-meta {
      font-size: 12px;
      color: rgba(255,255,255,0.45);
      font-family: 'DM Mono', monospace;
    }

    /* ---- RESUMEN GLOBAL ---- */
    .resumen {
      background: white;
      margin: 0;
      padding: 32px 56px;
      border-bottom: 1px solid rgba(0,0,0,0.08);
    }
    .resumen-titulo {
      font-size: 11px;
      font-weight: 600;
      color: #A8A59E;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 20px;
    }
    .resumen-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 20px;
    }
    .resumen-stat {
      background: #F4F2EC;
      border-radius: 10px;
      padding: 14px 16px;
    }
    .resumen-stat-label {
      font-size: 11px;
      color: #A8A59E;
      margin-bottom: 4px;
    }
    .resumen-stat-valor {
      font-size: 22px;
      font-weight: 700;
      font-family: 'DM Mono', monospace;
      color: #1B2020;
    }
    .resumen-stat-valor.verde { color: #16A34A; }
    .resumen-stat-valor.azul  { color: #2563EB; }

    /* Barra de progreso */
    .barra-wrap {
      background: #EEECE5;
      border-radius: 10px;
      height: 8px;
      overflow: hidden;
    }
    .barra-fill {
      height: 100%;
      border-radius: 10px;
      background: linear-gradient(90deg, #2563EB, #4ADE80);
      transition: width 0.3s;
    }
    .barra-label {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: #A8A59E;
      margin-top: 6px;
      font-family: 'DM Mono', monospace;
    }

    /* ---- CONTENIDO ---- */
    .contenido {
      padding: 32px 56px 48px;
    }

    /* ---- SECCIÓN ---- */
    .seccion {
      margin-bottom: 32px;
      background: white;
      border-radius: 14px;
      overflow: hidden;
      border: 1px solid rgba(0,0,0,0.07);
    }
    .seccion-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 20px;
      background: #1B2B3A;
      color: white;
    }
    .seccion-icono {
      font-size: 18px;
      width: 28px;
      text-align: center;
    }
    .seccion-titulo {
      font-size: 14px;
      font-weight: 600;
      flex: 1;
    }
    .seccion-pct {
      font-size: 11px;
      color: rgba(255,255,255,0.55);
      font-family: 'DM Mono', monospace;
    }

    /* Tabla */
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    thead tr {
      background: #F4F2EC;
    }
    th {
      text-align: left;
      padding: 9px 16px;
      font-size: 10px;
      font-weight: 600;
      color: #A8A59E;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid rgba(0,0,0,0.07);
    }
    td {
      padding: 10px 16px;
      border-bottom: 1px solid rgba(0,0,0,0.05);
      color: #1B2020;
      vertical-align: middle;
    }
    tr:last-child td { border-bottom: none; }

    .ok {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: #F0FDF4;
      color: #16A34A;
      font-size: 11px;
      font-weight: 600;
      padding: 3px 10px;
      border-radius: 20px;
      border: 1px solid rgba(22,163,74,0.2);
    }
    .pend {
      display: inline-flex;
      align-items: center;
      background: #FEF3C7;
      color: #D97706;
      font-size: 11px;
      font-weight: 500;
      padding: 3px 10px;
      border-radius: 20px;
      border: 1px solid rgba(217,119,6,0.2);
    }

    /* ---- PIE ---- */
    .pie {
      padding: 20px 56px;
      border-top: 1px solid rgba(0,0,0,0.08);
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      color: #A8A59E;
      font-family: 'DM Mono', monospace;
    }

    /* ---- PRINT ---- */
    @media print {
      body { background: white; }
      .portada { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .seccion-header { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .resumen { page-break-inside: avoid; }
      .seccion { page-break-inside: avoid; margin-bottom: 20px; }
      @page { margin: 0; size: A4; }
    }
  </style>
</head>
<body>

  <!-- PORTADA -->
  <div class="portada">
    <div class="portada-logo">
      <div class="portada-logo-icon">📊</div>
      <div>
        <div class="portada-logo-text">ContaEdu</div>
        <div class="portada-logo-sub">Contabilidad para nivel secundario</div>
      </div>
    </div>
    <div class="portada-titulo">Reporte de Progreso</div>
    <div class="portada-subtitulo">Registro de ejercicios completados</div>
    <div class="portada-alumno">${nombreAlumno || 'Alumno/a'}</div>
    <div class="portada-meta">Generado el ${fechaStr} a las ${horaStr}</div>
  </div>

  <!-- RESUMEN GLOBAL -->
  <div class="resumen">
    <div class="resumen-titulo">Resumen general</div>
    <div class="resumen-grid">
      <div class="resumen-stat">
        <div class="resumen-stat-label">Progreso global</div>
        <div class="resumen-stat-valor ${pct === 100 ? 'verde' : 'azul'}">${pct}%</div>
      </div>
      <div class="resumen-stat">
        <div class="resumen-stat-label">Ejercicios completados</div>
        <div class="resumen-stat-valor verde">${totalCompletados}</div>
      </div>
      <div class="resumen-stat">
        <div class="resumen-stat-label">Total de ejercicios</div>
        <div class="resumen-stat-valor">${totalEjs}</div>
      </div>
      <div class="resumen-stat">
        <div class="resumen-stat-label">Módulos activos</div>
        <div class="resumen-stat-valor">5</div>
      </div>
    </div>
    <div class="barra-wrap">
      <div class="barra-fill" style="width:${pct}%"></div>
    </div>
    <div class="barra-label">
      <span>0%</span>
      <span>${pct}% completado</span>
      <span>100%</span>
    </div>
  </div>

  <!-- DETALLE POR MÓDULO -->
  <div class="contenido">

    ${seccion(
      'Plan de Cuentas', '📋',
      plan.map(e => filaEj(e, `${e.total} cuentas a clasificar`)).join(''),
      planCompletados, plan.length
    )}

    ${seccion(
      'Asientos Contables', '✏️',
      asientos.map(e => filaEj(e, `${e.pasos} pasos guiados`)).join(''),
      asientosCompletados, asientos.length
    )}

    ${seccion(
      'IVA — Impuesto al Valor Agregado', '🧾',
      iva.map(e => filaEj(e, `${e.ops} operaciones`)).join(''),
      ivaCompletados, iva.length
    )}

    ${seccion(
      'Conciliación Bancaria', '🏦',
      concil.map(e => filaEj(e, `${e.partidas} partidas conciliatorias`)).join(''),
      concilCompletados, concil.length
    )}

    ${seccion(
      'Libro Mayor', '📓',
      mayor.map(e => filaEj(e, `${e.cuentas} cuentas a mayorizar`)).join(''),
      mayorCompletados, mayor.length
    )}

  </div>

  <!-- PIE -->
  <div class="pie">
    <span>ContaEdu — Aplicación didáctica de Contabilidad</span>
    <span>${fechaStr}</span>
  </div>

</body>
</html>`;
  }

  /* ---- MODAL DE NOMBRE ---- */

  function mostrarModal() {
    // Eliminar modal anterior si existe
    document.getElementById('pdf-modal')?.remove();

    const modal = document.createElement('div');
    modal.id = 'pdf-modal';
    modal.style.cssText = `
      position: fixed; inset: 0; z-index: 1000;
      background: rgba(0,0,0,0.5);
      display: flex; align-items: center; justify-content: center;
      padding: 1rem;
    `;

    modal.innerHTML = `
      <div style="
        background: var(--bg-surface);
        border-radius: var(--radius-lg);
        padding: 2rem;
        width: 100%;
        max-width: 400px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      ">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:1.25rem">
          <div style="width:36px;height:36px;background:#EFF6FF;border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center;font-size:18px">📄</div>
          <div>
            <div style="font-size:15px;font-weight:600">Exportar a PDF</div>
            <div style="font-size:12px;color:var(--text-secondary)">Reporte de progreso del alumno</div>
          </div>
        </div>

        <div class="form-group" style="margin-bottom:1.25rem">
          <label>Nombre del alumno/a</label>
          <input
            type="text"
            id="pdf-nombre"
            placeholder="Ej: Juan García"
            style="width:100%"
            onkeydown="if(event.key==='Enter') PDFExport.generar()"
          >
        </div>

        <div style="font-size:12px;color:var(--text-secondary);background:var(--bg-muted);border-radius:var(--radius-md);padding:10px 12px;margin-bottom:1.25rem;line-height:1.6">
          <strong style="color:var(--text-primary)">¿Cómo funciona?</strong><br>
          Se abre el reporte en una nueva pestaña y aparece el diálogo de impresión.
          En <strong>Destino</strong> elegí <strong>"Guardar como PDF"</strong>.
        </div>

        <div style="display:flex;gap:8px;justify-content:flex-end">
          <button class="btn btn-sm" onclick="PDFExport.cerrarModal()">Cancelar</button>
          <button class="btn btn-primary btn-sm" onclick="PDFExport.generar()">
            <i class="ti ti-download" aria-hidden="true"></i> Generar PDF
          </button>
        </div>
      </div>`;

    document.body.appendChild(modal);
    setTimeout(() => document.getElementById('pdf-nombre')?.focus(), 50);
  }

  function cerrarModal() {
    document.getElementById('pdf-modal')?.remove();
  }

  /* ---- GENERAR ---- */

  function generar() {
    const nombre = document.getElementById('pdf-nombre')?.value.trim() || 'Alumno/a';
    cerrarModal();

    const html   = buildHTML(nombre);
    const ventana = window.open('', '_blank');
    if (!ventana) {
      alert('Activá las ventanas emergentes para este sitio y volvé a intentarlo.');
      return;
    }

    ventana.document.write(html);
    ventana.document.close();

    // Usamos setTimeout directo porque ventana.onload puede fallar tras document.write
    setTimeout(() => {
      ventana.focus();
      ventana.print();
    }, 800);
  }

  return { mostrarModal, cerrarModal, generar };

})();
