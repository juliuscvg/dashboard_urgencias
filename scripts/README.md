# Scripts

- `check-baseline.mjs`: verifica integridad del baseline.
- `check-markdown-links.mjs`: valida enlaces locales.
- `check-portability.mjs`: valida manifiesto, contratos, SQL canónico y reglas de seguridad estáticas.
- `check-reconciliation.mjs`: valida la evidencia estática y la reconciliación real versionada.`r`n- `check-amed-validation.mjs`: valida consistencia, resguardo y reproducibilidad de la evidencia AMED.
- `run-source-reconciliation.mjs`: ejecuta los 14 SQL read-only, consulta API y audita el detalle con un contexto explícito; escribe sólo el archivo indicado por `--output`.
- `sql/01_*` y `sql/02_*`: descubrimiento/validación dirigida.
- `sql/indicadores/`: SQL canónico read-only por indicador aceptado.

Los scripts SQL requieren acceso autorizado. No son migraciones ni modifican datos.
- `run-motivo-validation.mjs` y `sql/07_validacion_motivo_urgencia.sql`: reproducen la validación read-only agregada de ITER-002 sin persistir valores de texto libre.
- `check-motivo-validation.mjs`: valida universos, cobertura, categorías y resguardos del artefacto de Motivo.
- `run-iter004-reconciliation.mjs`: compara los SQL aceptados de MOD-05, MOD-09 y TRI-02 con la API usando los mismos filtros.
- `check-iter004-reconciliation.mjs`: valida la evidencia, rutas, servicio y proyección UI de ITER-004.
- `run-iter005-reconciliation.mjs`: compara las bandas aceptadas de EJ-03, ACT-01 y TRI-03 con la API usando filtros y corte reproducibles.
- `check-iter005-reconciliation.mjs`: valida coincidencia exacta, invariantes de bandas/señales y proyección UI de ITER-005.
- `run-atencion-medica-validation.mjs` y `sql/08_validacion_atencion_medica.sql`: reproducen la validación agregada read-only de `fechaate` en 12/24/36 meses.
- `check-atencion-medica-validation.mjs`: valida universos, cobertura, cronología, resguardo y carácter read-only de ITER-006.
