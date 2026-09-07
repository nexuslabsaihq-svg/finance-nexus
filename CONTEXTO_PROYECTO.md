# 💎 Finance Nexus — Contexto Técnico del Proyecto y Registro de Sesión

Este documento consolida la arquitectura, tecnologías, configuraciones de infraestructura y el historial de soluciones aplicadas en el proyecto para mantener el contexto completo en futuras sesiones de desarrollo con Gemini.

---

## 📌 1. Información General del Proyecto

* **Nombre:** Finance Nexus ERP
* **Propósito:** Plataforma web integral de gestión financiera personal y empresarial inteligente con asistencia por Inteligencia Artificial.
* **Repositorio Oficial:** `https://github.com/nexuslabsaihq-svg/finance-nexus.git`
* **Rama Principal de Producción:** `main`
* **Entorno de Producción Oficial:** [Vercel](https://vercel.com) — URL: `https://finance-nexus.vercel.app`
* **Despliegue Continuo (CI/CD):** Vercel detecta y despliega automáticamente cada `push` hacia `origin/main`.

---

## 🛠️ 2. Stack Tecnológico y Dependencias

* **Frontend Framework:** React 19 (`react` 19.2.4, `react-dom` 19.2.4)
* **Bundler & Dev Server:** Vite 8 (`vite` 8.0.1) con `@vitejs/plugin-react`
* **Base de Datos & Auth:** Firebase v12 (`firebase` 12.11.0)
  * **Authentication:** Google OAuth (`signInWithPopup`, `GoogleAuthProvider`).
  * **Firestore:** Almacenamiento en tiempo real bajo la ruta `users/{uid}/appData/{key}`.
  * **Storage:** Bucket de almacenamiento para comprobantes y adjuntos.
* **Inteligencia Artificial:** Google Generative AI (`@google/generative-ai` 0.24.1) integrado con la API de Gemini para análisis y asesoría financiera.
* **Exportación y Utilidades:**
  * `jspdf` (4.2.1) — Generación de informes financieros en PDF.
  * `xlsx` (0.18.5) — Exportación de tablas y métricas a Excel.
  * `date-fns` (4.1.0) — Manipulación y formateo de fechas.
  * `dompurify` (3.4.14) — Sanitización contra ataques XSS.

---

## 🏗️ 3. Arquitectura del Código

* **`src/firebase/config.js`:**
  * Lee exclusivamente variables de entorno de Vite (`import.meta.env.VITE_*`).
  * Valida presencia de credenciales críticas mediante `HasKeys`.
* **`src/context/AppDataContext.jsx`:**
  * Maneja el estado global unificado (`ingresos`, `gastos`, `bancos`, `ahorros`, `inversiones`, `deudas`, etc.).
  * Hook `useFirestoreState`: Sincronización bidireccional reactiva y automática con Firestore mediante `onSnapshot` y persistencia con `setDoc`.
  * Método `loginWithGoogle`: Valida la inicialización de Firebase, ejecuta `signInWithPopup`, actualiza `authError` y propaga errores a la UI.
* **`src/App.jsx`:**
  * Enrutamiento interno por `hash` (`#app`) y estado de autenticación.
  * Si `authUser == null` o `hash !== '#app'`, renderiza la Landing Page con el modal de acceso.
* **`src/pages/Landing.jsx`:**
  * Presentación corporativa interactiva y modal de autenticación con Google.
  * Muestra estado de carga (`⏳ Conectando con Google...`) y recuadro de alertas claras ante cualquier error de autenticación.

---

## 📋 4. Variables de Entorno Requeridas (.env / Vercel Dashboard)

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=finance-nexus.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=finance-nexus
VITE_FIREBASE_STORAGE_BUCKET=finance-nexus.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_GEMINI_API_KEY=AIzaSy...
```

---

## 🚀 5. Hitos y Soluciones Implementadas en Esta Sesión

### A. Configuración de Vercel (`vercel.json`)
Se creó en la raíz del proyecto para soportar el enrutamiento de la SPA y cabeceras de seguridad HTTP:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

### B. Diagnóstico y Corrección de Login con Google en Producción

| Problema Identificado | Causa Raíz | Solución Aplicada |
|---|---|---|
| **1. Ventana emergente se cierra en silencio y regresa a la Landing** | El modal en `Landing.jsx` asumía éxito, no mostraba mensajes de error y cerraba el modal antes de confirmar autenticación. | Se agregaron estados reactivos `isLoggingIn`, un banner de alerta con mensajes explicativos en español, y navegación protegida que solo redirige a `#app` si el login es exitoso. |
| **2. Bloqueo de OAuth en Firebase (`auth/unauthorized-domain`)** | Firebase Authentication no tenía registrado el dominio de Vercel en su lista blanca. | Se agregó `finance-nexus.vercel.app` en **Firebase Console ➔ Authentication ➔ Settings ➔ Authorized Domains**. |
| **3. Bloqueo de API Key (`auth/requests-from-referer-...-are-blocked`)** | La API Key de Firebase tenía activadas restricciones HTTP en Google Cloud que bloqueaban peticiones desde el referer de Vercel. | Se agregaron `https://finance-nexus.vercel.app/*` y `https://finance-nexus.vercel.app` en **Google Cloud Console ➔ APIs y Servicios ➔ Credenciales ➔ Restricciones de aplicación (Sitios web)**. |

---

## 🔒 6. Estado Actual del Repositorio

* **Últimos Commits relevantes:**
  * `ead165c` — *fix: improve Google login handling and display error feedback on Landing page*
  * `cf72d10` — *Create vercel.json with rewrites and headers*
* **Estado de Git:** Rama `main` sincronizada 1:1 con `origin/main`, árbol de trabajo limpio (`working tree clean`).
* **Seguridad de Credenciales:** Sin tokens ni secretos hardcodeados en el historial ni en `.git/config`.
