# 01 — Planilla Modelo: Datos y Reglas de Negocio de Finance Nexus

> **Estado:** v1.0 · **Fuente de verdad:** código actual del repo (`AppDataContext.jsx` + páginas) + planilla de inspiración `Finanzas Personales Pro (Moneasy.co)`.
> **Propósito:** que cualquier IA (Claude, Copilot, Antigravity) o desarrollador entienda el modelo financiero de Finance Nexus sin tener que re-inferirlo del código, y sin volver a pedir "la planilla".

---

## 0. Origen y alcance

Finance Nexus **no nació de una única planilla propia**: se inspiró en la plantilla de Google Sheets/Excel **"Finanzas Personales Pro" de Moneasy.co** (uso personal, un solo usuario, 12 pestañas mensuales fijas Ene–Dic) y la convirtió en un **ERP web multiusuario en tiempo real** (React + Firebase), agregando módulos que la planilla no tiene (IA financiera, colaboradores, seguridad, multi-sesión, PYME).

Este documento:
1. Documenta el **modelo real ya implementado** en el código (fuente de verdad).
2. Traduce a nombres de campo del ERP los **conceptos y fórmulas de la planilla Moneasy** que sí aplican.
3. Señala **brechas y errores concretos** encontrados al cruzar ambos (sección 6).

No reemplaza `PROMPT_Y_ESTADO_PROYECTO_CLAUDE.md` (arquitectura técnica) ni `INFORME_EJECUTIVO_FINANCE_NEXUS.md` (bitácora); es el **complemento de modelo de datos** que a ambos les faltaba, y es lo que Copilot/Antigravity necesitan como contexto antes de tocar cálculos.

---

## 1. Mapa de equivalencia: Planilla Moneasy → Módulo Finance Nexus

| Pestaña / sección Moneasy | Módulo Finance Nexus | Estado |
|---|---|---|
| `Ene`…`Dic` (registro mensual: ingresos, gastos fijos/variables, ahorros, deudas, inversiones) | `Ingresos.jsx`, `Gastos.jsx` (colecciones `fn_ingresos`, `fn_gastos`) | ✅ Implementado (registro continuo, no por pestaña fija) |
| Presupuesto Mensual + regla `50/30/20` | `Gastos.jsx` (desglose por categoría) + `fn_presupuestos` | 🟡 Parcial — falta la etiqueta de grupo 50/30/20 |
| `CUENTAS AHORROS` (saldo inicial vs saldo actual) | `Bancos.jsx` (`fn_bancos`) | 🟡 Parcial — sin saldo inicial separado |
| `Ahorros Pro` (metas, aporte mensual, día objetivo) | `Ahorros.jsx` (`fn_ahorros`) | ✅ Implementado |
| `INVERSIONES` (presupuestado / invertido) | `Inversiones.jsx` (`fn_inversiones`) | ✅ Implementado (con bug de lectura en Dashboard, ver §6) |
| `DEUDAS` + `Registro De Deudas` + `Deudas Pro (Bola de Nieve)` | `Deudas.jsx` + `Estrategia.jsx` (`fn_deudas`) | ✅ Implementado |
| `Fechas De Pago Pro` (vencido / pendiente / completado) | `Fechas.jsx` | 🔴 Pendiente — hoy con datos hardcodeados (Roadmap paso 4) |
| `TRANSFERENCIAS` (origen → destino → monto) | `Transferencias.jsx` (`fn_transferencias`) | 🔴 Pendiente — módulo vacío (Roadmap paso 7) |
| `Vista Anual Pro` (12 meses consolidados) | `Informes.jsx` | ✅ Implementado |
| `CATEGORIAS` + `% Gastado` | `Configuracion.jsx` (`categorias`) + `Gastos.jsx` | ✅ Implementado |
| Multi-moneda / TRM | `configuracion.moneda` | 🟡 Parcial — un solo campo, sin tipo de cambio ni moneda secundaria |

---

## 2. Modelo de datos canónico

Cada colección vive en Firestore bajo `users/{activeUid}/appData/{clave}` (ver `useFirestoreState` en `AppDataContext.jsx`). Tipos y ejemplos tomados directamente del código de las páginas.

### 2.1 `fn_ingresos` (array)
| Campo | Tipo | Origen / equivalencia planilla | Notas |
|---|---|---|---|
| `id` | number (timestamp) | — | |
| `desc` | string | "Concepto" | |
| `cat` | string | "Categoría" (Salario, Freelance, Inversiones, Arriendo, Otros) | debe existir en `configuracion.categorias` con tag `Ingreso` |
| `monto` | number | "Monto" | CLP sin decimales |
| `fecha` | string `YYYY-MM-DD` | "Fecha" | |
| `fuente` | string | "A qué cuenta" | debería referenciar `fn_bancos[].nombre` |
| `notas` | string | — | |

### 2.2 `fn_gastos` (array)
| Campo | Tipo | Origen / equivalencia | Notas |
|---|---|---|---|
| `id`, `desc`, `cat`, `monto`, `fecha`, `notas` | — | igual a ingresos | `cat` debe tener tag `Gasto` |
| `metodo` | string | "Método de pago" (Tarjeta Débito/Crédito, Efectivo, Transferencia) | |
| `recurrente` | string | Gastos Fijos vs Variables de la planilla | `'No' \| 'Sí, mensual' \| 'Sí, anual'` |
| `cuenta` | string *(legado)* | "Cuenta" | ⚠️ Ver hallazgo H-4 (§6): el formulario actual ya no lo captura pero `FlujoCaja.jsx` todavía lo lee. |

### 2.3 `fn_bancos` (array) — "CUENTAS AHORROS" de la planilla
| Campo | Tipo | Notas |
|---|---|---|
| `id`, `nombre`, `tipo` (`Cuenta Corriente\|Ahorros\|Vista\|Tarjeta Crédito\|Efectivo`), `numero`, `saldo`, `moneda`, `titular` | — | La planilla separa **Saldo Inicial** y **Saldo Actual** por cuenta; el ERP solo guarda `saldo` (=actual). Ver extensión propuesta E-1. |

### 2.4 `fn_ahorros` (array) — "Ahorros Pro"
| Campo | Tipo | Notas |
|---|---|---|
| `id`, `nombre`, `emoji`, `objetivo`, `aporte`, `actual`, `fecha` (fecha objetivo), `desc` | — | `actual` es el acumulado; el "Contribuir" en `Ahorros.jsx` suma `aporte` a `actual` (equivalente a "Añadir en Ahorros" de la planilla). |

### 2.5 `fn_inversiones` (array)
| Campo | Tipo | Notas |
|---|---|---|
| `id`, `nombre`, `institucion`, `invertido`, `actual`, `aporte`, `rendimiento` (string `"+X.X%"`, calculado) | — | **No existe campo `monto`.** Ver hallazgo H-1. |

### 2.6 `fn_deudas` (array) — "DEUDAS" + "Bola de Nieve"
| Campo | Tipo | Notas |
|---|---|---|
| `id`, `nombre`, `institucion`, `balance`, `pagoMensual`, `tasa` (% anual), `vencimiento`, `progreso` (% pagado) | — | **No existe campo `monto`.** Ver hallazgo H-2. `Estrategia.jsx` ordena por `balance` asc (Bola de Nieve) o `tasa` desc (Avalancha) — coincide exactamente con la lógica de la pestaña `Deudas Pro (Bola De Nieve)` de la planilla. |

### 2.7 `fn_presupuestos` (array)
| Campo | Tipo | Notas |
|---|---|---|
| `cat`, `monto` | — | Usado por `Gastos.jsx` para el desglose por categoría. **No tiene página de gestión propia visible en el repo actual** — candidato a UI dedicada (extensión E-4). |

### 2.8 `fn_config` (objeto)
| Campo | Tipo | Notas |
|---|---|---|
| `tema` (`dark\|light`), `moneda` (`CLP\|USD\|EUR`), `notifEmail`, `notifPush` | — | |
| `categorias` | array de strings `"Nombre \| Tipo"` | `Tipo ∈ {Ingreso, Gasto}`. La planilla usa un tercer eje (grupo `Necesidades\|Deseos\|Ahorros`) que hoy **no existe** en el ERP. Ver extensión E-2. |

### 2.9 `fn_transferencias` (array) — sin schema aún
Propuesta mínima viable (inspirada en la sección `TRANSFERENCIAS` de la planilla, hoy vacía en `Transferencias.jsx`):
```js
{
  id: Date.now(),
  origen: 'Bancolombia',      // fn_bancos[].nombre
  destino: 'Cuenta Nequi',    // fn_bancos[].nombre
  monto: 300000,
  fecha: '2025-03-15',
  notas: ''
}
```
Efecto esperado al confirmar: restar `monto` del saldo del banco `origen` y sumarlo al banco `destino` (no debe crear ni un ingreso ni un gasto).

### 2.10 Otras colecciones existentes
`fn_usuario`, `fn_chatsIA`, `fn_notifs`, `fn_sesiones` — sin equivalente en la planilla (funcionalidad exclusiva del ERP: IA, notificaciones, sesiones de seguridad).

---

## 3. Fórmulas del modelo (verificadas contra la planilla real y traducidas a campos del ERP)

```
Flujo Neto (periodo)      = Σ ingresos.monto (periodo) − Σ gastos.monto (periodo)

Tasa de Ahorro (periodo)  = ( Flujo Neto (periodo) / Σ ingresos.monto (periodo) ) × 100

Patrimonio Neto           = Σ bancos.saldo + Σ ahorros.actual + Σ inversiones.actual
                             − Σ deudas.balance

% Gastado por categoría   = Σ gastos.monto (cat) / presupuestos.monto (cat)

Interés anual aprox. deuda = deuda.balance × deuda.tasa / 100      (ya en Deudas.jsx)

Orden "Bola de Nieve"     = deudas ordenadas ASC por balance
Orden "Avalancha"         = deudas ordenadas DESC por tasa
                             (ya en Estrategia.jsx — coincide con la planilla)

Regla 50/30/20 (objetivo) = Necesidades ≤ 50% ingresos
                             Deseos      ≤ 30% ingresos
                             Ahorro      ≥ 20% ingresos
                             (existe en la planilla; no implementada en el ERP — extensión E-2)
```

La **Fecha estimada libre de deudas** (celda `LIBRE DE DEUDAS` de la pestaña Bola de Nieve) se calcula en la planilla proyectando mes a mes el pago mínimo + excedente hasta saldar todo. No existe todavía en Finance Nexus — candidata a Cloud Function (ver extensión E-5).

---

## 4. Hallazgos verificados en el código actual (bugs a corregir)

> Confirmados leyendo `Dashboard.jsx` contra el modelo real de `Inversiones.jsx` y `Deudas.jsx`.

| ID | Archivo | Problema | Evidencia | Impacto | Fix propuesto |
|---|---|---|---|---|---|
| **H-1** | `src/pages/Dashboard.jsx` | `totalInv` lee `i.monto`, campo inexistente en `fn_inversiones` (el campo real es `actual`) | `const totalInv = inversiones.reduce((sum, i) => sum + Number(i.monto), 0);` | `Number(undefined)` → `NaN`, contamina `patrimonio` y el KPI "Total Inversiones" | Cambiar a `Number(i.actual)` |
| **H-2** | `src/pages/Dashboard.jsx` | `totalDeuda` lee `d.monto`, campo inexistente en `fn_deudas` (el campo real es `balance`) | `const totalDeuda = deudas.reduce((sum, d) => sum + Number(d.monto), 0);` | KPI "Deuda Total" siempre `NaN`/incorrecto | Cambiar a `Number(d.balance)` |
| **H-3** | `src/pages/Dashboard.jsx` | `patrimonio` no resta deudas ni suma ahorros, contradiciendo la fórmula estándar (y la de la planilla) | `const patrimonio = totalBancos + totalInv; // simplificado` | El "Patrimonio Neto" mostrado no es patrimonio neto real | Cambiar a `totalBancos + totalAhorros + totalInv - totalDeuda` |
| **H-4** | `src/pages/FlujoCaja.jsx` | Lee `t.fuente \|\| t.cuenta` para gastos, pero `Gastos.jsx` ya no captura `cuenta` en el formulario (solo `metodo`) | comparar formulario de `Gastos.jsx` vs columna "Cuenta de Origen/Destino" en `FlujoCaja.jsx` | Columna queda vacía para gastos nuevos | Unificar: usar `metodo` en `Gastos.jsx` o agregar `cuenta` real al formulario |
| **H-5** | `src/pages/Header.jsx` + `FlujoCaja.jsx` | Selector de periodo limitado a `['Enero','Febrero','Marzo']`, mientras la planilla y `Informes.jsx`/roadmap prometen vista anual completa | `const periods = ['Enero','Febrero','Marzo']` | Filtrado de Dashboard/FlujoCaja no cubre Abr–Dic | Extender a los 12 meses o a rango dinámico por año |

---

## 5. Extensiones propuestas (fuera de MVP, backlog v2 — no bloquean el roadmap de 8 pasos)

| ID | Extensión | Beneficio |
|---|---|---|
| **E-1** | Agregar `saldoInicial` a `fn_bancos` | Permite flujo de caja real por cuenta y por mes, como la planilla |
| **E-2** | Agregar `grupo: 'Necesidad'\|'Deseo'\|'Ahorro'` a cada categoría de `fn_config.categorias` | Habilita el semáforo 50/30/20 en Dashboard/Configuración |
| **E-3** | Implementar `fn_transferencias` con el schema de §2.9 | Cierra el módulo `Transferencias.jsx` (Roadmap paso 7) |
| **E-4** | Página dedicada de gestión de `fn_presupuestos` | Hoy se leen pero no hay UI clara para crearlos/editarlos |
| **E-5** | Cloud Function `calcularLibreDeDeudas(uid)` | Replica la proyección "LIBRE DE DEUDAS" de la planilla, en el free tier vía Functions programadas |
| **E-6** | Score financiero (0–1000) con fórmula ponderada real | Hoy es un valor visual fijo en `Dashboard.jsx`/`Perfil.jsx` (Roadmap paso 3) |

---

## 6. Reglas de negocio transversales

1. Todo `monto` se guarda como número entero en la moneda de `fn_config.moneda` (por defecto CLP, sin decimales).
2. Toda categoría usada en `ingresos.cat` / `gastos.cat` debe existir en `fn_config.categorias` con el tag de tipo correcto (`Ingreso`/`Gasto`); si no existe, se trata como "Otros".
3. Semáforo de presupuesto por categoría: `< 70%` gastado = verde, `70–100%` = amarillo, `> 100%` = rojo (mismo criterio visual ya usado en los `ring gauges` de `Dashboard.jsx`).
4. Una deuda con `tasa > 15%` anual dispara la alerta "alto interés" (`Deudas.jsx`, ya implementado — no tocar).
5. Ningún cálculo debe leer un campo que no esté documentado en la tabla de la colección correspondiente (§2). Antes de agregar un KPI nuevo, verificar contra este documento.

---

## 7. Cómo usar este documento en una sesión de IA

Al iniciar sesión con Copilot, Antigravity o Claude, referenciar:

> "Lee `/docs/finance-nexus/01_PLANILLA_MODELO.md` antes de tocar cualquier cálculo financiero o campo de Firestore. Es la fuente de verdad del modelo de datos y las fórmulas de Finance Nexus."

Esto evita que cada sesión vuelva a inferir el modelo desde cero o pida "la planilla" que no existe como archivo — ahora existe como documento versionado en el repo.

---

*Generado a partir de: (1) código fuente actual de `finance-nexus` (rama `main`), (2) planilla `Finanzas Personales Pro x Moneasy.co` (Google Sheets, uso personal) como referencia de inspiración original. Documento vivo: actualizar cada vez que cambie un nombre de campo o se implemente una extensión de la sección 5.*
