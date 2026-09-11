# 💎 Finance Nexus — ERP Financiero Personal e Inteligente

> **Finance Nexus** es una plataforma web integral de gestión financiera personal y empresarial moderna, potenciada con Inteligencia Artificial (Google Gemini), análisis en tiempo real, simulación matemática de deudas e interfaz de alta gama con soporte Glassmorphism (Modo Oscuro y Claro).

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
* **LockScreen por Inactividad & Hard Logout:** Bloqueo de sesión ante inactividad prolongada y limpieza estricta de memoria local y credenciales.
* **Auditoría de Sesiones:** Registro de dispositivos, ubicaciones y control de accesos.
* **Espacios Colaborativos:** Gestión de cuentas compartidas con roles asignables (Propietario, Editor, Solo Lectura).

---

## 🛠️ Stack Tecnológico

| Componente | Tecnología / Librería | Versión |
|---|---|---|
| **Frontend Core** | React | 19.x |
| **Bundler & Tooling** | Vite con `@vitejs/plugin-react` | 8.x |
| **Base de Datos & Auth** | Firebase (Auth + Cloud Firestore) | 12.x |
| **Inteligencia Artificial** | `@google/generative-ai` (Gemini Flash / Pro) | 0.24.x |
| **Visualización de Datos** | Recharts | 2.x |
| **Tour Interactivo** | React-Joyride | 2.x |
| **Exportación** | jsPDF, XLSX | Últimas estables |
| **Estilos** | CSS3 nativo con variables dinámicas (Glassmorphism) | — |

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

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/nexuslabsaihq-svg/finance-nexus.git
   cd finance-nexus
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

---

## 📁 Estructura del Proyecto

```text
finance-nexus/
├── docs/                      # Especificaciones del modelo financiero y reglas de negocio
├── public/                    # Assets estáticos públicos
├── src/
│   ├── assets/                # Imágenes y recursos del frontend
│   ├── components/            # Componentes reutilizables (Sidebar, Header, LockScreen, TourGuide, etc.)
│   ├── context/               # AppDataContext (Sincronización en tiempo real con Firestore)
│   ├── firebase/              # Inicialización de Firebase Auth y Firestore
│   ├── pages/                 # Vistas principales (Dashboard, Ingresos, Gastos, Deudas, IA, etc.)
│   ├── App.jsx                # Enrutador y control de sesión
│   ├── index.css              # Sistema de diseño, temas (Light/Dark) y Glassmorphism
│   └── main.jsx               # Punto de entrada de la aplicación
├── firestore.rules            # Reglas de seguridad de Cloud Firestore
├── vercel.json                # Configuración de despliegue y cabeceras de seguridad
├── package.json
└── README.md
```

---

## 🔒 Licencia y Confidencialidad

Propiedad privada de **Finance Nexus**. Todos los derechos reservados.
