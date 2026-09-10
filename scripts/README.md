# Scripts

- `check-baseline.mjs`: verifica integridad del baseline.
- `check-markdown-links.mjs`: valida enlaces locales.
- `check-portability.mjs`: valida manifiesto, contratos, SQL canónico y reglas de seguridad estáticas.
- `check-reconciliation.mjs`: valida la evidencia estática y la reconciliación real versionada.`r`n- `check-amed-validation.mjs`: valida consistencia, resguardo y reproducibilidad de la evidencia AMED.
- `run-source-reconciliation.mjs`: ejecuta los 14 SQL read-only, consulta API y audita el detalle con un contexto explícito; escribe sólo el archivo indicado por `--output`.
- `sql/01_*` y `sql/02_*`: descubrimiento/validación dirigida.
- `sql/indicadores/`: SQL canónico read-only por indicador aceptado.

Los scripts SQL requieren acceso autorizado. No son migraciones ni modifican datos.
