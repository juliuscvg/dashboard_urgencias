# Scripts

- `check-baseline.mjs`: verifica integridad del baseline.
- `check-markdown-links.mjs`: valida enlaces locales.
- `check-portability.mjs`: valida manifiesto, contratos, SQL canónico y reglas de seguridad estáticas.
- `sql/01_*` y `sql/02_*`: descubrimiento/validación dirigida.
- `sql/indicadores/`: SQL canónico read-only por indicador aceptado.

Los scripts SQL requieren acceso autorizado. No son migraciones ni modifican datos.
