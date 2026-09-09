# SQL verificable por indicador

Consultas canónicas de lectura para SQL Server 2012 con nivel de compatibilidad 100. Cada archivo declara parámetros y repite explícitamente el universo para que pueda auditarse y ejecutarse de manera independiente.

- Los parámetros `@Desde`, `@Hasta`, `@Centro` y `@CodigoServicio` son suministrados por el llamador.
- `@Corte` también se requiere cuando la métrica depende del momento de observación.
- No ejecutar junto con scripts de descubrimiento como si fueran migraciones.
- La repetición del CTE se controla mediante pruebas estáticas y reconciliación; la implementación usa `event-scope.sql.ts` como única construcción runtime.
- Ningún archivo escribe en la base, crea objetos ni codifica centros o servicios.
- La existencia del SQL no equivale a reconciliación con fuente.

El vínculo indicador→archivo está en [contratos](../../../docs/indicadores/CONTRATOS_ACEPTADOS.md).
