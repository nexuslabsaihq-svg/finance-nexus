# 🔬 INVENTARIO TÉCNICO DE TECNOLOGÍAS, STORAGE Y COOKIES
## FINANCE NEXUS — AUDITORÍA FORENSE DE ALMACENAMIENTO DEL LADO DEL CLIENTE

---

**Documento:** `docs/02-technical/INVENTARIO_TECNOLOGIAS_Y_COOKIES.md`  
**Versión:** 1.0 (Auditoría Fase 5A)  
**Fecha:** 14 de Septiembre de 2026  
**Auditor Técnico:** Antigravity Senior Software Engineer Agent  
**Objetivo:** Auditar exhaustivamente cada mecanismo de persistencia en cliente (`localStorage`, `sessionStorage`, cookies, IndexedDB), SDKs integrados y conexiones externas para garantizar el principio de minimización de datos.  

---

## 1. RESUMEN DE HALLAZGOS FORENSES

| Vector de Almacenamiento | Detectado en Código | Cantidad de Llaves | Clasificación de Seguridad |
|---|---|---|---|
| **Cookies HTTP (Cabecera `Set-Cookie`)** | ❌ No originadas por backend propio | 0 cookies de primer origen | Alto Aislamiento |
| **`window.localStorage`** | 🟢 Sí | 4 llaves activas | Controlado y Documentado |
| **`window.sessionStorage`** | 🟢 Sí (Solo saneamiento en logout) | 0 llaves persistentes | Limpio |
| **IndexedDB** | 🟢 Sí (Uso interno de Firebase Auth / Firestore) | 2 bases locales (SDK Google) | Cifrado a nivel de navegador |
| **Píxeles de Rastreo / Analytics** | ❌ NO instalados | 0 scripts externos | Libre de Rastreo Publicitario |

---

## 2. INVENTARIO COMPLETO DE LLAVES EN `window.localStorage`

```javascript
// 1. Consentimiento de Privacidad y Cookies
localStorage.getItem('fn_cookie_consent');
// Estructura: {"level":"all"|"essential","date":"2026-09-14T...","version":"1.0"}
// Justificación: Requisito legal de trazabilidad de la decisión del usuario (Ley 21.719).

// 2. Espacio de Trabajo Colaborativo Activo
localStorage.getItem(`fn_active_workspace_${authUser.uid}`);
// Estructura: String con el UID de la cuenta colaborativa o propia.
// Justificación: Permite a colaboradores cambiar de tenant sin alterar la sesión principal.

// 3. Protección de Cuotas y Abuso de IA
localStorage.getItem('fn_nexus_rates');
// Estructura: Array serializado de timestamps [1726345600000, 1726345605000...]
// Justificación: Rate-limiting local para prevenir denegación de servicio o gasto desmedido en Gemini API.

// 4. Configuración de Llaves de Desarrollo (ConfigSetup.jsx)
localStorage.getItem('fn_apikeys');
// Estructura: {"geminiKey": "..."}
// Justificación: Utilizado exclusivamente en pantallas de desarrollo y pruebas locales de laboratorio.
```

---

## 3. AUDITORÍA DE SCRIPTS Y SERVICIOS EXTERNOS EN `index.html`

El archivo `index.html` fue analizado línea por línea:
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap" rel="stylesheet">
    <title>finance-nexus</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### Conclusiones Técnicas de la Auditoría:
1. **Google Fonts (`fonts.googleapis.com`):** Se cargan exclusivamente tipografías de código abierto (`DM Sans` e `IBM Plex Mono`). No transmiten cookies de seguimiento personal.
2. **Ausencia de Píxeles:** No existe código de Google Analytics (`gtag.js`, `analytics.js`), Meta Pixel (`fbevents.js`), Hotjar, Sentry, Mixpanel ni Segment.
3. **Google Sign-In:** Las interacciones de autenticación son manejadas por el SDK oficial de Firebase vía ventana emergente (*popup*), donde las cookies de sesión son gestionadas directamente por el dominio seguro de Google (`accounts.google.com`).
4. **Política de Datos Limpia:** La plataforma no perfila a los usuarios para fines comerciales ni comercializa hábitos de navegación.
