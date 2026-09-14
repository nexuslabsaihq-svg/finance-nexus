# 📝 BITÁCORA DETALLADA DE CAMBIOS Y TRAZABILIDAD DE CÓDIGO
## FINANCE NEXUS — REGISTRO HISTÓRICO DE INTERVENCIONES (FASES 1 A 4)

---

**Documento:** `docs/03-reports/03_BITACORA_DETALLADA_CAMBIOS.md`  
**Período de Ejecución:** Septiembre 2026  
**Responsable Técnico:** Antigravity Senior Software Engineer Agent  
**Aprobado por:** Isaac Patricio Pasten Díaz (CEO & Founder)  
**Total de Archivos Intervenidos:** 26 archivos (10 nuevos, 15 modificados, 1 eliminado)  

---

## 1. INVENTARIO GLOBAL DE ARCHIVOS INTERVENIDOS

```
finance-nexus/
 ├── docs/
 │    ├── 01-legal/
 │    │    ├── TERMINOS_Y_CONDICIONES.md           [NUEVO]
 │    │    └── POLITICA_PRIVACIDAD.md              [NUEVO]
 │    ├── 02-technical/
 │    │    └── FIRESTORE_RULES_SECURITY.md         [NUEVO]
 │    └── 03-reports/
 │         ├── 01_INFORME_EJECUTIVO.md             [NUEVO]
 │         ├── 02_INFORME_TECNICO_ARQUITECTURA.md  [NUEVO]
 │         ├── 03_BITACORA_DETALLADA_CAMBIOS.md    [NUEVO]
 │         ├── 04_MANUAL_OPERACIONES_Y_DESPLIEGUE.md [NUEVO]
 │         └── 05_DOSSIER_LEGAL_Y_COMPLIANCE_CHILE.md [NUEVO]
 ├── public/
 │    └── legal/
 │         ├── terminos-y-condiciones.html         [NUEVO]
 │         └── politica-privacidad.html            [NUEVO]
 └── src/
      ├── components/
      │    ├── AuthGuard.jsx                       [MODIFICADO]
      │    ├── ErrorBoundary.jsx                   [MODIFICADO]
      │    ├── LockScreen.jsx                      [MODIFICADO]
      │    ├── Sidebar.jsx                         [MODIFICADO]
      │    ├── CookieConsent.jsx                   [NUEVO]
      │    └── AppFooter.jsx                       [NUEVO]
      ├── context/
      │    ├── AppContext.js                       [NUEVO]
      │    ├── useAppData.js                       [NUEVO]
      │    └── AppDataContext.jsx                  [MODIFICADO]
      ├── firebase/
      │    └── config.js                           [MODIFICADO]
      ├── pages/
      │    ├── App.jsx                             [MODIFICADO]
      │    ├── Dashboard.jsx                       [MODIFICADO]
      │    ├── Documentos.jsx                      [MODIFICADO]
      │    ├── Fechas.jsx                          [MODIFICADO]
      │    ├── FlujoCaja.jsx                       [MODIFICADO]
      │    ├── Gastos.jsx                          [MODIFICADO]
      │    ├── IA.jsx                              [MODIFICADO]
      │    ├── Login.jsx                           [ELIMINADO]
      │    ├── Presupuestos.jsx                    [NUEVO]
      │    ├── Configuracion.jsx                   [MODIFICADO]
      │    └── Landing.jsx                         [MODIFICADO]
```

---

## 2. DETALLE DE MODIFICACIONES POR ARCHIVO

### 2.1 Archivos Creados (Nuevos)

#### 1. `src/context/AppContext.js`
- **Motivo:** Romper la co-exportación de contexto y componente que bloqueaba Fast Refresh en Vite.
- **Contenido:** Declaración pura y exportación de `AppDataContext = createContext(null)`.
- **Efecto:** Permite que Vite compile `AppDataContext.jsx` tratando el Provider como único export.

#### 2. `src/context/useAppData.js`
- **Motivo:** Desacoplar el hook consumidor de la definición del contexto.
- **Contenido:** Hook `useAppData()` con validación de existencia de contexto lanzando un error descriptivo en caso de uso fuera del Provider.
- **Efecto:** Importación estandarizada en todas las páginas de la aplicación.

#### 3. `src/pages/Presupuestos.jsx`
- **Motivo:** Atender la Tarea 3.3 creando el módulo central de control de presupuestos mensuales por categoría.
- **Contenido:**
  - Formulario de alta y edición reactiva de presupuestos.
  - Cálculo de gasto real por categoría cruzado con `fn_gastos`.
  - Barras de progreso porcentual con semáforo condicional (Verde, Naranja, Rosa).
  - Alertas de sobregiro y métricas consolidadas (Asignado, Gastado, Disponible).
  - Funciones utilitarias `createId()` y `getTimestamp()` declaradas fuera del componente para cumplir `react-hooks/purity`.
- **Efecto:** Módulo 100% operativo integrado a Firestore `fn_presupuestos`.

#### 4. `src/components/CookieConsent.jsx`
- **Motivo:** Cumplir con la Ley N° 21.719 sobre Protección de Datos Personales (Tarea 4.1).
- **Contenido:**
  - Banner flotante con glassmorphism oscuro.
  - Inicialización perezosa de estado con `useState(() => !!localStorage.getItem(COOKIE_KEY))` para evitar violar `react-hooks/set-state-in-effect`.
  - Botones "Aceptar todas" y "Solo esenciales".
  - Enlace directo a la Política de Privacidad y Derechos ARCO.
  - Listener para el evento `fn_open_cookie_consent`.
- **Efecto:** Protección legal activa en primer ingreso tanto en Landing como en App.

#### 5. `src/components/AppFooter.jsx`
- **Motivo:** Integrar enlaces institucionales y normativos requeridos por SERNAC (Tarea 4.2).
- **Contenido:**
  - Enlaces a SERNAC Financiero y Libro de Reclamos SERNAC.
  - Enlaces a Términos y Condiciones y Política de Privacidad.
  - Botón de reconfiguración de cookies.
  - Información corporativa: Finance Nexus SpA — RUT pendiente de confirmación, Santiago, Chile.
- **Efecto:** Presente al final de todas las páginas de la aplicación web.

#### 6. `docs/01-legal/TERMINOS_Y_CONDICIONES.md`
- **Motivo:** Formalización contractual de los términos del servicio bajo legislación chilena.
- **Contenido:** 7 cláusulas incluyendo renuncia expresa a ser entidad CMF y fijación de domicilio en Santiago.

#### 7. `docs/01-legal/POLITICA_PRIVACIDAD.md`
- **Motivo:** Regulación del tratamiento de datos personales conforme a la Ley N° 21.719.
- **Contenido:** Derechos ARCO, categorías de datos, aislamiento en Firestore y canal de contacto de privacidad.

#### 8. `public/legal/terminos-y-condiciones.html`
- **Motivo:** Exposición pública web accesible desde cualquier navegador.
- **Contenido:** Documento HTML estilizado con la identidad visual de Finance Nexus.

#### 9. `public/legal/politica-privacidad.html`
- **Motivo:** Exposición pública web de la política de privacidad.
- **Contenido:** Documento HTML estilizado con la identidad visual de Finance Nexus.

#### 10. `docs/02-technical/FIRESTORE_RULES_SECURITY.md`
- **Motivo:** Auditoría y verificación de seguridad de `firestore.rules` (Tarea 4.3).
- **Contenido:** Matriz de permisos, aislamiento por `userId` y validación de esquemas.

---

### 2.2 Archivos Modificados

#### 1. `src/context/AppDataContext.jsx`
- **Cambios Realizados:**
  - Se eliminó el comentario `// eslint-disable-next-line react-refresh/only-export-components`.
  - Se extrajo el hook `useFirestoreState` al nivel superior del módulo (top-level hook) para evitar recreaciones en cada render.
  - Se utilizó `initialRef` (`useRef(initialValue)`) para estabilizar dependencias en `useEffect`.
  - Se implementó la función `getClientDevice()` basada en `navigator.userAgent` para alimentar la colección `fn_sesiones`.
- **Resultado:** 0 advertencias de linter, listeners de Firestore estables.

#### 2. `src/components/AuthGuard.jsx`
- **Cambios Realizados:**
  - Se eliminaron `useState` y `useEffect` que llamaban a `setIsAuthorized(!!authUser)` de forma síncrona.
  - Se reemplazó por la variable calculada en render: `const isAuthorized = !!authUser;`.
- **Resultado:** Eliminación del error `react-hooks/set-state-in-effect`.

#### 3. `src/components/ErrorBoundary.jsx`
- **Cambios Realizados:**
  - Se capturó el parámetro `error` dentro de `getDerivedStateFromError(error)` y se guardó en el estado `{ hasError: true, error }`.
- **Resultado:** Eliminación del error `no-unused-vars`.

#### 4. `src/components/LockScreen.jsx`
- **Cambios Realizados:**
  - Se separó la función `resetTimer()` (que manipula únicamente referencias de temporizadores `timeoutRef`) del callback `handleUserActivity()` (que oculta la advertencia visual).
- **Resultado:** Eliminación de la llamada a `setState` en el efecto de montaje.

#### 5. `src/pages/FlujoCaja.jsx`
- **Cambios Realizados:**
  - Se eliminó el `useMemo` manual sobre el array de 3 elementos `waterfallData`.
  - Se limpió el mapeo de `historyData` usando `.slice().reverse()` inmutable.
- **Resultado:** Eliminación del error `react-hooks/preserve-manual-memoization`.

#### 6. `src/firebase/config.js`
- **Cambios Realizados:**
  - Corrección del typo en la variable de entorno: `VITE_GEMINA_API_KEY` $\rightarrow$ `VITE_GEMINI_API_KEY`.
- **Resultado:** Inicialización correcta de la API de Gemini.

#### 7. `src/pages/Dashboard.jsx`
- **Cambios Realizados:**
  - Corrección de typo `GeminaKey` a `GeminiKey`.
  - Implementación del Score Financiero real con la fórmula Opción B.
  - Integración del Gauge gráfico con colores condicionales (Verde, Naranja, Rosa).
  - Cálculo de métricas comparativas mes a mes con porcentajes de variación.
- **Resultado:** Dashboard dinámico conectado a la realidad del negocio.

#### 8. `src/pages/Fechas.jsx`
- **Cambios Realizados:**
  - Reescritura completa del componente para conectarlo a `fn_deudas` y `fn_gastos` recurrentes.
  - Implementación de orden cronológico estricto: Vencidos primero, Pendientes próximos en segundo lugar, Pagados al final.
  - Botón para marcar deudas como pagadas en tiempo real.
  - Vista vacía amigable con botón de acción.
- **Resultado:** Módulo 100% dinámico y funcional.

#### 9. `src/pages/Gastos.jsx`
- **Cambios Realizados:**
  - Conexión con `Presupuestos`: alerta visual destacada cuando alguna categoría excede el tope mensual.
  - Botón de acceso directo `🎯 Gestionar Presupuestos` en la cabecera de la tabla y en el estado vacío.
  - Barras de progreso de desglose coloreadas en rosa si se supera el 100%.
- **Resultado:** Sincronización bidireccional entre Gastos y Presupuestos.

#### 10. `src/App.jsx`
- **Cambios Realizados:**
  - Importación y montaje de `Presupuestos` en el switch `renderPage()`.
  - Importación y montaje de `CookieConsent` en las vistas Landing y App.
  - Montaje de `AppFooter` al final del contenedor con scroll.
- **Resultado:** Enrutamiento completo y componentes globales integrados.

#### 11. `src/components/Sidebar.jsx`
- **Cambios Realizados:**
  - Incorporación del ítem de navegación `🎯 Presupuestos` bajo la sección *Finanzas*.
  - Actualización del icono de Estrategia Deudas a `⚡` para mantener distinción visual.
- **Resultado:** Menú lateral alineado con todos los módulos.

#### 12. `src/pages/Configuracion.jsx`
- **Cambios Realizados:**
  - Adición de la tarjeta `🏛️ Marco Legal, SERNAC & Privacidad de Datos`.
  - Enlaces a documentos legales y SERNAC.
  - Botón para reabrir el modal de preferencias de cookies.
- **Resultado:** Panel de configuración alineado a estándares de transparencia.

#### 13. `src/pages/Landing.jsx`
- **Cambios Realizados:**
  - Actualización de los enlaces del Footer: columna "Legal & SERNAC" con enlaces a Términos, Privacidad, SERNAC Financiero, Reclamos y Cookies.
- **Resultado:** Landing page 100% conforme a Ley 19.496 y Ley 21.719.

#### 14. `src/pages/Documentos.jsx` y `src/pages/IA.jsx`
- **Cambios Realizados:**
  - Corrección del typo `GeminaKey` $\rightarrow$ `GeminiKey`.
- **Resultado:** Consistencia total en el acceso a la llave de IA.

---

### 2.3 Archivo Eliminado (Depuración de Código Muerto)

#### 1. `src/pages/Login.jsx`
- **Motivo:** Código huérfano. La autenticación oficial de Finance Nexus se realiza mediante el modal modalizado de Google OAuth en `Landing.jsx` (`setShowLogin(true)`).
- **Líneas eliminadas:** 111 líneas de código redundante.
- **Impacto:** Reducción del peso del bundle de distribución y eliminación de referencias muertas.
