# ContaEdu — App Didáctica de Contabilidad

Aplicación web tipo SPA + PWA para nivel secundario.  
Módulos: Plan de Cuentas · Asientos · IVA · Conciliación Bancaria.

---

## Estructura del proyecto

```
contaedu/
├── index.html          ← Punto de entrada SPA
├── manifest.json       ← Configuración PWA (instalable)
├── service-worker.js   ← Caché offline
├── css/
│   └── styles.css      ← Estilos globales + variables de tema
├── js/
│   ├── utils.js        ← Funciones compartidas (formateo, cálculos)
│   ├── plan-cuentas.js ← Módulo Plan de Cuentas
│   ├── asientos.js     ← Módulo Asientos Contables
│   ← iva.js            ← Módulo IVA
│   ├── conciliacion.js ← Módulo Conciliación Bancaria
│   └── app.js          ← Controlador SPA (routing, tema, SW)
└── icons/
    ├── icon-192.png    ← Ícono PWA (crear con cualquier editor)
    └── icon-512.png    ← Ícono PWA grande
```

---

## Cómo ejecutar localmente

### Opción A — VS Code (recomendado)
1. Instalá la extensión **Live Server** (ritwickdey.LiveServer)
2. Abrí la carpeta `contaedu/` en VS Code
3. Clic derecho en `index.html` → **Open with Live Server**
4. Abre en `http://127.0.0.1:5500`

### Opción B — Cursor / Windsurf
1. Abrí la carpeta como proyecto
2. Usá el terminal integrado:
   ```bash
   npx serve .
   ```
3. Abre en `http://localhost:3000`

### Opción C — Python (sin instalar nada extra)
```bash
cd contaedu
python3 -m http.server 8080
```
Abre `http://localhost:8080`

> ⚠️ No abras `index.html` directo con doble clic — el Service Worker  
> requiere que se sirva desde un servidor HTTP (aunque sea local).

---

## Crear los íconos PWA

Podés generarlos en: https://realfavicongenerator.net  
O usá cualquier imagen cuadrada de 512×512px y guardala como:
- `icons/icon-192.png`
- `icons/icon-512.png`

---

## Publicar en GitHub Pages (gratis)

1. Creá un repositorio en GitHub (ej: `contaedu`)
2. Subí todos los archivos
3. Ir a **Settings → Pages → Source: main / root**
4. Tu app queda en: `https://tuusuario.github.io/contaedu`
5. Los alumnos pueden instalarla desde el navegador del celular

---

## Agregar contenido con IA (Cursor / Windsurf)

Ejemplos de prompts que podés usar:

```
"Agregá un ejercicio de conciliación bancaria con 5 partidas 
 al array EJERCICIOS en conciliacion.js"

"Creá un módulo nuevo llamado libro-mayor.js con la misma 
 estructura que plan-cuentas.js"

"Agregá localStorage para guardar el progreso del alumno 
 entre sesiones"

"Hacé que el sidebar muestre un ícono de check verde 
 en los módulos ya completados"
```

---

## Tecnologías utilizadas

- HTML5 + CSS3 + JavaScript vanilla (sin frameworks)
- CSS Variables para theming claro/oscuro
- Service Worker para uso offline
- Web App Manifest para instalación como PWA
- Tabler Icons (CDN)
- Google Fonts: DM Sans + DM Mono

---

## Licencia

Uso educativo libre. Podés modificar y distribuir con atribución.
