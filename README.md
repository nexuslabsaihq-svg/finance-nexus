# 💎 Finance Nexus — ERP Financiero Personal e Inteligente

> **Finance Nexus** es una plataforma web integral de gestión financiera personal y empresarial moderna, potenciada con Inteligencia Artificial (Google Gemini), análisis en tiempo real, simulación matemática de deudas e interfaz de alta gama con soporte Glassmorphism (Modo Oscuro y Claro).

---

## 📚 Base de Conocimiento y Documentación

Este repositorio almacena exclusivamente el **código ejecutable** del producto. La documentación de arquitectura, decisiones técnicas (ADRs), modelo de datos, seguridad, post-mortems y reportes de auditoría reside de forma desacoplada en:

* 🌐 **Repositorio Remoto:** [nexuslabsaihq-svg/finance-nexus-knowledge](https://github.com/nexuslabsaihq-svg/finance-nexus-knowledge)
* 📂 **Submódulo Local:** [`knowledge/`](knowledge/INDEX.md)
* 🗺️ **Guía Integral de Arquitectura y Contexto:** [`PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md)

---

## 🚀 Características Principales

### 📊 1. Panel de Control y Análisis Visual (Recharts)
* **Dashboard Ejecutivo:** Resumen de ingresos, gastos, flujo neto, patrimonio neto, tasa de ahorro y score financiero.
* **Ahorros y Metas:** Proyección de ahorro a 12 meses con gráficos de área y distribución por metas con gráficos circulares.
* **Inversiones:** Desglose de portafolio por clase de activo, rentabilidad histórica y comparativa invertido vs. valor actual.
* **Deudas y Estrategia Matemática:**
  * Mapa de dispersión (ScatterChart) de tasa de interés vs. balance para identificar deudas críticas.
  * Simulador de aceleración de pagos mediante métodos **Avalancha** (mayor interés primero) y **Bola de Nieve** (menor balance primero) con efecto *rollover*.
* **Flujo de Caja:** Gráfico en cascada (Waterfall) interactivo y evolución histórica de liquidez.
* **Informes & Radar:** Matriz de presupuesto vs. gasto real por categoría y balance de activos líquidos.
* **Calendario de Pagos:** Grid interactivo de vencimientos mensuales con botón de confirmación de pago.

### 🧠 2. Nexus Ultimate Synthesis (Asistente IA)
* **Integración BYOK (Bring Your Own Key):** Soporte para claves privadas de la API de Google Gemini (Google AI Studio) sin cuotas mensuales obligatorias.
* **Multisesión & Memoria:** Historial lateral de conversaciones pasadas guardadas por usuario.
* **Exportación:** Generación directa de reportes y minutas de asesoría en formato PDF.

### 🛡️ 3. Seguridad, Privacidad y Colaboración
* **Modo Anti-Mirones (Anti-Shoulder Surfing):** Difuminado instantáneo de todos los saldos y cifras sensibles con un solo clic.
* **LockScreen por Inactividad & Hard Logout:** Bloqueo de sesión ante inactividad prolongada (1 hora) y limpieza estricta de memoria local y credenciales.
* **Auditoría de Sesiones:** Registro de dispositivos, ubicaciones y control de accesos.
* **Espacios Colaborativos:** Gestión de cuentas compartidas con roles asignables (Propietario, Editor, Solo Lectura).
* **Reglas de Seguridad Estrictas:**
  * **Cloud Firestore (`firestore.rules`):** Control de acceso por `activeUid`, validación de esquemas de datos y separación de permisos de lectura y escritura.
  * **Firebase Storage (`storage.rules`):** Acceso exclusivo a usuarios autenticados, subidas confinadas a `/users/{uid}/comprobantes/{modulo}/{archivo}`, tipos permitidos estrictos (`image/jpeg`, `image/png`, `image/webp`, `application/pdf`) y límite de tamaño de 10MB.

### 🧭 4. Experiencia de Usuario & Onboarding
* **Tour Interactivo Guiado:** Recorrido inmersivo para nuevos usuarios con `react-joyride` personalizado, respetando el sistema de diseño corporativo.
* **Control en Configuración:** Posibilidad de reactivar o desactivar el tour de bienvenida en cualquier momento desde *Configuración ➔ Experiencia Global*.
* **Gestor de Categorías Dividido:** Interfaz clara y separada para categorías de Ingresos y Gastos.

---

## 🛠️ Stack Tecnológico

| Componente | Tecnología / Librería | Versión |
|---|---|---|
| **Frontend Core** | React | 19.x |
| **Bundler & Tooling** | Vite con `@vitejs/plugin-react` | 8.x |
| **Base de Datos & Auth** | Firebase (Auth + Cloud Firestore) | 12.x |
| **Almacenamiento Seguro** | Firebase Cloud Storage | 12.x |
| **Inteligencia Artificial** | `@google/generative-ai` (Gemini Flash / Pro) | 0.24.x |
| **Visualización de Datos** | Recharts | 2.x |
| **Tour Interactivo** | React-Joyride | 2.x |
| **Exportación** | jsPDF, XLSX | Últimas estables |
| **Estilos** | CSS3 nativo con variables dinámicas (Glassmorphism) | — |

---

## 🌐 Despliegue en Producción (Vercel)

El proyecto cuenta con despliegue continuo (CI/CD) conectado a la rama `main` en [Vercel](https://vercel.com):

* **URL Oficial de Producción:** [https://finance-nexus.vercel.app](https://finance-nexus.vercel.app)
* **Configuración SPA (`vercel.json`):** Reescrituras para enrutamiento interno de cliente y cabeceras de seguridad HTTP (`X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Referrer-Policy`).

---

## 📋 Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto basado en el siguiente esquema:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Google Gemini AI (Opcional si se configura vía UI BYOK)
VITE_GEMINI_API_KEY=AIzaSy...
```

---

## 💻 Instalación y Desarrollo Local

1. **Clonar el repositorio (incluyendo submódulo documental):**
   ```bash
   git clone --recurse-submodules https://github.com/nexuslabsaihq-svg/finance-nexus.git
   cd finance-nexus
   ```
   *Si ya clonaste el proyecto sin submódulo:*
   ```bash
   git submodule update --init --recursive
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:5173`.

4. **Compilar para producción:**
   ```bash
   npm run build
   ```

5. **Actualizar la base de conocimiento:**
   ```bash
   git submodule update --remote knowledge
   ```

---

## 📁 Estructura del Proyecto

```text
finance-nexus/
├── knowledge/                 # [Submódulo Git] Documentación, ADRs, arquitectura, seguridad y auditorías
├── PROJECT_CONTEXT.md         # Guía unificada de contexto y gobernanza para desarrolladores e IAs
├── docs/                      # Especificaciones del modelo financiero y reglas de negocio
├── public/                    # Assets estáticos públicos
├── src/
│   ├── assets/                # Imágenes y recursos del frontend
│   ├── components/            # Componentes reutilizables (Sidebar, Header, LockScreen, TourGuide, etc.)
│   ├── context/               # AppDataContext (Sincronización en tiempo real con Firestore)
│   ├── firebase/              # Inicialización de Firebase Auth, Firestore y Storage
│   ├── pages/                 # Vistas principales (Dashboard, Ingresos, Gastos, Deudas, IA, etc.)
│   ├── App.jsx                # Enrutador y control de sesión
│   ├── index.css              # Sistema de diseño, temas (Light/Dark) y Glassmorphism
│   └── main.jsx               # Punto de entrada de la aplicación
├── .gitmodules                # Configuración de submódulos Git (apunta a finance-nexus-knowledge)
├── firestore.rules            # Reglas de seguridad de Cloud Firestore
├── storage.rules              # Reglas de seguridad de Cloud Storage (comprobantes max 10MB)
├── vercel.json                # Configuración de despliegue y cabeceras de seguridad
├── package.json
└── README.md
```

---

## 🔒 Licencia y Confidencialidad

Propiedad privada de **Finance Nexus**. Todos los derechos reservados.
