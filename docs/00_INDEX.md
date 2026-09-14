# 📚 ÍNDICE GENERAL DE DOCUMENTACIÓN Y ARQUITECTURA
## FINANCE NEXUS SpA — BIBLIOTECA MAESTRA DEL SISTEMA OPERATIVO FINANCIERO

---

**Empresa:** Finance Nexus SpA — RUT pendiente de confirmación  
**Fundador & CEO:** Isaac Patricio Pasten Díaz  
**Canal Oficial de Soporte y Privacidad:** nexuslabsai.hq@gmail.com  
**Versión del Sistema:** 2.4.0 (Production-Ready)  
**Fecha:** 14 de Septiembre de 2026  

---

## 🗺️ MAPA DE NAVEGACIÓN DOCUMENTAL

Toda la documentación técnica, arquitectónica, operativa, jurídica y de auditoría se encuentra estructurada en las siguientes áreas temáticas:

```
docs/
 ├── 00_INDEX.md                                   <-- Este índice general
 ├── MASTER_AUDIT_AND_BACKLOG.md                   <-- Auditoría maestra por áreas y evidencias
 ├── LEGAL_STATUS_AND_GAPS.md                      <-- Diagnóstico legal y análisis de brechas
 ├── TECHNICAL_RISK_REGISTER.md                    <-- Matriz de riesgos técnicos
 ├── RELEASE_READINESS_CHECKLIST.md                <-- Criterios de autorización de salida a mercado
 │
 ├── 01-legal/                                     <-- MARCO JURÍDICO Y CONTRACTUAL EN CHILE
 │    ├── TERMINOS_Y_CONDICIONES.md                (Borrador operativo v1.0)
 │    ├── POLITICA_PRIVACIDAD.md                   (Borrador operativo Ley 21.719)
 │    ├── POLITICA_DE_COOKIES_BORRADOR.md          (Borrador operativo de cookies y storage)
 │    ├── MATRIZ_DOCUMENTAL_LEGAL.md               (Inventario de 21 instrumentos corporativos)
 │    └── PENDIENTES_LEGALES_Y_VALIDACIONES.md     (Registro de trámites societarios y tributarios)
 │
 ├── 02-technical/                                 <-- ARQUITECTURA TÉCNICA Y SEGURIDAD
 │    ├── FIRESTORE_RULES_SECURITY.md              (Auditoría y validación Zero-Trust de Firestore)
 │    ├── INVENTARIO_TECNOLOGIAS_Y_COOKIES.md      (Auditoría forense de almacenamiento y SDKs)
 │    ├── PLAN_PRUEBAS_FIREBASE_SECURITY.md        (Banco de 14 pruebas para Firebase Emulator)
 │    └── PROPUESTA_MITIGACION_SHEETJS.md          (Análisis comparativo de mitigación para xlsx)
 │
 ├── 03-reports/                                   <-- SUITE DE INFORMES EJECUTIVOS Y TÉCNICOS
 │    ├── README.md                                (Índice de la biblioteca de reportes)
 │    ├── 01_INFORME_EJECUTIVO.md                  (Dirección General, ROI, KPIs y Roadmap)
 │    ├── 02_INFORME_TECNICO_ARQUITECTURA.md       (Arquitectura React 19, fórmulas y rendimiento)
 │    ├── 03_BITACORA_DETALLADA_CAMBIOS.md         (Trazabilidad de los 26 archivos intervenidos)
 │    ├── 04_MANUAL_OPERACIONES_Y_DESPLIEGUE.md    (Instalación, build, variables .env y hosting)
 │    └── 05_DOSSIER_LEGAL_Y_COMPLIANCE_CHILE.md   (Leyes 21.719, 19.496, SERNAC y cookies)
 │
 ├── 04-operational/                               <-- OPERACIONES Y ATENCIÓN A USUARIOS
 │    ├── PROCEDIMIENTO_SOPORTE_Y_RECLAMOS.md      (Protocolo formal de gestión de incidentes)
 │    └── MATRIZ_SLA_SOPORTE.md                    (Tiempos de respuesta objetivos por severidad)
 │
 └── finance-nexus/                                <-- CONTEXTO HISTÓRICO Y MODELOS
      ├── 00_INDEX.md                              (Índice histórico de especificaciones)
      └── 01_PLANILLA_MODELO.md                    (Fórmulas matemáticas y equivalencias de planilla)
```

---

## 🏛️ RECURSOS PÚBLICOS WEB EN EL REPOSITORIO

- `public/legal/terminos-y-condiciones.html`: Versión web autónoma de Términos (Borrador Operativo).
- `public/legal/politica-privacidad.html`: Versión web autónoma de Privacidad (Borrador Operativo).
