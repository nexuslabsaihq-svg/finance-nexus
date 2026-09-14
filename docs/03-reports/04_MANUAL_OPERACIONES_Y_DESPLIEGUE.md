# 🚀 MANUAL DE OPERACIONES, DESPLIEGUE Y GUÍA DE MANTENIMIENTO
## FINANCE NEXUS — SISTEMA OPERATIVO FINANCIERO

---

**Documento:** `docs/03-reports/04_MANUAL_OPERACIONES_Y_DESPLIEGUE.md`  
**Versión:** 1.0 (Producción)  
**Fecha:** 14 de Septiembre de 2026  
**Responsable:** Equipo de Ingeniería y DevOps — Finance Nexus SpA  

---

## 1. REQUISITOS PREVIOS DEL ENTORNO

Para ejecutar, compilar o desplegar la plataforma Finance Nexus, el entorno de desarrollo o servidor CI/CD debe cumplir con los siguientes requisitos:

- **Node.js:** Versión `>= 20.x` (probado y certificado bajo Node `v26.3.0`).
- **NPM:** Versión `>= 10.x`.
- **Firebase CLI:** Versión `>= 13.x` (`npm install -g firebase-tools`).
- **Navegador Moderno:** Google Chrome, Mozilla Firefox, Safari o Microsoft Edge con soporte ESM y CSS Grid.

---

## 2. CONFIGURACIÓN DE VARIABLES DE ENTORNO

En la raíz del proyecto, cree o actualice el archivo `.env` basándose en la siguiente plantilla estándar:

```env
# ============================================================
# CONFIGURACIÓN DE FIREBASE (Google Cloud Platform)
# ============================================================
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=finance-nexus.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=finance-nexus
VITE_FIREBASE_STORAGE_BUCKET=finance-nexus.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# ============================================================
# CONFIGURACIÓN DE INTELIGENCIA ARTIFICIAL (Google Gemini)
# ============================================================
VITE_GEMINI_API_KEY=AIzaSy...
```

> [!IMPORTANT]
> Nunca versione el archivo `.env` en repositorios públicos de GitHub. Asegúrese de que figure dentro de `.gitignore`.

---

## 3. INSTALACIÓN Y FLUJO DE DESARROLLO LOCAL

### 3.1 Instalación de Dependencias
Ejecute en la raíz del proyecto:
```bash
npm install
```

### 3.2 Servidor de Desarrollo en Caliente (HMR)
Inicie el entorno local:
```bash
npm run dev
```
- La aplicación quedará disponible en: `http://localhost:5173/`
- Vite proporciona recarga en caliente automática (**Fast Refresh**). Modificar cualquier componente JSX actualizará la interfaz sin perder el estado de la sesión.

---

## 4. CONTROL DE CALIDAD Y LINTER

Antes de cualquier confirmación o despliegue, es obligatorio validar que el código satisfaga el estándar de **0 errores y 0 warnings**:

```bash
# En Windows CMD:
cmd.exe /c "npx eslint ."

# En Linux / macOS / Bash:
npx eslint .
```

### Reglas Clave Aplicadas:
- `react-hooks/rules-of-hooks`: Cumplimiento de hooks en el nivel superior.
- `react-hooks/exhaustive-deps`: Declaración estricta de dependencias en `useEffect` y `useMemo`.
- `react-hooks/set-state-in-effect`: Prohibición de llamadas síncronas a `setState` durante el montaje.
- `react-hooks/purity`: Prohibición de funciones impuras (`Date.now()`, mutaciones) durante el render.
- `react-refresh/only-export-components`: Exclusividad de exportación de componentes para Hot Reloading.

---

## 5. COMPILACIÓN PARA PRODUCCIÓN (BUILD)

Para generar el paquete estático minificado y optimizado:

```bash
npm run build
```

### Salida Esperada:
El comando compila en aproximadamente **500 a 600 ms** generando los artefactos en el directorio `dist/`:
- `dist/index.html`: Punto de entrada optimizado.
- `dist/assets/index-*.css`: Estilos unificados minificados con purge.
- `dist/assets/vendor-react-*.js`: Chunk independiente del runtime de React 19.
- `dist/assets/vendor-firebase-*.js`: Chunk del SDK de Firebase y Firestore.
- `dist/assets/vendor-pdf-*.js`: Chunk para generación de reportes jsPDF.
- `dist/legal/`: Documentos web públicos de Términos y Privacidad.

### Prueba Local del Build:
```bash
npm run preview
```

---

## 6. DESPLIEGUE EN PRODUCCIÓN (FIREBASE HOSTING)

### 6.1 Inicio de Sesión en Firebase
```bash
firebase login
```

### 6.2 Despliegue de Reglas de Seguridad y Almacenamiento
Para actualizar las reglas de Firestore sin tocar el hosting:
```bash
firebase deploy --only firestore:rules
```

### 6.3 Despliegue Completo de la Aplicación Web
```bash
# 1. Compilar la última versión
npm run build

# 2. Desplegar a Firebase Hosting
firebase deploy --only hosting
```
- **URL de Producción:** [https://finance-nexus.web.app/](https://finance-nexus.web.app/)

---

## 7. RESOLUCIÓN DE PROBLEMAS COMUNES (TROUBLESHOOTING)

### 7.1 Error `PSSecurityException` en Windows PowerShell
- **Causa:** La política de ejecución de scripts de Windows bloquea la ejecución de `npx.ps1` o `npm.ps1`.
- **Solución:** Ejecute los comandos a través de `cmd.exe /c "npx eslint ."` o configure en una sesión administrativa:
  ```powershell
  Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
  ```

### 7.2 Error `auth/unauthorized-domain` en Google Sign-In
- **Causa:** El dominio desde el cual se intenta iniciar sesión (ej. Vercel, Firebase Hosting o IP local) no está en la lista de dominios autorizados de Firebase.
- **Solución:** Ingrese a [Firebase Console](https://console.firebase.google.com/) > Authentication > Settings > Authorized domains y agregue el dominio respectivo.

### 7.3 Advertencia de Chunks mayores a 600 kB
- **Causa:** Las librerías `recharts`, `jspdf` y `xlsx` tienen un peso volumétrico considerable.
- **Solución:** En la Fase 5 se aplicará *dynamic import()* mediante `React.lazy()` para cargar los módulos de exportación e IA únicamente cuando el usuario acceda a las pestañas de Informes o Documentos.
