# 📊 PROPUESTA TÉCNICA COMPARATIVA DE MITIGACIÓN: DEPENDENCIA SHEETJS (`xlsx@0.18.5`)
## FINANCE NEXUS — ANÁLISIS DE IMPACTO, ALTERNATIVAS Y PLAN DE TRANSICIÓN

---

**Documento:** `docs/02-technical/PROPUESTA_MITIGACION_SHEETJS.md`  
**ESTADO:** 🟡 **PROPUESTA TÉCNICA — PENDIENTE DE APROBACIÓN POR GERENCIA (NO IMPLEMENTADO)**  
**Versión:** 1.0  
**Fecha:** 14 de Septiembre de 2026  
**Auditor Técnico:** Antigravity Senior Software Engineer Agent  
**Aprobado por:** En evaluación por Isaac Patricio Pasten Díaz (Fundador & CEO)  

---

## 1. DESCRIPCIÓN DEL PROBLEMA Y VULNERABILIDADES IDENTIFICADAS

La librería `xlsx@0.18.5` (SheetJS) instalada actualmente en `package.json` presenta dos vulnerabilidades de severidad alta reportadas por GitHub Advisory Database:

1. **GHSA-4r6h-8v6p-xvw6 (Prototype Pollution):** Ocurre durante la deserialización y parseo de archivos binarios Excel (.xls / .xlsx) maliciosamente diseñados con propiedades especiales (`__proto__`), lo que permite sobreescribir prototipos globales de JavaScript en el motor del navegador.
2. **GHSA-5pgg-2g8v-p4x9 (ReDoS - Regular Expression Denial of Service):** Expresiones regulares catastróficas durante el análisis de celdas que pueden bloquear el hilo principal de ejecución del cliente.

> [!NOTE]
> **Evaluación del Riesgo Operacional Real en Finance Nexus:**
> - El 80% del uso de `xlsx` en Finance Nexus es para **EXPORTACIÓN** de datos a `.csv` o `.xlsx`. Generar archivos no detona estas vulnerabilidades.
> - El riesgo existe **ÚNICAMENTE** en el módulo de IA (`src/pages/IA.jsx`), donde el usuario sube un archivo Excel externo para análisis y la app ejecuta `XLSX.read(data, { type: 'array' })`.

---

## 2. INVENTARIO EXACTO DE ARCHIVOS AFECTADOS

| N° | Archivo | Operación Ejecutada | Código Específico |
|---|---|---|---|
| **01** | `src/pages/Transferencias.jsx` | Exportación CSV | `XLSX.utils.json_to_sheet` $\rightarrow$ `XLSX.writeFile(wb, "Transferencias.csv", { bookType: 'csv' })` |
| **02** | `src/pages/FlujoCaja.jsx` | Exportación CSV | `XLSX.utils.json_to_sheet` $\rightarrow$ `XLSX.writeFile(wb, "Flujo_Caja_${period}.csv")` |
| **03** | `src/pages/Ingresos.jsx` | Exportación CSV | `XLSX.utils.json_to_sheet` $\rightarrow$ `XLSX.writeFile(wb, "Ingresos.csv", { bookType: 'csv' })` |
| **04** | `src/pages/Gastos.jsx` | Exportación CSV | `XLSX.utils.json_to_sheet` $\rightarrow$ `XLSX.writeFile(wb, "Gastos.csv", { bookType: 'csv' })` |
| **05** | `src/pages/Informes.jsx` | Exportación XLSX | `XLSX.utils.json_to_sheet` $\rightarrow$ `XLSX.writeFile(wb, "Informe_Resumen_Mensual.xlsx")` |
| **06** | `src/pages/IA.jsx` | **Lectura e Importación (Riesgo)** | `XLSX.read(data, { type: 'array' })` $\rightarrow$ `XLSX.utils.sheet_to_csv(worksheet)` |

---

## 3. MATRIZ COMPARATIVA DE ALTERNATIVAS

| Criterio | Opción A: Función Nativa CSV (Recomendada) | Opción B: `exceljs` | Opción C: Actualizar CDN SheetJS |
|---|---|---|---|
| **Enfoque** | Reemplazar exportación por módulo nativo en JS (`Blob` y `URL.createObjectURL`); restringir carga en IA a `.csv` y `.pdf`. | Instalar paquete moderno `exceljs` (soporta lectura y escritura nativa de `.xlsx`). | Migrar a la versión oficial de SheetJS alojada en su CDN corporativo (`https://cdn.sheetjs.com/`). |
| **Resolución de Vulnerabilidad** | ✅ **100% resuelta** (Cero dependencias externas para CSV). | ✅ **100% resuelta** (Librería activa y auditada). | 🟡 **Parcial** (Requiere CDN externo y configuración CSP). |
| **Impacto en el Bundle** | 🟢 **Ahorro de ~800 kB** en el bundle final de la app. | 🔴 Añade ~450 kB al bundle. | 🟡 Mantiene ~800 kB cargados desde CDN. |
| **Compatibilidad con Exportaciones** | 🟢 100% compatible para los CSV de Gastos, Ingresos, Transferencias y Flujo. | 🟢 100% compatible con `.xlsx` y `.csv`. | 🟢 100% compatible. |
| **Esfuerzo de Implementación** | 🟢 **Bajo (1 a 2 horas)**. | 🟡 Medio (3 a 4 horas). | 🟡 Medio (2 a 3 horas). |
| **Riesgo de Regresión** | 🟢 Mínimo (Código puro sin dependencias). | 🟡 Medio (Diferencias de API). | 🟡 Medio (Dependencia de disponibilidad CDN). |

---

## 4. PROPUESTA DETALLADA (OPCIÓN A — RECOMENDADA)

### 4.1 Módulo Utilitario Nativo Propuesto: `src/utils/exportCsv.js`
```javascript
export function exportToCsv(filename, rows) {
  if (!rows || !rows.length) return;
  const separator = ',';
  const keys = Object.keys(rows[0]);
  
  const csvContent = [
    keys.join(separator),
    ...rows.map(row => 
      keys.map(k => {
        let cell = row[k] === null || row[k] === undefined ? '' : String(row[k]);
        cell = cell.replace(/"/g, '""');
        if (cell.search(/("|,|\n)/g) >= 0) cell = `"${cell}"`;
        return cell;
      }).join(separator)
    )
  ].join('\n');

  const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
```

### 4.2 Tratamiento del Módulo de IA (`src/pages/IA.jsx`)
- Modificar el selector de archivos para aceptar exclusivamente: `.csv`, `.pdf` e imágenes:
  ```html
  <input type="file" accept="image/*,application/pdf,.csv" />
  ```
- Para archivos `.csv`, leerlos directamente mediante la API estándar del navegador `FileReader.readAsText()`, procesándolos en texto plano para el prompt de Gemini sin deserialización binaria.

---

## 5. PLAN DE REVERSIÓN (ROLLBACK PLAN)

Si la opción elegida provocara algún conflicto no previsto:
1. Las firmas de llamada (`exportCSV()`) en las páginas mantendrán los mismos parámetros.
2. La dependencia `xlsx` permanecerá en `package-lock.json` respaldada en git antes de ejecutar cualquier desinstalación.
3. El tiempo de reversión se estima en menos de **10 minutos** ejecutando `git checkout -- src/pages/`.
