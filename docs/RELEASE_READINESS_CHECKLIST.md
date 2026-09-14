# ✅ LISTA DE VERIFICACIÓN PARA SALIDA A PRODUCCIÓN (RELEASE READINESS)
## FINANCE NEXUS SpA — CRITERIOS DE AUTORIZACIÓN Y GATEWAYS DE CALIDAD

---

**Documento:** `docs/RELEASE_READINESS_CHECKLIST.md`  
**Versión:** 1.0 (Auditoría Fase 5A)  
**Fecha:** 14 de Septiembre de 2026  
**Aprobador Final:** Isaac Patricio Pasten Díaz (Fundador & CEO)  

---

## 1. COMPUERTAS DE CALIDAD TÉCNICA (TECHNICAL QUALITY GATES)

- [x] **Compilación de Producción:** `npm run build` genera bundle sin errores en $< 600$ ms.
- [x] **Linter Estricto:** `npx eslint .` finaliza con 0 errores y 0 advertencias.
- [x] **Fast Refresh:** Hot Module Replacement opera sin pérdidas de estado en desarrollo.
- [x] **Aislamiento de Hooks:** Todos los componentes cumplen reglas de pureza de React 19.
- [x] **Persistencia de Datos:** Colecciones de deudas, gastos y presupuestos sincronizadas en vivo.
- [x] **Score Financiero:** Fórmula real Opción B operativa con Gauge condicional.
- [ ] **Mitigación SheetJS:** Aprobación y ejecución de `PROPUESTA_MITIGACION_SHEETJS.md` (Pendiente Fase 5B).
- [ ] **Tests de Seguridad Firestore:** Ejecución en emulador local de `PLAN_PRUEBAS_FIREBASE_SECURITY.md` (Pendiente Fase 5B).

---

## 2. COMPUERTAS DE SEGURIDAD Y PRIVACIDAD (SECURITY & PRIVACY GATES)

- [x] **Zero-Trust en Repo:** `firestore.rules` con Deny by Default y validación de `userId`.
- [x] **Protección de Datos:** Banner de cookies persistente en `localStorage` (`CookieConsent.jsx`).
- [x] **Prohibición de IP/Geolocalización:** Cero recolección de datos de ubicación o IP pública.
- [x] **Ausencia de Píxeles:** Verificado 0 trackers de marketing (Meta, Google Analytics, Hotjar).
- [x] **Canal de Privacidad:** Correo `nexuslabsai.hq@gmail.com` visible y operativo.
- [ ] **Verificación de Despliegue de Reglas:** Validar que Firebase Console tenga las mismas reglas que el repo (Pendiente antes de deploy).

---

## 3. COMPUERTAS LEGALES Y DE NEGOCIO (LEGAL & BUSINESS GATES)

- [x] **Erradicación de RUT Personal:** Eliminado `21.133.651-k` atribuido a la persona jurídica en código y web.
- [x] **Denominación Provisional:** `Finance Nexus SpA — RUT pendiente de confirmación` adoptada formalmente.
- [x] **Borradores Legales Identificados:** Términos y Privacidad rotulados con banner de borrador visible.
- [x] **Deslinde SERNAC:** Enlaces a SERNAC identificados como entidad externa de orientación.
- [x] **Deslinde CMF:** Advertencia visible de que el software no es banco ni entidad CMF.
- [ ] **RUT Oficial de Sociedad:** Tramitar y registrar RUT emitido por el SII (Pendiente fundador).
- [ ] **Visación Legal:** Contratar revisión de Términos y Privacidad con abogado chileno (Pendiente fundador).
- [ ] **Registro de Marca:** Ingreso de solicitud en INAPI (Pendiente fundador).

---

## 4. DICTAMEN DE AUTORIZACIÓN DE DESPLIEGUE A PRODUCCIÓN

| Gateway | Estado | Autorización |
|---|---|---|
| **Calidad de Código y Frontend** | 🟢 **100% Listo** | Aprobado técnicamente para staging / laboratorio |
| **Seguridad de Reglas en Repo** | 🟢 **100% Listo** | Aprobado a nivel de código fuente |
| **Compliance y Marco Societario** | 🟡 **Borrador Operativo** | **PAUSADO PARA PRODUCCIÓN HASTA OBTENCIÓN DE RUT SII** |
| **ESTADO GENERAL** | 🛑 **PAUSA PREVENTIVA** | **NO EJECUTAR `firebase deploy` HASTA AUTORIZACIÓN DEL CEO** |
