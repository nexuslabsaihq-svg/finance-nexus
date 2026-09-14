# ⚖️ ESTADO LEGAL Y ANÁLISIS DE BRECHAS REGULATORIAS (GAPS)
## FINANCE NEXUS SpA — INFORME DE DIAGNÓSTICO JURÍDICO PARA CHILE

---

**Documento:** `docs/LEGAL_STATUS_AND_GAPS.md`  
**Versión:** 1.0 (Auditoría Fase 5A)  
**Fecha:** 14 de Septiembre de 2026  
**Responsable:** Isaac Patricio Pasten Díaz (Fundador & CEO)  
**Clasificación:** Confidencial / Asuntos Jurídicos  

---

## 1. RESUMEN EJECUTIVO DE CUMPLIMIENTO Y BRECHAS

Finance Nexus SpA ha implementado las salvaguardas técnicas preliminares necesarias para operar en fase de pruebas (MVP), no obstante, existen brechas regulatorias formales que deben ser subsanadas antes de la comercialización abierta de suscripciones de pago:

| Dimensión Regulatorio | Estado Técnico en Código | Estado Jurídico Formal | Brecha Identificada (Gap) | Severidad |
|---|---|---|---|---|
| **Identidad Societaria** | 🟡 Denominación provisional en web | 🔴 Sin RUT de sociedad confirmado | Imposibilidad de facturar a nombre de la SpA. | **Crítica** |
| **Protección de Datos (Ley 21.719)** | 🟢 Banner y storage auditado | 🟡 Política en borrador operativo | Falta de visación por abogado y designación de DPO. | Media |
| **Derechos del Consumidor (Ley 19.496)** | 🟢 Canal de correo y enlaces SERNAC | 🟡 Términos en borrador operativo | Cláusulas de limitación de responsabilidad preliminares. | Media |
| **Regulación CMF (Fintech)** | 🟢 Deslinde normativo visible | 🟢 Conforme (No es entidad bancaria) | Ninguna (Plataforma puramente analítica). | Nula |
| **Propiedad Intelectual** | 🟢 Código versionado en GitHub | 🔴 Marca no registrada en INAPI | Riesgo de registro de la marca "Finance Nexus" por terceros. | Alta |

---

## 2. DETALLE DE BRECHAS Y PLAN DE MITIGACIÓN

### 2.1 Brecha 1: Personería Jurídica y Facturación
- **Diagnóstico:** El número `21.133.651-k` utilizado preliminarmente correspondía a una identificación personal del fundador y no al Rol Único Tributario (RUT) de la sociedad Finance Nexus SpA.
- **Mitigación en Código:** Se erradicó dicho número de la totalidad del código fuente, interfaces gráficas, pie de página y documentos públicos, fijando la denominación `Finance Nexus SpA — RUT pendiente de confirmación`.
- **Acción Pendiente:** Obtener la Cédula RUT electrónica ante el SII y el certificado de inicio de actividades para habilitar la facturación electrónica.

### 2.2 Brecha 2: Validez Legal de Contratos Electrónicos
- **Diagnóstico:** Los Términos y Condiciones y la Política de Privacidad fueron redactados por el equipo de ingeniería como especificación técnica y operativa.
- **Mitigación en Código:** Se incorporó en todos los documentos una advertencia expresa declarándolos como `BORRADOR OPERATIVO — REQUIERE REVISIÓN LEGAL EN CHILE` para evitar inducir a error a los usuarios respecto a su carácter formal.
- **Acción Pendiente:** Contratar una asesoría jurídica en Santiago de Chile para la revisión final de las cláusulas contractuales.

### 2.3 Brecha 3: Gestión de Reclamos y SERNAC
- **Diagnóstico:** En versiones anteriores se mencionaba un "Libro de Reclamos SERNAC", lo que podía confundir al usuario haciendo creer que existía un canal estatal integrado en el software.
- **Mitigación en Código:** Se clarificó la separación entre el **canal interno de atención directa** (`nexuslabsai.hq@gmail.com`) y el **portal público externo del SERNAC** (para orientación general del consumidor).

---

## 3. CHECKLIST DE FORMALIZACIÓN LEGAL PARA SALIDA A MERCADO

- [ ] Acreditación de Estatutos de Tu Empresa en un Día.
- [ ] Asignación de RUT definitivo de Finance Nexus SpA.
- [ ] Certificado de Inicio de Actividades SII con código de actividad 620100.
- [ ] Validación de la Política de Privacidad por abogado colegiado.
- [ ] Solicitud de Registro de Marca denominativa y mixta ante INAPI.
- [ ] Obtención de Patente Comercial municipal definitiva.
