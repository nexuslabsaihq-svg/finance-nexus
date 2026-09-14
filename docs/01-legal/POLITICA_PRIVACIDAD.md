# 🔒 Política de Privacidad y Tratamiento de Datos — Finance Nexus SpA
> **ESTADO DOCUMENTAL: BORRADOR OPERATIVO — REQUIERE REVISIÓN LEGAL EN CHILE**  
> **Versión:** 1.0 (Borrador de Trabajo)  
> **Fecha de Última Actualización:** 14 de Septiembre de 2026  
> **Responsable:** Isaac Patricio Pasten Díaz (Fundador & CEO)  
> **Fecha Prevista de Revisión Legal:** Octubre de 2026  
> **Advertencia de Alcance:** *El presente documento constituye un borrador preliminar de compliance para la etapa MVP conforme a la Ley N° 21.719 de Chile. No sustituye la auditoría y formalización definitiva por un abogado especialista en protección de datos personales.*

---

**Razón Social:** Finance Nexus SpA — RUT pendiente de confirmación  
**RUT Empresa:** `[RUT DE LA SOCIEDAD PENDIENTE DE CONFIRMACIÓN]`  
**Representante Legal:** Isaac Patricio Pasten Díaz  
**Contacto DPO / Privacidad:** nexuslabsai.hq@gmail.com  

---

## 1. Identificación del Responsable del Tratamiento
El responsable del tratamiento de los datos recolectados a través del sitio web y la plataforma web **Finance Nexus** (`https://finance-nexus.web.app/`) es **Finance Nexus SpA — RUT pendiente de confirmación**, sociedad domiciliada en Santiago de Chile.

## 2. Marco Legal Aplicable
Esta política se rige en su fase preliminar por la **Ley N° 21.719** de Protección de Datos Personales de la República de Chile, la **Ley N° 19.496** sobre Protección de los Derechos de los Consumidores y los estándares de seguridad en la nube de Google Cloud Platform.

## 3. Datos Personales Recolectados
Finance Nexus recolecta únicamente la información técnica y financiera indispensable para la provisión del servicio:
1. **Datos de Identificación y Autenticación:** Nombre completo, correo electrónico, identificador de usuario (`uid`) y foto de perfil provistos mediante Google Sign-In (OAuth 2.0).
2. **Datos Financieros y Transaccionales:** Montos de ingresos, gastos, compromisos de deuda, nombres de entidades bancarias, metas de ahorro y presupuestos ingresados directamente por el Usuario.
3. **Datos Técnicos Mínimos de Sesión:** Detección local del tipo de sistema operativo y navegador mediante `navigator.userAgent` para control de sesiones activas. *No se recopila dirección IP pública ni geolocalización.*

## 4. Finalidades del Tratamiento
Los datos del Usuario son tratados con las siguientes finalidades legítimas:
- Prestar, mantener y optimizar los servicios de software ERP financiero personal y para PYMEs.
- Generar métricas consolidadas de salud financiera (Score Financiero y proyecciones de flujo).
- Procesar consultas financieras mediante modelos de Inteligencia Artificial (Google Gemini), transmitiendo únicamente contextos parametrizados y anonimizados.
- Garantizar la seguridad, integridad y trazabilidad de las sesiones mediante Firestore Security Rules.

## 5. Almacenamiento, Aislamiento y Seguridad
- **Aislamiento por Usuario:** Las bases de datos de Cloud Firestore implementan reglas estrictas de seguridad (`firestore.rules`) donde cada registro está asociado al identificador único (`userId`) del Usuario. Ningún tercero o usuario de otra organización puede leer ni modificar información ajena.
- **Cifrado:** Las comunicaciones se transmiten mediante canales cifrados TLS/HTTPS (cifrado en tránsito) y se almacenan en infraestructura segura de Google Cloud Platform (cifrado en reposo).

## 6. Política de Cookies y Almacenamiento Local
Finance Nexus utiliza tecnologías de almacenamiento local (`localStorage`) y cookies técnicas:
- **Cookies Esenciales:** Necesarias para mantener la sesión de autenticación activa con Firebase y prevenir ataques CSRF.
- **Preferencias:** Almacenamiento de tema (claro/oscuro), período financiero seleccionado y estado de consentimiento de cookies (`fn_cookie_consent`).
- **Analíticas:** Métricas agregadas de rendimiento del aplicativo. El Usuario puede aceptar o rechazar las cookies no esenciales mediante el banner de consentimiento.

## 7. Derechos del Titular (Derechos ARCO)
Conforme a la Ley N° 21.719, el Usuario puede ejercer en cualquier momento los derechos de:
- **Acceso:** Conocer qué datos personales mantiene Finance Nexus SpA.
- **Rectificación:** Corregir información inexacta o incompleta.
- **Cancelación / Supresión:** Solicitar la eliminación total de sus datos y de su cuenta.
- **Oposición:** Oponerse al tratamiento de sus datos para fines no esenciales.

Para ejercer estos derechos, el Usuario puede contactar directamente a: `nexuslabsai.hq@gmail.com`.
