# 🛡️ MATRIZ DE RIESGOS TÉCNICOS Y PLAN DE MITIGACIÓN
## FINANCE NEXUS — TECHNICAL RISK REGISTER (TRR)

---

**Documento:** `docs/TECHNICAL_RISK_REGISTER.md`  
**Versión:** 1.0 (Auditoría Fase 5A)  
**Fecha:** 14 de Septiembre de 2026  
**Responsable Técnico:** Antigravity Senior Software Engineer Agent  

---

## 1. MATRIZ DE RIESGOS TÉCNICOS IDENTIFICADOS

| ID | Categoría | Descripción del Riesgo | Probabilidad | Impacto | Nivel de Riesgo | Estado Actual | Estrategia de Mitigación |
|---|---|---|---|---|---|---|---|
| **TR-01** | Dependencias | Vulnerabilidad de Prototype Pollution y ReDoS en `xlsx@0.18.5`. | Baja | Alto | 🟡 **Medio** | Mitigado por arquitectura (solo lectura en IA). | Reemplazo por módulo nativo `exportToCsv.js` documentado en `PROPUESTA_MITIGACION_SHEETJS.md`. |
| **TR-02** | Rendimiento | Chunks generados por Vite mayores a 600 kB (`vendor-DSrc86ei.js`). | Alta | Bajo | 🟡 **Medio** | Monitoreado | Implementar `React.lazy()` en páginas secundarias (Informes, IA, Documentos) en Fase 5B. |
| **TR-03** | Seguridad Cloud | Reglas de Firestore locales no sincronizadas con consola Firebase. | Media | Alto | 🟡 **Medio** | Documentado | Mantener despliegue en pausa hasta ejecutar suite `PLAN_PRUEBAS_FIREBASE_SECURITY.md`. |
| **TR-04** | Datos Privacidad | Riesgo de recolección excesiva de datos de sesión (IP pública). | Nula | Alto | 🟢 **Bajo / Neutralizado** | Neutralizado | **Prohibición estricta de recolectar IP pública**; solo uso de `navigator.userAgent` local. |
| **TR-05** | API Externa | Agotamiento de cuota o fallas de latencia en la API de Google Gemini. | Media | Medio | 🟢 **Bajo / Controlado** | Controlado | Rate-limiting local en `localStorage` (`fn_nexus_rates`) y manejo de errores con fallback visual. |
| **TR-06** | Compatibilidad | Incompatibilidad de scripts `.ps1` en PowerShell de Windows. | Alta | Bajo | 🟢 **Bajo / Resuelto** | Resuelto | Documentado uso de `cmd.exe /c` o cambio de política de ejecución en `MANUAL_OPERACIONES_Y_DESPLIEGUE.md`. |

---

## 2. PLAN DE ACCIÓN Y MONITOREO DE RIESGOS

1. **Revisión de Dependencias en Cada Sprint:** Auditoría periódica con `npm audit` para vigilar paquetes de npm.
2. **Revisión Continua de Linter:** La regla estricta de `0 errores, 0 warnings` es condición *sine qua non* para aceptar cualquier cambio en el repositorio.
3. **Cero Tolerancia a Brechas de Privacidad:** No se incorporarán herramientas de telemetría sin evaluación previa de impacto bajo la Ley 21.719.
