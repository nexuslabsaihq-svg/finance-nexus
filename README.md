# Finance Nexus

Aplicación React/Vite para registrar movimientos y consultar un resumen financiero personal.

## Desarrollo

```bash
npm install
npm run dev
```

Comandos disponibles:

- `npm run lint`
- `npm run build`

La aplicación requiere las variables `VITE_FIREBASE_*` descritas en `.env.example` para autenticación y persistencia. Las claves no se almacenan en el repositorio.

## Estado de Phase 0

- El dashboard calcula ingresos, gastos, flujo neto, tasa de ahorro, patrimonio neto, bancos, ahorros, inversiones y deudas desde el estado de la aplicación.
- El selector global filtra los doce meses de 2025 en Dashboard, Flujo de Caja y Fechas de Pago.
- Las inversiones usan `actual`/`invertido` y las deudas usan `balance`/`pagoMensual`/`vencimiento`. Las importaciones de documentos ahora crean deudas con ese esquema.
- Las cuentas, movimientos y metas comienzan vacíos para usuarios nuevos; la aplicación no crea datos financieros de demostración.
- Fechas de Pago muestra únicamente vencimientos de deudas registrados. Los recordatorios generales no están implementados.
- Documentos puede extraer y registrar datos, pero no almacena archivos ni ofrece una biblioteca de archivos.
- Seguridad muestra el alcance actual del acceso mediante Google. La administración de contraseña, 2FA, sesiones, exportación y eliminación de cuenta está diferida.

Las políticas de Firestore, el modelo de tenencia y colaboradores, Firebase Authentication, Storage, Gemini, precios, facturación y aspectos legales/comerciales no se modificaron en esta fase.
