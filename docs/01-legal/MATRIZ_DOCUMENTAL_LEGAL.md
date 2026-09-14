# 📑 MATRIZ DOCUMENTAL Y DE CUMPLIMIENTO CORPORATIVO
## FINANCE NEXUS SpA — INVENTARIO NORMATIVO Y CONTRACTUAL EN CHILE

---

**Documento:** `docs/01-legal/MATRIZ_DOCUMENTAL_LEGAL.md`  
**Empresa:** Finance Nexus SpA — RUT pendiente de confirmación  
**Versión:** 1.0 (Auditoría Fase 5A)  
**Fecha de Publicación:** 14 de Septiembre de 2026  
**Responsable Corporativo:** Isaac Patricio Pasten Díaz (Fundador & CEO)  
**Propósito:** Mapeo de gobernanza documental que audita la existencia, estado de formalización, publicación y próxima acción para cada instrumento jurídico, tributario y de seguridad requerido para operar en Chile.  

---

## 1. MATRIZ DE GOBERNANZA DOCUMENTAL (21 INSTRUMENTOS CANÓNICOS)

| N° | Documento | Existe | Estado | Publicado | Responsable | Revisión Legal | Próxima Acción |
|---|---|---|---|---|---|---|---|
| **01** | **Estatutos Sociales** | 🟡 Parcial | En trámite de entrega | ❌ No | Isaac Pasten | Pendiente | Cargar copia de estatutos constitucionales en `docs/01-legal/`. |
| **02** | **Certificado de Vigencia** | 🔴 No | Pendiente de emisión | ❌ No | Isaac Pasten | Pendiente | Solicitar en línea al Registro de Empresas y Sociedades (RES). |
| **03** | **RUT de la Sociedad** | 🔴 No | Pendiente confirmación | ❌ No | Isaac Pasten | Pendiente | Obtener e ingresar RUT formal otorgado por el SII. |
| **04** | **Inicio de Actividades SII** | 🔴 No | Pendiente verificación | ❌ No | Isaac Pasten | Pendiente | Tramitar verificación de actividades en sii.cl con giro software. |
| **05** | **Carpeta Tributaria** | 🔴 No | No iniciada | ❌ No | Contador / Asesor | Pendiente | Generar primera carpeta tributaria electrónica tras primer período. |
| **06** | **Facturación Electrónica** | 🔴 No | Pendiente | ❌ No | Isaac Pasten | Pendiente | Obtener certificado digital de firma y enrolar sistema de emisión. |
| **07** | **Patente Municipal** | 🔴 No | Pendiente | ❌ No | Isaac Pasten | Pendiente | Tramitar en la municipalidad del domicilio comercial. |
| **08** | **Términos y Condiciones** | 🟢 Sí | Borrador Operativo v1.0 | 🟢 Sí (Web/App) | Dev Agent / Isaac | **Pendiente abogado** | Revisión con especialista legal antes de lanzamiento comercial. |
| **09** | **Política de Privacidad** | 🟢 Sí | Borrador Operativo v1.0 | 🟢 Sí (Web/App) | Dev Agent / Isaac | **Pendiente abogado** | Adaptar a directrices finales de la Agencia de Protección de Datos. |
| **10** | **Política de Cookies** | 🟢 Sí | Borrador Operativo v1.0 | 🟢 Sí (Web/App) | Dev Agent / Isaac | **Pendiente abogado** | Validar clasificación de cookies y persistencia en `localStorage`. |
| **11** | **Política de Reembolsos y Cancelación** | 🟡 Parcial | Borrador en Términos | ❌ No autónomo | Isaac Pasten | Pendiente | Crear documento autónomo para suscripciones PRO/Enterprise. |
| **12** | **Procedimiento de Reclamos** | 🟢 Sí | Documentado v1.0 | 🟢 Sí (Docs) | Isaac Pasten | Interna | Implementar en `docs/04-operational/PROCEDIMIENTO_SOPORTE_Y_RECLAMOS.md`. |
| **13** | **Manual de Soporte y Matriz SLA** | 🟢 Sí | Documentado v1.0 | 🟢 Sí (Docs) | Equipo Operaciones | Interna | Implementar en `docs/04-operational/MATRIZ_SLA_SOPORTE.md`. |
| **14** | **Canal de Contacto de Privacidad (DPO)** | 🟢 Sí | Operativo (`nexuslabsai.hq@gmail.com`) | 🟢 Sí (Web/Footer) | Isaac Pasten | Interna | Designar formalmente DPO titular ante eventuales requerimientos. |
| **15** | **Registro de Actividades de Tratamiento (RAT)** | 🟡 Parcial | Mapeado en Firestore rules | ❌ No formal | Dev Agent / Isaac | Pendiente | Formalizar inventario detallado de datos bajo Ley 21.719. |
| **16** | **Contratos / DPA con Proveedores (Google Cloud)** | 🟢 Sí | Suscrito por servicio | ❌ No local | Google Cloud / Isaac | Estándar GCP | Archivar copia del GCP Data Processing and Security Terms. |
| **17** | **Acuerdos de Confidencialidad (NDA)** | 🟡 Parcial | Modelo estándar | ❌ No | Isaac Pasten | Pendiente | Suscribir con colaboradores técnicos y desarrolladores externos. |
| **18** | **Registro de Marca (INAPI)** | 🔴 No | Pendiente de ingreso | ❌ No | Isaac Pasten | Pendiente | Solicitar informe de búsqueda y registrar "Finance Nexus" en INAPI. |
| **19** | **Política de Retención y Eliminación de Datos** | 🟡 Parcial | Definida en borrador | ❌ No autónoma | Dev Agent / Isaac | Pendiente | Formalizar borrado de sesiones inactivas y solicitud de baja. |
| **20** | **Plan de Respuesta ante Incidentes de Seguridad** | 🟡 Parcial | Arquitectura Zero-Trust | ❌ No formal | Dev Agent / Isaac | Pendiente | Redactar protocolo formal de notificación en caso de brecha. |
| **21** | **Plan de Backups y Recuperación de Desastres** | 🟢 Sí | Google Cloud Backup nativo | ❌ No manual | DevOps / GCP | Estándar Cloud | Documentar periodicidad y procedimiento de restauración de Firestore. |

---

## 2. CRITERIOS DE CLASIFICACIÓN DE ESTADOS

- 🟢 **Verde (Implementado / Operativo):** Documento o procedimiento existente, integrado al código fuente o documentado en el repositorio con respaldo verificable.
- 🟡 **Amarillo (Borrador / Parcial):** Documento redactado en calidad de borrador operativo para entorno MVP o en trámite de consolidación; requiere visación legal externa o formalización.
- 🔴 **Rojo (Pendiente Crítico):** Instrumento societario o tributario formal indispensable que requiere gestión humana directa ante organismos del Estado (SII, Notaría, INAPI, Municipalidad).
