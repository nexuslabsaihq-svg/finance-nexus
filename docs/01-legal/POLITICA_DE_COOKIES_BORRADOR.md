# 🍪 POLÍTICA DE COOKIES Y ALMACENAMIENTO LOCAL — BORRADOR OPERATIVO
## FINANCE NEXUS SpA — IMPLEMENTACIÓN TÉCNICA DE CONSENTIMIENTO

---

**Documento:** `docs/01-legal/POLITICA_DE_COOKIES_BORRADOR.md`  
**ESTADO DOCUMENTAL: BORRADOR OPERATIVO — IMPLEMENTACIÓN TÉCNICA PENDIENTE DE VALIDACIÓN LEGAL EN CHILE**  
**Versión:** 1.0 (Borrador de Trabajo)  
**Fecha de Publicación:** 14 de Septiembre de 2026  
**Responsable:** Isaac Patricio Pasten Díaz (Fundador & CEO)  
**Fecha Prevista de Revisión Legal:** Octubre de 2026  
**Aviso:** *Este documento expone la configuración técnica de cookies y almacenamiento local implementada en la aplicación Finance Nexus en etapa MVP. No constituye dictamen legal definitivo.*

---

## 1. ¿QUÉ SON LAS COOKIES Y EL ALMACENAMIENTO LOCAL?

Las cookies y las tecnologías de almacenamiento web (`localStorage` y `sessionStorage`) son pequeños archivos de datos o identificadores de texto que una aplicación web almacena en el navegador del usuario para recordar estados de sesión, parámetros operativos y preferencias entre diferentes visitas.

Finance Nexus prioriza el uso de almacenamiento local en el navegador del cliente antes que el envío constante de cookies en cabeceras HTTP, reduciendo la exposición innecesaria de datos.

---

## 2. INVENTARIO Y CATEGORIZACIÓN DE TECNOLOGÍAS UTILIZADAS

### 2.1 Cookies Estrictamente Necesarias (Esenciales)
Son aquellas indispensables para que la plataforma funcione de forma segura y permita al usuario autenticarse:

| Nombre / Clave | Proveedor / Origen | Propósito | Duración | Clasificación |
|---|---|---|---|---|
| `firebase:authUser:*` | Google Firebase Auth | Mantiene el token JWT criptográfico de la sesión iniciada por el usuario con Google Sign-In. | Persistente hasta cierre de sesión | Estrictamente Necesaria |
| `fn_active_workspace_*` | Finance Nexus (`localStorage`) | Identificador del espacio de trabajo colaborativo activo del usuario autenticado. | Persistente local | Estrictamente Necesaria |

> **Nota:** Las cookies esenciales no requieren consentimiento previo para su activación técnica conforme al estándar de la Ley N° 21.719, ya que son indispensables para la ejecución del servicio expresamente solicitado por el titular.

### 2.2 Almacenamiento Local de Preferencias y Funcionalidad
Utilizadas para recordar configuraciones de interfaz elegidas por el usuario:

| Nombre / Clave | Tipo | Propósito | Duración |
|---|---|---|---|
| `fn_cookie_consent` | `localStorage` | Almacena la decisión de consentimiento (`all` o `essential`), fecha ISO y versión. | 12 meses o hasta borrado de caché |
| `fn_nexus_rates` | `localStorage` | Registro de estampas de tiempo de llamadas a la IA (Google Gemini) para aplicar cuotas de protección (*rate-limiting*) y evitar costos desmedidos o abusos. | 1 hora móvil |
| `fn_apikeys` | `localStorage` | Configuración local opcional para desarrolladores en pruebas locales. | Persistente local |

### 2.3 Ausencia de Píxeles de Rastreo y Cookies Publicitarias
Se certifica que en la versión actual de Finance Nexus:
- ❌ **NO se utiliza Google Analytics (gtag / ga).**
- ❌ **NO se utiliza Meta Pixel (Facebook Pixel).**
- ❌ **NO se utiliza Hotjar ni herramientas de grabación de sesión.**
- ❌ **NO se utiliza Sentry ni SDKs de telemetría invasiva.**
- ❌ **NO se comparten datos con redes publicitarias de terceros.**

---

## 3. MECANISMO DE CONTROL Y GESTIÓN DEL CONSENTIMIENTO

1. **Primer Acceso:** Al ingresar por primera vez a `https://finance-nexus.web.app/` o a la Landing Page, se presenta un banner informativo que permite:
   - **"Aceptar todas":** Habilita almacenamiento completo de preferencias.
   - **"Solo esenciales":** Restringe el almacenamiento estrictamente a lo necesario para autenticación.
2. **Modificación Posterior:** El usuario puede revocar o modificar su consentimiento en cualquier instante haciendo clic en:
   - El enlace `"🍪 Configurar Cookies"` disponible en el pie de página de la aplicación (`AppFooter.jsx`).
   - El botón `"🍪 Modificar Preferencias de Cookies"` en el panel de Configuración de la cuenta.

---

## 4. CÓMO GESTIONAR O ELIMINAR COOKIES DESDE EL NAVEGADOR

El usuario puede además bloquear o eliminar el almacenamiento local desde las herramientas de su propio navegador:
- **Google Chrome:** Configuración > Privacidad y seguridad > Cookies y otros datos de sitios.
- **Mozilla Firefox:** Ajustes > Privacidad y seguridad > Cookies y datos del sitio.
- **Apple Safari:** Preferencias > Privacidad > Administrar datos del sitio web.
- **Microsoft Edge:** Configuración > Cookies y permisos del sitio.
