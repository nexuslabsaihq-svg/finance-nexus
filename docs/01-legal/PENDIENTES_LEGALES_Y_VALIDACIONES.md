# 📋 REGISTRO DE PENDIENTES LEGALES Y VALIDACIONES CORPORATIVAS
## FINANCE NEXUS SpA — ESTADO DE FORMALIZACIÓN Y BRECHAS EN CHILE

---

**Documento:** `docs/01-legal/PENDIENTES_LEGALES_Y_VALIDACIONES.md`  
**Estado:** Activo / En Seguimiento  
**Fecha de Creación:** 14 de Septiembre de 2026  
**Responsable:** Isaac Patricio Pasten Díaz (Fundador & CEO)  
**Propósito:** Registrar formalmente todos los antecedentes jurídicos, tributarios y regulatorios de la empresa que continúan pendientes de confirmación oficial antes del lanzamiento comercial.  

---

## 1. ANTECEDENTES SOCIETARIOS Y TRIBUTARIOS PENDIENTES

| Ítem | Estado Actual | Documento de Respaldo Requerido | Riesgo Asociado | Próxima Acción / Responsable |
|---|---|---|---|---|
| **RUT de la Sociedad** | 🔴 **Pendiente de Confirmación** | Cédula RUT electrónica emitida por el Servicio de Impuestos Internos (SII). | Atribución incorrecta de RUT personal a la persona jurídica. | Isaac Pasten tramitará la obtención o entrega del RUT de la SpA. |
| **Constitución de Sociedad** | 🟡 **Pendiente de Copia** | Escritura pública o estatuto actualizado del Registro de Empresas y Sociedades (RES / Tu Empresa en un Día). | Falta de acreditación de personería jurídica ante bancos y pasarelas de pago. | Cargar copia de estatutos en `docs/01-legal/`. |
| **Certificado de Vigencia** | 🟡 **Pendiente** | Certificado de vigencia emitido por el Conservador de Bienes Raíces (CBRS) o Registro Electrónico RES. | Invalidez temporal para suscribir contratos comerciales vinculantes. | Descargar certificado vigente con código de verificación. |
| **Inicio de Actividades SII** | 🔴 **Pendiente de Verificación** | Formulario F-4415 o Certificado de Inicio de Actividades ante el SII. | Imposibilidad legal de emitir boletas o facturas exentas/afectas a IVA. | Verificar giro comercial tributario (ej. Actividades de desarrollo de software 620100). |
| **Facturación Electrónica** | 🔴 **Pendiente** | Certificación de emisor electrónico en el portal del SII. | Bloqueo para cobro formal de suscripciones SaaS (Planes Pro/Enterprise). | Configurar certificado digital y enrolamiento en sistema de facturación. |
| **Patente Municipal** | 🔴 **Pendiente** | Comprobante de pago o exención de patente en la I. Municipalidad de Santiago u otra comuna. | Clausura administrativa o multas municipales por ejercicio de actividad comercial. | Tramitar patente comercial una vez obtenido el inicio de actividades del SII. |

---

## 2. AUDITORÍA DE PRIVACIDAD Y CUMPLIMIENTO LEY N° 21.719

| Requisito Legal | Estado Actual | Observación Técnica | Acción Requerida |
|---|---|---|---|
| **Política de Privacidad** | 🟡 **Borrador Operativo** | Texto implementado en la app web y docs; no visado por abogado. | Someter a revisión de un abogado chileno especialista en derecho digital. |
| **Política de Cookies** | 🟡 **Borrador Operativo** | Banner reactivo funcionando en `localStorage`; falta validación legal. | Mantener categorización de cookies estrictamente técnicas. |
| **Designación de DPO** | 🟡 **Pendiente de Formalización** | Se utiliza canal transitorio `nexuslabsai.hq@gmail.com`. | Designar formalmente al Delegado de Protección de Datos (DPO) conforme al art. 38 Ley 21.719. |
| **Registro de Actividades de Tratamiento (RAT)** | 🔴 **Pendiente de Elaboración** | Exigido por el estándar de la Ley 21.719 para responsables de bases de datos. | Construir inventario exhaustivo de datos financieros almacenados. |
| **DPA con Google / Firebase** | 🟢 **Suscrito por defecto** | Firebase Data Processing and Security Terms (GCP DPA estándar). | Conservar respaldo del anexo de procesamiento de datos de Google Cloud. |

---

## 3. PROTECCIÓN AL CONSUMIDOR Y SERNAC (LEY N° 19.496)

| Requisito | Estado Actual | Medida Adoptada |
|---|---|---|
| **Canal de Soporte Directo** | 🟢 **Implementado** | Enlaces y pie de página dirigen a `nexuslabsai.hq@gmail.com`. |
| **SLA de Respuesta** | 🟡 **Política Interna Preliminar** | Objetivo interno fijado en 48 horas hábiles para requerimientos de usuarios. |
| **Diferenciación con SERNAC** | 🟢 **Aclarado** | Se eliminó cualquier referencia a un "Libro de Reclamos SERNAC propio", aclarándolo como portal público externo. |
| **Términos del Servicio** | 🟡 **Borrador Operativo** | Cláusulas de renuncia CMF redactadas; pendiente de formalización jurídica. |

---

## 4. PROPIEDAD INTELECTUAL Y MARCA COMERCIAL

| Activo | Estado Actual | Acción Requerida |
|---|---|---|
| **Marca "Finance Nexus"** | 🟡 **En Trámite / No Registrada** | Solicitar informe de factibilidad y registro ante el Instituto Nacional de Propiedad Industrial (**INAPI**) en clases 9 (Software) y 36 (Servicios financieros y de análisis). |
| **Código Fuente y Software** | 🟢 **Resguardado** | Repositorio privado en GitHub con control de versiones y autoría de commits. |
