# 🧪 PLAN DE PRUEBAS DE SEGURIDAD PARA FIREBASE FIRESTORE Y STORAGE
## FINANCE NEXUS — BANCO DE PRUEBAS DE CONTROL DE ACCESOS Y ZERO-TRUST

---

**Documento:** `docs/02-technical/PLAN_PRUEBAS_FIREBASE_SECURITY.md`  
**Versión:** 1.0 (Auditoría Fase 5A)  
**Fecha:** 14 de Septiembre de 2026  
**Auditor:** Antigravity Senior Software Engineer Agent  
**Aprobado por:** Isaac Patricio Pasten Díaz (Fundador & CEO)  
**Alcance:** Validación estática de reglas locales vs. plan de ejecución en Firebase Emulator Suite y ambiente de pruebas.  

---

## 1. ESTADO ACTUAL DE CERTIFICACIÓN Y DESLINDE DE DESPLIEGUE

> [!WARNING]
> **DECLARACIÓN DE ESTADO REAL DE LAS REGLAS DE SEGURIDAD:**  
> - 🟢 **Reglas en Repositorio (`firestore.rules`):** Auditadas estáticamente al 100%. Contienen las directivas *Deny by Default*, aislamiento estricto por `userId`, validación de estructura `keys().hasOnly(['data'])` y control de roles colaborativos.  
> - 🟡 **Despliegue en Servidores de Firebase Producción:** **PENDIENTE DE CONFIRMACIÓN MEDIANTE FIREBASE CLI O CONSOLA GCP.** No se declara como "producción validada" hasta no ejecutar `firebase deploy --only firestore:rules` con credenciales activas del proyecto.  
> - 🟡 **Pruebas de Penetración y Emulador:** Casos de prueba diseñados a continuación, **pendientes de ejecución automatizada en suite CI/CD local con Firebase Emulator Suite**.

---

## 2. MATRIZ DE CASOS DE PRUEBA DE SEGURIDAD (TEST MATRIX)

| ID Caso | Escenario Evaluado | Actor / Autenticación | Acción Ejecutada | Resultado Esperado | Estado de Verificación |
|---|---|---|---|---|---|
| **SEC-01** | Acceso anónimo no autenticado | Usuario anónimo (`request.auth == null`) | `getDoc(/users/user_123/appData/fn_ingresos)` | ❌ `PERMISSION_DENIED` | 🟢 Auditado en código |
| **SEC-02** | Acceso anónimo a documento inexistente | Usuario anónimo | `setDoc(/cualquier_ruta, { malicioso: true })` | ❌ `PERMISSION_DENIED` (Deny all) | 🟢 Auditado en código |
| **SEC-03** | Aislamiento cruzado entre usuarios (Cross-Tenant) | Usuario A (`uid: "alice_123"`) | `getDoc(/users/bob_456/appData/fn_gastos)` | ❌ `PERMISSION_DENIED` | 🟢 Auditado en código |
| **SEC-04** | Intento de suplantación de escritura cruzada | Usuario A (`uid: "alice_123"`) | `setDoc(/users/bob_456/appData/fn_deudas, { data: [] })` | ❌ `PERMISSION_DENIED` | 🟢 Auditado en código |
| **SEC-05** | Lectura autorizada del propietario | Usuario A (`uid: "alice_123"`) | `getDoc(/users/alice_123/appData/fn_presupuestos)` | ✅ `PERMITIDO` | 🟢 Auditado en código |
| **SEC-06** | Escritura autorizada del propietario con esquema válido | Usuario A (`uid: "alice_123"`) | `setDoc(/users/alice_123/appData/fn_presupuestos, { data: [item] })` | ✅ `PERMITIDO` (`data is list`) | 🟢 Auditado en código |
| **SEC-07** | Intento de inyección de esquema malicioso | Usuario A (`uid: "alice_123"`) | `setDoc(/users/alice_123/appData/fn_presupuestos, { data: [], inyeccion: "hacked" })` | ❌ `PERMISSION_DENIED` (`keys().hasOnly(['data'])` falla) | 🟢 Auditado en código |
| **SEC-08** | Intento de corrupción de tipo de datos | Usuario A (`uid: "alice_123"`) | `setDoc(/users/alice_123/appData/fn_presupuestos, { data: "string_corrupto" })` | ❌ `PERMISSION_DENIED` (`data is list` falla) | 🟢 Auditado en código |
| **SEC-09** | Colaborador con rol `viewer` intentando escribir | Usuario B (`status: "active"`, `role: "viewer"`) | `setDoc(/users/alice_123/appData/fn_gastos, { data: [] })` | ❌ `PERMISSION_DENIED` (`isActiveEditor` es falso) | 🟢 Auditado en código |
| **SEC-10** | Colaborador con rol `viewer` leyendo datos | Usuario B (`status: "active"`, `role: "viewer"`) | `getDoc(/users/alice_123/appData/fn_gastos)` | ✅ `PERMITIDO` (`isActiveCollaborator` es verdadero) | 🟢 Auditado en código |
| **SEC-11** | Colaborador con rol `editor` escribiendo datos válidos | Usuario C (`status: "active"`, `role: "editor"`) | `setDoc(/users/alice_123/appData/fn_gastos, { data: [] })` | ✅ `PERMITIDO` (`isActiveEditor` es verdadero) | 🟢 Auditado en código |
| **SEC-12** | Invitación pendiente intentando acceder antes de aceptar | Usuario D (`status: "pending"`) | `getDoc(/users/alice_123/appData/fn_gastos)` | ❌ `PERMISSION_DENIED` (`status != 'active'`) | 🟢 Auditado en código |
| **SEC-13** | Carga de archivo mayor a 10 MB en Storage | Usuario autenticado | `uploadBytes(comprobantes/file_15MB.pdf)` | ❌ `STORAGE_ERROR / RECHAZADO` | 🟡 Pendiente test Storage rules |
| **SEC-14** | Carga de ejecutable o script malicioso (`.exe`, `.sh`) | Usuario autenticado | `uploadBytes(comprobantes/virus.exe)` | ❌ `STORAGE_ERROR / RECHAZADO` | 🟡 Pendiente test Storage rules |

---

## 3. GUÍA DE EJECUCIÓN REPRODUCIBLE CON FIREBASE EMULATOR SUITE

Para validar de forma automatizada estos 14 casos en un entorno 100% aislado (sin tocar producción):

### 3.1 Instalación de Emuladores
```bash
firebase setup:emulators:firestore
firebase setup:emulators:storage
```

### 3.2 Script de Pruebas Automatizadas en Jest / Vitest
Crear `test/firestore-rules.test.js`:
```javascript
import { initializeTestEnvironment, assertFails, assertSucceeds } from "@firebase/rules-unit-testing";
import fs from "fs";

describe("Auditoría de Reglas Firestore - Finance Nexus", () => {
  let testEnv;

  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: "demo-finance-nexus",
      firestore: {
        rules: fs.readFileSync("firestore.rules", "utf8"),
      },
    });
  });

  afterAll(async () => {
    await testEnv.cleanup();
  });

  test("SEC-01: Usuario anónimo no debe poder leer datos", async () => {
    const unauthedDb = testEnv.unauthenticatedContext().firestore();
    await assertFails(unauthedDb.doc("users/alice/appData/fn_ingresos").get());
  });

  test("SEC-03: Usuario Alice no debe leer datos de Bob", async () => {
    const aliceDb = testEnv.authenticatedContext("alice").firestore();
    await assertFails(aliceDb.doc("users/bob/appData/fn_gastos").get());
  });

  test("SEC-07: Inyección de propiedades extras debe ser rechazada", async () => {
    const aliceDb = testEnv.authenticatedContext("alice").firestore();
    await assertFails(aliceDb.doc("users/alice/appData/fn_presupuestos").set({
      data: [],
      hacked: true
    }));
  });
});
```

### 3.3 Comando de Ejecución Local:
```bash
firebase emulators:exec --only firestore "npm run test:rules"
```
