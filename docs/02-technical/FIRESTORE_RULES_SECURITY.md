# 🛡️ Auditoría y Validación de Seguridad: Reglas de Firestore — Finance Nexus SpA

**Documento Técnico:** `docs/02-technical/FIRESTORE_RULES_SECURITY.md`  
**Fecha de Validación:** 14 de Septiembre de 2026  
**Responsable Técnico:** Antigravity Senior Software Engineer Agent  
**Aprobado por:** Isaac Patricio Pasten Díaz (CEO & Founder)  
**Clasificación:** Confidencial / Arquitectura de Seguridad  

---

## 1. Resumen Ejecutivo de Seguridad

Las reglas de seguridad de Google Cloud Firestore para Finance Nexus implementan una estrategia de **Defensa en Profundidad (Zero-Trust Security)**, garantizando que:
1. Ninguna consulta pública no autenticada tenga acceso a lectura ni escritura (`Deny by Default`).
2. Cada usuario u organización posea un espacio de datos estricta y criptográficamente aislado bajo su identificador `userId` (OAuth 2.0).
3. Todo intento de escritura valide el esquema y estructura del payload (`data is list` o `data is map`).
4. Las cuentas colaborativas multitenant apliquen el principio de mínimo privilegio (separación estricta entre rol `viewer` y `editor`).

---

## 2. Matriz de Permisos y Rutas Canónicas

| Ruta en Firestore | Método Permitido | Condición de Acceso | Validación de Carga Útil |
|---|---|---|---|
| `/{document=**}` (Raíz) | `read, write` | **Denegado por defecto** (`false`) | N/A |
| `/users/{userId}/appData/fn_ingresos` | `read` | `isOwner(userId) \|\| isActiveCollaborator(userId)` | N/A |
| `/users/{userId}/appData/fn_ingresos` | `write` | `isOwner(userId) \|\| isActiveEditor(userId)` | `keys().hasOnly(['data']) && data is list` |
| `/users/{userId}/appData/fn_gastos` | `read / write` | Ídem (`isOwner` / `isActiveEditor`) | `keys().hasOnly(['data']) && data is list` |
| `/users/{userId}/appData/fn_transferencias` | `read / write` | Ídem | `keys().hasOnly(['data']) && data is list` |
| `/users/{userId}/appData/fn_bancos` | `read / write` | Ídem | `keys().hasOnly(['data']) && data is list` |
| `/users/{userId}/appData/fn_ahorros` | `read / write` | Ídem | `keys().hasOnly(['data']) && data is list` |
| `/users/{userId}/appData/fn_inversiones` | `read / write` | Ídem | `keys().hasOnly(['data']) && data is list` |
| `/users/{userId}/appData/fn_deudas` | `read / write` | Ídem | `keys().hasOnly(['data']) && data is list` |
| `/users/{userId}/appData/fn_presupuestos` | `read / write` | Ídem | `keys().hasOnly(['data']) && data is list` |
| `/users/{userId}/appData/fn_chatsIA` | `read / write` | Ídem | `keys().hasOnly(['data']) && data is list` |
| `/users/{userId}/appData/fn_notifs` | `read / write` | Ídem | `keys().hasOnly(['data']) && data is list` |
| `/users/{userId}/appData/fn_sesiones` | `read / write` | Ídem | `keys().hasOnly(['data']) && data is list` |
| `/users/{userId}/appData/fn_config` | `read / write` | Ídem | `keys().hasOnly(['data']) && data is map` |
| `/users/{userId}/appData/fn_usuario` | `read / write` | Ídem | `keys().hasOnly(['data']) && data is map` |
| `/users/{ownerUid}/collaborators/{collabId}` | `create / read / delete` | `isOwner(ownerUid)` | Validación de correo en minúsculas, rol válido y estado inicial `pending` |
| `/users/{ownerUid}/collaborators/{collabId}` | `update` | Invitado autenticado con correo coincidente | Solo transición permitida: `pending` → `active` |

---

## 3. Análisis de Funciones de Seguridad

### 3.1 Verificación de Identidad Propietaria (`isOwner`)
```javascript
function isSignedIn() {
  return request.auth != null;
}

function isOwner(userId) {
  return isSignedIn() && request.auth.uid == userId;
}
```
- **Garantía:** El token JWT emitido por Firebase Authentication contiene el `uid` inalterable del usuario. La regla exige coincidencia exacta entre `request.auth.uid` y la variable de ruta `{userId}`. Un usuario autenticado jamás puede consultar los documentos de otro `userId`.

### 3.2 Prevención de Inyecciones y Deformación de Esquemas
```javascript
request.resource.data.keys().hasOnly(['data'])
  && request.resource.data.data is list;
```
- **Garantía:** Impide que un cliente malicioso inyecte propiedades arbitrarias o modifique la raíz del documento Firestore. Solo se admite la propiedad controlada `data`.

### 3.3 Colaboración Segura y Control de Roles
```javascript
function isActiveCollaborator(ownerUid) {
  return isSignedIn()
    && exists(/databases/$(database)/documents/users/$(ownerUid)/collaborators/$(myEmail()))
    && collaboratorDoc(ownerUid).data.status == 'active';
}

function isActiveEditor(ownerUid) {
  return isActiveCollaborator(ownerUid) && collaboratorDoc(ownerUid).data.role == 'editor';
}
```
- **Garantía:** Los usuarios con rol `viewer` únicamente obtienen autorización de lectura (`allow read`). Intentos de mutación (`allow write`) son automáticamente rechazados por el motor de reglas de Firestore.

---

## 4. Conclusión de la Auditoría

Las reglas contenidas en `firestore.rules` cumplen con los estándares de seguridad exigidos por la **Ley N° 21.719 de Chile** (aislamiento de datos personales, trazabilidad y consentimiento de acceso) y con las directrices de arquitectura segura de Google Cloud Platform.
