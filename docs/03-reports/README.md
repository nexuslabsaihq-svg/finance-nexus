# 📚 BIBLIOTECA DE DOCUMENTACIÓN OFICIAL — FINANCE NEXUS SpA
## AUDITORÍA, ARQUITECTURA, BITÁCORA Y CUMPLIMIENTO REGULATORIO

---

**Empresa:** Finance Nexus SpA  
**RUT:** [Pendiente de confirmación]  
**CEO & Fundador:** Isaac Patricio Pasten Díaz  
**Email:** nexuslabsai.hq@gmail.com  
**Ubicación:** Santiago de Chile  
**Repositorio GitHub:** [https://github.com/nexuslabsaihq-svg/finance-nexus.git](https://github.com/nexuslabsaihq-svg/finance-nexus.git)  
**Versión del Sistema:** 2.4.0 (Production-Ready)  
**Fecha de Publicación:** Septiembre de 2026  

> [!NOTE]
> **AVISO LEGAL:** Toda la documentación corporativa y regulatoria en este repositorio tiene carácter de **BORRADOR OPERATIVO** y requiere formalización y revisión legal especializada en la República de Chile previo a su entrada en vigencia definitiva. El despliegue a producción se encuentra en **Pausa Preventiva** hasta completar las validaciones correspondientes.

---

## 📑 ÍNDICE MAESTRO DE REPORTES Y AUDITORÍAS DISPONIBLES

### 1. Informes Ejecutivos y Técnicos Principales

| N° | Documento | Audiencia Principal | Descripción y Alcance |
|---|---|---|---|
| **01** | [`01_INFORME_EJECUTIVO.md`](./01_INFORME_EJECUTIVO.md) | Dirección General / CEO / Inversionistas | Resumen estratégico de alto nivel, misión, visión, KPIs de negocio alcanzados, impacto operacional y roadmap para escalamiento comercial. |
| **02** | [`02_INFORME_TECNICO_ARQUITECTURA.md`](./02_INFORME_TECNICO_ARQUITECTURA.md) | CTO / Ingenieros de Software / DevOps | Arquitectura de tres capas para Fast Refresh, resolución de 6 errores críticos de React 19, esquemas de Firestore, fórmulas matemáticas del Score Financiero y métricas de build (540ms). |
| **03** | [`03_BITACORA_DETALLADA_CAMBIOS.md`](./03_BITACORA_DETALLADA_CAMBIOS.md) | Auditores de Código / QA / Desarrolladores | Registro exhaustivo archivo por archivo de los componentes creados, modificados o eliminados (incluyendo depuración de código muerto en `Login.jsx`). |
| **04** | [`04_MANUAL_OPERACIONES_Y_DESPLIEGUE.md`](./04_MANUAL_OPERACIONES_Y_DESPLIEGUE.md) | Operaciones / DevOps / SysAdmin | Guía paso a paso para instalación local, configuración de variables `.env`, validación de linter, compilación de producción y despliegue en Firebase Hosting. |
| **05** | [`05_DOSSIER_LEGAL_Y_COMPLIANCE_CHILE.md`](./05_DOSSIER_LEGAL_Y_COMPLIANCE_CHILE.md) | Asesoría Legal / Compliance / SERNAC | Análisis regulatorio detallado de la Ley N° 21.719 (Protección de Datos Personales), Ley N° 19.496 (SERNAC), Derechos ARCO, política de cookies y deslinde normativo CMF. |

---

### 2. Auditorías de Gobernanza, Riesgos y Preparación de Lanzamiento (Fase 5A)

- [`docs/MASTER_AUDIT_AND_BACKLOG.md`](../MASTER_AUDIT_AND_BACKLOG.md): Auditoría transversal por áreas y backlog priorizado con matriz de evidencias.
- [`docs/LEGAL_STATUS_AND_GAPS.md`](../LEGAL_STATUS_AND_GAPS.md): Diagnóstico exhaustivo de brechas legales, societarias y regulatorias.
- [`docs/TECHNICAL_RISK_REGISTER.md`](../TECHNICAL_RISK_REGISTER.md): Registro formal de riesgos técnicos (TR-01 a TR-06), mitigaciones y responsables.
- [`docs/RELEASE_READINESS_CHECKLIST.md`](../RELEASE_READINESS_CHECKLIST.md): Criterios de Go/No-Go y estado de pausa preventiva para producción.
- [`docs/00_INDEX.md`](../00_INDEX.md): Índice maestro estructurado de toda la documentación del repositorio.

---

### 3. Suite Legal, Operativa y de Seguridad Específica

- [`docs/01-legal/MATRIZ_DOCUMENTAL_LEGAL.md`](../01-legal/MATRIZ_DOCUMENTAL_LEGAL.md): Matriz de 21 documentos corporativos, societarios y regulatorios.
- [`docs/01-legal/PENDIENTES_LEGALES_Y_VALIDACIONES.md`](../01-legal/PENDIENTES_LEGALES_Y_VALIDACIONES.md): Bitácora de validaciones pendientes (RUT SpA, estatutos, inicio de actividades SII).
- [`docs/01-legal/TERMINOS_Y_CONDICIONES.md`](../01-legal/TERMINOS_Y_CONDICIONES.md): Borrador operativo de Términos y Condiciones.
- [`docs/01-legal/POLITICA_PRIVACIDAD.md`](../01-legal/POLITICA_PRIVACIDAD.md): Borrador operativo de Política de Privacidad conforme a Ley N° 21.719.
- [`docs/01-legal/POLITICA_DE_COOKIES_BORRADOR.md`](../01-legal/POLITICA_DE_COOKIES_BORRADOR.md): Política independiente de cookies y almacenamiento local.
- [`docs/02-technical/INVENTARIO_TECNOLOGIAS_Y_COOKIES.md`](../02-technical/INVENTARIO_TECNOLOGIAS_Y_COOKIES.md): Auditoría forense de almacenamiento y ausencia de trackers de terceros.
- [`docs/02-technical/PLAN_PRUEBAS_FIREBASE_SECURITY.md`](../02-technical/PLAN_PRUEBAS_FIREBASE_SECURITY.md): 14 escenarios reproducibles de test para Firebase Emulator Suite.
- [`docs/02-technical/PROPUESTA_MITIGACION_SHEETJS.md`](../02-technical/PROPUESTA_MITIGACION_SHEETJS.md): Propuesta comparativa de reemplazo seguro de `xlsx@0.18.5`.
- [`docs/02-technical/FIRESTORE_RULES_SECURITY.md`](../02-technical/FIRESTORE_RULES_SECURITY.md): Auditoría de reglas de seguridad de Google Cloud Firestore.
- [`docs/04-operational/PROCEDIMIENTO_SOPORTE_Y_RECLAMOS.md`](../04-operational/PROCEDIMIENTO_SOPORTE_Y_RECLAMOS.md): Procedimiento interno de gestión de incidencias y reclamos.
- [`docs/04-operational/MATRIZ_SLA_SOPORTE.md`](../04-operational/MATRIZ_SLA_SOPORTE.md): Matriz de SLA y tiempos objetivo de respuesta (Sev-1 a Sev-4).

---

## 🛡️ ESTADO DE CERTIFICACIÓN DE CÓDIGO

- **Linter Estricto ESLint:** `0 errores, 0 warnings` (`npx eslint .`)
- **Compilador Vite:** Exitoso en `540ms` (860 módulos transformados)
- **Aislamiento Cloud Firestore:** `100% de colecciones bajo /users/{userId}/appData/*`
- **Despliegue a Producción:** `En Pausa Preventiva (condicionado a validación societaria)`
